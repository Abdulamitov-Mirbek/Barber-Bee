import React, { useState, useEffect } from 'react';

// API Base URL
const API_URL = 'http://localhost:3001/api';

// ============================================
// STYLES
// ============================================
const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px',
        padding: '20px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
    },
    title: {
        color: '#e8d5b7',
        fontSize: '28px',
        marginBottom: '8px',
        fontWeight: '700',
    },
    subtitle: {
        color: '#a0a0a0',
        fontSize: '14px',
    },
    nav: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '30px',
        flexWrap: 'wrap',
    },
    navButton: {
        padding: '12px 24px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        background: 'rgba(255,255,255,0.1)',
        color: '#fff',
    },
    navButtonActive: {
        background: '#e8d5b7',
        color: '#1a1a2e',
    },
    card: {
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
    },
    cardTitle: {
        color: '#e8d5b7',
        fontSize: '20px',
        marginBottom: '16px',
        fontWeight: '600',
    },
    serviceItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '8px',
        marginBottom: '10px',
        border: '1px solid rgba(255,255,255,0.05)',
    },
    serviceName: {
        color: '#fff',
        fontSize: '15px',
    },
    servicePrice: {
        color: '#e8d5b7',
        fontSize: '16px',
        fontWeight: '700',
    },
    serviceDuration: {
        color: '#666',
        fontSize: '12px',
    },
    barberCard: {
        display: 'flex',
        gap: '16px',
        padding: '16px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '12px',
        marginBottom: '12px',
        border: '1px solid rgba(255,255,255,0.05)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    barberCardSelected: {
        border: '2px solid #e8d5b7',
        background: 'rgba(232,213,183,0.1)',
    },
    barberPhoto: {
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid #e8d5b7',
    },
    barberInfo: {
        flex: 1,
    },
    barberName: {
        color: '#fff',
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '4px',
    },
    barberSpecialty: {
        color: '#a0a0a0',
        fontSize: '13px',
        marginBottom: '8px',
    },
    barberLevel: {
        display: 'inline-block',
        padding: '4px 10px',
        background: 'rgba(232,213,183,0.2)',
        color: '#e8d5b7',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
    },
    button: {
        width: '100%',
        padding: '16px',
        background: '#e8d5b7',
        color: '#1a1a2e',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        marginTop: '16px',
    },
    buttonSecondary: {
        background: 'rgba(255,255,255,0.1)',
        color: '#fff',
    },
    input: {
        width: '100%',
        padding: '14px 16px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '15px',
        marginBottom: '12px',
        outline: 'none',
        transition: 'border-color 0.3s ease',
    },
    inputFocus: {
        borderColor: '#e8d5b7',
    },
    label: {
        color: '#a0a0a0',
        fontSize: '13px',
        marginBottom: '8px',
        display: 'block',
    },
    slotGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
        gap: '8px',
        marginTop: '12px',
    },
    slot: {
        padding: '10px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontSize: '14px',
        color: '#fff',
    },
    slotSelected: {
        background: '#e8d5b7',
        color: '#1a1a2e',
        borderColor: '#e8d5b7',
    },
    slotDisabled: {
        opacity: 0.3,
        cursor: 'not-allowed',
    },
    dateNav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    dateButton: {
        padding: '8px 16px',
        background: 'rgba(255,255,255,0.1)',
        border: 'none',
        borderRadius: '6px',
        color: '#fff',
        cursor: 'pointer',
    },
    dateDisplay: {
        color: '#e8d5b7',
        fontSize: '16px',
        fontWeight: '600',
    },
    chatMessage: {
        padding: '12px 16px',
        borderRadius: '12px',
        marginBottom: '12px',
        maxWidth: '80%',
    },
    chatBot: {
        background: 'rgba(255,255,255,0.1)',
        color: '#fff',
        marginRight: 'auto',
    },
    chatUser: {
        background: '#e8d5b7',
        color: '#1a1a2e',
        marginLeft: 'auto',
    },
    chatContainer: {
        maxHeight: '400px',
        overflowY: 'auto',
        marginBottom: '16px',
        padding: '16px',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '12px',
    },
    chatInput: {
        display: 'flex',
        gap: '10px',
    },
    promoBanner: {
        background: 'linear-gradient(135deg, #e8d5b7 0%, #d4c4a8 100%)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        textAlign: 'center',
    },
    promoTitle: {
        color: '#1a1a2e',
        fontSize: '18px',
        fontWeight: '700',
        marginBottom: '8px',
    },
    promoText: {
        color: '#333',
        fontSize: '14px',
    },
    infoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 0',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        color: '#a0a0a0',
    },
    infoIcon: {
        fontSize: '20px',
    },
    successMessage: {
        background: 'rgba(76,175,80,0.2)',
        border: '1px solid #4caf50',
        borderRadius: '8px',
        padding: '16px',
        color: '#4caf50',
        textAlign: 'center',
        marginBottom: '16px',
    },
    errorMessage: {
        background: 'rgba(244,67,54,0.2)',
        border: '1px solid #f44336',
        borderRadius: '8px',
        padding: '16px',
        color: '#f44336',
        textAlign: 'center',
        marginBottom: '16px',
    },
};

