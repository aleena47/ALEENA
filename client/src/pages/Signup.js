import React, { useState } from 'react';
import axios, { setToken } from '../auth';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

function Signup(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    setError(null);
    try{
      console.log('Signing up with:', { email, name, password: '***' });
      const res = await axios.post('/api/auth/signup', { email, password, name });
      console.log('Signup response:', res.data);
      const { token } = res.data;
      if (token) {
        setToken(token);
        navigate('/profile');
      } else {
        setError('No token received');
      }
    } catch(err){
      console.error('Signup error:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      const errorMsg = err.response?.data?.error || err.message || 'Signup failed';
      const details = err.response?.data?.details;
      setError(details ? `${errorMsg} (${details})` : errorMsg);
    }
  }

  return (
    <div className="auth-page">
      <form onSubmit={submit} className="auth-form">
        <h2>Sign up</h2>
        <label>
          Name
          <input value={name} onChange={e=>setName(e.target.value)} required/>
        </label>
        <label>
          Email
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required/>
        </label>
        <label>
          Password
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required/>
        </label>
        <button type="submit">Create account</button>
        {error && <p className="error">{error}</p>}
        <p className="link-to-other">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
