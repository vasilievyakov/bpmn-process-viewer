/**
 * BPMN Process Viewer - JavaScript
 * Управление загрузкой и отображением BPMN диаграмм
 */

// Глобальные переменные
let bpmnViewer = null;
let currentDiagram = null;
let currentBPMN = null;
let fileViewer = null;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('🤖 AI BPMN Generator инициализирован');
    
    // Инициализация BPMN Viewer для генератора
    initializeBpmnViewer();
    
    // Инициализация BPMN Viewer для файлов
    initializeFileViewer();
    
    // Настройка навигации
    setupNavigation();
    
    // Настройка обработчиков событий
    setupEventListeners();
    
    // Настройка drag & drop для файлов
    setupFileDrop();
});

/**
 * Инициализация BPMN Viewer
 */
function initializeBpmnViewer() {
    try {
        const canvas = document.getElementById('canvas');
        if (!canvas) {
            throw new Error('Canvas элемент не найден');
        }

        // Создание экземпляра BPMN Viewer
        bpmnViewer = new BpmnJS({
            container: canvas,
            width: '100%',
            height: '100%'
        });

        console.log('✅ BPMN Viewer успешно инициализирован');
        
        // Обработчики событий BPMN Viewer
        bpmnViewer.on('import.done', function(event) {
            const { error } = event;
            if (error) {
                console.error('❌ Ошибка импорта BPMN:', error);
                showError(`Ошибка загрузки диаграммы: ${error.message}`);
            } else {
                console.log('✅ BPMN диаграмма успешно загружена');
                hideLoading();
                hideError();
                
                // Автоматическое масштабирование
                setTimeout(() => {
                    zoomToFit();
                }, 100);
            }
        });

        // Обработчик кликов по элементам
        bpmnViewer.on('element.click', function(event) {
            const element = event.element;
            console.log('🔍 Клик по элементу:', element.businessObject?.name || element.id);
            
            // Можно добавить показ деталей элемента
            showElementDetails(element);
        });

    } catch (error) {
        console.error('❌ Ошибка инициализации BPMN Viewer:', error);
        showError('Ошибка инициализации просмотрщика BPMN');
    }
}

/**
 * Загрузка BPMN диаграммы
 */
async function loadDiagram(filename) {
    if (!bpmnViewer) {
        console.error('❌ BPMN Viewer не инициализирован');
        return;
    }

    try {
        console.log(`📥 Загрузка диаграммы: ${filename}`);
        showLoading();
        hideError();

        // Загрузка файла
        const response = await fetch(filename);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const bpmnXML = await response.text();
        currentDiagram = filename;

        // Импорт в BPMN Viewer
        await bpmnViewer.importXML(bpmnXML);
        
        // Обновление UI
        updateDiagramTitle(filename);
        
    } catch (error) {
        console.error('❌ Ошибка загрузки диаграммы:', error);
        hideLoading();
        
        let errorMessage = 'Не удалось загрузить диаграмму';
        if (error.message.includes('404')) {
            errorMessage = `Файл ${filename} не найден. Убедитесь, что файл загружен в репозиторий.`;
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Ошибка сети. Проверьте подключение к интернету.';
        } else {
            errorMessage = `Ошибка: ${error.message}`;
        }
        
        showError(errorMessage);
    }
}

/**
 * Показать состояние загрузки
 */
function showLoading() {
    const loading = document.getElementById('loading');
    const canvas = document.getElementById('canvas');
    const error = document.getElementById('error');
    
    if (loading) loading.style.display = 'flex';
    if (canvas) canvas.style.display = 'none';
    if (error) error.style.display = 'none';
}

/**
 * Скрыть состояние загрузки
 */
function hideLoading() {
    const loading = document.getElementById('loading');
    const canvas = document.getElementById('canvas');
    
    if (loading) loading.style.display = 'none';
    if (canvas) canvas.style.display = 'block';
}

/**
 * Показать ошибку
 */
function showError(message) {
    const error = document.getElementById('error');
    const errorMessage = document.getElementById('error-message');
    const loading = document.getElementById('loading');
    const canvas = document.getElementById('canvas');
    
    if (errorMessage) errorMessage.textContent = message;
    if (error) error.style.display = 'flex';
    if (loading) loading.style.display = 'none';
    if (canvas) canvas.style.display = 'none';
}

/**
 * Скрыть ошибку
 */
