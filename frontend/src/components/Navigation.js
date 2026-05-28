import React from 'react';

const items = [
    { id: 'home', label: 'Главная' },
    { id: 'services', label: 'Услуги' },
    { id: 'barbers', label: 'Мастера' },
    { id: 'booking', label: 'Запись' },
    { id: 'chat', label: 'AI-чат' }
];

function Navigation({ activeSection, onChange }) {
    return (
        <nav className="section-nav" aria-label="Основные разделы">
            {items.map((item) => (
                <button
                    key={item.id}
                    className={activeSection === item.id ? 'nav-pill active' : 'nav-pill'}
                    onClick={() => onChange(item.id)}
                    type="button"
                >
                    {item.label}
                </button>
            ))}
        </nav>
    );
}

export default Navigation;
