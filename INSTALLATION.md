# 📦 Подробная инструкция по установке

## Требования

- **Node.js** версии 16.9.0 или выше
- **npm** или **yarn**
- **Аккаунт Discord**

## Шаг 1: Установка Node.js (если нет)

### Windows
1. Скачай с [nodejs.org](https://nodejs.org/)
2. Установи (рекомендуется LTS версия)
3. Проверь: `node --version` и `npm --version`

### Linux
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Arch Linux
sudo pacman -S nodejs npm
```

## Шаг 2: Клонирование репозитория

```bash
# Через Git
git clone <your-repo-url>
cd discord-module-bot

# Или скачай ZIP и распакуй
```

## Шаг 3: Установка зависимостей

```bash
npm install
```

Это установит:
- `discord.js` - библиотека для работы с Discord API
- `better-sqlite3` - SQLite база данных
- `chalk` - цветной вывод в консоль

### Возможные проблемы

**Windows: "python not found"**
```bash
npm install --global windows-build-tools
```

**Linux: "make: not found"**
```bash
# Ubuntu/Debian
sudo apt-get install build-essential

# Arch
sudo pacman -S base-devel
```

## Шаг 4: Создание Discord приложения

1. Открой [Discord Developer Portal](https://discord.com/developers/applications)
2. **Create Application**
3. Введи название (например, "My Bot")
4. **Create**

### Создание бота

1. Вкладка **Bot** (слева)
2. **Add Bot** → **Yes, do it!**
3. Кликни **Reset Token** → **Yes, do it!**
4. **Copy** токен (СОХРАНИ ЕГО!)

⚠️ **ВАЖНО:** Никому не показывай токен! Это как пароль от бота.

### Настройка Intents

На той же странице Bot включи:

- ✅ **Presence Intent**
- ✅ **Server Members Intent**
- ✅ **Message Content Intent**

Кликни **Save Changes**

### Получение Client ID

1. Вкладка **OAuth2** (слева)
2. Скопируй **Client ID**

## Шаг 5: Приглашение бота на сервер

### Генерация ссылки

1. Вкладка **OAuth2** → **URL Generator**
2. **Scopes:**
   - ✅ `bot`
   - ✅ `applications.commands`
3. **Bot Permissions:**
   - ✅ Read Messages/View Channels
   - ✅ Send Messages
   - ✅ Embed Links
   - ✅ Attach Files
   - ✅ Read Message History
   - ✅ Use Slash Commands
   - *(Для тестов можно выбрать Administrator)*
4. Скопируй **Generated URL** внизу
5. Открой ссылку в браузере
6. Выбери свой сервер
7. **Авторизовать**

## Шаг 6: Получение ID сервера

1. Открой Discord
2. **Настройки пользователя** → **Расширенные**
3. Включи **Режим разработчика**
4. Закрой настройки
5. ПКМ по своему серверу → **Копировать ID сервера**

## Шаг 7: Настройка config.js

Скопируй пример конфигурации:

```bash
# Windows PowerShell
Copy-Item config.example.js config.js

# Linux/Mac
cp config.example.js config.js
```

Отредактируй `config.js`:

```javascript
export default {
    // Вставь токен бота из шага 4
    token: 'MTIzNDU2Nzg5MDEyMzQ1Njc4OQ.GaBcDe.AbCdEfGhIjKlMnOpQrStUvWxYz',
    
    // Вставь Client ID из шага 4
    clientId: '1234567890123456789',
    
    // Вставь ID сервера из шага 6
    guildIds: ['9876543210987654321'],
    
    // Остальное оставь как есть
    logging: {
        level: 'info',
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

## Шаг 8: Запуск бота

```bash
npm start
```

### Ожидаемый вывод

```
[12:34:56] [ModuleLoader] ℹ️  Найдено модулей: 1
[12:34:56] [example-module] ℹ️  Загрузка модуля...
[12:34:56] [example-module] 🔍 Команда /ping загружена
[12:34:56] [example-module] 🔍 Команда /stats загружена
[12:34:56] [example-module] 🔍 Событие ready загружено
[12:34:56] [example-module] 🔍 Событие interactionCreate загружено
[12:34:56] [example-module] ✅ Модуль загружен (2 команд, 2 событий)
[12:34:56] [ModuleLoader] ✅ Загружено модулей: 1
[12:34:56] [ModuleLoader] ✅ Загружено команд: 2
[12:34:56] [ModuleLoader] ✅ Загружено событий: 2
[12:34:56] [BOT] ℹ️  Начинаю регистрацию 2 команд...
[12:34:57] [BOT] ✅ Команды зарегистрированы для сервера 9876543210987654321
[12:34:58] [BOT] ✅ Бот запущен как MyBot#1234
[12:34:58] [BOT] ℹ️  Серверов: 1
[12:34:58] [example-module] ✅ Модуль example-module инициализирован
[12:34:58] [example-module] ℹ️  Бот готов обслуживать 1 серверов
[12:34:58] [example-module] ℹ️  В базе данных 0 записей
```

### Если бот не запускается

**"Error: Invalid token"**
- Проверь токен в `config.js`
- Убедись что скопировал полностью
- Попробуй сбросить токен в Developer Portal

**"Error: Used disallowed intents"**
- Включи Intents в Developer Portal (шаг 4)
- Сохрани изменения
- Перезапусти бота

**"Module not found"**
```bash
# Переустанови зависимости
rm -rf node_modules package-lock.json
npm install
```

## Шаг 9: Тестирование

1. Открой Discord
2. На своем сервере напиши `/` в чате
3. Должны появиться команды:
   - `/ping` - Проверка задержки
   - `/stats` - Статистика
4. Вызови `/ping` - должен ответить с embed сообщением

### Если команды не появляются

1. **Подожди 1-2 минуты** (регистрация занимает время)
2. **Перезапусти Discord** (Ctrl+R или закрой/открой)
3. **Проверь права бота** на сервере
4. Если указал `guildIds` - проверь правильность ID

## Готово! 🎉

Бот работает! Теперь можешь:

- 📖 Читать [README.md](README.md)
- 📚 Изучить [MODULE_GUIDE.md](MODULE_GUIDE.md)
- 🔧 Создавать свои модули

---

## Дополнительные настройки

### Автозапуск при рестарте системы

**Windows (Task Scheduler):**
1. Создай `.bat` файл:
```bat
@echo off
cd C:\path\to\discord-module-bot
npm start
```

**Linux (systemd):**
```bash
sudo nano /etc/systemd/system/discord-bot.service
```

```ini
[Unit]
Description=Discord Module Bot
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/path/to/discord-module-bot
ExecStart=/usr/bin/npm start
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable discord-bot
sudo systemctl start discord-bot
```

### Запуск в фоне (Linux)

```bash
# С помощью pm2
npm install -g pm2
pm2 start index.js --name discord-bot
pm2 save
pm2 startup

# С помощью screen
screen -S discord-bot
npm start
# Ctrl+A, D для выхода без остановки
```

---

Нужна помощь? Создай Issue на GitHub! 🆘

