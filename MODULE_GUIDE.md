# 📖 Руководство по разработке модулей

Полное руководство по созданию модулей для Discord модульного бота.

## 📋 Оглавление

1. [Структура модуля](#структура-модуля)
2. [Команды](#команды)
3. [События](#события)
4. [База данных](#база-данных)
5. [Логирование](#логирование)
6. [Продвинутые техники](#продвинутые-техники)
7. [Лучшие практики](#лучшие-практики)

---

## Структура модуля

### Минимальная структура

```
modules/
└── my-module/
    └── module.json
```

### Полная структура

```
modules/
└── my-module/
    ├── module.json          # Обязательно: метаданные
    ├── commands/            # Опционально: slash команды
    │   ├── command1.js
    │   └── command2.js
    ├── events/              # Опционально: обработчики событий
    │   ├── ready.js
    │   └── messageCreate.js
    └── database/            # Опционально: SQL схема
        └── schema.sql
```

### module.json

```json
{
    "name": "my-module",
    "version": "1.0.0",
    "description": "Описание модуля",
    "author": "Твое имя",
    "dependencies": []
}
```

---

## Команды

### Базовая команда

```javascript
import { SlashCommandBuilder } from 'discord.js';

export default {
    // Описание команды для Discord
    data: new SlashCommandBuilder()
        .setName('mycommand')
        .setDescription('Описание команды'),

    // Функция выполнения
    async execute(interaction) {
        await interaction.reply('Привет!');
    }
};
```

### Команда с опциями

```javascript
import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Забанить пользователя')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Пользователь для бана')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Причина бана')
                .setRequired(false)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'Не указана';

        this.logger.info(`Бан пользователя ${user.tag} по причине: ${reason}`);

        await interaction.reply(`Пользователь ${user} забанен!`);
    }
};
```

### Типы опций

```javascript
.addStringOption()      // Текст
.addIntegerOption()     // Целое число
.addNumberOption()      // Число с плавающей точкой
.addBooleanOption()     // true/false
.addUserOption()        // Упоминание пользователя
.addChannelOption()     // Канал
.addRoleOption()        // Роль
.addMentionableOption() // Пользователь или роль
.addAttachmentOption()  // Файл
```

### Команда с выбором (choices)

```javascript
data: new SlashCommandBuilder()
    .setName('language')
    .setDescription('Выбрать язык')
    .addStringOption(option =>
        option.setName('lang')
            .setDescription('Язык интерфейса')
            .setRequired(true)
            .addChoices(
                { name: 'Русский', value: 'ru' },
                { name: 'English', value: 'en' },
                { name: 'Español', value: 'es' }
            )
    ),

async execute(interaction) {
    const lang = interaction.options.getString('lang');
    await interaction.reply(`Выбран язык: ${lang}`);
}
```

### Команда с подкомандами

```javascript
data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Настройки')
    .addSubcommand(subcommand =>
        subcommand
            .setName('view')
            .setDescription('Посмотреть настройки')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('reset')
            .setDescription('Сбросить настройки')
    ),

async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'view') {
        await interaction.reply('Показываю настройки...');
    } else if (subcommand === 'reset') {
        await interaction.reply('Настройки сброшены!');
    }
}
```

### Команда с Embed

```javascript
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Информация о сервере'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(interaction.guild.name)
            .setThumbnail(interaction.guild.iconURL())
            .addFields(
                { name: '👥 Участников', value: `${interaction.guild.memberCount}`, inline: true },
                { name: '📅 Создан', value: interaction.guild.createdAt.toLocaleDateString('ru-RU'), inline: true },
                { name: '👑 Владелец', value: `<@${interaction.guild.ownerId}>`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `Модуль: ${this.module}` });

        await interaction.reply({ embeds: [embed] });
    }
};
```

### Команда с кнопками

```javascript
import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('confirm')
        .setDescription('Подтверждение действия'),

    async execute(interaction) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('confirm_yes')
                    .setLabel('Да')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('confirm_no')
                    .setLabel('Нет')
                    .setStyle(ButtonStyle.Danger)
            );

        await interaction.reply({
            content: 'Вы уверены?',
            components: [row]
        });
    }
};
```

### Отложенный ответ (для долгих операций)

```javascript
async execute(interaction) {
    // Откладываем ответ (показывает "думает...")
    await interaction.deferReply();

    // Долгая операция
    await someHeavyTask();

    // Отправляем ответ
    await interaction.editReply('Готово!');
}
```

---

## События

### Базовое событие

```javascript
export default {
    name: 'ready',           // Имя события Discord
    once: true,              // Один раз или постоянно

    async execute(client) {
        this.logger.info('Модуль готов!');
    }
};
```

### Событие с несколькими параметрами

```javascript
export default {
    name: 'messageUpdate',
    once: false,

    async execute(oldMessage, newMessage) {
        if (oldMessage.content === newMessage.content) return;

        this.logger.info(`Сообщение изменено: ${oldMessage.content} -> ${newMessage.content}`);
    }
};
```

### Популярные события

#### ready - Бот запущен

```javascript
export default {
    name: 'ready',
    once: true,

    async execute(client) {
        this.logger.success(`Залогинен как ${client.user.tag}`);
    }
};
```

#### messageCreate - Новое сообщение

```javascript
export default {
    name: 'messageCreate',
    once: false,

    async execute(message) {
        if (message.author.bot) return;

        if (message.content.toLowerCase().includes('привет')) {
            await message.reply('Привет! 👋');
        }
    }
};
```

#### guildMemberAdd - Новый участник

```javascript
import { EmbedBuilder } from 'discord.js';

export default {
    name: 'guildMemberAdd',
    once: false,

    async execute(member) {
        const channel = member.guild.systemChannel;
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('Добро пожаловать!')
            .setDescription(`${member} присоединился к серверу!`)
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp();

        await channel.send({ embeds: [embed] });
    }
};
```

#### interactionCreate - Обработка взаимодействий

```javascript
export default {
    name: 'interactionCreate',
    once: false,

    async execute(interaction) {
        // Кнопки
        if (interaction.isButton()) {
            if (interaction.customId === 'my_button') {
                await interaction.reply('Кнопка нажата!');
            }
        }

        // Выпадающие меню
        if (interaction.isStringSelectMenu()) {
            const selected = interaction.values[0];
            await interaction.reply(`Выбрано: ${selected}`);
        }

        // Модальные окна
        if (interaction.isModalSubmit()) {
            const input = interaction.fields.getTextInputValue('my_input');
            await interaction.reply(`Введено: ${input}`);
        }
    }
};
```

---

## База данных

### Автоматическая инициализация

Создай `database/schema.sql`:

```sql
-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    coins INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_user_id ON users(user_id);
```

### Операции с БД

#### SELECT - Чтение

```javascript
// Один результат
const user = this.database.prepare('SELECT * FROM users WHERE user_id = ?').get(userId);

// Все результаты
const allUsers = this.database.prepare('SELECT * FROM users').all();

// С параметрами
const richUsers = this.database.prepare('SELECT * FROM users WHERE coins > ?').all(1000);
```

#### INSERT - Вставка

```javascript
this.database.prepare(`
    INSERT INTO users (user_id, username, created_at)
    VALUES (?, ?, ?)
`).run(userId, username, Date.now());

// Получить ID вставленной записи
const info = this.database.prepare('INSERT INTO users (...) VALUES (...)').run(...);
console.log(info.lastInsertRowid);
```

#### UPDATE - Обновление

```javascript
this.database.prepare(`
    UPDATE users SET coins = coins + ? WHERE user_id = ?
`).run(amount, userId);
```

#### DELETE - Удаление

```javascript
this.database.prepare('DELETE FROM users WHERE user_id = ?').run(userId);
```

### Транзакции

```javascript
const insertMany = this.database.transaction((users) => {
    const insert = this.database.prepare('INSERT INTO users (user_id, username, created_at) VALUES (?, ?, ?)');
    
    for (const user of users) {
        insert.run(user.id, user.name, Date.now());
    }
});

// Использование
insertMany([
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' }
]);
```

### Пример: Экономическая система

```javascript
// commands/balance.js
export default {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Проверить баланс'),

    async execute(interaction) {
        let user = this.database.prepare('SELECT * FROM users WHERE user_id = ?').get(interaction.user.id);

        if (!user) {
            // Создаем нового пользователя
            this.database.prepare(`
                INSERT INTO users (user_id, username, coins, created_at)
                VALUES (?, ?, ?, ?)
            `).run(interaction.user.id, interaction.user.tag, 0, Date.now());

            user = { coins: 0 };
        }

        await interaction.reply(`💰 Ваш баланс: ${user.coins} монет`);
    }
};
```

---

## Логирование

### Уровни логов

```javascript
this.logger.debug('Отладочная информация');   // 🔍 Серый
this.logger.info('Информация');               // ℹ️ Синий
this.logger.success('Успех');                 // ✅ Зеленый
this.logger.warn('Предупреждение');           // ⚠️ Желтый
this.logger.error('Ошибка');                  // ❌ Красный
```

### Логирование ошибок

```javascript
try {
    await riskyOperation();
} catch (error) {
    this.logger.errorStack(error, 'Контекст ошибки');
}
```

### Пример логирования в команде

```javascript
async execute(interaction) {
    this.logger.info(`Команда вызвана пользователем ${interaction.user.tag}`);
    
    try {
        // Логика команды
        this.logger.success('Команда выполнена успешно');
    } catch (error) {
        this.logger.errorStack(error, 'Ошибка выполнения команды');
        throw error; // Для обработки в CommandHandler
    }
}
```

---

## Продвинутые техники

### Взаимодействие между модулями

```javascript
// Модуль A: Сохраняет данные
interaction.client.moduleData = interaction.client.moduleData || {};
interaction.client.moduleData.economy = {
    getBalance: (userId) => this.database.prepare('SELECT coins FROM users WHERE user_id = ?').get(userId)
};

// Модуль B: Использует данные модуля A
const economyModule = interaction.client.moduleData?.economy;
if (economyModule) {
    const balance = economyModule.getBalance(userId);
}
```

### Кастомные коллекторы (collectors)

```javascript
async execute(interaction) {
    await interaction.reply('Напиши что-нибудь в течение 30 секунд!');

    const filter = m => m.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, time: 30000, max: 1 });

    collector.on('collect', async (message) => {
        await interaction.followUp(`Ты написал: ${message.content}`);
        
        // Сохранить в БД
        this.database.prepare('INSERT INTO responses (user_id, response, timestamp) VALUES (?, ?, ?)').run(
            message.author.id,
            message.content,
            Date.now()
        );
    });

    collector.on('end', collected => {
        if (collected.size === 0) {
            interaction.followUp('Время вышло!');
        }
    });
}
```

### Пагинация с кнопками

```javascript
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

async execute(interaction) {
    const items = this.database.prepare('SELECT * FROM items').all();
    const itemsPerPage = 5;
    let currentPage = 0;
    const totalPages = Math.ceil(items.length / itemsPerPage);

    const getEmbed = (page) => {
        const start = page * itemsPerPage;
        const pageItems = items.slice(start, start + itemsPerPage);

        return new EmbedBuilder()
            .setTitle('Список предметов')
            .setDescription(pageItems.map(i => `${i.name} - ${i.price}💰`).join('\n'))
            .setFooter({ text: `Страница ${page + 1} из ${totalPages}` });
    };

    const getButtons = (page) => new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('prev')
                .setLabel('◀️ Назад')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === 0),
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel('Вперед ▶️')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === totalPages - 1)
        );

    const message = await interaction.reply({
        embeds: [getEmbed(currentPage)],
        components: [getButtons(currentPage)],
        fetchReply: true
    });

    const collector = message.createMessageComponentCollector({ time: 60000 });

    collector.on('collect', async (i) => {
        if (i.user.id !== interaction.user.id) {
            return i.reply({ content: 'Это не твоя команда!', ephemeral: true });
        }

        if (i.customId === 'prev') currentPage--;
        if (i.customId === 'next') currentPage++;

        await i.update({
            embeds: [getEmbed(currentPage)],
            components: [getButtons(currentPage)]
        });
    });
}
```

---

## Лучшие практики

### ✅ DO - Делай так

```javascript
// Логируй важные действия
this.logger.info(`Пользователь ${user.tag} выполнил действие`);

// Проверяй права
if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
    return interaction.reply({ content: 'Нет прав!', ephemeral: true });
}

// Обрабатывай ошибки
try {
    await riskyOperation();
} catch (error) {
    this.logger.errorStack(error);
    await interaction.reply({ content: 'Ошибка!', ephemeral: true });
}

// Используй ephemeral для приватных ответов
await interaction.reply({ content: 'Только ты видишь это', ephemeral: true });
```

### ❌ DON'T - Не делай так

```javascript
// Не игнорируй ошибки
await interaction.reply('OK'); // Без try-catch

// Не храни токены в коде
const token = 'MTIzNDU2Nzg5MA.GHI...'; // НИКОГДА!

// Не спамь API
for (let i = 0; i < 1000; i++) {
    await channel.send('spam'); // Rate limit!
}

// Не забывай отвечать на interaction
// interaction.reply() ОБЯЗАТЕЛЕН!
```

### Производительность

```javascript
// Используй prepared statements для повторяющихся запросов
const getUser = this.database.prepare('SELECT * FROM users WHERE user_id = ?');

for (const id of userIds) {
    const user = getUser.get(id); // Быстрее каждый раз
}

// Используй транзакции для множественных вставок
const insertMany = this.database.transaction((items) => {
    const insert = this.database.prepare('INSERT INTO items (name) VALUES (?)');
    for (const item of items) insert.run(item);
});
```

### Безопасность

```javascript
// НИКОГДА не используй конкатенацию для SQL
// ПЛОХО:
this.database.exec(`SELECT * FROM users WHERE id = ${userId}`); // SQL injection!

// ХОРОШО:
this.database.prepare('SELECT * FROM users WHERE id = ?').get(userId);

// Проверяй input пользователя
const username = interaction.options.getString('name');
if (username.length > 32) {
    return interaction.reply('Имя слишком длинное!');
}
```

---

## 🎓 Заключение

Теперь ты знаешь все для создания мощных модулей! Экспериментируй, создавай и делись своими модулями с сообществом.

Удачи! 🚀

