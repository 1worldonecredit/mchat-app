import { useState } from 'react';
import { User, Lock, ArrowRight, Fingerprint, Loader2 } from 'lucide-react';
import { loginUser } from '../utils/apiProfile';

export default function Login({ onLoginSuccess, onGoToRegister }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const data = await loginUser(formData.username, formData.password);
      if (data.success) {
        localStorage.setItem('currentUserId', data.userId);
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
      <div className="flex-1 flex flex-col justify-center px-8 pb-10 max-w-sm mx-auto w-full">
        
        <div className="mb-10 text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-[var(--card-bg)] border border-[var(--icon-active)] rounded-full flex items-center justify-center mb-6" style={{ boxShadow: '0 0 20px var(--icon-active)' }}>
            <Fingerprint size={48} className="text-[var(--icon-active)] animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-heading)] mb-2 tracking-widest">SYSTEM LOGIN</h1>
          <p className="text-[var(--icon-inactive)] text-xs">Authenticate to access your neural hub.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-sm font-semibold flex items-center justify-center">
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
                placeholder="PASSWORD" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
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
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'AUTHORIZE ACCESS'} 
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[var(--icon-inactive)] text-sm">
            ยังไม่มีรหัสประจำตัว? <button onClick={onGoToRegister} className="text-[var(--icon-active)] font-bold hover:underline ml-1">สร้างบัญชีใหม่</button>
          </p>
        </div>

      </div>
    </div>
  );
}