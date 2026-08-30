import { useState } from 'react';
import { ThemeProvider } from './ThemeContext'; // นำเข้า ThemeProvider ของคุณกลับมา
import Login from './pages/Login';
import RegisterBasic from './pages/RegisterBasic';
import Home from './pages/Home';
import Profile from './pages/Profile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(() => {
    return localStorage.getItem('currentUserId') ? 'home' : 'login';
  });

  // แยกฟังก์ชันเช็คหน้าจอออกมาเพื่อให้โค้ดอ่านง่าย
  const renderScreen = () => {
    if (currentScreen === 'login') {
      return <Login onLoginSuccess={() => setCurrentScreen('home')} onGoToRegister={() => setCurrentScreen('register')} />;
    }
    if (currentScreen === 'register') {
      return <RegisterBasic onBack={() => setCurrentScreen('login')} onRegisterSuccess={() => setCurrentScreen('profile')} />;
    }
    if (currentScreen === 'home') {
      return <Home onGoToProfile={() => setCurrentScreen('profile')} />;
    }
    if (currentScreen === 'profile') {
      return (
        <Profile 
          onBack={() => setCurrentScreen('home')} 
          onLogout={() => {
            localStorage.removeItem('currentUserId');
            setCurrentScreen('login');
          }} 
        />
      );
    }
    return null;
  };

  // เอา ThemeProvider ครอบตัวแอปไว้ (จุดนี้แหละที่แก้ปัญหาจอดับหน้า Settings)
  return (
    <ThemeProvider>
      {renderScreen()}
    </ThemeProvider>
  );
}