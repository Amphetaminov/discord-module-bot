export default {
    name: 'interactionCreate',
    once: false,

    async execute(interaction) {
        // Этот обработчик будет вызываться для всех interaction
        // Можно использовать для логирования, аналитики и т.д.
        
        if (interaction.isChatInputCommand()) {
            this.logger.debug(
                `Interaction: команда /${interaction.commandName} от ${interaction.user.tag} на сервере ${interaction.guild?.name || 'DM'}`
            );
        }
    }
};

