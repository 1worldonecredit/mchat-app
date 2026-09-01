// src/utils/apiProfile.js
// ลบคำว่า import.meta.env.VITE_API_URL ออกไปก่อนเพื่อบังคับให้ชี้ไปที่โดเมนจริง
const API_URL = 'https://mchatapi.9plus.app';



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


export const checkUsername = async (username) => {
  try {
    const res = await fetch(`${API_URL}/api/check-username`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }) // <-- ห้ามเขียนแค่ (username) เด็ดขาด
    });
    return await res.json();
  } catch (error) {
    console.error('Error checking username:', error);
    return { success: false, available: false };
  }
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



export const loginUser = async (credentials) => {
  try {
    const res = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials) // <-- ส่ง credentials ไปตรงๆ
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


// ดึงข้อมูลผู้ใช้ทั้งหมดมาแสดงใน Profile  new 31
export const fetchUserProfile = async (userId) => {
  try {
    const res = await fetch(`${API_URL}/api/profile/${userId}`);
    return await res.json();
  } catch (error) {
    console.error('Fetch Profile Error:', error);
    throw error;
  }
};

// บันทึกข้อมูลแก้ไขใหม่ (Append-Only)
export const updateUserProfile = async (payload) => {
  try {
    const res = await fetch(`${API_URL}/api/profile/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (error) {
    throw error;
  }
};

// ฟังก์ชันอัปโหลดรูปภาพ
export const uploadUserImage = async ({ userId, type, imageBase64 }) => {
  try {
    const response = await fetch(`${API_URL}/api/profile/upload-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, type, imageBase64 }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Network response was not ok');
    }
    return data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};