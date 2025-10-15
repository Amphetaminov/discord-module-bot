# 🚀 Деплой бота

Руководство по запуску бота на сервере в продакшене.

## Варианты хостинга

### 1. VPS/VDS (Рекомендуется)
- ✅ Полный контроль
- ✅ Любые модули
- ✅ Постоянная работа
- Примеры: DigitalOcean, Hetzner, Timeweb

### 2. Облачные платформы
- ⚠️ Могут быть ограничения
- ⚠️ Сложнее с БД
- Примеры: Heroku, Railway, Render

### 3. Локальный ПК
- ⚠️ Должен быть всегда включен
- ⚠️ Нужен белый IP для некоторых функций

---

## Деплой на VPS (Ubuntu/Debian)

### Шаг 1: Подготовка сервера

```bash
# Обновить систему
sudo apt update && sudo apt upgrade -y

# Установить Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# Установить Git
sudo apt install -y git

# Установить build tools (для better-sqlite3)
sudo apt install -y build-essential python3
```

### Шаг 2: Загрузка проекта

```bash
# Клонировать репозиторий
cd ~
git clone https://github.com/your-username/discord-module-bot.git
cd discord-module-bot

# Установить зависимости
npm install
```

### Шаг 3: Настройка

```bash
# Создать config.js
cp config.example.js config.js

# Отредактировать конфигурацию
nano config.js
```

Заполни токен и настройки, сохрани (Ctrl+O, Enter, Ctrl+X).

### Шаг 4: Запуск с PM2

```bash
# Установить PM2 глобально
sudo npm install -g pm2

# Запустить бота
pm2 start index.js --name discord-bot

# Автозапуск при перезагрузке
pm2 save
pm2 startup

# Выполни команду которую покажет pm2 startup
```

### Управление ботом

```bash
# Просмотр логов
pm2 logs discord-bot

# Перезапуск
pm2 restart discord-bot

# Остановка
pm2 stop discord-bot

# Список процессов
pm2 list

# Удалить из PM2
pm2 delete discord-bot
```

---

## Деплой на Windows Server

### Шаг 1: Установка Node.js

