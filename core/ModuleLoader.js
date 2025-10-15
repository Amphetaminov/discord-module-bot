import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import Logger from './Logger.js';
import config from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Загрузчик модулей
 */
class ModuleLoader {
    constructor(client) {
        this.client = client;
        this.logger = new Logger('ModuleLoader');
        this.modules = new Map();
        this.commands = new Map();
        this.events = new Map();
    }

    /**
     * Загружает все модули из папки modules
     */
    async loadAll() {
        const modulesPath = path.join(process.cwd(), config.modules.directory);
        
        // Создаем папку modules если не существует
        if (!fs.existsSync(modulesPath)) {
            fs.mkdirSync(modulesPath, { recursive: true });
            this.logger.warn(`Папка ${config.modules.directory} создана`);
            return;
        }

        const moduleFolders = fs.readdirSync(modulesPath).filter(file => {
            const folderPath = path.join(modulesPath, file);
            return fs.statSync(folderPath).isDirectory();
        });

        if (moduleFolders.length === 0) {
            this.logger.warn('Модули не найдены');
            return;
        }

        this.logger.info(`Найдено модулей: ${moduleFolders.length}`);

        for (const folder of moduleFolders) {
            try {
                await this.loadModule(folder);
            } catch (error) {
                this.logger.errorStack(error, `Ошибка загрузки модуля ${folder}`);
            }
        }

        this.logger.success(`Загружено модулей: ${this.modules.size}`);
        this.logger.success(`Загружено команд: ${this.commands.size}`);
        this.logger.success(`Загружено событий: ${this.events.size}`);
    }

    /**
     * Загружает отдельный модуль
     */
    async loadModule(moduleName) {
        const modulePath = path.join(process.cwd(), config.modules.directory, moduleName);
        const moduleLogger = new Logger(moduleName);

        moduleLogger.info('Загрузка модуля...');

        // Загружаем метаданные модуля
        const metadata = this.loadModuleMetadata(modulePath, moduleName);

        // Инициализируем базу данных модуля
        const database = this.initializeDatabase(modulePath, moduleName);

        // Создаем контекст модуля
        const moduleContext = {
            name: moduleName,
            metadata,
            database,
            logger: moduleLogger,
            client: this.client
        };

        // Загружаем команды
        const commands = await this.loadCommands(modulePath, moduleContext);
        
        // Загружаем события
        const events = await this.loadEvents(modulePath, moduleContext);

        // Сохраняем модуль
        this.modules.set(moduleName, {
            ...moduleContext,
            commands,
            events
        });

        moduleLogger.success(`Модуль загружен (${commands.length} команд, ${events.length} событий)`);
    }

    /**
     * Загружает метаданные модуля из module.json
     */
    loadModuleMetadata(modulePath, moduleName) {
        const metadataPath = path.join(modulePath, 'module.json');
        
        if (!fs.existsSync(metadataPath)) {
            return {
                name: moduleName,
                version: '1.0.0',
                description: 'Нет описания'
            };
        }

        try {
            const data = fs.readFileSync(metadataPath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            this.logger.warn(`Не удалось загрузить module.json для ${moduleName}`);
            return {
                name: moduleName,
                version: '1.0.0',
                description: 'Нет описания'
            };
        }
    }

    /**
     * Инициализирует базу данных модуля
     */
    initializeDatabase(modulePath, moduleName) {
        const dbDir = path.join(process.cwd(), config.database.directory, moduleName);
        
        // Создаем папку для БД
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        const dbPath = path.join(dbDir, 'data.db');
        const db = new Database(dbPath);
        
        // Загружаем схему если есть
        const schemaPath = path.join(modulePath, 'database', 'schema.sql');
        if (fs.existsSync(schemaPath)) {
            const schema = fs.readFileSync(schemaPath, 'utf-8');
            db.exec(schema);
        }

        return db;
    }

    /**
     * Загружает команды модуля
     */
    async loadCommands(modulePath, moduleContext) {
        const commandsPath = path.join(modulePath, 'commands');
        
        if (!fs.existsSync(commandsPath)) {
            return [];
        }

        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        const commands = [];

        for (const file of commandFiles) {
            try {
                const filePath = path.join(commandsPath, file);
                const command = await import(`file://${filePath}`);
                
                if (command.default && command.default.data && command.default.execute) {
                    const commandData = command.default;
                    
                    // Добавляем контекст модуля
                    commandData.module = moduleContext.name;
                    commandData.database = moduleContext.database;
                    commandData.logger = moduleContext.logger;
                    
                    this.commands.set(commandData.data.name, commandData);
                    commands.push(commandData.data.name);
                    
                    moduleContext.logger.debug(`Команда /${commandData.data.name} загружена`);
                } else {
                    moduleContext.logger.warn(`Команда ${file} имеет неверный формат`);
                }
            } catch (error) {
                moduleContext.logger.errorStack(error, `Ошибка загрузки команды ${file}`);
            }
        }

        return commands;
    }

    /**
     * Загружает события модуля
     */
    async loadEvents(modulePath, moduleContext) {
        const eventsPath = path.join(modulePath, 'events');
        
        if (!fs.existsSync(eventsPath)) {
            return [];
        }

        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
        const events = [];

        for (const file of eventFiles) {
            try {
                const filePath = path.join(eventsPath, file);
                const event = await import(`file://${filePath}`);
                
                if (event.default && event.default.name && event.default.execute) {
                    const eventData = event.default;
                    
                    // Добавляем контекст модуля
                    eventData.module = moduleContext.name;
                    eventData.database = moduleContext.database;
                    eventData.logger = moduleContext.logger;
                    
                    // Сохраняем событие
                    if (!this.events.has(eventData.name)) {
                        this.events.set(eventData.name, []);
                    }
                    this.events.get(eventData.name).push(eventData);
                    events.push(eventData.name);
                    
                    moduleContext.logger.debug(`Событие ${eventData.name} загружено`);
                } else {
                    moduleContext.logger.warn(`Событие ${file} имеет неверный формат`);
                }
            } catch (error) {
                moduleContext.logger.errorStack(error, `Ошибка загрузки события ${file}`);
            }
        }

        return events;
    }

    /**
     * Получает все команды для регистрации
     */
    getCommandsData() {
        return Array.from(this.commands.values()).map(cmd => cmd.data.toJSON());
    }

    /**
     * Получает команду по имени
     */
    getCommand(commandName) {
        return this.commands.get(commandName);
    }

    /**
     * Получает события по имени
     */
    getEvents(eventName) {
        return this.events.get(eventName) || [];
    }

    /**
     * Получает все уникальные имена событий
     */
    getEventNames() {
        return Array.from(this.events.keys());
    }
}

export default ModuleLoader;

