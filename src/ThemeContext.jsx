import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

const hexToRgb = (hex) => {
  // ป้องกัน Error กรณีค่าสีไม่ใช่ Hex Code (เช่น gradient หรือค่าว่าง)
  if (!hex || !hex.startsWith('#')) return '255, 255, 255';
  
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
};

export function ThemeProvider({ children }) {
  // 1. ดึง ID ของผู้ใช้คนปัจจุบันเพื่อแยกข้อมูลการตั้งค่าสีของแต่ละคน
  const currentUserId = localStorage.getItem('currentUserId') || 'guest';
  const storageKey = `theme_settings_${currentUserId}`;

  // 2. โหลดค่าครั้งแรก (เช็คใน LocalStorage ของคนนั้นๆ ก่อน ถ้าไม่มีให้ใช้ค่า Default ตามที่กำหนด)
  const loadInitialTheme = () => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Theme parse error", e);
      }
    }
    // ค่าเริ่มต้นตามภาพ (สว่าง, ฟอนต์ Serif, สีแอป/ขอบเหลืองส้ม, แบนราบ)
    return {
      themeMode: 'light',
      accentColor: '#F59E0B', 
      transparency: '20',
      appBg: 'default',
      cardBg: '#FFFFFF',
      textColor: 'default',
      borderColor: '#F59E0B',
      fontFamily: 'serif',
      elevation: 'flat'
    };
  };

  const initialConfig = loadInitialTheme();

  // 3. กำหนด State จากค่าเริ่มต้นที่ดึงมาได้
  const [themeMode, setThemeMode] = useState(initialConfig.themeMode);
  const [accentColor, setAccentColor] = useState(initialConfig.accentColor);
  const [transparency, setTransparency] = useState(initialConfig.transparency);
  
  const [appBg, setAppBg] = useState(initialConfig.appBg);
  const [cardBg, setCardBg] = useState(initialConfig.cardBg);
  const [textColor, setTextColor] = useState(initialConfig.textColor);
  
  const [borderColor, setBorderColor] = useState(initialConfig.borderColor);
  const [fontFamily, setFontFamily] = useState(initialConfig.fontFamily);
  const [elevation, setElevation] = useState(initialConfig.elevation);

  // 4. เอฟเฟกต์ทำงานเมื่อมีการเปลี่ยนค่า และบันทึกลงเครื่องอัตโนมัติ
  useEffect(() => {
    // บันทึกค่าลง LocalStorage (แยกตาม ID คนใช้งาน)
    const newConfig = {
      themeMode, accentColor, transparency, appBg, cardBg, textColor, borderColor, fontFamily, elevation
    };
    localStorage.setItem(storageKey, JSON.stringify(newConfig));

    // ประมวลผลและนำไปปรับแต่ง CSS Variables
    const root = document.documentElement;

    let defaultAppBg = themeMode === 'light' ? '#F3F4F6' : '#090A0F';
    let defaultCardBg = themeMode === 'light' ? '#FFFFFF' : '#161922';
    let defaultText = themeMode === 'light' ? '#111827' : '#FFFFFF';
    let defaultBorder = themeMode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';

    root.style.setProperty('--app-bg', appBg !== 'default' ? appBg : defaultAppBg);
    
    const finalTextColor = textColor !== 'default' ? textColor : defaultText;
    root.style.setProperty('--text-heading', finalTextColor);
    root.style.setProperty('--text-body', finalTextColor); 

    const finalCardBg = cardBg !== 'default' ? cardBg : defaultCardBg;
    root.style.setProperty('--card-bg', finalCardBg);
    root.style.setProperty('--nav-bg', finalCardBg);

    // สีเส้นขอบ
    root.style.setProperty('--border-color', borderColor !== 'default' ? borderColor : defaultBorder);

    // ฟอนต์ตัวอักษร
    const fonts = {
      default: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
      mono: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      rounded: '"Nunito", "Quicksand", sans-serif'
    };
    root.style.setProperty('--font-family', fonts[fontFamily] || fonts.default);
    document.body.style.fontFamily = 'var(--font-family)';

    // ความนูนและแสงเงา (Elevation/Depth)
    if (elevation === 'flat') {
      root.style.setProperty('--nav-shadow', 'none');
      root.style.setProperty('--card-shadow', 'none');
    } else if (elevation === 'raised') {
      root.style.setProperty('--nav-shadow', '0 4px 20px rgba(0,0,0,0.15)');
      root.style.setProperty('--card-shadow', '0 10px 30px rgba(0,0,0,0.2)');
    } else if (elevation === 'floating') {
      const shadowColor = themeMode === 'light' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.8)';
      root.style.setProperty('--nav-shadow', `0 10px 40px ${shadowColor}`);
      root.style.setProperty('--card-shadow', `0 20px 50px ${shadowColor}`);
    }

    // Glassmorphism Transparency
    const opacity = (transparency / 100).toFixed(2);
    let rgbSource = finalCardBg;
    if (!rgbSource.startsWith('#')) rgbSource = defaultCardBg; // ป้องกันการดึงค่า Gradient ไปคำนวณ RGB
    const rgb = hexToRgb(rgbSource);
    root.style.setProperty('--glass-surface', `rgba(${rgb}, ${opacity})`);
    
    // ไอคอนและส่วนตกแต่ง
    root.style.setProperty('--icon-active', accentColor);
    root.style.setProperty('--icon-inactive', themeMode === 'light' ? '#9CA3AF' : '#6B7280');

  }, [themeMode, accentColor, transparency, appBg, cardBg, textColor, borderColor, fontFamily, elevation, storageKey]);

  return (
    <ThemeContext.Provider value={{ 
      themeMode, setThemeMode, accentColor, setAccentColor, transparency, setTransparency,
      appBg, setAppBg, cardBg, setCardBg, textColor, setTextColor,
      borderColor, setBorderColor, fontFamily, setFontFamily, elevation, setElevation
    }}>
      {children}
    </ThemeContext.Provider>
  );
}