1. Скачай Node.js LTS с [nodejs.org](https://nodejs.org/)
2. Установи с галочкой "Add to PATH"
3. Перезагрузи PowerShell

### Шаг 2: Клонирование проекта

```powershell
# В PowerShell
cd C:\
git clone https://github.com/your-username/discord-module-bot.git
cd discord-module-bot
npm install
```

### Шаг 3: Настройка

```powershell
Copy-Item config.example.js config.js
notepad config.js
# Заполни настройки, сохрани
```

### Шаг 4: Автозапуск через Task Scheduler

1. Создай файл `start-bot.bat`:
```bat
@echo off
cd C:\discord-module-bot
npm start
```

2. Task Scheduler:
   - Создать задачу
   - Триггер: При запуске системы
   - Действие: Запустить `start-bot.bat`
   - Настройки: "Перезапускать при сбое"

### Или используй PM2 для Windows

```powershell
npm install -g pm2
pm2 start index.js --name discord-bot
pm2 save
pm2-startup install
```

---

## Деплой на Heroku (Бесплатно с ограничениями)

### ⚠️ Важно
Heroku требует специальной настройки для долгоработающих процессов.

### Шаг 1: Создание Procfile

Создай файл `Procfile` (без расширения):
```
worker: node index.js
```

### Шаг 2: Деплой

```bash
# Установить Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Логин
heroku login

# Создать приложение
heroku create your-bot-name

# Настроить переменные окружения
heroku config:set DISCORD_TOKEN=your_token_here
heroku config:set CLIENT_ID=your_client_id

# Задеплоить
git push heroku main

# Включить worker dyno
heroku ps:scale worker=1

# Просмотр логов
heroku logs --tail
```

### Шаг 3: Настройка БД

⚠️ На Heroku файловая система эфемерная! Используй addon PostgreSQL или внешнюю БД.

---

## Деплой на Railway

Railway - современная альтернатива Heroku.

### Шаг 1: Подключение GitHub

1. Зайди на [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Выбери репозиторий

### Шаг 2: Настройка

1. Variables → Добавь:
   - `DISCORD_TOKEN`
   - `CLIENT_ID`
   - `GUILD_ID`

2. Settings:
   - Start Command: `npm start`
   - Build Command: `npm install`

3. Deploy!

---

## Мониторинг и логи

### PM2 Monitoring

```bash
# Веб-интерфейс мониторинга
pm2 plus

# Или используй команды
pm2 monit        # Реалтайм мониторинг
pm2 logs         # Логи
pm2 status       # Статус процессов
```

### Логирование в файл

Измени `index.js` чтобы писать логи:

```javascript
import fs from 'fs';

// Перенаправление логов
const logStream = fs.createWriteStream('./bot.log', { flags: 'a' });
const oldConsoleLog = console.log;
console.log = (...args) => {
    oldConsoleLog(...args);
    logStream.write(args.join(' ') + '\n');
};
```

---

## Обновление бота

### На VPS с PM2

```bash
cd ~/discord-module-bot

# Получить обновления
git pull

# Установить новые зависимости (если есть)
npm install

# Перезапустить бота
pm2 restart discord-bot

# Проверить логи
pm2 logs discord-bot --lines 50
```

### Автоматическое обновление

Создай скрипт `update.sh`:

```bash
#!/bin/bash
cd ~/discord-module-bot
git pull
npm install
pm2 restart discord-bot
echo "Бот обновлен!"
```

```bash
chmod +x update.sh
./update.sh
```

---

## Безопасность

### 1. Переменные окружения

Вместо `config.js` используй `.env`:

```bash
# Установить dotenv
npm install dotenv

# Создать .env
cat > .env << EOF
DISCORD_TOKEN=your_token
CLIENT_ID=your_id
GUILD_ID=your_guild_id
EOF
```

Измени `config.js`:

```javascript
import dotenv from 'dotenv';
dotenv.config();

export default {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.CLIENT_ID,
    guildIds: [process.env.GUILD_ID],
    // ...
};
```

### 2. Файрвол

```bash
# Ubuntu UFW
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
```

### 3. Обновления системы

```bash
# Автоматические обновления безопасности
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## Резервное копирование

### Бэкап базы данных

```bash
# Скрипт backup.sh
#!/bin/bash
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR=~/backups
mkdir -p $BACKUP_DIR

# Копировать databases/
cp -r ~/discord-module-bot/databases $BACKUP_DIR/databases_$DATE

echo "Backup created: databases_$DATE"
```

```bash
chmod +x backup.sh

# Автоматический бэкап (crontab)
crontab -e
# Добавить: 0 3 * * * ~/backup.sh
```

---

## Проблемы и решения

### Бот не запускается

```bash
# Проверить логи PM2
pm2 logs discord-bot --lines 100

# Проверить статус
pm2 status

# Проверить процессы Node
ps aux | grep node
```

### Большой расход памяти

```bash
# Ограничить память PM2
pm2 start index.js --name discord-bot --max-memory-restart 500M
```

### База данных блокируется

SQLite не поддерживает множественный доступ. Если используешь кластер:
- Используй PostgreSQL или MySQL
- Или один процесс бота

---

## Продвинутая настройка

### Nginx Reverse Proxy (для веб-панели)

```nginx
server {
    listen 80;
    server_name bot.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL с Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d bot.example.com
```

---

## Мониторинг производительности

### Установка Prometheus + Grafana (опционально)

```bash
# PM2 метрики для Prometheus
pm2 install pm2-prometheus-exporter

# Grafana dashboard для мониторинга
```

---

**Бот успешно задеплоен! 🎉**

Полезные команды:
```bash
pm2 logs discord-bot     # Логи
pm2 restart discord-bot  # Перезапуск
pm2 monit                # Мониторинг
```

