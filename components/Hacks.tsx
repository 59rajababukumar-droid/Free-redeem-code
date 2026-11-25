
import React, { useState, useEffect, useRef } from 'react';
import { AppView } from '../types';
import { sounds } from '../utils/sounds';

interface HacksProps {
  onNavigate: (view: AppView) => void;
}

const Hacks: React.FC<HacksProps> = ({ onNavigate }) => {
  const [activeHacks, setActiveHacks] = useState<number[]>([]);
  const [showConsole, setShowConsole] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const consoleRef = useRef<HTMLDivElement>(null);

  const hacksList = [
    { id: 1, name: 'AUTO HEADSHOT', description: '99% Headshot Rate', icon: 'fa-crosshairs', color: 'text-red-500' },
    { id: 2, name: 'AIMBOT LOCK', description: 'Auto Lock on Enemy', icon: 'fa-lock', color: 'text-blue-500' },
    { id: 3, name: '90 FPS UNLOCK', description: 'Smooth Gameplay', icon: 'fa-tachometer-alt', color: 'text-yellow-500' },
    { id: 4, name: 'WALL HACK (ESP)', description: 'See Enemies Through Walls', icon: 'fa-eye', color: 'text-green-500' },
    { id: 5, name: 'MAGIC BULLET', description: 'High Damage Bullets', icon: 'fa-magic', color: 'text-purple-500' },
    { id: 6, name: 'DIAMOND GLITCH', description: 'Server Injector (Visual)', icon: 'fa-gem', color: 'text-cyan-400' },
  ];

  const logMessages = [
    "Connecting to FF Max servers...",
    "Bypassing Anti-Cheat System...",
    "Injecting `headshot_v2.dll`...",
    "Modifying memory address 0x45F...",
    "Stabilizing FPS...",
    "Connecting to user account...",
    "Applying patch...",
    "Verification pending...",
    "SUCCESS: Script Injected Successfully!",
  ];

  const toggleHack = (id: number) => {
    sounds.playClick();
    
    if (activeHacks.includes(id)) {
      setActiveHacks(prev => prev.filter(h => h !== id));
      return;
    }

    // Start activation sequence
    setShowConsole(true);
    setConsoleLogs([]);
    let step = 0;

    const interval = setInterval(() => {
      if (step >= logMessages.length) {
        clearInterval(interval);
        setTimeout(() => {
          setShowConsole(false);
          setActiveHacks(prev => [...prev, id]);
          sounds.playSuccess();
        }, 1000);
        return;
      }
      
      setConsoleLogs(prev => [...prev, logMessages[step]]);
      if (step % 2 === 0 && window.navigator.vibrate) window.navigator.vibrate(20);
      sounds.playPop(); // Typing sound effect
      step++;
    }, 400);
  };

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleLogs]);

  return (
    <div className="min-h-full pb-20 animate-fadeIn relative">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => onNavigate('DASHBOARD')}
          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10"
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <div>
          <h2 className="text-2xl font-black font-orbitron text-green-500 tracking-wider">FF MAX TOOLS</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Mod Menu Simulator</p>
        </div>
      </div>

      {/* Grid of Hacks */}
      <div className="grid grid-cols-1 gap-4">
        {hacksList.map((hack) => (
          <div 
            key={hack.id}
            onClick={() => toggleHack(hack.id)}
            className={`relative overflow-hidden rounded-2xl p-4 border transition-all cursor-pointer active:scale-98 ${
              activeHacks.includes(hack.id) 
                ? 'bg-green-900/20 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]' 
                : 'bg-white/5 border-white/5 hover:bg-white/10'
            }`}
          >
             <div className="flex items-center justify-between z-10 relative">
               <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-black/40 ${activeHacks.includes(hack.id) ? 'text-green-400' : hack.color}`}>
                   <i className={`fas ${hack.icon} text-xl`}></i>
                 </div>
                 <div>
                   <h3 className={`font-black text-sm font-orbitron ${activeHacks.includes(hack.id) ? 'text-green-400' : 'text-white'}`}>
                     {hack.name}
                   </h3>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{hack.description}</p>
                 </div>
               </div>
               
               {/* Toggle Switch */}
               <div className={`w-12 h-6 rounded-full p-1 transition-colors ${activeHacks.includes(hack.id) ? 'bg-green-500' : 'bg-gray-700'}`}>
                 <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform ${activeHacks.includes(hack.id) ? 'translate-x-6' : 'translate-x-0'}`}></div>
               </div>
             </div>
             
             {/* Scanning Line Effect if Active */}
             {activeHacks.includes(hack.id) && (
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/10 to-transparent opacity-50 animate-scan pointer-events-none"></div>
             )}
          </div>
        ))}
      </div>

      {/* Console Modal */}
      {showConsole && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-black border border-green-500/30 rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
            {/* Console Header */}
            <div className="bg-green-900/20 p-2 flex items-center gap-2 border-b border-green-500/20">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-green-500 font-bold ml-2">root@ff_max_injector:~#</span>
            </div>
            
            {/* Console Body */}
            <div ref={consoleRef} className="h-64 p-4 overflow-y-auto text-green-400 space-y-1">
              {consoleLogs.map((log, i) => (
                <div key={i} className="animate-fadeIn">
                  <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                  {log}
                </div>
              ))}
              <div className="w-2 h-4 bg-green-500 animate-pulse inline-block align-middle ml-1"></div>
            </div>
          </div>
        </div>
      )}

      {/* Warning/Disclaimer */}
      <div className="mt-8 p-4 bg-red-900/10 border border-red-500/20 rounded-xl text-center">
        <i className="fas fa-exclamation-triangle text-red-500 mb-2"></i>
        <p className="text-[10px] text-gray-400">
          Disclaimer: This tool is a simulator for entertainment purposes only. 
          It does not modify game files. Use safely.
        </p>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Hacks;