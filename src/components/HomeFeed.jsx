import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import '../HomeFeed.css';

export default function HomeFeed() {
  // Mockup ข้อมูลเพื่อนที่กำลังออนไลน์ (Stories)
  const onlineFriends = [
    'https://via.placeholder.com/150/111827/ffffff?text=1',
    'https://via.placeholder.com/150/1f2937/ffffff?text=2',
    'https://via.placeholder.com/150/374151/ffffff?text=3',
    'https://via.placeholder.com/150/111827/ffffff?text=4',
    'https://via.placeholder.com/150/1f2937/ffffff?text=5',
  ];

  return (
    <div className="home-feed-container">
      
      {/* แถบสถานะ/เพื่อนออนไลน์ */}
      <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {onlineFriends.map((img, idx) => (
          <div key={idx} className="story-ring">
            <img src={img} alt="story" className="story-avatar" />
          </div>
        ))}
      </div>

      {/* Glass Card Mockup 1 */}
      <div className="glass-feed-card">
        {/* Header (ไม่มีตัวหนังสือคำว่า "ตั้งค่า" หรือ "เพิ่มเติม" ใช้ Icon 3 จุดแทน) */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src="https://placehold.co/40x40/png" className="w-10 h-10 rounded-full object-cover" alt="user" />
            <div className="w-24 h-3 bg-[var(--icon-color)] opacity-20 rounded-full"></div>
          </div>
          <button className="feed-action-btn"><MoreHorizontal size={20} /></button>
        </div>

        {/* Content Image (รูปหลัก) */}
        <div className="w-full h-64 bg-[var(--desktop-bg)] rounded-xl mb-4 overflow-hidden border border-[var(--border-color)]">
           <img src="https://via.placeholder.com/600x400/1f2937/ffffff?text=Space+UI" className="w-full h-full object-cover opacity-80" alt="feed" />
        </div>

        {/* Action Bar (Icon ล้วน ไม่มีตัวหนังสือ) */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button className="feed-action-btn"><Heart size={24} /></button>
            <button className="feed-action-btn"><MessageCircle size={24} /></button>
            <button className="feed-action-btn"><Send size={24} /></button>
          </div>
          <button className="feed-action-btn"><Bookmark size={24} /></button>
        </div>
      </div>

    </div>
  );
}