import { MessageSquare, Phone, Wallet, Radio, User, Settings as SettingsIcon } from 'lucide-react';

export default function SideNav({ activeMenu, onMenuChange }) {
  const topNavItems = [
    { id: 'chat', icon: MessageSquare },
    { id: 'call', icon: Phone },
    { id: 'contacts', icon: Wallet },
    { id: 'broadcast', icon: Radio },
  ];

  return (
    <div className="flex flex-col h-full items-center py-4 justify-between w-full">
      {/* เมนูด้านบน */}
      <div className="flex flex-col gap-4 w-full px-2">
        {topNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onMenuChange(item.id)}
              className={`p-3 rounded-xl flex justify-center transition w-full ${
                isActive 
                  ? 'bg-[var(--desktop-bg)] text-[var(--icon-active)]' 
                  : 'text-[var(--icon-color)] hover:text-[var(--nav-text)] hover:bg-[var(--border-color)]'
              }`}
            >
              <Icon size={24} />
            </button>
          );
        })}
      </div>

      {/* เมนูด้านล่าง (Profile และ Settings) */}
      <div className="w-full px-2 flex flex-col gap-2">
        <button
          onClick={() => onMenuChange('profile')}
          className={`p-3 rounded-xl flex justify-center transition w-full ${
            activeMenu === 'profile'
              ? 'bg-[var(--desktop-bg)] text-[var(--icon-active)]' 
              : 'text-[var(--icon-color)] hover:text-[var(--nav-text)] hover:bg-[var(--border-color)]'
          }`}
        >
          <User size={24} />
        </button>
        
        {/* เพิ่มปุ่ม Settings ตรงนี้ */}
        <button
          onClick={() => onMenuChange('settings')}
          className={`p-3 rounded-xl flex justify-center transition w-full ${
            activeMenu === 'settings'
              ? 'bg-[var(--desktop-bg)] text-[var(--icon-active)]' 
              : 'text-[var(--icon-color)] hover:text-[var(--nav-text)] hover:bg-[var(--border-color)]'
          }`}
        >
          <SettingsIcon size={24} />
        </button>
      </div>
    </div>
  );
}