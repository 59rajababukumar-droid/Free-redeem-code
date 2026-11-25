
import React, { useRef, useState, useEffect } from 'react';
import { sounds } from '../utils/sounds';

interface ScratchCardProps {
  onComplete: (amount: number) => void;
  onClose: () => void;
}

const ScratchCard: React.FC<ScratchCardProps> = ({ onComplete, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [rewardAmount] = useState(() => Math.floor(Math.random() * 11) + 5); // Random 5-15 coins
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Set canvas size to match container
    const size = 250;
    canvas.width = size;
    canvas.height = size;

    // Draw the scratch cover
    const drawCover = () => {
      // Gradient background for the cover
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, '#9ca3af'); // gray-400
      gradient.addColorStop(0.5, '#d1d5db'); // gray-300
      gradient.addColorStop(1, '#9ca3af'); // gray-400
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      // Add text/icon to the cover
      ctx.fillStyle = '#4b5563';
      ctx.font = 'bold 20px Orbitron';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SCRATCH HERE', size / 2, size / 2);
      
      // Decorative pattern
      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for(let i = 0; i < size; i += 20) {
          ctx.moveTo(i, 0);
          ctx.lineTo(0, i);
      }
      ctx.stroke();
    };

    drawCover();
  }, []);

  const checkRevealProgress = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || isRevealed) return;

    // Get pixel data to calculate transparency percentage
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    
    // Check alpha channel of every 4th pixel (performance optimization)
    for (let i = 3; i < pixels.length; i += 16) { 
      if (pixels[i] < 128) {
        transparentPixels++;
      }
    }

    const totalPixels = pixels.length / 16; // Adjusted for step
    const percentage = (transparentPixels / totalPixels) * 100;

    if (percentage > 40) { // If 40% scratched
      setIsRevealed(true);
      if (window.navigator.vibrate) window.navigator.vibrate(200);
      sounds.playSuccess();
    }
  };

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || isRevealed) return;

    const rect = canvas.getBoundingClientRect();
    const touchX = x - rect.left;
    const touchY = y - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(touchX, touchY, 20, 0, 2 * Math.PI);
    ctx.fill();

    // Occasional sound effect during scratch
    if (Math.random() > 0.8) sounds.playPop();

    checkRevealProgress();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    scratch(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  const handleClaim = () => {
    sounds.playCoin();
    onComplete(rewardAmount);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center animate-fadeIn p-4">
      <div className="relative w-full max-w-sm">
        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute -top-12 right-0 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
            <i className="fas fa-times"></i>
        </button>

        <div className="glass-card rounded-[40px] p-1 border-white/20 bg-gradient-to-b from-red-900/50 to-black overflow-hidden relative shadow-2xl">
            {/* Header */}
            <div className="text-center py-6">
                <h2 className="text-2xl font-black font-orbitron fire-text-gradient animate-pulse">LUCKY SCRATCH</h2>
                <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">Scratch to win coins</p>
            </div>

            {/* Card Container */}
            <div className="relative w-[250px] h-[250px] mx-auto mb-8 rounded-xl overflow-hidden shadow-inner bg-white/5 border border-white/10">
                {/* Reward Layer (Underneath) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white text-center">
                     <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-2 animate-bounce">
                         <i className="fas fa-coins text-yellow-500 text-4xl"></i>
                     </div>
                     <h3 className="text-4xl font-black text-black font-orbitron">+{rewardAmount}</h3>
                     <p className="text-gray-500 font-bold text-xs uppercase">Coins Won</p>
                </div>

                {/* Scratch Layer (Canvas) */}
                <canvas
                    ref={canvasRef}
                    className={`absolute inset-0 touch-none cursor-crosshair transition-opacity duration-700 ${isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                    onMouseMove={handleMouseMove}
                    onTouchStart={() => setIsDragging(true)}
                    onTouchEnd={() => setIsDragging(false)}
                    onTouchMove={handleTouchMove}
                />
            </div>

            {/* Claim Button */}
            <div className="p-6 pt-0">
                <button
                    onClick={handleClaim}
                    disabled={!isRevealed}
                    className={`w-full py-4 rounded-2xl font-black text-lg transition-all shadow-lg ${isRevealed 
                        ? 'fire-gradient text-white shadow-red-600/30 animate-pulse hover:scale-105 active:scale-95' 
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                >
                    {isRevealed ? 'CLAIM REWARD' : 'SCRATCH TO REVEAL'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ScratchCard;
