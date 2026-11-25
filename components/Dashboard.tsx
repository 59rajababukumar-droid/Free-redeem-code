
import React, { useState } from 'react';
import { User, AppView } from '../types';
import VideoAd from './VideoAd';
import ScratchCard from './ScratchCard';
import LuckySpin from './LuckySpin';
import { sounds } from '../utils/sounds';

interface DashboardProps {
  user: User;
  onEarnPoints: (amount: number) => void;
  onNavigate: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onEarnPoints, onNavigate }) => {
  const [showAd, setShowAd] = useState(false);
  const [showScratch, setShowScratch] = useState(false);
  const [showSpin, setShowSpin] = useState(false);
  const [checkInClaimed, setCheckInClaimed] = useState(false);

  const instagramLink = "https://www.instagram.com/raja_____ji_600?igsh=MWN6YjBrN3Zuejg1Zg==";

  const dailyTasks = [
    { id: 1, title: 'Daily Check-in', points: 30, icon: 'fa-calendar-check', color: 'bg-blue-600' },
    { id: 2, title: 'Watch Ad (Earn +125)', points: 125, icon: 'fa-play-circle', color: 'bg-purple-600' },
    { id: 3, title: 'Lucky Spin', points: 50, icon: 'fa-spinner', color: 'bg-orange-600' },
    { id: 4, title: 'Scratch Card', points: 15, icon: 'fa-gift', color: 'bg-pink-600' },
  ];

  const handleTaskClick = (task: typeof dailyTasks[0]) => {
    sounds.playClick();
    if (task.id === 1) {
      if (checkInClaimed) {
        alert("Daily Check-in already claimed for today!");
        return;
      }
      onEarnPoints(task.points);
      setCheckInClaimed(true);
      sounds.playSuccess();
    } else if (task.id === 2) {
      setShowAd(true);
    } else if (task.id === 3) {
      setShowSpin(true);
    } else if (task.id === 4) {
      setShowScratch(true);
    }
  };

  const handleAdComplete = () => {
    onEarnPoints(125);
    setShowAd(false);
  };

  const handleScratchComplete = (amount: number) => {
    onEarnPoints(amount); 
    setShowScratch(false);
  };

  const handleSpinComplete = (amount: number) => {
    onEarnPoints(amount);
    setShowSpin(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {showAd && <VideoAd onComplete={handleAdComplete} />}
      {showScratch && <ScratchCard onComplete={handleScratchComplete} onClose={() => setShowScratch(false)} />}
      {showSpin && <LuckySpin onComplete={handleSpinComplete} onClose={() => setShowSpin(false)} />}
      
      {/* APP PHOTO / MAIN HERO BANNER */}
      <div className="relative overflow-hidden rounded-[32px] h-48 group shadow-2xl">
         <img 
            src="https://images.unsplash.com/photo-1614027164847-1b2809eb189d?auto=format&fit=crop&q=80&w=800" 
            alt="Hero" 
            className="w-full h-full object-cover brightness-[0.4] group-hover:scale-110 transition-transform duration-700"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-6 flex flex-col justify-end">
            <span className="text-red-500 font-black text-[10px] uppercase tracking-[0.3em] mb-1 italic">Welcome to Fire Redeem</span>
            <h2 className="text-3xl font-black font-orbitron text-white leading-none italic mb-2 tracking-tighter">WIN DAILY <br/><span className="text-red-600">REWARDS!</span></h2>
            <div className="flex gap-2">
              <div className="bg-red-600 h-1 w-12 rounded-full"></div>
              <div className="bg-white/20 h-1 w-4 rounded-full"></div>
            </div>
         </div>
      </div>

      {/* FF HACKS BANNER */}
      <div 
        onClick={() => onNavigate('HACKS')}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-950 to-zinc-950 p-1 border border-green-500/30 cursor-pointer active:scale-95 transition-all shadow-xl group"
      >
        <div className="bg-black/40 backdrop-blur-sm p-5 rounded-[22px] relative z-10 flex items-center justify-between">
           <div>
             <div className="flex items-center gap-2 mb-1">
               <span className="bg-green-500 text-black text-[9px] font-black px-2 py-0.5 rounded animate-pulse">FF MAX</span>
               <h2 className="text-xl font-black font-orbitron text-green-400 italic tracking-tighter">MOD TOOLS</h2>
             </div>
             <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Headshot • AimBot • 90 FPS</p>
           </div>
           <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center border border-green-500/20 group-hover:bg-green-500 group-hover:text-black transition-all">
             <i className="fas fa-microchip text-2xl"></i>
           </div>
        </div>
      </div>

      {/* INSTAGRAM BANNER */}
      <a 
        href={instagramLink}
        target="_blank"
        rel="noopener noreferrer"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-5 shadow-xl block active:scale-95 transition-all group"
      >
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
              <i className="fab fa-instagram text-white text-2xl"></i>
            </div>
            <div>
              <h3 className="text-white font-black text-sm font-orbitron italic">OFFICIAL INSTAGRAM</h3>
              <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest italic">Join for Gift Codes!</p>
            </div>
          </div>
          <i className="fas fa-external-link-alt text-white/50 group-hover:text-white transition-colors"></i>
        </div>
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      </a>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-5 rounded-[28px] flex flex-col items-center justify-center gap-2 border-white/5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500/30"></div>
          <i className="fas fa-crown text-yellow-500 text-2xl"></i>
          <span className="text-[9px] text-gray-500 uppercase tracking-widest font-black">Global Rank</span>
          <span className="text-xl font-black font-orbitron text-white italic">#458</span>
        </div>
        <div className="glass-card p-5 rounded-[28px] flex flex-col items-center justify-center gap-2 border-white/5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/30"></div>
          <i className="fas fa-fire-alt text-red-500 text-2xl animate-pulse"></i>
          <span className="text-[9px] text-gray-500 uppercase tracking-widest font-black">Fire Streak</span>
          <span className="text-xl font-black font-orbitron text-white italic">12 DAYS</span>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="pt-2">
        <div className="flex justify-between items-center mb-5 px-2">
          <h3 className="text-lg font-black font-orbitron italic text-white tracking-tighter">DAILY MISSIONS</h3>
          <span className="text-[9px] text-red-500 font-black bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20 uppercase tracking-widest">LIVE</span>
        </div>
        <div className="space-y-4">
          {dailyTasks.map(task => (
            <div 
              key={task.id} 
              onClick={() => handleTaskClick(task)}
              className={`glass-card p-4 rounded-[24px] flex items-center justify-between group transition-all cursor-pointer border-white/5 active:scale-98 shadow-lg ${task.id === 1 && checkInClaimed ? 'opacity-50 pointer-events-none' : 'hover:bg-white/10'}`}
            >
              <div className="flex items-center gap-5">
                <div className={`${task.color} w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl relative`}>
                  <i className={`fas ${task.id === 1 && checkInClaimed ? 'fa-check' : task.icon} text-white text-2xl`}></i>
                  {!checkInClaimed && task.id === 1 && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-lg flex items-center justify-center shadow-md">
                      <i className="fas fa-plus text-black text-[8px]"></i>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-black text-sm text-white italic">{task.title}</h4>
                  <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">{task.id === 1 && checkInClaimed ? 'Claimed Today' : `${task.points} Coins Reward`}</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-red-500/50 transition-colors">
                <i className={`fas ${task.id === 1 && checkInClaimed ? 'fa-check text-green-500' : 'fa-chevron-right text-gray-700 group-hover:text-red-500'} transition-colors`}></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
