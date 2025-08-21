# 🚀 Быстрый Старт - Настройка за 5 минут

Краткая инструкция для мгновенной настройки GitHub и Vercel.

## 📦 Что у вас есть

В папке проекта созданы все необходимые файлы:

```
📦 bpmn-process-viewer/
├── 📄 index.html                    # Веб-приложение
├── 🎨 style.css                     # Современные стили
├── ⚡ script.js                     # Логика приложения
├── 📦 package.json                  # Конфигурация проекта
├── ⚙️ vercel.json                   # Настройка Vercel
├── 📊 product_development_process_v2.bpmn    # BPMN диаграмма
├── 📖 README.md                     # Документация
├── 🚀 SETUP.md                      # Подробная инструкция
└── 🤖 .github/workflows/deploy.yml  # Автоматизация
```

## ⚡ Шаг 1: GitHub (2 минуты)

1. **Создайте репозиторий:**
   - Откройте [github.com](https://github.com)
   - Нажмите **"New repository"**
   - Название: `bpmn-process-viewer`
   - ✅ Public, ✅ Add README

2. **Загрузите файлы:**
   - **"uploading an existing file"**
   - Перетащите ВСЕ файлы из папки проекта
   - Commit: `Initial commit: Add BPMN Process Viewer`

3. **Активируйте GitHub Pages:**
   - Settings → Pages
   - Source: **Deploy from branch**
   - Branch: **main**, Folder: **/ (root)**

✅ **Готово!** Ваш сайт: `https://vasilievyakov.github.io/bpmn-process-viewer/`

## ⚡ Шаг 2: Vercel (2 минуты)

1. **Регистрация:**
   - Откройте [vercel.com](https://vercel.com)
   - **"Continue with GitHub"**

2. **Деплой:**
   - **"New Project"**
   - Выберите `bpmn-process-viewer`
   - **"Deploy"** (оставьте настройки по умолчанию)

✅ **Готово!** Ваш сайт: `https://ваш-проект.vercel.app`

## ⚡ Шаг 3: Замените ссылки (1 минута)

В файлах замените `YOUR_USERNAME` на ваш GitHub username:

- `index.html` (строки с `[YOUR_USERNAME]`)
- `README.md` (ссылки на GitHub Pages)

Коммитните изменения через GitHub веб-интерфейс.

## 🎉 Результат

У вас есть:

- 🌐 **Современное веб-приложение** для просмотра BPMN
- 📊 **Профессиональные BPMN 2.0 диаграммы**
- 🚀 **Автоматический деплой** на двух платформах
- 🔧 **Полная автоматизация** через GitHub Actions

## 🔗 Ваши ссылки

- **GitHub Repo**: `https://github.com/vasilievyakov/bpmn-process-viewer`
- **GitHub Pages**: `https://vasilievyakov.github.io/bpmn-process-viewer/`
- **Vercel**: `https://ваш-проект.vercel.app`

## 🆘 Проблемы?

1. **Не работает GitHub Pages**: Подождите 5-10 минут после активации
2. **Не загружаются BPMN**: Проверьте, что `.bpmn` файлы загружены в репозиторий
3. **Ошибки в Vercel**: Убедитесь, что все файлы загружены правильно

## 📖 Дополнительно

- **Подробная инструкция**: [SETUP.md](SETUP.md)
- **Сравнение с Mermaid**: [comparison_mermaid.md](comparison_mermaid.md)
- **Полная документация**: [README.md](README.md)

---

**⭐ Готово за 5 минут!** Теперь у вас есть профессиональный BPMN просмотрщик!
