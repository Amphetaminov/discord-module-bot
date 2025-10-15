import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Показывает статистику использования команды /ping'),

    async execute(interaction) {
        this.logger.info(`Команда /stats вызвана пользователем ${interaction.user.tag}`);

        // Получаем статистику из БД
        const totalPings = this.database.prepare('SELECT COUNT(*) as count FROM ping_logs').get();
        const userPings = this.database.prepare('SELECT COUNT(*) as count FROM ping_logs WHERE user_id = ?').get(interaction.user.id);
        const avgLatency = this.database.prepare('SELECT AVG(latency) as avg FROM ping_logs').get();
        const lastPings = this.database.prepare('SELECT username, latency, timestamp FROM ping_logs ORDER BY timestamp DESC LIMIT 5').all();

        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('📊 Статистика команды /ping')
            .addFields(
                { name: '🌍 Всего использований', value: `${totalPings.count}`, inline: true },
                { name: '👤 Ваших использований', value: `${userPings.count}`, inline: true },
                { name: '⚡ Средняя задержка', value: `${Math.round(avgLatency.avg)}мс`, inline: true }
            )
            .setFooter({ text: `Модуль: ${this.module}` })
            .setTimestamp();

        if (lastPings.length > 0) {
            const lastPingsText = lastPings.map(log => {
                const date = new Date(log.timestamp);
                return `\`${log.username}\` - ${log.latency}мс (${date.toLocaleString('ru-RU')})`;
            }).join('\n');

            embed.addFields({ 
                name: '📜 Последние 5 использований', 
                value: lastPingsText 
            });
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};