// ============================================
// MAIN APP COMPONENT
// ============================================
function App() {
    const [view, setView] = useState('home');
    const [barbershop, setBarbershop] = useState(null);
    const [services, setServices] = useState([]);
    const [barbers, setBarbers] = useState([]);

    // Booking state
    const [bookingStep, setBookingStep] = useState(0);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedBarber, setSelectedBarber] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [availableSlots, setAvailableSlots] = useState({});
    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [bookingResult, setBookingResult] = useState(null);
    const [bookingError, setBookingError] = useState(null);

    // Chat state
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');

    // Load initial data
    useEffect(() => {
        fetchBarbershopInfo();
        fetchServices();
        fetchBarbers();
    }, []);

    // Fetch barbershop info
    const fetchBarbershopInfo = async () => {
        try {
            const response = await fetch(`${API_URL}/barbershop`);
            const data = await response.json();
            setBarbershop(data);
        } catch (error) {
            console.error('Error fetching barbershop info:', error);
        }
    };

    // Fetch services
    const fetchServices = async () => {
        try {
            const response = await fetch(`${API_URL}/services`);
            const data = await response.json();
            setServices(data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    // Fetch barbers
    const fetchBarbers = async () => {
        try {
            const response = await fetch(`${API_URL}/barbers`);
            const data = await response.json();
            setBarbers(data);
        } catch (error) {
            console.error('Error fetching barbers:', error);
        }
    };

    // Fetch available slots
    const fetchSlots = async (date, barberId) => {
        try {
            let url = `${API_URL}/slots?date=${date}`;
            if (barberId) {
                url += `&barberId=${barberId}`;
            }
            const response = await fetch(url);
            const data = await response.json();
            setAvailableSlots(data);
        } catch (error) {
            console.error('Error fetching slots:', error);
        }
    };

    // Send chat message
    const sendChatMessage = async (message) => {
        // Add user message
        setChatMessages(prev => [...prev, { type: 'user', text: message }]);

        try {
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            const data = await response.json();

            // Add bot response
            setTimeout(() => {
                setChatMessages(prev => [...prev, { type: 'bot', ...data }]);
            }, 500);
        } catch (error) {
            console.error('Error sending chat message:', error);
        }
    };

    // Handle booking
    const handleBooking = async () => {
        setBookingError(null);

        try {
            const response = await fetch(`${API_URL}/appointments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientName,
                    clientPhone,
                    serviceId: selectedService.id,
                    barberId: selectedBarber?.id,
                    date: selectedDate,
                    time: selectedTime
                })
            });

            const data = await response.json();

            if (data.success) {
                setBookingResult(data);
            } else {
                setBookingError(data.error || 'Ошибка при записи');
            }
        } catch (error) {
            setBookingError('Ошибка соединения с сервером');
        }
    };

    // Format date for display
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' });
    };

    // Get dates for next 14 days
    const getAvailableDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            if (date.getDay() !== 0) { // Skip Sundays
                dates.push(date.toISOString().split('T')[0]);
            }
        }
        return dates;
    };

    // Reset booking
    const resetBooking = () => {
        setBookingStep(0);
        setSelectedService(null);
        setSelectedBarber(null);
        setSelectedDate('');
        setSelectedTime('');
        setClientName('');
        setClientPhone('');
        setBookingResult(null);
        setBookingError(null);
    };

    // ============================================
    // RENDER FUNCTIONS
    // ============================================

    const renderNavigation = () => (
        <div style={styles.nav}>
            <button
                style={{ ...styles.navButton, ...(view === 'home' ? styles.navButtonActive : {}) }}
                onClick={() => { setView('home'); resetBooking(); }}
            >
                🏠 Главная
            </button>
            <button
                style={{ ...styles.navButton, ...(view === 'services' ? styles.navButtonActive : {}) }}
                onClick={() => { setView('services'); resetBooking(); }}
            >
                ✂️ Услуги
            </button>
            <button
                style={{ ...styles.navButton, ...(view === 'barbers' ? styles.navButtonActive : {}) }}
                onClick={() => { setView('barbers'); resetBooking(); }}
            >
                👨 Мастера
            </button>
            <button
                style={{ ...styles.navButton, ...(view === 'booking' ? styles.navButtonActive : {}) }}
                onClick={() => { setView('booking'); resetBooking(); }}
            >
                📅 Запись
            </button>
            <button
                style={{ ...styles.navButton, ...(view === 'chat' ? styles.navButtonActive : {}) }}
                onClick={() => { setView('chat'); resetBooking(); }}
            >
                💬 Чат
            </button>
        </div>
    );

    const renderHome = () => (
        <div>
            {/* Promo Banner */}
            <div style={styles.promoBanner}>
                <div style={styles.promoTitle}>🎉 Акция недели!</div>
                <div style={styles.promoText}>Камуфляж седины со скидкой 15%</div>
            </div>

            {/* Barbershop Info */}
            <div style={styles.card}>
                <div style={styles.cardTitle}>О барбершопе</div>
                <p style={{ color: '#a0a0a0', marginBottom: '16px', lineHeight: '1.6' }}>
                    {barbershop?.concept || 'Мужской клуб с атмосферой брутальности и уюта'}
                </p>
                <div style={styles.infoRow}>
                    <span style={styles.infoIcon}>📍</span>
                    <span>{barbershop?.address || 'Адрес уточняется'}</span>
                </div>
                <div style={styles.infoRow}>
                    <span style={styles.infoIcon}>📞</span>
                    <span>{barbershop?.phone || '+7 XXX XXX-XX-XX'}</span>
                </div>
                <div style={styles.infoRow}>
                    <span style={styles.infoIcon}>🕐</span>
                    <span>{barbershop?.workingHours || '10:00 - 22:00'}</span>
                </div>
                <div style={styles.infoRow}>
                    <span style={styles.infoIcon}>🚇</span>
                    <span>{barbershop?.howToGet || 'Как добраться'}</span>
                </div>
                <div style={{ ...styles.infoRow, borderBottom: 'none' }}>
                    <span style={styles.infoIcon}>☕</span>
                    <span>Для гостей: {barbershop?.drinks?.join(', ') || 'Кофе, чай, виски'}</span>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={styles.card}>
                <div style={styles.cardTitle}>Быстрые действия</div>
                <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={() => setView('booking')}>
                    📅 Записаться на стрижку
                </button>
                <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={() => setView('services')}>
                    💰 Посмотреть цены
                </button>
                <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={() => setView('barbers')}>
                    👨 Выбрать мастера
                </button>
            </div>
        </div>
    );

    const renderServices = () => (
        <div style={styles.card}>
            <div style={styles.cardTitle}>Прайс-лист услуг</div>
            {services.map(service => (
                <div key={service.id} style={styles.serviceItem}>
                    <div>
                        <div style={styles.serviceName}>{service.name}</div>
                        <div style={styles.serviceDuration}>{service.duration} мин • {service.description}</div>
                    </div>
                    <div style={styles.servicePrice}>от {service.price} ₽</div>
                </div>
            ))}
        </div>
    );

    const renderBarbers = () => (
        <div style={styles.card}>
            <div style={styles.cardTitle}>Наши мастера</div>
            {barbers.map(barber => (
                <div key={barber.id} style={styles.barberCard}>
                    <img src={barber.photo} alt={barber.name} style={styles.barberPhoto} />
                    <div style={styles.barberInfo}>
                        <div style={styles.barberName}>{barber.name}</div>
                        <div style={styles.barberSpecialty}>{barber.specialization}</div>
                        <div style={styles.barberLevel}>{barber.level}</div>
                        <div style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>
                            ⭐ {barber.rating} ({barber.reviews} отзывов) • Опыт: {barber.experience}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderBooking = () => {
        // Step 0: Select service
        if (bookingStep === 0) {
            return (
                <div style={styles.card}>
                    <div style={styles.cardTitle}>Шаг 1: Выберите услугу</div>
                    {services.map(service => (
                        <div
                            key={service.id}
                            style={{
                                ...styles.serviceItem,
                                ...(selectedService?.id === service.id ? { borderColor: '#e8d5b7', background: 'rgba(232,213,183,0.1)' } : {})
                            }}
                            onClick={() => setSelectedService(service)}
                        >
                            <div>
                                <div style={styles.serviceName}>{service.name}</div>
                                <div style={styles.serviceDuration}>{service.duration} мин</div>
                            </div>
                            <div style={styles.servicePrice}>{service.price} ₽</div>
                        </div>
                    ))}
                    <button
                        style={{ ...styles.button, opacity: selectedService ? 1 : 0.5 }}
                        disabled={!selectedService}
                        onClick={() => setBookingStep(1)}
                    >
                        Далее →
                    </button>
                </div>
            );
        }

        // Step 1: Select barber
        if (bookingStep === 1) {
            return (
                <div style={styles.card}>
                    <div style={styles.cardTitle}>Шаг 2: Выберите мастера</div>
                    <div
                        style={{
                            ...styles.barberCard,
                            ...(selectedBarber === null ? { borderColor: '#e8d5b7', background: 'rgba(232,213,183,0.1)' } : {})
                        }}
                        onClick={() => setSelectedBarber(null)}
                    >
                        <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(232,213,183,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                            🎲
                        </div>
                        <div style={styles.barberInfo}>
                            <div style={styles.barberName}>Любой свободный мастер</div>
                            <div style={styles.barberSpecialty}>Система подберет ближайшее свободное время</div>
                        </div>
                    </div>
                    {barbers.map(barber => (
                        <div
                            key={barber.id}
                            style={{
                                ...styles.barberCard,
                                ...(selectedBarber?.id === barber.id ? styles.barberCardSelected : {})
                            }}
                            onClick={() => setSelectedBarber(barber)}
                        >
                            <img src={barber.photo} alt={barber.name} style={styles.barberPhoto} />
                            <div style={styles.barberInfo}>
                                <div style={styles.barberName}>{barber.name}</div>
                                <div style={styles.barberSpecialty}>{barber.specialization}</div>
                                <div style={styles.barberLevel}>{barber.level}</div>
                            </div>
                        </div>
                    ))}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={{ ...styles.button, ...styles.buttonSecondary, flex: 1 }} onClick={() => setBookingStep(0)}>
                            ← Назад
                        </button>
                        <button
                            style={{ ...styles.button, flex: 1, opacity: selectedService ? 1 : 0.5 }}
                            disabled={!selectedService}
                            onClick={() => {
                                setBookingStep(2);
                                fetchSlots(getAvailableDates()[0], selectedBarber?.id);
                            }}
                        >
                            Далее →
                        </button>
                    </div>
                </div>
            );
        }

        // Step 2: Select date and time
        if (bookingStep === 2) {
            const dates = getAvailableDates();

            return (
                <div style={styles.card}>
                    <div style={styles.cardTitle}>Шаг 3: Выберите дату и время</div>

                    {/* Date selection */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={styles.label}>Дата:</label>
                        <div style={styles.slotGrid}>
                            {dates.map(date => (
                                <div
                                    key={date}
                                    style={{
                                        ...styles.slot,
                                        ...(selectedDate === date ? styles.slotSelected : {})
                                    }}
                                    onClick={() => {
                                        setSelectedDate(date);
                                        setSelectedTime('');
                                        fetchSlots(date, selectedBarber?.id);
                                    }}
                                >
                                    {formatDate(date)}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Time selection */}
                    {selectedDate && (
                        <div>
                            <label style={styles.label}>Время:</label>
                            {availableSlots[selectedDate] && availableSlots[selectedDate].length > 0 ? (
                                <div style={styles.slotGrid}>
                                    {availableSlots[selectedDate].map(slot => (
                                        <div
                                            key={slot.id}
                                            style={{
                                                ...styles.slot,
                                                ...(selectedTime === slot.time ? styles.slotSelected : {})
                                            }}
                                            onClick={() => setSelectedTime(slot.time)}
                                        >
                                            {slot.time}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
                                    Нет свободных слотов на эту дату
                                </p>
                            )}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button style={{ ...styles.button, ...styles.buttonSecondary, flex: 1 }} onClick={() => setBookingStep(1)}>
                            ← Назад
                        </button>
                        <button
                            style={{ ...styles.button, flex: 1, opacity: selectedDate && selectedTime ? 1 : 0.5 }}
                            disabled={!selectedDate || !selectedTime}
                            onClick={() => setBookingStep(3)}
                        >
                            Далее →
                        </button>
                    </div>
                </div>
            );
        }

        // Step 3: Client info and confirmation
        if (bookingStep === 3) {
            return (
                <div style={styles.card}>
                    <div style={styles.cardTitle}>Шаг 4: Подтверждение записи</div>

                    {/* Booking summary */}
                    <div style={{ background: 'rgba(232,213,183,0.1)', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                        <div style={{ color: '#e8d5b7', fontWeight: '600', marginBottom: '12px' }}>Детали записи:</div>
                        <div style={{ color: '#fff', marginBottom: '8px' }}>✂️ {selectedService?.name} - {selectedService?.price} ₽</div>
                        <div style={{ color: '#fff', marginBottom: '8px' }}>👨 {selectedBarber ? selectedBarber.name : 'Любой мастер'}</div>
                        <div style={{ color: '#fff', marginBottom: '8px' }}>📅 {selectedDate && formatDate(selectedDate)}</div>
                        <div style={{ color: '#fff' }}>🕐 {selectedTime}</div>
                    </div>

                    {/* Error message */}
                    {bookingError && (
                        <div style={styles.errorMessage}>{bookingError}</div>
                    )}

                    {/* Success message */}
                    {bookingResult && (
                        <div style={styles.successMessage}>
                            <div style={{ fontSize: '24px', marginBottom: '8px' }}>✅</div>
                            <div style={{ fontWeight: '600', marginBottom: '8px' }}>Запись подтверждена!</div>
                            <div style={{ fontSize: '14px' }}>{bookingResult.message}</div>
                            <button style={{ ...styles.button, marginTop: '16px' }} onClick={resetBooking}>
                                Записаться снова
                            </button>
                        </div>
                    )}

                    {/* Client form */}
                    {!bookingResult && (
                        <>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={styles.label}>Ваше имя:</label>
                                <input
                                    type="text"
                                    style={styles.input}
                                    placeholder="Введите имя"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={styles.label}>Номер телефона:</label>
                                <input
                                    type="tel"
                                    style={styles.input}
                                    placeholder="+7 (XXX) XXX-XX-XX"
                                    value={clientPhone}
                                    onChange={(e) => setClientPhone(e.target.value)}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button style={{ ...styles.button, ...styles.buttonSecondary, flex: 1 }} onClick={() => setBookingStep(2)}>
                                    ← Назад
                                </button>
                                <button
                                    style={{ ...styles.button, flex: 1, opacity: clientName && clientPhone ? 1 : 0.5 }}
                                    disabled={!clientName || !clientPhone}
                                    onClick={handleBooking}
                                >
                                    Подтвердить запись
                                </button>
                            </div>
                        </>
                    )}
                </div>
            );
        }
    };

    const renderChat = () => (
        <div style={styles.card}>
            <div style={styles.cardTitle}>AI-ассистент</div>

            <div style={styles.chatContainer}>
                {chatMessages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                        Задайте вопрос или выберите тему:
                        <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                            <button style={{ ...styles.navButton, padding: '8px 16px' }} onClick={() => sendChatMessage('Какие у вас цены?')}>Цены</button>
                            <button style={{ ...styles.navButton, padding: '8px 16px' }} onClick={() => sendChatMessage('Хочу записаться')}>Записаться</button>
                            <button style={{ ...styles.navButton, padding: '8px 16px' }} onClick={() => sendChatMessage('Какие есть акции?')}>Акции</button>
                        </div>
                    </div>
                ) : (
                    chatMessages.map((msg, idx) => (
                        <div key={idx} style={{ ...styles.chatMessage, ...(msg.type === 'bot' ? styles.chatBot : styles.chatUser) }}>
                            <div style={{ marginBottom: '8px' }}>{msg.text || msg.message}</div>
                            {msg.suggestions && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                                    {msg.suggestions.map((s, i) => (
                                        <button
                                            key={i}
                                            style={{ ...styles.navButton, padding: '6px 12px', fontSize: '12px' }}
                                            onClick={() => sendChatMessage(s)}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {chatMessages.length > 0 && (
                <div style={styles.chatInput}>
                    <input
                        type="text"
                        style={{ ...styles.input, marginBottom: 0 }}
                        placeholder="Введите сообщение..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && chatInput && sendChatMessage(chatInput)}
                    />
                    <button
                        style={{ ...styles.button, width: 'auto', padding: '14px 20px', marginTop: 0 }}
                        onClick={() => { sendChatMessage(chatInput); setChatInput(''); }}
                        disabled={!chatInput}
                    >
                        ➤
                    </button>
                </div>
            )}
        </div>
    );

    // ============================================
    // MAIN RENDER
    // ============================================
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.title}>{barbershop?.name || "Gentleman's Club"}</div>
                <div style={styles.subtitle}>AI-ассистент администратора</div>
            </div>

            {renderNavigation()}

            {view === 'home' && renderHome()}
            {view === 'services' && renderServices()}
            {view === 'barbers' && renderBarbers()}
            {view === 'booking' && renderBooking()}
            {view === 'chat' && renderChat()}
        </div>
    );
}

export default App;
