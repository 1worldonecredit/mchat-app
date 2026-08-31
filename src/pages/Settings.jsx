import { ArrowLeft, Sun, Moon, Droplet, LayoutTemplate, Type, Box, Layers, Brush } from 'lucide-react';
import { useContext, useEffect } from 'react';
import { ThemeContext } from '../ThemeContext';

export default function Settings({ onBack }) {
  const { 
    themeMode, setThemeMode, accentColor, setAccentColor, transparency, setTransparency, 
    appBg, setAppBg, cardBg, setCardBg, textColor, setTextColor,
    borderColor, setBorderColor, fontFamily, setFontFamily, elevation, setElevation
  } = useContext(ThemeContext);

  // ดึง ID ผู้ใช้เพื่อใช้เป็น Key ในการเซฟข้อมูลแยกคน
  const currentUserId = localStorage.getItem('currentUserId') || 'guest';
  const storageKey = `theme_settings_${currentUserId}`;

  // บันทึกค่าลง localStorage อัตโนมัติทุกครั้งที่มีการเปลี่ยนค่าใดๆ
  useEffect(() => {
    const themeConfig = {
      themeMode, accentColor, transparency, appBg, cardBg, textColor, borderColor, fontFamily, elevation
    };
    localStorage.setItem(storageKey, JSON.stringify(themeConfig));
  }, [themeMode, accentColor, transparency, appBg, cardBg, textColor, borderColor, fontFamily, elevation, storageKey]);

  const appBackgrounds = [
    { id: 'default', value: 'default', label: 'ดั้งเดิม' },
    { id: 'grey', value: '#374151', label: 'เทา' },
    { id: 'gold', value: 'linear-gradient(135deg, #1e130c, #9a8478)', label: 'ทอง' },
    { id: 'ocean', value: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)', label: 'ทะเล' },
    { id: 'cyber', value: 'linear-gradient(135deg, #120E1F, #050714)', label: 'ไซเบอร์' },
  ];

  const cardBackgrounds = [
    { id: 'default', hex: 'default' },
    { id: 'black', hex: '#000000' },
    { id: 'white', hex: '#FFFFFF' },
    { id: 'glassDark', hex: '#111827' },
    { id: 'goldCard', hex: '#3E2704' },
    { id: 'slate', hex: '#1E293B' },
  ];

  const textColors = [
    { id: 'default', hex: 'default', label: 'Aa' },
    { id: 'white', hex: '#FFFFFF', label: 'Aa' },
    { id: 'black', hex: '#000000', label: 'Aa' },
    { id: 'neonGreen', hex: '#39FF14', label: 'Aa' },
    { id: 'goldText', hex: '#FBBF24', label: 'Aa' },
  ];

  const borderColors = [
    { id: 'default', hex: 'default', label: 'เนียน' },
    { id: 'white', hex: 'rgba(255,255,255,0.3)', label: 'ขาว' },
    { id: 'accent', hex: accentColor, label: 'สีแอป' },
    { id: 'goldBorder', hex: '#FBBF24', label: 'ทอง' },
  ];

  const accentColors = [
    { id: 'blue', hex: '#3B82F6', shadow: 'rgba(59, 130, 246, 0.6)' },
    { id: 'green', hex: '#10B981', shadow: 'rgba(16, 185, 129, 0.6)' },
    { id: 'yellow', hex: '#F59E0B', shadow: 'rgba(245, 158, 11, 0.6)' },
    { id: 'red', hex: '#EF4444', shadow: 'rgba(239, 68, 68, 0.6)' },
    { id: 'coral', hex: '#F43F5E', shadow: 'rgba(244, 63, 94, 0.6)' },
  ];

  return (
    <div className="flex flex-col w-full h-[100dvh] md:h-full bg-[var(--app-bg)] transition-all duration-300" style={{ fontFamily: 'var(--font-family)' }}>
      
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-[var(--glass-surface)] backdrop-blur-xl border-b border-[var(--border-color)] transition-all duration-300" style={{ boxShadow: 'var(--nav-shadow)' }}>
        <button onClick={onBack} className="text-[var(--text-heading)] hover:opacity-70 transition p-2">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-[var(--text-heading)] text-lg font-bold tracking-wide">Themes & Post Style</h2>
        <div className="text-[var(--icon-active)]"><Brush size={24}/></div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6 relative">
        <div className="max-w-xl mx-auto w-full flex flex-col gap-8 pb-10"> 
          
          {/* Base Theme */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[var(--text-heading)] text-sm font-semibold uppercase px-2 opacity-80">Base Theme (ค่าเริ่มต้น)</h3>
            <div className="flex bg-[var(--glass-surface)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl p-1 shadow-sm">
              <button onClick={() => setThemeMode('light')} className={`flex-1 flex justify-center py-3 rounded-xl transition-all ${themeMode === 'light' ? 'bg-[var(--icon-active)] text-white' : 'text-[var(--text-heading)] opacity-60'}`}><Sun size={20} /></button>
              <button onClick={() => setThemeMode('dark')} className={`flex-1 flex justify-center py-3 rounded-xl transition-all ${themeMode === 'dark' ? 'bg-[var(--icon-active)] text-white' : 'text-[var(--text-heading)] opacity-60'}`}><Moon size={20} /></button>
            </div>
          </div>

          {/* App Background */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[var(--text-heading)] text-sm font-semibold uppercase px-2 opacity-80">สีพื้นหลังแอป (App BG)</h3>
            <div className="grid grid-cols-5 gap-2 bg-[var(--glass-surface)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl p-4">
              {appBackgrounds.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setAppBg(bg.value)}
                  className={`w-full aspect-square rounded-xl transition-all border-2 ${appBg === bg.value ? 'border-[var(--icon-active)] scale-110 shadow-lg' : 'border-transparent'}`}
                  style={{ background: bg.value === 'default' ? (themeMode==='light'?'#F3F4F6':'#090A0F') : bg.value }}
                />
              ))}
            </div>
          </div>

          {/* Card & Nav Background */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[var(--text-heading)] text-sm font-semibold uppercase px-2 opacity-80">สีกล่องแชทและเมนู (Card & Nav)</h3>
            <div className="flex justify-between bg-[var(--glass-surface)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl p-5">
              {cardBackgrounds.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setCardBg(bg.hex)}
                  className={`w-10 h-10 rounded-full transition-all border-2 ${cardBg === bg.hex ? 'border-[var(--icon-active)] scale-125' : 'border-[var(--border-color)]'}`}
                  style={{ backgroundColor: bg.hex === 'default' ? (themeMode==='light'?'#FFFFFF':'#161922') : bg.hex }}
                />
              ))}
            </div>
          </div>

          {/* Text Color */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[var(--text-heading)] text-sm font-semibold uppercase px-2 opacity-80">สีตัวอักษรข้อความโพสต์ (Post Text)</h3>
            <div className="flex justify-between bg-[var(--glass-surface)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl p-4">
              {textColors.map((txt) => (
                <button
                  key={txt.id}
                  onClick={() => setTextColor(txt.hex)}
                  className={`flex-1 flex justify-center py-2 mx-1 rounded-lg transition-all font-bold border ${textColor === txt.hex ? 'border-[var(--icon-active)] bg-[var(--border-color)]' : 'border-transparent'}`}
                  style={{ color: txt.hex === 'default' ? (themeMode==='light'?'#111827':'#FFFFFF') : txt.hex }}
                >
                  {txt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fonts */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[var(--text-heading)] text-sm font-semibold uppercase px-2 opacity-80">รูปแบบตัวอักษร (Typography)</h3>
            <div className="grid grid-cols-2 gap-2 bg-[var(--glass-surface)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl p-4">
               <button onClick={() => setFontFamily('default')} className={`py-2 rounded-lg border ${fontFamily === 'default' ? 'border-[var(--icon-active)] text-[var(--icon-active)]' : 'border-transparent text-[var(--text-heading)]'}`}>เรียบง่าย (Default)</button>
               <button onClick={() => setFontFamily('serif')} className={`py-2 rounded-lg border ${fontFamily === 'serif' ? 'border-[var(--icon-active)] text-[var(--icon-active)]' : 'border-transparent text-[var(--text-heading)]'}`} style={{fontFamily: 'serif'}}>คลาสสิก (Serif)</button>
               <button onClick={() => setFontFamily('mono')} className={`py-2 rounded-lg border ${fontFamily === 'mono' ? 'border-[var(--icon-active)] text-[var(--icon-active)]' : 'border-transparent text-[var(--text-heading)]'}`} style={{fontFamily: 'monospace'}}>ไซเบอร์ (Mono)</button>
               <button onClick={() => setFontFamily('rounded')} className={`py-2 rounded-lg border ${fontFamily === 'rounded' ? 'border-[var(--icon-active)] text-[var(--icon-active)]' : 'border-transparent text-[var(--text-heading)]'}`} style={{fontFamily: '"Nunito", sans-serif'}}>โค้งมน (Rounded)</button>
            </div>
          </div>

          {/* Border Color */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[var(--text-heading)] text-sm font-semibold uppercase px-2 opacity-80">สีเส้นขอบการ์ด (Border)</h3>
            <div className="flex justify-between bg-[var(--glass-surface)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl p-4">
              {borderColors.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBorderColor(b.hex)}
                  className={`flex-1 py-2 mx-1 rounded-lg transition-all font-bold border-2 text-center text-[var(--text-heading)] ${borderColor === b.hex ? 'scale-105 border-[var(--icon-active)]' : ''}`}
                  style={{ borderColor: b.hex === 'default' ? 'var(--border-color)' : b.hex }}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Elevation (ความลึก/นูน) */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[var(--text-heading)] text-sm font-semibold uppercase px-2 opacity-80">มิติความลึก (Depth & Elevation)</h3>
            <div className="flex justify-between bg-[var(--glass-surface)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl p-4">
              <button onClick={() => setElevation('flat')} className={`flex-1 py-3 mx-1 rounded-lg border transition-all text-[var(--text-heading)] ${elevation === 'flat' ? 'bg-[var(--icon-active)] text-white border-transparent' : 'border-[var(--border-color)]'}`}>แบนราบ (Flat)</button>
              <button onClick={() => setElevation('raised')} className={`flex-1 py-3 mx-1 rounded-lg border transition-all text-[var(--text-heading)] shadow-md ${elevation === 'raised' ? 'bg-[var(--icon-active)] text-white border-transparent' : 'border-[var(--border-color)]'}`}>นูน (Raised)</button>
              <button onClick={() => setElevation('floating')} className={`flex-1 py-3 mx-1 rounded-lg border transition-all text-[var(--text-heading)] shadow-[0_10px_20px_rgba(0,0,0,0.5)] ${elevation === 'floating' ? 'bg-[var(--icon-active)] text-white border-transparent' : 'border-[var(--border-color)]'}`}>ลอยตัว (Floating)</button>
            </div>
          </div>

          {/* Accent Color */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[var(--text-heading)] text-sm font-semibold uppercase px-2 opacity-80">สีปุ่มเรืองแสง (Accent Color)</h3>
            <div className="bg-[var(--glass-surface)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl p-6 flex justify-between items-center">
              {accentColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setAccentColor(color.hex)}
                  className="w-8 h-8 rounded-full transition-all"
                  style={{
                    backgroundColor: color.hex,
                    boxShadow: accentColor === color.hex ? `0 0 20px ${color.shadow}` : 'none',
                    transform: accentColor === color.hex ? 'scale(1.3)' : 'scale(1)',
                    border: accentColor === color.hex ? '2px solid #FFF' : '2px solid transparent'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Transparency Slider */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[var(--text-heading)] text-sm font-semibold uppercase px-2 opacity-80">ความโปร่งแสงของ Card/Nav (Glassmorphism)</h3>
            <div className="bg-[var(--glass-surface)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl p-6 flex items-center gap-4">
              <Droplet size={24} className="text-[var(--icon-active)]" />
              <input 
                type="range" min="0" max="100" 
                value={transparency}
                onChange={(e) => setTransparency(e.target.value)}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer outline-none"
                style={{ background: `linear-gradient(to right, var(--icon-active) ${transparency}%, var(--border-color) ${transparency}%)` }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}