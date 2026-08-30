import { useState } from 'react';
import { ArrowLeft, User, Lock, ArrowRight, ShieldAlert, Loader2 } from 'lucide-react';
import { registerBasicUser } from '../utils/apiProfile';

export default function RegisterBasic({ onBack, onRegisterSuccess }) {
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) return setError('ENCRYPTION MISMATCH: รหัสผ่านไม่ตรงกัน');
    if (formData.username.length < 4) return setError('INVALID INPUT: ชื่อผู้ใช้ต้องมีอย่างน้อย 4 ตัวอักษร');

    setIsLoading(true);
    
    try {
      const data = await registerBasicUser(formData.username, formData.password);
      if (data.success) {
        localStorage.setItem('currentUserId', data.userId);
        onRegisterSuccess(); 
      }
    } catch (err) {
      setError(`SYSTEM ERROR: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[var(--app-bg)] transition-all duration-300 overflow-y-auto" style={{ fontFamily: 'var(--font-family)' }}>
      
      {/* Header แบบเดียวกับ Profile.jsx */}
      <div className="sticky top-0 z-40 flex items-center px-6 py-4 bg-[var(--glass-surface)] backdrop-blur-xl border-b border-[var(--border-color)] transition-all" style={{ boxShadow: 'var(--nav-shadow)' }}>
        <button onClick={onBack} className="text-[var(--text-heading)] hover:text-[var(--icon-active)] transition p-2 -ml-2 rounded-lg">
          <ArrowLeft size={24} />
        </button>
        <span className="ml-4 text-xs text-[var(--text-heading)] tracking-widest font-bold">SECURE REGISTRATION</span>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8 pb-20 max-w-sm mx-auto w-full">
        
        <div className="mb-10 text-center flex flex-col items-center mt-8">
          <div className="w-20 h-20 bg-[var(--card-bg)] border border-[var(--icon-active)] rounded-full flex items-center justify-center mb-6" style={{ boxShadow: '0 0 15px var(--icon-active)' }}>
            <ShieldAlert size={36} className="text-[var(--icon-active)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-heading)] mb-2 tracking-wider">CREATE IDENTITY</h1>
          <p className="text-[var(--icon-inactive)] text-xs">Establish your core credentials for system access.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-sm font-semibold flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-[var(--icon-inactive)] group-focus-within:text-[var(--icon-active)] transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="USERNAME" 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-xl pl-12 pr-4 py-4 outline-none focus:border-[var(--icon-active)] transition-all text-sm"
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-[var(--icon-inactive)] group-focus-within:text-[var(--icon-active)] transition-colors" />
              </div>
              <input 
                type="password" 
                placeholder="ENCRYPTION KEY" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-xl pl-12 pr-4 py-4 outline-none focus:border-[var(--icon-active)] transition-all text-sm tracking-widest"
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-[var(--icon-inactive)] group-focus-within:text-[var(--icon-active)] transition-colors" />
              </div>
              <input 
                type="password" 
                placeholder="CONFIRM ENCRYPTION KEY" 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-xl pl-12 pr-4 py-4 outline-none focus:border-[var(--icon-active)] transition-all text-sm tracking-widest"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-8 bg-[var(--card-bg)] border border-[var(--icon-active)] text-[var(--icon-active)] font-bold tracking-widest py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 hover:bg-[var(--icon-active)] hover:text-white"
            style={{ boxShadow: 'var(--card-shadow)' }}
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'INITIALIZE ACCOUNT'} 
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

      </div>
    </div>
  );
}