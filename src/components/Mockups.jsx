import { PhoneMissed, Wallet as WalletIcon, Radio, UserCircle } from 'lucide-react';

export function CallsMockup() {
  return (
    <div className="flex flex-col h-full bg-black text-white p-4">
      <h2 className="text-xl font-bold mb-4">Recent Calls</h2>
      <div className="flex items-center gap-4 p-3 border-b border-gray-800">
        <PhoneMissed size={24} className="text-red-500" />
        <div>
          <p className="font-semibold">เจน ไทย</p>
          <p className="text-xs text-gray-500">Yesterday, 10:33 AM</p>
        </div>
      </div>
    </div>
  );
}

export function WalletMockup() {
  return (
    <div className="flex flex-col h-full bg-black text-white p-4 items-center justify-center">
      <WalletIcon size={64} className="text-blue-500 mb-4" />
      <h2 className="text-2xl font-bold">M-Credits: 1,200.00</h2>
      <div className="flex gap-4 mt-6">
        <button className="bg-blue-600 px-6 py-2 rounded-full">Pay</button>
        <button className="bg-gray-700 px-6 py-2 rounded-full">Top Up</button>
      </div>
    </div>
  );
}

export function LiveMockup() {
  return (
    <div className="flex flex-col h-full bg-black text-white p-4 items-center justify-center">
      <Radio size={64} className="text-red-500 mb-4 animate-pulse" />
      <h2 className="text-xl font-bold">Live Streaming</h2>
      <p className="text-gray-400 mt-2">No active streams at the moment.</p>
    </div>
  );
}