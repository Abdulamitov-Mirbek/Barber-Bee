import React from 'react';

function BarbersSection({ barbers, onBook }) {
    return (
        <section className="panel">
            <div className="section-title">
                <p className="eyebrow">Команда</p>
                <h2>Мастера</h2>
                <p>Выберите мастера по специализации, опыту и стилю работы.</p>
            </div>

            <div className="barber-grid">
                {barbers.map((barber) => (
                    <article className="barber-profile" key={barber.id}>
                        <img src={barber.photo} alt={barber.name} />
                        <div>
                            <h3>{barber.name}</h3>
                            <p>{barber.specialization}</p>
                            <div className="tag-row">
                                <span>{barber.level}</span>
                                <span>{barber.experience}</span>
                                <span>рейтинг {barber.rating}</span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <button className="primary-action wide-action" onClick={onBook}>
                Записаться к мастеру
            </button>
        </section>
    );
}

export default BarbersSection;
