import React, { useState } from 'react';
import { 
  X, Music, RefreshCw, Wand2, Sparkles, ChevronDown, 
  Play, Circle, Smartphone, Gamepad2, Image as ImageIcon
} from 'lucide-react';

export default function CameraStudio({ setCurrentScreen }) {
  // โหมดหลัก: 'POST', 'CREATE', 'LIVE'
  const [mainMode, setMainMode] = useState('CREATE');
  
  // โหมดย่อยสำหรับ CREATE (เวลาถ่ายวิดีโอ)
  const [recordMode, setRecordMode] = useState('15s');
  
  // โหมดย่อยสำหรับ LIVE
  const [liveMode, setLiveMode] = useState('Device camera');

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#111] text-white relative overflow-hidden font-sans">
      
      {/* 1. พื้นหลังจำลองกล้อง */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black z-0"></div>

      {/* 2. ส่วนหัว (Top Bar) */}
      <div className="absolute top-0 w-full z-20 flex justify-between items-start p-6">
        <button onClick={() => setCurrentScreen('create_media')} className="p-2 hover:bg-white/10 rounded-full transition">
          <X size={28} />
        </button>
        
        {mainMode === 'CREATE' ? (
          <button className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-semibold mt-1">
            <Music size={16} /> Add sound
          </button>
        ) : mainMode === 'LIVE' ? (
          <button className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-semibold mt-1">
            <Play size={16} /> Check LIVE access
          </button>
        ) : (
          <div></div>
        )}

        {/* แถบเครื่องมือขวา (เฉพาะ CREATE) */}
        {mainMode === 'CREATE' && (
          <div className="flex flex-col gap-5 items-center mt-1">
            <div className="flex flex-col items-center gap-1 cursor-pointer"><RefreshCw size={24} /><span className="text-[10px]">Flip</span></div>
            <div className="flex flex-col items-center gap-1 cursor-pointer"><Wand2 size={24} /><span className="text-[10px]">Beautify</span></div>
            <div className="flex flex-col items-center gap-1 cursor-pointer"><Sparkles size={24} /><span className="text-[10px]">Effects</span></div>
            <div className="flex flex-col items-center gap-1 cursor-pointer bg-white/20 p-1.5 rounded-full mt-2"><ChevronDown size={20} /></div>
          </div>
        )}
      </div>

      {/* 3. ส่วนควบคุมตรงกลางและล่าง */}
      <div className="absolute bottom-[80px] w-full z-20 flex flex-col items-center">
        
        {/* --- UI สำหรับโหมด CREATE --- */}
        {mainMode === 'CREATE' && (
          <>
            {/* ตัวเลือกเวลาถ่าย */}
            <div className="flex gap-6 overflow-x-auto px-4 mb-6 text-sm font-semibold text-gray-300 w-full justify-center hide-scrollbar">
              {['10m', '60s', '15s', 'PHOTO', 'TEXT'].map((mode) => (
                <span 
                  key={mode} 
                  onClick={() => setRecordMode(mode)}
                  className={`cursor-pointer transition-all ${recordMode === mode ? 'text-white bg-white/20 px-3 py-1 rounded-full' : 'py-1'}`}
                >
                  {mode}
                </span>
              ))}
            </div>

            {/* ปุ่มถ่ายและ Gallery */}
            <div className="flex items-center justify-center gap-8 w-full px-8 mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center overflow-hidden border border-white/30">
                <ImageIcon size={20} />
              </div>
              <div className="w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center p-1 cursor-pointer">
                <div className="w-full h-full bg-white rounded-full"></div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center overflow-hidden border border-white/30">
                <img src="https://placehold.co/100" alt="Gallery" className="w-full h-full object-cover" />
              </div>
            </div>
          </>
        )}

        {/* --- UI สำหรับโหมด LIVE --- */}
        {mainMode === 'LIVE' && (
          <div className="w-full px-6 flex flex-col items-center mb-6">
            <div className="flex justify-center gap-12 w-full mb-8">
              <div className="flex flex-col items-center gap-1 cursor-pointer"><RefreshCw size={24} /><span className="text-xs">Flip</span></div>
              <div className="flex flex-col items-center gap-1 cursor-pointer"><Wand2 size={24} /><span className="text-xs">Beautify</span></div>
              <div className="flex flex-col items-center gap-1 cursor-pointer"><Sparkles size={24} /><span className="text-xs">Effects</span></div>
            </div>

            <div className="w-full bg-black/40 backdrop-blur-md rounded-2xl p-4 flex justify-between items-center mb-6">
              <div className="flex flex-col">
                <span className="font-bold text-sm">Try practice mode</span>
                <span className="text-[11px] text-gray-400">This mode is only visible to you</span>
              </div>
              <button className="bg-white/20 border border-white/30 px-4 py-1.5 rounded-full text-sm font-bold">Go</button>
            </div>

            <button className="w-full bg-[#ff3b5c] text-white font-bold py-4 rounded-full text-lg mb-6 shadow-lg shadow-red-500/20 active:scale-95 transition">
              Go LIVE
            </button>

            <div className="flex gap-6 text-sm font-semibold text-gray-400">
              <span onClick={() => setLiveMode('Device camera')} className={`flex items-center gap-1.5 cursor-pointer ${liveMode === 'Device camera' ? 'text-white' : ''}`}>
                <Smartphone size={16} /> Device camera
              </span>
              <span onClick={() => setLiveMode('Mobile gaming')} className={`flex items-center gap-1.5 cursor-pointer ${liveMode === 'Mobile gaming' ? 'text-white' : ''}`}>
                <Gamepad2 size={16} /> Mobile gaming
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 4. เมนูหลักล่างสุด (POST, CREATE, LIVE) */}
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

    </div>
  );
}