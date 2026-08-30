import { Wallet, Users } from 'lucide-react';

export default function Contacts() {
  return (
    <div className="flex flex-col w-full h-full bg-[var(--app-bg)] text-[var(--nav-text)]">
      <div className="px-6 py-4 border-b border-[var(--border-color)] bg-[var(--nav-bg)]">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Wallet size={24} className="text-[var(--icon-active)]" />
          รายชื่อและกระเป๋าเงิน
        </h2>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-[var(--icon-color)]">
        <Users size={48} className="mb-4 opacity-50" />
        <p>กำลังโหลดรายชื่อผู้ติดต่อ...</p>
      </div>
    </div>
  );
}