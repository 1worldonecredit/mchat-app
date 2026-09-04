import React, { useState, useEffect } from 'react';
import { 
  X, Image as ImageIcon, Scissors, Type, Smile, Frame, Plus, Inbox, 
  Search, Play, Tv, Loader2, Clock, CheckCircle2, Crown, Star
} from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function CreateMedia({ setCurrentScreen }) {
  // --- State สำหรับข้อมูลจริง ---
  const [channelData, setChannelData] = useState(null); 
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- State สำหรับ Popup สร้างช่อง ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    channelName: '',
    category: '',
    description: ''
  });

  const tools = [
    { icon: ImageIcon, label: 'Photo editor' },
    { icon: Scissors, label: 'AutoCut' },
    { icon: Type, label: 'Captions' },
    { icon: Smile, label: 'AI Self' },
    { icon: Frame, label: 'Cutout' },
  ];
  const tabs = ['For You', 'Viral Song', 'Trendy', 'AI', 'Monthly Recap'];

  // --- ฟังก์ชันจำลองการดึงข้อมูลจาก API จริง ---
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const userId = localStorage.getItem('currentUserId');
        if (!userId) {
          setIsLoading(false);
          return;
        }

        // 1. ดึงข้อมูลช่อง (จำลองการยิง API)
        // const channelRes = await fetch(`/api/channels?userId=${userId}`);
        // const channelData = await channelRes.json();
        
        // * เนื่องจากยังไม่มี API จริง จะให้ค่าว่างไปก่อน (ไม่พบช่อง) ระบบจะไม่ Error
        setChannelData(null); 

        // 2. ดึงข้อมูล Templates (เอา Mockup ออก โหลดจาก API แทน)
        // const templatesRes = await fetch(`/api/templates`);
        setTemplates([]); 

      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
        setChannelData(null); // ไม่ให้ระบบ Error แม้ API จะล่ม
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealData();
  }, []);

  // --- ฟังก์ชันบันทึกการสร้างช่อง ---
  const handleCreateChannel = async () => {
    if (!formData.channelName || !formData.category) {
      alert("กรุณากรอกชื่อช่องและประเภทรายการให้ครบถ้วน");
      return;
    }

    setIsSubmitting(true);
    try {
      // จำลองการยิง API บันทึกข้อมูล
      // await fetch('/api/channels/create', { method: 'POST', body: JSON.stringify(formData) });
      
      // อัปเดต State หน้าเว็บให้เห็นผลทันทีว่าสร้างเสร็จแล้ว (รอตรวจ)
      setTimeout(() => {
        setChannelData({
          channel_name: formData.channelName,
          category: formData.category,
          status: 'pending', // สถานะเริ่มต้น
          plan_type: 'free'
        });
        setIsSubmitting(false);
        setIsModalOpen(false);
      }, 1500); // ดีเลย์ให้เห็นปุ่ม Loading
    } catch (error) {
      console.error(error);
      alert("ไม่สามารถสร้างช่องได้ในขณะนี้");
      setIsSubmitting(false);
    }
  };

  // --- ฟังก์ชันแสดงสถานะช่องด้วย Icon และสี ---
  const renderChannelStatus = () => {
    if (!channelData) return null;

    return (
      <div className="flex flex-col gap-2 mt-4 px-4">
        {/* สถานะการตรวจสอบ */}
        <div className="flex items-center gap-2 bg-[var(--card-bg)] p-3 rounded-xl border border-[var(--border-color)]">
          {channelData.status === 'pending' ? (
            <div className="flex items-center gap-2 text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-lg w-full">
              <Clock size={18} />
              <div className="flex flex-col">
                <span className="text-sm font-bold">สถานะ: กำลังรอตรวจสอบ</span>
                <span className="text-[10px]">กรุณารอทีมงานอนุมัติช่องของคุณ</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-3 py-1.5 rounded-lg w-full">
              <CheckCircle2 size={18} />
              <div className="flex flex-col">
                <span className="text-sm font-bold">สถานะ: ผ่านเกณฑ์ (อนุมัติแล้ว)</span>
                <span className="text-[10px]">ช่องของคุณพร้อมใช้งานแล้ว</span>
              </div>
            </div>
          )}
        </div>

        {/* สถานะแพ็กเกจการมองเห็น */}
        {channelData.status === 'approved' && (
          <div className="flex items-center gap-2 bg-[var(--card-bg)] p-3 rounded-xl border border-[var(--border-color)]">
            {channelData.plan_type === 'monthly' ? (
              <div className="flex items-center gap-2 text-purple-400 w-full">
                <Star size={20} className="fill-current" />
                <div className="flex flex-col text-[var(--text-heading)]">
                  <span className="text-sm font-bold text-purple-400">แพ็กเกจ: ชำระรายเดือน</span>
                  <span className="text-[10px] text-[var(--icon-inactive)]">แสดงผลแน่นอน 2 วิดีโอ/วัน</span>
                </div>
              </div>
            ) : channelData.plan_type === 'yearly' ? (
              <div className="flex items-center gap-2 text-yellow-500 w-full">
                <Crown size={20} className="fill-current" />
                <div className="flex flex-col text-[var(--text-heading)]">
                  <span className="text-sm font-bold text-yellow-500">แพ็กเกจ: ชำระรายปี (VIP)</span>
                  <span className="text-[10px] text-[var(--icon-inactive)]">แสดงผลแน่นอน 5 วิดีโอ/วัน</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[var(--icon-inactive)] w-full">
                <Tv size={20} />
                <div className="flex flex-col text-[var(--text-heading)]">
                  <span className="text-sm font-bold">แพ็กเกจ: ใช้งานฟรี</span>
                  <span className="text-[10px] text-[var(--icon-inactive)]">การแสดงผลอิงตามอัลกอริทึมปกติ</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[var(--app-bg)] text-[var(--text-heading)] relative" style={{ fontFamily: 'var(--font-family)' }}>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[var(--app-bg)] z-10">
        <button onClick={() => setCurrentScreen('media')} className="p-1 hover:bg-[var(--card-bg)] rounded-full transition">
          <X size={24} className="text-[var(--text-heading)]" />
        </button>
        <h1 className="text-lg font-bold tracking-widest">CREATE</h1>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 overflow-y-auto pb-[var(--nav-height)]" style={{ scrollbarWidth: 'none' }}>
        
        {/* แถบเครื่องมือ Icons */}
        <div className="flex justify-between px-6 py-2">
          {tools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <div key={idx} className="flex flex-col items-center gap-1.5 cursor-pointer hover:opacity-80 transition">
                <div className="bg-[var(--card-bg)] p-3 rounded-2xl border border-[var(--border-color)] shadow-[var(--card-shadow)]">
                  <Icon size={22} className="text-[var(--text-heading)]" />
                </div>
                <span className="text-[10px] font-medium text-[var(--icon-inactive)]">{tool.label}</span>
              </div>
            );
          })}
        </div>

        {/* ปุ่ม New video หรือ สร้างช่องใหม่ */}
        <div className="flex gap-3 px-4 py-6">
          {isLoading ? (
            <button className="flex-1 bg-white/10 text-[var(--icon-inactive)] rounded-xl py-3 flex items-center justify-center font-bold">
              <Loader2 size={24} className="animate-spin mr-2" /> กำลังตรวจสอบ...
            </button>
          ) : channelData ? (
            <button className="flex-1 bg-white text-black rounded-xl py-3 flex flex-col items-center justify-center font-bold hover:scale-[1.02] transition shadow-lg">
              <Plus size={24} className="mb-0.5" strokeWidth={3} />
              New video
            </button>
          ) : (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 bg-[var(--icon-active)] text-white rounded-xl py-3 flex flex-col items-center justify-center font-bold hover:scale-[1.02] transition shadow-lg"
            >
              <Tv size={24} className="mb-0.5" strokeWidth={2} />
              สร้างช่องใหม่ (Create Channel)
            </button>
          )}

          <button className="w-20 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl py-3 flex flex-col items-center justify-center font-bold hover:bg-[var(--border-color)] transition shadow-sm">
            <Inbox size={20} className="mb-1 text-[var(--text-heading)]" />
            <span className="text-[11px] text-[var(--text-heading)]">Drafts</span>
          </button>
        </div>

        {/* ส่วนแสดงสถานะช่อง (ถ้ามีช่องแล้ว) */}
        {renderChannelStatus()}

        {/* Templates Section Header */}
        <div className="flex justify-between items-center px-4 mt-6 mb-3">
          <h2 className="text-lg font-bold">Templates</h2>
          <Search size={22} className="text-[var(--icon-inactive)] hover:text-[var(--text-heading)] transition cursor-pointer" />
        </div>

        {/* Tabs */}
        <div className="flex gap-5 px-4 overflow-x-auto pb-2 mb-2" style={{ scrollbarWidth: 'none' }}>
          {tabs.map((tab, idx) => (
            <span key={idx} className={`whitespace-nowrap text-sm cursor-pointer transition-colors ${idx === 0 ? 'text-[var(--text-heading)] font-bold border-b-2 border-[var(--text-heading)] pb-1' : 'text-[var(--icon-inactive)] hover:text-[var(--text-heading)]'}`}>
              {tab}
            </span>
          ))}
        </div>

        {/* Grid Templates (ดึงจากข้อมูลจริง ถ้าว่างก็ไม่แสดง) */}
        <div className="px-4 pb-10">
          {templates.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {templates.map(tpl => (
                <div key={tpl.id} className="relative rounded-xl overflow-hidden aspect-[3/4] border border-[var(--border-color)] shadow-md">
                  <img src={tpl.img_url} alt={tpl.title} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-[var(--icon-inactive)]">
              <Frame size={40} className="mb-2 opacity-30" />
              <p className="text-sm">ไม่พบเทมเพลตในขณะนี้</p>
            </div>
          )}
        </div>
      </div>

      {/* Popup Modal สำหรับสร้างช่อง */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl w-full max-w-sm shadow-2xl">
            
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--app-bg)] rounded-t-2xl">
              <h3 className="font-bold text-[var(--text-heading)] flex items-center gap-2">
                <Tv size={18} className="text-[var(--icon-active)]"/> เปิดช่อง Media ของคุณ
              </h3>
              <button onClick={() => !isSubmitting && setIsModalOpen(false)} className="text-[var(--icon-inactive)] hover:text-red-500 transition">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[10px] text-[var(--icon-inactive)] uppercase mb-1 block">ชื่อช่อง (Channel Name)</label>
                <input 
                  type="text" 
                  value={formData.channelName} 
                  onChange={e => setFormData({...formData, channelName: e.target.value})} 
                  className="w-full bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-3 py-2.5 outline-none focus:border-[var(--icon-active)] text-sm" 
                  placeholder="เช่น CEO_9Plus" 
                />
              </div>

              <div>
                <label className="text-[10px] text-[var(--icon-inactive)] uppercase mb-1 block">ประเภทรายการ (Category)</label>
                <select 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})} 
                  className="w-full bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-3 py-2.5 outline-none focus:border-[var(--icon-active)] text-sm"
                >
                  <option value="">เลือกประเภทรายการ</option>
                  <option value="business">ธุรกิจและการลงทุน</option>
                  <option value="education">การศึกษา / ให้ความรู้</option>
                  <option value="lifestyle">ไลฟ์สไตล์ / บันเทิง</option>
                  <option value="news">ข่าวสาร / แจ้งเตือน</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[var(--icon-inactive)] uppercase mb-1 block">รายละเอียด (Description)</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className="w-full bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-3 py-2.5 outline-none focus:border-[var(--icon-active)] text-sm min-h-[80px]" 
                  placeholder="คำอธิบายสั้นๆ เกี่ยวกับช่องของคุณ..." 
                />
              </div>

              <button 
                onClick={handleCreateChannel} 
                disabled={isSubmitting} 
                className="w-full bg-[var(--icon-active)] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-4 hover:opacity-90 transition disabled:opacity-50 text-sm tracking-widest"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} strokeWidth={3} />}
                {isSubmitting ? 'กำลังส่งคำขอ...' : 'สร้างช่อง Media'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* แถบล่างสุด: BottomNav */}
      <div className="shrink-0 w-full z-40 bg-[var(--app-bg)] border-t border-[var(--border-color)] pb-safe">
        <BottomNav activeMenu="media" setCurrentScreen={setCurrentScreen} />
      </div>

    </div>
  );
}