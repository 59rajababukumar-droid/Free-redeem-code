
export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  balance: number;
  referralCode: string;
  isLoggedIn: boolean;
}

export type AppView = 'DASHBOARD' | 'PLAY' | 'WITHDRAW' | 'REFERRAL' | 'PROFILE' | 'HACKS';

export interface WithdrawRecord {
  id: string;
  amount: number;
  type: 'UPI' | 'REDEEM_CODE';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  date: string;
  code?: string;
}