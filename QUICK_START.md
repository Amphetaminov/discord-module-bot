# ⚡ Быстрый старт

## 1. Установка (5 минут)

```bash
# Установи зависимости
npm install
```

## 2. Получение токена Discord (2 минуты)

1. Открой [Discord Developer Portal](https://discord.com/developers/applications)
2. Нажми **New Application** → Введи имя → Create
3. Вкладка **Bot** → **Add Bot** → Скопируй **Token**
4. Включи **Privileged Gateway Intents**:
   - ✅ Presence Intent
   - ✅ Server Members Intent
   - ✅ Message Content Intent
5. Вкладка **OAuth2** → Скопируй **Application ID** (это твой Client ID)

## 3. Добавление бота на сервер

1. Вкладка **OAuth2** → **URL Generator**
2. Выбери Scopes:
   - ✅ bot
   - ✅ applications.commands
3. Выбери Bot Permissions:
   - ✅ Send Messages
   - ✅ Embed Links
   - ✅ Read Message History
   - ✅ Use Slash Commands
4. Скопируй сгенерированный URL и открой в браузере
5. Выбери свой сервер → Авторизовать

## 4. Настройка бота (1 минута)

Отредактируй файл `config.js`:

```javascript
export default {
    token: 'ВСТАВЬ_СВОЙ_ТОКЕН_СЮДА',
    clientId: 'ВСТАВЬ_CLIENT_ID_СЮДА',
    guildIds: ['ВСТАВЬ_ID_СЕРВЕРА_СЮДА'], // ПКМ по серверу → Копировать ID
    // остальное оставь как есть
};
```

### Как получить ID сервера?

1. В Discord включи **Режим разработчика**: Настройки → Расширенные → Режим разработчика
2. ПКМ по своему серверу → **Копировать ID сервера**

## 5. Запуск (5 секунд)

```bash
npm start
```

Должен появиться лог:
```
[HH:MM:SS] [ModuleLoader] ℹ️ Найдено модулей: 1
[HH:MM:SS] [example-module] ℹ️ Загрузка модуля...
[HH:MM:SS] [example-module] ✅ Модуль загружен (2 команд, 2 событий)
[HH:MM:SS] [BOT] ✅ Бот запущен как YourBot#1234
```

## 6. Проверка

На своем Discord сервере напиши `/` и увидишь команды:
- `/ping` - Проверка работы
- `/stats` - Статистика

Готово! 🎉

---

## Что дальше?

- 📖 Читай [README.md](README.md) для полного обзора
- 📚 Изучи [MODULE_GUIDE.md](MODULE_GUIDE.md) для создания своих модулей
- 🔧 Создавай свои модули в папке `modules/`

## Частые проблемы

### Бот не отвечает на команды

1. Проверь что бот онлайн в Discord
2. Подожди 1-2 минуты (команды регистрируются)
3. Перезапусти Discord (Ctrl+R)
4. Проверь логи на ошибки

### "DiscordAPIError: Missing Access"

Бот не имеет нужных прав. Добавь боту роль с правами администратора (для тестов).

### "Invalid Token"

Проверь что скопировал токен правильно из Developer Portal → Bot → Reset Token

### Команды не появляются

- Если указал `guildIds` - подожди 1-2 минуты
- Если не указал (глобально) - подожди до 1 часа
- Перезапусти Discord (Ctrl+R)

---

**Нужна помощь?** Проверь логи - там всё подробно написано! 🐛

