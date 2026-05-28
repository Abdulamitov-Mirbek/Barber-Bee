import React from 'react';

function Header({ barbershop, onBook }) {
    return (
        <header className="site-header">
            <div className="brand-mark">BB</div>
            <div className="hero-copy">
                <p className="eyebrow">Барбершоп в Бишкеке</p>
                <h1>{barbershop?.name || 'Barber Bee Бишкек'}</h1>
                <p>
                    Мужские стрижки, оформление бороды, опасное бритье и удобная
                    онлайн-запись без лишних звонков.
                </p>
            </div>
            <button className="primary-action" onClick={onBook}>
                Записаться
            </button>
        </header>
    );
}

export default Header;
