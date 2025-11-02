import React, { useState } from 'react';
import axios, { setToken } from '../auth';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    setError(null);
    try{
      console.log('Logging in with:', { email, password: '***' });
      const res = await axios.post('/api/auth/login', { email, password });
      console.log('Login response:', res.data);
      const { token } = res.data;
      if (token) {
        setToken(token);
        navigate('/profile');
      } else {
        setError('No token received');
      }
    } catch(err){
      console.error('Login error:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      const errorMsg = err.response?.data?.error || err.message || 'Login failed';
      setError(errorMsg);
    }
  }

  return (
    <div className="auth-page">
      <form onSubmit={submit} className="auth-form">
        <h2>Login</h2>
        <label>
          Email
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required/>
        </label>
        <label>
          Password
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required/>
        </label>
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
        <p className="link-to-other">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
