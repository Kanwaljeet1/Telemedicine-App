import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '', role: 'patient' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // Simulate network delay
            await new Promise(r => setTimeout(r, 800));

            const users = JSON.parse(localStorage.getItem('users') || '[]');

            if (isLogin) {
                // LOGIN LOGIC
                const user = users.find(u => u.username === formData.username);

                if (!user) {
                    throw new Error('User not found. Please register.');
                }

                if (user.password !== formData.password) {
                    throw new Error('Invalid password.');
                }

                // Login successful
                localStorage.setItem('user', JSON.stringify({
                    username: user.username,
                    role: user.role
                }));

            } else {
                // REGISTRATION LOGIC
                if (users.find(u => u.username === formData.username)) {
                    throw new Error('Username already exists.');
                }

                const newUser = {
                    username: formData.username,
                    password: formData.password, // In a real app, never store plain text passwords!
                    role: formData.role,
                    department: formData.role === 'doctor' ? formData.department : null
                };

                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                // Auto-login after register
                localStorage.setItem('user', JSON.stringify({
                    username: newUser.username,
                    role: newUser.role,
                    department: newUser.department
                }));
            }

            navigate('/dashboard');

        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ maxWidth: '450px', width: '100%' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <div className="input-group">
                                <label className="input-label">Role</label>
                                <select
                                    className="input-field"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="patient">Patient</option>
                                    <option value="doctor">Doctor</option>
                                </select>
                            </div>

                            {formData.role === 'doctor' && (
                                <div className="input-group">
                                    <label className="input-label">Department</label>
                                    <select
                                        className="input-field"
                                        value={formData.department || ''}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        required
                                    >
                                        <option value="">-- Select Department --</option>
                                        <option value="General Medicine">General Medicine</option>
                                        <option value="Neurology">Neurology</option>
                                        <option value="Pediatrics">Pediatrics</option>
                                        <option value="Cardiology">Cardiology</option>
                                        <option value="Dermatology">Dermatology</option>
                                        <option value="Orthopedics">Orthopedics</option>
                                        <option value="Psychiatry">Psychiatry</option>
                                        <option value="Ophthalmology">Ophthalmology</option>
                                    </select>
                                </div>
                            )}
                        </>
                    )}

                    <div className="input-group">
                        <label className="input-label">Username</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Enter your username"
                            required
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    {error && (
                        <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ color: 'var(--primary)', fontWeight: '600' }}
                    >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Auth;
