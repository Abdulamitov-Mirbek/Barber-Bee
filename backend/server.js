const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());


const BARBERSHOP_INFO = {
    name: "Barber Bee Бишкек",
    concept: "Современный барбершоп в Бишкеке: мужские стрижки, борода, бритье и спокойная запись онлайн.",
    address: "г. Бишкек, ул. Киевская, 95",
    phone: "+996 555 123 456",
    workingHours: "Пн-Сб: 10:00 - 22:00",
    howToGet: "Центр города, рядом с ТЦ Бишкек Парк",
    drinks: ["кофе", "чай", "вода"],
    latitude: 42.8746,
    longitude: 74.5698
};

// Прайс-лист услуг (БЛОК 2)
const SERVICES = [
    { id: 1, name: "Мужская стрижка", category: "стрижка", price: 1200, duration: 40, description: "Классическая мужская стрижка ножницами и машинкой" },
    { id: 2, name: "Стрижка машинкой", category: "стрижка", price: 700, duration: 20, description: "Быстрая аккуратная стрижка одной машинкой" },
    { id: 3, name: "Модельная стрижка", category: "стрижка", price: 1600, duration: 50, description: "Подбор формы, стрижка и укладка" },
    { id: 4, name: "Детская стрижка", category: "стрижка", price: 900, duration: 30, description: "Стрижка для детей до 12 лет" },
    { id: 5, name: "Моделирование бороды", category: "борода", price: 1000, duration: 30, description: "Коррекция формы бороды и контуров" },
    { id: 6, name: "Опасное бритье", category: "бритье", price: 1300, duration: 40, description: "Классическое бритье с горячим полотенцем" },
    { id: 7, name: "Стрижка + борода", category: "комбо", price: 2000, duration: 70, description: "Полный уход: стрижка и оформление бороды" },
    { id: 8, name: "Камуфляж седины", category: "цвет", price: 2200, duration: 60, description: "Натуральное тонирование седины" },
    { id: 9, name: "Укладка", category: "стайлинг", price: 500, duration: 20, description: "Финишная укладка с профессиональными средствами" },
    { id: 10, name: "Консультация барбера", category: "консультация", price: 400, duration: 20, description: "Подбор стрижки и ухода под ваш стиль" }
];

// Мастера (БЛОК 1)
const BARBERS = [
    {
        id: 1,
        name: "Ислам",
        nickname: "Islam",
        specialization: "Мужские стрижки, фейд, камуфляж седины",
        level: "Топ-мастер",
        experience: "8 лет",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
        rating: 4.9,
        reviews: 156
    },
    {
        id: 2,
        name: "Мирбек",
        nickname: "Mirbek",
        specialization: "Борода, опасное бритье, классика",
        level: "Старший мастер",
        experience: "6 лет",
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
        rating: 4.8,
        reviews: 98
    },
    {
        id: 3,
        name: "Адилет",
        nickname: "Adilet",
        specialization: "Модельные стрижки, укладка",
        level: "Мастер",
        experience: "4 года",
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
        rating: 4.7,
        reviews: 72
    },
    {
        id: 4,
        name: "Нурсултан",
        nickname: "Nursultan",
        specialization: "Мужские стрижки, борода",
        level: "Мастер",
        experience: "3 года",
        photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop",
        rating: 4.6,
        reviews: 45
    }
];

// Расписание - слоты для записи (БЛОК 3)
// Генерируем слоты на ближайшие 2 недели
function generateTimeSlots() {
    const slots = [];
    const today = new Date();

    for (let day = 0; day < 14; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() + day);

        // Пропускаем воскресенье
        if (date.getDay() === 0) continue;

        // Рабочие часы: 10:00 - 21:00
        for (let hour = 10; hour < 21; hour++) {
            for (let barber of BARBERS) {
                // 70% вероятность что слот свободен
                if (Math.random() > 0.3) {
                    slots.push({
                        id: uuidv4(),
                        barberId: barber.id,
                        barberName: barber.name,
                        date: date.toISOString().split('T')[0],
                        time: `${hour.toString().padStart(2, '0')}:00`,
                        available: true
                    });
                }
            }
        }
    }
    return slots;
}

let TIME_SLOTS = generateTimeSlots();

