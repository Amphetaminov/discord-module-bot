import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import config from './config.js';
import Logger from './core/Logger.js';
import ModuleLoader from './core/ModuleLoader.js';
import CommandHandler from './core/CommandHandler.js';
import EventHandler from './core/EventHandler.js';

const logger = new Logger('BOT');

/**
 * Главный класс бота
 */
class DiscordBot {
    constructor() {
        this.client = null;
        this.moduleLoader = null;
        this.commandHandler = null;
        this.eventHandler = null;
    }

    /**
     * Инициализация бота
     */
    async initialize() {
        logger.info('Инициализация бота...');

        // Проверяем конфигурацию
        if (!config.token || config.token === 'YOUR_BOT_TOKEN_HERE') {
            logger.error('Токен бота не указан в config.js!');
            process.exit(1);
        }

        if (!config.clientId || config.clientId === 'YOUR_CLIENT_ID_HERE') {
            logger.error('Client ID не указан в config.js!');
            process.exit(1);
        }

        // Создаем клиент Discord
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers
            ]
        });

        // Загружаем модули
        this.moduleLoader = new ModuleLoader(this.client);
        await this.moduleLoader.loadAll();

        // Инициализируем обработчики
        this.commandHandler = new CommandHandler(this.moduleLoader);
        this.eventHandler = new EventHandler(this.client, this.moduleLoader);

        // Регистрируем события
        this.registerCoreEvents();
        this.eventHandler.registerEvents();

        // Регистрируем slash команды
        await this.registerCommands();

        // Запускаем бота
        await this.login();
    }

    /**
     * Регистрирует основные события бота
     */
    registerCoreEvents() {
        // Обработка команд
        this.client.on('interactionCreate', async (interaction) => {
            await this.commandHandler.handleInteraction(interaction);
        });

        // Событие готовности
        this.client.once('ready', () => {
            logger.success(`Бот запущен как ${this.client.user.tag}`);
            logger.info(`Серверов: ${this.client.guilds.cache.size}`);
        });

        // Обработка ошибок
        this.client.on('error', (error) => {
            logger.errorStack(error, 'Discord Client Error');
        });

        process.on('unhandledRejection', (error) => {
            logger.errorStack(error, 'Unhandled Promise Rejection');
        });
    }

    /**
     * Регистрирует slash команды в Discord
     */
    async registerCommands() {
        const commands = this.moduleLoader.getCommandsData();

        if (commands.length === 0) {
            logger.warn('Нет команд для регистрации');
            return;
        }

        const rest = new REST({ version: '10' }).setToken(config.token);

        try {
            logger.info(`Начинаю регистрацию ${commands.length} команд...`);

            if (config.guildIds && config.guildIds.length > 0 && config.guildIds[0] !== 'YOUR_GUILD_ID_HERE') {
                // Регистрация для конкретных серверов (быстро)
                for (const guildId of config.guildIds) {
                    await rest.put(
                        Routes.applicationGuildCommands(config.clientId, guildId),
                        { body: commands }
                    );
                    logger.success(`Команды зарегистрированы для сервера ${guildId}`);
                }
            } else {
                // Глобальная регистрация (до 1 часа)
                await rest.put(
                    Routes.applicationCommands(config.clientId),
                    { body: commands }
                );
                logger.success('Команды зарегистрированы глобально (может занять до 1 часа)');
            }

        } catch (error) {
            logger.errorStack(error, 'Ошибка регистрации команд');
        }
    }

    /**
     * Авторизация бота
     */
    async login() {
        try {
            await this.client.login(config.token);
        } catch (error) {
            logger.errorStack(error, 'Ошибка авторизации');
            process.exit(1);
        }
    }
}

// Запуск бота
const bot = new DiscordBot();
bot.initialize().catch((error) => {
    logger.errorStack(error, 'Критическая ошибка при запуске');
    process.exit(1);
});

