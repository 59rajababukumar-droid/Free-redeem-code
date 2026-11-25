
import React, { useState } from 'react';
import { User } from '../types';

interface ReferralProps {
  user: User;
}

const Referral: React.FC<ReferralProps> = ({ user }) => {
  const [copied, setCopied] = useState(false);
  const [inputCode, setInputCode] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitReferral = () => {
    if (inputCode.length > 3) {
      alert(`Referral code ${inputCode} applied! You earned 30 coins.`);
      setInputCode('');
    }
  };

  const instagramLink = "https://www.instagram.com/raja_____ji_600?igsh=MWN6YjBrN3Zuejg1Zg==";

  return (
    <div className="space-y-6">
      <div className="text-center py-6 px-4">
        <div className="w-32 h-32 bg-red-600/10 rounded-full mx-auto flex items-center justify-center relative mb-4">
          <div className="absolute inset-0 fire-gradient opacity-20 rounded-full animate-ping"></div>
          <i className="fas fa-users text-red-500 text-5xl"></i>
        </div>
        <h2 className="text-2xl font-black font-orbitron fire-text-gradient mb-2">INVITE FRIENDS</h2>
        <p className="text-gray-400 text-sm max-w-[250px] mx-auto">Invite friends and earn 50 coins for every friend who joins using your code.</p>
      </div>

      <div className="glass-card p-6 rounded-3xl border-white/10 space-y-6">
        <div>
          <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-[0.2em]">Your Referral Code</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl py-4 text-center font-black text-xl font-orbitron tracking-widest text-white shadow-inner">
              {user.referralCode}
            </div>
            <button 
              onClick={handleCopy}
              className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              <i className={`fas ${copied ? 'fa-check' : 'fa-copy'} text-lg`}></i>
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-[0.2em]">Have a referral code?</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="ENTER CODE"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:outline-none focus:border-red-500 placeholder:text-gray-700"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            />
            <button 
              onClick={handleSubmitReferral}
              className="bg-white text-black font-black px-6 rounded-xl text-xs hover:bg-gray-200 active:scale-95 transition-all"
            >
              APPLY
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-3xl border-red-500/20 bg-gradient-to-br from-red-600/5 to-transparent">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <i className="fab fa-instagram text-pink-500 text-xl"></i>
          Follow for Bonus Coins
        </h3>
        <p className="text-xs text-gray-400 mb-4">Subscribe to our channel and follow on Instagram to get exclusive promo codes and rewards.</p>
        <a 
          href={instagramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white font-black py-3 rounded-xl shadow-lg hover:shadow-pink-600/20 transition-all active:scale-95"
        >
          JOIN OUR INSTAGRAM
        </a>
      </div>
    </div>
  );
};

export default Referral;
