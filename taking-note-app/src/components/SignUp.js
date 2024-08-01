// src/components/SignUp.js
import React, { useRef, useState } from 'react';
import { useAuth } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SignUp = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return toast.error('Passwords do not match');
        }

        try {
            setLoading(true);
            await signup(emailRef.current.value, passwordRef.current.value);
            toast.success('Account created successfully');
            navigate('/login');
        } catch {
            toast.error('Failed to create an account');
        }

        setLoading(false);
    };

    return (
        <div className="signup-container">
            <div className="card">
                <h2 className="card-title">Sign Up</h2>
                <form onSubmit={handleSubmit} className="card-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" ref={emailRef} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" ref={passwordRef} required />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" ref={passwordConfirmRef} required />
                    </div>
                    <button disabled={loading} className="btn" type="submit">
                        Sign Up
                    </button>
                </form>
                <div className="card-footer">
                    Already have an account? <Link to="/login">Log In</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
