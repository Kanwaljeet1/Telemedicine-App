import React from 'react';
import { Link } from 'react-router-dom';
import doctorBg from '../assets/doctor-bg.png';

const Home = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section style={{
                position: 'relative',
                padding: '10rem 0 8rem',
                backgroundImage: `url(${doctorBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white',
                overflow: 'hidden'
            }}>
                {/* Dark Gradient Overlay for Readability */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to right, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.7) 50%, rgba(15, 23, 42, 0.4) 100%)',
                    zIndex: 1
                }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ maxWidth: '650px' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'rgba(255,255,255,0.1)',
                            padding: '0.5rem 1rem',
                            borderRadius: '99px',
                            marginBottom: '1.5rem',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }} className="animate-fade-in">
                            <span style={{ color: '#38bdf8' }}>★</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>#1 Telemedicine Platform</span>
                        </div>

                        <h1 style={{
                            fontSize: '3.5rem',
                            lineHeight: '1.1',
                            marginBottom: '1.5rem',
                            background: 'linear-gradient(to right, #ffffff, #94a3b8)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }} className="animate-fade-in">
                            World-Class Care,<br /> Right at Home.
                        </h1>

                        <p style={{
                            fontSize: '1.25rem',
                            color: '#cbd5e1',
                            marginBottom: '2.5rem',
                            lineHeight: '1.8'
                        }} className="animate-fade-in">
                            skip the waiting room. Connect with certified doctors in minutes via secure video calls.
                            Your health, your schedule, our priority.
                        </p>

                        <div style={{ display: 'flex', gap: '1rem' }} className="animate-fade-in">
                            {!user ? (
                                <Link to="/login" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                                    Get Started Now
                                </Link>
                            ) : user.role === 'doctor' ? (
                                <Link to="/dashboard?tab=records" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                                    Manage Patients
                                </Link>
                            ) : (
                                <Link to="/dashboard" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                                    Go to Dashboard
                                </Link>
                            )}
                            <Link to="/about" className="btn btn-secondary" style={{
                                padding: '1rem 2rem',
                                fontSize: '1.1rem',
                                background: 'transparent',
                                color: 'white',
                                borderColor: 'white'
                            }}>
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Floating Stats Badge */}
                <div className="glass-panel" style={{
                    position: 'absolute',
                    bottom: '4rem',
                    right: '4rem',
                    padding: '1.5rem',
                    borderRadius: '1rem',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    animation: 'float 6s ease-in-out infinite'
                }}>
                    <div style={{
                        width: '50px', height: '50px',
                        borderRadius: '50%', background: '#22c55e',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem', color: 'white'
                    }}>
                        ✓
                    </div>
                    <div>
                        <div style={{ fontWeight: '700', fontSize: '1.2rem' }}>10k+</div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Active Patients</div>
                    </div>
                </div>
            </section>

            {/* Features / Why Choose Us */}
            <section style={{ padding: '6rem 0', background: 'var(--background)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Why Choose TeleMed?</h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                            We combine advanced technology with compassionate care to bring you the best healthcare experience possible.
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem'
                    }}>
                        {[
                            { title: 'Video Consultations', icon: '📹', desc: 'Secure, high-definition video calls with minimal latency.', color: 'var(--primary)' },
                            { title: 'Digital Prescriptions', icon: '📝', desc: 'Instant prescriptions sent directly to your pharmacy app.', color: 'var(--secondary)' },
                            { title: 'Secure Records', icon: '🔒', desc: 'Bank-grade encryption keeps your medical history safe.', color: 'var(--accent)' }
                        ].map((service, i) => (
                            <div key={i} className="card" style={{
                                padding: '2.5rem',
                                borderTop: `4px solid ${service.color}`,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}>
                                <div style={{
                                    width: '60px', height: '60px',
                                    background: `${service.color}20`, // 20% opacity hex
                                    borderRadius: '1rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '2rem',
                                    color: service.color
                                }}>
                                    {service.icon}
                                </div>
                                <h3 style={{ fontSize: '1.5rem' }}>{service.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