function hideError() {
    const error = document.getElementById('error');
    if (error) error.style.display = 'none';
}

/**
 * Повторная попытка загрузки
 */
function retryLoad() {
    if (currentDiagram) {
        loadDiagram(currentDiagram);
    } else {
        loadDiagram('product_development_process_v2.bpmn');
    }
}

/**
 * Обновление заголовка диаграммы
 */
function updateDiagramTitle(filename) {
    const title = document.querySelector('.viewer-header h3');
    if (title) {
        const displayName = filename.includes('v2') ? 
            'BPMN Диаграмма - Основная Версия' : 
            'BPMN Диаграмма - Расширенная Версия';
        title.textContent = displayName;
    }
}

/**
 * Функции управления масштабом
 */
function zoomIn() {
    if (bpmnViewer) {
        const zoomScroll = bpmnViewer.get('zoomScroll');
        zoomScroll.stepZoom(1);
    }
}

function zoomOut() {
    if (bpmnViewer) {
        const zoomScroll = bpmnViewer.get('zoomScroll');
        zoomScroll.stepZoom(-1);
    }
}

function zoomReset() {
    if (bpmnViewer) {
        const canvas = bpmnViewer.get('canvas');
        canvas.zoom('fit-viewport');
    }
}

function zoomToFit() {
    if (bpmnViewer) {
        const canvas = bpmnViewer.get('canvas');
        canvas.zoom('fit-viewport', 'auto');
    }
}

/**
 * Скачивание диаграммы в формате SVG
 */
