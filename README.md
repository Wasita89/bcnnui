# BCNNUI

## ระบบแบบสอบถามความต้องการเข้าหอพัก
จุดที่เกี่ยวข้องหลัก ๆ อยู่ตามไฟล์ด้านล่างนี้

### 1) ปุ่ม/แบนเนอร์เรียกแบบสอบถาม (หน้า Home)
- `C:\Users\maymi\Downloads\bcnnui\src\views\HomeView.vue`
  - ปุ่ม “เริ่มทำแบบสอบถามทันที” เรียก `surveyDialog = true`

### 2) ฟอร์มแบบสอบถาม (Popup)
- `C:\Users\maymi\Downloads\bcnnui\src\components\forms\SurveyDialog.vue`
  - ฟอร์มกรอกรหัสนักศึกษา/ชื่อ-นามสกุล
  - เลือกความต้องการเข้าพัก (ต้องการย้าย / อยู่เดิม / อยู่หอนอก)

### 3) State และการเปิด-ปิดฟอร์ม
- `C:\Users\maymi\Downloads\bcnnui\src\App.vue`
  - `surveyDialog` / `surveyForm`
  - `submitSurvey()` ถ้าเลือก “ต้องการย้าย/เข้าอยู่” จะเปิด `moveDialog`

### 4) สไตล์ UI ของแบบสอบถาม
- `C:\Users\maymi\Downloads\bcnnui\src\styles\main.css`
  - กลุ่มคลาส `survey-cta*`, `survey-dialog*`, `survey-*`

---

## ระบบเลือกหอ/ชั้น/ห้อง (หลังแบบสอบถาม)

### 1) ฟอร์มเลือกหอ/ชั้น/ห้อง (Popup)
- `C:\Users\maymi\Downloads\bcnnui\src\components\forms\MoveDialog.vue`
  - แสดงขั้นตอน 1 เลือกหอ → 2 เลือกชั้น → 3 เลือกห้อง

### 2) ข้อมูลหอ/ชั้น/ห้อง (ตัวอย่างจำลอง)
- `C:\Users\maymi\Downloads\bcnnui\src\App.vue`
  - `dormOptions` (หอพัก 5 หอ, มี 1 หอชาย)
  - `floorOptions`
  - `roomOptions` (สร้างห้องแต่ละชั้นประมาณ 18–20 ห้อง, 2–4 เตียง)
  - ตัวแปรสถานะ `selectedDorm`, `selectedFloor`, `surveySelectedRoom`

### 3) สไตล์ UI การ์ดห้องและแท็บ
- `C:\Users\maymi\Downloads\bcnnui\src\styles\main.css`
  - กลุ่มคลาส `move-dialog`, `move-dorm-*`, `move-floor-*`, `move-room-*`

