import { useState, useEffect } from 'react';
import { ThemeProvider } from './ThemeContext';
import Login from './pages/Login';
import RegisterBasic from './pages/RegisterBasic';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Media from './pages/Media'; 
import { ArrowRight, Sparkles } from 'lucide-react';
// นำเข้า BottomNav มาเพื่อใช้แสดงชั่วคราวในหน้าที่ยังสร้างไม่เสร็จ
import BottomNav from './components/BottomNav';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(() => {
    if (localStorage.getItem('currentUserId')) return 'media';
    if (!localStorage.getItem('isFirstTime')) return 'intro';
    return 'login';
  });

  const renderScreen = () => {
    if (currentScreen === 'intro') {
      return (
        <div className="flex flex-col items-center justify-center h-[100dvh] w-full bg-[var(--app-bg)] p-6 text-center" style={{ fontFamily: 'var(--font-family)' }}>
          <div className="w-24 h-24 bg-[var(--card-bg)] border border-[var(--icon-active)] rounded-full flex items-center justify-center mb-8" style={{ boxShadow: '0 0 30px var(--icon-active)' }}>
            <Sparkles size={40} className="text-[var(--icon-active)]" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-heading)] mb-4 tracking-widest">M-CHAT</h1>
          <p className="text-[var(--icon-inactive)] text-sm mb-12 max-w-xs leading-relaxed">
            ระบบสื่อสารและจัดการองค์กรอัจฉริยะ เชื่อมต่อทุกเครือข่ายเข้าด้วยกันอย่างปลอดภัย
          </p>
          <button 
            onClick={() => {
              localStorage.setItem('isFirstTime', 'false');
              setCurrentScreen('login');
            }}
            className="w-full max-w-xs bg-[var(--icon-active)] text-white font-bold tracking-widest py-4 rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-105"
            style={{ boxShadow: 'var(--card-shadow)' }}
          >
            GET STARTED <ArrowRight size={18} />
          </button>
        </div>
      );
    }

    if (currentScreen === 'login') {
      return (
        <Login 
          onBack={() => setCurrentScreen('intro')} 
          onLoginSuccess={() => setCurrentScreen('media')} 
          onRegisterClick={() => setCurrentScreen('register')} 
          onForgotPasswordClick={() => console.log('Navigate to Forgot Password')}
        />
      );
    }

    if (currentScreen === 'register') {
      return (
        <RegisterBasic 
          onBack={() => setCurrentScreen('login')} 
          onRegisterSuccess={() => setCurrentScreen('login')} 
        />
      );
    }

    if (currentScreen === 'media') {
      return (
        <Media setCurrentScreen={setCurrentScreen} /> 
      );
    }

    if (currentScreen === 'home') {
      return (
        <Home onGoToProfile={() => setCurrentScreen('profile')} />
      );
    }

    if (currentScreen === 'settings') {
      return (
        <Settings onBack={() => setCurrentScreen('profile')} />
      );
    }

    if (currentScreen === 'profile') {
      return (
        <Profile 
          onBack={() => setCurrentScreen('media')}
          onLogout={() => {
            localStorage.clear();
            sessionStorage.clear();
            setCurrentScreen('login');
          }} 
          onSettingsClick={() => setCurrentScreen('settings')}
        />
      );
    }

    // ==========================================
    // เพิ่มใหม่: บล็อกดักรับ 4 เมนูที่เหลือจาก BottomNav
    // ==========================================

    // 1. เมนู Chat
    if (currentScreen === 'chat') {
      // ชั่วคราว: ให้วิ่งไปเปิดหน้า Home แทน (เพราะปกติหน้า Home มักเป็นหน้ารายการแชท)
      // หากคุณมีไฟล์ Chat.jsx แล้ว สามารถแก้เป็น return <Chat setCurrentScreen={setCurrentScreen} />; ได้เลย
      return <Home onGoToProfile={() => setCurrentScreen('profile')} />;
    }

    // 2. เมนู Call, Contacts, Broadcast
    if (currentScreen === 'call' || currentScreen === 'contacts' || currentScreen === 'broadcast') {
      return (
        <div className="flex flex-col h-[100dvh] bg-[var(--app-bg)] text-[var(--text-heading)]">
          <div className="flex-1 flex flex-col items-center justify-center font-bold text-lg">
            <span>หน้าจอ {currentScreen.toUpperCase()}</span>
            <span className="text-sm text-[var(--icon-inactive)] font-normal mt-2">กำลังพัฒนา 🚧</span>
          </div>
          {/* ติดตั้ง BottomNav ไว้ให้ด้วย เพื่อให้คุณกดกลับมาหน้าอื่นได้ ไม่ค้างที่หน้าจอนี้ */}
          <div className="shrink-0 w-full z-30 bg-[var(--nav-bg)] border-t border-[var(--border-color)] pb-safe">
            <BottomNav activeMenu={currentScreen} setCurrentScreen={setCurrentScreen} />
          </div>
        </div>
      );
    }

    return null;
  };

  return <ThemeProvider>{renderScreen()}</ThemeProvider>;
}