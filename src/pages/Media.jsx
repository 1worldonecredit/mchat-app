import React, { useState } from 'react';
import { 
  Heart, MessageCircle, Share2, Music, Plus, 
  Search, Tv, ShoppingCart, X 
} from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function Media({ setCurrentScreen }) {
  const [showCart, setShowCart] = useState(false);
const [videos] = useState([
    {
      id: 1,
      channelName: 'CEO_9Plus',
      tier: 'Platinum ($100)',
      caption: 'วิสัยทัศน์องค์กรปีนี้ ก้าวสู่ระดับโลก 🚀 #9Plus',
      sound: 'Original Sound - CEO_9Plus',
      likes: '45.2K',
      comments: '1,204',
      shares: '8,500',
      avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', // เปลี่ยนเป็นลิงก์รูปจริง
      cloudflareUrl: 'https://ลิงก์วิดีโอจริงจาก_Cloudflare_ของคุณ.mp4' 
    },
    // เพิ่มคลิปที่ 2 ด้านล่างนี้เพื่อทดสอบการไถหน้าจอ
    {
      id: 2,
      channelName: 'Marketing_Pro',
      tier: 'Gold ($50)',
      caption: 'เทคนิคการหาลูกค้าผ่านระบบอัจฉริยะ 💡 #MarketingTips',
      sound: 'Trending Music 01',
      likes: '12K',
      comments: '450',
      shares: '600',
      avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      cloudflareUrl: 'https://ลิงก์วิดีโอจริงจาก_Cloudflare_คลิปที่2.mp4' 
    }
  ]);

  return (
    // กล่องหลักใช้ h-full เพื่อดึงความสูง 100vh จาก #root มาพอดีจอ ไม่ทะลุ
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

      {/* โซนวิดีโอ ใช้ flex-1 เพื่อกินพื้นที่ด้านบนทั้งหมด และหยุดพอดีก่อนถึง BottomNav */}
      <div className="flex-1 w-full relative overflow-hidden bg-black">
        
        {/* Top Navbar */}
        <div className="absolute top-0 left-0 w-full z-20 flex justify-between items-center px-4 py-4 bg-gradient-to-b from-[var(--app-bg)] to-transparent pointer-events-none">
          <div className="flex items-center gap-1 cursor-pointer pointer-events-auto">
            <Tv size={22} className="text-[var(--icon-active)]" />
            <span className="text-[var(--text-heading)] font-bold text-sm tracking-widest">LIVE</span>
          </div>
          
          <div className="flex gap-4 font-bold text-sm pointer-events-auto">
            <span className="text-[var(--icon-inactive)] hover:text-[var(--text-heading)] cursor-pointer transition">Following</span>
            <span className="text-[var(--text-heading)] relative cursor-pointer flex flex-col items-center">
              For You
              <div className="absolute -bottom-2 w-6 h-1 bg-[var(--icon-active)] rounded-full" style={{ boxShadow: '0 0 8px var(--icon-active)' }}></div>
            </span>
          </div>
          
          <Search size={22} className="text-[var(--icon-inactive)] hover:text-[var(--icon-active)] cursor-pointer transition pointer-events-auto" />
        </div>

        {/* กล่อง Scroll ไถวิดีโอ */}
        <div className="absolute inset-0 overflow-y-auto overflow-x-hidden snap-y snap-mandatory media-scroll-area">
          {videos.map((video) => (
            // แต่ละคลิปสูงเต็ม flex-1 พอดี
            <div key={video.id} className="relative h-full w-full snap-start snap-always bg-[var(--card-bg)] overflow-hidden">
              
              <video 
                src={video.cloudflareUrl}
                className="h-full w-full object-cover"
                autoPlay 
                loop 
                muted 
                playsInline
              />

              <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-[var(--app-bg)] via-[var(--app-bg)]/60 to-transparent z-0 pointer-events-none"></div>

              {/* เนื้อหาฝั่งซ้าย - ล็อกความกว้าง (max-w-[70%]) ไม่ให้ชนไอคอนขวา และอิงจากขอบซ้าย (left-3) */}
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
                </div>
                
                <p className="text-[13px] mb-3 line-clamp-2 text-[var(--text-heading)] drop-shadow-md opacity-90 w-full pr-2">{video.caption}</p>
                
                <div className="flex items-center gap-2 text-xs font-medium w-full">
                  <Music size={14} className="text-[var(--icon-active)] animate-pulse shrink-0" />
                  <div className="flex-1 overflow-hidden whitespace-nowrap mask-image-fade">
                    <p className="animate-text-slide text-[var(--icon-inactive)]">{video.sound}</p>
                  </div>
                </div>
              </div>

              {/* เมนูฝั่งขวา - อิงจากขอบขวา (right-3) แน่นอน ไม่ตกขอบ */}
              <div className="absolute bottom-4 right-3 z-10 flex flex-col items-center gap-4 w-[50px]">
                <div className="relative mb-2">
                  <div className="w-10 h-10 rounded-full border-2 border-[var(--icon-active)] p-0.5 bg-[var(--card-bg)]">
                    <img src={video.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <button className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[var(--icon-active)] text-[var(--app-bg)] rounded-full p-0.5">
                    <Plus size={14} strokeWidth={3} />
                  </button>
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
          ))}
        </div>
      </div>

      {/* Mockup ตะกร้าสินค้า */}
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

      {/* โซน BottomNav ยึดท้ายสุดของ flex col */}
      <div className="shrink-0 w-full z-30 bg-[var(--app-bg)] border-t border-[var(--border-color)]">
        <BottomNav setCurrentScreen={setCurrentScreen} />
      </div>

    </div>
  );
}