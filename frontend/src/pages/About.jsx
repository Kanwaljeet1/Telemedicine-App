import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="animate-fade-in">
            {/* Header/Hero */}
            <section style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                color: 'white',
                padding: '6rem 0 4rem',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{ marginBottom: '1rem' }}>About Our Mission</h1>
                    <p style={{ fontSize: '1.25rem', color: '#cbd5e1', maxWidth: '700px', margin: '0 auto' }}>
                        Democratizing access to world-class healthcare through technology.
                    </p>
                </div>
            </section>

            {/* Mission Story */}
            <section style={{ padding: '4rem 0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Healthcare Without Borders</h2>
                            <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                                Founded in 2025, TeleMed was built on a simple premise: quality healthcare should be accessible to everyone, everywhere.
                                We realized that distance, time, and bureaucracy were preventing millions from getting the care they needed.
                            </p>
                            <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                                Our platform bridges the gap between patients and specialists. Whether you live in a remote village or a bustling city,
                                our network of board-certified doctors is just a click away. We prioritize security, privacy, and most importantly, empathy.
                            </p>
                            <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem' }}>
                                <div>
                                    <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>24/7</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Support</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>50+</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Specialties</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>98%</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Satisfaction</div>
                                </div>
                            </div>
                        </div>
                        <div style={{
                            background: '#f1f5f9',
                            borderRadius: '2rem',
                            height: '400px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '5rem'
                        }}>
                            🏥
                            {/* Placeholder for an image */}
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section style={{ background: '#f8fafc', padding: '5rem 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2>Our Core Values</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                        {[
                            { title: 'Compassion First', icon: '❤️', desc: 'We treat every patient with dignity, respect, and kindness.' },
                            { title: 'Innovation', icon: '💡', desc: 'We leverage cutting-edge tech to improve outcomes.' },
                            { title: 'Integrity', icon: '🛡️', desc: 'We adhere to the highest ethical medical standards.' },
                            { title: 'Accessibility', icon: '🌍', desc: 'Healthcare for all, regardless of location or status.' }
                        ].map((val, i) => (
                            <div key={i} className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{val.icon}</div>
                                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>{val.title}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Mockup */}
            <section style={{ padding: '5rem 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2>Meet Our Specialists</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Led by world-renowned experts.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                        {[
                            { name: 'Dr. Sarah Smith', role: 'Head of Cardiology', color: '#ef4444' },
                            { name: 'Dr. Michael Green', role: 'Chief Neurologist', color: '#22c55e' },
                            { name: 'Dr. Emily White', role: 'Director of Pediatrics', color: '#3b82f6' },
                            { name: 'Dr. James Wilson', role: 'Senior Dermatologist', color: '#eab308' }
                        ].map((doc, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '120px', height: '120px',
                                    borderRadius: '50%',
                                    background: doc.color,
                                    margin: '0 auto 1rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontSize: '2.5rem', fontWeight: '700'
                                }}>
                                    {doc.name.charAt(4)}
                                </div>
                                <h4 style={{ fontSize: '1.1rem' }}>{doc.name}</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{doc.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '5rem 0', background: 'var(--primary)', color: 'white', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ marginBottom: '1.5rem' }}>Ready to prioritize your health?</h2>
                    <Link to="/register" className="btn" style={{
                        background: 'white',
                        color: 'var(--primary)',
                        padding: '1rem 2.5rem',
                        fontSize: '1.1rem'
                    }}>
                        Join TeleMed Today
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default About;
