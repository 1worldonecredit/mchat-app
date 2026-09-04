import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Music, RefreshCw, Wand2, Sparkles, ChevronDown, 
  Play, Smartphone, Gamepad2, Image as ImageIcon, 
  Upload, Clock, Edit3, CheckCircle2, Calendar, Loader2
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://mchatapi.9plus.app';

export default function CameraStudio({ setCurrentScreen }) {
  const [mainMode, setMainMode] = useState('CREATE');
  const [recordMode, setRecordMode] = useState('15s');
  const [liveMode, setLiveMode] = useState('Device camera');
  
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [pendingVideos, setPendingVideos] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);
  const [isForever, setIsForever] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // เปิดกล้องมือถือ/เว็บแคม
  useEffect(() => {
    let stream = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn("ไม่สามารถเข้าถึงกล้องได้: ", err);
      }
    };
    startCamera();

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  // ฟังก์ชันจัดการการอัปโหลดวิดีโอ (พักไว้ที่ UI ก่อน)
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const videoUrl = URL.createObjectURL(file);
    const newVideo = {
      id: Date.now(),
      videoFile: file, // เก็บไฟล์จริงไว้เพื่อส่ง API
      coverFile: null,
      video_url: videoUrl, // สำหรับ Preview
      title: 'วิดีโอใหม่ยังไม่ได้ตั้งชื่อ',
      category: '',
      description: '',
      cover_url: '', // สำหรับ Preview
      publish_date: '',
      expire_date: '',
      status: 'draft'
    };

    setPendingVideos(prev => [newVideo, ...prev]);
    setEditingVideo(newVideo);
  };

  // ฟังก์ชันอัปโหลดรูปปกวิดีโอ
  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const coverUrl = URL.createObjectURL(file);
    setEditingVideo(prev => ({ ...prev, coverFile: file, cover_url: coverUrl }));
  };

  // ==========================================
  // ส่งข้อมูลเข้า API (อัปโหลดจริง)
  // ==========================================
  const handleSaveVideoInfo = async () => {
    if (!editingVideo.title || !editingVideo.category) {
      alert("กรุณากรอกชื่อวิดีโอและประเภท");
      return;
    }

    setIsSubmitting(true);
    try {
      const userId = localStorage.getItem('currentUserId');
      
      // ใช้ FormData เพราะเราต้องส่งไฟล์ Video และรูปภาพ
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('title', editingVideo.title);
      formData.append('category', editingVideo.category);
      formData.append('description', editingVideo.description);
      formData.append('publishDate', editingVideo.publish_date);
      if (!isForever) {
        formData.append('expireDate', editingVideo.expire_date);
      }
      
      // แนบไฟล์จริง
      if (editingVideo.videoFile) formData.append('videoFile', editingVideo.videoFile);
      if (editingVideo.coverFile) formData.append('coverFile', editingVideo.coverFile);

      const response = await fetch(`${API_URL}/api/videos/upload`, {
        method: 'POST',
        // ไม่ต้องกำหนด Content-Type เพราะ browser จะจัดการ boundary ของ FormData ให้เอง
        body: formData 
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('อัปโหลดและบันทึกข้อมูลสำเร็จ! วิดีโอของคุณอยู่ในสถานะรอแอดมินตรวจสอบ');
        // เอาออกจากรายการ Draft
        setPendingVideos(prev => prev.filter(v => v.id !== editingVideo.id));
        setEditingVideo(null);
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
        ) : (
          <div></div>
        )}

        {/* แถบเครื่องมือขวา */}
        <div className="flex flex-col gap-5 items-center mt-1">
          <div className="flex flex-col items-center gap-1 cursor-pointer"><RefreshCw size={24} className="drop-shadow-md" /><span className="text-[10px] font-medium drop-shadow-md">Flip</span></div>
          <div className="flex flex-col items-center gap-1 cursor-pointer"><Wand2 size={24} className="drop-shadow-md" /><span className="text-[10px] font-medium drop-shadow-md">Beautify</span></div>
          <div className="flex flex-col items-center gap-1 cursor-pointer"><Sparkles size={24} className="drop-shadow-md" /><span className="text-[10px] font-medium drop-shadow-md">Effects</span></div>
          <div className="flex flex-col items-center gap-1 cursor-pointer bg-white/20 backdrop-blur-md p-1.5 rounded-full mt-2"><ChevronDown size={20} /></div>
        </div>
      </div>

      <div className="absolute bottom-[80px] w-full z-20 flex flex-col items-center">
        
        {/* รายการ Draft ที่เพิ่งถ่าย/เลือก */}
        {pendingVideos.length > 0 && (
          <div className="w-full px-4 mb-4">
            <h3 className="text-xs font-bold text-gray-300 mb-2 flex items-center gap-1">
              <Clock size={14} /> ฉบับร่าง (รอใส่รายละเอียด)
            </h3>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
              {pendingVideos.map(video => (
                <div 
                  key={video.id} 
                  onClick={() => setEditingVideo(video)}
                  className="relative w-16 h-16 rounded-lg bg-gray-800 border-2 border-[var(--icon-active)] overflow-hidden cursor-pointer shrink-0"
                >
                  {video.cover_url ? (
                    <img src={video.cover_url} alt="cover" className="w-full h-full object-cover opacity-70" />
                  ) : (
                    <video src={video.video_url} className="w-full h-full object-cover opacity-70" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Edit3 size={16} className="text-white drop-shadow-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* โหมด CREATE */}
        {mainMode === 'CREATE' && (
          <>
            <div className="flex gap-6 overflow-x-auto px-4 mb-6 text-sm font-semibold text-gray-300 w-full justify-center hide-scrollbar">
              {['10m', '60s', '15s', 'PHOTO', 'TEXT'].map((mode) => (
                <span 
                  key={mode} 
                  onClick={() => setRecordMode(mode)}
                  className={`cursor-pointer transition-all drop-shadow-md ${recordMode === mode ? 'text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-full' : 'py-1'}`}
                >
                  {mode}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-center gap-8 w-full px-8 mb-6">
              <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-xl flex items-center justify-center overflow-hidden border border-white/30">
                <ImageIcon size={20} />
              </div>
              
              <div className="w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center p-1 cursor-pointer">
                <div className="w-full h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
              </div>
              
              <div 
                onClick={() => fileInputRef.current.click()}
                className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-xl flex flex-col items-center justify-center overflow-hidden border border-white/30 cursor-pointer hover:bg-white/20 transition"
              >
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

            <button className="w-full bg-[#ff3b5c] text-white font-bold py-4 rounded-full text-lg mb-6 shadow-lg shadow-red-500/20 active:scale-95 transition">
              Go LIVE
            </button>

            <div className="flex gap-6 text-sm font-semibold text-gray-300">
              <span onClick={() => setLiveMode('Device camera')} className={`flex items-center gap-1.5 cursor-pointer drop-shadow-md ${liveMode === 'Device camera' ? 'text-white' : ''}`}>
                <Smartphone size={16} /> Device camera
              </span>
              <span onClick={() => setLiveMode('Mobile gaming')} className={`flex items-center gap-1.5 cursor-pointer drop-shadow-md ${liveMode === 'Mobile gaming' ? 'text-white' : ''}`}>
                <Gamepad2 size={16} /> Mobile gaming
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 w-full bg-black/80 backdrop-blur-lg pb-safe pt-2 z-30">
        <div className="flex justify-center gap-8 text-sm font-bold text-gray-400 pb-2">
          {['POST', 'CREATE', 'LIVE'].map((tab) => (
            <span 
              key={tab} 
              onClick={() => setMainMode(tab)}
              className={`cursor-pointer transition-colors pb-1 ${mainMode === tab ? 'text-white border-b-2 border-white' : ''}`}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      {/* Modal แก้ไขและอัปโหลดวิดีโอ */}
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
              <div className="flex flex-col items-center gap-2">
                <div 
                  onClick={() => coverInputRef.current.click()}
                  className="w-full h-32 bg-[var(--app-bg)] border-2 border-dashed border-[var(--icon-active)] rounded-xl flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group"
                >
                  {editingVideo.cover_url ? (
                    <img src={editingVideo.cover_url} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <video src={editingVideo.video_url} className="w-full h-full object-cover opacity-50" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <ImageIcon size={24} className="text-white mb-1" />
                    <span className="text-xs text-white">อัปโหลดใบปิดหน้า (Cover)</span>
                  </div>
                </div>
                <input type="file" accept="image/*" ref={coverInputRef} className="hidden" onChange={handleCoverUpload} />
              </div>

              <div>
                <label className="text-[10px] text-[var(--icon-inactive)] uppercase mb-1 block">ชื่อวิดีโอ (Title)</label>
                <input 
                  type="text" 
                  value={editingVideo.title} 
                  onChange={e => setEditingVideo({...editingVideo, title: e.target.value})} 
                  className="w-full bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-3 py-2.5 outline-none focus:border-[var(--icon-active)] text-sm" 
                  placeholder="ตั้งชื่อวิดีโอให้น่าสนใจ..." 
                />
              </div>

              <div>
                <label className="text-[10px] text-[var(--icon-inactive)] uppercase mb-1 block">ประเภท (Category)</label>
                <select 
                  value={editingVideo.category} 
                  onChange={e => setEditingVideo({...editingVideo, category: e.target.value})} 
                  className="w-full bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-3 py-2.5 outline-none focus:border-[var(--icon-active)] text-sm"
                >
                  <option value="">เลือกประเภท</option>
                  <option value="business">ธุรกิจ</option>
                  <option value="education">ให้ความรู้</option>
                  <option value="entertainment">บันเทิง</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[var(--icon-inactive)] uppercase mb-1 block">รายละเอียด (Description)</label>
                <textarea 
                  value={editingVideo.description} 
                  onChange={e => setEditingVideo({...editingVideo, description: e.target.value})} 
                  className="w-full bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-3 py-2.5 outline-none focus:border-[var(--icon-active)] text-sm min-h-[60px]" 
                  placeholder="เขียนอธิบายเกี่ยวกับวิดีโอนี้..." 
                />
              </div>

              <div className="bg-[var(--app-bg)] p-3 rounded-xl border border-[var(--border-color)]">
                <h4 className="text-xs font-bold mb-3 flex items-center gap-1"><Calendar size={14} className="text-[var(--icon-active)]" /> ตั้งเวลาเผยแพร่</h4>
                <div className="mb-3">
                  <label className="text-[10px] text-[var(--icon-inactive)] mb-1 block">วันที่เริ่ม Post</label>
                  <input 
                    type="datetime-local" 
                    value={editingVideo.publish_date}
                    onChange={e => setEditingVideo({...editingVideo, publish_date: e.target.value})}
                    className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-2 py-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <input type="checkbox" id="forever" checked={isForever} onChange={(e) => setIsForever(e.target.checked)} className="accent-[var(--icon-active)]" />
                    <label htmlFor="forever" className="text-[11px]">โพสต์ตลอดไป (ไม่มีวันหมดอายุ)</label>
                  </div>
                  {!isForever && (
                    <div>
                      <label className="text-[10px] text-[var(--icon-inactive)] mb-1 block">วันที่สิ้นสุดการ Post</label>
                      <input 
                        type="datetime-local" 
                        value={editingVideo.expire_date}
                        onChange={e => setEditingVideo({...editingVideo, expire_date: e.target.value})}
                        className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-2 py-2 text-xs outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 p-3 rounded-xl text-orange-500">
                <Clock size={20} className="shrink-0" />
                <p className="text-[10px]">วิดีโอนี้จะยังไม่ถูกโพสต์สาธารณะ จนกว่าผู้ดูแลระบบ (Admin) จะทำการตรวจสอบและอนุมัติ</p>
              </div>

              <button 
                onClick={handleSaveVideoInfo} 
                disabled={isSubmitting}
                className="w-full bg-[var(--icon-active)] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-2 shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                {isSubmitting ? 'กำลังอัปโหลดและบันทึก...' : 'บันทึกและส่งให้ Admin ตรวจสอบ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}