import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, LogOut, Settings, Lock, Edit2, Camera, ShieldCheck, AlertCircle, X, Check, CreditCard, Mail, Phone, User as UserIcon, Network, Briefcase, GraduationCap, MapPin, Users, HeartPulse, Shield, Loader2, PlayCircle} from 'lucide-react';
import { fetchUserProfile, updateUserProfile, uploadUserImage } from '../utils/apiProfile'; 

export default function Profile({ onBack, onLogout }) {
  const [userData, setUserData] = useState({
    username: '', globalId: '', nationality: '', gender: '', dob: '', idCard: '', referrer: '',
    firstName: '', lastName: '', phone: '', email: '',
    isPhoneVerified: false, isEmailVerified: false, avatarUrl: '', coverUrl: ''
  });

  // เพิ่ม State ดักจับสถานะกำลังดึงข้อมูล
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editField, setEditField] = useState(''); 
  const [editForm, setEditForm] = useState({ val1: '', val2: '' });
  const [isSaving, setIsSaving] = useState(false);

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    const userId = localStorage.getItem('currentUserId');
    if (userId) {
      loadProfileData(userId);
    }
  }, []);
const loadProfileData = async (userId) => {
    setIsLoadingProfile(true);
    try {
      const data = await fetchUserProfile(userId);
      console.log("ข้อมูลที่ได้รับจาก API:", data); // เอาไว้เช็กใน Console ว่าของมาจริงไหม
      
      if (data && data.success && data.profile) {
        const p = data.profile;
        // เซ็ตค่าตรงๆ ทับไปเลยตามที่ API ส่งมา
        setUserData({
          username: p.username || '',
          globalId: p.global_id || '',
          nationality: p.nationality || '',
          gender: p.gender || '',
          dob: p.demographics?.birth_date || '',
          referrer: p.referral?.referrer_name || 'ไม่มีผู้แนะนำ',
          
          firstName: p.first_name || '',
          lastName: p.last_name || '',
          idCard: p.id_card || '',
          phone: p.phone || '',
          email: p.email || '',
          isPhoneVerified: p.is_phone_verified || false,
          isEmailVerified: p.is_email_verified || false,
          avatarUrl: p.avatar_url || '',
          coverUrl: p.cover_url || '',
          
          friendsCount: p.stats?.friends || 0,
          followersCount: p.stats?.followers || 0,
          currentLevel: p.stats?.current_level || 1,
          accountAge: p.demographics?.account_age || ''
        });
      } else {
        console.error("โหลดข้อมูลไม่สำเร็จ โครงสร้าง API อาจผิดพลาด:", data);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const calculateCompleteness = () => {
    let score = 20; 
    if (userData.firstName && userData.lastName) score += 30;
    if (userData.phone) score += 20;
    if (userData.email) score += 20;
    if (userData.avatarUrl) score += 10;
    return score;
  };

  const handleLogoutClick = () => {
    localStorage.clear();
    sessionStorage.clear();
    if (onLogout) onLogout();
    else window.location.href = '/'; 
  };

  // 1. ฟังก์ชันเปิด Modal พร้อมดึงข้อมูลเก่ามาแสดงในช่องกรอก
  const openEditModal = (field) => {
    setEditField(field);
    if (field === 'name') setEditForm({ val1: userData.firstName, val2: userData.lastName });
    else if (field === 'phone') setEditForm({ val1: userData.phone, val2: '' });
    else if (field === 'email') setEditForm({ val1: userData.email, val2: '' });
    else if (field === 'idcard') setEditForm({ val1: userData.idCard || '', val2: '' }); // ดึงเลขบัตรมาแสดง
    setIsModalOpen(true);
  };

  // 2. ฟังก์ชันจัดเตรียมข้อมูล (Payload) เพื่อยิงไปหา API
  const handleSaveEdit = async () => {
    setIsSaving(true);
    const userId = localStorage.getItem('currentUserId');
    
    let payload = { userId, field: editField };
    if (editField === 'name') {
      payload.firstName = editForm.val1;
      payload.lastName = editForm.val2;
    } else if (editField === 'phone') {
      payload.phone = editForm.val1;
    } else if (editField === 'email') {
      payload.email = editForm.val1;
    } else if (editField === 'idcard') {
      payload.idCard = editForm.val1; // แนบเลขบัตรประชาชนไปกับ Payload
    }

    try {
      // ยิง API (ผ่าน apiProfile.js)
      const result = await updateUserProfile(payload);
      if (result.success) {
        await loadProfileData(userId); // โหลดข้อมูลใหม่มาแสดงทันที
        setIsModalOpen(false);
      }
    } catch (error) {
      alert(`อัปเดตข้อมูลล้มเหลว: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      
      // 1. โชว์พรีวิวรูปบนหน้าเว็บทันที (ไม่ให้ UI กระตุก)
      setUserData(prev => ({ 
        ...prev, 
        [type === 'avatar' ? 'avatarUrl' : 'coverUrl']: base64String 
      }));
      
      // 2. สั่งบันทึกลง Database เบื้องหลังทันที
      const userId = localStorage.getItem('currentUserId');
      if (userId) {
        try {
          const result = await uploadUserImage({ 
            userId: userId, 
            type: type, 
            imageBase64: base64String 
          });
          
          if (result.success) {
            console.log(`บันทึกรูป ${type} สำเร็จ!`); // เช็คใน Console ได้ว่าบันทึกเข้าไหม
          } else {
            alert('บันทึกรูปล้มเหลว: ' + result.message);
          }
        } catch (error) {
          console.error("บันทึกรูปภาพล้มเหลว:", error);
          alert('ไม่สามารถบันทึกรูปได้ (ขนาดไฟล์อาจใหญ่เกินไป หรือ API เชื่อมต่อไม่ได้)');
        }
      }
    };
    // เริ่มอ่านไฟล์
    reader.readAsDataURL(file);
  };


  if (isLoadingProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-[100dvh] w-full bg-[var(--app-bg)] text-[var(--icon-active)]">
        <Loader2 size={40} className="animate-spin mb-4" />
        <p className="font-bold tracking-widest text-sm text-[var(--text-heading)]">LOADING PROFILE...</p>
      </div>
    );
  }

  const formatDOBAndAge = (dateString) => {
    if (!dateString || dateString === '-') return '-';
    
    const dob = new Date(dateString);
    if (isNaN(dob)) return dateString;

    const today = new Date();
    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();

    if (months < 0 || (months === 0 && days < 0)) {
      years--;
      months += 12;
    }
    if (days < 0) {
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }

    // แปลงรูปแบบเป็น 10 ก.ค. 2520
    const formattedDate = dob.toLocaleDateString('th-TH', { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });

    return `${formattedDate} (อายุ ${years} ปี ${months} เดือน ${days} วัน)`;
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[var(--app-bg)] overflow-y-auto" style={{ fontFamily: 'var(--font-family)' }}>
      
      <div className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-[var(--glass-surface)] backdrop-blur-xl border-b border-[var(--border-color)]">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-[var(--text-heading)] hover:text-[var(--icon-active)] transition p-2 -ml-2 rounded-lg">
            <ArrowLeft size={24} />
          </button>
          <span className="text-sm text-[var(--text-heading)] font-bold">โปรไฟล์ของฉัน</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-[var(--icon-inactive)] hover:text-[var(--icon-active)] p-2 transition">
            <Settings size={20} />
          </button>
          <button onClick={handleLogoutClick} className="text-[var(--icon-inactive)] hover:text-red-500 p-2 transition">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col pb-20 w-full max-w-2xl mx-auto">
       {/* --- โซนรูปปกและรูปโปรไฟล์ --- */}
        <div className="relative w-full h-40 bg-gradient-to-r from-blue-900 to-purple-900 group">
          
          {/* 1. รูปปก (Cover) - เพิ่ม absolute inset-0 เพื่อให้แนบไปกับพื้นหลัง ไม่ดัน Layout */}
          {userData.coverUrl && (
            <img 
              src={userData.coverUrl} 
              alt="Cover" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 z-0" 
            />
          )}
          
          <button onClick={() => coverInputRef.current.click()} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition backdrop-blur-sm z-10">
            <Camera size={16} />
          </button>
          <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} />
          
          {/* 2. รูปโปรไฟล์ (Avatar) - ใช้ absolute ลอยตัวเหนือเส้นขอบปก (z-20) */}
          <div className="absolute -bottom-10 left-8 group w-24 h-24 z-20">
            <div className="w-24 h-24 rounded-full border-4 border-[var(--app-bg)] bg-[var(--card-bg)] overflow-hidden flex items-center justify-center relative shadow-md">
              {userData.avatarUrl ? (
                <img src={userData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={40} className="text-[var(--icon-inactive)]" />
              )}
            </div>
            
            <button onClick={() => avatarInputRef.current.click()} className="absolute bottom-0 right-0 bg-[var(--icon-active)] p-2 rounded-full text-white border-2 border-[var(--app-bg)] transition shadow-lg z-30">
              <Camera size={14} />
            </button>
            <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar')} />
          </div>
        </div>
        {/* --- จบโซนรูปปกและรูปโปรไฟล์ --- */}

        <div className="px-8 mt-12 mb-6">
          <h2 className="text-2xl font-bold text-[var(--text-heading)]">{userData.username}</h2>
          <div className="flex items-center gap-2 mt-1">
            <ShieldCheck size={16} className="text-orange-500" />
            <span className="text-xs text-orange-500 font-medium">@{userData.username} • Level 1</span>
          </div>
          
          <div className="mt-4 bg-[var(--card-bg)] p-3 rounded-xl border border-[var(--border-color)]">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-[var(--text-heading)] font-medium">ความสมบูรณ์ของบัญชี</span>
              <span className="text-[var(--icon-active)] font-bold">{calculateCompleteness()}%</span>
            </div>
            <div className="w-full h-2 bg-[var(--app-bg)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--icon-active)] rounded-full transition-all duration-1000" style={{ width: `${calculateCompleteness()}%` }}></div>
            </div>
          </div>
        </div>

        <div className="px-4 space-y-4">
          
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-[var(--border-color)] pb-3">
              <Lock size={16} className="text-red-500" />
              <h3 className="text-sm font-bold text-[var(--text-heading)]">ข้อมูลพื้นฐาน (เปลี่ยนไม่ได้)</h3>
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              <div>
                <p className="text-[10px] text-[var(--icon-inactive)] uppercase tracking-wider mb-1">Global ID</p>
                <p className="text-xs font-bold text-orange-500">{userData.globalId}</p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--icon-inactive)] uppercase tracking-wider mb-1">เลขบัตรประชาชน</p>
                <p className="text-xs font-medium text-[var(--text-heading)]">{userData.idCard || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--icon-inactive)] uppercase tracking-wider mb-1">วันเกิด</p>
                <p className="text-xs font-medium text-[var(--text-heading)]">
                  {formatDOBAndAge(userData.dob)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--icon-inactive)] uppercase tracking-wider mb-1">สัญชาติ / เพศ</p>
                <p className="text-xs font-medium text-[var(--text-heading)]">{userData.nationality} / {userData.gender}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-[var(--icon-inactive)] uppercase tracking-wider mb-1">ผู้แนะนำ</p>
                <p className="text-xs font-medium text-[var(--text-heading)]">{userData.referrer}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-[var(--border-color)] pb-3">
              <UserIcon size={16} className="text-[var(--icon-active)]" />
              <h3 className="text-sm font-bold text-[var(--text-heading)]">ข้อมูลส่วนบุคคล</h3>
            </div>
            
            <div className="space-y-4">
              {/* --- 1. ชื่อ-นามสกุล --- */}
              <div className="flex items-center justify-between group">
                <div>
                  <p className="text-[10px] text-[var(--icon-inactive)] uppercase tracking-wider mb-1">ชื่อ - นามสกุล</p>
                  <p className="text-sm font-medium text-[var(--text-heading)]">
                    {userData.firstName ? `${userData.firstName} ${userData.lastName}` : <span className="text-red-400 text-xs italic">ยังไม่ระบุข้อมูล</span>}
                  </p>
                </div>
                {/* ปุ่มเรียก Modal แก้ไขชื่อ */}
                <button onClick={() => openEditModal('name')} className="p-2 text-[var(--icon-inactive)] hover:text-[var(--icon-active)] transition rounded-lg bg-[var(--app-bg)] border border-[var(--border-color)]">
                  <Edit2 size={14} />
                </button>
              </div>

              {/* --- 2. เลขบัตรประชาชน (เพิ่มใหม่ตรงนี้) --- */}
              <div className="flex items-center justify-between group pt-2 border-t border-[var(--border-color)]/50">
                <div>
                  <p className="text-[10px] text-[var(--icon-inactive)] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <CreditCard size={10} /> เลขบัตรประชาชน
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[var(--text-heading)]">
                      {userData.idCard || <span className="text-red-400 text-xs italic">ยังไม่ระบุข้อมูล</span>}
                    </p>
                  </div>
                </div>
                {/* ปุ่มเรียก Modal แก้ไขบัตรประชาชน */}
                <button onClick={() => openEditModal('idcard')} className="p-2 text-[var(--icon-inactive)] hover:text-[var(--icon-active)] transition rounded-lg bg-[var(--app-bg)] border border-[var(--border-color)]">
                  <Edit2 size={14} />
                </button>
              </div>

              {/* --- 3. เบอร์โทรศัพท์ --- */}
              <div className="flex items-center justify-between group pt-2 border-t border-[var(--border-color)]/50">
                <div>
                  <p className="text-[10px] text-[var(--icon-inactive)] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Phone size={10} /> เบอร์โทรศัพท์
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[var(--text-heading)]">
                      {userData.phone || <span className="text-red-400 text-xs italic">ยังไม่ระบุข้อมูล</span>}
                    </p>
                    {userData.phone && (
                      userData.isPhoneVerified 
                        ? <CheckCircle2 size={14} className="text-green-500" />
                        : <button className="text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full border border-red-500/50 hover:bg-red-500 hover:text-white transition">ยืนยัน OTP</button>
                    )}
                  </div>
                </div>
                {/* ปุ่มเรียก Modal แก้ไขเบอร์โทร */}
                <button onClick={() => openEditModal('phone')} className="p-2 text-[var(--icon-inactive)] hover:text-[var(--icon-active)] transition rounded-lg bg-[var(--app-bg)] border border-[var(--border-color)]">
                  <Edit2 size={14} />
                </button>
              </div>

              {/* --- 4. อีเมล --- */}
              <div className="flex items-center justify-between group pt-2 border-t border-[var(--border-color)]/50">
                <div>
                  <p className="text-[10px] text-[var(--icon-inactive)] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Mail size={10} /> อีเมล
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[var(--text-heading)]">
                      {userData.email || <span className="text-red-400 text-xs italic">ยังไม่ระบุข้อมูล</span>}
                    </p>
                    {userData.email && (
                      userData.isEmailVerified 
                        ? <CheckCircle2 size={14} className="text-green-500" />
                        : <button className="text-[10px] bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded-full border border-orange-500/50 hover:bg-orange-500 hover:text-white transition">ยืนยันอีเมล</button>
                    )}
                  </div>
                </div>
                {/* ปุ่มเรียก Modal แก้ไขอีเมล */}
                <button onClick={() => openEditModal('email')} className="p-2 text-[var(--icon-inactive)] hover:text-[var(--icon-active)] transition rounded-lg bg-[var(--app-bg)] border border-[var(--border-color)]">
                  <Edit2 size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Card เมนูใหม่: สื่อ, ตั้งค่า, ออกจากระบบ */}
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-[var(--border-color)] pb-3">
              <Settings size={16} className="text-blue-500" />
              <h3 className="text-sm font-bold text-[var(--text-heading)]">เมนูและการตั้งค่า</h3>
            </div>
            
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[var(--app-bg)] transition group border border-transparent hover:border-[var(--border-color)]">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500 group-hover:scale-110 transition">
                    <PlayCircle size={18} />
                  </div>
                  <span className="text-sm font-medium text-[var(--text-heading)]">สร้างช่อง มีเดียของคุณ</span>
                </div>
                <ArrowLeft size={16} className="text-[var(--icon-inactive)] rotate-180" />
              </button>

              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[var(--app-bg)] transition group border border-transparent hover:border-[var(--border-color)]">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-500/10 p-2 rounded-lg text-gray-500 group-hover:scale-110 transition">
                    <Settings size={18} />
                  </div>
                  <span className="text-sm font-medium text-[var(--text-heading)]">การตั้งค่า (Settings)</span>
                </div>
                <ArrowLeft size={16} className="text-[var(--icon-inactive)] rotate-180" />
              </button>

              <button onClick={handleLogoutClick} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 transition group border border-transparent hover:border-red-500/30 mt-2">
                <div className="bg-red-500/10 p-2 rounded-lg text-red-500 group-hover:scale-110 transition">
                  <LogOut size={18} />
                </div>
                <span className="text-sm font-medium text-red-500">ออกจากระบบ</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-4 flex flex-col items-center justify-center min-h-[120px]">
              <Network size={20} className="text-[var(--icon-active)] mb-2" />
              <h3 className="text-xs font-bold text-[var(--text-heading)] mb-3">เครือข่าย & เลเวล</h3>
              <div className="flex gap-2 w-full">
                <div className="flex-1 bg-[var(--app-bg)] border border-[var(--border-color)] rounded-lg py-2 flex flex-col items-center justify-center">
                  <span className="text-[10px] text-[var(--icon-inactive)]">เพื่อน</span>
                  <span className="text-sm font-bold text-[var(--icon-active)]">0</span>
                </div>
                <div className="flex-1 bg-[var(--app-bg)] border border-[var(--border-color)] rounded-lg py-2 flex flex-col items-center justify-center">
                  <span className="text-[10px] text-[var(--icon-inactive)]">ผู้ติดตาม</span>
                  <span className="text-sm font-bold text-[var(--icon-active)]">0</span>
                </div>
              </div>
            </div>

            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-4 flex flex-col items-center justify-center min-h-[120px]">
              <Shield size={20} className="text-[var(--icon-active)] mb-2" />
              <h3 className="text-xs font-bold text-[var(--text-heading)] mb-3">ระบบ & สิทธิ์</h3>
              <div className="w-full text-[10px] space-y-1 mb-3">
                <div className="flex justify-between text-[var(--icon-inactive)]">สิทธิ์ผู้ใช้: <span className="text-red-500 font-bold uppercase">user</span></div>
                <div className="flex justify-between text-[var(--icon-inactive)]">อายุบัญชี: <span className="text-[var(--text-heading)]">0 ปี 0 เดือน 3 วัน</span></div>
              </div>
              <button className="w-full bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--icon-inactive)] hover:text-[var(--icon-active)] text-[10px] py-2 rounded-lg transition flex items-center justify-center gap-1">
                <Lock size={12} /> เปลี่ยนรหัสผ่าน
              </button>
            </div>

            {['ประวัติการทำงาน', 'ประวัติการศึกษา', 'ที่อยู่ส่งเอกสาร', 'ครอบครัว', 'ข้อมูลสุขภาพ'].map((title, idx) => (
              <div key={idx} className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-4 flex flex-col items-center justify-center min-h-[120px] relative">
                <button className="absolute top-3 right-3 text-[var(--icon-inactive)] hover:text-[var(--icon-active)]">
                  <X size={14} className="rotate-45" />
                </button>
                {idx === 0 && <Briefcase size={20} className="text-[var(--icon-active)] mb-2" />}
                {idx === 1 && <GraduationCap size={20} className="text-[var(--icon-active)] mb-2" />}
                {idx === 2 && <MapPin size={20} className="text-[var(--icon-active)] mb-2" />}
                {idx === 3 && <Users size={20} className="text-[var(--icon-active)] mb-2" />}
                {idx === 4 && <HeartPulse size={20} className="text-[var(--icon-active)] mb-2" />}
                <h3 className="text-xs font-bold text-[var(--text-heading)] mb-3">{title}</h3>
                <div className="bg-[var(--app-bg)] border border-dashed border-[var(--border-color)] w-full py-3 rounded-lg text-center">
                  <span className="text-[10px] text-[var(--icon-inactive)]">ยังไม่มีข้อมูล</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl transform transition-all">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--app-bg)]">
              <h3 className="text-sm font-bold text-[var(--text-heading)] flex items-center gap-2">
                <Edit2 size={16} className="text-[var(--icon-active)]"/> 
                เพิ่มข้อมูล {editField === 'name' ? 'ชื่อ-นามสกุล' : editField === 'phone' ? 'เบอร์โทรศัพท์' : 'อีเมล'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[var(--icon-inactive)] hover:text-red-500 transition">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg text-[10px] text-blue-400 flex gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>ข้อมูลจะถูกบันทึกเป็นชุดใหม่เพื่อเก็บประวัติการแก้ไข และอาจต้องยืนยันตัวตนใหม่</span>
              </div>

              {editField === 'name' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-[var(--icon-inactive)] uppercase mb-1 block">ชื่อ (First Name)</label>
                    <input type="text" value={editForm.val1} onChange={e => setEditForm({...editForm, val1: e.target.value})} className="w-full bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-3 py-2.5 outline-none focus:border-[var(--icon-active)] text-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--icon-inactive)] uppercase mb-1 block">นามสกุล (Last Name)</label>
                    <input type="text" value={editForm.val2} onChange={e => setEditForm({...editForm, val2: e.target.value})} className="w-full bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-3 py-2.5 outline-none focus:border-[var(--icon-active)] text-sm" />
                  </div>
                </div>
              )}

              {editField === 'phone' && (
                <div>
                  <label className="text-[10px] text-[var(--icon-inactive)] uppercase mb-1 block">เบอร์โทรศัพท์มือถือ</label>
                  <input type="tel" value={editForm.val1} onChange={e => setEditForm({...editForm, val1: e.target.value})} className="w-full bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-3 py-2.5 outline-none focus:border-[var(--icon-active)] text-sm" placeholder="08X-XXX-XXXX" />
                </div>
              )}

              {editField === 'email' && (
                <div>
                  <label className="text-[10px] text-[var(--icon-inactive)] uppercase mb-1 block">ที่อยู่อีเมล</label>
                  <input type="email" value={editForm.val1} onChange={e => setEditForm({...editForm, val1: e.target.value})} className="w-full bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-lg px-3 py-2.5 outline-none focus:border-[var(--icon-active)] text-sm" placeholder="example@email.com" />
                </div>
              )}

              <button 
                onClick={handleSaveEdit} 
                disabled={isSaving} 
                className="w-full bg-[var(--icon-active)] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-4 hover:opacity-90 transition disabled:opacity-50 text-sm tracking-widest"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {isSaving ? 'PROCESSING...' : 'SAVE CHANGES'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}