import { Outlet, Navigate } from 'react-router-dom';

export default function AuthGate() {
  const isAuthed = localStorage.getItem('itf_auth') === 'true';
  if (!isAuthed) return <Navigate to="/access" replace />;
  return <Outlet />;
}
