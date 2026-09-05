import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Image as ImageIcon, Scissors, Type, Smile, Frame, Plus, Inbox, 
  Search, Play, Tv, Loader2, Clock, CheckCircle2, Crown, Star, Edit2, Upload, MonitorPlay,
  Heart, MessageCircle, Users, UserPlus, User, Eye, Link as LinkIcon, Trash2, Save, Globe, Lock
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { fetchUserProfile } from '../utils/apiProfile'; 

const API_URL = import.meta.env.VITE_API_URL || 'https://mchatapi.9plus.app';

const THAI_MONTHS = [
  { value: '01', label: 'มกราคม' }, { value: '02', label: 'กุมภาพันธ์' }, { value: '03', label: 'มีนาคม' },
  { value: '04', label: 'เมษายน' }, { value: '05', label: 'พฤษภาคม' }, { value: '06', label: 'มิถุนายน' },
  { value: '07', label: 'กรกฎาคม' }, { value: '08', label: 'สิงหาคม' }, { value: '09', label: 'กันยายน' },
  { value: '10', label: 'ตุลาคม' }, { value: '11', label: 'พฤศจิกายน' }, { value: '12', label: 'ธันวาคม' }
];
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const CURRENT_YEAR = new Date().getFullYear();
const THAI_YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR + 543 + i); 

