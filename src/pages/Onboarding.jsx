import { useState, useEffect } from 'react';
import { Fingerprint, ScanFace, Mail, Key, ArrowRight, ChevronRight, Cpu } from 'lucide-react';

export default function Onboarding({ onLoginSelect }) {
  const [step, setStep] = useState(0);
  const [aiText, setAiText] = useState('');
  
  const fullText = "SYSTEM INITIALIZED: สวัสดีครับ ผมคือ AI ประจำระบบ M-CHAT ยินดีต้อนรับสู่การสื่อสารแห่งอนาคต กรุณากด 'ถัดไป' เพื่อตั้งค่าความปลอดภัยระดับสูงสุด...";

  useEffect(() => {
    if (step === 0) {
      let i = 0;
      setAiText('');
      const typing = setInterval(() => {
        setAiText(fullText.slice(0, i));
        i++;
        if (i > fullText.length) clearInterval(typing);
      }, 30);
      return () => clearInterval(typing);
    }
  }, [step]);

  const slides = [
    { title: "NEURAL NETWORK CONNECTED", desc: "เชื่อมต่อทุกอุปกรณ์ในเสี้ยววินาทีด้วยเทคโนโลยี Quantum Sync" },
    { title: "MILITARY-GRADE SECURITY", desc: "เข้ารหัสข้อมูลระดับสูงสุด (End-to-End Encryption) ป้องกันการดักจับ 100%" },
    { title: "HOLOGRAPHIC INTERFACE", desc: "ปรับแต่งโครงสร้าง UI และชุดข้อมูลส่วนตัวของคุณได้อย่างอิสระ" },
    { title: "SYSTEM READY", desc: "ยืนยันตัวตนทางชีวภาพเพื่อเข้าสู่ M-CHAT HUB" }
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  if (step === 4) {
    return (
      <div className="flex flex-col h-[100dvh] w-full bg-cyber-grid-container p-6 justify-center items-center relative overflow-hidden font-[var(--font-family)]">
        <div className="text-center mb-10 w-full max-w-sm relative z-10">
          <h1 className="text-3xl font-bold text-glow mb-2 tracking-[0.2em] uppercase">
            Biometric Access
          </h1>
          <p className="text-[var(--text-body)] text-sm tracking-widest font-mono">SELECT AUTHENTICATION METHOD</p>
        </div>

        <div className="w-full max-w-sm space-y-4 relative z-10">
          <button onClick={() => onLoginSelect('faceid')} className="w-full flex items-center justify-between glass-panel p-4 rounded-xl btn-cyber group">
            <div className="flex items-center gap-4">
              <ScanFace size={24} className="group-hover:scale-110 transition-transform" /> 
              <span className="font-mono tracking-wide text-sm">FACIAL RECOGNITION</span>
            </div>
            <ChevronRight size={18} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>
          
          <button onClick={() => onLoginSelect('fingerprint')} className="w-full flex items-center justify-between glass-panel p-4 rounded-xl btn-cyber group">
            <div className="flex items-center gap-4">
              <Fingerprint size={24} className="group-hover:scale-110 transition-transform" /> 
              <span className="font-mono tracking-wide text-sm">FINGERPRINT SCAN</span>
            </div>
            <ChevronRight size={18} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>

          <div className="flex items-center gap-4 py-4 opacity-50">
            <div className="h-[1px] flex-1" style={{ background: 'linear-gradient(90deg, transparent, var(--icon-active), transparent)' }}></div>
            <span className="text-[10px] text-[var(--icon-active)] uppercase tracking-[0.3em] font-mono">Alternate Protocols</span>
            <div className="h-[1px] flex-1" style={{ background: 'linear-gradient(90deg, transparent, var(--icon-active), transparent)' }}></div>
          </div>

          <button onClick={() => onLoginSelect('google')} className="w-full flex items-center justify-between glass-panel border-[var(--border-color)] p-4 rounded-xl text-[var(--text-heading)] transition-all group hover:border-[var(--icon-active)] hover:shadow-[0_0_10px_var(--icon-active)]">
            <div className="flex items-center gap-4">
              <Mail size={20} className="text-[var(--icon-inactive)] group-hover:text-[var(--icon-active)] transition-colors" /> 
              <span className="font-mono text-sm">GMAIL AUTHORIZATION</span>
            </div>
            <ChevronRight size={18} className="text-[var(--icon-inactive)] group-hover:text-[var(--icon-active)]" />
          </button>

          <button onClick={() => onLoginSelect('password')} className="w-full flex items-center justify-between glass-panel border-[var(--border-color)] p-4 rounded-xl text-[var(--text-heading)] transition-all group hover:border-[var(--icon-active)] hover:shadow-[0_0_10px_var(--icon-active)]">
            <div className="flex items-center gap-4">
              <Key size={20} className="text-[var(--icon-inactive)] group-hover:text-[var(--icon-active)] transition-colors" /> 
              <span className="font-mono text-sm">STANDARD ENCRYPTION (USER/PASS)</span>
            </div>
            <ChevronRight size={18} className="text-[var(--icon-inactive)] group-hover:text-[var(--icon-active)]" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-cyber-grid-container p-6 justify-between items-center relative overflow-hidden font-[var(--font-family)]">
      
      {step === 0 && (
        <div className="absolute top-8 w-full max-w-sm px-4 z-20 transition-all">
          <div className="glass-panel rounded-xl p-4 flex gap-3 items-start" style={{ border: '1px solid var(--icon-active)', boxShadow: '0 0 15px var(--icon-active)' }}>
            <Cpu size={24} className="text-[var(--icon-active)] shrink-0 animate-pulse mt-1" />
            <p className="text-[var(--icon-active)] font-mono text-xs leading-relaxed">
              {aiText}<span className="animate-pulse">_</span>
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center items-center text-center w-full max-w-sm mt-16 relative z-10">
        
        <div className="relative w-56 h-56 rounded-full flex items-center justify-center mb-12 overflow-hidden" style={{ border: '1px solid var(--icon-active)', boxShadow: '0 0 40px var(--icon-active)' }}>
          <div className="animate-scan"></div>
          <div className="absolute inset-4 rounded-full" style={{ border: '1px solid var(--icon-active)', opacity: 0.2 }}></div>
          <div className="absolute inset-12 rounded-full border-dashed animate-spin" style={{ border: '1px dashed var(--icon-active)', opacity: 0.4, animationDuration: '10s' }}></div>
          <ScanFace size={60} className="text-glow relative z-10" />
        </div>

        <h2 className="text-xl font-bold text-[var(--text-heading)] mb-4 tracking-wider uppercase text-glow">
          {slides[step].title}
        </h2>
        <p className="text-[var(--text-body)] px-2 text-sm leading-relaxed font-light">
          {slides[step].desc}
        </p>
      </div>

      <div className="w-full flex flex-col items-center gap-10 mb-8 max-w-sm relative z-10">
        <div className="flex gap-3">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-500 ${step === idx ? 'w-12' : 'w-3 bg-[var(--border-color)]'}`} 
              style={step === idx ? { backgroundColor: 'var(--icon-active)', boxShadow: '0 0 10px var(--icon-active)' } : {}}
            />
          ))}
        </div>
        <button 
          onClick={handleNext} 
          className="w-full glass-panel btn-cyber font-mono tracking-widest text-sm py-4 rounded-xl flex items-center justify-center gap-3 group"
        >
          {step === 3 ? 'INITIALIZE SYSTEM' : 'PROCEED'} 
          <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </div>
  );
}