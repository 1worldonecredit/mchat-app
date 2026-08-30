import { useState, useEffect } from 'react';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import ChatWindow from '../components/ChatWindow';
import BottomNav from '../components/BottomNav';
import HomeFeed from '../components/HomeFeed';
import Call from './Call';
import Contacts from './Contacts';
import Broadcast from './Broadcast';
import Profile from './Profile';
import '../FutureLayout.css'; 
import Settings from './Settings';

export default function Home() {
  const [activeMenu, setActiveMenu] = useState('chat');
  const [activeChat, setActiveChat] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // เช็คขนาดหน้าจอแบบ Real-time
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // แบ่งโหมดหน้าจอให้ชัดเจน
  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;
  const isDesktop = windowWidth > 1024;

  const handleMenuChange = (menuId) => {
    setActiveMenu(menuId);
    setActiveChat(null); // เคลียร์แชทเสมอเมื่อเปลี่ยนเมนู
  };

  const mockFriends = [
    { id: 1, name: 'MJ อ้วน', message: 'ส่งสลิปโอนเงินแล้วนะ', time: '12:00 PM', imageUrl: 'https://via.placeholder.com/40' },
    { id: 2, name: 'เจน ไทย', message: 'เจอกันคืนนี้!', time: '11:15 AM', imageUrl: 'https://via.placeholder.com/40' },
    { id: 3, name: 'Lego Home', message: 'กำลังออกแบบโครงสร้างครับ', time: '09:30 AM', imageUrl: 'https://via.placeholder.com/40' },
  ];

  // ==========================================
  // โซนที่ 1: แผงรายการตรงกลาง (List Zone)
  // ==========================================
  const renderListZone = () => {
    switch (activeMenu) {
      case 'chat':
        return (
          <div className="flex flex-col h-full bg-[var(--nav-bg)]">
            <TopNav />
            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
              {mockFriends.map(friend => (
                <div 
                  key={friend.id} 
                  onClick={() => setActiveChat(friend)}
                  className={`cursor-pointer flex items-center gap-3 p-4 border-b border-[var(--border-color)] transition ${activeChat?.id === friend.id ? 'bg-[var(--border-color)]' : 'hover:bg-[var(--border-color)]'}`}
                >
                  <img src={friend.imageUrl} alt={friend.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-[var(--nav-text)] truncate">{friend.name}</h3>
                      <span className="text-xs text-[var(--icon-color)]">{friend.time}</span>
                    </div>
                    <p className="text-sm text-[var(--icon-color)] truncate">{friend.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'call': return <Call />;
      case 'contacts': return <Contacts />;
      case 'broadcast': return <Broadcast />;
      default: return null;
    }
  };

  // ==========================================
  // โซนที่ 2: แผงเนื้อหาหลักฝั่งขวา (Detail Zone)
  // ==========================================
  const renderDetailZone = () => {
    if (activeMenu === 'profile') {
      return <Profile onBack={() => handleMenuChange('chat')} />;
    }
    // เพิ่มบรรทัดนี้เข้าไป
    if (activeMenu === 'settings') {
      return <Settings onBack={() => handleMenuChange('chat')} />;
    }
    if (activeChat) {
      return <ChatWindow chat={activeChat} onBack={() => setActiveChat(null)} isMobile={isMobile || isTablet} />;
    }
    if (activeMenu === 'chat') {
      return <HomeFeed />;
    }
    // หน้าจอว่างสำหรับเมนูอื่นๆ ที่ยังไม่มี Detail
    return <div className="flex-1 bg-[var(--app-bg)] w-full h-full"></div>;
  };

  // ==========================================
  // ตรรกะการแสดงผล (Layout Logic)
  // ==========================================
  
  // 1. แถบไอคอนซ้ายสุด (SideNav) แสดงบน PC และ Tablet
  const showSideNav = isDesktop || isTablet;

  // 2. ควบคุมการแสดงผล List และ Detail
  // 2. ควบคุมการแสดงผล List และ Detail
  const isDetailActive = activeChat !== null || activeMenu === 'profile' || activeMenu === 'settings';
  let showListZone = false;
  let showDetailZone = false;

  if (isDesktop) {
    // โหมดคอมพิวเตอร์: โชว์ 3 คอลัมน์ (เว้นแต่เปิด Profile จะใช้พื้นที่ List+Detail รวมกัน)
    showListZone = activeMenu !== 'profile'; 
    showDetailZone = true;
  } else {
    // โหมด Tablet & Mobile: โชว์แค่ทีละหน้า
    showListZone = !isDetailActive;
    showDetailZone = isDetailActive;
  }

  // 3. BottomNav แสดงเฉพาะมือถือ
  const showBottomNav = isMobile;

  return (
    <div className="glass-app-window w-full h-full flex flex-col relative">
      
      {/* พื้นที่หลัก (ซ้ายไปขวา) */}
      <div className="flex-1 flex w-full h-full overflow-hidden">
        
        {/* คอลัมน์ซ้ายสุด: SideNav */}
        {showSideNav && (
          <div className="glass-panel w-[80px] flex-shrink-0 z-50">
            <SideNav activeMenu={activeMenu} onMenuChange={handleMenuChange} />
          </div>
        )}

        {/* คอลัมน์กลาง: List Zone */}
        {showListZone && (
          <div className={`glass-panel flex-shrink-0 z-40 ${isDesktop ? 'w-[320px]' : 'flex-1'}`}>
            {renderListZone()}
          </div>
        )}

        {/* คอลัมน์ขวา: Detail Zone (Chat, Profile, Feed) */}
        {showDetailZone && (
          <div className="flex-1 relative w-full h-full overflow-hidden bg-[var(--app-bg)]">
            {renderDetailZone()}
          </div>
        )}

      </div>

      {/* แถบล่างสุด: BottomNav (ล็อกติดฐานจอเฉพาะมือถือ) */}
      {showBottomNav && (
         <div className="w-full flex-shrink-0 z-50 bg-[var(--nav-bg)] border-t border-[var(--border-color)] pb-safe">
           <BottomNav activeMenu={activeMenu} onMenuChange={handleMenuChange} />
         </div>
      )}

    </div>
  );
}