// Записи клиентов (БЛОК 3)
let APPOINTMENTS = [];

// Статистика (БЛОК - Technical Requirements)
let STATISTICS = {
    totalRequests: 0,
    popularServices: {},
    popularTimes: {},
    newClients: 0,
    returningClients: 0
};

// ============================================
// API ENDPOINTS
// ============================================

// БЛОК 1: Получить информацию о барбершопе
app.get('/api/barbershop', (req, res) => {
    STATISTICS.totalRequests++;
    res.json(BARBERSHOP_INFO);
});

// БЛОК 1: Получить список мастеров
app.get('/api/barbers', (req, res) => {
    STATISTICS.totalRequests++;
    res.json(BARBERS);
});

// БЛОК 1: Получить конкретного мастера
app.get('/api/barbers/:id', (req, res) => {
    const barber = BARBERS.find(b => b.id === parseInt(req.params.id));
    if (!barber) {
        return res.status(404).json({ error: 'Мастер не найден' });
    }
    res.json(barber);
});

// БЛОК 2: Получить прайс-лист
app.get('/api/services', (req, res) => {
    STATISTICS.totalRequests++;
    const { category } = req.query;

    let filteredServices = SERVICES;
    if (category) {
        filteredServices = SERVICES.filter(s => s.category === category);
    }

    // Обновляем статистику
    STATISTICS.totalRequests++;
    res.json(filteredServices);
});

// БЛОК 2: Получить конкретную услугу
app.get('/api/services/:id', (req, res) => {
    const service = SERVICES.find(s => s.id === parseInt(req.params.id));
    if (!service) {
        return res.status(404).json({ error: 'Услуга не найдена' });
    }
    res.json(service);
});

// БЛОК 3: Поиск свободных слотов
app.get('/api/slots', (req, res) => {
    const { date, barberId } = req.query;

    let availableSlots = TIME_SLOTS.filter(slot => slot.available);

    if (date) {
        availableSlots = availableSlots.filter(slot => slot.date === date);
    }

    if (barberId) {
        availableSlots = availableSlots.filter(slot => slot.barberId === parseInt(barberId));
    }

    // Группируем по датам для удобства
    const slotsByDate = {};
    availableSlots.forEach(slot => {
        if (!slotsByDate[slot.date]) {
            slotsByDate[slot.date] = [];
        }
        slotsByDate[slot.date].push(slot);
    });

    res.json(slotsByDate);
});

// БЛОК 3: Записать клиента
app.post('/api/appointments', (req, res) => {
    const { clientName, clientPhone, serviceId, barberId, date, time } = req.body;

    // Валидация
    if (!clientName || !clientPhone || !serviceId || !date || !time) {
        return res.status(400).json({ error: 'Заполните все обязательные поля' });
    }

    const service = SERVICES.find(s => s.id === serviceId);
    const barber = BARBERS.find(b => b.id === barberId);

    if (!service || !barber) {
        return res.status(400).json({ error: 'Услуга или мастер не найдены' });
    }

    // Проверяем доступность слота
    const slot = TIME_SLOTS.find(s =>
        s.date === date &&
        s.time === time &&
        s.barberId === barberId &&
        s.available
    );

    if (!slot) {
        return res.status(400).json({ error: 'Это время уже занято' });
    }

    // Создаем запись
    const appointment = {
        id: uuidv4(),
        clientName,
        clientPhone,
        serviceId,
        serviceName: service.name,
        servicePrice: service.price,
        barberId,
        barberName: barber.name,
        date,
        time,
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };

    APPOINTMENTS.push(appointment);

    // Отмечаем слот как занятый
    slot.available = false;

    // Обновляем статистику
    const timeKey = `${date} ${time}`;
    STATISTICS.popularTimes[timeKey] = (STATISTICS.popularTimes[timeKey] || 0) + 1;
    STATISTICS.popularServices[service.name] = (STATISTICS.popularServices[service.name] || 0) + 1;

    res.json({
        success: true,
        appointment,
        message: `Запись подтверждена: ${service.name} к ${barber.name} ${date} в ${time}. Ждем вас!`
    });
});

