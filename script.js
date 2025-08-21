/**
 * BPMN Process Viewer - JavaScript
 * Управление загрузкой и отображением BPMN диаграмм
 */

// Глобальные переменные
let bpmnViewer = null;
let currentDiagram = null;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 BPMN Process Viewer инициализирован');
    
    // Инициализация BPMN Viewer
    initializeBpmnViewer();
    
    // Автоматическая загрузка основной диаграммы
    loadDiagram('product_development_process_v2.bpmn');
    
    // Настройка навигации
    setupNavigation();
    
    // Настройка обработчиков событий
    setupEventListeners();
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
