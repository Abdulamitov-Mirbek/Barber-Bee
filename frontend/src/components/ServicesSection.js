import React from 'react';

function ServicesSection({ services, onBook }) {
    return (
        <section className="panel">
            <div className="section-title">
                <p className="eyebrow">Прайс</p>
                <h2>Услуги</h2>
                <p>Сначала выберите услугу, затем мастера и удобное время в разделе записи.</p>
            </div>

            <div className="service-grid">
                {services.map((service) => (
                    <article className="service-card" key={service.id}>
                        <div>
                            <p className="service-category">{service.category || 'barber service'}</p>
                            <h3>{service.name}</h3>
                            <p>{service.description}</p>
                        </div>
                        <div className="service-meta">
                            <span>{service.duration} мин</span>
                            <strong>{service.price} сом</strong>
                        </div>
                    </article>
                ))}
            </div>

            <button className="primary-action wide-action" onClick={onBook}>
                Перейти к записи
            </button>
        </section>
    );
}

export default ServicesSection;
