# 🚀 Пошаговая Настройка GitHub и Vercel

Эта инструкция поможет вам с нуля настроить репозиторий на GitHub и задеплоить веб-приложение на Vercel.

## 📋 Подготовка

### Что вам понадобится:
- ✅ Аккаунт GitHub (уже есть)
- ✅ Аккаунт Vercel (создадим)
- ✅ Все файлы проекта на вашем компьютере

## 🐙 Шаг 1: Настройка GitHub Repository

### 1.1 Создание репозитория
1. Откройте [github.com](https://github.com) и войдите в аккаунт
2. Нажмите **"New repository"** (зеленая кнопка)
3. Заполните форму:
   - **Repository name**: `bpmn-process-viewer`
   - **Description**: `BPMN Process Viewer - Visualize business process diagrams`
   - ✅ **Public** (чтобы GitHub Pages работал бесплатно)
   - ✅ **Add a README file**
   - ✅ **Add .gitignore** → выберите **Node**
   - ✅ **Choose a license** → выберите **MIT License**
4. Нажмите **"Create repository"**

### 1.2 Загрузка файлов проекта

**Способ 1: Через веб-интерфейс (рекомендуется для начинающих)**

1. В вашем новом репозитории нажмите **"uploading an existing file"**
2. Перетащите все файлы проекта:
   ```
   📁 Файлы для загрузки:
   ├── index.html
   ├── style.css  
   ├── script.js
   ├── package.json
   ├── vercel.json
   ├── product_development_process_v2.bpmn
   ├── product_development_process.bpmn
   ├── comparison_mermaid.md
   └── .github/workflows/deploy.yml
   ```
3. Напишите commit message: `Initial commit: Add BPMN Process Viewer`
4. Нажмите **"Commit changes"**

**Способ 2: Через Git командную строку**

```bash
# Клонирование репозитория
git clone https://github.com/vasilievyakov/bpmn-process-viewer.git
cd bpmn-process-viewer

# Копирование файлов в папку репозитория
# (скопируйте все файлы проекта в эту папку)

# Добавление файлов
git add .
git commit -m "Initial commit: Add BPMN Process Viewer"
git push origin main
```

### 1.3 Настройка GitHub Pages

1. В репозитории перейдите в **Settings** → **Pages**
2. В разделе **Source** выберите **"Deploy from a branch"**
3. Выберите ветку **main** и папку **/ (root)**
4. Нажмите **"Save"**
5. ✅ Ваш сайт будет доступен по адресу: `https://vasilievyakov.github.io/bpmn-process-viewer/`

## ⚡ Шаг 2: Настройка Vercel

### 2.1 Создание аккаунта Vercel
1. Откройте [vercel.com](https://vercel.com)
2. Нажмите **"Sign up"**
3. Выберите **"Continue with GitHub"**
4. Авторизуйтесь через GitHub аккаунт

### 2.2 Деплой проекта на Vercel

**Способ 1: Через веб-интерфейс (рекомендуется)**

1. На главной странице Vercel нажмите **"New Project"**
2. Найдите ваш репозиторий `bpmn-process-viewer`
3. Нажмите **"Import"**
4. В настройках:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: оставьте пустым
   - **Output Directory**: ./
5. Нажмите **"Deploy"**
6. ✅ Ваш сайт будет доступен по адресу: `https://ваш-проект.vercel.app`

**Способ 2: Через Vercel CLI**

```bash
# Установка Vercel CLI
npm i -g vercel

# Логин в Vercel
vercel login

# Деплой проекта
vercel

# Для продакшн деплоя
vercel --prod
```

### 2.3 Настройка автоматического деплоя

1. В Vercel откройте настройки проекта
2. Перейдите в **Git** → **Deploy Hooks**
3. Vercel автоматически деплоит при каждом push в main ветку
4. ✅ Настройка завершена!

## 🔧 Шаг 3: Настройка GitHub Actions (Опционально)

### 3.1 Получение токенов для автоматизации

**Для Vercel API:**
1. В Vercel → **Settings** → **Tokens**
2. Создайте новый токен
3. Скопируйте значение

**Для GitHub Secrets:**
1. В GitHub репозитории → **Settings** → **Secrets and variables** → **Actions**
2. Добавьте секреты:
   - `VERCEL_TOKEN`: токен из Vercel
   - `ORG_ID`: ID организации Vercel
   - `PROJECT_ID`: ID проекта Vercel

### 3.2 Активация GitHub Actions
1. В репозитории перейдите в **Actions**
2. Разрешите запуск workflows
3. ✅ Автоматизация настроена!

## 🎯 Шаг 4: Проверка и тестирование

### 4.1 Проверьте доступность сайтов:

1. **GitHub Pages**: `https://vasilievyakov.github.io/bpmn-process-viewer/`
2. **Vercel**: `https://ваш-проект.vercel.app`

### 4.2 Тестирование функций:
- ✅ Загрузка BPMN диаграмм
- ✅ Управление масштабом
- ✅ Скачивание SVG
- ✅ Отзывчивый дизайн

## 🔄 Шаг 5: Обновление контента

### Обновление файлов:
1. Редактируйте файлы локально или через GitHub веб-интерфейс
2. Коммитьте изменения в main ветку
3. Vercel и GitHub Pages автоматически обновятся

### Добавление новых BPMN диаграмм:
1. Загрузите новый `.bpmn` файл в репозиторий
2. Обновите `script.js` для добавления кнопки загрузки
3. Обновите документацию

## 🛠️ Устранение проблем

### Проблема: Сайт не загружается
**Решение:**
- Проверьте статус деплоя в Vercel/GitHub Actions
- Убедитесь, что все файлы загружены корректно
- Проверьте консоль браузера на ошибки JavaScript

### Проблема: BPMN диаграммы не отображаются
**Решение:**
- Убедитесь, что `.bpmn` файлы загружены в репозиторий
- Проверьте корректность XML синтаксиса в BPMN файлах
- Проверьте сетевые запросы в Developer Tools

### Проблема: GitHub Actions не работают
**Решение:**
- Проверьте правильность секретов в Settings → Secrets
- Убедитесь, что workflow файл находится в `.github/workflows/`
- Проверьте логи выполнения в разделе Actions

## 📞 Полезные ссылки

- 📖 [Документация GitHub Pages](https://docs.github.com/en/pages)
- 📖 [Документация Vercel](https://vercel.com/docs)
- 📖 [BPMN.js Документация](https://bpmn.io/toolkit/bpmn-js/)
- 📖 [GitHub Actions](https://docs.github.com/en/actions)

## ✅ Чек-лист готовности

- [ ] Репозиторий создан на GitHub
- [ ] Все файлы загружены
- [ ] GitHub Pages активирован
- [ ] Аккаунт Vercel создан
- [ ] Проект задеплоен на Vercel
- [ ] Сайты доступны и работают
- [ ] BPMN диаграммы загружаются
- [ ] Автоматический деплой настроен

## 🎉 Поздравляем!

Ваш BPMN Process Viewer готов к использованию! Теперь у вас есть:

- 🌐 Современное веб-приложение для просмотра BPMN
- 🚀 Автоматический деплой на двух платформах
- 📊 Профессиональные BPMN 2.0 диаграммы
- 🔧 Полная автоматизация через GitHub Actions

✅ Все файлы уже обновлены под ваш username `vasilievyakov`!
