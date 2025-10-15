# 🤖 Discord Модульный Бот - Готовый Шаблон

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)
![Discord.js](https://img.shields.io/badge/Discord.js-v14-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux-lightgrey)

**Готовый шаблон модульного Discord бота с автозагрузкой плагинов**

[Быстрый старт](#-быстрый-старт) • [Документация](#-документация) • [Примеры](#-примеры) • [Вклад](#-вклад)

</div>

---

## ✨ Возможности

- 🔌 **Автозагрузка модулей** - создал папку → бот подхватил
- ⚡ **Slash команды Discord** - современный подход
- 🗄️ **SQLite база для каждого модуля** - изолированное хранение данных
- 🎯 **Система событий** - слушай любые события Discord
- 📝 **Продвинутое логирование** - цветные логи с отслеживанием ошибок
- 🔄 **Без "приложение не отвечает"** - правильная регистрация команд
- 📚 **Подробная документация** - на русском языке

## 🚀 Быстрый старт

```bash
# 1. Клонируй репозиторий
git clone https://github.com/your-username/discord-module-bot.git
cd discord-module-bot

# 2. Установи зависимости
npm install

# 3. Настрой конфигурацию
cp config.example.js config.js
# Отредактируй config.js - добавь токен Discord

# 4. Запусти
npm start
```

**Готово!** Бот работает с примером модуля и командами `/ping` и `/stats`

Подробнее: [QUICK_START.md](QUICK_START.md)

## 📁 Структура проекта

```
discord-module-bot/
├── index.js              # Главный файл
├── config.js             # Конфигурация
├── core/                 # Ядро системы
│   ├── ModuleLoader.js   # Автозагрузка модулей
│   ├── CommandHandler.js # Обработка команд
│   ├── EventHandler.js   # Обработка событий
│   └── Logger.js         # Логирование
├── modules/              # Твои модули
│   └── example-module/   # Пример
│       ├── commands/     # Slash команды
│       ├── events/       # События Discord
│       └── database/     # SQL схема
└── databases/            # SQLite базы (создаются автоматически)
```

## 🎮 Пример модуля

Создай модуль за 2 минуты:

### 1. Структура

```
modules/
└── my-module/
    ├── module.json
    ├── commands/
    │   └── hello.js
    └── database/
        └── schema.sql
```

### 2. Команда (commands/hello.js)

```javascript
import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Приветствие'),

    async execute(interaction) {
        // Логирование
        this.logger.info(`Команда от ${interaction.user.tag}`);

        // Ответ
        await interaction.reply('Привет! 👋');

        // Работа с БД
        this.database.prepare('INSERT INTO greets (user_id) VALUES (?)').run(interaction.user.id);
    }
};
```

### 3. Готово!

Перезапусти бота - модуль загрузится автоматически. Команда `/hello` готова!

## 📚 Документация

| Документ | Описание |
|----------|----------|
| [README.md](README.md) | Основная документация |
| [QUICK_START.md](QUICK_START.md) | Запуск за 5 минут |
| [MODULE_GUIDE.md](MODULE_GUIDE.md) | Создание модулей |
| [INSTALLATION.md](INSTALLATION.md) | Подробная установка |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | Архитектура |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Деплой на сервер |

## 🎯 Примеры использования

### Команда с опциями

```javascript
data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Забанить пользователя')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('Кого банить')
            .setRequired(true)
    ),

async execute(interaction) {
    const user = interaction.options.getUser('user');
    await interaction.reply(`${user} забанен!`);
}
```

### События Discord

```javascript
export default {
    name: 'guildMemberAdd',
    
    async execute(member) {
        const channel = member.guild.systemChannel;
        await channel.send(`Добро пожаловать, ${member}! 🎉`);
    }
};
```

### Работа с БД

```javascript
// SELECT
const user = this.database.prepare('SELECT * FROM users WHERE id = ?').get(userId);

// INSERT
this.database.prepare('INSERT INTO users (id, name) VALUES (?, ?)').run(userId, name);

// UPDATE
this.database.prepare('UPDATE users SET coins = coins + ? WHERE id = ?').run(100, userId);
```

## 🛠️ Технологии

- **[Discord.js v14](https://discord.js.org/)** - библиотека Discord API
- **[Better-SQLite3](https://github.com/WiseLibs/better-sqlite3)** - быстрая SQLite база
- **[Chalk](https://github.com/chalk/chalk)** - цветной вывод в консоль
- **Node.js 16+** - среда выполнения

## 💡 Идеи для модулей

Что можно создать:

- 🎫 Система тикетов (поддержка)
- 🛡️ Модерация (баны, муты, варны)
- 💰 Экономика с магазином
- 📊 Статистика сервера
- 🎮 Игры (викторины, казино)
- 🎵 Музыкальный плеер
- ⚙️ Утилиты (опросы, напоминания)
- 📈 Система уровней и рангов

## 🤝 Вклад

Хочешь помочь проекту?

- 🐛 Нашел баг? [Создай Issue](https://github.com/your-username/discord-module-bot/issues)
- 💡 Есть идея? [Обсуди в Discussions](https://github.com/your-username/discord-module-bot/discussions)
- 🔧 Создал модуль? Поделись!
- 📖 Улучши документацию

Читай [CONTRIBUTING.md](CONTRIBUTING.md)

## 📜 Лицензия

MIT License - используй как хочешь!

## 🔗 Полезные ссылки

- [Discord Developer Portal](https://discord.com/developers/applications) - создание бота
- [Discord.js Guide](https://discordjs.guide/) - документация Discord.js
- [Discord.js Documentation](https://discord.js.org/#/docs/discord.js/main/general/welcome) - API reference
- [Better-SQLite3 Docs](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md) - работа с БД

## ⭐ Star History

Если проект полезен - поставь звезду! ⭐

## 👨‍💻 Автор

Создано как шаблон для сообщества Discord разработчиков

## 📞 Поддержка

- 📖 [Документация](README.md)
- 💬 [GitHub Discussions](https://github.com/your-username/discord-module-bot/discussions)
- 🐛 [Issues](https://github.com/your-username/discord-module-bot/issues)

---

<div align="center">

**Сделано с ❤️ для Discord сообщества**

[⬆️ Наверх](#-discord-модульный-бот---готовый-шаблон)

</div>