async function downloadSVG() {
    if (!bpmnViewer) return;

    try {
        const result = await bpmnViewer.saveSVG();
        const { svg } = result;
        
        // Создание и скачивание файла
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = `${currentDiagram || 'bpmn-diagram'}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log('✅ SVG диаграмма скачана');
    } catch (error) {
        console.error('❌ Ошибка скачивания SVG:', error);
        alert('Ошибка при скачивании диаграммы');
    }
}

/**
 * Показ деталей элемента
 */
function showElementDetails(element) {
    const businessObject = element.businessObject;
    if (!businessObject) return;

    const details = {
        id: element.id,
        name: businessObject.name || 'Без названия',
        type: businessObject.$type?.replace('bpmn:', '') || 'Неизвестно'
    };

    console.log('📋 Детали элемента:', details);
    
    // Можно добавить модальное окно с деталями
    // showModal(details);
}

/**
 * Настройка навигации
 */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                // Удаление активного класса
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Плавная прокрутка к секции
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

/**
 * Настройка дополнительных обработчиков событий
 */
function setupEventListeners() {
    // Обработка изменения размера окна
    window.addEventListener('resize', debounce(() => {
        if (bpmnViewer) {
            bpmnViewer.get('canvas').resized();
        }
    }, 250));

    // Клавиатурные сочетания
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '=':
                case '+':
                    e.preventDefault();
                    zoomIn();
                    break;
                case '-':
                    e.preventDefault();
                    zoomOut();
                    break;
                case '0':
                    e.preventDefault();
                    zoomReset();
                    break;
            }
        }
    });
}

/**
 * Debounce функция для оптимизации производительности
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Проверка поддержки браузера
 */
function checkBrowserSupport() {
    const isSupported = !!(
        window.fetch &&
        window.Promise &&
        window.URL &&
        document.querySelector
    );

    if (!isSupported) {
        showError('Ваш браузер не поддерживается. Пожалуйста, обновите браузер до последней версии.');
        return false;
    }

    return true;
}

/**
 * Аналитика (опционально)
 */
function trackEvent(action, label) {
    console.log(`📊 Event: ${action} - ${label}`);
    // Здесь можно добавить интеграцию с Google Analytics или другими сервисами
}

// Проверка поддержки браузера при загрузке
if (!checkBrowserSupport()) {
    console.error('❌ Браузер не поддерживается');
}

// Экспорт функций для использования в HTML
window.loadDiagram = loadDiagram;
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;
window.zoomReset = zoomReset;
window.downloadSVG = downloadSVG;
window.retryLoad = retryLoad;

/**
 * AI BPMN Generator - JavaScript
 * Автоматическое создание BPMN 2.0 диаграмм из текстового описания
 */

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('🤖 AI BPMN Generator инициализирован');
    
    // Инициализация BPMN Viewer для генератора
    initializeBpmnViewer();
    
    // Инициализация BPMN Viewer для файлов
    initializeFileViewer();
    
    // Настройка навигации
    setupNavigation();
    
    // Настройка обработчиков событий
    setupEventListeners();
    
    // Настройка drag & drop для файлов
    setupFileDrop();
});

/**
 * Инициализация BPMN Viewer для генератора
 */
function initializeBpmnViewer() {
    try {
        const canvas = document.getElementById('bpmn-canvas');
        if (!canvas) {
            throw new Error('Canvas элемент генератора не найден');
        }

        bpmnViewer = new BpmnJS({
            container: canvas,
            width: '100%',
            height: '100%'
        });

        console.log('✅ BPMN Viewer для генератора успешно инициализирован');
        
        // Обработчики событий BPMN Viewer
        bpmnViewer.on('import.done', function(event) {
            const { error } = event;
            if (error) {
                console.error('❌ Ошибка импорта BPMN:', error);
                showGenerationError(`Ошибка отображения диаграммы: ${error.message}`);
            } else {
                console.log('✅ BPMN диаграмма успешно отображена');
                setTimeout(() => {
                    zoomToFit(bpmnViewer);
                }, 100);
            }
        });

    } catch (error) {
        console.error('❌ Ошибка инициализации BPMN Viewer:', error);
    }
}

/**
 * Инициализация BPMN Viewer для файлов
 */
function initializeFileViewer() {
    try {
        const canvas = document.getElementById('file-canvas');
        if (!canvas) {
            throw new Error('Canvas элемент файлового просмотрщика не найден');
        }

        fileViewer = new BpmnJS({
            container: canvas,
            width: '100%',
            height: '100%'
        });

        console.log('✅ BPMN Viewer для файлов успешно инициализирован');
        
        fileViewer.on('import.done', function(event) {
            const { error } = event;
            if (error) {
                console.error('❌ Ошибка импорта файла:', error);
            } else {
                setTimeout(() => {
                    zoomToFit(fileViewer);
                }, 100);
            }
        });

    } catch (error) {
        console.error('❌ Ошибка инициализации файлового просмотрщика:', error);
    }
}

/**
 * Генерация BPMN диаграммы из текста
 */
async function generateBPMN() {
    const description = document.getElementById('process-description').value.trim();
    
    if (!description) {
        alert('Пожалуйста, опишите процесс перед генерацией');
        return;
    }

    console.log('🚀 Начинаю генерацию BPMN из текста:', description);
    
    // Показываем статус генерации
    showGenerationStatus('Анализирую описание процесса...');
    
    try {
        // Имитация AI анализа (в реальном приложении здесь будет API)
        await simulateAIAnalysis(description);
        
        // Генерируем BPMN XML
        const bpmnXML = generateBPMNFromText(description);
        
        // Сохраняем результат
        currentBPMN = bpmnXML;
        
        // Отображаем результат
        await displayGeneratedBPMN(bpmnXML);
        
        // Показываем результат
        showGeneratedBPMN();
        
        console.log('✅ BPMN диаграмма успешно сгенерирована');
        
    } catch (error) {
        console.error('❌ Ошибка генерации BPMN:', error);
        showGenerationError('Ошибка при генерации BPMN диаграммы');
    }
}

/**
 * Имитация AI анализа (заменяется на реальный API)
 */
async function simulateAIAnalysis(description) {
    const steps = [
        'Анализирую структуру процесса...',
        'Определяю участников и роли...',
        'Выявляю задачи и последовательность...',
        'Создаю потоки и шлюзы...',
        'Формирую BPMN 2.0 XML...'
    ];
    
    for (let i = 0; i < steps.length; i++) {
        updateGenerationStatus(steps[i]);
        await new Promise(resolve => setTimeout(resolve, 800));
    }
}

/**
 * Генерация BPMN XML из текста
 */
function generateBPMNFromText(description) {
    // Анализируем текст и извлекаем элементы процесса
    const processElements = analyzeProcessText(description);
    
    // Создаем BPMN 2.0 XML
    const bpmnXML = createBPMNXML(processElements);
    
    return bpmnXML;
}

/**
 * Анализ текста процесса
 */
function analyzeProcessText(text) {
    const lines = text.split('\n').filter(line => line.trim());
    const elements = {
        participants: [],
        tasks: [],
        decisions: [],
        sequence: []
    };
    
    // Простой парсинг текста (в реальном приложении здесь будет AI)
    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (trimmed.match(/^\d+\./)) {
            // Нумерованная строка - задача
            const taskName = trimmed.replace(/^\d+\.\s*/, '');
            elements.tasks.push({
                id: `Task_${index + 1}`,
                name: taskName,
                participant: extractParticipant(taskName)
            });
        } else if (trimmed.includes('если') || trimmed.includes('Если')) {
            // Условие - решение
            elements.decisions.push({
                id: `Decision_${index + 1}`,
                name: trimmed,
                condition: extractCondition(trimmed)
            });
        }
    });
    
    // Извлекаем уникальных участников
    elements.participants = [...new Set(elements.tasks.map(t => t.participant).filter(Boolean))];
    
    return elements;
}

/**
 * Извлечение участника из текста
 */
function extractParticipant(text) {
    const participants = [
        'клиент', 'менеджер', 'разработчик', 'QA', 'тестировщик',
        'архитектор', 'дизайнер', 'аналитик', 'руководитель',
        'сотрудник', 'специалист', 'команда', 'отдел'
    ];
    
    for (const participant of participants) {
        if (text.toLowerCase().includes(participant)) {
            return participant.charAt(0).toUpperCase() + participant.slice(1);
        }
    }
    
    return 'Участник';
}

/**
 * Извлечение условия из текста
 */
function extractCondition(text) {
    if (text.includes('если') || text.includes('Если')) {
        return text.replace(/^.*?(если|Если)\s*/i, '').replace(/[.,].*$/, '');
    }
    return text;
}

/**
 * Создание BPMN 2.0 XML
 */
function createBPMNXML(elements) {
    const processId = 'Process_' + Date.now();
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
                  id="Definitions_1" 
                  targetNamespace="http://bpmn.io/schema/bpmn">
  
  <bpmn:process id="${processId}" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Начало процесса">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>`;

    // Добавляем задачи
    elements.tasks.forEach((task, index) => {
        const flowId = `Flow_${index + 1}`;
        const nextFlowId = `Flow_${index + 2}`;
        
        xml += `
    <bpmn:task id="${task.id}" name="${task.name}">
      <bpmn:incoming>${flowId}</bpmn:incoming>
      <bpmn:outgoing>${nextFlowId}</bpmn:outgoing>
    </bpmn:task>
    
    <bpmn:sequenceFlow id="${flowId}" sourceRef="${index === 0 ? 'StartEvent_1' : elements.tasks[index - 1].id}" targetRef="${task.id}" />
    
    <bpmn:sequenceFlow id="${nextFlowId}" sourceRef="${task.id}" targetRef="${index === elements.tasks.length - 1 ? 'EndEvent_1' : elements.tasks[index + 1].id}" />`;
    });

    // Добавляем конечное событие
    xml += `
    
    <bpmn:endEvent id="EndEvent_1" name="Конец процесса">
      <bpmn:incoming>Flow_${elements.tasks.length + 1}</bpmn:incoming>
    </bpmn:endEvent>
  </bpmn:process>
  
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${processId}">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="152" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>`;

    // Добавляем диаграмму для задач
    elements.tasks.forEach((task, index) => {
        const x = 250 + index * 200;
        xml += `
      <bpmndi:BPMNShape id="${task.id}_di" bpmnElement="${task.id}">
        <dc:Bounds x="${x}" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>`;
    });

    // Добавляем диаграмму для конечного события
    const endX = 250 + elements.tasks.length * 200;
    xml += `
      
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="${endX}" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

    return xml;
}

/**
 * Отображение сгенерированной BPMN диаграммы
 */
async function displayGeneratedBPMN(bpmnXML) {
    if (!bpmnViewer) {
        throw new Error('BPMN Viewer не инициализирован');
    }

    try {
        // Импортируем XML в viewer
        await bpmnViewer.importXML(bpmnXML);
        
        // Обновляем XML код в интерфейсе
        document.getElementById('xml-output').textContent = bpmnXML;
        
    } catch (error) {
        console.error('❌ Ошибка отображения BPMN:', error);
        throw error;
    }
}

/**
 * Показать статус генерации
 */
function showGenerationStatus(message) {
    const status = document.getElementById('generation-status');
    const messageEl = document.getElementById('status-message');
    
    if (status) status.style.display = 'block';
    if (messageEl) messageEl.textContent = message;
}

/**
 * Обновить статус генерации
 */
function updateGenerationStatus(message) {
    const messageEl = document.getElementById('status-message');
    if (messageEl) messageEl.textContent = message;
}

/**
 * Скрыть статус генерации
 */
function hideGenerationStatus() {
    const status = document.getElementById('generation-status');
    if (status) status.style.display = 'none';
}

/**
 * Показать ошибку генерации
 */
function showGenerationError(message) {
    hideGenerationStatus();
    alert(`Ошибка: ${message}`);
}

/**
 * Показать сгенерированную BPMN
 */
function showGeneratedBPMN() {
    hideGenerationStatus();
    
    const generated = document.getElementById('generated-bpmn');
    if (generated) generated.style.display = 'block';
    
    // Плавная прокрутка к результату
    generated.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Загрузка примера
 */
function loadExample(type = 'default') {
    const examples = {
        default: `1. Процесс начинается с поступления заявки от клиента
2. Менеджер проверяет заявку и принимает решение
3. Если заявка одобрена, передается в отдел разработки
4. Разработчики создают продукт и передают на тестирование
5. QA тестирует продукт и возвращает на доработку при необходимости
6. Готовый продукт передается клиенту`,
        
        ecommerce: `1. Клиент выбирает товары на сайте
2. Добавляет товары в корзину
3. Оформляет заказ с указанием адреса доставки
4. Система проверяет наличие товаров на складе
5. Если товары есть, заказ подтверждается
6. Если товаров нет, заказ отменяется
7. Подтвержденный заказ передается в отдел логистики
8. Товары упаковываются и отправляются клиенту
9. Клиент получает товары и подтверждает доставку`,
        
        medical: `1. Пациент записывается на прием к врачу
2. Регистратор проверяет документы пациента
3. Пациент проходит в кабинет врача
4. Врач проводит осмотр и ставит диагноз
5. Если требуется дополнительное обследование, назначаются анализы
6. Пациент сдает анализы в лаборатории
7. Результаты анализов передаются врачу
8. Врач назначает лечение
9. Пациент получает рецепт и рекомендации`,
        
        manufacturing: `1. Отдел закупок получает заказ на производство
2. Проверяется наличие сырья на складе
3. Если сырья недостаточно, размещается заказ поставщикам
4. Сырье доставляется на склад
5. Производственный отдел получает задание
6. Изготавливается продукция
7. Готовая продукция проходит контроль качества
8. Если качество не соответствует стандартам, продукция возвращается на доработку
9. Качественная продукция упаковывается и отправляется на склад готовой продукции`,
        
        hr: `1. Отдел HR получает заявку на нового сотрудника
2. HR-специалист составляет описание вакансии
3. Вакансия публикуется на сайтах поиска работы
4. Кандидаты отправляют резюме
5. HR-специалист отбирает подходящих кандидатов
6. Проводится первичное собеседование по телефону
7. Если кандидат подходит, приглашается на личную встречу
8. Проводится интервью с руководителем отдела
9. При положительном решении кандидату предлагается работа
10. Новый сотрудник проходит оформление документов`
    };
    
    const description = examples[type] || examples.default;
    document.getElementById('process-description').value = description;
}

/**
 * Очистка формы
 */
function clearForm() {
    document.getElementById('process-description').value = '';
    const generated = document.getElementById('generated-bpmn');
    if (generated) generated.style.display = 'none';
}

/**
 * Скачивание BPMN файла
 */
function downloadBPMN() {
    if (!currentBPMN) {
        alert('Сначала сгенерируйте BPMN диаграмму');
        return;
    }
    
    const blob = new Blob([currentBPMN], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `generated-process-${Date.now()}.bpmn`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('✅ BPMN файл скачан');
}

/**
 * Копирование XML в буфер обмена
 */
function copyXML() {
    if (!currentBPMN) {
        alert('Сначала сгенерируйте BPMN диаграмму');
        return;
    }
    
    navigator.clipboard.writeText(currentBPMN).then(() => {
        alert('XML код скопирован в буфер обмена!');
    }).catch(() => {
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea');
        textArea.value = currentBPMN;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('XML код скопирован в буфер обмена!');
    });
}

/**
 * Просмотр в редакторе
 */
function viewInEditor() {
    if (!currentBPMN) {
        alert('Сначала сгенерируйте BPMN диаграмму');
        return;
    }
    
    // Открываем в новом окне bpmn.io
    const encodedXML = encodeURIComponent(currentBPMN);
    const url = `https://demo.bpmn.io/new?bpmn=${encodedXML}`;
    window.open(url, '_blank');
}

/**
 * Загрузка образца BPMN
 */
function loadSampleBPMN() {
    // Загружаем встроенный образец
    const sampleXML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
                  id="Definitions_1" 
                  targetNamespace="http://bpmn.io/schema/bpmn">
  
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Начало">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    
    <bpmn:task id="Task_1" name="Пример задачи">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:task>
    
    <bpmn:endEvent id="EndEvent_1" name="Конец">
      <bpmn:incoming>Flow_2</bpmn:incoming>
    </bpmn:endEvent>
    
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1" />
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="EndEvent_1" />
  </bpmn:process>
  
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="152" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
      
      <bpmndi:BPMNShape id="Task_1_di" bpmnElement="Task_1">
        <dc:Bounds x="250" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="412" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;
    
    displayFileBPMN(sampleXML);
    showFileViewer();
}

/**
 * Отображение BPMN файла
 */
async function displayFileBPMN(bpmnXML) {
    if (!fileViewer) {
        throw new Error('Файловый просмотрщик не инициализирован');
    }

    try {
        await fileViewer.importXML(bpmnXML);
    } catch (error) {
        console.error('❌ Ошибка отображения файла:', error);
        alert('Ошибка при загрузке BPMN файла');
    }
}

/**
 * Показать файловый просмотрщик
 */
function showFileViewer() {
    const viewer = document.getElementById('file-viewer');
    if (viewer) viewer.style.display = 'block';
}

/**
 * Настройка drag & drop для файлов
 */
function setupFileDrop() {
    const fileInput = document.getElementById('bpmn-file-input');
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            loadBPMNFile(file);
        }
    });
}

