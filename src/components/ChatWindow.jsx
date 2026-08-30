import { ArrowLeft, Phone, Video, MoreVertical, Plus, Camera, Mic, Send } from 'lucide-react';
import { useState } from 'react';

export default function ChatWindow({ chat, onBack, onChatInteract, isMobileOrTablet }) {
  const [messageText, setMessageText] = useState('');

  if (!chat) return null;

  return (
    <div 
       className="flex flex-col w-full h-full bg-[var(--app-bg)]"
       onClick={onChatInteract}
    >
      
      {/* --- Header --- */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)] bg-[var(--nav-bg)]">
        <div className="flex items-center gap-3">
          {isMobileOrTablet && (
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                onBack(); 
              }}
              className="text-[var(--icon-color)] hover:text-[var(--nav-text)] mr-1 transition p-1"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          
          <img src={chat.imageUrl || "https://via.placeholder.com/40"} alt={chat.name} className="w-10 h-10 rounded-full object-cover" />
          <h2 className="font-semibold text-[var(--nav-text)]">{chat.name}</h2>
        </div>
        
        <div className="flex items-center gap-4 text-[var(--icon-color)]">
          <Phone size={20} className="hover:text-[var(--icon-active)] cursor-pointer transition" />
          <Video size={20} className="hover:text-[var(--icon-active)] cursor-pointer transition" />
          <MoreVertical size={20} className="hover:text-[var(--icon-active)] cursor-pointer transition" />
        </div>
      </div>
      
      {/* --- Chat Messages Area --- */}
      <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-start gap-3 mt-4">
              <div className="bg-[var(--nav-bg)] text-[var(--nav-text)] p-3 rounded-2xl rounded-tl-none max-w-md text-sm border border-[var(--border-color)] shadow-sm">
                  กำลังออกแบบโครงสร้างครับ
              </div>
          </div>
      </div>

      {/* --- Input Area --- */}
      <div 
        className="px-4 py-3 bg-[var(--nav-bg)] border-t border-[var(--border-color)] flex items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
         <button className="text-[var(--icon-color)] hover:text-[var(--nav-text)] transition flex-shrink-0 p-1">
            <Plus size={24} />
         </button>
         
         <div className="flex-1 bg-[var(--desktop-bg)] rounded-full px-4 py-2 flex items-center border border-[var(--border-color)] focus-within:border-[var(--icon-active)] transition">
             <input 
                type="text" 
                placeholder="Type a message" 
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onFocus={onChatInteract}
                className="flex-1 bg-transparent text-[var(--nav-text)] outline-none text-sm placeholder-[var(--icon-color)]"
             />
         </div>

         <button className="text-[var(--icon-color)] hover:text-[var(--nav-text)] transition flex-shrink-0 p-1">
             <Camera size={24} />
         </button>

         {messageText.trim() === '' ? (
             <button className="text-[var(--icon-color)] hover:text-[var(--nav-text)] transition flex-shrink-0 p-1">
                 <Mic size={24} />
             </button>
         ) : (
             <button className="text-[var(--icon-active)] hover:text-[var(--nav-text)] transition flex-shrink-0 p-1">
                 <Send size={24} />
             </button>
         )}
      </div>
      
    </div>
  );
}