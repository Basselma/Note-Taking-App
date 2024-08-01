// src/components/Login.js
import React, { useRef, useState } from 'react';
import { useAuth } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            toast.success('Logged in successfully');
            navigate('/dashboard');
        } catch {
            toast.error('Failed to log in');
        }

        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="card">
                <h2 className="card-title">Login</h2>
                <form onSubmit={handleSubmit} className="card-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" ref={emailRef} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" ref={passwordRef} required />
                    </div>
                    <button disabled={loading} className="btn" type="submit">
                        Log In
                    </button>
                </form>
                <div className="card-footer">
                    Need an account? <Link to="/signup">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
