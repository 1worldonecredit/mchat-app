import { useState, useEffect } from 'react';
import { ArrowLeft, User, Lock, ArrowRight, ShieldAlert, Loader2, Calendar, Globe, Users, Fingerprint, Mail, Calculator, CheckCircle2, XCircle, UserPlus, CheckSquare, Square } from 'lucide-react';
import { registerBasicUser, fetchReferenceData, checkUsername } from '../utils/apiProfile';

export default function RegisterBasic({ onBack, onRegisterSuccess }) {
  const [formData, setFormData] = useState({ 
    username: '', password: '', confirmPassword: '', 
    country: '', gender: '', dob: '', referrer: '' 
  });
  
  // State ไม่มีผู้แนะนำ
  const [noReferrer, setNoReferrer] = useState(false);

  const [countries, setCountries] = useState([]);
  const [genders, setGenders] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [botAnswer, setBotAnswer] = useState('');

  const [dateMode, setDateMode] = useState('thai'); 
  const [thaiDay, setThaiDay] = useState('');
  const [thaiMonth, setThaiMonth] = useState('');
  const [thaiYear, setThaiYear] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [usernameStatus, setUsernameStatus] = useState(''); 
  const [usernameMessage, setUsernameMessage] = useState('');

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const thaiMonths = [
    { v: 1, n: 'มกราคม' }, { v: 2, n: 'กุมภาพันธ์' }, { v: 3, n: 'มีนาคม' }, { v: 4, n: 'เมษายน' },
    { v: 5, n: 'พฤษภาคม' }, { v: 6, n: 'มิถุนายน' }, { v: 7, n: 'กรกฎาคม' }, { v: 8, n: 'สิงหาคม' },
    { v: 9, n: 'กันยายน' }, { v: 10, n: 'ตุลาคม' }, { v: 11, n: 'พฤศจิกายน' }, { v: 12, n: 'ธันวาคม' }
  ];
  const currentYearBE = new Date().getFullYear() + 543;
  const yearsBE = Array.from({ length: 100 }, (_, i) => currentYearBE - i); 

  useEffect(() => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);

    const loadData = async () => {
      try {
        const data = await fetchReferenceData();
        if (data.success) {
          setCountries(data.countries);
          setGenders(data.genders);
        }
      } catch (err) {
        setError('SYSTEM ERROR: ไม่สามารถโหลดข้อมูลระบบได้');
      } finally {
        setIsDataLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (dateMode === 'thai' && thaiDay && thaiMonth && thaiYear) {
      const standardYear = thaiYear - 543;
      const standardMonth = String(thaiMonth).padStart(2, '0');
      const standardDay = String(thaiDay).padStart(2, '0');
      setFormData(prev => ({ ...prev, dob: `${standardYear}-${standardMonth}-${standardDay}` }));
    }
  }, [thaiDay, thaiMonth, thaiYear, dateMode]);

  useEffect(() => {
    const currentUsername = formData.username;
    
    if (!currentUsername) {
      setUsernameStatus('');
      setUsernameMessage('');
      return;
    }

    if (currentUsername.length < 6) {
      setUsernameStatus('invalid');
      setUsernameMessage('ชื่อผู้ใช้ต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }

    setUsernameStatus('checking');
    setUsernameMessage('กำลังตรวจสอบ...');

    const timeoutId = setTimeout(async () => {
      const result = await checkUsername(currentUsername);
      if (result.success) {
        if (result.available) {
          setUsernameStatus('available');
          setUsernameMessage('ชื่อผู้ใช้นี้สามารถใช้งานได้');
        } else {
          setUsernameStatus('taken');
          setUsernameMessage('ชื่อผู้ใช้นี้ถูกใช้งานแล้ว');
        }
      } else {
        setUsernameStatus('invalid');
        setUsernameMessage('ไม่สามารถตรวจสอบได้ในขณะนี้');
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ตรวจสอบระบบผู้แนะนำ
    if (!noReferrer && !formData.referrer) {
      return setError('MISSING DATA: กรุณาระบุชื่อผู้แนะนำ หรือติ๊กเลือก "ไม่มีผู้แนะนำ"');
    }
    
    if (!formData.country || !formData.gender) {
      return setError('MISSING DATA: กรุณาเลือกประเทศและเพศของคุณ');
    }
    
    if (formData.username.length < 6) {
      return setError('INVALID INPUT: ชื่อผู้ใช้ต้องมีอย่างน้อย 6 ตัวอักษร');
    }

    if (usernameStatus === 'taken') {
      return setError('INVALID INPUT: ชื่อผู้ใช้นี้ถูกใช้งานแล้ว กรุณาเปลี่ยนใหม่');
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      return setError('WEAK PASSWORD: รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร และประกอบด้วยตัวอักษรผสมตัวเลข');
    }
    if (formData.password !== formData.confirmPassword) {
      return setError('ENCRYPTION MISMATCH: รหัสผ่านไม่ตรงกัน');
    }

    if (parseInt(botAnswer) !== num1 + num2) {
      return setError('VERIFICATION FAILED: คำตอบคณิตศาสตร์ไม่ถูกต้อง (Bot Check)');
    }

    if (!formData.dob) {
      return setError('MISSING DATA: กรุณาระบุวันเกิดให้ครบถ้วน');
    }

    setIsLoading(true);
    
    try {
      const data = await registerBasicUser(formData);
      if (data.success) {
        alert('ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบด้วยชื่อผู้ใช้และรหัสผ่านของคุณ');
        onBack(); 
      }
    } catch (err) {
      setError(`SYSTEM ERROR: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[var(--app-bg)] transition-all duration-300 overflow-y-auto" style={{ fontFamily: 'var(--font-family)' }}>
      
      <div className="sticky top-0 z-40 flex items-center px-6 py-4 bg-[var(--glass-surface)] backdrop-blur-xl border-b border-[var(--border-color)] transition-all" style={{ boxShadow: 'var(--nav-shadow)' }}>
        <button type="button" onClick={onBack} className="text-[var(--text-heading)] hover:text-[var(--icon-active)] transition p-2 -ml-2 rounded-lg">
          <ArrowLeft size={24} />
        </button>
        <span className="ml-4 text-xs text-[var(--text-heading)] tracking-widest font-bold">SECURE REGISTRATION</span>
      </div>

      <div className="flex-1 flex flex-col px-8 pb-20 max-w-md mx-auto w-full">
        
        <div className="mb-8 text-center flex flex-col items-center mt-6">
          <div className="w-16 h-16 bg-[var(--card-bg)] border border-[var(--icon-active)] rounded-full flex items-center justify-center mb-4" style={{ boxShadow: '0 0 15px var(--icon-active)' }}>
            <ShieldAlert size={28} className="text-[var(--icon-active)]" />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-heading)] mb-1 tracking-wider">CREATE IDENTITY</h1>
          <p className="text-[var(--icon-inactive)] text-xs">Establish your core credentials.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-3">
            {/* Username */}
            <div className="space-y-1">
              <div className={`relative group border ${usernameStatus === 'available' ? 'border-green-500' : usernameStatus === 'taken' || usernameStatus === 'invalid' ? 'border-red-500' : 'border-[var(--border-color)]'} rounded-xl bg-[var(--card-bg)] transition-colors focus-within:border-[var(--icon-active)]`}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-[var(--icon-inactive)] group-focus-within:text-[var(--icon-active)] transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="USERNAME (ขั้นต่ำ 6 ตัวอักษร)" 
                  value={formData.username} 
                  onChange={(e) => setFormData({...formData, username: e.target.value})} 
                  className="w-full bg-transparent text-[var(--text-heading)] rounded-xl pl-12 pr-10 py-3 outline-none text-sm" 
                  required 
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {usernameStatus === 'checking' && <Loader2 size={16} className="animate-spin text-[var(--icon-inactive)]" />}
                  {usernameStatus === 'available' && <CheckCircle2 size={16} className="text-green-500" />}
                  {(usernameStatus === 'taken' || usernameStatus === 'invalid') && <XCircle size={16} className="text-red-500" />}
                </div>
              </div>
              {usernameMessage && (
                <p className={`text-[10px] pl-2 ${usernameStatus === 'available' ? 'text-green-500' : 'text-red-500'}`}>
                  {usernameMessage}
                </p>
              )}
            </div>

            {/* ระบบผู้แนะนำ (Referrer) */}
            <div className="space-y-1 pb-1">
              <div className="flex items-center justify-between px-1 mb-1">
                 <span className="text-[10px] text-[var(--icon-inactive)] uppercase tracking-widest flex items-center gap-1">
                   <UserPlus size={12} /> ผู้แนะนำ (Referrer)
                 </span>
                 <button type="button" onClick={() => { setNoReferrer(!noReferrer); setFormData({...formData, referrer: ''}); }} className="flex items-center gap-2 text-[var(--icon-inactive)] hover:text-[var(--text-heading)] transition-colors text-xs font-medium">
                   {noReferrer ? <CheckSquare size={16} className="text-[var(--icon-active)]" /> : <Square size={16} />}
                   ไม่มีผู้แนะนำ
                 </button>
              </div>
              
              <div className={`relative group border border-[var(--border-color)] rounded-xl bg-[var(--card-bg)] transition-all overflow-hidden ${noReferrer ? 'opacity-30 pointer-events-none h-0 border-0' : 'h-[46px] focus-within:border-[var(--icon-active)]'}`}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserPlus size={18} className="text-[var(--icon-inactive)] group-focus-within:text-[var(--icon-active)] transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="USERNAME ผู้แนะนำ" 
                  value={formData.referrer} 
                  onChange={(e) => setFormData({...formData, referrer: e.target.value})} 
                  className="w-full bg-transparent text-[var(--text-heading)] rounded-xl pl-12 pr-4 py-3 outline-none text-sm" 
                  disabled={noReferrer}
                />
              </div>
            </div>

            {/* Country & Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe size={18} className="text-[var(--icon-inactive)] group-focus-within:text-[var(--icon-active)] transition-colors" />
                </div>
                <select 
                  value={formData.country} 
                  onChange={(e) => setFormData({...formData, country: e.target.value})} 
                  className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-xl pl-10 pr-2 py-3 outline-none focus:border-[var(--icon-active)] transition-all text-sm appearance-none"
                  disabled={isDataLoading}
                >
                  <option value="" disabled hidden>-- เลือกประเทศ --</option>
                  {isDataLoading ? (
                    <option value="">Loading...</option>
                  ) : (
                    countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)
                  )}
                </select>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users size={18} className="text-[var(--icon-inactive)] group-focus-within:text-[var(--icon-active)] transition-colors" />
                </div>
                <select 
                  value={formData.gender} 
                  onChange={(e) => setFormData({...formData, gender: e.target.value})} 
                  className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-xl pl-10 pr-2 py-3 outline-none focus:border-[var(--icon-active)] transition-all text-sm appearance-none"
                  disabled={isDataLoading}
                >
                  <option value="" disabled hidden>-- เลือกเพศ --</option>
                  {isDataLoading ? (
                    <option value="">Loading...</option>
                  ) : (
                    genders.map(g => <option key={g.code} value={g.code}>{g.name}</option>)
                  )}
                </select>
              </div>
            </div>

            {/* Date of Birth Selection */}
            <div className="flex flex-col gap-1 p-3 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl focus-within:border-[var(--icon-active)] transition-all">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-[var(--icon-inactive)] uppercase tracking-widest flex items-center gap-1">
                  <Calendar size={12} /> รูปแบบวันเกิด
                </span>
                <div className="flex gap-1 bg-[var(--app-bg)] p-1 rounded-lg border border-[var(--border-color)]">
                  <button type="button" onClick={() => setDateMode('thai')} className={`text-[10px] px-3 py-1 rounded transition-colors ${dateMode === 'thai' ? 'bg-[var(--icon-active)] text-white' : 'text-[var(--icon-inactive)]'}`}>ไทย</button>
                  <button type="button" onClick={() => setDateMode('intl')} className={`text-[10px] px-3 py-1 rounded transition-colors ${dateMode === 'intl' ? 'bg-[var(--icon-active)] text-white' : 'text-[var(--icon-inactive)]'}`}>สากล</button>
                </div>
              </div>

              {dateMode === 'intl' ? (
                <input 
                  type="date" 
                  value={formData.dob} 
                  onChange={(e) => setFormData({...formData, dob: e.target.value})} 
                  className="w-full bg-transparent text-[var(--text-heading)] py-2 outline-none text-sm [color-scheme:dark]" 
                />
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  <select value={thaiDay} onChange={e => setThaiDay(e.target.value)} className="w-full bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-2 py-2 outline-none text-sm appearance-none">
                    <option value="" disabled hidden>วัน</option>
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select value={thaiMonth} onChange={e => setThaiMonth(e.target.value)} className="w-full bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-2 py-2 outline-none text-sm appearance-none">
                    <option value="" disabled hidden>เดือน</option>
                    {thaiMonths.map(m => <option key={m.v} value={m.v}>{m.n}</option>)}
                  </select>
                  <select value={thaiYear} onChange={e => setThaiYear(e.target.value)} className="w-full bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-2 py-2 outline-none text-sm appearance-none">
                    <option value="" disabled hidden>พ.ศ.</option>
                    {yearsBE.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Passwords */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-[var(--icon-inactive)] group-focus-within:text-[var(--icon-active)] transition-colors" />
              </div>
              <input type="password" placeholder="ENCRYPTION KEY (อักษรผสมตัวเลข 8+ ตัว)" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-xl pl-12 pr-4 py-3 outline-none focus:border-[var(--icon-active)] transition-all text-sm tracking-widest" required />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-[var(--icon-inactive)] group-focus-within:text-[var(--icon-active)] transition-colors" />
              </div>
              <input type="password" placeholder="CONFIRM KEY" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-xl pl-12 pr-4 py-3 outline-none focus:border-[var(--icon-active)] transition-all text-sm tracking-widest" required />
            </div>

            {/* Human Verification (Bot Check) */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Calculator size={18} className="text-[var(--icon-inactive)] group-focus-within:text-[var(--icon-active)] transition-colors" />
              </div>
              <input type="number" placeholder={`BOT CHECK: ${num1} + ${num2} = ?`} value={botAnswer} onChange={(e) => setBotAnswer(e.target.value)} className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-xl pl-12 pr-4 py-3 outline-none focus:border-[var(--icon-active)] transition-all text-sm" required />
            </div>
          </div>

          <button type="submit" disabled={isLoading || isDataLoading || usernameStatus === 'taken'} className="w-full mt-6 bg-[var(--card-bg)] border border-[var(--icon-active)] text-[var(--icon-active)] font-bold tracking-widest py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 hover:bg-[var(--icon-active)] hover:text-white" style={{ boxShadow: 'var(--card-shadow)' }}>
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'INITIALIZE ACCOUNT'} 
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Other Registration Methods */}
        <div className="mt-8 flex flex-col gap-4">
          <div className="relative flex items-center justify-center">
            <span className="absolute bg-[var(--app-bg)] px-3 text-[var(--icon-inactive)] text-[10px] tracking-widest uppercase">OR REGISTER WITH</span>
            <div className="w-full border-t border-[var(--border-color)]"></div>
          </div>
          
          <button type="button" className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-heading)] py-3 rounded-xl flex items-center justify-center gap-3 transition-all hover:border-[var(--icon-active)] text-sm">
             <Mail size={18} className="text-red-500" /> Gmail Account
          </button>
          
          <button type="button" className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-heading)] py-3 rounded-xl flex items-center justify-center gap-3 transition-all hover:border-[var(--icon-active)] text-sm">
             <Fingerprint size={18} className="text-green-500" /> Biometrics (Face ID / Touch ID)
          </button>
        </div>

      </div>
    </div>
  );
}