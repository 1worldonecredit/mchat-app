import { useState } from 'react';
import { ThemeProvider } from './ThemeContext';
import Login from './pages/Login';
import RegisterBasic from './pages/RegisterBasic';
import Home from './pages/Home';
import Profile from './pages/Profile';

export default function App() {
  // ตรวจสอบสถานะการล็อกอินตอนเปิดแอป
  const [currentScreen, setCurrentScreen] = useState(() => {
    return localStorage.getItem('currentUserId') ? 'home' : 'login';
  });

  const renderScreen = () => {
    if (currentScreen === 'login') {
      return (
        <Login 
          onLoginSuccess={() => setCurrentScreen('home')} 
          onGoToRegister={() => setCurrentScreen('register')} 
        />
      );
    }
    
    if (currentScreen === 'register') {
      return (
        <RegisterBasic 
          onBack={() => setCurrentScreen('login')} 
          // ปรับให้พาไปหน้า home (ซึ่งจะแสดงหน้า Media เป็นหน้าแรกตามที่ตั้งค่าไว้ใน Home)
          onRegisterSuccess={() => setCurrentScreen('home')} 
        />
      );
    }
    
    if (currentScreen === 'home') {
      return (
        <Home 
          onGoToProfile={() => setCurrentScreen('profile')} 
        />
      );
    }
    
    if (currentScreen === 'profile') {
      return (
        <Profile 
          onBack={() => setCurrentScreen('home')} 
          onLogout={() => {
            // สำคัญ: ใช้ clear() ล้างข้อมูลทั้งหมดป้องกัน ID หรือ Theme เก่าค้างจนทำให้หน้าจอหมุนติ้ว
            localStorage.clear();
            sessionStorage.clear();
            setCurrentScreen('login');
          }} 
        />
      );
    }
    
    return null;
  };

  return (
    <ThemeProvider>
      {renderScreen()}
    </ThemeProvider>
  );
}