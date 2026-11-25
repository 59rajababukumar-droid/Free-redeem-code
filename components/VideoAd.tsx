
import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/sounds';

interface VideoAdProps {
  onComplete: () => void;
}

const VideoAd: React.FC<VideoAdProps> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(10); // 10 seconds ad
  const [completed, setCompleted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Play sound on start
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCompleted(true);
          sounds.playSuccess();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-fadeIn">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2">
            <span className="bg-yellow-500 text-black text-[10px] font-black px-2 py-1 rounded">AD</span>
            <span className="text-white/80 text-xs font-bold">Reward in {timeLeft}s</span>
        </div>
        {completed && (
            <button 
                onClick={onComplete}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md animate-bounce"
            >
                <i className="fas fa-times text-white"></i>
            </button>
        )}
      </div>

      {/* Video Content */}
      <div className="w-full h-full relative">
        <video 
            ref={videoRef}
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            loop
        />
        <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
        
        {/* Ad Overlay Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent pb-10">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
                    <i className="fas fa-rocket text-white text-2xl"></i>
                </div>
                <div>
                    <h3 className="font-bold text-lg">Space Shooter 3D</h3>
                    <p className="text-gray-400 text-xs">Best Action Game 2024</p>
                </div>
            </div>
            <div className="flex gap-3">
                <button className="flex-1 bg-white text-black font-black py-3 rounded-xl text-sm hover:bg-gray-200 transition-colors">
                    INSTALL NOW
                </button>
                {completed && (
                    <button 
                        onClick={onComplete} 
                        className="flex-1 fire-gradient text-white font-black py-3 rounded-xl text-sm shadow-lg shadow-red-600/30 animate-pulse"
                    >
                        CLAIM REWARD
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default VideoAd;
