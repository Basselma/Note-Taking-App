// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navbar = () => {
    const { currentUser, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Failed to log out:", error);
        }
    };

    return (
        <nav className="navbar">
            <ul>
                {!currentUser && (
                    <>
                        <li className="nav-box">
                            <Link to="/signup">Sign Up</Link>
                        </li>
                        <li className="nav-box">
                            <Link to="/login">Login</Link>
                        </li>
                    </>
                )}
                {currentUser && (
                    <>
                        <li className="nav-box">
                            <Link to="/dashboard">Dashboard</Link>
                        </li>
                        <li className="nav-box">
                            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                Logout
                            </button>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
