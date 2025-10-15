export default {
    name: 'ready',
    once: true,

    async execute(client) {
        // this.logger доступен из контекста модуля
        this.logger.success(`Модуль ${this.module} инициализирован`);
        this.logger.info(`Бот готов обслуживать ${client.guilds.cache.size} серверов`);

        // Пример работы с БД при старте
        const logsCount = this.database.prepare('SELECT COUNT(*) as count FROM ping_logs').get();
        this.logger.info(`В базе данных ${logsCount.count} записей`);
    }
};

