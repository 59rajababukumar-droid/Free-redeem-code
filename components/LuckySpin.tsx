
import React, { useState } from 'react';
import { sounds } from '../utils/sounds';

interface LuckySpinProps {
  onComplete: (amount: number) => void;
  onClose: () => void;
}

const LuckySpin: React.FC<LuckySpinProps> = ({ onComplete, onClose }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [reward, setReward] = useState<number | null>(null);
  
  const segments = [
    { value: 10, color: '#ef4444', label: '10' }, // Red
    { value: 50, color: '#f97316', label: '50' }, // Orange
    { value: 0, color: '#374151', label: '0' },   // Gray
    { value: 100, color: '#eab308', label: '100' }, // Yellow
    { value: 20, color: '#ef4444', label: '20' },
    { value: 5, color: '#f97316', label: '5' },
    { value: 0, color: '#374151', label: '0' },
    { value: 25, color: '#eab308', label: '25' },
  ];

  const handleSpin = () => {
    if (spinning || reward !== null) return;
    
    setSpinning(true);
    sounds.playClick();
    
    // Select random segment
    const winningIndex = Math.floor(Math.random() * segments.length);
    const segmentAngle = 360 / segments.length;
    
    // Calculate total rotation needed
    // We want the winning segment to end up at the top (0 degrees).
    // Since we rotate the container, if segment 0 is at 0deg, segment 1 is at 45deg.
    // To bring segment 1 to 0deg, we rotate -45deg (or 315deg).
    // Formula: Target = 360 - (Index * Angle)
    
    // Add extra spins (5 full rotations = 1800deg) to ensure movement
    const baseRotation = 1800; 
    const targetAngle = 360 - (winningIndex * segmentAngle);
    
    // Add a small random offset within the segment to look natural (+/- 10deg)
    const randomOffset = Math.floor(Math.random() * 20) - 10;
    
    // Calculate final rotation value to apply
    // We add to current rotation to ensure we always spin forward
    // Align to nearest 360 first to start clean, then add base + target
    const currentMod = rotation % 360;
    const nextRotation = rotation + (360 - currentMod) + baseRotation + targetAngle + randomOffset;
    
    setRotation(nextRotation);

    // Wait for animation to finish (4s)
    setTimeout(() => {
      setSpinning(false);
      const winValue = segments[winningIndex].value;
      setReward(winValue);
      
      if (winValue > 0) {
        sounds.playSuccess();
      } else {
        sounds.playCrash();
      }
    }, 4000);
  };

  const handleClaim = () => {
    if (reward !== null) {
      if (reward > 0) sounds.playCoin();
      onComplete(reward);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center animate-fadeIn p-4">
      <div className="relative w-full max-w-sm flex flex-col items-center">
        {/* Close Button */}
        <button 
            onClick={onClose}
            disabled={spinning}
            className="absolute -top-12 right-0 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all disabled:opacity-0"
        >
            <i className="fas fa-times"></i>
        </button>

        <div className="text-center mb-8">
            <h2 className="text-3xl font-black font-orbitron fire-text-gradient animate-pulse">LUCKY SPIN</h2>
            <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">Spin the wheel & win big</p>
        </div>

        {/* Wheel Container */}
        <div className="relative w-[300px] h-[300px] mb-8">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20 text-white drop-shadow-lg">
                <i className="fas fa-caret-down text-5xl text-white"></i>
            </div>

            {/* Wheel */}
            <div 
                className="w-full h-full rounded-full border-4 border-white/20 relative overflow-hidden shadow-2xl transition-transform cubic-bezier(0.2, 0.8, 0.2, 1)"
                style={{ 
                    transform: `rotate(${rotation}deg)`,
                    transitionDuration: '4s',
                    background: `conic-gradient(
                        ${segments[0].color} 0deg 45deg,
                        ${segments[1].color} 45deg 90deg,
                        ${segments[2].color} 90deg 135deg,
                        ${segments[3].color} 135deg 180deg,
                        ${segments[4].color} 180deg 225deg,
                        ${segments[5].color} 225deg 270deg,
                        ${segments[6].color} 270deg 315deg,
                        ${segments[7].color} 315deg 360deg
                    )`
                }}
            >
                {/* Segments Text */}
                {segments.map((seg, i) => (
                    <div 
                        key={i}
                        className="absolute top-0 left-1/2 w-[1px] h-[50%] origin-bottom"
                        style={{ transform: `rotate(${i * 45 + 22.5}deg)` }} // +22.5 to center text in segment
                    >
                        <div className="absolute top-8 -translate-x-1/2 font-black text-white text-lg drop-shadow-md">
                            {seg.label}
                        </div>
                    </div>
                ))}
                
                {/* Center Cap */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center z-10 border-4 border-gray-200">
                    <i className="fas fa-fire text-red-600 text-2xl"></i>
                </div>
            </div>
        </div>

        {/* Controls */}
        {!reward && reward !== 0 ? (
            <button
                onClick={handleSpin}
                disabled={spinning}
                className={`w-full max-w-[200px] py-4 rounded-2xl font-black text-lg transition-all shadow-xl uppercase tracking-wider ${spinning 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed scale-95' 
                    : 'fire-gradient text-white shadow-red-600/30 hover:scale-105 active:scale-95'}`}
            >
                {spinning ? 'Spinning...' : 'SPIN NOW'}
            </button>
        ) : (
            <div className="glass-card p-6 rounded-2xl border-white/20 text-center w-full animate-fadeIn">
                <p className="text-gray-400 text-xs font-bold uppercase mb-2">You Won</p>
                <h3 className="text-4xl font-black font-orbitron text-white mb-4">{reward} <span className="text-lg text-yellow-500">Coins</span></h3>
                <button
                    onClick={handleClaim}
                    className="w-full bg-green-500 text-white font-black py-3 rounded-xl shadow-lg shadow-green-600/20 active:scale-95 transition-all"
                >
                    {reward > 0 ? 'CLAIM REWARD' : 'TRY AGAIN'}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default LuckySpin;
