import { Radio, Send } from 'lucide-react';

export default function Broadcast() {
  return (
    <div className="flex flex-col w-full h-full bg-[var(--app-bg)] text-[var(--nav-text)]">
      <div className="px-6 py-4 border-b border-[var(--border-color)] bg-[var(--nav-bg)]">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Radio size={24} className="text-[var(--icon-active)]" />
          ส่งข้อความบรอดแคสต์
        </h2>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-[var(--icon-color)]">
        <Send size={48} className="mb-4 opacity-50" />
        <p>สร้างรายการบรอดแคสต์ใหม่</p>
      </div>
    </div>
  );
}