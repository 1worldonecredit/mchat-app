import { useState } from 'react';
import { ArrowLeft, User, Lock, ArrowRight, Fingerprint, Loader2 } from 'lucide-react';
import { loginUser } from '../utils/apiProfile';

export default function Login({ onBack, onLoginSuccess }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        // บันทึกข้อมูลและสิทธิ์ลงเครื่อง เพื่อความฉลาดของระบบตอนสลับหน้าจอ
        localStorage.setItem('currentUserId', data.userId);
        localStorage.setItem('currentUserRoles', JSON.stringify(data.roles));
        
        // เช็กสิทธิ์โชว์ความฉลาดนิดนึงก่อนพาเข้าแอป
        if (data.roles.includes('ADMIN') || data.roles.includes('SUPERADMIN')) {
          alert(`ยินดีต้อนรับผู้ดูแลระบบ: ${data.username}`);
        }
        
        onLoginSuccess(); // ทะลุเข้าสู่หน้าแอปหลัก (Media/Feed)
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[var(--app-bg)] transition-all duration-300" style={{ fontFamily: 'var(--font-family)' }}>
      
      <div className="sticky top-0 z-40 flex items-center px-6 py-4 bg-[var(--glass-surface)] backdrop-blur-xl border-b border-[var(--border-color)] transition-all">
        <button type="button" onClick={onBack} className="text-[var(--text-heading)] hover:text-[var(--icon-active)] transition p-2 -ml-2 rounded-lg">
          <ArrowLeft size={24} />
        </button>
        <span className="ml-4 text-xs text-[var(--text-heading)] tracking-widest font-bold">SECURE LOGIN</span>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8 pb-20 max-w-md mx-auto w-full">
        
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

          <button type="submit" disabled={isLoading} className="w-full mt-8 bg-[var(--card-bg)] border border-[var(--icon-active)] text-[var(--icon-active)] font-bold tracking-widest py-4 rounded-xl flex items-center justify-center gap-3 transition-all hover:bg-[var(--icon-active)] hover:text-white disabled:opacity-50" style={{ boxShadow: 'var(--card-shadow)' }}>
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'ACCESS SYSTEM'} 
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
}