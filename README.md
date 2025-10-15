# 🤖 Discord Модульный Бот - Шаблон

Готовый шаблон Discord бота с модульной системой для быстрой разработки и масштабирования. Просто создавай модули - бот автоматически их подключит!

## ✨ Возможности

- 🔌 **Автозагрузка модулей** - просто закинь папку в `modules/` и всё работает
- ⚡ **Slash команды** - современный подход Discord
- 🗄️ **SQLite база данных** - каждый модуль получает свою БД
- 🎯 **События Discord** - модули могут слушать любые события
- 📝 **Продвинутое логирование** - цветные логи с отслеживанием ошибок
- 🔄 **Горячая перезагрузка команд** - без "приложение не отвечает"

## 🚀 Быстрый старт

### 1. Установка

```bash
# Клонируй репозиторий
git clone <your-repo-url>
cd discord-module-bot

# Установи зависимости
npm install
```

### 2. Настройка

Отредактируй `config.js`:

```javascript
export default {
    token: 'ВАШ_ТОКЕН_БОТА',
    clientId: 'ВАШ_CLIENT_ID',
    guildIds: ['ID_ВАШЕГО_СЕРВЕРА'], // Для быстрой регистрации команд
    // ... остальные настройки
};
```

### 3. Запуск

```bash
npm start
```

## 📁 Структура проекта

```
DISCORD MODULE BOT/
├── index.js                    # Главный файл бота
├── config.js                   # Конфигурация
├── package.json
├── core/                       # Ядро системы
│   ├── ModuleLoader.js         # Загрузчик модулей
│   ├── CommandHandler.js       # Обработчик команд
│   ├── EventHandler.js         # Обработчик событий
│   └── Logger.js               # Система логирования
├── modules/                    # Твои модули
│   └── example-module/
│       ├── module.json         # Метаданные модуля
│       ├── commands/           # Slash команды
│       │   ├── ping.js
│       │   └── stats.js
│       ├── events/             # События Discord
│       │   ├── ready.js
│       │   └── interactionCreate.js
│       └── database/
│           └── schema.sql      # SQL схема
└── databases/                  # Базы данных модулей
    └── example-module/
        └── data.db
```

## 🔧 Создание модуля

### Шаг 1: Создай структуру

```
modules/
└── my-module/              # Название модуля
    ├── module.json         # Обязательно
    ├── commands/           # Опционально
    ├── events/             # Опционально
    └── database/           # Опционально
        └── schema.sql
```

### Шаг 2: Опиши модуль (module.json)

```json
{
    "name": "my-module",
    "version": "1.0.0",
    "description": "Описание модуля",
    "author": "Твое имя"
}
```

### Шаг 3: Создай команду

`modules/my-module/commands/hello.js`:

```javascript
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Приветствие')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Твое имя')
                .setRequired(true)
        ),

    async execute(interaction) {
        // Доступен логгер модуля
        this.logger.info(`Команда /hello от ${interaction.user.tag}`);

        const name = interaction.options.getString('name');

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`Привет, ${name}!`)
            .setDescription('Добро пожаловать в мой бот!')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

        // Работа с базой данных
        this.database.prepare(`
            INSERT INTO greetings (user_id, name, timestamp)
            VALUES (?, ?, ?)
        `).run(interaction.user.id, name, Date.now());
    }
};
```

### Шаг 4: Добавь событие

`modules/my-module/events/ready.js`:

```javascript
export default {
    name: 'ready',      // Имя события Discord
    once: true,         // Один раз или постоянно

    async execute(client) {
        this.logger.success('Модуль загружен!');
        
        // Твоя логика при запуске бота
    }
};
```

### Шаг 5: Настрой базу данных (опционально)

`modules/my-module/database/schema.sql`:

```sql
CREATE TABLE IF NOT EXISTS greetings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    timestamp INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_id ON greetings(user_id);
```

## 📚 API Reference

### Контекст команды

В каждой команде доступны:

```javascript
this.module      // Название модуля
this.database    // SQLite база данных (better-sqlite3)
this.logger      // Логгер модуля
this.client      // Discord.js клиент (через interaction.client)
```

### Контекст события

В каждом событии доступны:

```javascript
this.module      // Название модуля
this.database    // SQLite база данных
this.logger      // Логгер модуля
this.client      // Discord.js клиент (первый аргумент обычно)
```

### Logger API

```javascript
this.logger.debug('Отладочная информация');
this.logger.info('Информация');
this.logger.success('Успех');
this.logger.warn('Предупреждение');
this.logger.error('Ошибка');
this.logger.errorStack(error, 'Контекст ошибки');
```

### Database API (better-sqlite3)

```javascript
// Выполнить запрос
this.database.exec(`CREATE TABLE ...`);

// Подготовленный запрос
const stmt = this.database.prepare('SELECT * FROM users WHERE id = ?');
const user = stmt.get(userId);  // Один результат
const users = stmt.all();        // Все результаты

// Вставка данных
this.database.prepare('INSERT INTO users (name) VALUES (?)').run('John');

// Транзакции
const insert = this.database.transaction((users) => {
    for (const user of users) {
        this.database.prepare('INSERT INTO users (name) VALUES (?)').run(user);
    }
});

insert(['Alice', 'Bob', 'Charlie']);
```

