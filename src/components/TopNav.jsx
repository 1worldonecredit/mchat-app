import { Search, Menu, PlaySquare } from 'lucide-react';

// รับ props toggleSidebar (เปิดปิดเมนู) และ onLogoClick (เปลี่ยนหน้า) มาจาก Layout หลัก
export default function TopNav({ toggleSidebar, onLogoClick }) {
  return (
    <div 
      className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-[var(--nav-bg)] border-b border-[var(--border-color)] transition-all duration-300" 
      style={{ boxShadow: 'var(--nav-shadow)' }}
    >
      <div className="flex items-center gap-4">
        {/* ปุ่มเปิด Side Bar (แสดงเฉพาะบนมือถือ md:hidden) */}
        <button 
          onClick={toggleSidebar} 
          className="md:hidden text-[var(--icon-inactive)] hover:text-[var(--icon-active)] transition-colors duration-200"
        >
          <Menu size={26} />
        </button>

        {/* ไอคอน Media กดแล้วเชื่อมไปหน้า Media (ใช้แทน M-CHAT) */}
        <button 
          onClick={onLogoClick}
          className="flex items-center text-[var(--icon-active)] hover:scale-105 transition-transform duration-300"
          title="Go to Media"
        >
          <PlaySquare size={28} strokeWidth={2.5} />
        </button>
      </div>

      <button>
        <Search size={24} className="text-[var(--icon-active)] transition-colors duration-300 hover:opacity-70" />
      </button>
    </div>
  );
}