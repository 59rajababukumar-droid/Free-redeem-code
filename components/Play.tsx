
import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/sounds';

interface PlayProps {
  onReward: (amount: number) => void;
}

type GameType = 'NONE' | 'TAPPER' | 'RACER';

const Play: React.FC<PlayProps> = ({ onReward }) => {
  const [activeGame, setActiveGame] = useState<GameType>('NONE');

  const handleGameEnd = (score: number) => {
    if (score > 0) sounds.playSuccess();
    onReward(score);
    setActiveGame('NONE');
  };

  const selectGame = (game: GameType) => {
    sounds.playClick();
    setActiveGame(game);
  };

  if (activeGame === 'TAPPER') {
    return <TapperGame onComplete={handleGameEnd} onCancel={() => selectGame('NONE')} />;
  }

  if (activeGame === 'RACER') {
    return <RacerGame onComplete={handleGameEnd} onCancel={() => selectGame('NONE')} />;
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black font-orbitron fire-text-gradient italic">ARCADE ZONE</h2>
        <p className="text-gray-400 text-xs uppercase tracking-[0.2em] font-bold">Choose a game and earn coins</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div 
          onClick={() => selectGame('TAPPER')}
          className="glass-card p-6 rounded-[32px] flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer active:scale-95 border-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="flex items-center gap-5 z-10">
            <div className="w-16 h-16 fire-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-110 transition-transform">
              <i className="fas fa-hand-pointer text-white text-3xl"></i>
            </div>
            <div>
              <h3 className="text-xl font-black font-orbitron">FIRE TAPPER</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Fast Reflexes • 25 Coins</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-500/20 transition-colors z-10">
            <i className="fas fa-play text-red-500 text-sm"></i>
          </div>
        </div>

        <div 
          onClick={() => selectGame('RACER')}
          className="glass-card p-6 rounded-[32px] flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer active:scale-95 border-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-600/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="flex items-center gap-5 z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-600/30 group-hover:scale-110 transition-transform">
              <i className="fas fa-car text-white text-3xl"></i>
            </div>
            <div>
              <h3 className="text-xl font-black font-orbitron">FIRE RACER</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Avoid & Collect • 50+ Coins</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors z-10">
            <i className="fas fa-play text-orange-500 text-sm"></i>
          </div>
        </div>
      </div>

      <div className="glass-card p-5 rounded-2xl border-white/5 text-center mt-4">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
          More games coming soon!<br/>Stay tuned for updates.
        </p>
      </div>
    </div>
  );
};

