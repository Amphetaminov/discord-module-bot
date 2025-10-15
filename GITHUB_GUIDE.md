# 📤 Как залить проект на GitHub

## Шаг 1: Создание репозитория на GitHub

1. Зайди на [github.com](https://github.com)
2. Нажми **New repository** (зеленая кнопка)
3. Заполни:
   - **Repository name:** `discord-module-bot` (или свое название)
   - **Description:** `Модульный Discord бот с автозагрузкой плагинов`
   - **Public** или **Private** - на твой выбор
   - ❌ НЕ ставь галочки на "Initialize with README" (у нас уже есть)
4. Нажми **Create repository**

## Шаг 2: Инициализация Git локально

Открой терминал в папке проекта и выполни:

```bash
# Инициализировать Git репозиторий
git init

# Добавить все файлы
git add .

# Первый коммит
git commit -m "Initial commit: Discord модульный бот"
```

## Шаг 3: Привязка к GitHub

GitHub покажет тебе команды после создания репозитория. Выполни:

```bash
# Добавить remote (замени YOUR_USERNAME и YOUR_REPO на свои)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Указать главную ветку
git branch -M main

# Запушить код
git push -u origin main
```

**Пример:**
```bash
git remote add origin https://github.com/IvanPetrov/discord-module-bot.git
git branch -M main
git push -u origin main
```

## Шаг 4: Настройка README для GitHub

После пуша:

1. Переименуй `README_GITHUB.md` в основной README:

```bash
# Windows PowerShell
Move-Item README_GITHUB.md README.md -Force

# Linux/Mac
mv README_GITHUB.md README.md
```

2. Закоммить изменения:

```bash
git add README.md
git commit -m "Update README for GitHub"
git push
```

Или используй текущий `README.md` - он тоже отличный!

## Шаг 5: Настройка репозитория на GitHub

### Добавь Topics/Tags

В репозитории на GitHub:
1. Нажми на ⚙️ Settings справа
2. В разделе "About" нажми ⚙️
3. Добавь topics:
   - `discord`
   - `discord-bot`
   - `nodejs`
   - `modular`
   - `template`
   - `javascript`
   - `sqlite`
   - `discord-js`

### Добавь описание

В том же окне "About":
- **Description:** `🤖 Модульный Discord бот с автозагрузкой плагинов | Slash команды, SQLite, система событий`
- **Website:** (если есть)

## Шаг 6: Проверка .gitignore

Убедись что `.gitignore` правильный (он уже создан):

```gitignore
# Главное - исключи токены и базы!
config.js
databases/
node_modules/
*.log
```

✅ Это гарантирует что токен Discord не попадет в публичный репозиторий.

## Шаг 7: Создай Release (опционально)

1. В репозитории на GitHub → **Releases** → **Create a new release**
2. Tag: `v1.0.0`
3. Title: `🎉 First Release - Discord Модульный Бот`
4. Description:
```markdown
## 🚀 Первый релиз

Готовый шаблон модульного Discord бота с:
- ✅ Автозагрузка модулей
- ✅ Slash команды
- ✅ SQLite база данных
- ✅ Система событий
- ✅ Цветное логирование
- ✅ Полная документация на русском

### Установка
1. `npm install`
2. `cp config.example.js config.js`
3. Отредактируй `config.js`
4. `npm start`

См. [QUICK_START.md](QUICK_START.md) для подробностей.
```

## ⚠️ ВАЖНО - Безопасность

### ❌ НИКОГДА не заливай:
- `config.js` с реальным токеном
- Папку `databases/` с данными
- `.env` файлы с секретами

### ✅ Проверь перед пушем:

```bash
# Посмотри что будет залито
git status

# Посмотри изменения
git diff

# Убедись что config.js НЕ в списке
```

### Если случайно залил токен:

1. **НЕМЕДЛЕННО** сбрось токен в Discord Developer Portal:
   - Bot → Reset Token
2. Удали коммит с токеном:
```bash
# Откат последнего коммита (ОСТОРОЖНО!)
git reset --hard HEAD~1
git push --force origin main
```
3. Обнови токен в `config.js` локально

## Полезные Git команды

```bash
# Статус файлов
git status

# Добавить файлы
git add .
git add имя_файла.js

# Коммит
git commit -m "Описание изменений"

# Запушить на GitHub
git push

# Посмотреть историю
git log --oneline

# Посмотреть изменения
git diff

# Создать ветку
git checkout -b feature/new-module

# Переключиться на ветку
git checkout main

# Слить ветку
git merge feature/new-module
```

## Шаблон коммитов

Используй понятные сообщения:

```bash
git commit -m "✨ Add ticket system module"
git commit -m "🐛 Fix database connection error"
git commit -m "📝 Update MODULE_GUIDE.md"
git commit -m "🚀 Improve module loading speed"
git commit -m "♻️ Refactor CommandHandler"
```

Эмодзи (опционально):
- ✨ Новая функция
- 🐛 Исправление бага
- 📝 Документация
- 🚀 Производительность
- ♻️ Рефакторинг
- 🔧 Конфигурация

## GitHub Desktop (альтернатива)

Если не хочешь использовать командную строку:

1. Скачай [GitHub Desktop](https://desktop.github.com/)
2. **File** → **Add Local Repository**
3. Выбери папку проекта
4. **Publish repository** → выбери настройки
5. Готово!

Дальше просто:
- Пиши код
- В GitHub Desktop увидишь изменения
- Напиши описание → **Commit**
- **Push origin** → код на GitHub

## Обновление репозитория

После изменений в коде:

```bash
# 1. Проверь что изменилось
git status

# 2. Добавь изменения
git add .

# 3. Закоммить с описанием
git commit -m "Add moderation module"

# 4. Запушить на GitHub
git push
```

## Collaborators

Если хочешь дать доступ другим:

1. Репозиторий на GitHub → **Settings**
2. **Collaborators** → **Add people**
3. Введи GitHub username

## Issues и Discussions

Включи для обратной связи:

1. **Settings** → **General**
2. **Features** секция:
   - ✅ Issues
   - ✅ Discussions
3. **Save changes**

Теперь пользователи смогут:
- Создавать Issues (баги, предложения)
- Обсуждать в Discussions

## GitHub Actions (опционально)

Создай `.github/workflows/test.yml` для автотестов:

```yaml
name: Test Bot

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
```

## Что дальше?

После заливки на GitHub:

1. ⭐ Попроси друзей поставить звезду
2. 📢 Расшарь в Discord сообществах
3. 📝 Веди CHANGELOG.md с изменениями
4. 🎯 Создавай Issues для планируемых фич
5. 🤝 Принимай Pull Requests от других

---

**Готово! Твой проект на GitHub! 🎉**

Ссылка будет типа: `https://github.com/YOUR_USERNAME/discord-module-bot`

