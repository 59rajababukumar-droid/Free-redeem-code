
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  const mockGoogleLogin = () => {
    const mockUser: User = {
      id: 'google_' + Math.random().toString(36).substr(2, 9),
      name: 'Google User',
      email: 'user@gmail.com',
      balance: 50,
      referralCode: 'FIRE' + Math.floor(Math.random() * 9999),
      isLoggedIn: true,
    };
    onLogin(mockUser);
  };

  const handlePhoneLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      const mockUser: User = {
        id: 'phone_' + Math.random().toString(36).substr(2, 9),
        name: 'Guest User',
        phone: phone,
        balance: 50,
        referralCode: 'FIRE' + Math.floor(Math.random() * 9999),
        isLoggedIn: true,
      };
      onLogin(mockUser);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-6 max-w-md mx-auto overflow-hidden relative">
      {/* Decorative fires */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 text-9xl text-red-600/20 blur-sm">
        <i className="fas fa-fire"></i>
      </div>
      
      <div className="z-10 w-full text-center mb-12">
        <div className="w-24 h-24 fire-gradient rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-red-600/40 mb-6 animate-pulse">
          <i className="fas fa-fire text-white text-5xl"></i>
        </div>
        <h1 className="font-orbitron text-4xl font-black mb-2 fire-text-gradient tracking-widest">FIRE REDEEM</h1>
        <p className="text-gray-400 text-sm">Play, Earn, and Redeem Daily Rewards</p>
      </div>

      <div className="z-10 w-full space-y-4">
        {!showPhoneInput ? (
          <>
            <button 
              onClick={mockGoogleLogin}
              className="w-full bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all active:scale-95 shadow-xl"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
              Continue with Google
            </button>
            <button 
              onClick={() => setShowPhoneInput(true)}
              className="w-full bg-white/10 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/20 transition-all active:scale-95 border border-white/10 shadow-xl"
            >
              <i className="fas fa-phone"></i>
              Login with Phone Number
            </button>
          </>
        ) : (
          <form onSubmit={handlePhoneLogin} className="space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">+91</span>
              <input 
                type="tel" 
                placeholder="Enter Phone Number"
                className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-14 pr-4 text-white focus:outline-none focus:border-red-500 transition-all"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full fire-gradient text-white font-black py-4 rounded-2xl hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-red-600/20"
            >
              CONTINUE
            </button>
            <button 
              type="button"
              onClick={() => setShowPhoneInput(false)}
              className="w-full text-gray-400 text-sm font-semibold hover:text-white transition-all"
            >
              Back to more options
            </button>
          </form>
        )}
      </div>

      <div className="absolute bottom-8 text-center px-6">
        <p className="text-[10px] text-gray-500 leading-tight">
          By continuing, you agree to our Terms of Service and Privacy Policy. FIRE REDEEM is a reward platform.
        </p>
      </div>
    </div>
  );
};

export default Login;
