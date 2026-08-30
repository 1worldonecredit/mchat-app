import { Search } from 'lucide-react';

export default function TopNav() {
  return (
    // ส่วนหนึ่งของไฟล์ src/components/TopNav.jsx
<div 
  className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-[var(--nav-bg)] border-b border-[var(--border-color)] transition-all duration-300" 
  style={{ boxShadow: 'var(--nav-shadow)' }} // เพิ่มบรรทัดนี้
>
      <h1 className="text-xl font-bold tracking-wider text-[var(--text-heading)]">M-CHAT</h1>
      <button>
        <Search size={24} className="text-[var(--icon-active)] transition-colors duration-300" />
      </button>
    </div>
  );
}