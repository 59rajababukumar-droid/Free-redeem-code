
import React, { useState } from 'react';
import { User, WithdrawRecord } from '../types';
import { sounds } from '../utils/sounds';

interface WithdrawProps {
  user: User;
  onWithdraw: (amount: number) => void;
}

const Withdraw: React.FC<WithdrawProps> = ({ user, onWithdraw }) => {
  const [activeTab, setActiveTab] = useState<'UPI' | 'REDEEM'>('REDEEM');
  const [upiId, setUpiId] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [history, setHistory] = useState<WithdrawRecord[]>([
    { id: '0', amount: 10, type: 'REDEEM_CODE', status: 'COMPLETED', date: '2024-05-20', code: 'TUOT5TVIY' },
    { id: '1', amount: 500, type: 'UPI', status: 'COMPLETED', date: '2023-11-01' },
    { id: '2', amount: 100, type: 'REDEEM_CODE', status: 'COMPLETED', date: '2023-10-22' },
  ]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const amounts = [10, 50, 100, 500, 1000, 2000, 5000];

  const handleWithdrawClick = () => {
    if (!selectedAmount) return;
    if (user.balance < selectedAmount) {
      alert('Insufficient Balance! Earn more coins to withdraw.');
      return;
    }

    if (activeTab === 'UPI' && !upiId.includes('@')) {
      alert('Please enter a valid UPI ID');
      return;
    }

    sounds.playClick();
    setShowConfirm(true);
  };

  const handleConfirmWithdraw = () => {
    if (!selectedAmount) return;

    sounds.playSuccess();
    onWithdraw(selectedAmount);
    const newRecord: WithdrawRecord = {
      id: Math.random().toString(36).substr(2, 9),
      amount: selectedAmount,
      type: activeTab === 'UPI' ? 'UPI' : 'REDEEM_CODE',
      status: 'PENDING',
      date: new Date().toISOString().split('T')[0],
    };
    setHistory([newRecord, ...history]);
    setShowConfirm(false);
    setShowSuccess(true);
    setSelectedAmount(null);
  };

  const selectTab = (tab: 'UPI' | 'REDEEM') => {
    sounds.playClick();
    setActiveTab(tab);
  };

  const selectAmount = (amt: number) => {
    sounds.playClick();
    setSelectedAmount(amt);
  };

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    sounds.playCoin();
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 relative pb-10">
      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 shadow-inner">
        <button 
          onClick={() => selectTab('REDEEM')}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${activeTab === 'REDEEM' ? 'fire-gradient text-white shadow-lg' : 'text-gray-400'}`}
        >
          Redeem Code
        </button>
        <button 
          onClick={() => selectTab('UPI')}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${activeTab === 'UPI' ? 'fire-gradient text-white shadow-lg' : 'text-gray-400'}`}
        >
          UPI Transfer
        </button>
      </div>

      <div className="glass-card p-6 rounded-3xl border-red-500/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg">
            <i className={`fas ${activeTab === 'REDEEM' ? 'fa-google-play' : 'fa-building-columns'} text-red-500 text-xl`}></i>
          </div>
          <div>
            <h3 className="font-black font-orbitron text-white">{activeTab === 'REDEEM' ? 'Google Play Rewards' : 'Direct UPI Cash'}</h3>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Instant Withdrawal</p>
          </div>
        </div>

        {activeTab === 'UPI' && (
          <div className="mb-6 animate-fadeIn">
             <label className="text-[10px] font-black text-gray-400 mb-2 block uppercase tracking-widest">UPI ID (VPA)</label>
             <input 
              type="text" 
              placeholder="example@upi"
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-red-500 transition-all font-mono shadow-inner"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
             />
          </div>
        )}

        <label className="text-[10px] font-black text-gray-400 mb-3 block uppercase tracking-widest">Select Withdrawal Amount (₹)</label>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {amounts.map(amt => (
            <button
              key={amt}
              onClick={() => selectAmount(amt)}
              className={`py-3.5 rounded-xl font-black transition-all border ${selectedAmount === amt ? 'bg-red-500 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)] text-white scale-105 z-10' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              ₹{amt}{amt >= 500 && <span className="block text-[8px] font-bold text-white/60">PRO</span>}
            </button>
          ))}
        </div>

        <button 
          onClick={handleWithdrawClick}
          disabled={!selectedAmount}
          className={`w-full py-4 rounded-2xl font-black text-lg transition-all tracking-widest font-orbitron ${selectedAmount ? 'fire-gradient text-white shadow-xl shadow-red-600/40 active:scale-95' : 'bg-white/5 text-gray-700 cursor-not-allowed'}`}
        >
          WITHDRAW ₹{selectedAmount || ''}
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-sm font-orbitron font-black text-gray-300 tracking-widest uppercase">Payment History</h3>
          <i className="fas fa-history text-gray-600"></i>
        </div>
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="glass-card p-10 rounded-3xl text-center text-gray-600 italic text-sm border-white/5">
              No transactions yet.
            </div>
          ) : (
            history.map(record => (
              <div key={record.id} className="glass-card p-4 rounded-2xl flex flex-col gap-3 border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${record.type === 'UPI' ? 'bg-blue-600/20 text-blue-500' : 'bg-green-600/20 text-green-500'}`}>
                      <i className={`fas ${record.type === 'UPI' ? 'fa-wallet' : 'fa-ticket-alt'} text-xl`}></i>
                    </div>
                    <div>
                      <h4 className="font-black text-xs uppercase tracking-wider">{record.type === 'UPI' ? 'UPI Cashout' : 'Redeem Code'}</h4>
                      <p className="text-[10px] text-gray-500 font-bold">{record.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-lg text-white">₹{record.amount}</div>
                    <div className={`text-[8px] font-black px-2.5 py-1 rounded-full inline-block uppercase tracking-widest ${record.status === 'COMPLETED' ? 'bg-green-500 text-black' : record.status === 'PENDING' ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white'}`}>
                      {record.status}
                    </div>
                  </div>
                </div>
                
                {record.code && record.status === 'COMPLETED' && (
                  <div className="bg-black/30 border border-white/10 rounded-xl p-3 flex items-center justify-between animate-fadeIn">
                    <span className="font-mono text-xs font-black tracking-[0.2em] text-yellow-500">{record.code}</span>
                    <button 
                      onClick={() => copyCode(record.id, record.code!)}
                      className={`text-[10px] font-black px-3 py-1.5 rounded-lg transition-all ${copiedId === record.id ? 'bg-green-500 text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                      {copiedId === record.id ? 'COPIED' : 'COPY'}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && selectedAmount && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center animate-fadeIn p-4">
          <div className="w-full max-w-sm glass-card bg-zinc-950 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl relative">
            <div className="p-8">
              <div className="w-16 h-16 bg-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                <i className="fas fa-shield-alt text-red-500 text-2xl"></i>
              </div>
              <h3 className="text-xl font-black font-orbitron mb-6 text-center tracking-tighter italic">CONFIRM ORDER</h3>
              
              <div className="space-y-4 mb-8">
                <div className="bg-white/5 rounded-2xl p-4 flex justify-between items-center border border-white/5">
                  <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Amount</span>
                  <span className="text-2xl font-black text-white font-orbitron">₹{selectedAmount}</span>
                </div>
                
                <div className="bg-white/5 rounded-2xl p-4 flex justify-between items-center border border-white/5">
                   <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Method</span>
                   <span className="text-sm font-bold text-red-500 italic">{activeTab === 'UPI' ? 'UPI Transfer' : 'Google Play'}</span>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                   <span className="text-gray-500 text-[10px] font-black uppercase block mb-1 tracking-widest">Destination</span>
                   <span className="text-sm font-bold text-white block truncate font-mono">
                     {activeTab === 'UPI' ? upiId : (user.email || user.phone || 'fire_user_link')}
                   </span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-4 rounded-2xl font-black bg-white/5 hover:bg-white/10 transition-all text-xs tracking-widest border border-white/10"
                >
                  CANCEL
                </button>
                <button 
                  onClick={handleConfirmWithdraw}
                  className="flex-1 py-4 rounded-2xl font-black fire-gradient text-white shadow-xl shadow-red-600/30 active:scale-95 transition-all text-xs tracking-widest"
                >
                  CONFIRM
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center animate-fadeIn p-4">
          <div className="w-full max-w-sm glass-card bg-zinc-950 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl p-10 text-center">
             <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(34,197,94,0.4)] border-4 border-black animate-bounce">
               <i className="fas fa-check text-4xl text-black"></i>
             </div>
             <h3 className="text-2xl font-black font-orbitron mb-3 italic tracking-tighter uppercase">Order Success</h3>
             <p className="text-gray-400 text-sm mb-10 leading-relaxed font-bold">Your withdrawal of <span className="text-white">₹{selectedAmount}</span> is processing. Check history for updates.</p>
             <button 
                onClick={() => setShowSuccess(false)}
                className="w-full py-4 rounded-2xl font-black bg-white text-black hover:bg-gray-200 transition-all shadow-2xl uppercase tracking-[0.2em] italic"
              >
                GOT IT
              </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Withdraw;