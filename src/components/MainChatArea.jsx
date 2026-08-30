import { MessageSquare } from 'lucide-react';

export default function MainChatArea() {
  return (
    // ซ่อนในจอมือถือ (hidden), แสดงผลเฉพาะจอ md (แท็บเล็ต) ขึ้นไป (md:flex)
    <div className="hidden md:flex flex-col items-center justify-center w-full h-full bg-gray-900 border-l border-gray-800">
      <MessageSquare size={64} className="text-gray-600 mb-4" />
      <h2 className="text-2xl text-gray-400 font-light">M-CHAT for Web</h2>
      <p className="text-sm text-gray-500 mt-2">Send and receive messages without keeping your phone online.</p>
    </div>
  );
}