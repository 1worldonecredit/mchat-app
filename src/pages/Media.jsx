import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, Music, Plus, Search } from 'lucide-react';

export default function Media() {
  // ข้อมูลจำลอง (เรียงลำดับจาก Backend ตามราคาแพ็กเกจ)
  const [videos] = useState([
    {
      id: 1,
      channelName: 'CEO_9Plus',
      tier: 'Platinum ($100)',
      caption: 'วิสัยทัศน์องค์กรปีนี้ ก้าวสู่ระดับโลก 🚀 #9Plus',
      sound: 'Original Sound - CEO_9Plus',
      likes: '45.2K',
      comments: '1,204',
      bookmarks: '3.1K',
      shares: '8,500',
      avatar: 'https://via.placeholder.com/150',
      cloudflareUrl: 'https://customer-a6fkepv8ox.../manifest/video.mp4' 
    },
    {
      id: 2,
      channelName: 'Marketing_Pro',
      tier: 'Gold ($50)',
      caption: 'เทคนิคการหาลูกค้าผ่านระบบ ERP 💡 #MarketingTips',
      sound: 'Trending Music 01',
      likes: '12K',
      comments: '450',
      bookmarks: '1.2K',
      shares: '600',
      avatar: 'https://via.placeholder.com/150',
      cloudflareUrl: 'https://customer-a6fkepv8ox.../manifest/video2.mp4' 
    }
  ]);

  return (
    // ความสูงเต็มจอ หักลบ Bottom Navbar ของระบบออก
    <div className="h-[calc(100dvh-80px)] w-full bg-[var(--app-bg)] overflow-y-scroll snap-y snap-mandatory hide-scrollbar relative font-sans" style={{ fontFamily: 'var(--font-family)' }}>
      
      {/* Top Header - ใช้ Glass Surface แบบเดียวกับหน้า Profile */}
      <div className="absolute top-0 left-0 w-full z-20 flex justify-between items-center px-6 py-4 bg-[var(--glass-surface)] backdrop-blur-xl border-b border-[var(--border-color)]">
        <div className="w-6"></div> {/* Spacer */}
        <div className="flex gap-6 font-bold text-sm">
          <span className="text-[var(--icon-inactive)] hover:text-[var(--text-heading)] cursor-pointer transition">Following</span>
          <span className="text-[var(--text-heading)] relative cursor-pointer flex flex-col items-center">
            For You
            <div className="absolute -bottom-2 w-4 h-1 bg-[var(--icon-active)] rounded-full"></div>
          </span>
        </div>
        <Search size={20} className="text-[var(--icon-inactive)] hover:text-[var(--icon-active)] cursor-pointer transition" />
      </div>

      {/* Video Feed Loop */}
      {videos.map((video) => (
        <div key={video.id} className="relative h-full w-full snap-start snap-always bg-black">
          
          {/* Cloudflare Video Player */}
          <video 
            src={video.cloudflareUrl}
            className="h-full w-full object-cover"
            autoPlay 
            loop 
            muted 
            playsInline
          />

          {/* เงาดำไล่ระดับด้านล่าง เพื่อให้ตัวหนังสืออ่านง่ายเมื่อวิดีโอสว่าง */}
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/80 to-transparent z-0 pointer-events-none"></div>

          {/* ข้อมูลด้านซ้ายล่าง */}
          <div className="absolute bottom-6 left-4 w-3/4 z-10 text-white">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-lg drop-shadow-md">@{video.channelName}</h3>
              {/* Badge แพ็กเกจ ใช้สีส้มเพื่อให้เด่น */}
              <span className="text-[10px] font-medium bg-orange-500/20 border border-orange-500/50 text-orange-400 px-2 py-0.5 rounded-full backdrop-blur-sm">
                {video.tier}
              </span>
            </div>
            <p className="text-sm mb-3 line-clamp-2 drop-shadow-md text-gray-200">{video.caption}</p>
            
            <div className="flex items-center gap-2 text-xs font-medium bg-[var(--glass-surface)] w-fit px-3 py-1.5 rounded-full border border-[var(--border-color)] backdrop-blur-md">
              <Music size={14} className="text-[var(--icon-active)] animate-pulse" />
              <div className="w-32 overflow-hidden whitespace-nowrap text-[var(--text-heading)]">
                <p className="animate-marquee">{video.sound}</p>
              </div>
            </div>
          </div>

          {/* แถบเครื่องมือด้านขวา (ใช้ Glass UI ของ M-CHAT) */}
          <div className="absolute bottom-6 right-4 flex flex-col items-center gap-5 z-10">
            
            {/* Profile Pic */}
            <div className="relative mb-2">
              <div className="w-12 h-12 rounded-full border-2 border-[var(--icon-active)] bg-[var(--card-bg)] p-0.5 overflow-hidden shadow-lg">
                <img src={video.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
              </div>
              <button className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[var(--icon-active)] rounded-full p-1 text-white shadow-md hover:scale-110 transition">
                <Plus size={12} strokeWidth={3} />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col items-center gap-1 group">
              <button className="p-3 bg-[var(--glass-surface)] border border-[var(--border-color)] rounded-full backdrop-blur-md text-[var(--icon-inactive)] group-hover:text-red-500 transition shadow-sm">
                <Heart size={24} className="group-hover:fill-red-500" />
              </button>
              <span className="text-[10px] font-bold text-white drop-shadow-md">{video.likes}</span>
            </div>

            <div className="flex flex-col items-center gap-1 group">
              <button className="p-3 bg-[var(--glass-surface)] border border-[var(--border-color)] rounded-full backdrop-blur-md text-[var(--icon-inactive)] group-hover:text-[var(--icon-active)] transition shadow-sm">
                <MessageCircle size={24} className="group-hover:fill-[var(--icon-active)]" />
              </button>
              <span className="text-[10px] font-bold text-white drop-shadow-md">{video.comments}</span>
            </div>

            <div className="flex flex-col items-center gap-1 group">
              <button className="p-3 bg-[var(--glass-surface)] border border-[var(--border-color)] rounded-full backdrop-blur-md text-[var(--icon-inactive)] group-hover:text-yellow-500 transition shadow-sm">
                <Bookmark size={24} className="group-hover:fill-yellow-500" />
              </button>
              <span className="text-[10px] font-bold text-white drop-shadow-md">{video.bookmarks}</span>
            </div>

            <div className="flex flex-col items-center gap-1 group">
              <button className="p-3 bg-[var(--glass-surface)] border border-[var(--border-color)] rounded-full backdrop-blur-md text-[var(--icon-inactive)] group-hover:text-blue-500 transition shadow-sm">
                <Share2 size={24} />
              </button>
              <span className="text-[10px] font-bold text-white drop-shadow-md">{video.shares}</span>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}