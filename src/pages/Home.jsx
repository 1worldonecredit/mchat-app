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

// แก้ไขจุดที่ 1: เพิ่มการรับ Props `setCurrentScreen` เพื่อให้ Home สามารถสั่ง App.jsx ให้เปลี่ยนไปหน้า Media ตัวจริงได้
export default function Home({ setCurrentScreen }) {
  
  // แก้ไขจุดที่ 2: เปลี่ยนค่าเริ่มต้นกลับเป็น 'chat' 
  // (App.jsx ทำหน้าที่พาไปหน้า Media ตอนแรกอยู่แล้ว ถ้าตั้งตรงนี้เป็น media อีก พอกดปุ่ม Chat มันจะบัคโหลดหน้าฟีดซ้ำ)
  const [activeMenu, setActiveMenu] = useState('chat');
  
  const [activeChat, setActiveChat] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;
  const isDesktop = windowWidth > 1024;

  const handleMenuChange = (menuId) => {
    // แก้ไขจุดที่ 3: แทรกคำสั่งดักจับ ถ้ากดเมนู 'media' ให้โยนกลับไปที่ App.jsx เพื่อเปิดหน้า Media (ไฟล์ที่มี 285 บรรทัด)
    if (menuId === 'media' && setCurrentScreen) {
      setCurrentScreen('media');
      return; 
    }

    setActiveMenu(menuId);
    setActiveChat(null); 
    setIsSidebarOpen(false); 
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const mockFriends = [
    { id: 1, name: 'MJ อ้วน', message: 'ส่งสลิปโอนเงินแล้วนะ', time: '12:00 PM', imageUrl: 'https://placehold.co/40x40/png' },
    { id: 2, name: 'เจน ไทย', message: 'เจอกันคืนนี้!', time: '11:15 AM', imageUrl: 'https://placehold.co/40x40/png' },
    { id: 3, name: 'Lego Home', message: 'กำลังออกแบบโครงสร้างครับ', time: '09:30 AM', imageUrl: 'https://placehold.co/40x40/png' },
  ];

  // ==========================================
  // โซนที่ 1: แผงรายการตรงกลาง (List Zone)
  // ==========================================
  const renderListZone = () => {
    switch (activeMenu) {
      case 'chat':
        return (
          <div className="flex flex-col h-full bg-[var(--nav-bg)]">
            <TopNav toggleSidebar={toggleSidebar} onLogoClick={() => handleMenuChange('media')} />
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
                      <h3 className="font-semibold text-[var(--text-heading)] truncate">{friend.name}</h3>
                      <span className="text-xs text-[var(--icon-inactive)]">{friend.time}</span>
                    </div>
                    <p className="text-sm text-[var(--icon-inactive)] truncate">{friend.message}</p>
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
    if (activeMenu === 'settings') {
      return <Settings onBack={() => handleMenuChange('chat')} />;
    }
    if (activeChat) {
      return <ChatWindow chat={activeChat} onBack={() => setActiveChat(null)} isMobile={isMobile || isTablet} />;
    }
    
    if (activeMenu === 'media') {
      return (
        <div className="flex flex-col w-full h-full bg-[var(--app-bg)]">
          <TopNav toggleSidebar={toggleSidebar} onLogoClick={() => handleMenuChange('media')} />
          <div className="flex-1 overflow-hidden">
             <HomeFeed />
          </div>
        </div>
      );
    }

    if (activeMenu === 'chat') {
      return (
        <div className="flex-1 w-full h-full flex items-center justify-center bg-[var(--app-bg)]">
          <p className="text-[var(--icon-inactive)] text-sm">เลือกแชทเพื่อเริ่มต้นสนทนา</p>
        </div>
      );
    }
    
    return <div className="flex-1 bg-[var(--app-bg)] w-full h-full"></div>;
  };

  // ==========================================
  // ตรรกะการแสดงผล (Layout Logic)
  // ==========================================
  const showSideNav = isDesktop || isTablet;

  const isDetailActive = activeChat !== null || activeMenu === 'profile' || activeMenu === 'settings' || activeMenu === 'media';
  let showListZone = false;
  let showDetailZone = false;

  if (isDesktop) {
    showListZone = !['profile', 'settings', 'media'].includes(activeMenu); 
    showDetailZone = true;
  } else {
    showListZone = !isDetailActive;
    showDetailZone = isDetailActive;
  }

  const showBottomNav = isMobile;

  return (
    <div className="glass-app-window w-full h-full flex flex-col relative overflow-hidden">
      
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex w-full h-full overflow-hidden">
        
        {(showSideNav || isMobile) && (
          <div className={`glass-panel flex-shrink-0 z-50 ${isMobile ? `fixed inset-y-0 left-0 w-[80px] transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}` : 'w-[80px]'}`}>
            <SideNav activeMenu={activeMenu} onMenuChange={handleMenuChange} />
          </div>
        )}

        {showListZone && (
          <div className={`glass-panel flex-shrink-0 z-30 ${isDesktop ? 'w-[320px]' : 'flex-1'}`}>
            {renderListZone()}
          </div>
        )}

        {showDetailZone && (
          <div className="flex-1 relative w-full h-full overflow-hidden bg-[var(--app-bg)]">
            {renderDetailZone()}
          </div>
        )}

      </div>

      {showBottomNav && (
         <div className="w-full flex-shrink-0 z-50 bg-[var(--nav-bg)] border-t border-[var(--border-color)] pb-safe">
           <BottomNav activeMenu={activeMenu} onMenuChange={handleMenuChange} />
         </div>
      )}

    </div>
  );
}