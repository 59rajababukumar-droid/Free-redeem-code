
import React from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const instagramLink = "https://www.instagram.com/raja_____ji_600?igsh=MWN6YjBrN3Zuejg1Zg==";

  const profileItems = [
    { icon: 'fa-history', label: 'Withdrawal History', color: 'text-blue-400' },
    { icon: 'fa-shield-alt', label: 'Privacy Policy', color: 'text-green-400' },
    { icon: 'fa-question-circle', label: 'Help & Support', color: 'text-purple-400' },
    { icon: 'fa-star', label: 'Rate Us', color: 'text-yellow-400' },
  ];

  return (
    <div className="space-y-6">
      {/* User Header */}
      <div className="text-center">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-red-600 to-orange-400">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden border-2 border-black">
              <img src={`https://picsum.photos/seed/${user.id}/200`} className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 border-4 border-black rounded-full flex items-center justify-center">
             <i className="fas fa-check text-[10px] text-white"></i>
          </div>
        </div>
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-xs text-gray-500 font-mono">{user.email || user.phone || 'fire_user_123'}</p>
      </div>

      {/* Balance Stats */}
      <div className="glass-card p-6 rounded-3xl grid grid-cols-2 gap-4 border-white/5 bg-white/5">
        <div className="text-center border-r border-white/10">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Earned</p>
          <p className="text-lg font-black font-orbitron text-yellow-500">2,450</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Withdrawn</p>
          <p className="text-lg font-black font-orbitron text-red-500">1,200</p>
        </div>
      </div>

      {/* Settings Menu */}
      <div className="space-y-2">
        {profileItems.map((item, index) => (
          <div 
            key={index}
            className="glass-card p-4 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer group border-white/5"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <i className={`fas ${item.icon} ${item.color} text-lg`}></i>
              </div>
              <span className="font-semibold text-sm">{item.label}</span>
            </div>
            <i className="fas fa-chevron-right text-gray-600 group-hover:translate-x-1 transition-transform"></i>
          </div>
        ))}

        {/* Social Link */}
        <a 
          href={instagramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card p-4 rounded-2xl flex items-center justify-between hover:bg-pink-600/10 transition-all border-pink-500/20 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-orange-500 flex items-center justify-center shadow-lg">
              <i className="fab fa-instagram text-white text-xl"></i>
            </div>
            <div>
              <span className="font-bold text-sm block">Official Instagram</span>
              <span className="text-[9px] text-pink-500 font-bold uppercase tracking-widest">Follow for Updates</span>
            </div>
          </div>
          <i className="fas fa-external-link-alt text-pink-600"></i>
        </a>
      </div>

      <button 
        onClick={onLogout}
        className="w-full bg-red-600/10 text-red-500 font-black py-4 rounded-2xl border border-red-500/20 hover:bg-red-600 hover:text-white transition-all shadow-xl active:scale-95 mt-4"
      >
        LOGOUT ACCOUNT
      </button>

      <div className="text-center pb-8">
        <p className="text-[10px] text-gray-600 font-bold tracking-[0.3em]">VERSION 1.0.4 - BETA</p>
      </div>
    </div>
  );
};

export default Profile;
