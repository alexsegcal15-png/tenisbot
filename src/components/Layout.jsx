import { Outlet } from 'react-router-dom';
import { LogOut, Activity } from 'lucide-react';

export default function Layout() {
  const handleLogout = () => {
    localStorage.removeItem('itf_auth');
    localStorage.removeItem('itf_password');
    window.location.href = '/access';
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight">ITF Scout</h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5">Circuito Femenino</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground hover:bg-accent text-sm flex items-center gap-1.5 px-3 py-2 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Salir</span>
          </button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
