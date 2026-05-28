import React, { useState } from 'react';

function BookingSection({ services, barbers, apiUrl }) {
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedBarber, setSelectedBarber] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [availableSlots, setAvailableSlots] = useState({});
    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [status, setStatus] = useState(null);

    const dates = getAvailableDates();

    const loadSlots = async (date, barberId) => {
        if (!date || !barberId) return;

        const response = await fetch(`${apiUrl}/slots?date=${date}&barberId=${barberId}`);
        const data = await response.json();
        setAvailableSlots(data);
    };

    const confirmBooking = async () => {
        setStatus(null);

        try {
            const response = await fetch(`${apiUrl}/appointments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientName,
                    clientPhone,
                    serviceId: selectedService.id,
                    barberId: selectedBarber.id,
                    date: selectedDate,
                    time: selectedTime
                })
            });

            const data = await response.json();
            setStatus(data.success ? { type: 'success', text: data.message } : { type: 'error', text: data.error });
        } catch (error) {
            setStatus({ type: 'error', text: 'Не удалось подключиться к серверу.' });
        }
    };

    const resetBooking = () => {
        setStep(1);
        setSelectedService(null);
        setSelectedBarber(null);
        setSelectedDate('');
        setSelectedTime('');
        setClientName('');
        setClientPhone('');
        setStatus(null);
    };

    return (
        <section className="panel booking-panel">
            <div className="section-title">
                <p className="eyebrow">Запись</p>
                <h2>Записаться онлайн</h2>
                <p>Четыре шага: услуга, мастер, время и ваши контакты.</p>
            </div>

            <div className="stepper" aria-label="Шаги записи">
                {[1, 2, 3, 4].map((number) => (
                    <span key={number} className={step >= number ? 'step active' : 'step'}>
                        {number}
                    </span>
                ))}
            </div>

            {step === 1 && (
                <div className="choice-list">
                    {services.map((service) => (
                        <button
                            key={service.id}
                            className={selectedService?.id === service.id ? 'choice-card selected' : 'choice-card'}
                            onClick={() => setSelectedService(service)}
                            type="button"
                        >
                            <span>
                                <strong>{service.name}</strong>
                                <small>{service.duration} мин</small>
                            </span>
                            <b>{service.price} сом</b>
                        </button>
                    ))}
                    <button
                        className="primary-action wide-action"
                        disabled={!selectedService}
                        onClick={() => setStep(2)}
                    >
                        Далее
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="choice-list">
                    {barbers.map((barber) => (
                        <button
                            key={barber.id}
                            className={selectedBarber?.id === barber.id ? 'barber-choice selected' : 'barber-choice'}
                            onClick={() => setSelectedBarber(barber)}
                            type="button"
                        >
                            <img src={barber.photo} alt={barber.name} />
                            <span>
                                <strong>{barber.name}</strong>
                                <small>{barber.specialization}</small>
                            </span>
                        </button>
                    ))}
                    <div className="button-pair">
                        <button className="ghost-action" onClick={() => setStep(1)}>
                            Назад
                        </button>
                        <button
                            className="primary-action"
                            disabled={!selectedBarber}
                            onClick={() => {
                                setStep(3);
                                const firstDate = dates[0];
                                setSelectedDate(firstDate);
                                loadSlots(firstDate, selectedBarber.id);
                            }}
                        >
                            Далее
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div>
                    <h3 className="small-title">Выберите дату</h3>
                    <div className="slot-grid">
                        {dates.map((date) => (
                            <button
                                key={date}
                                className={selectedDate === date ? 'slot selected' : 'slot'}
                                onClick={() => {
                                    setSelectedDate(date);
                                    setSelectedTime('');
                                    loadSlots(date, selectedBarber.id);
                                }}
                            >
                                {formatDate(date)}
                            </button>
                        ))}
                    </div>

                    <h3 className="small-title">Выберите время</h3>
                    <div className="slot-grid">
                        {(availableSlots[selectedDate] || []).map((slot) => (
                            <button
                                key={slot.id}
                                className={selectedTime === slot.time ? 'slot selected' : 'slot'}
                                onClick={() => setSelectedTime(slot.time)}
                            >
                                {slot.time}
                            </button>
                        ))}
                    </div>

                    {selectedDate && (availableSlots[selectedDate] || []).length === 0 && (
                        <p className="empty-state">На эту дату нет свободного времени. Выберите другой день.</p>
                    )}

                    <div className="button-pair">
                        <button className="ghost-action" onClick={() => setStep(2)}>
                            Назад
                        </button>
                        <button
                            className="primary-action"
                            disabled={!selectedDate || !selectedTime}
                            onClick={() => setStep(4)}
                        >
                            Далее
                        </button>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="confirmation-layout">
                    <div className="summary-box">
                        <h3>Детали записи</h3>
                        <p>{selectedService?.name}</p>
                        <p>{selectedBarber?.name}</p>
                        <p>
                            {selectedDate && formatDate(selectedDate)} в {selectedTime}
                        </p>
                    </div>

                    {status && <div className={`status-box ${status.type}`}>{status.text}</div>}

                    {status?.type !== 'success' ? (
                        <>
                            <label>
                                Имя
                                <input value={clientName} onChange={(event) => setClientName(event.target.value)} />
                            </label>
                            <label>
                                Телефон
                                <input value={clientPhone} onChange={(event) => setClientPhone(event.target.value)} />
                            </label>
                            <div className="button-pair">
                                <button className="ghost-action" onClick={() => setStep(3)}>
                                    Назад
                                </button>
                                <button
                                    className="primary-action"
                                    disabled={!clientName || !clientPhone}
                                    onClick={confirmBooking}
                                >
                                    Подтвердить
                                </button>
                            </div>
                        </>
                    ) : (
                        <button className="primary-action wide-action" onClick={resetBooking}>
                            Новая запись
                        </button>
                    )}
                </div>
            )}
        </section>
    );
}

function getAvailableDates() {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 14; i += 1) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        if (date.getDay() !== 0) {
            dates.push(date.toISOString().split('T')[0]);
        }
    }

    return dates;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('ru-RU', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    });
}

export default BookingSection;
