import React from 'react';
import { X, Image, Scissors, Type, Smile, Frame, Plus, Inbox, Search, Play } from 'lucide-react';

export default function CreateMedia({ setCurrentScreen }) {
  // เมนูเครื่องมือด้านบน
  const tools = [
    { icon: Image, label: 'Photo editor' },
    { icon: Scissors, label: 'AutoCut' },
    { icon: Type, label: 'Captions' },
    { icon: Smile, label: 'AI Self' },
    { icon: Frame, label: 'Cutout' },
  ];

  const tabs = ['For You', 'Viral Song', 'Trendy', 'AI', 'Monthly Recap'];

  // ข้อมูลจำลองสำหรับ Templates อิงตามภาพที่ 2
  const templates = [
    { id: 1, img: 'https://placehold.co/300x400/3E2704/FFFFFF?text=Template+1', title: 'อายุขนาดนี้แล้ว', uses: '128.9K videos' },
    { id: 2, img: 'https://placehold.co/300x400/1e130c/FFFFFF?text=Template+2', title: 'จงมีความสุขกับชีวิต', uses: '109.8K videos' },
    { id: 3, img: 'https://placehold.co/300x400/6B7280/FFFFFF?text=Template+3', title: 'ความสุขที่พอดี', uses: '50K videos' },
    { id: 4, img: 'https://placehold.co/300x400/3B82F6/FFFFFF?text=Template+4', title: 'Life is a journey', uses: '12K videos' },
  ];

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[var(--app-bg)] text-[var(--text-heading)]" style={{ fontFamily: 'var(--font-family)' }}>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button onClick={() => setCurrentScreen('media')} className="p-1 hover:bg-[var(--card-bg)] rounded-full transition">
          <X size={24} className="text-[var(--text-heading)]" />
        </button>
        <h1 className="text-lg font-bold tracking-widest">CREATE</h1>
        <div className="w-8"></div> {/* Placeholder เพื่อให้คำว่า CREATE อยู่ตรงกลางพอดี */}
      </div>

      {/* แถบเครื่องมือ Icons (Photo editor, AutoCut, etc.) */}
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

      {/* ปุ่มหลัก New Video & Drafts */}
      <div className="flex gap-3 px-4 py-6">
        <button className="flex-1 bg-white text-black rounded-xl py-3 flex flex-col items-center justify-center font-bold hover:scale-[1.02] transition shadow-lg">
          <Plus size={24} className="mb-0.5" strokeWidth={3} />
          New video
        </button>
        <button className="w-20 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl py-3 flex flex-col items-center justify-center font-bold hover:bg-[var(--border-color)] transition shadow-sm">
          <Inbox size={20} className="mb-1 text-[var(--text-heading)]" />
          <span className="text-[11px] text-[var(--text-heading)]">Drafts</span>
        </button>
      </div>

      {/* Templates Section Header */}
      <div className="flex justify-between items-center px-4 mt-2 mb-3">
        <h2 className="text-lg font-bold">Templates</h2>
        <Search size={22} className="text-[var(--icon-inactive)] hover:text-[var(--text-heading)] transition cursor-pointer" />
      </div>

      {/* Tabs เลื่อนซ้ายขวา */}
      <div className="flex gap-5 px-4 overflow-x-auto pb-2 mb-2" style={{ scrollbarWidth: 'none' }}>
        {tabs.map((tab, idx) => (
          <span key={idx} className={`whitespace-nowrap text-sm cursor-pointer transition-colors ${idx === 0 ? 'text-[var(--text-heading)] font-bold border-b-2 border-[var(--text-heading)] pb-1' : 'text-[var(--icon-inactive)] hover:text-[var(--text-heading)]'}`}>
            {tab}
          </span>
        ))}
      </div>

      {/* Grid รูปภาพ Templates */}
      <div className="flex-1 overflow-y-auto px-4 pb-10" style={{ scrollbarWidth: 'none' }}>
        <div className="grid grid-cols-2 gap-3">
          {templates.map(tpl => (
            <div key={tpl.id} className="relative rounded-xl overflow-hidden aspect-[3/4] group cursor-pointer border border-[var(--border-color)] shadow-md">
              <img src={tpl.img} alt={tpl.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              
              {/* ไล่สีดำจากข้างล่างเพื่อให้ตัวหนังสือชัดเจนขึ้น */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                <h3 className="text-sm font-bold text-white drop-shadow-md line-clamp-2">{tpl.title}</h3>
                <div className="flex items-center gap-1 text-[10px] text-gray-300 mt-1">
                  <Play size={10} className="fill-current" />
                  <span>{tpl.uses}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}