import React from 'react';

function HomeSection({ barbershop, services, barbers, loading, onNavigate }) {
    const popularServices = services.slice(0, 3);

    return (
        <section className="section-grid home-layout">
            <div className="panel intro-panel">
                <p className="eyebrow">Акция недели</p>
                <h2>Свежая стрижка, четкая борода и быстрая запись.</h2>
                <p>
                    {barbershop?.concept ||
                        'Современный барбершоп с точным сервисом, спокойной атмосферой и удобной онлайн-записью.'}
                </p>
                <div className="action-row">
                    <button className="primary-action" onClick={() => onNavigate('booking')}>
                        Выбрать время
                    </button>
                    <button className="ghost-action" onClick={() => onNavigate('services')}>
                        Посмотреть цены
                    </button>
                </div>
            </div>

            <div className="panel info-panel">
                <h3>Информация</h3>
                <dl className="info-list">
                    <div>
                        <dt>Адрес</dt>
                        <dd>{barbershop?.address || 'Адрес загружается'}</dd>
                    </div>
                    <div>
                        <dt>Телефон</dt>
                        <dd>{barbershop?.phone || '+7 XXX XXX-XX-XX'}</dd>
                    </div>
                    <div>
                        <dt>График</dt>
                        <dd>{barbershop?.workingHours || '10:00 - 22:00'}</dd>
                    </div>
                    <div>
                        <dt>Для гостей</dt>
                        <dd>{barbershop?.drinks?.join(', ') || 'кофе, чай, вода'}</dd>
                    </div>
                </dl>
            </div>

            <div className="panel stats-strip">
                <div>
                    <strong>{loading ? '...' : services.length}</strong>
                    <span>услуг</span>
                </div>
                <div>
                    <strong>{loading ? '...' : barbers.length}</strong>
                    <span>мастера</span>
                </div>
                <div>
                    <strong>15%</strong>
                    <span>скидка на камуфляж седины</span>
                </div>
            </div>

            <div className="panel service-preview">
                <div className="panel-heading">
                    <h3>Популярные услуги</h3>
                    <button className="text-action" onClick={() => onNavigate('services')}>
                        Все услуги
                    </button>
                </div>
                {popularServices.map((service) => (
                    <div className="compact-row" key={service.id}>
                        <div>
                            <strong>{service.name}</strong>
                            <span>{service.duration} мин</span>
                        </div>
                        <b>{service.price} сом</b>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default HomeSection;
