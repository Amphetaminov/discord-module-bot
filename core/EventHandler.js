import Logger from './Logger.js';

/**
 * Обработчик событий Discord
 */
class EventHandler {
    constructor(client, moduleLoader) {
        this.client = client;
        this.moduleLoader = moduleLoader;
        this.logger = new Logger('EventHandler');
    }

    /**
     * Регистрирует все события из модулей
     */
    registerEvents() {
        const eventNames = this.moduleLoader.getEventNames();

        if (eventNames.length === 0) {
            this.logger.warn('События не найдены');
            return;
        }

        for (const eventName of eventNames) {
            const handlers = this.moduleLoader.getEvents(eventName);
            
            this.logger.debug(`Регистрация события: ${eventName} (${handlers.length} обработчиков)`);

            // Создаем обработчик для этого события
            const eventHandler = async (...args) => {
                for (const handler of handlers) {
                    try {
                        await handler.execute(...args);
                    } catch (error) {
                        this.logger.errorStack(
                            error, 
                            `Ошибка в обработчике события ${eventName} (модуль: ${handler.module})`
                        );
                    }
                }
            };

            // Проверяем once или on
            const isOnce = handlers.some(h => h.once);
            
            if (isOnce) {
                this.client.once(eventName, eventHandler);
            } else {
                this.client.on(eventName, eventHandler);
            }
        }

        this.logger.success(`Зарегистрировано событий: ${eventNames.length}`);
    }
}

export default EventHandler;

