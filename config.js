/**
 * Основная конфигурация бота
 */
export default {
    // Токен Discord бота (получить на https://discord.com/developers/applications)
    token: 'YOUR_BOT_TOKEN_HERE',
    
    // ID клиента (Application ID)
    clientId: 'YOUR_CLIENT_ID_HERE',
    
    // ID серверов на которых работает бот (для быстрой регистрации команд)
    // Оставь пустым [] для глобальной регистрации (занимает до 1 часа)
    guildIds: ['YOUR_GUILD_ID_HERE'],
    
    // Настройки логирования
    logging: {
        // Уровни: 'debug', 'info', 'warn', 'error'
        level: 'info',
        
        // Показывать timestamp
        timestamp: true,
        
        // Цветной вывод
        colors: true
    },
    
    // Настройки модулей
    modules: {
        // Папка с модулями
        directory: './modules',
        
        // Автоматически загружать все модули
        autoLoad: true
    },
    
    // Настройки базы данных
    database: {
        // Папка для баз данных модулей
        directory: './databases'
    }
};

