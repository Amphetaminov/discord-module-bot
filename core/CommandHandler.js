import Logger from './Logger.js';

/**
 * Обработчик slash команд
 */
class CommandHandler {
    constructor(moduleLoader) {
        this.moduleLoader = moduleLoader;
        this.logger = new Logger('CommandHandler');
    }

    /**
     * Обрабатывает interaction
     */
    async handleInteraction(interaction) {
        // Проверяем что это команда
        if (!interaction.isChatInputCommand()) return;

        const command = this.moduleLoader.getCommand(interaction.commandName);

        if (!command) {
            this.logger.warn(`Команда /${interaction.commandName} не найдена`);
            return;
        }

        try {
            this.logger.debug(
                `Команда /${interaction.commandName} вызвана пользователем ${interaction.user.tag}`
            );

            await command.execute(interaction);
            
        } catch (error) {
            this.logger.errorStack(error, `Ошибка выполнения команды /${interaction.commandName}`);

            // Отправляем сообщение об ошибке пользователю
            const errorMessage = {
                content: '❌ Произошла ошибка при выполнении команды!',
                ephemeral: true
            };

            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(errorMessage);
                } else {
                    await interaction.reply(errorMessage);
                }
            } catch (replyError) {
                this.logger.error('Не удалось отправить сообщение об ошибке');
            }
        }
    }
}

export default CommandHandler;

