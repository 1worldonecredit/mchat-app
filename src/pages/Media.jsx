import React, { useState, useEffect, useMemo } from 'react';
import { 
  Heart, MessageCircle, Share2, Music, Plus, Check,
  Search, Tv, ShoppingCart, X, MapPin, 
  Maximize2, Minimize2, User
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { fetchUserProfile } from '../utils/apiProfile'; 

const API_URL = import.meta.env.VITE_API_URL || 'https://mchatapi.9plus.app';
const CF_DOMAIN = 'https://customer-a6fkepv8oxw1um16.cloudflarestream.com'; // โดเมน Cloudflare

export default function Media({ setCurrentScreen, onMenuChange }) {
  const [showCart, setShowCart] = useState(false);
  const [province, setProvince] = useState("กำลังค้นหา...");
  const [activeTab, setActiveTab] = useState('ForYou'); 
  const [followedChannels, setFollowedChannels] = useState([]);
  const [fullScreenId, setFullScreenId] = useState(null);
  const [videoQuality, setVideoQuality] = useState('med'); 
  const [myAvatar, setMyAvatar] = useState(null);
  const [isMuted, setIsMuted] = useState(true); // เริ่มต้นให้ปิดเสียงไว้ก่อนเพื่อให้ Autoplay ทำงานได้
  
  // 🌟 เปลี่ยนจากการ Fix ค่า เป็น State ว่างๆ รอรับจาก API
  const [allVideos, setAllVideos] = useState([]);

  const toggleFullScreen = (id) => {
    setFullScreenId(fullScreenId === id ? null : id);
  };

  useEffect(() => {
    const savedProvince = localStorage.getItem('userProvince');
    if (savedProvince) setProvince(savedProvince);
    setVideoQuality('med'); 

    const userId = localStorage.getItem('currentUserId');
    if (userId) {
      fetchUserProfile(userId)
        .then(res => {
          if (res && res.success && res.profile && res.profile.avatar_url) {
            setMyAvatar(res.profile.avatar_url);
          }
        })
        .catch(err => console.error("โหลดรูปโปรไฟล์ล้มเหลว:", err));
    }
    
    // 🌟 เรียกใช้ฟังก์ชันดึงวิดีโอเมื่อเปิดหน้านี้
    loadFeed();
  }, []);

  // 🌟 ฟังก์ชันดึงข้อมูลจาก Database และแปลงให้เข้ากับ UI เดิม
  const loadFeed = async () => {
    try {
      const res = await fetch(`${API_URL}/api/videos/feed`);
      const data = await res.json();
      if (data.success) {
        const formattedVideos = data.videos.map(v => ({
          id: v.id,
          channelName: v.channel_name || 'M-Chat User',
          tier: 'Standard', 
          caption: v.title || v.description || 'ไม่มีคำอธิบาย',
          sound: v.sound_name || 'Original Sound',
          likes: v.views_count || '0', 
          comments: '0',
          shares: '0',
          avatar: v.avatar_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
          url_low: v.url_low,
          url_med: v.url_med,
          url_high: v.url_high,
          cf_video_id: v.cf_video_id, // รหัส Cloudflare
          targetProvince: 'All', 
          // จัดการ URL ลายน้ำ (ถ้ารูปมาจาก R2 จะเป็น http นำหน้าอยู่แล้ว)
          watermarkUrl: v.watermark_url ? (v.watermark_url.startsWith('http') ? v.watermark_url : `${API_URL}${v.watermark_url}`) : null,
          watermarkPos: v.watermark_position || 'bottom-right'
        }));
        setAllVideos(formattedVideos);
      }
    } catch (error) {
      console.error("Error loading feed:", error);
    }
  };

  // 🌟 ฟังก์ชันจัดการลิงก์วิดีโอ (ดึง Cloudflare HLS เป็นหลัก)
  const getVideoUrl = (video) => {
    // ถ้ามี Cloudflare ID ให้ดึงสตรีม m3u8 มาเล่น
    if (video.cf_video_id) {
      return `${CF_DOMAIN}/${video.cf_video_id}/manifest/video.m3u8`;
    }
    
    // สำรอง: ดึงจากไฟล์เก่าในเซิร์ฟเวอร์
    let url = video.url_med || video.url_high || video.url_low;
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    return `${API_URL}${url}`;
  };

  const toggleFollow = (channelName) => {
    setFollowedChannels(prev => 
      prev.includes(channelName) ? prev.filter(c => c !== channelName) : [...prev, channelName]
    );
  };

  const displayVideos = useMemo(() => {
    if (activeTab === 'Following') {
      return allVideos.filter(v => followedChannels.includes(v.channelName));
    }
    return [...allVideos].sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      if (a.targetProvince === province) scoreA += 10;
      if (followedChannels.includes(a.channelName)) scoreA += 5;
      if (a.targetProvince === 'All') scoreA += 1;
      if (b.targetProvince === province) scoreB += 10;
      if (followedChannels.includes(b.channelName)) scoreB += 5;
      if (b.targetProvince === 'All') scoreB += 1;
      return scoreB - scoreA; 
    });
  }, [allVideos, province, activeTab, followedChannels]);

  const getWatermarkPositionClass = (pos) => {
    switch (pos) {
      case 'top-left': return 'top-20 left-4';
      case 'top-right': return 'top-20 right-16'; 
      case 'bottom-left': return 'bottom-40 left-4';
      case 'bottom-right': return 'bottom-40 right-16'; 
      default: return 'bottom-40 right-16';
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-[var(--app-bg)] overflow-hidden" style={{ fontFamily: 'var(--font-family)' }}>
      <style>{`
        .media-scroll-area::-webkit-scrollbar { display: none; }
        .media-scroll-area { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes text-slide {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-text-slide {
          display: inline-block;
          animation: text-slide 6s linear infinite;
        }
      `}</style>

      <div className="flex-1 w-full relative overflow-hidden bg-black">
        <div className="absolute top-0 left-0 w-full z-20 flex justify-between items-center px-4 py-4 bg-gradient-to-b from-[var(--app-bg)] to-transparent pointer-events-none">
          <div className="flex items-center gap-1 cursor-pointer pointer-events-auto">
            <Tv size={22} className="text-[var(--icon-active)]" />
            <span className="text-[var(--text-heading)] font-bold text-sm tracking-widest">LIVE</span>
            <div className="ml-2 flex items-center gap-1 bg-[var(--card-bg)]/60 backdrop-blur-sm border border-[var(--icon-active)]/30 px-2 py-0.5 rounded-full text-[var(--icon-active)]">
              <MapPin size={12} />
              <span className="text-[10px] font-bold tracking-wide">{province}</span>
            </div>
          </div>
          
          <div className="flex gap-4 font-bold text-sm pointer-events-auto">
            <span 
              onClick={() => setActiveTab('Following')}
              className={`cursor-pointer transition ${activeTab === 'Following' ? 'text-[var(--text-heading)] relative flex flex-col items-center' : 'text-[var(--icon-inactive)] hover:text-[var(--text-heading)]'}`}
            >
              Following
              {activeTab === 'Following' && <div className="absolute -bottom-2 w-6 h-1 bg-[var(--icon-active)] rounded-full" style={{ boxShadow: '0 0 8px var(--icon-active)' }}></div>}
            </span>
            <span 
              onClick={() => setActiveTab('ForYou')}
              className={`cursor-pointer transition ${activeTab === 'ForYou' ? 'text-[var(--text-heading)] relative flex flex-col items-center' : 'text-[var(--icon-inactive)] hover:text-[var(--text-heading)]'}`}
            >
              For You
              {activeTab === 'ForYou' && <div className="absolute -bottom-2 w-6 h-1 bg-[var(--icon-active)] rounded-full" style={{ boxShadow: '0 0 8px var(--icon-active)' }}></div>}
            </span>
          </div>
          
          <div className="flex items-center gap-3 pointer-events-auto">
            <Search size={22} className="text-[var(--icon-inactive)] hover:text-[var(--icon-active)] cursor-pointer transition" />
          </div>
        </div>

        <div className="absolute inset-0 overflow-y-auto overflow-x-hidden snap-y snap-mandatory media-scroll-area">
          {displayVideos.length > 0 ? displayVideos.map((video) => (
            <div key={video.id} className={`relative h-full w-full snap-start snap-always bg-[var(--card-bg)] overflow-hidden ${fullScreenId === video.id ? 'fixed inset-0 z-[100]' : ''}`}>
              
             <video 
              src={getVideoUrl(video)}
              className="h-full w-full object-cover cursor-pointer"
              autoPlay 
              loop 
              muted={isMuted}
              playsInline
              onClick={() => setIsMuted(!isMuted)} 
                />

              {video.watermarkUrl && (
                <div className={`absolute z-10 opacity-60 pointer-events-none w-10 h-10 ${getWatermarkPositionClass(video.watermarkPos)}`}>
                  <img src={video.watermarkUrl} alt="Watermark" className="w-full h-full object-contain filter drop-shadow-lg" />
                </div>
              )}

              <button 
                onClick={() => toggleFullScreen(video.id)}
                className="absolute top-20 right-4 z-30 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:text-[var(--icon-active)] transition"
              >
                {fullScreenId === video.id ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>

              <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-[var(--app-bg)] via-[var(--app-bg)]/60 to-transparent z-0 pointer-events-none"></div>

              <div className="absolute bottom-4 left-3 z-10 flex flex-col items-start max-w-[70%]">
                <button 
                  onClick={() => setShowCart(true)}
                  className="flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--icon-active)] text-[var(--icon-active)] px-3 py-1.5 rounded-lg mb-3 hover:scale-105 transition shadow-lg"
                >
                  <ShoppingCart size={16} />
                  <span className="text-xs font-bold tracking-wider">ตะกร้าสินค้า 9Plus</span>
                </button>

                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-[15px] text-[var(--text-heading)] drop-shadow-md truncate">@{video.channelName}</h3>
                  <span className="text-[9px] font-bold bg-[var(--icon-active)] text-[var(--app-bg)] px-1.5 py-0.5 rounded-sm whitespace-nowrap">
                    {video.tier}
                  </span>
                  {!followedChannels.includes(video.channelName) && (
                    <button 
                      onClick={() => toggleFollow(video.channelName)}
                      className="ml-2 bg-[var(--icon-active)] text-[var(--app-bg)] px-2 py-0.5 rounded text-[10px] font-bold hover:scale-105 transition shadow-md"
                    >
                      ติดตาม
                    </button>
                  )}
                </div>
                
                <p className="text-[13px] mb-3 line-clamp-2 text-[var(--text-heading)] drop-shadow-md opacity-90 w-full pr-2">{video.caption}</p>
                
                <div className="flex items-center gap-2 text-xs font-medium w-full">
                  <Music size={14} className="text-[var(--icon-active)] animate-pulse shrink-0" />
                  <div className="flex-1 overflow-hidden whitespace-nowrap mask-image-fade">
                    <p className="animate-text-slide text-[var(--icon-inactive)]">{video.sound}</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 right-3 z-10 flex flex-col items-center gap-4 w-[50px]">
                <div 
                  className="relative mb-2 cursor-pointer hover:scale-105 transition"
                  onClick={() => setCurrentScreen('create_media')} 
                >
                  <div className="w-10 h-10 rounded-full border-2 border-[var(--icon-active)] p-0.5 bg-[var(--card-bg)] overflow-hidden">
                    {myAvatar ? (
                      <img src={myAvatar} alt="My Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <img src={video.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    )}
                  </div>
                  {!followedChannels.includes(video.channelName) && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        toggleFollow(video.channelName);
                      }}
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[var(--icon-active)] text-[var(--app-bg)] rounded-full p-0.5 hover:scale-110 transition active:scale-95 shadow-md"
                    >
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  )}
                </div>

                <div className="flex flex-col items-center gap-0.5 cursor-pointer">
                  <div className="active:scale-90 transition p-1">
                    <Heart size={28} className="text-[var(--icon-inactive)] hover:text-[var(--icon-active)] transition-colors drop-shadow-md" />
                  </div>
                  <span className="text-[10px] font-semibold text-[var(--icon-inactive)]">{video.likes}</span>
                </div>

                <div className="flex flex-col items-center gap-0.5 cursor-pointer">
                  <div className="active:scale-90 transition p-1">
                    <MessageCircle size={28} className="text-[var(--icon-inactive)] hover:text-[var(--icon-active)] transition-colors drop-shadow-md" />
                  </div>
                  <span className="text-[10px] font-semibold text-[var(--icon-inactive)]">{video.comments}</span>
                </div>

                <div className="flex flex-col items-center gap-0.5 cursor-pointer">
                  <div className="active:scale-90 transition p-1">
                    <Share2 size={28} className="text-[var(--icon-inactive)] hover:text-[var(--icon-active)] transition-colors drop-shadow-md" />
                  </div>
                  <span className="text-[10px] font-semibold text-[var(--icon-inactive)]">{video.shares}</span>
                </div>
              </div>

            </div>
          )) : (
            <div className="flex items-center justify-center h-full text-[var(--icon-inactive)] flex-col gap-2">
              <Tv size={48} className="opacity-20" />
              <p>ยังไม่มีวิดีโอในขณะนี้</p>
            </div>
          )}
        </div>
      </div>

      {showCart && (
        <div className="absolute inset-0 z-50 bg-[var(--app-bg)]/80 backdrop-blur-sm flex items-end justify-center">
          <div className="w-full h-2/3 bg-[var(--card-bg)] border-t border-[var(--border-color)] rounded-t-2xl p-4 text-[var(--text-heading)] shadow-[var(--nav-shadow)] flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b border-[var(--border-color)] pb-3">
              <h3 className="font-bold text-base">ตะกร้าสินค้า 9Plus</h3>
              <button onClick={() => setShowCart(false)} className="p-1.5 rounded-full bg-[var(--app-bg)] hover:bg-[var(--icon-inactive)]/20 transition">
                <X size={18} className="text-[var(--text-heading)]" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pb-4">
              <div className="flex items-center gap-3 bg-[var(--app-bg)] p-3 rounded-xl border border-[var(--border-color)] shadow-[var(--card-shadow)]">
                <div className="w-14 h-14 bg-[var(--card-bg)] rounded-lg shrink-0 flex items-center justify-center text-xs border border-[var(--icon-active)]/30">
                  <ShoppingCart size={20} className="text-[var(--icon-active)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-[var(--text-heading)]">M-CHAT Enterprise</p>
                  <p className="text-xs text-[var(--icon-active)] mt-1">$100.00 / เดือน</p>
                </div>
                <button className="bg-[var(--icon-active)] text-[var(--app-bg)] px-4 py-1.5 rounded-lg text-xs font-bold hover:scale-105 transition">สั่งซื้อ</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="shrink-0 w-full z-30 bg-[var(--app-bg)] border-t border-[var(--border-color)] pb-safe">
        <BottomNav 
          activeMenu="media" 
          setCurrentScreen={setCurrentScreen} 
          onMenuChange={onMenuChange} 
        />
      </div>

    </div>
  );
}