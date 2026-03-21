import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = (path) => location.pathname === path;

    // Use state to make the navbar reactive to user changes
    const [user, setUser] = React.useState(() => {
        try {
            const saved = localStorage.getItem('user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    // Update user state when localStorage changes or location changes
    React.useEffect(() => {
        const updateUser = () => {
            try {
                const saved = localStorage.getItem('user');
                setUser(saved ? JSON.parse(saved) : null);
            } catch {
                setUser(null);
            }
        };

        // Update on location change (e.g., after navigation from Auth page)
        updateUser();

        // Listen for storage events (changes in other tabs/windows)
        window.addEventListener('storage', updateUser);

        return () => window.removeEventListener('storage', updateUser);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    return (
        <nav style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            borderBottom: '1px solid #e2e8f0'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '80px'
            }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: '800' }} className="gradient-text">
                    MediConnect
                </Link>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <NavLink to="/" active={isActive('/')}>Home</NavLink>
                    <NavLink to="/about" active={isActive('/about')}>About</NavLink>
                    {user && (
                        <NavLink
                            to="/dashboard?tab=appointments"
                            active={location.pathname === '/dashboard' && (!location.search || location.search.includes('tab=appointments') || location.search.includes('tab=prescriptions') || location.search.includes('tab=messages'))}
                        >
                            Dashboard
                        </NavLink>
                    )}
                    {user && user.role === 'doctor' && (
                        <NavLink
                            to="/dashboard?tab=records"
                            active={location.search.includes('tab=records')}
                        >
                            Patients
                        </NavLink>
                    )}

                    {!user ? (
                        <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                            Login
                        </Link>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="btn btn-secondary"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', border: '1px solid var(--error)', color: 'var(--error)' }}
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, children, active }) => (
    <Link
        to={to}
        style={{
            color: active ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: active ? '600' : '500',
            position: 'relative'
        }}
    >
        {children}
        {active && <span style={{
            position: 'absolute',
            bottom: '-4px',
            left: 0,
            width: '100%',
            height: '2px',
            background: 'var(--primary)',
            borderRadius: '2px'
        }} />}
    </Link>
);

export default Navbar;
