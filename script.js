/**
 * AI BPMN Generator Pro - JavaScript
 * Профессиональное создание BPMN 2.0 диаграмм с использованием BPMN.io
 */

// Глобальные переменные
let bpmnModeler = null;
let currentBPMN = null;
let fileViewer = null;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('🤖 AI BPMN Generator Pro инициализирован');
    
    // Инициализация BPMN Modeler для генератора
    initializeBpmnModeler();
    
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
 * Инициализация BPMN Modeler для генератора
 */
function initializeBpmnModeler() {
    try {
        const canvas = document.getElementById('bpmn-canvas');
        if (!canvas) {
            throw new Error('Canvas элемент генератора не найден');
        }

        // Создаем полноценный BPMN Modeler
        bpmnModeler = new BpmnJS({
            container: canvas,
            width: '100%',
            height: '100%'
        });

        console.log('✅ BPMN Modeler для генератора успешно инициализирован');
        
        // Обработчики событий BPMN Modeler
        bpmnModeler.on('import.done', function(event) {
            const { error } = event;
            if (error) {
                console.error('❌ Ошибка импорта BPMN:', error);
                showGenerationError(`Ошибка отображения диаграммы: ${error.message}`);
            } else {
                console.log('✅ BPMN диаграмма успешно отображена');
                setTimeout(() => {
                    zoomToFit(bpmnModeler);
                }, 100);
            }
        });

    } catch (error) {
        console.error('❌ Ошибка инициализации BPMN Modeler:', error);
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
 * Генерация профессиональной BPMN 2.0 диаграммы из текста
 */
async function generateBPMN() {
    const description = document.getElementById('process-description').value.trim();
    
    if (!description) {
        alert('Пожалуйста, опишите процесс перед генерацией');
        return;
    }

    console.log('🚀 Начинаю генерацию профессиональной BPMN 2.0 из текста:', description);
    
    // Показываем статус генерации
    showGenerationStatus('Анализирую структуру процесса...');
    
    try {
        // Имитация AI анализа (в реальном приложении здесь будет API)
        await simulateAIAnalysis(description);
        
        // Генерируем профессиональную BPMN 2.0 XML
        const bpmnXML = generateProfessionalBPMNFromText(description);
        
        // Сохраняем результат
        currentBPMN = bpmnXML;
        
        // Отображаем результат
        await displayGeneratedBPMN(bpmnXML);
        
        // Показываем результат
        showGeneratedBPMN();
        
        console.log('✅ Профессиональная BPMN 2.0 диаграмма успешно создана');
        
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
        'Создаю пулы и дорожки...',
        'Добавляю шлюзы и потоки...',
        'Формирую профессиональную BPMN 2.0 XML...'
    ];
    
    for (let i = 0; i < steps.length; i++) {
        updateGenerationStatus(steps[i]);
        await new Promise(resolve => setTimeout(resolve, 800));
    }
}

/**
 * Генерация профессиональной BPMN 2.0 XML из текста
 */
function generateProfessionalBPMNFromText(description) {
    // Анализируем текст и извлекаем элементы процесса
    const processElements = analyzeProcessTextAdvanced(description);
    
    // Создаем профессиональную BPMN 2.0 XML
    const bpmnXML = createProfessionalBPMNXML(processElements);
    
    return bpmnXML;
}

/**
 * Продвинутый анализ текста процесса
 */
function analyzeProcessTextAdvanced(text) {
    const lines = text.split('\n').filter(line => line.trim());
    const elements = {
        participants: new Set(),
        tasks: [],
        decisions: [],
        messageFlows: [],
        pools: [],
        lanes: []
    };
    
    // Анализируем каждую строку
    lines.forEach((line, index) => {
        const trimmed = line.trim();
        
        if (trimmed.match(/^\d+\./)) {
            // Нумерованная строка - задача
            const taskName = trimmed.replace(/^\d+\.\s*/, '');
            const participant = extractParticipantAdvanced(taskName);
            const taskType = determineTaskType(taskName);
            
            elements.tasks.push({
                id: `Task_${index + 1}`,
                name: taskName,
                participant: participant,
                type: taskType,
                index: index
            });
            
            if (participant) {
                elements.participants.add(participant);
            }
        } else if (trimmed.includes('если') || trimmed.includes('Если')) {
            // Условие - решение
            const condition = extractCondition(trimmed);
            elements.decisions.push({
                id: `Decision_${index + 1}`,
                name: condition,
                condition: condition,
                type: 'exclusiveGateway',
                index: index
            });
        } else if (trimmed.includes('параллельно') || trimmed.includes('одновременно')) {
            // Параллельные процессы
            elements.decisions.push({
                id: `Parallel_${index + 1}`,
                name: trimmed,
                type: 'parallelGateway',
                index: index
            });
        }
    });
    
    // Создаем пулы и дорожки
    elements.pools = createPoolsFromParticipants(Array.from(elements.participants));
    
    // Анализируем потоки сообщений
    elements.messageFlows = createMessageFlows(elements.tasks, elements.pools);
    
    return elements;
}

/**
 * Продвинутое извлечение участника
 */
function extractParticipantAdvanced(text) {
    const participants = [
        'клиент', 'менеджер', 'разработчик', 'QA', 'тестировщик',
        'архитектор', 'дизайнер', 'аналитик', 'руководитель',
        'сотрудник', 'специалист', 'команда', 'отдел', 'система',
        'поставщик', 'подрядчик', 'консультант', 'аудитор',
        'логистика', 'склад', 'отдел продаж', 'бухгалтерия',
        'юрист', 'маркетолог', 'дизайнер', 'контент-менеджер'
    ];
    
    for (const participant of participants) {
        if (text.toLowerCase().includes(participant)) {
            return participant.charAt(0).toUpperCase() + participant.slice(1);
        }
    }
    
    // Определяем участника по контексту
    if (text.toLowerCase().includes('выбирает') || text.toLowerCase().includes('добавляет') || text.toLowerCase().includes('оформляет') || text.toLowerCase().includes('получает')) {
        return 'Клиент';
    }
    if (text.toLowerCase().includes('проверяет') || text.toLowerCase().includes('провер') || text.toLowerCase().includes('подтверждается') || text.toLowerCase().includes('отменяется')) {
        return 'Система';
    }
    if (text.toLowerCase().includes('передается') || text.toLowerCase().includes('передач')) {
        return 'Менеджер';
    }
    if (text.toLowerCase().includes('упаковывается') || text.toLowerCase().includes('отправляется') || text.toLowerCase().includes('упаковываются') || text.toLowerCase().includes('отправляются')) {
        return 'Логистика';
    }
    if (text.toLowerCase().includes('наличие') || text.toLowerCase().includes('склад')) {
        return 'Склад';
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
 * Определение типа задачи
 */
function determineTaskType(taskName) {
    const lowerName = taskName.toLowerCase();
    
    if (lowerName.includes('провер') || lowerName.includes('анализ') || lowerName.includes('выбирает') || lowerName.includes('добавляет') || lowerName.includes('оформляет')) return 'userTask';
    if (lowerName.includes('отправ') || lowerName.includes('передач') || lowerName.includes('передается')) return 'sendTask';
    if (lowerName.includes('получ') || lowerName.includes('прием') || lowerName.includes('получает')) return 'receiveTask';
    if (lowerName.includes('автомат') || lowerName.includes('система') || lowerName.includes('подтверждается') || lowerName.includes('отменяется')) return 'serviceTask';
    if (lowerName.includes('упаковывается') || lowerName.includes('отправляется')) return 'userTask';
    
    return 'userTask';
}

/**
 * Создание пулов из участников
 */
function createPoolsFromParticipants(participants) {
    if (participants.length === 0) {
        return [{
            id: 'Pool_1',
            name: 'Основной процесс',
            lanes: []
        }];
    }
    
    if (participants.length === 1) {
        return [{
            id: 'Pool_1',
            name: participants[0],
            lanes: []
        }];
    }
    
    // Создаем пулы для разных групп участников
    const pools = [];
    const businessParticipants = participants.filter(p => 
        ['клиент', 'менеджер', 'руководитель', 'аналитик'].includes(p.toLowerCase())
    );
    const technicalParticipants = participants.filter(p => 
        ['разработчик', 'QA', 'архитектор', 'дизайнер', 'система'].includes(p.toLowerCase())
    );
    const operationalParticipants = participants.filter(p => 
        ['логистика', 'склад', 'отдел продаж', 'бухгалтерия'].includes(p.toLowerCase())
    );
    const otherParticipants = participants.filter(p => 
        !businessParticipants.includes(p) && !technicalParticipants.includes(p) && !operationalParticipants.includes(p)
    );
    
    if (businessParticipants.length > 0) {
        pools.push({
            id: 'Pool_Business',
            name: 'Бизнес-процессы',
            lanes: businessParticipants.map(p => ({ id: `Lane_${p}`, name: p }))
        });
    }
    
    if (technicalParticipants.length > 0) {
        pools.push({
            id: 'Pool_Technical',
            name: 'Технические процессы',
            lanes: technicalParticipants.map(p => ({ id: `Lane_${p}`, name: p }))
        });
    }
    
    if (operationalParticipants.length > 0) {
        pools.push({
            id: 'Pool_Operational',
            name: 'Операционные процессы',
            lanes: operationalParticipants.map(p => ({ id: `Lane_${p}`, name: p }))
        });
    }
    
    if (otherParticipants.length > 0) {
        pools.push({
            id: 'Pool_Other',
            name: 'Дополнительные процессы',
            lanes: otherParticipants.map(p => ({ id: `Lane_${p}`, name: p }))
        });
    }
    
    return pools;
}

/**
 * Создание потоков сообщений
 */
function createMessageFlows(tasks, pools) {
    const flows = [];
    
    // Создаем потоки между задачами разных участников
    for (let i = 0; i < tasks.length - 1; i++) {
        const currentTask = tasks[i];
        const nextTask = tasks[i + 1];
        
        if (currentTask.participant !== nextTask.participant) {
            flows.push({
                id: `MessageFlow_${i + 1}`,
                sourceRef: currentTask.id,
                targetRef: nextTask.id,
                sourceParticipant: currentTask.participant,
                targetParticipant: nextTask.participant
            });
        }
    }
    
    return flows;
}

/**
 * Создание профессиональной BPMN 2.0 XML
 */
function createProfessionalBPMNXML(elements) {
    const processId = 'Process_' + Date.now();
    const collaborationId = 'Collaboration_' + Date.now();
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
                  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  id="Definitions_1" 
                  targetNamespace="http://bpmn.io/schema/bpmn"
                  exporter="AI BPMN Generator Pro"
                  exporterVersion="2.0.0">
  
  <bpmn:collaboration id="${collaborationId}">`;

    // Добавляем пулы с правильными ссылками на процессы
    elements.pools.forEach((pool, poolIndex) => {
        const processRef = `Process_${poolIndex + 1}`;
        xml += `
    <bpmn:participant id="${pool.id}" name="${pool.name}" processRef="${processRef}">`;
        
        // Добавляем дорожки
        if (pool.lanes.length > 0) {
            xml += `
      <bpmn:participant id="${pool.id}_Lanes" name="${pool.name}">`;
            pool.lanes.forEach(lane => {
                xml += `
        <bpmn:participant id="${lane.id}" name="${lane.name}" />`;
            });
            xml += `
      </bpmn:participant>`;
        }
        
        xml += `
    </bpmn:participant>`;
    });

    // Добавляем потоки сообщений
    elements.messageFlows.forEach(flow => {
        xml += `
    <bpmn:messageFlow id="${flow.id}" sourceRef="${flow.sourceRef}" targetRef="${flow.targetRef}" />`;
    });

    // Добавляем основной процесс
    xml += `
  </bpmn:collaboration>
  
  <bpmn:process id="${processId}" isExecutable="false">`;

    // Добавляем начальное событие
    xml += `
    <bpmn:startEvent id="StartEvent_1" name="Начало процесса">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>`;

    // Добавляем задачи
    elements.tasks.forEach((task, index) => {
        const flowId = `Flow_${index + 1}`;
        const nextFlowId = `Flow_${index + 2}`;
        
        xml += `
    <bpmn:${task.type} id="${task.id}" name="${task.name}">
      <bpmn:incoming>${flowId}</bpmn:incoming>
      <bpmn:outgoing>${nextFlowId}</bpmn:outgoing>
    </bpmn:${task.type}>`;
    });

    // Добавляем шлюзы
    elements.decisions.forEach((decision, index) => {
        const taskIndex = elements.tasks.length + index;
        const flowId = `Flow_${taskIndex + 1}`;
        const nextFlowId = `Flow_${taskIndex + 2}`;
        
        xml += `
    <bpmn:${decision.type} id="${decision.id}" name="${decision.name}">
      <bpmn:incoming>${flowId}</bpmn:incoming>
      <bpmn:outgoing>${nextFlowId}</bpmn:outgoing>
    </bpmn:${decision.type}>`;
    });

    // Добавляем потоки
    const totalElements = elements.tasks.length + elements.decisions.length;
    for (let i = 0; i <= totalElements; i++) {
        const flowId = `Flow_${i + 1}`;
        const sourceId = i === 0 ? 'StartEvent_1' : 
                        (i <= elements.tasks.length ? elements.tasks[i - 1].id : 
                         elements.decisions[i - elements.tasks.length - 1].id);
        const targetId = i === totalElements ? 'EndEvent_1' : 
                        (i < elements.tasks.length ? elements.tasks[i].id : 
                         elements.decisions[i - elements.tasks.length].id);
        
        xml += `
    <bpmn:sequenceFlow id="${flowId}" sourceRef="${sourceId}" targetRef="${targetId}" />`;
    }

    // Добавляем конечное событие
    xml += `
    
    <bpmn:endEvent id="EndEvent_1" name="Конец процесса">
      <bpmn:incoming>Flow_${totalElements + 1}</bpmn:incoming>
    </bpmn:endEvent>
  </bpmn:process>`;

    // Добавляем диаграмму
    xml += `
  
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${collaborationId}">`;

    // Добавляем пулы в диаграмму с правильными размерами
    elements.pools.forEach((pool, poolIndex) => {
        const poolY = poolIndex * 250;
        const poolHeight = pool.lanes.length > 0 ? 200 : 150;
        
        xml += `
      <bpmndi:BPMNShape id="${pool.id}_di" bpmnElement="${pool.id}">
        <dc:Bounds x="50" y="${poolY + 50}" width="900" height="${poolHeight}" />
      </bpmndi:BPMNShape>`;
        
        // Добавляем дорожки
        if (pool.lanes.length > 0) {
            const laneWidth = Math.floor(900 / pool.lanes.length);
            pool.lanes.forEach((lane, laneIndex) => {
                const laneX = 50 + laneIndex * laneWidth;
                xml += `
        <bpmndi:BPMNShape id="${lane.id}_di" bpmnElement="${lane.id}">
          <dc:Bounds x="${laneX}" y="${poolY + 50}" width="${laneWidth}" height="${poolHeight}" />
        </bpmndi:BPMNShape>`;
            });
        }
    });

    // Добавляем элементы процесса с правильным позиционированием
    xml += `
      
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="152" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>`;

    // Добавляем задачи в диаграмму с учетом пулов
    elements.tasks.forEach((task, index) => {
        const x = 250 + index * 200;
        const y = getTaskYPosition(task, elements.pools);
        
        xml += `
      <bpmndi:BPMNShape id="${task.id}_di" bpmnElement="${task.id}">
        <dc:Bounds x="${x}" y="${y}" width="100" height="80" />
      </bpmndi:BPMNShape>`;
    });

    // Добавляем шлюзы в диаграмму
    elements.decisions.forEach((decision, index) => {
        const x = 250 + (elements.tasks.length + index) * 200;
        const y = 95;
        
        xml += `
      <bpmndi:BPMNShape id="${decision.id}_di" bpmnElement="${decision.id}">
        <dc:Bounds x="${x}" y="${y}" width="50" height="50" />
      </bpmndi:BPMNShape>`;
    });

    // Добавляем конечное событие в диаграмму
    const endX = 250 + (elements.tasks.length + elements.decisions.length) * 200;
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
 * Определение Y-позиции задачи на основе пула
 */
function getTaskYPosition(task, pools) {
    // Находим пул для участника задачи
    for (let i = 0; i < pools.length; i++) {
        const pool = pools[i];
        const lane = pool.lanes.find(l => l.name === task.participant);
        if (lane) {
            return 80 + i * 250 + 50; // Позиция внутри пула
        }
    }
    
    // Если участник не найден в пулах, размещаем по умолчанию
    return 80;
}

/**
 * Отображение сгенерированной BPMN диаграммы
 */
async function displayGeneratedBPMN(bpmnXML) {
    if (!bpmnModeler) {
        throw new Error('BPMN Modeler не инициализирован');
    }

    try {
        // Импортируем XML в modeler
        await bpmnModeler.importXML(bpmnXML);
        
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
        
        product: `1. Бизнес-аналитик получает идею продукта от заказчика
2. Аналитик проводит анализ требований и создает ТЗ
3. Архитектор проектирует архитектуру системы
4. Разработчики создают продукт по спринтам
5. QA инженер тестирует каждый спринт
6. Если найдены дефекты, разработчики их исправляют
7. DevOps инженер разворачивает продукт в продакшн
8. Менеджер проекта координирует весь процесс`,
        
        medical: `1. Пациент записывается на прием к врачу
2. Регистратор проверяет документы пациента
3. Пациент проходит в кабинет врача
4. Врач проводит осмотр и ставит диагноз
5. Если требуется дополнительное обследование, назначаются анализы
6. Пациент сдает анализы в лаборатории
7. Результаты анализов передаются врачу
8. Врач назначает лечение
9. Пациент получает рецепт и рекомендации`,
        
        hr: `1. Отдел HR получает заявку на нового сотрудника
2. HR-специалист составляет описание вакансии
3. Вакансия публикуется на сайтах поиска работы
4. Кандидаты отправляют резюме
5. HR-специалист отбирает подходящих кандидатов
6. Проводится первичное собеседование по телефону
7. Если кандидат подходит, приглашается на личную встречу
8. Проводится интервью с руководителем отдела
9. При положительном решении кандидату предлагается работа
10. Новый сотрудник проходит оформление документов`,
        
        ecommerce: `1. Клиент выбирает товары на сайте
2. Добавляет товары в корзину
3. Оформляет заказ с указанием адреса доставки
4. Система проверяет наличие товаров на складе
5. Если товары есть, заказ подтверждается
6. Если товаров нет, заказ отменяется
7. Подтвержденный заказ передается в отдел логистики
8. Товары упаковываются и отправляются клиенту
9. Клиент получает товары и подтверждает доставку`
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
    link.download = `professional-process-${Date.now()}.bpmn`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('✅ Профессиональный BPMN файл скачан');
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
 * Скачивание SVG диаграммы
 */
async function downloadSVG() {
    if (!bpmnModeler) {
        alert('Сначала сгенерируйте BPMN диаграмму');
        return;
    }

    try {
        const result = await bpmnModeler.saveSVG();
        const { svg } = result;
        
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = 'professional-bpmn-diagram.svg';
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
        if (bpmnModeler) {
            bpmnModeler.get('canvas').resized();
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
window.downloadSVG = downloadSVG;
window.loadSampleBPMN = loadSampleBPMN;
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;
window.zoomReset = zoomReset;
