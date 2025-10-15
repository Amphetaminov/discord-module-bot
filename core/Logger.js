import chalk from 'chalk';
import config from '../config.js';

/**
 * Система логирования для бота и модулей
 */
class Logger {
    constructor(moduleName = 'CORE') {
        this.moduleName = moduleName;
        this.config = config.logging;
    }

    /**
     * Форматирует timestamp
     */
    getTimestamp() {
        if (!this.config.timestamp) return '';
        
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        return chalk.gray(`[${hours}:${minutes}:${seconds}]`);
    }

    /**
     * Форматирует имя модуля
     */
    getModuleName() {
        return chalk.cyan(`[${this.moduleName}]`);
    }

    /**
     * Основной метод логирования
     */
    log(level, message, ...args) {
        const levels = {
            debug: { priority: 0, color: chalk.gray, prefix: '🔍' },
            info: { priority: 1, color: chalk.blue, prefix: 'ℹ️' },
            success: { priority: 1, color: chalk.green, prefix: '✅' },
            warn: { priority: 2, color: chalk.yellow, prefix: '⚠️' },
            error: { priority: 3, color: chalk.red, prefix: '❌' }
        };

        const currentLevel = levels[this.config.level] || levels.info;
        const logLevel = levels[level] || levels.info;

        // Проверяем приоритет
        if (logLevel.priority < currentLevel.priority) return;

        const timestamp = this.getTimestamp();
        const moduleName = this.getModuleName();
        const prefix = logLevel.prefix;
        const coloredMessage = this.config.colors 
            ? logLevel.color(message) 
            : message;

        console.log(timestamp, moduleName, prefix, coloredMessage, ...args);
    }

    /**
     * Debug логи
     */
    debug(message, ...args) {
        this.log('debug', message, ...args);
    }

    /**
     * Info логи
     */
    info(message, ...args) {
        this.log('info', message, ...args);
    }

    /**
     * Success логи
     */
    success(message, ...args) {
        this.log('success', message, ...args);
    }

    /**
     * Warning логи
     */
    warn(message, ...args) {
        this.log('warn', message, ...args);
    }

    /**
     * Error логи
     */
    error(message, ...args) {
        this.log('error', message, ...args);
    }

    /**
     * Логирование ошибок с stack trace
     */
    errorStack(error, context = '') {
        if (context) {
            this.error(`${context}:`);
        }
        this.error(error.message);
        if (error.stack) {
            console.error(chalk.red(error.stack));
        }
    }
}

export default Logger;

