import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HomeSection from './components/HomeSection';
import ServicesSection from './components/ServicesSection';
import BarbersSection from './components/BarbersSection';
import BookingSection from './components/BookingSection';
import ChatSection from './components/ChatSection';

const API_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api` 
  : 'http://localhost:3001/api';


function App() {
    const [activeSection, setActiveSection] = useState('home');
    const [barbershop, setBarbershop] = useState(null);
    const [services, setServices] = useState([]);
    const [barbers, setBarbers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [shopResponse, servicesResponse, barbersResponse] = await Promise.all([
                    fetch(`${API_URL}/barbershop`),
                    fetch(`${API_URL}/services`),
                    fetch(`${API_URL}/barbers`)
                ]);

                setBarbershop(await shopResponse.json());
                setServices(await servicesResponse.json());
                setBarbers(await barbersResponse.json());
            } catch (error) {
                console.error('Failed to load site data:', error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const openSection = (section) => {
        setActiveSection(section);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="app-shell">
            <Header barbershop={barbershop} onBook={() => openSection('booking')} />

            <Navigation activeSection={activeSection} onChange={openSection} />

            <main className="section-frame">
                {activeSection === 'home' && (
                    <HomeSection
                        barbershop={barbershop}
                        services={services}
                        barbers={barbers}
                        loading={loading}
                        onNavigate={openSection}
                    />
                )}

                {activeSection === 'services' && (
                    <ServicesSection services={services} onBook={() => openSection('booking')} />
                )}

                {activeSection === 'barbers' && (
                    <BarbersSection barbers={barbers} onBook={() => openSection('booking')} />
                )}

                {activeSection === 'booking' && (
                    <BookingSection services={services} barbers={barbers} apiUrl={API_URL} />
                )}

                {activeSection === 'chat' && (
                    <ChatSection apiUrl={API_URL} onBook={() => openSection('booking')} />
                )}
            </main>
        </div>
    );
}

export default App;
