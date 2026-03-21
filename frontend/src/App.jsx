import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import VideoCall from './pages/VideoCall.jsx';
import About from './pages/About';
import ChatBot from './components/ChatBot';

const Layout = ({ children }) => {
    const location = useLocation();
    // Hide navbar on video call page for immersive experience
    const showNavbar = !location.pathname.startsWith('/video/');

    return (
        <>
            {showNavbar && <Navbar />}
            <main>{children}</main>
            <ChatBot />
        </>
    );
};

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Auth />} />
                    <Route path="/register" element={<Auth />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/video/:id" element={<VideoCall />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
