import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Image as ImageIcon, Scissors, Type, Smile, Frame, Plus, Inbox, 
  Search, Play, Tv, Loader2, Clock, CheckCircle2, Crown, Star, Edit2, Upload, MonitorPlay
} from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function CreateMedia({ setCurrentScreen }) {
  const [channelData, setChannelData] = useState(null); 
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State สำหรับ โลโก้และตำแหน่งลายน้ำ
  const [channelLogo, setChannelLogo] = useState(null);
  const [watermarkPos, setWatermarkPos] = useState('bottom-right');
  const logoInputRef = useRef(null);

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

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const userId = localStorage.getItem('currentUserId');
        if (!userId) {
          setIsLoading(false);
          return;
        }
        // จำลองว่าดึงข้อมูลช่องสำเร็จแล้ว เพื่อให้แสดงผลส่วนแก้ไขและโลโก้
        // setChannelData(null); 
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
        setChannelData(null); 
      } finally {
        setIsLoading(false);
      }
    };
    fetchRealData();
  }, []);

  const openEditModal = () => {
    if (channelData) {
      setFormData({
        channelName: channelData.channel_name,
        category: channelData.category,
        description: channelData.description || ''
      });
    } else {
      setFormData({ channelName: '', category: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSaveChannel = async () => {
    if (!formData.channelName || !formData.category) {
      alert("กรุณากรอกชื่อช่องและประเภทรายการให้ครบถ้วน");
      return;
    }
    setIsSubmitting(true);
    try {
      setTimeout(() => {
        setChannelData({
          channel_name: formData.channelName,
          category: formData.category,
          description: formData.description,
          status: channelData?.status || 'pending', 
          plan_type: channelData?.plan_type || 'free'
        });
        setIsSubmitting(false);
        setIsModalOpen(false);
      }, 1000); 
    } catch (error) {
      console.error(error);
      alert("ไม่สามารถบันทึกช่องได้ในขณะนี้");
      setIsSubmitting(false);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setChannelLogo(reader.result);
      // ตรงนี้สามารถเพิ่มโค้ดยิง API ไปบันทึกลงตาราง media_channel_logos ได้
    };
    reader.readAsDataURL(file);
  };

  const renderChannelProfile = () => {
    if (!channelData) return null;

    return (
      <div className="mx-4 mt-2 mb-4 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-4 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer" onClick={() => logoInputRef.current.click()}>
              <div className="w-16 h-16 rounded-xl bg-[var(--app-bg)] border-2 border-dashed border-[var(--icon-active)] flex items-center justify-center overflow-hidden">
                {channelLogo ? (
                  <img src={channelLogo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={24} className="text-[var(--icon-inactive)]" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[var(--icon-active)] p-1.5 rounded-full text-white shadow-md">
                <Upload size={12} strokeWidth={3} />
              </div>
              <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
            </div>
            
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-[var(--text-heading)]">{channelData.channel_name}</h2>
              <span className="text-[10px] text-[var(--icon-active)] bg-[var(--icon-active)]/10 px-2 py-0.5 rounded-full w-fit mt-1">
                {channelData.category === 'business' ? 'ธุรกิจและการลงทุน' : 
                 channelData.category === 'education' ? 'การศึกษา / ให้ความรู้' : 
                 channelData.category === 'lifestyle' ? 'ไลฟ์สไตล์ / บันเทิง' : 
                 channelData.category === 'news' ? 'ข่าวสาร' : channelData.category}
              </span>
            </div>
          </div>
          <button onClick={openEditModal} className="p-2 text-[var(--icon-inactive)] hover:text-[var(--icon-active)] transition bg-[var(--app-bg)] rounded-lg">
            <Edit2 size={16} />
          </button>
        </div>

        <div className="bg-[var(--app-bg)] rounded-xl p-3 mb-3 border border-[var(--border-color)]">
          <p className="text-xs text-[var(--icon-inactive)] mb-2 flex items-center gap-1">
            <MonitorPlay size={14} /> ตำแหน่งลายน้ำโลโก้ (ในหน้า Media)
          </p>
          <select 
            value={watermarkPos} 
            onChange={(e) => setWatermarkPos(e.target.value)}
            className="w-full bg-[var(--card-bg)] text-xs text-[var(--text-heading)] rounded-lg px-2 py-2 outline-none border border-[var(--border-color)] focus:border-[var(--icon-active)]"
          >
            <option value="top-left">มุมซ้ายบน</option>
            <option value="top-right">มุมขวาบน</option>
            <option value="bottom-left">มุมซ้ายล่าง</option>
            <option value="bottom-right">มุมขวาล่าง</option>
          </select>
        </div>

        {/* สถานะช่อง */}
        <div className="flex items-center gap-2 mt-2">
          {channelData.status === 'pending' ? (
            <div className="flex items-center gap-2 text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-lg w-full">
              <Clock size={16} />
              <span className="text-xs font-bold">กำลังรอตรวจสอบ</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-3 py-1.5 rounded-lg w-full">
              <CheckCircle2 size={16} />
              <span className="text-xs font-bold">ผ่านเกณฑ์ (อนุมัติแล้ว)</span>
            </div>
          )}
        </div>
        
        {channelData.status === 'approved' && (
          <div className="flex items-center gap-2 mt-2 bg-[var(--app-bg)] p-2.5 rounded-lg border border-[var(--border-color)]">
            {channelData.plan_type === 'monthly' ? (
              <><Star size={16} className="text-purple-400 fill-current" /><span className="text-xs font-bold text-purple-400">ชำระรายเดือน (2 คลิป/วัน)</span></>
            ) : channelData.plan_type === 'yearly' ? (
              <><Crown size={16} className="text-yellow-500 fill-current" /><span className="text-xs font-bold text-yellow-500">ชำระรายปี VIP (5 คลิป/วัน)</span></>
            ) : (
              <><Tv size={16} className="text-[var(--icon-inactive)]" /><span className="text-xs font-bold text-[var(--icon-inactive)]">แพ็กเกจใช้งานฟรี</span></>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[var(--app-bg)] text-[var(--text-heading)] relative" style={{ fontFamily: 'var(--font-family)' }}>
      <div className="flex items-center justify-between p-4 bg-[var(--app-bg)] z-10">
        <button onClick={() => setCurrentScreen('media')} className="p-1 hover:bg-[var(--card-bg)] rounded-full transition">
          <X size={24} className="text-[var(--text-heading)]" />
        </button>
        <h1 className="text-lg font-bold tracking-widest">CREATE</h1>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 overflow-y-auto pb-[var(--nav-height)]" style={{ scrollbarWidth: 'none' }}>
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

        {renderChannelProfile()}

        <div className="flex gap-3 px-4 py-4">
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
              onClick={openEditModal}
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

        <div className="flex justify-between items-center px-4 mt-4 mb-3">
          <h2 className="text-lg font-bold">Templates</h2>
          <Search size={22} className="text-[var(--icon-inactive)] hover:text-[var(--text-heading)] transition cursor-pointer" />
        </div>

        <div className="flex gap-5 px-4 overflow-x-auto pb-2 mb-2" style={{ scrollbarWidth: 'none' }}>
          {tabs.map((tab, idx) => (
            <span key={idx} className={`whitespace-nowrap text-sm cursor-pointer transition-colors ${idx === 0 ? 'text-[var(--text-heading)] font-bold border-b-2 border-[var(--text-heading)] pb-1' : 'text-[var(--icon-inactive)] hover:text-[var(--text-heading)]'}`}>
              {tab}
            </span>
          ))}
        </div>

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

      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--app-bg)]">
              <h3 className="font-bold text-[var(--text-heading)] flex items-center gap-2">
                <Tv size={18} className="text-[var(--icon-active)]"/> {channelData ? 'แก้ไขข้อมูลช่อง' : 'เปิดช่อง Media ของคุณ'}
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
                onClick={handleSaveChannel} 
                disabled={isSubmitting} 
                className="w-full bg-[var(--icon-active)] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-4 hover:opacity-90 transition disabled:opacity-50 text-sm tracking-widest"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : (channelData ? <Check size={16} /> : <Plus size={16} strokeWidth={3} />)}
                {isSubmitting ? 'กำลังบันทึก...' : (channelData ? 'บันทึกการแก้ไข' : 'สร้างช่อง Media')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="shrink-0 w-full z-40 bg-[var(--app-bg)] border-t border-[var(--border-color)] pb-safe">
        <BottomNav activeMenu="media" setCurrentScreen={setCurrentScreen} />
      </div>
    </div>
  );
}