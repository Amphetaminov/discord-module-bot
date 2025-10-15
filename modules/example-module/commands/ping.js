import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Проверка работы бота и задержки'),

    async execute(interaction) {
        // this.logger доступен из контекста модуля
        this.logger.info(`Команда /ping вызвана пользователем ${interaction.user.tag}`);

        const sent = await interaction.reply({ 
            content: 'Проверка задержки...', 
            fetchReply: true,
            ephemeral: true
        });

        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = Math.round(interaction.client.ws.ping);

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🏓 Понг!')
            .addFields(
                { name: '📡 Задержка бота', value: `${latency}мс`, inline: true },
                { name: '💓 API задержка', value: `${apiLatency}мс`, inline: true }
            )
            .setFooter({ text: `Модуль: ${this.module}` })
            .setTimestamp();

        await interaction.editReply({ 
            content: null, 
            embeds: [embed] 
        });

        // Пример работы с БД
        this.database.prepare(`
            INSERT INTO ping_logs (user_id, username, latency, timestamp)
            VALUES (?, ?, ?, ?)
        `).run(
            interaction.user.id,
            interaction.user.tag,
            latency,
            Date.now()
        );

        this.logger.success(`Ping: ${latency}мс (API: ${apiLatency}мс)`);
    }
};

