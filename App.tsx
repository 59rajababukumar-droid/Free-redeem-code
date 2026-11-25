
import React, { useState, useEffect } from 'react';
import { User, AppView } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Withdraw from './components/Withdraw';
import Referral from './components/Referral';
import Profile from './components/Profile';
import Play from './components/Play';
import Hacks from './components/Hacks';
import { sounds } from './utils/sounds';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('DASHBOARD');
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('fire_redeem_muted');
    return saved === 'true';
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('fire_redeem_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Handle Background Music based on login state
  useEffect(() => {
    if (user) {
      sounds.playBgMusic();
    } else {
      sounds.stopBgMusic();
    }
  }, [user]);

  useEffect(() => {
    sounds.setMuted(isMuted);
    localStorage.setItem('fire_redeem_muted', String(isMuted));
  }, [isMuted]);

  const handleLogin = (userData: User) => {
    sounds.playSuccess();
    setUser(userData);
    localStorage.setItem('fire_redeem_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    sounds.playClick();
    setUser(null);
    localStorage.removeItem('fire_redeem_user');
  };

  const updateBalance = (amount: number) => {
    if (user) {
      if (amount > 0) sounds.playCoin();
      const updatedUser = { ...user, balance: user.balance + amount };
      setUser(updatedUser);
      localStorage.setItem('fire_redeem_user', JSON.stringify(updatedUser));
    }
  };

  const navigate = (view: AppView) => {
    sounds.playClick();
    setCurrentView(view);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard user={user} onEarnPoints={(amount) => updateBalance(amount)} onNavigate={navigate} />;
      case 'PLAY':
        return <Play onReward={(amount) => updateBalance(amount)} />;
      case 'WITHDRAW':
        return <Withdraw user={user} onWithdraw={(amount) => updateBalance(-amount)} />;
      case 'REFERRAL':
        return <Referral user={user} />;
      case 'PROFILE':
        return <Profile user={user} onLogout={handleLogout} />;
      case 'HACKS':
        return <Hacks onNavigate={navigate} />;
      default:
        return <Dashboard user={user} onEarnPoints={(amount) => updateBalance(amount)} onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col max-w-md mx-auto relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-red-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 -right-24 w-64 h-64 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 pt-6 px-4 z-10">
        <header className="flex justify-between items-center mb-8 px-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 fire-gradient rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
              <i className="fas fa-fire text-white text-xl"></i>
            </div>
            <h1 className="font-orbitron text-xl font-bold fire-text-gradient">FIRE REDEEM</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center border-red-500/20 text-gray-400 hover:text-white transition-colors"
            >
              <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
            </button>
            <div className="glass-card px-4 py-1.5 rounded-full flex items-center gap-2 border border-red-500/20">
              <i className="fas fa-coins text-yellow-500"></i>
              <span className="font-bold text-lg">{user.balance}</span>
            </div>
          </div>
        </header>

        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass-card border-t border-white/10 z-50 flex justify-around items-center py-4 px-2 rounded-t-3xl">
        <button 
          onClick={() => navigate('DASHBOARD')}
          className={`flex flex-col items-center gap-1 transition-all ${currentView === 'DASHBOARD' ? 'text-red-500 scale-110' : 'text-gray-400'}`}
        >
          <i className="fas fa-home text-xl"></i>
          <span className="text-[10px] font-semibold">Home</span>
        </button>
        <button 
          onClick={() => navigate('PLAY')}
          className={`flex flex-col items-center gap-1 transition-all ${currentView === 'PLAY' ? 'text-red-500 scale-110' : 'text-gray-400'}`}
        >
          <div className="relative">
            <i className="fas fa-gamepad text-xl"></i>
            <span className="absolute -top-2 -right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </div>
          <span className="text-[10px] font-semibold">Play</span>
        </button>
        <button 
          onClick={() => navigate('WITHDRAW')}
          className={`flex flex-col items-center gap-1 transition-all ${currentView === 'WITHDRAW' ? 'text-red-500 scale-110' : 'text-gray-400'}`}
        >
          <i className="fas fa-wallet text-xl"></i>
          <span className="text-[10px] font-semibold">Withdraw</span>
        </button>
        <button 
          onClick={() => navigate('REFERRAL')}
          className={`flex flex-col items-center gap-1 transition-all ${currentView === 'REFERRAL' ? 'text-red-500 scale-110' : 'text-gray-400'}`}
        >
          <i className="fas fa-users text-xl"></i>
          <span className="text-[10px] font-semibold">Refer</span>
        </button>
        <button 
          onClick={() => navigate('PROFILE')}
          className={`flex flex-col items-center gap-1 transition-all ${currentView === 'PROFILE' ? 'text-red-500 scale-110' : 'text-gray-400'}`}
        >
          <i className="fas fa-user text-xl"></i>
          <span className="text-[10px] font-semibold">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default App;