## 🎯 Доступные события Discord

Модули могут слушать любые события Discord.js:

- `ready` - Бот готов
- `interactionCreate` - Любое взаимодействие
- `messageCreate` - Новое сообщение
- `guildMemberAdd` - Новый участник сервера
- `guildMemberRemove` - Участник покинул сервер
- `messageDelete` - Сообщение удалено
- `messageUpdate` - Сообщение отредактировано
- `guildCreate` - Бот добавлен на сервер
- И многие другие... [Полный список](https://discord.js.org/#/docs/discord.js/main/class/Client)

## 💡 Примеры использования

### Пример: Система приветствий

`modules/welcome/events/guildMemberAdd.js`:

```javascript
import { EmbedBuilder } from 'discord.js';

export default {
    name: 'guildMemberAdd',
    once: false,

    async execute(member) {
        this.logger.info(`Новый участник: ${member.user.tag}`);

        const channel = member.guild.systemChannel;
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('🎉 Новый участник!')
            .setDescription(`Добро пожаловать, ${member}!`)
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp();

        await channel.send({ embeds: [embed] });

        // Сохранить в БД
        this.database.prepare(`
            INSERT INTO welcome_logs (user_id, username, guild_id, timestamp)
            VALUES (?, ?, ?, ?)
        `).run(member.id, member.user.tag, member.guild.id, Date.now());
    }
};
```

### Пример: Команда с кнопками

```javascript
import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Создать голосование'),

    async execute(interaction) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('vote_yes')
                    .setLabel('👍 За')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('vote_no')
                    .setLabel('👎 Против')
                    .setStyle(ButtonStyle.Danger)
            );

        await interaction.reply({
            content: '📊 Голосование началось!',
            components: [row]
        });
    }
};
```

### Пример: Взаимодействие между модулями

Модули могут взаимодействовать через общий `client`:

```javascript
// В модуле A
export default {
    data: new SlashCommandBuilder()
        .setName('senddata')
        .setDescription('Отправить данные'),

    async execute(interaction) {
        // Сохраняем данные в client (глобально)
        interaction.client.sharedData = interaction.client.sharedData || {};
        interaction.client.sharedData.moduleA = { value: 123 };
        
        await interaction.reply('Данные отправлены!');
    }
};

// В модуле B
export default {
    data: new SlashCommandBuilder()
        .setName('getdata')
        .setDescription('Получить данные'),

    async execute(interaction) {
        const data = interaction.client.sharedData?.moduleA;
        await interaction.reply(`Данные: ${JSON.stringify(data)}`);
    }
};
```

## ⚙️ Конфигурация

### Основная конфигурация (config.js)

```javascript
export default {
    token: 'YOUR_BOT_TOKEN',
    clientId: 'YOUR_CLIENT_ID',
    guildIds: ['GUILD_ID'],  // Для быстрой регистрации
    
    logging: {
        level: 'info',       // debug | info | warn | error
        timestamp: true,
        colors: true
    },
    
    modules: {
        directory: './modules',
        autoLoad: true
    },
    
    database: {
        directory: './databases'
    }
};
```

### Как получить токен и ID?

1. Перейди на [Discord Developer Portal](https://discord.com/developers/applications)
2. Создай новое приложение
3. Во вкладке "Bot" создай бота и скопируй токен
4. Во вкладке "OAuth2" скопируй Client ID
5. В настройках сервера (Developer Mode включен) -> ПКМ -> Скопировать ID

## 🐛 Отладка

### Логи

Система автоматически логирует:
- ✅ Загрузку модулей
- ✅ Регистрацию команд
- ✅ Выполнение команд
- ❌ Ошибки в модулях
- ❌ Ошибки Discord API

### Уровни логирования

В `config.js` измени `logging.level`:

```javascript
logging: {
    level: 'debug'  // Показывает все логи для отладки
}
```

### Типичные ошибки

**Команда не регистрируется:**
- Проверь формат файла команды (data + execute)
- Проверь что файл экспортирует `export default`
- Проверь логи при загрузке модуля

**База данных не работает:**
- Проверь наличие `database/schema.sql`
- Проверь SQL синтаксис
- База создается автоматически в `databases/module-name/`

**Событие не срабатывает:**
- Проверь правильность имени события
- Проверь что боту хватает прав/intents
- Добавь логи в `execute()` для проверки

## 📦 Готовые модули

Планируется создание библиотеки готовых модулей:
- Система тикетов
- Модерация
- Статистика сервера
- Экономика
- Музыка
- И многое другое...

## 🤝 Вклад в проект

Создавай свои модули и делись ими! Это шаблон для сообщества.

## 📄 Лицензия

MIT License - делай что хочешь!

## 🔗 Полезные ссылки

- [Discord.js Документация](https://discord.js.org/)
- [Better-SQLite3 Документация](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md)
- [Discord Developer Portal](https://discord.com/developers/applications)

---

**Удачи в разработке! 🚀**

