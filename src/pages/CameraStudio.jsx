import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Music, RefreshCw, Wand2, Sparkles, ChevronDown, 
  Play, Smartphone, Gamepad2, Image as ImageIcon, 
  Upload, Clock, Edit3, CheckCircle2, Calendar, Loader2,
  Heart, MessageCircle, Eye
} from 'lucide-react';

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

export default function CameraStudio({ setCurrentScreen }) {
  // === [1. State ควบคุม UI และข้อมูล] ===
  const [mainMode, setMainMode] = useState('CREATE');
  const [recordMode, setRecordMode] = useState('15s');
  const [liveMode, setLiveMode] = useState('Device camera');
  
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const outroInputRef = useRef(null); 

  const [pendingVideos, setPendingVideos] = useState([]); 
  const [editingVideo, setEditingVideo] = useState(null); 
  const [isForever, setIsForever] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(false);

  // State สำหรับวันที่ไทย
  const [pubDay, setPubDay] = useState(String(new Date().getDate()).padStart(2, '0'));
  const [pubMonth, setPubMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));
  const [pubYear, setPubYear] = useState(CURRENT_YEAR + 543);
  const [pubTime, setPubTime] = useState(new Date().toTimeString().slice(0, 5)); 

  // === [2. ฟังก์ชันตัวช่วยต่างๆ] ===
  const getMediaUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('blob:') || url.startsWith('http')) return url;
    return `${API_URL}${url}`;
  };

  const calculateDaysAgo = (dateString) => {
    if (!dateString) return 'ร่าง (Draft)';
    const past = new Date(dateString);
    const diffTime = Math.abs(new Date() - past);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    if (diffDays <= 1) return 'วันนี้';
    return `${diffDays} วันที่แล้ว`;
  };

  // ดึงข้อมูลรายการจาก Database มารีเฟรช
  const loadPendingVideos = async () => {
    setIsLoadingDrafts(true);
    try {
      const userId = localStorage.getItem('currentUserId');
      if (!userId) return;
      const res = await fetch(`${API_URL}/api/videos/pending?userId=${userId}`);
      const data = await res.json();
      if (data.success) setPendingVideos(data.videos);
    } catch (err) {
      console.error("ดึงข้อมูล Draft ล้มเหลว", err);
    } finally {
      setIsLoadingDrafts(false);
    }
  };

  // === [3. เริ่มต้นเปิดกล้อง และดึงข้อมูล] ===
  useEffect(() => {
    let stream = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.warn("ไม่สามารถเข้าถึงกล้องได้: ", err);
      }
    };
    startCamera();
    loadPendingVideos();

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  // === [4. ฟังก์ชันเปิดหน้าแก้ไข / อัปโหลด] ===
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const videoUrl = URL.createObjectURL(file);
    const now = new Date();
    setPubDay(String(now.getDate()).padStart(2, '0'));
    setPubMonth(String(now.getMonth() + 1).padStart(2, '0'));
    setPubYear(now.getFullYear() + 543);
    setPubTime(now.toTimeString().slice(0, 5));
    setIsForever(true);
    
    const newVideo = {
      isNew: true, 
      id: null,
      videoFile: file,
      coverFile: null,
      outroCoverFile: null,
      video_url: videoUrl,
      title: '',
      category: '',
      description: '',
      cover_url: '',
      outro_cover_url: '',
      status: 'pending',
      aspect_ratio: '9:16',
    };
    
    setEditingVideo(newVideo); 
    e.target.value = null; 
  };

  // ดึงข้อมูลเก่ามาใส่ในช่องแก้ไข (แปลงวันที่คืนเป็นแบบไทย)
  const openEditVideo = (video) => {
    const pDate = video.publish_date ? new Date(video.publish_date) : new Date();
    setPubDay(String(pDate.getDate()).padStart(2, '0'));
    setPubMonth(String(pDate.getMonth() + 1).padStart(2, '0'));
    setPubYear(pDate.getFullYear() + 543);
    setPubTime(pDate.toTimeString().slice(0, 5));
    setIsForever(!video.expire_date);

    setEditingVideo({
      ...video,
      isNew: false, // บ่งบอกว่าเป็นคลิปเก่า
      videoFile: null,
      coverFile: null,
      outroCoverFile: null,
      video_url: video.url_high || video.video_url
    });
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditingVideo(prev => ({ ...prev, coverFile: file, cover_url: URL.createObjectURL(file) }));
  };

  const handleOutroCoverUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditingVideo(prev => ({ ...prev, outroCoverFile: file, outro_cover_url: URL.createObjectURL(file) }));
  };

  // === [5. ฟังก์ชันบันทึกข้อมูล (สร้างใหม่ & อัปเดต) ] ===
  const handleSaveVideoInfo = async () => {
    if (!editingVideo.title || !editingVideo.category) {
      alert("กรุณากรอกชื่อวิดีโอและประเภทให้ครบถ้วน");
      return;
    }

    setIsSubmitting(true);
    try {
      const userId = localStorage.getItem('currentUserId');
      const formData = new FormData();
      
      formData.append('userId', userId);
      // ส่ง ID ไปด้วย ถ้าเป็นการแก้ไข
      if (editingVideo.id) formData.append('videoId', editingVideo.id);
      
      formData.append('title', editingVideo.title);
      formData.append('category', editingVideo.category);
      formData.append('description', editingVideo.description || '');
      formData.append('aspectRatio', editingVideo.aspect_ratio);
      
      const isoPublishDate = `${pubYear - 543}-${pubMonth}-${pubDay}T${pubTime}:00`;
      formData.append('publishDate', isoPublishDate);
      
      if (editingVideo.videoFile) formData.append('videoFile', editingVideo.videoFile);
      if (editingVideo.coverFile) formData.append('coverFile', editingVideo.coverFile);
      if (editingVideo.outroCoverFile) formData.append('outroCoverFile', editingVideo.outroCoverFile);

      const response = await fetch(`${API_URL}/api/videos/upload`, {
        method: 'POST',
        body: formData 
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(editingVideo.isNew ? 'อัปโหลดสำเร็จ รอแอดมินตรวจสอบ' : 'บันทึกแก้ไขและส่งตรวจใหม่สำเร็จ!');
        setEditingVideo(null); 
        await loadPendingVideos(); // โหลดข้อมูลจาก Database ใหม่ทันทีเพื่อให้เห็นด้านล่าง
      } else {
        alert(result.message || 'บันทึกไม่สำเร็จ');
      }
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setIsSubmitting(false);
    }
  };

  // === [6. โครงสร้าง UI หน้าจอหลัก] ===
  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#111] text-white relative overflow-hidden font-sans">
      
      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover z-0 bg-gray-900" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-0 pointer-events-none"></div>

      <div className="absolute top-0 w-full z-20 flex justify-between items-start p-6">
        <button onClick={() => setCurrentScreen('create_media')} className="p-2 hover:bg-white/10 rounded-full transition">
          <X size={28} />
        </button>
        {mainMode === 'CREATE' ? (
          <button className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-semibold mt-1 shadow-lg">
            <Music size={16} /> Add sound
          </button>
        ) : mainMode === 'LIVE' ? (
          <button className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-semibold mt-1 shadow-lg">
            <Play size={16} /> Check LIVE access
          </button>
        ) : <div></div>}

        <div className="flex flex-col gap-5 items-center mt-1">
          <div className="flex flex-col items-center gap-1 cursor-pointer"><RefreshCw size={24} className="drop-shadow-md" /><span className="text-[10px] drop-shadow-md">Flip</span></div>
          <div className="flex flex-col items-center gap-1 cursor-pointer"><Wand2 size={24} className="drop-shadow-md" /><span className="text-[10px] drop-shadow-md">Beautify</span></div>
          <div className="flex flex-col items-center gap-1 cursor-pointer"><Sparkles size={24} className="drop-shadow-md" /><span className="text-[10px] drop-shadow-md">Effects</span></div>
          <div className="flex flex-col items-center gap-1 cursor-pointer bg-white/20 backdrop-blur-md p-1.5 rounded-full mt-2"><ChevronDown size={20} /></div>
        </div>
      </div>

      <div className="absolute bottom-[80px] w-full z-20 flex flex-col items-center">
        
        {/* รายการวิดีโอ (ดึงจาก DB เสมอ) */}
        <div className="w-full px-4 mb-4">
          <h3 className="text-xs font-bold text-gray-300 mb-2 flex items-center gap-1">
            <Clock size={14} /> รายการของฉัน (รอดำเนินการ/แก้ไข) 
            {isLoadingDrafts && <Loader2 size={12} className="animate-spin ml-2" />}
          </h3>
          
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 min-h-[70px]">
            {pendingVideos.map(video => (
              <div 
                key={video.id} 
                onClick={() => openEditVideo(video)} 
                className="relative w-28 h-36 rounded-lg bg-gray-800 border border-white/20 overflow-hidden cursor-pointer shrink-0 group"
              >
                {video.cover_url ? (
                  <img src={getMediaUrl(video.cover_url)} alt="cover" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition" />
                ) : (
                  <video src={getMediaUrl(video.url_high || video.video_url)} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition" />
                )}
                
                <div className="absolute inset-0 flex flex-col justify-between p-2">
                  <span className="text-[9px] bg-black/60 px-1.5 py-0.5 rounded text-white self-start">
                    {calculateDaysAgo(video.publish_date || video.created_at)}
                  </span>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex gap-1.5 items-center text-[9px] text-white font-bold drop-shadow-md">
                      <span className="flex items-center gap-0.5"><Eye size={10} />{video.views_count || 0}</span>
                      <span className="flex items-center gap-0.5"><Heart size={10} />{video.likes_count || 0}</span>
                    </div>
                    <Edit3 size={14} className="text-white drop-shadow-md" />
                  </div>
                </div>
              </div>
            ))}
            {!isLoadingDrafts && pendingVideos.length === 0 && (
              <p className="text-[10px] text-gray-400 italic mt-2">ยังไม่มีรายการ</p>
            )}
          </div>
        </div>

        {/* UI โหมด CREATE */}
        {mainMode === 'CREATE' && (
          <>
            <div className="flex gap-6 overflow-x-auto px-4 mb-6 text-sm font-semibold text-gray-300 w-full justify-center hide-scrollbar">
              {['10m', '60s', '15s', 'PHOTO', 'TEXT'].map((mode) => (
                <span key={mode} onClick={() => setRecordMode(mode)} className={`cursor-pointer transition-all drop-shadow-md ${recordMode === mode ? 'text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-full' : 'py-1'}`}>{mode}</span>
              ))}
            </div>

            <div className="flex items-center justify-center gap-8 w-full px-8 mb-6">
              <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-xl flex items-center justify-center overflow-hidden border border-white/30"><ImageIcon size={20} /></div>
              <div className="w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center p-1 cursor-pointer"><div className="w-full h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div></div>
              <div onClick={() => fileInputRef.current.click()} className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-xl flex flex-col items-center justify-center overflow-hidden border border-white/30 cursor-pointer hover:bg-white/20 transition">
                <Upload size={18} /><span className="text-[8px] mt-0.5 font-bold">Upload</span>
              </div>
              <input type="file" accept="video/*" ref={fileInputRef} className="hidden" onChange={handleVideoUpload} />
            </div>
          </>
        )}

        {/* UI โหมด LIVE */}
        {mainMode === 'LIVE' && (
          <div className="w-full px-6 flex flex-col items-center mb-6">
            <div className="w-full bg-black/40 backdrop-blur-md rounded-2xl p-4 flex justify-between items-center mb-6 border border-white/10">
              <div className="flex flex-col"><span className="font-bold text-sm">Try practice mode</span><span className="text-[11px] text-gray-300">This mode is only visible to you</span></div>
              <button className="bg-white/20 border border-white/30 px-4 py-1.5 rounded-full text-sm font-bold">Go</button>
            </div>
            <button className="w-full bg-[#ff3b5c] text-white font-bold py-4 rounded-full text-lg mb-6 shadow-lg shadow-red-500/20 active:scale-95 transition">Go LIVE</button>
            <div className="flex gap-6 text-sm font-semibold text-gray-300">
              <span onClick={() => setLiveMode('Device camera')} className={`flex items-center gap-1.5 cursor-pointer drop-shadow-md ${liveMode === 'Device camera' ? 'text-white' : ''}`}><Smartphone size={16} /> Device camera</span>
              <span onClick={() => setLiveMode('Mobile gaming')} className={`flex items-center gap-1.5 cursor-pointer drop-shadow-md ${liveMode === 'Mobile gaming' ? 'text-white' : ''}`}><Gamepad2 size={16} /> Mobile gaming</span>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 w-full bg-black/80 backdrop-blur-lg pb-safe pt-2 z-30">
        <div className="flex justify-center gap-8 text-sm font-bold text-gray-400 pb-2">
          {['POST', 'CREATE', 'LIVE'].map((tab) => (
            <span key={tab} onClick={() => setMainMode(tab)} className={`cursor-pointer transition-colors pb-1 ${mainMode === tab ? 'text-white border-b-2 border-white' : ''}`}>{tab}</span>
          ))}
        </div>
      </div>

      {/* === [7. Modal แก้ไขข้อมูลและ Preview] === */}
      {editingVideo && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center p-0 sm:p-4">
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90dvh]">
            
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--app-bg)] shrink-0">
              <h3 className="font-bold text-[var(--text-heading)] flex items-center gap-2 text-sm">
                <Edit3 size={18} className="text-[var(--icon-active)]"/> {editingVideo.isNew ? 'ข้อมูลเตรียมโพสต์' : 'แก้ไขและส่งตรวจใหม่'}
              </h3>
              <button onClick={() => !isSubmitting && setEditingVideo(null)} className="text-[var(--icon-inactive)] hover:text-red-500 transition">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto space-y-4 text-[var(--text-heading)]">
              
              {/* เครื่องเล่น Video */}
              <div className="w-full bg-black rounded-xl overflow-hidden shadow-inner border border-[var(--border-color)]">
                <video src={getMediaUrl(editingVideo.video_url)} controls className="w-full max-h-56 object-contain" autoPlay playsInline />
              </div>

              {/* เลือกสัดส่วนภาพ */}
              <div className="flex justify-center gap-6 bg-[var(--app-bg)] p-3 rounded-xl border border-[var(--border-color)]">
                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-[var(--icon-active)] transition">
                  <input type="radio" name="aspectRatio" checked={editingVideo.aspect_ratio === '9:16'} onChange={() => setEditingVideo({...editingVideo, aspect_ratio: '9:16'})} className="accent-[var(--icon-active)]" /> แนวตั้ง (9:16)
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-[var(--icon-active)] transition">
                  <input type="radio" name="aspectRatio" checked={editingVideo.aspect_ratio === '16:9'} onChange={() => setEditingVideo({...editingVideo, aspect_ratio: '16:9'})} className="accent-[var(--icon-active)]" /> แนวนอน (16:9)
                </label>
              </div>

              {/* อัปโหลดรูป ปกคลิป (หน้า) และ ปกท้าย (ปิดหน้า) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] text-[var(--icon-inactive)] uppercase font-bold">ภาพปกหน้า (COVER)</span>
                  <div onClick={() => coverInputRef.current.click()} className={`bg-[var(--app-bg)] border-2 border-dashed border-[var(--icon-active)] rounded-xl flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group transition-all duration-300 w-full ${editingVideo.aspect_ratio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'}`}>
                    {editingVideo.cover_url ? <img src={getMediaUrl(editingVideo.cover_url)} alt="Cover" className="w-full h-full object-cover" /> : <div className="flex flex-col items-center text-[var(--icon-inactive)]"><ImageIcon size={20} /><span className="text-[9px] mt-1">เลือกรูป</span></div>}
                  </div>
                  <input type="file" accept="image/*" ref={coverInputRef} className="hidden" onChange={handleCoverUpload} />
                </div>

                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] text-[var(--icon-inactive)] uppercase font-bold">ภาพปิดหน้า (OUTRO)</span>
                  <div onClick={() => outroInputRef.current.click()} className={`bg-[var(--app-bg)] border-2 border-dashed border-gray-500 rounded-xl flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group transition-all duration-300 w-full ${editingVideo.aspect_ratio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'}`}>
                    {editingVideo.outro_cover_url ? <img src={getMediaUrl(editingVideo.outro_cover_url)} alt="Outro" className="w-full h-full object-cover" /> : <div className="flex flex-col items-center text-[var(--icon-inactive)]"><ImageIcon size={20} /><span className="text-[9px] mt-1">เลือกรูป</span></div>}
                  </div>
                  <input type="file" accept="image/*" ref={outroInputRef} className="hidden" onChange={handleOutroCoverUpload} />
                </div>
              </div>

              {/* ฟอร์มข้อมูลเนื้อหา */}
              <div>
                <label className="text-[10px] text-[var(--icon-inactive)] uppercase mb-1 block">ชื่อวิดีโอ (Title)</label>
                <input type="text" value={editingVideo.title} onChange={e => setEditingVideo({...editingVideo, title: e.target.value})} className="w-full bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-3 py-2.5 outline-none focus:border-[var(--icon-active)] text-sm" placeholder="ตั้งชื่อวิดีโอให้น่าสนใจ..." />
              </div>

              <div>
                <label className="text-[10px] text-[var(--icon-inactive)] uppercase mb-1 block">ประเภท (Category)</label>
                <select value={editingVideo.category} onChange={e => setEditingVideo({...editingVideo, category: e.target.value})} className="w-full bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-3 py-2.5 outline-none focus:border-[var(--icon-active)] text-sm">
                  <option value="">เลือกประเภท</option>
                  <option value="business">ธุรกิจ</option>
                  <option value="education">ให้ความรู้</option>
                  <option value="entertainment">บันเทิง</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[var(--icon-inactive)] uppercase mb-1 block">รายละเอียด (Description)</label>
                <textarea value={editingVideo.description} onChange={e => setEditingVideo({...editingVideo, description: e.target.value})} className="w-full bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-3 py-2.5 outline-none focus:border-[var(--icon-active)] text-sm min-h-[60px]" placeholder="เขียนอธิบายเกี่ยวกับวิดีโอนี้..." />
              </div>

              {/* ระบบวันที่แบบไทย */}
              <div className="bg-[var(--app-bg)] p-3 rounded-xl border border-[var(--border-color)]">
                <h4 className="text-xs font-bold mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-1"><Calendar size={14} className="text-[var(--icon-active)]" /> ตั้งเวลาเผยแพร่</span>
                </h4>
                
                <div className="mb-4">
                  <label className="text-[10px] text-[var(--icon-inactive)] mb-1 block">วันที่เริ่ม Post (แบบไทย)</label>
                  <div className="flex gap-2">
                    <select value={pubDay} onChange={(e) => setPubDay(e.target.value)} className="w-1/4 bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-2 py-2 text-xs outline-none">
                      {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select value={pubMonth} onChange={(e) => setPubMonth(e.target.value)} className="w-2/4 bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-2 py-2 text-xs outline-none">
                      {THAI_MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                    <select value={pubYear} onChange={(e) => setPubYear(Number(e.target.value))} className="w-1/4 bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-2 py-2 text-xs outline-none">
                      {THAI_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] text-[var(--icon-inactive)]">เวลา:</span>
                    <input type="time" value={pubTime} onChange={(e) => setPubTime(e.target.value)} className="bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-2 py-1.5 text-xs outline-none" />
                    <span className="text-[10px] text-[var(--icon-active)] ml-2">น.</span>
                  </div>
                </div>
                
                <div className="border-t border-[var(--border-color)] pt-3">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="forever" checked={isForever} onChange={(e) => setIsForever(e.target.checked)} className="accent-[var(--icon-active)] w-4 h-4" />
                    <label htmlFor="forever" className="text-xs font-bold text-[var(--icon-active)] cursor-pointer">โพสต์ตลอดไป (ไม่มีวันหมดอายุ)</label>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 p-3 rounded-xl text-orange-500">
                <Clock size={20} className="shrink-0" />
                <p className="text-[10px]">
                  {editingVideo.isNew ? 'วิดีโอนี้จะยังไม่ถูกโพสต์สาธารณะ จนกว่าแอดมินจะอนุมัติ' : 'การแก้ไขข้อมูล จะส่งผลให้วิดีโอต้องรอแอดมินตรวจใหม่อีกครั้ง!'}
                </p>
              </div>

              {/* ปุ่มบันทึก */}
              <button 
                onClick={handleSaveVideoInfo} 
                disabled={isSubmitting} 
                className="w-full bg-[var(--icon-active)] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-2 shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                {isSubmitting ? 'กำลังส่งข้อมูล...' : editingVideo.isNew ? 'ส่งให้ Admin ตรวจสอบ' : 'บันทึกการแก้ไขและส่งตรวจใหม่'}
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}