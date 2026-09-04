import { MessageSquare, Phone, Wallet, Radio, User, Settings as SettingsIcon } from 'lucide-react';

// เพิ่ม setCurrentScreen เข้ามาเพื่อรองรับโครงสร้างเดิมของคุณ
export default function BottomNav({ activeMenu, onMenuChange, setCurrentScreen }) {
  const navItems = [
    { id: 'chat', icon: MessageSquare },
    { id: 'call', icon: Phone },
    { id: 'contacts', icon: Wallet },
    { id: 'media', icon: Radio },
  ];

  // ฟังก์ชันตัวกลาง: ถ้ารับ onMenuChange มาก็ใช้ ถ้าไม่มีให้เช็ก setCurrentScreen
  const handleNavigation = (menuId) => {
    if (onMenuChange) {
      onMenuChange(menuId);
    } else if (setCurrentScreen) {
      setCurrentScreen(menuId);
    } else {
      console.error("BottomNav: ไม่พบคำสั่งสำหรับเปลี่ยนหน้าจอ");
    }
  };

  return (
    <div 
      className="w-full bg-[var(--nav-bg)] border-t border-[var(--border-color)] flex items-center justify-around py-3 px-2 transition-all duration-300"
      style={{ boxShadow: 'var(--nav-shadow)' }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeMenu === item.id;
        
        return (
          <button 
            key={item.id}
            onClick={() => handleNavigation(item.id)} 
            className={`p-2 rounded-xl transition-all duration-300 ${
              isActive 
                ? 'bg-[var(--card-bg)] text-[var(--icon-active)] shadow-sm border border-[var(--border-color)]' 
                : 'text-[var(--icon-color)] hover:text-[var(--text-heading)]'
            }`}
          >
            <Icon size={24} />
          </button>
        );
      })}
      
      <button 
        onClick={() => handleNavigation('profile')} 
        className={`p-2 rounded-xl transition-all duration-300 ${
          activeMenu === 'profile' 
            ? 'bg-[var(--card-bg)] text-[var(--icon-active)] shadow-sm border border-[var(--border-color)]' 
            : 'text-[var(--icon-color)] hover:text-[var(--text-heading)]'
        }`}
      >
        <User size={24} />
      </button>

      <button 
        onClick={() => handleNavigation('settings')} 
        className={`p-2 rounded-xl transition-all duration-300 ${
          activeMenu === 'settings' 
            ? 'bg-[var(--card-bg)] text-[var(--icon-active)] shadow-sm border border-[var(--border-color)]' 
            : 'text-[var(--icon-color)] hover:text-[var(--text-heading)]'
        }`}
      >
        <SettingsIcon size={24} />
      </button>
    </div>
  );
}