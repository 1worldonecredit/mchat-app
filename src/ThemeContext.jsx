import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

const hexToRgb = (hex) => {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
};

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState(localStorage.getItem('themeMode') || 'dark');
  const [accentColor, setAccentColor] = useState(localStorage.getItem('accentColor') || '#3B82F6');
  const [transparency, setTransparency] = useState(localStorage.getItem('transparency') || '40');
  
  const [appBg, setAppBg] = useState(localStorage.getItem('appBg') || 'default');
  const [cardBg, setCardBg] = useState(localStorage.getItem('cardBg') || 'default');
  const [textColor, setTextColor] = useState(localStorage.getItem('textColor') || 'default');
  
  // States ใหม่ที่เพิ่มเข้ามา
  const [borderColor, setBorderColor] = useState(localStorage.getItem('borderColor') || 'default');
  const [fontFamily, setFontFamily] = useState(localStorage.getItem('fontFamily') || 'default');
  const [elevation, setElevation] = useState(localStorage.getItem('elevation') || 'flat'); // ระดับความนูน

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
    localStorage.setItem('accentColor', accentColor);
    localStorage.setItem('transparency', transparency);
    localStorage.setItem('appBg', appBg);
    localStorage.setItem('cardBg', cardBg);
    localStorage.setItem('textColor', textColor);
    localStorage.setItem('borderColor', borderColor);
    localStorage.setItem('fontFamily', fontFamily);
    localStorage.setItem('elevation', elevation);

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
      // นูนแบบลอยตัวสูง (Neumorphism / Extreme Shadow)
      const shadowColor = themeMode === 'light' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.8)';
      root.style.setProperty('--nav-shadow', `0 10px 40px ${shadowColor}`);
      root.style.setProperty('--card-shadow', `0 20px 50px ${shadowColor}`);
    }

    const opacity = (transparency / 100).toFixed(2);
    const rgb = hexToRgb(finalCardBg);
    root.style.setProperty('--glass-surface', `rgba(${rgb}, ${opacity})`);
    
    root.style.setProperty('--icon-active', accentColor);
    root.style.setProperty('--icon-inactive', themeMode === 'light' ? '#9CA3AF' : '#6B7280');

  }, [themeMode, accentColor, transparency, appBg, cardBg, textColor, borderColor, fontFamily, elevation]);

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