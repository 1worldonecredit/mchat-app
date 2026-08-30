export default function FriendCard({ name, message, time, imageUrl, onClick }) {
  return (
    // เพิ่ม onClick={onClick} ตรง div หลัก เพื่อให้คลิกแล้วส่งข้อมูลกลับไปที่ App.jsx
    <div 
      onClick={onClick}
      className="flex items-center gap-4 p-4 border-b border-gray-800 hover:bg-gray-800 cursor-pointer transition-colors active:bg-gray-700"
    >
      <img src={imageUrl} alt={name} className="w-12 h-12 rounded-full object-cover border border-gray-700" />
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-semibold truncate">{name}</h3>
        <p className="text-gray-400 text-sm truncate">{message}</p>
      </div>
      <span className="text-xs text-gray-500 whitespace-nowrap">{time}</span>
    </div>
  );
}