export default function CreateMedia({ setCurrentScreen }) {
  // ==========================================
  // 1. State ทั้งหมดที่ต้องใช้
  // ==========================================
  const [userData, setUserData] = useState(null); 
  const [channelData, setChannelData] = useState(null); 
  const [channelVideos, setChannelVideos] = useState([]);
  const [templates, setTemplates] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  const [channelLogo, setChannelLogo] = useState(null);
  const [watermarkPos, setWatermarkPos] = useState('bottom-right');
  const logoInputRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ channelName: '', category: '', description: '' });

  const [editingVideo, setEditingVideo] = useState(null);
  const [isSavingVideo, setIsSavingVideo] = useState(false);
  const [pubDay, setPubDay] = useState('01');
  const [pubMonth, setPubMonth] = useState('01');
  const [pubYear, setPubYear] = useState(CURRENT_YEAR + 543);
  const [pubHour, setPubHour] = useState('00');
  const [pubMinute, setPubMinute] = useState('00');

  const tools = [
    { icon: ImageIcon, label: 'Photo editor' }, { icon: Scissors, label: 'AutoCut' },
    { icon: Type, label: 'Captions' }, { icon: Smile, label: 'AI Self' }, { icon: Frame, label: 'Cutout' },
  ];
  const tabs = ['For You', 'Viral Song', 'Trendy', 'AI', 'Monthly Recap'];

  const getMediaUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('blob:') || url.startsWith('http') || url.startsWith('data:image')) return url;
    return `${API_URL}${url}`;
  };

  const loadChannelVideos = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/api/videos/channel?userId=${userId}`);
      const data = await res.json();
      if (data.success) setChannelVideos(data.videos);
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // 2. โหลดข้อมูลเมื่อเปิดหน้า
  // ==========================================
  useEffect(() => {
    const fetchRealData = async () => {
      setIsLoading(true);
      try {
        const userId = localStorage.getItem('currentUserId');
        if (!userId) { setIsLoading(false); return; }

        const [userRes, channelRes] = await Promise.all([
          fetchUserProfile(userId).catch(() => null),
          fetch(`${API_URL}/api/channels?userId=${userId}`).then(res => res.json()).catch(() => null)
        ]);

        if (userRes && userRes.success && userRes.profile) setUserData(userRes.profile);

        if (channelRes && channelRes.success && channelRes.channel) {
          setChannelData(channelRes.channel);
          if (channelRes.channel.logo_url) setChannelLogo(channelRes.channel.logo_url);
          if (channelRes.channel.watermark_position) setWatermarkPos(channelRes.channel.watermark_position);
        } else {
          setChannelData(null); 
        }

        await loadChannelVideos(userId);

      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRealData();
  }, []);

  // ==========================================
  // 3. ฟังก์ชันบันทึกช่อง
  // ==========================================
  const openEditModal = () => {
    if (channelData) {
      setFormData({ channelName: channelData.channel_name, category: channelData.category, description: channelData.description || '' });
    } else {
      setFormData({ channelName: '', category: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSaveChannel = async () => {
    if (!formData.channelName || !formData.category) return alert("กรุณากรอกชื่อช่องและประเภทรายการให้ครบถ้วน");
    setIsSubmitting(true);
    try {
      const userId = localStorage.getItem('currentUserId');
      const response = await fetch(`${API_URL}/api/channels/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, channelName: formData.channelName, category: formData.category, description: formData.description })
      });
      const result = await response.json();
      if (result.success) {
        setChannelData(result.channel);
        setIsModalOpen(false);
      } else {
        alert(result.message || 'บันทึกไม่สำเร็จ');
      }
    } catch (error) {
      alert("ไม่สามารถบันทึกช่องได้ในขณะนี้");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // 4. ฟังก์ชันอัปโหลดและบันทึกโลโก้อัตโนมัติ 100%
  // ==========================================
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    
    reader.onloadend = async () => {
      const base64String = reader.result;
      setChannelLogo(base64String); // โชว์รูปบนหน้าจอทันที

      const userId = localStorage.getItem('currentUserId');
      if (userId) {
        try {
          await fetch(`${API_URL}/api/channels/logo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: userId,
              logoBase64: base64String,
              watermarkPosition: watermarkPos
            })
          });
          alert("อัปโหลดและบันทึกโลโก้สำเร็จ!");
        } catch (err) {
          console.error("อัปโหลดโลโก้ล้มเหลว", err);
          alert("ไม่สามารถบันทึกโลโก้ได้ (ไฟล์อาจใหญ่เกินไป)");
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleWatermarkPosChange = async (newPos) => {
    setWatermarkPos(newPos);
    const userId = localStorage.getItem('currentUserId');
    if (userId && channelData && channelLogo) {
      try {
        await fetch(`${API_URL}/api/channels/logo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, logoBase64: channelLogo, watermarkPosition: newPos })
        });
      } catch (err) {}
    }
  };

  // ==========================================
  // 5. ฟังก์ชันแก้ไข Video
  // ==========================================
  const openVideoEditModal = (video) => {
    setEditingVideo(video);
    const d = video.publish_date ? new Date(video.publish_date) : new Date();
    setPubDay(String(d.getDate()).padStart(2, '0'));
    setPubMonth(String(d.getMonth() + 1).padStart(2, '0'));
    setPubYear(d.getFullYear() + 543);
    setPubHour(String(d.getHours()).padStart(2, '0'));
    setPubMinute(String(d.getMinutes()).padStart(2, '0'));
  };

  const handleSaveVideoEdit = async () => {
    setIsSavingVideo(true);
    try {
      const isoDate = `${pubYear - 543}-${pubMonth}-${pubDay}T${pubHour}:${pubMinute}:00`;
      const response = await fetch(`${API_URL}/api/videos/update-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           videoId: editingVideo.id,
           visibility: editingVideo.visibility || 'public',
           publishDate: isoDate
        })
      });
      if(response.ok) {
         alert("บันทึกข้อมูลและส่งตรวจใหม่สำเร็จ");
         setEditingVideo(null);
         await loadChannelVideos(localStorage.getItem('currentUserId'));
      }
    } catch(err) {
       console.error(err);
    } finally {
       setIsSavingVideo(false);
    }
  };

  // ==========================================
  // 6. โครงสร้างหน้าเว็บ (UI)
  // ==========================================
  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[var(--app-bg)] text-[var(--text-heading)] relative" style={{ fontFamily: 'var(--font-family)' }}>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[var(--app-bg)] z-10 shadow-sm border-b border-[var(--border-color)]">
        <button onClick={() => setCurrentScreen('media')} className="p-1 hover:bg-[var(--card-bg)] rounded-full transition">
          <X size={24} className="text-[var(--text-heading)]" />
        </button>
        <h1 className="text-lg font-bold tracking-widest">CREATOR STUDIO</h1>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 overflow-y-auto pb-[var(--nav-height)]" style={{ scrollbarWidth: 'none' }}>
        
        {/* --- ส่วนที่ 1: ข้อมูลผู้ใช้งานส่วนตัว --- */}
        <div className="mx-4 mt-4 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-4 shadow-[var(--card-shadow)]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-[var(--icon-active)] overflow-hidden bg-[var(--app-bg)] p-0.5">
              {userData?.avatar_url ? (
                <img src={userData.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full rounded-full flex items-center justify-center bg-[var(--card-bg)]"><User size={24} className="text-[var(--icon-inactive)]" /></div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text-heading)]">@{userData?.username || 'Username'}</h2>
              <span className="text-[10px] text-[var(--app-bg)] font-bold bg-[var(--icon-active)] px-2 py-0.5 rounded-full inline-block mt-1 shadow-sm">Creator Profile</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 border-t border-[var(--border-color)] mt-4 pt-4">
            <div className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-[var(--app-bg)] transition"><Heart size={18} className="text-red-500 mb-1 filter drop-shadow-md"/><span className="text-sm font-bold">{userData?.stats?.likes ?? '0'}</span><span className="text-[9px] text-[var(--icon-inactive)]">ยอดถูกใจ</span></div>
            <div className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-[var(--app-bg)] transition"><MessageCircle size={18} className="text-blue-500 mb-1 filter drop-shadow-md"/><span className="text-sm font-bold">{userData?.stats?.comments ?? '0'}</span><span className="text-[9px] text-[var(--icon-inactive)]">คอมเมนต์</span></div>
            <div className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-[var(--app-bg)] transition"><Users size={18} className="text-green-500 mb-1 filter drop-shadow-md"/><span className="text-sm font-bold">{userData?.stats?.followers ?? '0'}</span><span className="text-[9px] text-[var(--icon-inactive)]">ผู้ติดตาม</span></div>
            <div className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-[var(--app-bg)] transition"><UserPlus size={18} className="text-purple-500 mb-1 filter drop-shadow-md"/><span className="text-sm font-bold">{userData?.stats?.following ?? '0'}</span><span className="text-[9px] text-[var(--icon-inactive)]">กำลังติดตาม</span></div>
          </div>
        </div>

        {/* แถบเครื่องมือ Tools */}
        <div className="flex justify-between px-6 py-6">
          {tools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <div key={idx} className="flex flex-col items-center gap-1.5 cursor-pointer hover:opacity-80 transition hover:scale-105">
                <div className="bg-[var(--card-bg)] p-3 rounded-2xl border border-[var(--border-color)] shadow-[var(--card-shadow)]"><Icon size={22} className="text-[var(--text-heading)]" /></div>
                <span className="text-[10px] font-medium text-[var(--icon-inactive)]">{tool.label}</span>
              </div>
            );
          })}
        </div>

        {/* --- ส่วนที่ 2: ข้อมูลช่องของฉัน (Channel & Logo) --- */}
        {channelData && channelData.id && (
          <div className="mx-4 mb-4 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-4 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                
                <div className="relative group cursor-pointer" onClick={() => logoInputRef.current.click()}>
                  <div className="w-16 h-16 rounded-xl bg-[var(--app-bg)] border-2 border-dashed border-[var(--icon-active)] flex items-center justify-center overflow-hidden">
                    {channelLogo ? <img src={getMediaUrl(channelLogo)} alt="Logo" className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-[var(--icon-inactive)]" />}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-[var(--icon-active)] p-1.5 rounded-full text-white shadow-md"><Upload size={12} strokeWidth={3} /></div>
                  <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </div>
                
                <div className="flex flex-col">
                  <h2 className="text-lg font-bold text-[var(--text-heading)]">{channelData.channel_name}</h2>
                  <span className="text-[10px] text-[var(--icon-active)] bg-[var(--icon-active)]/10 px-2 py-0.5 rounded-full w-fit mt-1 border border-[var(--icon-active)]/30">
                    {channelData.category === 'business' ? 'ธุรกิจและการลงทุน' : channelData.category === 'education' ? 'การศึกษา / ให้ความรู้' : channelData.category === 'lifestyle' ? 'ไลฟ์สไตล์ / บันเทิง' : channelData.category === 'news' ? 'ข่าวสาร' : channelData.category}
                  </span>
                </div>
              </div>
              <button onClick={openEditModal} className="p-2 text-[var(--icon-inactive)] hover:text-[var(--icon-active)] transition bg-[var(--app-bg)] rounded-lg shadow-sm border border-[var(--border-color)]"><Edit2 size={16} /></button>
            </div>

            <div className="bg-[var(--app-bg)] rounded-xl p-3 mb-3 border border-[var(--border-color)]">
              <p className="text-xs text-[var(--icon-inactive)] mb-2 flex items-center gap-1"><MonitorPlay size={14} /> ตำแหน่งแสดงโลโก้ลายน้ำ (หน้า Video)</p>
              <select value={watermarkPos} onChange={(e) => handleWatermarkPosChange(e.target.value)} className="w-full bg-[var(--card-bg)] text-xs text-[var(--text-heading)] rounded-lg px-2 py-2 outline-none border border-[var(--border-color)] focus:border-[var(--icon-active)]">
                <option value="top-left">มุมซ้ายบน</option><option value="top-right">มุมขวาบน</option><option value="bottom-left">มุมซ้ายล่าง</option><option value="bottom-right">มุมขวาล่าง</option>
              </select>
            </div>

            <div className="flex items-center gap-2 mt-2">
              {channelData.status === 'pending' ? (
                <div className="flex items-center gap-2 text-orange-500 bg-orange-500/10 px-3 py-2 rounded-lg w-full border border-orange-500/20"><Clock size={16} /><span className="text-xs font-bold">กำลังรอตรวจสอบ</span></div>
              ) : (
                <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-3 py-2 rounded-lg w-full border border-green-500/20"><CheckCircle2 size={16} /><span className="text-xs font-bold">ผ่านเกณฑ์ (อนุมัติแล้ว)</span></div>
              )}
            </div>
          </div>
        )}

        {/* --- ส่วนที่ 3: ปุ่มสร้างวิดีโอ --- */}
        <div className="flex gap-3 px-4 py-2">
          {isLoading ? (
            <button className="flex-1 bg-[var(--card-bg)] text-[var(--icon-inactive)] rounded-xl py-3 flex items-center justify-center font-bold border border-[var(--border-color)]"><Loader2 size={20} className="animate-spin mr-2" /> กำลังตรวจสอบ...</button>
          ) : (channelData && channelData.id) ? (
            <button onClick={() => setCurrentScreen('camera_studio')} className="flex-1 bg-white text-black rounded-xl py-3 flex flex-col items-center justify-center font-bold hover:scale-[1.02] transition shadow-lg">
              <Plus size={24} className="mb-0.5" strokeWidth={3} /> New video
            </button>
          ) : (
            <button onClick={openEditModal} className="flex-1 bg-[var(--icon-active)] text-white rounded-xl py-3 flex flex-col items-center justify-center font-bold hover:scale-[1.02] transition shadow-lg">
              <Tv size={24} className="mb-0.5" strokeWidth={2} /> สร้างช่องใหม่ (Create Channel)
            </button>
          )}

          <button className="w-20 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl py-3 flex flex-col items-center justify-center font-bold hover:bg-[var(--border-color)] transition shadow-sm">
            <Inbox size={20} className="mb-1 text-[var(--text-heading)]" /> <span className="text-[11px] text-[var(--text-heading)]">Drafts</span>
          </button>
        </div>

        {/* --- ส่วนที่ 4: แสดงวิดีโอ (แก้ไขโค้ด Video Player ให้เล่นได้จริง 100%) --- */}
        {channelData && channelData.id && (
          <>
            <div className="flex justify-between items-center px-4 mt-6 mb-3">
              <h2 className="text-lg font-bold">ผลงานวิดีโอของฉัน</h2>
            </div>
            
            <div className="px-4 pb-4">
              {channelVideos.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {channelVideos.map(video => (
                    <div key={video.id} className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-md flex flex-col">
                      
                      {/* Video Player ที่ปรับแก้ Source และ Tag ให้เล่นได้ชัวร์ */}
                      <div className={`w-full bg-black relative ${video.aspect_ratio === '16:9' ? 'aspect-video' : 'aspect-[3/4]'}`}>
                        <video 
                          controls 
                          preload="auto" 
                          playsInline 
                          controlsList="nodownload"
                          poster={video.cover_url ? getMediaUrl(video.cover_url) : undefined}
                          className="w-full h-full object-contain relative z-10" 
                        >
                          <source src={getMediaUrl(video.url_high || video.video_url)} type="video/mp4" />
                          เบราว์เซอร์ของคุณไม่รองรับวิดีโอนี้
                        </video>
                        
                        {/* ป้ายสถานะ */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1 z-20 pointer-events-none">
                          {video.status === 'pending' && <span className="bg-orange-500/90 text-white text-[9px] px-2 py-0.5 rounded shadow">รอตรวจ</span>}
                          {video.visibility === 'private' ? (
                            <span className="bg-gray-700/90 text-white text-[9px] px-2 py-0.5 rounded flex items-center gap-1 shadow"><Lock size={8}/> ส่วนตัว</span>
                          ) : (
                            <span className="bg-blue-500/90 text-white text-[9px] px-2 py-0.5 rounded flex items-center gap-1 shadow"><Globe size={8}/> สาธารณะ</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-3 flex flex-col flex-1">
                        <h3 className="text-xs font-bold truncate mb-1 text-[var(--text-heading)]">{video.title || 'ไม่มีชื่อคลิป'}</h3>
                        <p className="text-[10px] text-[var(--icon-inactive)] line-clamp-2 mb-2 flex-1">{video.description || 'ไม่มีรายละเอียด'}</p>
                        
                        <div className="flex justify-between items-center text-[9px] text-[var(--icon-inactive)] mb-3">
                          <div className="flex items-center gap-0.5"><Eye size={12}/>{video.views_count || 0}</div>
                          <div className="flex items-center gap-0.5"><Heart size={12}/>{video.likes_count || 0}</div>
                          <div className="flex items-center gap-0.5"><MessageCircle size={12}/>{video.comments_count || 0}</div>
                        </div>
                        
                        <div className="flex gap-2 mt-auto">
                          <button onClick={() => openVideoEditModal(video)} className="flex-1 flex justify-center items-center gap-1 py-1.5 border border-orange-400 text-orange-400 rounded-lg text-[10px] font-bold hover:bg-orange-400/10 transition">
                            <Edit2 size={10} /> แก้ไข
                          </button>
                          <button className="flex-1 flex justify-center items-center gap-1 py-1.5 border border-red-500 text-red-500 rounded-lg text-[10px] font-bold hover:bg-red-500/10 transition">
                            <Trash2 size={10} /> ลบ
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-[var(--icon-inactive)] bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)]">
                  <Tv size={32} className="mb-2 opacity-30" />
                  <p className="text-xs">คุณยังไม่มีวิดีโอในช่อง</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Templates */}
        <div className="flex justify-between items-center px-4 mt-6 mb-3">
          <h2 className="text-lg font-bold">Templates</h2>
          <Search size={22} className="text-[var(--icon-inactive)] hover:text-[var(--text-heading)] transition cursor-pointer" />
        </div>

        <div className="flex gap-5 px-4 overflow-x-auto pb-2 mb-2" style={{ scrollbarWidth: 'none' }}>
          {tabs.map((tab, idx) => (
            <span key={idx} className={`whitespace-nowrap text-sm cursor-pointer transition-colors ${idx === 0 ? 'text-[var(--text-heading)] font-bold border-b-2 border-[var(--text-heading)] pb-1' : 'text-[var(--icon-inactive)] hover:text-[var(--text-heading)]'}`}>{tab}</span>
          ))}
        </div>

        <div className="px-4 pb-10">
          {templates.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {templates.map(tpl => (
                <div key={tpl.id} className="relative rounded-xl overflow-hidden aspect-[3/4] border border-[var(--border-color)] shadow-md"><img src={tpl.img_url} alt={tpl.title} className="w-full h-full object-cover" /></div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-[var(--icon-inactive)] bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)]"><Frame size={40} className="mb-2 opacity-30" /><p className="text-sm">ไม่พบเทมเพลตในขณะนี้</p></div>
          )}
        </div>
      </div>

      {/* --- Modal สำหรับแก้ไขช่อง --- */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--app-bg)]">
              <h3 className="font-bold text-[var(--text-heading)] flex items-center gap-2"><Tv size={18} className="text-[var(--icon-active)]"/> {channelData ? 'แก้ไขข้อมูลช่อง' : 'เปิดช่อง Media ของคุณ'}</h3>
              <button onClick={() => !isSubmitting && setIsModalOpen(false)} className="text-[var(--icon-inactive)] hover:text-red-500 transition"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[10px] text-[var(--icon-inactive)] uppercase mb-1 block">ชื่อช่อง (Channel Name)</label>
                <input type="text" value={formData.channelName} onChange={e => setFormData({...formData, channelName: e.target.value})} className="w-full bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-3 py-2.5 outline-none focus:border-[var(--icon-active)] text-sm" placeholder="เช่น CEO_9Plus" />
              </div>
              <div>
                <label className="text-[10px] text-[var(--icon-inactive)] uppercase mb-1 block">ประเภทรายการ (Category)</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-3 py-2.5 outline-none focus:border-[var(--icon-active)] text-sm">
                  <option value="">เลือกประเภทรายการ</option><option value="business">ธุรกิจและการลงทุน</option><option value="education">การศึกษา / ให้ความรู้</option><option value="lifestyle">ไลฟ์สไตล์ / บันเทิง</option><option value="news">ข่าวสาร / แจ้งเตือน</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-[var(--icon-inactive)] uppercase mb-1 block">รายละเอียด (Description)</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-3 py-2.5 outline-none focus:border-[var(--icon-active)] text-sm min-h-[80px]" placeholder="คำอธิบายสั้นๆ เกี่ยวกับช่องของคุณ..." />
              </div>
              <button onClick={handleSaveChannel} disabled={isSubmitting} className="w-full bg-[var(--icon-active)] text-[var(--app-bg)] font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-4 hover:opacity-90 transition disabled:opacity-50 text-sm tracking-widest shadow-lg">
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : (channelData ? <CheckCircle2 size={16} /> : <Plus size={16} strokeWidth={3} />)}
                {isSubmitting ? 'กำลังบันทึก...' : (channelData ? 'บันทึกการแก้ไข' : 'สร้างช่อง Media')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Modal สำหรับแก้ไขเวลา/สถานะ Video --- */}
      {editingVideo && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--app-bg)]">
              <h3 className="font-bold text-[var(--text-heading)] flex items-center gap-2"><Edit2 size={18} className="text-[var(--icon-active)]"/> แก้ไขวิดีโอ</h3>
              <button onClick={() => setEditingVideo(null)} className="text-[var(--icon-inactive)] hover:text-red-500 transition"><X size={20} /></button>
            </div>
            
            <div className="p-5 space-y-5">
              
              {/* สถานะการเผยแพร่ */}
              <div>
                <label className="text-[10px] text-[var(--icon-inactive)] uppercase mb-2 block">สถานะการเผยแพร่ (Visibility)</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-[var(--icon-active)] transition">
                    <input type="radio" name="visibility" checked={editingVideo.visibility === 'public' || !editingVideo.visibility} onChange={() => setEditingVideo({...editingVideo, visibility: 'public'})} className="accent-[var(--icon-active)]" />
                    <Globe size={14} className="text-blue-400"/> สาธารณะ
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-[var(--icon-active)] transition">
                    <input type="radio" name="visibility" checked={editingVideo.visibility === 'private'} onChange={() => setEditingVideo({...editingVideo, visibility: 'private'})} className="accent-[var(--icon-active)]" />
                    <Lock size={14} className="text-gray-400"/> ส่วนตัว
                  </label>
                </div>
              </div>

              {/* ฟอร์มวันที่แบบไทย */}
              <div className="border border-green-500/30 rounded-xl p-4 bg-green-500/5 relative">
                <h4 className="text-xs font-bold text-green-500 mb-4 text-center">ตั้งเวลาเผยแพร่วิดีโอ</h4>
                
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2">
                    <select value={pubDay} onChange={(e) => setPubDay(e.target.value)} className="bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-2 py-2 text-xs outline-none text-center appearance-none">
                      {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select value={pubMonth} onChange={(e) => setPubMonth(e.target.value)} className="bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-2 py-2 text-xs outline-none text-center appearance-none">
                      {THAI_MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                    <select value={pubYear} onChange={(e) => setPubYear(e.target.value)} className="bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-2 py-2 text-xs outline-none text-center appearance-none">
                      {THAI_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-[var(--icon-inactive)]">เวลา</span>
                    <select value={pubHour} onChange={(e) => setPubHour(e.target.value)} className="bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-2 py-2 text-xs outline-none text-center appearance-none">
                      {Array.from({length: 24}, (_, i) => String(i).padStart(2, '0')).map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    <span className="text-xs font-bold text-[var(--text-heading)]">:</span>
                    <select value={pubMinute} onChange={(e) => setPubMinute(e.target.value)} className="bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-2 py-2 text-xs outline-none text-center appearance-none">
                      {Array.from({length: 60}, (_, i) => String(i).padStart(2, '0')).map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <span className="text-[11px] text-[var(--icon-inactive)]">น.</span>
                  </div>
                </div>
              </div>

              <button onClick={handleSaveVideoEdit} disabled={isSavingVideo} className="w-full bg-green-500 text-[var(--app-bg)] font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-4 hover:bg-green-600 transition disabled:opacity-50 text-sm shadow-lg">
                {isSavingVideo ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                บันทึกการตั้งค่า
              </button>
            </div>
          </div>
        </div>
      )}

      {/* แถบล่างสุด: BottomNav */}
      <div className="shrink-0 w-full z-40 bg-[var(--app-bg)] border-t border-[var(--border-color)] pb-safe shadow-[var(--nav-shadow)]">
        <BottomNav activeMenu="media" setCurrentScreen={setCurrentScreen} />
      </div>
    </div>
  );
}
  // ==========================================
  // 6. CreateMedia  บันทึกโลโก้ แสดง video  end
  // ==========================================