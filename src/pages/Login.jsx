import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';
import logo from '../assets/chat.png';
import toast, { Toaster } from 'react-hot-toast';
import API from '../api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  });

  // ✅ On initial load, if token exists, go to /home (NO avatar check)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      try {
        navigate('/home');
      } catch (error) {
        localStorage.clear();
        navigate('/login');
      }
    }
  }, [navigate, location.pathname]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, username, email, password } = formData;

    if (!validateEmail(email)) return toast.error('Invalid email');
    if (!validatePassword(password)) return toast.error('Password must be at least 6 characters');

    const loadingToast = toast.loading(isRegistering ? 'Registering...' : 'Logging in...');

    try {
      if (isRegistering) {
        if (!fullName || !username) {
          toast.dismiss(loadingToast);
          return toast.error('Full name and username are required.');
        }

        const res = await API.post('/auth/register', {
          fullName,
          username,
          email,
          password,
        });

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        toast.dismiss(loadingToast);
        toast.success('Account created successfully!');
        setTimeout(() => navigate('/setavatar'), 1000);
      } else {
        const res = await API.post('/auth/login', { email, password });
        const user = res.data.user;
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(user));
        toast.dismiss(loadingToast);
        toast.success('Login successful!');
        setTimeout(() => navigate('/home'), 1000);
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div className="auth-container">
      <Toaster position="top-center" />
      <div className="auth-box">
        <img src={logo} alt="Logo" className="logo" />
        <h2>{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <input
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <input
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </>
          )}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <div className="password-input">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="eye-icon"
              style={{ cursor: 'pointer' }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
        </form>

        <p className="toggle-link">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}
          <span
            onClick={() => setIsRegistering(!isRegistering)}
            style={{ cursor: 'pointer', color: 'blue', marginLeft: '5px' }}
          >
            {isRegistering ? ' Login' : ' Register'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
