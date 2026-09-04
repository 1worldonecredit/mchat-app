import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Music, RefreshCw, Wand2, Sparkles, ChevronDown, 
  Play, Smartphone, Gamepad2, Image as ImageIcon, 
  Upload, Clock, Edit3, CheckCircle2, Calendar, Loader2
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://mchatapi.9plus.app';

export default function CameraStudio({ setCurrentScreen }) {
  // ==========================================
  // 1. State ทั้งหมดสำหรับควบคุม UI และข้อมูล
  // ==========================================
  const [mainMode, setMainMode] = useState('CREATE');
  const [recordMode, setRecordMode] = useState('15s');
  const [liveMode, setLiveMode] = useState('Device camera');
  
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [pendingVideos, setPendingVideos] = useState([]); // เก็บรายการที่ดึงจาก DB
  const [editingVideo, setEditingVideo] = useState(null); // เก็บข้อมูลชั่วคราวตอนกรอก Modal
  const [isForever, setIsForever] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(false);

  // ==========================================
  // 2. เปิดกล้อง & ดึงข้อมูล Draft จาก Database
  // ==========================================
  useEffect(() => {
    // 2.1 เปิดกล้อง
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

    // 2.2 ดึงข้อมูลวิดีโอรอตรวจจาก API
    const fetchPendingVideos = async () => {
      setIsLoadingDrafts(true);
      try {
        const userId = localStorage.getItem('currentUserId');
        if (!userId) return;
        const res = await fetch(`${API_URL}/api/videos/pending?userId=${userId}`);
        const data = await res.json();
        if (data.success) {
          setPendingVideos(data.videos);
        }
      } catch (err) {
        console.error("ดึงข้อมูล Draft ล้มเหลว", err);
      } finally {
        setIsLoadingDrafts(false);
      }
    };
    fetchPendingVideos();

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  // ==========================================
  // 3. ฟังก์ชันจำลองการอัปโหลดเข้า UI ก่อนส่ง API
  // ==========================================
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const videoUrl = URL.createObjectURL(file);
    // สร้าง Object ชั่วคราวเพื่อนำไปกรอกใน Modal
    const newVideo = {
      isNew: true, // แฟล็กบอกว่าเป็นไฟล์ใหม่
      videoFile: file,
      coverFile: null,
      video_url: videoUrl,
      title: '',
      category: '',
      description: '',
      cover_url: '',
      publish_date: '',
      expire_date: '',
      status: 'pending',
      aspect_ratio: '9:16'
    };
    setEditingVideo(newVideo); // เปิด Modal ทันที
    // เคลียร์ input เพื่อให้อัปโหลดไฟล์เดิมซ้ำได้
    e.target.value = null; 
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const coverUrl = URL.createObjectURL(file);
    setEditingVideo(prev => ({ ...prev, coverFile: file, cover_url: coverUrl }));
  };

  // ==========================================
  // 4. ฟังก์ชันส่งข้อมูลเข้า API (อัปโหลดจริง)
  // ==========================================
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
      formData.append('title', editingVideo.title);
      formData.append('category', editingVideo.category);
      formData.append('description', editingVideo.description || '');
      formData.append('aspectRatio', editingVideo.aspect_ratio);
      
      if (editingVideo.publish_date) formData.append('publishDate', editingVideo.publish_date);
      if (!isForever && editingVideo.expire_date) formData.append('expireDate', editingVideo.expire_date);
      
      // แนบไฟล์จริง
      if (editingVideo.videoFile) formData.append('videoFile', editingVideo.videoFile);
      if (editingVideo.coverFile) formData.append('coverFile', editingVideo.coverFile);

      // ส่งไปที่ API
      const response = await fetch(`${API_URL}/api/videos/upload`, {
        method: 'POST',
        body: formData 
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('ส่งข้อมูลให้ Admin ตรวจสอบสำเร็จ!');
        // นำวิดีโอใหม่ที่ได้จาก API มาต่อหน้าลิสต์
        setPendingVideos(prev => [result.video, ...prev]);
        setEditingVideo(null); // ปิด Modal
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

  // ==========================================
  // 5. โครงสร้าง UI (หน้าตาแอป)
  // ==========================================
  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#111] text-white relative overflow-hidden font-sans">
      
      {/* วิดีโอพื้นหลัง (ภาพจากกล้องจริง) */}
      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover z-0 bg-gray-900" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-0 pointer-events-none"></div>

      {/* Top Bar (เครื่องมือด้านบนและขวา) */}
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

      {/* ควบคุมส่วนกลางและล่าง */}
      <div className="absolute bottom-[80px] w-full z-20 flex flex-col items-center">
        
        {/* แถบรายการรอตรวจ (ดึงมาจาก API) */}
        <div className="w-full px-4 mb-4">
          <h3 className="text-xs font-bold text-gray-300 mb-2 flex items-center gap-1">
            <Clock size={14} /> รายการรอตรวจสอบ {isLoadingDrafts && <Loader2 size={12} className="animate-spin" />}
          </h3>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 min-h-[70px]">
            {pendingVideos.map(video => (
              <div 
                key={video.id} 
                // หากคลิกรายการเก่าที่อัปโหลดไปแล้ว ให้เปิด Modal เพื่อดูรายละเอียด (ระบบแก้อาจต้องมี API อัปเดตต่างหาก)
                onClick={() => setEditingVideo({ ...video, isNew: false })} 
                className="relative w-16 h-16 rounded-lg bg-gray-800 border-2 border-orange-500 overflow-hidden cursor-pointer shrink-0"
              >
                {/* ถ้ามีรูปปกที่ดึงมาจาก API ให้แสดงรูปปก */}
                {video.cover_url ? (
                  <img src={video.cover_url.startsWith('http') ? video.cover_url : `${API_URL}${video.cover_url}`} alt="cover" className="w-full h-full object-cover opacity-70" />
                ) : (
                  <video src={video.video_url?.startsWith('http') ? video.video_url : `${API_URL}${video.video_url}`} className="w-full h-full object-cover opacity-70" />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Edit3 size={16} className="text-white drop-shadow-md" />
                </div>
              </div>
            ))}
            {!isLoadingDrafts && pendingVideos.length === 0 && (
              <p className="text-[10px] text-gray-400 italic">ยังไม่มีรายการรอตรวจสอบ</p>
            )}
          </div>
        </div>

        {/* โหมด CREATE */}
        {mainMode === 'CREATE' && (
          <>
            <div className="flex gap-6 overflow-x-auto px-4 mb-6 text-sm font-semibold text-gray-300 w-full justify-center hide-scrollbar">
              {['10m', '60s', '15s', 'PHOTO', 'TEXT'].map((mode) => (
                <span key={mode} onClick={() => setRecordMode(mode)} className={`cursor-pointer transition-all drop-shadow-md ${recordMode === mode ? 'text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-full' : 'py-1'}`}>{mode}</span>
              ))}
            </div>

            <div className="flex items-center justify-center gap-8 w-full px-8 mb-6">
              <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-xl flex items-center justify-center overflow-hidden border border-white/30">
                <ImageIcon size={20} />
              </div>
              
              {/* ปุ่มชัตเตอร์ */}
              <div className="w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center p-1 cursor-pointer">
                <div className="w-full h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
              </div>
              
              {/* ปุ่มอัปโหลด */}
              <div onClick={() => fileInputRef.current.click()} className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-xl flex flex-col items-center justify-center overflow-hidden border border-white/30 cursor-pointer hover:bg-white/20 transition">
                <Upload size={18} />
                <span className="text-[8px] mt-0.5 font-bold">Upload</span>
              </div>
              <input type="file" accept="video/*" ref={fileInputRef} className="hidden" onChange={handleVideoUpload} />
            </div>
          </>
        )}

        {/* โหมด LIVE */}
        {mainMode === 'LIVE' && (
          <div className="w-full px-6 flex flex-col items-center mb-6">
            <div className="w-full bg-black/40 backdrop-blur-md rounded-2xl p-4 flex justify-between items-center mb-6 border border-white/10">
              <div className="flex flex-col">
                <span className="font-bold text-sm">Try practice mode</span>
                <span className="text-[11px] text-gray-300">This mode is only visible to you</span>
              </div>
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

      {/* เมนูหลักล่างสุด */}
      <div className="absolute bottom-0 w-full bg-black/80 backdrop-blur-lg pb-safe pt-2 z-30">
        <div className="flex justify-center gap-8 text-sm font-bold text-gray-400 pb-2">
          {['POST', 'CREATE', 'LIVE'].map((tab) => (
            <span key={tab} onClick={() => setMainMode(tab)} className={`cursor-pointer transition-colors pb-1 ${mainMode === tab ? 'text-white border-b-2 border-white' : ''}`}>{tab}</span>
          ))}
        </div>
      </div>

      {/* ======================================= */}
      {/* Modal: กรอกข้อมูลและส่งให้ Admin ตรวจ */}
      {/* ======================================= */}
      {editingVideo && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center p-0 sm:p-4">
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90dvh]">
            
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--app-bg)] shrink-0">
              <h3 className="font-bold text-[var(--text-heading)] flex items-center gap-2 text-sm">
                <Edit3 size={18} className="text-[var(--icon-active)]"/> ข้อมูลเตรียมโพสต์
              </h3>
              <button onClick={() => !isSubmitting && setEditingVideo(null)} className="text-[var(--icon-inactive)] hover:text-red-500 transition">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto space-y-4 text-[var(--text-heading)]">
              
              {/* เลือกสัดส่วนภาพ */}
              <div className="flex justify-center gap-6 bg-[var(--app-bg)] p-3 rounded-xl border border-[var(--border-color)]">
                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-[var(--icon-active)] transition">
                  <input type="radio" name="aspectRatio" checked={editingVideo.aspect_ratio === '9:16'} onChange={() => setEditingVideo({...editingVideo, aspect_ratio: '9:16'})} className="accent-[var(--icon-active)]" />
                  แนวตั้ง (9:16)
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-[var(--icon-active)] transition">
                  <input type="radio" name="aspectRatio" checked={editingVideo.aspect_ratio === '16:9'} onChange={() => setEditingVideo({...editingVideo, aspect_ratio: '16:9'})} className="accent-[var(--icon-active)]" />
                  แนวนอน (16:9)
                </label>
              </div>

              {/* Preview วิดีโอ/รูปปก (ปรับสัดส่วน 16:9 / 9:16 อัตโนมัติ) */}
              <div className="flex flex-col items-center gap-2">
                <div 
                  onClick={() => coverInputRef.current.click()}
                  className={`bg-[var(--app-bg)] border-2 border-dashed border-[var(--icon-active)] rounded-xl flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group transition-all duration-300 mx-auto
                    ${editingVideo.aspect_ratio === '9:16' ? 'w-40 aspect-[9/16]' : 'w-full aspect-video'}
                  `}
                >
                  {/* แสดงรูปปกที่เลือก หรือถ้ารูปเก่าจาก DB ก็เอามาแสดง */}
                  {editingVideo.cover_url ? (
                    <img src={editingVideo.cover_url.startsWith('blob') || editingVideo.cover_url.startsWith('http') ? editingVideo.cover_url : `${API_URL}${editingVideo.cover_url}`} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <video src={editingVideo.video_url?.startsWith('blob') || editingVideo.video_url?.startsWith('http') ? editingVideo.video_url : `${API_URL}${editingVideo.video_url}`} className="w-full h-full object-cover opacity-50" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <ImageIcon size={24} className="text-white mb-1" />
                    <span className="text-xs text-white">แตะเพื่อเปลี่ยนใบปิด (Cover)</span>
                  </div>
                </div>
                <input type="file" accept="image/*" ref={coverInputRef} className="hidden" onChange={handleCoverUpload} />
              </div>

              {/* ฟอร์มข้อมูล */}
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

              {/* ตั้งเวลาเผยแพร่ */}
              <div className="bg-[var(--app-bg)] p-3 rounded-xl border border-[var(--border-color)]">
                <h4 className="text-xs font-bold mb-3 flex items-center gap-1"><Calendar size={14} className="text-[var(--icon-active)]" /> ตั้งเวลาเผยแพร่</h4>
                <div className="mb-3">
                  <label className="text-[10px] text-[var(--icon-inactive)] mb-1 block">วันที่เริ่ม Post</label>
                  <input type="datetime-local" value={editingVideo.publish_date} onChange={e => setEditingVideo({...editingVideo, publish_date: e.target.value})} className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-2 py-2 text-xs outline-none" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <input type="checkbox" id="forever" checked={isForever} onChange={(e) => setIsForever(e.target.checked)} className="accent-[var(--icon-active)]" />
                    <label htmlFor="forever" className="text-[11px]">โพสต์ตลอดไป (ไม่มีวันหมดอายุ)</label>
                  </div>
                  {!isForever && (
                    <div>
                      <label className="text-[10px] text-[var(--icon-inactive)] mb-1 block">วันที่สิ้นสุดการ Post</label>
                      <input type="datetime-local" value={editingVideo.expire_date} onChange={e => setEditingVideo({...editingVideo, expire_date: e.target.value})} className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-2 py-2 text-xs outline-none" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 p-3 rounded-xl text-orange-500">
                <Clock size={20} className="shrink-0" />
                <p className="text-[10px]">วิดีโอนี้จะยังไม่ถูกโพสต์สาธารณะ จนกว่าผู้ดูแลระบบ (Admin) จะทำการตรวจสอบและอนุมัติ</p>
              </div>

              {/* ปุ่มส่งข้อมูล (กดได้เฉพาะไฟล์ใหม่ ถ้ากดดูไฟล์เก่าจะถูก Disable เพื่อให้เป็นโหมด View เท่านั้น) */}
              <button 
                onClick={handleSaveVideoInfo} 
                disabled={isSubmitting || !editingVideo.isNew} 
                className="w-full bg-[var(--icon-active)] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-2 shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                {!editingVideo.isNew ? 'รอแอดมินตรวจสอบ...' : isSubmitting ? 'กำลังอัปโหลดและบันทึก...' : 'บันทึกและส่งให้ Admin ตรวจสอบ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}