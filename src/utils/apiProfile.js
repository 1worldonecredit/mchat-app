// src/utils/apiProfile.js
// ลบคำว่า import.meta.env.VITE_API_URL ออกไปก่อนเพื่อบังคับให้ชี้ไปที่โดเมนจริง
const API_URL = 'https://mchatapi.9plus.app';

// 1. ดึงข้อมูลหลักจาก API ของคุณ (Profile หลัก)
export const fetchUserProfile = async (userId) => {
  try {
    const res = await fetch(`${API_URL}/api/profile/${userId}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'ไม่พบข้อมูล');
    return data.profile; // ดึงก้อน profile ที่ Backend คุณจัดมาให้
  } catch (error) {
    console.error('Fetch profile error:', error);
    return null;
  }
};

// 2. ดึงข้อมูลการ์ดย่อย (Details) เช่น การทำงาน, การศึกษา
export const fetchUserDetails = async (userId) => {
  try {
    const res = await fetch(`${API_URL}/api/profile/${userId}/details`);
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
};

// 3. บันทึกข้อมูลการ์ดย่อย (ตรวจสอบซ้ำจาก Backend)
export const saveUserDetail = async (userId, type, payload) => {
  const res = await fetch(`${API_URL}/api/profile/details`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, type, title: payload.title, subtitle: payload.subtitle, desc: payload.desc })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
  return data;
};

// 4. ลบข้อมูลการ์ดย่อย (Soft Delete)
export const deleteUserDetail = async (itemId) => {
  const res = await fetch(`${API_URL}/api/profile/details/${itemId}/delete`, { method: 'PUT' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'เกิดข้อผิดพลาด');
  return data;
};


// ... (โค้ดเดิมด้านบนคงไว้) ...

// ในไฟล์ src/utils/apiProfile.js
export const registerBasicUser = async (formData) => {
  try {
    const res = await fetch(`${API_URL}/api/register/basic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData) // <-- บรรทัดนี้สำคัญมาก ห้ามมี { } ครอบ formData
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
    return data;
  } catch (error) {
    throw error;
  }
};

// 6. เข้าสู่ระบบ (Login)
export const loginUser = async (username, password) => {
  try {
    const res = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    return data;
  } catch (error) {
    throw error;
  }
};

// 7. เปลี่ยนรหัสผ่าน (Change Password)
export const changePassword = async (userId, oldPassword, newPassword) => {
  // จำลอง API Call (คุณสามารถนำไปต่อ Backend ได้ในอนาคต)
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 1000);
  });
};

export const fetchReferenceData = async () => {
  try {
    const res = await fetch(`${API_URL}/api/reference-data`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'เกิดข้อผิดพลาดในการดึงข้อมูลอ้างอิง');
    return data;
  } catch (error) {
    throw error;
  }
};