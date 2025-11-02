import axios from 'axios';

const TOKEN_KEY = 'zar_token';

// Configure axios base URL for API calls
axios.defaults.baseURL = process.env.REACT_APP_API_URL || '';

export function setToken(token){
  localStorage.setItem(TOKEN_KEY, token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  // Dispatch event to notify components of auth change
  try {
    window.dispatchEvent(new Event('auth-change'));
  } catch (e) {
    // Fallback for older browsers
    console.warn('Event dispatch failed', e);
  }
}

export function getToken(){
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken(){
  localStorage.removeItem(TOKEN_KEY);
  delete axios.defaults.headers.common['Authorization'];
  // Dispatch event to notify components of auth change
  try {
    window.dispatchEvent(new Event('auth-change'));
  } catch (e) {
    // Fallback for older browsers
    console.warn('Event dispatch failed', e);
  }
}

export function isAuthenticated(){
  return !!getToken();
}

// initialize axios header if token exists
const existing = getToken();
if (existing) axios.defaults.headers.common['Authorization'] = `Bearer ${existing}`;

export default axios;
