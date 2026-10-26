import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthForm({ mode, admin }) {
  const reg = mode === 'register';
  const [f, setF] = useState({ username: '', email: '', password: '', confirm: '', adminKey: '' });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (reg && f.password !== f.confirm) return setErr('Passwords do not match');
    setBusy(true);
    try {
      const url = `/auth/${admin ? 'admin/' : ''}${reg ? 'register' : 'login'}`;
      const { data } = await api.post(url, reg ? { username: f.username, email: f.email, password: f.password, adminKey: f.adminKey } : { email: f.email, password: f.password });
      login(data);
      nav(data.role === 'admin' ? '/admin' : '/movies');
    } catch (e2) { setErr(errMsg(e2)); } finally { setBusy(false); }
  };

  const other = admin ? (reg ? '/admin/login' : '/admin/register') : (reg ? '/login' : '/register');
  return (
    <form className="panel form narrow" onSubmit={submit}>
      <h2>{admin ? 'Admin ' : ''}{reg ? 'Register' : 'Login'}</h2>
      {err && <p className="error" role="alert">{err}</p>}
      {reg && <label>Username<input required minLength={3} maxLength={20} value={f.username} onChange={set('username')} /></label>}
      <label>Email<input type="email" required value={f.email} onChange={set('email')} /></label>
      <label>Password<input type={show ? 'text' : 'password'} required minLength={8} value={f.password} onChange={set('password')} /></label>
      {reg && <label>Confirm password<input type={show ? 'text' : 'password'} required value={f.confirm} onChange={set('confirm')} /></label>}
      {reg && admin && <label>Admin key<input type="password" required value={f.adminKey} onChange={set('adminKey')} /></label>}
      <label className="check"><input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} /> Show password</label>
      <button className="btn btn-primary" disabled={busy}>{busy ? 'Please wait…' : 'Submit'}</button>
      <p className="muted center">{reg ? 'Already have an account?' : 'New here?'} <Link to={other}>{reg ? 'Login' : 'Register'}</Link></p>
      {!admin && !reg && <p className="muted center"><Link to="/admin/login">Admin login</Link></p>}
    </form>
  );
}