/* --- RACER GAME COMPONENT --- */
const RacerGame: React.FC<{ onComplete: (score: number) => void; onCancel: () => void }> = ({ onComplete, onCancel }) => {
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'CRASHED'>('IDLE');
  const [score, setScore] = useState(0);
  const [lane, setLane] = useState(1);
  const [enemies, setEnemies] = useState<{ id: number; lane: number; y: number; type: 'coin' | 'car' }[]>([]);
  const gameLoopRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);
  const spawnTimerRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const startGame = () => {
    sounds.playClick();
    setScore(0);
    setEnemies([]);
    setLane(1);
    setGameState('PLAYING');
    lastTimeRef.current = performance.now();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  const gameLoop = (time: number) => {
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    setEnemies(prev => {
      const moved = prev
        .map(e => ({ ...e, y: e.y + (0.3 * deltaTime) }))
        .filter(e => e.y < 500);

      let collided = false;
      const filtered = moved.filter(e => {
        if (e.lane === lane && e.y > 380 && e.y < 460) {
          if (e.type === 'car') {
            collided = true;
          } else {
            sounds.playCoin();
            setScore(s => s + 5);
            return false;
          }
        }
        return true;
      });

      if (collided) {
        sounds.playCrash();
        setGameState('CRASHED');
        if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      }

      return filtered;
    });

    spawnTimerRef.current += deltaTime;
    if (spawnTimerRef.current > 800) {
      const newEnemy = {
        id: Date.now(),
        lane: Math.floor(Math.random() * 3),
        y: -50,
        type: Math.random() > 0.3 ? ('car' as const) : ('coin' as const)
      };
      setEnemies(prev => [...prev, newEnemy]);
      spawnTimerRef.current = 0;
    }

    if (gameState === 'PLAYING') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  };

  useEffect(() => {
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, []);

  const handleInput = (targetLane: number) => {
    if (gameState === 'PLAYING') {
      sounds.playPop();
      setLane(targetLane);
    }
  };

  const handleCollect = () => {
    sounds.playClick();
    onComplete(score);
  };

  const handleRetry = () => {
    sounds.playClick();
    startGame();
  };

  return (
    <div className="flex flex-col items-center animate-fadeIn">
      <div className="w-full flex justify-between items-center mb-4 px-2">
        <button onClick={onCancel} className="text-gray-500 hover:text-white"><i className="fas fa-times"></i></button>
        <div className="text-center">
          <h3 className="font-orbitron font-bold text-orange-500">FIRE RACER</h3>
          <p className="text-[10px] text-gray-500 font-black tracking-widest">SCORE: {score}</p>
        </div>
        <div className="w-4"></div>
      </div>

      <div className="relative w-full h-[500px] bg-zinc-900 rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 flex justify-around opacity-20">
          <div className="w-px h-full bg-white border-dashed border-r border-white/50"></div>
          <div className="w-px h-full bg-white border-dashed border-r border-white/50"></div>
        </div>

        {enemies.map(e => (
          <div 
            key={e.id}
            style={{ 
              top: `${e.y}px`, 
              left: `${(e.lane * 33.3) + 16.6}%`,
              transform: 'translateX(-50%)' 
            }}
            className="absolute transition-transform duration-75"
          >
            {e.type === 'car' ? (
              <div className="w-12 h-20 bg-red-600 rounded-lg flex items-center justify-center shadow-lg border-2 border-red-400">
                <i className="fas fa-car-side rotate-90 text-white text-xl"></i>
              </div>
            ) : (
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                <i className="fas fa-fire text-white text-lg"></i>
              </div>
            )}
          </div>
        ))}

        <div 
          style={{ 
            bottom: '40px', 
            left: `${(lane * 33.3) + 16.6}%`,
            transform: 'translateX(-50%)' 
          }}
          className="absolute transition-all duration-150 z-20"
        >
          <div className="w-14 h-22 bg-orange-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.6)] border-2 border-white/20">
             <i className="fas fa-car rotate-[270deg] text-white text-2xl"></i>
             <div className="absolute top-0 left-2 w-2 h-4 bg-yellow-200 rounded-full blur-[2px] opacity-80"></div>
             <div className="absolute top-0 right-2 w-2 h-4 bg-yellow-200 rounded-full blur-[2px] opacity-80"></div>
          </div>
        </div>

        <div className="absolute inset-0 flex z-30">
          <div onClick={() => handleInput(0)} className="h-full w-1/3"></div>
          <div onClick={() => handleInput(1)} className="h-full w-1/3"></div>
          <div onClick={() => handleInput(2)} className="h-full w-1/3"></div>
        </div>

        {gameState === 'IDLE' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-8 text-center">
            <i className="fas fa-car text-6xl text-orange-500 mb-6 animate-pulse"></i>
            <h4 className="text-2xl font-black font-orbitron mb-2">FIRE RACER</h4>
            <p className="text-gray-400 text-sm mb-8">Tap lanes to move. Collect fire tokens and avoid red cars!</p>
            <button 
              onClick={startGame}
              className="w-full fire-gradient py-4 rounded-2xl font-black shadow-xl"
            >
              START RACE
            </button>
          </div>
        )}

        {gameState === 'CRASHED' && (
          <div className="absolute inset-0 bg-red-900/90 backdrop-blur-md z-40 flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-explosion text-4xl text-orange-500"></i>
            </div>
            <h4 className="text-3xl font-black font-orbitron mb-1">CRASHED!</h4>
            <p className="text-white/60 text-sm mb-6 uppercase tracking-widest font-bold">Earned: {score} Coins</p>
            <div className="w-full space-y-3">
              <button 
                onClick={handleCollect}
                className="w-full bg-white text-black py-4 rounded-2xl font-black shadow-xl active:scale-95 transition-all"
              >
                COLLECT & EXIT
              </button>
              <button 
                onClick={handleRetry}
                className="w-full bg-white/10 border border-white/20 py-4 rounded-2xl font-black shadow-xl active:scale-95 transition-all"
              >
                RETRY
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-4 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
        <span><i className="fas fa-mouse-pointer mr-1"></i> Tap Left/Center/Right</span>
      </div>
    </div>
  );
};

/* --- TAPPER GAME COMPONENT --- */
const TapperGame: React.FC<{ onComplete: (score: number) => void; onCancel: () => void }> = ({ onComplete, onCancel }) => {
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'FINISHED'>('IDLE');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [targetPos, setTargetPos] = useState({ top: '50%', left: '50%' });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startGame = () => {
    sounds.playClick();
    setScore(0);
    setTimeLeft(15);
    setGameState('PLAYING');
    moveTarget();
  };

  const moveTarget = () => {
    const top = Math.random() * 70 + 15 + '%';
    const left = Math.random() * 70 + 15 + '%';
    setTargetPos({ top, left });
  };

  const handleTargetClick = () => {
    if (gameState !== 'PLAYING') return;
    sounds.playPop();
    setScore(s => s + 1);
    moveTarget();
    if (window.navigator.vibrate) window.navigator.vibrate(50);
  };

  useEffect(() => {
    if (gameState === 'PLAYING') {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            sounds.playSuccess();
            setGameState('FINISHED');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  return (
    <div className="flex flex-col items-center animate-fadeIn">
      <div className="w-full flex justify-between items-center mb-4 px-2">
        <button onClick={onCancel} className="text-gray-500 hover:text-white"><i className="fas fa-times"></i></button>
        <div className="text-center">
          <h2 className="text-xl font-black font-orbitron fire-text-gradient italic">FIRE TAPPER</h2>
        </div>
        <div className="w-4"></div>
      </div>

      {gameState === 'IDLE' && (
        <div className="glass-card p-8 rounded-[40px] text-center w-full max-w-xs flex flex-col items-center gap-6 border-white/10 shadow-2xl">
          <div className="w-24 h-24 fire-gradient rounded-full flex items-center justify-center shadow-lg shadow-red-600/40">
             <i className="fas fa-hand-pointer text-white text-5xl"></i>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Daily Game</h3>
            <p className="text-gray-400 text-sm">You have 15 seconds. Every tap gives you 1 coin. How fast can you tap?</p>
          </div>
          <button 
            onClick={startGame}
            className="w-full fire-gradient text-white font-black py-4 rounded-2xl shadow-xl shadow-red-600/20 active:scale-95 transition-all"
          >
            START GAME
          </button>
        </div>
      )}

      {gameState === 'PLAYING' && (
        <div className="relative w-full h-[400px] glass-card rounded-[40px] border-red-500/20 overflow-hidden cursor-crosshair bg-black/50">
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-8 items-center bg-black/40 px-6 py-2 rounded-full border border-white/10 backdrop-blur-md z-20">
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-500 uppercase">Score</p>
              <p className="text-xl font-black text-yellow-500 font-orbitron">{score}</p>
            </div>
            <div className="w-px h-6 bg-white/20"></div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-500 uppercase">Time</p>
              <p className="text-xl font-black text-red-500 font-orbitron">{timeLeft}s</p>
            </div>
          </div>
          
          <button
            onClick={handleTargetClick}
            style={{ top: targetPos.top, left: targetPos.left }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 transition-all duration-75 active:scale-75 z-10"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute inset-0 bg-red-600 rounded-full blur-md opacity-50 animate-pulse"></div>
              <i className="fas fa-fire text-white text-3xl drop-shadow-[0_0_10px_rgba(255,0,0,1)]"></i>
            </div>
          </button>
        </div>
      )}

      {gameState === 'FINISHED' && (
        <div className="glass-card p-8 rounded-[40px] text-center w-full max-w-xs flex flex-col items-center gap-6 border-green-500/20 shadow-2xl">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40">
             <i className="fas fa-coins text-white text-5xl"></i>
          </div>
          <div className="space-y-1">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Game Over!</p>
            <h3 className="text-4xl font-black font-orbitron text-white">{score}</h3>
            <p className="text-gray-400 text-sm">Coins earned successfully</p>
          </div>
          <button 
            onClick={() => {
              sounds.playClick();
              onComplete(score);
            }}
            className="w-full bg-green-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-green-600/20 active:scale-95 transition-all"
          >
            COLLECT REWARD
          </button>
        </div>
      )}
    </div>
  );
};

export default Play;
