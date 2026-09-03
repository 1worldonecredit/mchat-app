import { useState, useEffect } from 'react';
import { ArrowLeft, User, Lock, ArrowRight, Fingerprint, Loader2, Mail, CheckSquare, Square } from 'lucide-react';
import { loginUser } from '../utils/apiProfile';

export default function Login({ onBack, onLoginSuccess, onRegisterClick, onForgotPasswordClick }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem('savedUsername');
    if (savedUsername) {
      setFormData(prev => ({ ...prev, username: savedUsername }));
      setRememberMe(true);
    }
  }, []);

  // ฟังก์ชันดึงพิกัดและแปลงเป็นชื่อจังหวัด (ทำงานเบื้องหลัง)
  const fetchUserLocationAndSave = async (userId) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const apiKey = "ใส่_API_KEY_ของคุณที่นี่"; // นำ Geocoding API Key จาก Google Cloud มาใส่
        
        try {
          const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=th&key=${apiKey}`);
          const result = await res.json();
          let provinceName = "ไม่ระบุตำแหน่ง";
          
          if (result.results && result.results.length > 0) {
            const addressComponents = result.results[0].address_components;
            const provinceObj = addressComponents.find(comp => comp.types.includes("administrative_area_level_1"));
            if (provinceObj) provinceName = provinceObj.long_name;
          }
          
          // เก็บชื่อจังหวัดไว้ใช้ในหน้า Media ทันที
          localStorage.setItem('userProvince', provinceName);
          
          // TODO: เพิ่มฟังก์ชันส่งข้อมูล lat, lng, provinceName ไปบันทึกลง Database ของคุณ
          // เช่น await updateLocationAPI(userId, lat, lng, provinceName);
          
        } catch (err) {
          console.error("Geocoding API Error:", err);
        }
      }, (error) => {
        console.error("ผู้ใช้ไม่อนุญาตให้เข้าถึงตำแหน่ง:", error);
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      return setError('กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน');
    }

    setIsLoading(true);

    try {
      const data = await loginUser(formData);
      if (data.success) {
        if (rememberMe) {
          localStorage.setItem('savedUsername', formData.username);
        } else {
          localStorage.removeItem('savedUsername');
        }

        localStorage.setItem('currentUserId', data.userId);
        localStorage.setItem('currentUserRoles', JSON.stringify(data.roles));
        
        // เรียกใช้ฟังก์ชันดึงตำแหน่งทันทีที่ Login ผ่าน โดยไม่รอให้เสร็จ (ไม่บล็อก UI)
        fetchUserLocationAndSave(data.userId);
        
        if (data.roles.includes('ADMIN') || data.roles.includes('SUPERADMIN')) {
          alert(`ยินดีต้อนรับผู้ดูแลระบบ: ${data.username}`);
        }
        
        onLoginSuccess();
      }
    } catch (err) {
      setError(`ACCESS DENIED: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[var(--app-bg)] transition-all duration-300 overflow-y-auto" style={{ fontFamily: 'var(--font-family)' }}>
      
      <div className="sticky top-0 z-40 flex items-center px-6 py-4 bg-[var(--glass-surface)] backdrop-blur-xl border-b border-[var(--border-color)] transition-all">
        <button type="button" onClick={onBack} className="text-[var(--text-heading)] hover:text-[var(--icon-active)] transition p-2 -ml-2 rounded-lg">
          <ArrowLeft size={24} />
        </button>
        <span className="ml-4 text-xs text-[var(--text-heading)] tracking-widest font-bold">SECURE LOGIN</span>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8 pb-20 max-w-md mx-auto w-full mt-6">
        
        <div className="mb-10 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-[var(--card-bg)] border border-[var(--icon-active)] rounded-full flex items-center justify-center mb-6" style={{ boxShadow: '0 0 20px var(--icon-active)' }}>
            <Fingerprint size={40} className="text-[var(--icon-active)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-heading)] mb-2 tracking-wider">AUTHENTICATION</h1>
          <p className="text-[var(--icon-inactive)] text-sm">Enter your credentials to access the system.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-3">
            <div className="relative group border border-[var(--border-color)] rounded-xl bg-[var(--card-bg)] focus-within:border-[var(--icon-active)] transition-colors">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-[var(--icon-inactive)] group-focus-within:text-[var(--icon-active)] transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="USERNAME" 
                value={formData.username} 
                onChange={(e) => setFormData({...formData, username: e.target.value})} 
                className="w-full bg-transparent text-[var(--text-heading)] rounded-xl pl-12 pr-4 py-4 outline-none text-sm tracking-wide" 
                required 
              />
            </div>

            <div className="relative group border border-[var(--border-color)] rounded-xl bg-[var(--card-bg)] focus-within:border-[var(--icon-active)] transition-colors">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-[var(--icon-inactive)] group-focus-within:text-[var(--icon-active)] transition-colors" />
              </div>
              <input 
                type="password" 
                placeholder="PASSWORD" 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                className="w-full bg-transparent text-[var(--text-heading)] rounded-xl pl-12 pr-4 py-4 outline-none text-sm tracking-widest" 
                required 
              />
            </div>
          </div>

          {/* ระบบจำรหัสผ่าน และ กู้คืนรหัสผ่าน */}
          <div className="flex items-center justify-between mt-2 px-1">
            <button type="button" onClick={() => setRememberMe(!rememberMe)} className="flex items-center gap-2 text-[var(--icon-inactive)] hover:text-[var(--text-heading)] transition-colors text-xs font-medium">
              {rememberMe ? <CheckSquare size={16} className="text-[var(--icon-active)]" /> : <Square size={16} />}
              จดจำชื่อผู้ใช้
            </button>
            <button type="button" onClick={onForgotPasswordClick} className="text-[var(--icon-active)] text-xs hover:underline transition-all font-semibold tracking-wide">
              ลืมรหัสผ่าน?
            </button>
          </div>

          <button type="submit" disabled={isLoading} className="w-full mt-6 bg-[var(--card-bg)] border border-[var(--icon-active)] text-[var(--icon-active)] font-bold tracking-widest py-4 rounded-xl flex items-center justify-center gap-3 transition-all hover:bg-[var(--icon-active)] hover:text-white disabled:opacity-50" style={{ boxShadow: 'var(--card-shadow)' }}>
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'AUTHORIZE ACCESS'} 
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* วิธีการเข้าสู่ระบบแบบอื่นๆ (Biometrics / Social) */}
        <div className="mt-8 flex flex-col gap-4">
          <div className="relative flex items-center justify-center">
            <span className="absolute bg-[var(--app-bg)] px-3 text-[var(--icon-inactive)] text-[10px] tracking-widest uppercase">OR LOGIN WITH</span>
            <div className="w-full border-t border-[var(--border-color)]"></div>
          </div>
          
          <button type="button" className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-heading)] py-3 rounded-xl flex items-center justify-center gap-3 transition-all hover:border-[var(--icon-active)] text-sm">
             <Mail size={18} className="text-red-500" /> Gmail Account
          </button>
          
          <button type="button" className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-heading)] py-3 rounded-xl flex items-center justify-center gap-3 transition-all hover:border-[var(--icon-active)] text-sm">
             <Fingerprint size={18} className="text-green-500" /> Biometrics (Face ID / Touch ID)
          </button>
        </div>

        {/* ลิงก์สำหรับสลับไปหน้าลงทะเบียน */}
        <div className="mt-10 text-center">
          <p className="text-[var(--icon-inactive)] text-xs">
            ยังไม่มีรหัสประจำตัว?{' '}
            <button type="button" onClick={onRegisterClick} className="text-[var(--icon-active)] font-bold tracking-wider hover:underline transition-all">
              สร้างบัญชีใหม่
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}