// БЛОК 3: Получить запись клиента
app.get('/api/appointments', (req, res) => {
    const { clientName, clientPhone } = req.query;

    let appointments = APPOINTMENTS;

    if (clientName) {
        appointments = appointments.filter(a =>
            a.clientName.toLowerCase().includes(clientName.toLowerCase())
        );
    }

    if (clientPhone) {
        appointments = appointments.filter(a => a.clientPhone.includes(clientPhone));
    }

    res.json(appointments);
});

// БЛОК 4: Отменить запись
app.delete('/api/appointments/:id', (req, res) => {
    const { id } = req.params;
    const { confirm } = req.query;

    if (confirm !== 'true') {
        return res.status(400).json({
            error: 'Подтвердите отмену',
            message: 'Добавьте параметр confirm=true для подтверждения отмены'
        });
    }

    const appointmentIndex = APPOINTMENTS.findIndex(a => a.id === id);

    if (appointmentIndex === -1) {
        return res.status(404).json({ error: 'Запись не найдена' });
    }

    const appointment = APPOINTMENTS[appointmentIndex];

    // Освобождаем слот
    const slot = TIME_SLOTS.find(s =>
        s.date === appointment.date &&
        s.time === appointment.time &&
        s.barberId === appointment.barberId
    );

    if (slot) {
        slot.available = true;
    }

    // Удаляем запись
    APPOINTMENTS.splice(appointmentIndex, 1);

    res.json({
        success: true,
        message: 'Запись отменена'
    });
});

// БЛОК 5: Обработка нестандартных ситуаций
app.post('/api/chat', (req, res) => {
    const { message, context } = req.body;

    const lowerMessage = message.toLowerCase();
    let response = {};

    // Сценарий 1: Открытый вопрос о стрижке
    if (lowerMessage.includes('какая стрижка') || lowerMessage.includes('подойдет') || lowerMessage.includes('посоветуй')) {
        response = {
            type: 'fallback',
            message: "Я могу помочь с записью, но для консультации по стилю лучше подойдут наши барберы. Хотите, запишу вас на консультацию к мастеру?",
            action: 'offer_consultation'
        };
    }
    // Сценарий 2: Клиент недоволен
    else if (lowerMessage.includes('жалоба') || lowerMessage.includes('недоволен') || lowerMessage.includes('плохо') || lowerMessage.includes('ужасно')) {
        response = {
            type: 'fallback',
            message: "Приношу извинения за неудобства. Я передаю ваш контакт управляющему, чтобы он лично решил этот вопрос.",
            action: 'connect_manager'
        };
    }
    // Сценарий 3: Услуга не найдена
    else if (lowerMessage.includes('женск') || lowerMessage.includes('девочк') || lowerMessage.includes('маникюр')) {
        response = {
            type: 'fallback',
            message: "Мы специализируемся на мужских стрижках. Могу предложить услуги для ваших детей или классическую мужскую стрижку.",
            action: 'offer_alternative'
        };
    }
    // Приветствие
    else if (lowerMessage.includes('привет') || lowerMessage.includes('здравствуй') || lowerMessage.includes('добрый')) {
        response = {
            type: 'greeting',
            message: "Добрый день! Это AI-ассистент Barber Bee Бишкек. Чем могу помочь?",
            suggestions: ["Узнать цены в сомах", "Записаться к мастеру", "Посмотреть свободное время"]
        };
    }
    // Запрос акции
    else if (lowerMessage.includes('акция') || lowerMessage.includes('скидка') || lowerMessage.includes('бонус')) {
        response = {
            type: 'promo',
            message: "У нас сейчас действует акция: при записи на камуфляж седины на этой неделе скидка 15%. Также в день рождения дарим скидку 20% на любую услугу.",
            action: 'offer_promo'
        };
    }
    // Общий ответ
    else {
        response = {
            type: 'general',
            message: "Я могу помочь с записью на стрижку, ценами в сомах и выбором мастера. Что вас интересует?",
            suggestions: ["Прайс-лист", "Записаться", "Выбрать мастера"]
        };
    }

    res.json(response);
});

// Statistics endpoint
app.get('/api/statistics', (req, res) => {
    res.json({
        ...STATISTICS,
        totalAppointments: APPOINTMENTS.length
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Barbershop API server running on port ${PORT}`);
});
