import { MessageSquare, Phone, Wallet, Radio, User, Settings as SettingsIcon } from 'lucide-react';

export default function BottomNav({ activeMenu, onMenuChange }) {
  const navItems = [
    { id: 'chat', icon: MessageSquare },
    { id: 'call', icon: Phone },
    { id: 'contacts', icon: Wallet },
    { id: 'broadcast', icon: Radio },
  ];

  return (
    // ส่วนหนึ่งของไฟล์ src/components/BottomNav.jsx
<div 
  className="w-full bg-[var(--nav-bg)] border-t border-[var(--border-color)] flex items-center justify-around py-3 px-2 transition-all duration-300"
  style={{ boxShadow: 'var(--nav-shadow)' }} // เพิ่มบรรทัดนี้
>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeMenu === item.id;
        
        return (
          <button 
            key={item.id}
            onClick={() => onMenuChange(item.id)} 
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
        onClick={() => onMenuChange('profile')} 
        className={`p-2 rounded-xl transition-all duration-300 ${
          activeMenu === 'profile' 
            ? 'bg-[var(--card-bg)] text-[var(--icon-active)] shadow-sm border border-[var(--border-color)]' 
            : 'text-[var(--icon-color)] hover:text-[var(--text-heading)]'
        }`}
      >
        <User size={24} />
      </button>

      <button 
        onClick={() => onMenuChange('settings')} 
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