/**
 * Загрузка BPMN файла
 */
function loadBPMNFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const content = e.target.result;
        displayFileBPMN(content);
        showFileViewer();
    };
    
    reader.onerror = function() {
        alert('Ошибка при чтении файла');
    };
    
    reader.readAsText(file);
}

/**
 * Функции управления масштабом
 */
function zoomIn() {
    if (fileViewer) {
        const zoomScroll = fileViewer.get('zoomScroll');
        zoomScroll.stepZoom(1);
    }
}

function zoomOut() {
    if (fileViewer) {
        const zoomScroll = fileViewer.get('zoomScroll');
        zoomScroll.stepZoom(-1);
    }
}

function zoomReset() {
    if (fileViewer) {
        const canvas = fileViewer.get('canvas');
        canvas.zoom('fit-viewport');
    }
}

function zoomToFit(viewer) {
    if (viewer) {
        const canvas = viewer.get('canvas');
        canvas.zoom('fit-viewport', 'auto');
    }
}

/**
 * Скачивание SVG диаграммы
 */
async function downloadSVG() {
    if (!fileViewer) return;

    try {
        const result = await fileViewer.saveSVG();
        const { svg } = result;
        
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = 'bpmn-diagram.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log('✅ SVG диаграмма скачана');
    } catch (error) {
        console.error('❌ Ошибка скачивания SVG:', error);
        alert('Ошибка при скачивании диаграммы');
    }
}

/**
 * Настройка навигации
 */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

/**
 * Настройка дополнительных обработчиков событий
 */
function setupEventListeners() {
    // Обработка изменения размера окна
    window.addEventListener('resize', debounce(() => {
        if (bpmnViewer) {
            bpmnViewer.get('canvas').resized();
        }
        if (fileViewer) {
            fileViewer.get('canvas').resized();
        }
    }, 250));

    // Клавиатурные сочетания
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '=':
                case '+':
                    e.preventDefault();
                    zoomIn();
                    break;
                case '-':
                    e.preventDefault();
                    zoomOut();
                    break;
                case '0':
                    e.preventDefault();
                    zoomReset();
                    break;
            }
        }
    });
}

/**
 * Debounce функция для оптимизации производительности
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Экспорт функций для использования в HTML
window.generateBPMN = generateBPMN;
window.loadExample = loadExample;
window.clearForm = clearForm;
window.downloadBPMN = downloadBPMN;
window.copyXML = copyXML;
window.viewInEditor = viewInEditor;
window.loadSampleBPMN = loadSampleBPMN;
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;
window.zoomReset = zoomReset;
window.downloadSVG = downloadSVG;
