import { ArrowLeft, Camera, Lock, Plus, Users, Shield, Activity, CheckCircle2, X, Briefcase, GraduationCap, MapPin, HeartPulse, Trash2, Loader2, LogOut, Key } from 'lucide-react';
import { useState, useEffect } from 'react';
// เพิ่ม changePassword เข้ามาใน import ด้วย
import { fetchUserProfile, fetchUserDetails, saveUserDetail, deleteUserDetail, changePassword } from '../utils/apiProfile';
import '../Profile.css';

// รับ onLogout เข้ามาทาง props
export default function Profile({ onBack, onLogout }) {


  const [userProfile, setUserProfile] = useState(null); 
  const [details, setDetails] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // เพิ่ม field สำหรับรหัสผ่านเตรียมไว้ใน formData
  const [formData, setFormData] = useState({ title: '', subtitle: '', desc: '', oldPassword: '', newPassword: '', confirmPassword: '' });
  
  const [coverPreview, setCoverPreview] = useState(() => localStorage.getItem('saved_cover') || null);
  const [coverFile, setCoverFile] = useState(null);
  
  const [avatarPreview, setAvatarPreview] = useState(() => localStorage.getItem('saved_avatar') || null);
  const [avatarFile, setAvatarFile] = useState(null);
  // ดึง ID ผู้ใช้จาก localStorage ที่เราเซฟไว้ตอน Login/Register
  const currentUserId = localStorage.getItem('currentUserId');

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'cover') {
          setCoverFile(file);
          setCoverPreview(reader.result); 
        } else {
          setAvatarFile(file);
          setAvatarPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelImage = (type) => {
    if (type === 'cover') {
      setCoverFile(null);
      setCoverPreview(null);
    } else {
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  };

  const handleSaveImage = (type) => {
    if (type === 'cover') {
      localStorage.setItem('saved_cover', coverPreview);
      setCoverFile(null);
    } else {
      localStorage.setItem('saved_avatar', avatarPreview);
      setAvatarFile(null);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

 // เปลี่ยนฟังก์ชัน loadData เป็นแบบนี้
  const loadData = async () => {
    try {
      setLoading(true);
      const [profileData, detailsData] = await Promise.all([
        fetchUserProfile(currentUserId),
        fetchUserDetails(currentUserId)
      ]);
      
      if (profileData) setUserProfile(profileData);
      if (detailsData) setDetails(detailsData);
      setLoading(false);
    } catch (error) {
      console.error("โหลดข้อมูลไม่สำเร็จ:", error);
      // ถ้าหา User ไม่เจอ ให้ลบข้อมูลในเครื่องทิ้งแล้วเด้งกลับหน้า Login
      localStorage.clear();
      window.location.href = '/'; 
    }
  };

  const handleOpenModal = (type) => {
    setErrorMsg('');
    // เคลียร์ค่าทั้งหมดก่อนเปิด Modal
    setFormData({ title: '', subtitle: '', desc: '', oldPassword: '', newPassword: '', confirmPassword: '' });
    setModalType(type);
    setModalOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg('');
    try {
      // แยกลอจิกการเซฟ หากเป็น modal เปลี่ยนรหัสผ่าน
      if (modalType === 'password') {
        if (!formData.oldPassword || !formData.newPassword) throw new Error('กรุณากรอกรหัสผ่านให้ครบถ้วน');
        if (formData.newPassword !== formData.confirmPassword) throw new Error('รหัสผ่านใหม่ไม่ตรงกัน');
        
        await changePassword(currentUserId, formData.oldPassword, formData.newPassword);
        setModalOpen(false);
        alert('เปลี่ยนรหัสผ่านสำเร็จ!');
      } else {
        // ลอจิกการบันทึกข้อมูลรายละเอียดเดิม
        if (!formData.title) {
          setErrorMsg('กรุณาระบุหัวข้อหลัก');
          setIsSaving(false);
          return;
        }
        await saveUserDetail(currentUserId, modalType, formData);
        await fetchUserDetails(currentUserId).then(setDetails); 
        setModalOpen(false);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSaving(false);
    }
  };

const handleLogout = () => {
    if (window.confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm('ยืนยันการลบข้อมูลนี้? (Soft Delete)')) {
      await deleteUserDetail(id);
      await fetchUserDetails(currentUserId).then(setDetails);
    }
  };

  const getItemsByType = (type) => details.filter(item => item.type === type);

  const DetailItem = ({ item }) => (
    <div className="group/item relative bg-[var(--app-bg)] border border-[var(--border-color)] rounded-xl p-3 mb-2 flex items-start justify-between">
      <div>
        <p className="font-semibold text-[var(--text-heading)]">{item.title}</p>
        {item.subtitle && <p className="text-sm text-[var(--icon-active)]">{item.subtitle}</p>}
        {item.desc && <p className="text-xs text-[var(--text-body)] mt-1">{item.desc}</p>}
      </div>
      <button onClick={() => handleDelete(item.id)} className="opacity-0 group-hover/item:opacity-100 text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all">
        <Trash2 size={16} />
      </button>
    </div>
  );

  const EmptyState = ({ label }) => (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[var(--border-color)] rounded-xl opacity-60">
      <p className="text-sm text-[var(--icon-inactive)]">ยังไม่มีข้อมูล {label}</p>
    </div>
  );

  const ProfileCard = ({ title, icon: Icon, type, disableAdd = false, children }) => (
    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5 transition-all duration-300 group" style={{ boxShadow: 'var(--card-shadow)' }}>
      <div className="flex items-center justify-between mb-4 border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--app-bg)] flex items-center justify-center text-[var(--icon-active)]">
            <Icon size={20} />
          </div>
          <h3 className="text-[var(--text-heading)] font-semibold tracking-wide">{title}</h3>
        </div>
        {!disableAdd && (
          <button onClick={() => handleOpenModal(type)} className="w-8 h-8 rounded-full bg-[var(--app-bg)] text-[var(--icon-inactive)] flex items-center justify-center hover:bg-[var(--icon-active)] hover:text-white transition-all shadow-sm">
            <Plus size={18} />
          </button>
        )}
      </div>
      <div className="text-[var(--text-body)] text-sm space-y-1 min-h-[60px]">
        {children}
      </div>
    </div>
  );

  if (loading || !userProfile) {
    return <div className="flex justify-center items-center h-[100dvh] w-full bg-[var(--app-bg)]"><Loader2 className="animate-spin text-[var(--icon-active)]" size={40}/></div>;
  }

  return (
    <div className="flex flex-col w-full h-[100dvh] md:h-full bg-[var(--app-bg)] transition-all duration-300 overflow-y-auto" style={{ fontFamily: 'var(--font-family)' }}>
      
      <div className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-[var(--glass-surface)] backdrop-blur-xl border-b border-[var(--border-color)] transition-all" style={{ boxShadow: 'var(--nav-shadow)' }}>
        <button onClick={onBack} className="text-[var(--text-heading)] hover:opacity-70 transition p-2">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-[var(--text-heading)] text-lg font-bold">โปรไฟล์ของฉัน</h2>
        
        {/* เปลี่ยนจาก div ว่างๆ เป็นปุ่ม Logout สีแดง */}
       <button onClick={handleLogout} className="text-[var(--icon-inactive)] hover:text-red-500 hover:bg-red-500/10 transition p-2 rounded-lg" title="ออกจากระบบ">
        <LogOut size={22} />
        </button>
      </div>

      {/* Cover & Avatar */}
      <div className="profile-cover-container group">
        <img src={coverPreview || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"} alt="cover" className="profile-cover-img" />
        
        {coverFile ? (
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={() => handleSaveImage('cover')} className="bg-green-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md hover:bg-green-600 transition">บันทึก</button>
            <button onClick={() => handleCancelImage('cover')} className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md hover:bg-red-600 transition">ยกเลิก</button>
          </div>
        ) : (
          <label className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Camera size={20} />
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageChange(e, 'cover')} />
          </label>
        )}

        <div className="profile-avatar-wrapper group/avatar">
          <img src={avatarPreview || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop"} alt="avatar" className="w-full h-full object-cover" />
          
          {avatarFile ? (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2">
              <button onClick={() => handleSaveImage('avatar')} className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md w-16 hover:bg-green-600 transition">บันทึก</button>
              <button onClick={() => handleCancelImage('avatar')} className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md w-16 hover:bg-red-600 transition">ยกเลิก</button>
            </div>
          ) : (
            <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
              <Camera size={24} className="text-white" />
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageChange(e, 'avatar')} />
            </label>
          )}
        </div>
      </div>

      <div className="px-6 pt-14 pb-10 max-w-5xl mx-auto w-full">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-heading)] mb-1">{userProfile.username}</h1>
            <p className="text-[var(--icon-active)] font-medium flex items-center gap-2">
              <CheckCircle2 size={16} /> @{userProfile.username} • Level {userProfile.stats.current_level}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5 col-span-1 md:col-span-2 lg:col-span-3 relative overflow-hidden" style={{ boxShadow: 'var(--card-shadow)' }}>
            <div className="flex items-center gap-2 mb-4 text-[var(--text-heading)] border-b border-[var(--border-color)] pb-3">
              <Lock size={20} className="text-red-500" /> 
              <h3 className="font-semibold tracking-wide">ข้อมูลพื้นฐาน (เปลี่ยนไม่ได้)</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><p className="text-[var(--icon-inactive)] text-xs mb-1">Global ID</p><p className="text-[var(--icon-active)] font-mono font-bold">{userProfile.global_id}</p></div>
              <div><p className="text-[var(--icon-inactive)] text-xs mb-1">อายุ</p><p className="text-[var(--text-heading)]">{userProfile.demographics.age}</p></div>
              <div><p className="text-[var(--icon-inactive)] text-xs mb-1">สัญชาติ / เพศ</p><p className="text-[var(--text-heading)]">{userProfile.nationality} / {userProfile.gender}</p></div>
              <div><p className="text-[var(--icon-inactive)] text-xs mb-1">เบอร์โทรศัพท์</p><p className="text-[var(--text-heading)] font-mono">{userProfile.phone}</p></div>
            </div>
          </div>

          <ProfileCard title="เครือข่าย & เลเวล" icon={Activity} type="network" disableAdd={true}>
            <div className="grid grid-cols-2 gap-4 text-center mt-2">
              <div className="bg-[var(--app-bg)] p-3 rounded-xl border border-[var(--border-color)]">
                <p className="text-xl font-bold text-[var(--text-heading)]">{userProfile.stats.friends}</p>
                <p className="text-xs text-[var(--icon-inactive)]">เพื่อน</p>
              </div>
              <div className="bg-[var(--app-bg)] p-3 rounded-xl border border-[var(--border-color)]">
                <p className="text-xl font-bold text-[var(--text-heading)]">{userProfile.stats.followers}</p>
                <p className="text-xs text-[var(--icon-inactive)]">ผู้ติดตาม</p>
              </div>
            </div>
          </ProfileCard>

          {/* เพิ่มปุ่มเปลี่ยนรหัสผ่านที่นี่ (Card ระบบ & สิทธิ์) */}
          <ProfileCard title="ระบบ & สิทธิ์" icon={Shield} type="system" disableAdd={true}>
            <div className="space-y-3">
              <p className="flex justify-between items-center"><span className="text-[var(--icon-inactive)]">สิทธิ์ผู้ใช้:</span> <span className="font-semibold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md">{userProfile.settings.role}</span></p>
              <p className="flex justify-between items-center"><span className="text-[var(--icon-inactive)]">อายุบัญชี:</span> <span className="text-[var(--icon-active)] font-medium">{userProfile.demographics.account_age}</span></p>
              
              <button 
                onClick={() => handleOpenModal('password')} 
                className="w-full mt-4 py-2 border border-[var(--border-color)] text-[var(--text-heading)] rounded-xl flex items-center justify-center gap-2 hover:border-[var(--icon-active)] hover:text-[var(--icon-active)] transition-all bg-[var(--app-bg)]"
              >
                <Key size={16} /> เปลี่ยนรหัสผ่าน
              </button>
            </div>
          </ProfileCard>

          <ProfileCard title="ประวัติการทำงาน" icon={Briefcase} type="career">
            {getItemsByType('career').length > 0 ? getItemsByType('career').map(item => <DetailItem key={item.id} item={item} />) : <EmptyState label="การทำงาน" />}
          </ProfileCard>
          
          <ProfileCard title="ประวัติการศึกษา" icon={GraduationCap} type="education">
            {getItemsByType('education').length > 0 ? getItemsByType('education').map(item => <DetailItem key={item.id} item={item} />) : <EmptyState label="การศึกษา" />}
          </ProfileCard>

          <ProfileCard title="ที่อยู่ส่งเอกสาร" icon={MapPin} type="address">
            {getItemsByType('address').length > 0 ? getItemsByType('address').map(item => <DetailItem key={item.id} item={item} />) : <EmptyState label="ที่อยู่" />}
          </ProfileCard>

          <ProfileCard title="ครอบครัว" icon={Users} type="family">
            {getItemsByType('family').length > 0 ? getItemsByType('family').map(item => <DetailItem key={item.id} item={item} />) : <EmptyState label="บุคคลในครอบครัว" />}
          </ProfileCard>

          <ProfileCard title="ข้อมูลสุขภาพ" icon={HeartPulse} type="health">
            {getItemsByType('health').length > 0 ? getItemsByType('health').map(item => <DetailItem key={item.id} item={item} />) : <EmptyState label="สุขภาพ" />}
          </ProfileCard>

        </div>
      </div>

      {modalOpen && (
        <div className="glass-modal-overlay">
          <div className="glass-modal-content p-6">
            <div className="flex items-center justify-between mb-4 border-b border-[var(--border-color)] pb-4">
              <h2 className="text-xl font-bold text-[var(--text-heading)]">
                {modalType === 'password' ? 'เปลี่ยนรหัสผ่าน' : 'เพิ่มข้อมูล'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-[var(--icon-inactive)] hover:text-red-500 transition"><X size={24} /></button>
            </div>
            
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-4 text-sm font-semibold">⚠️ {errorMsg}</div>
            )}

            <div className="space-y-4">
              {/* แยกลอจิกแสดงช่อง Input ระหว่างเปลี่ยนรหัสผ่าน กับเพิ่มข้อมูลปกติ */}
             {/* แยกลอจิกแสดงช่อง Input ระหว่างเปลี่ยนรหัสผ่าน กับเพิ่มข้อมูลปกติ */}
              {modalType === 'password' ? (
                <>
                  {/* เพิ่มกล่องยืนยันชื่อผู้ใช้ตรงนี้ */}
                  <div className="mb-4 p-3 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl flex justify-between items-center opacity-80">
                    <span className="text-[var(--icon-inactive)] text-sm">บัญชีผู้ใช้:</span>
                    <span className="text-[var(--icon-active)] font-bold tracking-wider">@{userProfile?.username}</span>
                  </div>

                  <input type="password" value={formData.oldPassword || ''} onChange={e => setFormData({...formData, oldPassword: e.target.value})} placeholder="รหัสผ่านปัจจุบัน *" className="w-full bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-xl px-4 py-3 outline-none focus:border-[var(--icon-active)] transition-colors" />
                  <input type="password" value={formData.newPassword || ''} onChange={e => setFormData({...formData, newPassword: e.target.value})} placeholder="รหัสผ่านใหม่ *" className="w-full bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-xl px-4 py-3 outline-none focus:border-[var(--icon-active)] transition-colors" />
                  <input type="password" value={formData.confirmPassword || ''} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} placeholder="ยืนยันรหัสผ่านใหม่ *" className="w-full bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-xl px-4 py-3 outline-none focus:border-[var(--icon-active)] transition-colors" />
                </>
              ) : (
                <>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="หัวข้อหลัก *" className="w-full bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-xl px-4 py-3 outline-none focus:border-[var(--icon-active)] transition-colors" />
                  <input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} placeholder="หัวข้อรอง (ถ้ามี)" className="w-full bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-xl px-4 py-3 outline-none focus:border-[var(--icon-active)] transition-colors" />
                  <textarea rows="3" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} placeholder="รายละเอียดเพิ่มเติม" className="w-full bg-[var(--app-bg)] border border-[var(--border-color)] text-[var(--text-heading)] rounded-xl px-4 py-3 outline-none focus:border-[var(--icon-active)] transition-colors"></textarea>
                </>
              )}

              <button disabled={isSaving} onClick={handleSave} className="w-full py-3 mt-4 bg-[var(--icon-active)] text-white font-bold rounded-xl shadow-[var(--card-shadow)] hover:opacity-90 disabled:opacity-50 transition-all flex justify-center items-center gap-2">
                {isSaving ? <Loader2 className="animate-spin" size={20} /> : 'บันทึกข้อมูล'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}