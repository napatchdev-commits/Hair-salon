# ✂️ ระบบจองคิวร้านทำผมผ่าน LINE Official Account (Hair Salon Booking System)

ระบบจองคิวร้านทำผมแบบ **Production Ready** ที่ออกแบบมาสำหรับใช้งานจริงในสภาพแวดล้อม Production รองรับการจองผ่าน **LINE Official Account (LINE Bot + LIFF)** โดยไม่ต้องติดตั้งแอปพลิเคชันเพิ่มเติม

---

## 🌟 คุณสมบัติหลัก (Key Features)

### 📱 ฝั่งลูกค้า (LINE LIFF Web App)
- **Rich Menu Integration**: เชื่อมต่อเมนู LINE (จองคิว, คิวของฉัน, บริการ, ช่าง, ติดต่อร้าน)
- **Automatic LINE Login**: ระบุตัวตนลูกค้าผ่าน LINE User ID อัตโนมัติ ไม่ต้องสมัครสมาชิกใหม่
- **ระบบเลือกบริการ & ช่าง**: เลือกบริการที่ต้องการ เลือกช่างทำผมประจำร้าน
- **ระบบเวลาคำนวณอัตโนมัติ**: แสดงเฉพาะช่วงเวลาที่ **ว่างจริง** โดยนำเวลาเปิด/ปิดร้าน วันทำงานช่าง เวลาพักช่าง และคิวที่มีอยู่แล้วมาคำนวณ
- **ระบบป้องกันคิวชน (Concurrency Locking)**: ใช้ PostgreSQL Lock & Stored Procedure `create_booking_atomic` ป้องกัน Race Condition และการจองทับซ้อน 100%
- **คิวของฉัน (My Queue)**: ดูสถานะคิว (รอรอยืนยัน, ยืนยันแล้ว, เสร็จสิ้น, ยกเลิก) พร้อมปุ่มเลื่อนนัดและยกเลิกคิว (ควบคุมด้วยกฎห้ามยกเลิกก่อนนัดน้อยกว่า X ชั่วโมง)
- **LINE Notification Alert**: ส่ง Flex Message ยืนยันการจองคิวทาง LINE ทันที

### ⚙️ ฝั่งผู้ดูแลร้าน (Admin Dashboard)
- **ระบบยืนยันตัวตน**: Supabase Auth (Email & Password)
- **Dashboard Metrics สด**: แสดงคิววันนี้ คิวพรุ่งนี้ ยอดรวมคิว รายได้รวม (จากคิวที่เสร็จสิ้น) จำนวนลูกค้า จำนวนยกเลิก และ No-show จากข้อมูลจริงในฐานข้อมูล Supabase (ไม่มี Demo Data)
- **Appointments Management**: ค้นหา กรองตามสถานะ/ช่าง/วันที่ เปลี่ยนสถานะคิว (Confirmed, Completed, Cancelled, No-show)
- **Calendar View**: ผังตารางเวลานัดหมายแบบรายวัน (Day) และรายสัปดาห์ (Week) แยกตามช่าง
- **Customer Management**: ประวัติการจอง ยอดใช้บริการ และสถานะการเชื่อม LINE ID
- **Staff Management**: เพิ่ม/แก้ไขช่าง กำหนดวันทำงาน 7 วัน เวลาพัก และกำหนดวันหยุดพิเศษเฉพาะวัน
- **Services Management**: เพิ่ม/แก้ไขรายการบริการ อัตราค่าบริการ (บาท) และระยะเวลาทำ (นาที)
- **Settings**: ตั้งค่าชื่อร้าน เบอร์โทร ที่อยู่ Google Maps เวลาเปิด/ปิดร้าน ระยะเวลาจองล่วงหน้า และกฎขั้นต่ำก่อนยกเลิกคิว

---

## 🛠 เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend**: Next.js 14 (App Router), TypeScript, React 18, Tailwind CSS, Lucide Icons
- **Backend & Database**: Supabase PostgreSQL, `@supabase/supabase-js`, `@supabase/ssr`
- **LINE Integration**: `@line/bot-sdk`, `@line/liff`
- **Timezone**: `Asia/Bangkok` (คำนวณเวลาไทย)
- **Deployment**: Prepared for Vercel

---

## 🚀 ขั้นตอนการติดตั้งและการนำไปใช้งาน (Setup & Deployment)

### Step 1: Clone & Install Dependencies

```bash
cd "Hair salon"
npm install
```

---

### Step 2: Supabase Database Setup

1. สร้างโปรเจกต์ใหม่ใน [Supabase Dashboard](https://supabase.com)
2. ไปที่ **SQL Editor** ใน Supabase
3. คัดลอกโค้ด SQL จากไฟล์:
   `supabase/migrations/20260814000000_initial_schema.sql`
4. วางใน SQL Editor แล้วกด **RUN** เพื่อสร้างตาราง Indexes RLS Policies และ Stored Procedures
5. สร้างบัญชีผู้ใช้สำหรับ Admin:
   - ไปที่ **Authentication** > **Users** > **Add User** (กรอก Email & Password)
   - คัดลอก `User ID` (UUID) ที่สร้างขึ้น
   - ไปที่ SQL Editor แล้วรันคำสั่งผูกสิทธิ์ Admin:
     ```sql
     INSERT INTO public.admin_users (id, email, full_name)
     VALUES ('YOUR_AUTH_USER_ID', 'admin@hairsalon.com', 'Admin Manager');
     ```

---

### Step 3: Environment Variables Setup

คัดลอกไฟล์ `.env.example` เป็น `.env.local`:

```bash
cp .env.example .env.local
```

กรอกข้อมูลจริงใน `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# LINE Developer Account
LINE_CHANNEL_ACCESS_TOKEN=your-line-channel-access-token
LINE_CHANNEL_SECRET=your-line-channel-secret
NEXT_PUBLIC_LIFF_ID=your-liff-id

# App URL & Cron
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
CRON_SECRET=your-random-cron-secret
```

---

### Step 4: LINE Official Account & LIFF Setup

1. ไปที่ [LINE Developers Console](https://developers.line.me)
2. **Messaging API Channel**:
   - คัดลอก `Channel Access Token` และ `Channel Secret` มาใส่ใน `.env.local`
   - ตั้งค่า **Webhook URL**: `https://your-domain.vercel.app/api/line/webhook`
   - เปิดใช้งาน **Use webhook**
3. **LIFF (LINE Front-end Framework) Setup**:
   - สร้าง LIFF App ใหม่ภายใต้ Provider ของคุณ
   - ตั้งค่า **Endpoint URL**: `https://your-domain.vercel.app/liff`
   - คัดลอก **LIFF ID** มาใส่ใน `NEXT_PUBLIC_LIFF_ID`
4. **Rich Menu Setup**:
   - ใน LINE Official Account Manager สร้าง Rich Menu สำหรับหน้าแชต
   - ปุ่ม **"จองคิว"**: ลิงก์ Action ไปยัง `https://liff.line.me/YOUR_LIFF_ID`
   - ปุ่ม **"คิวของฉัน"**: ลิงก์ Action ไปยัง `https://liff.line.me/YOUR_LIFF_ID/my-queue`
   - ปุ่ม **"บริการ"**: พิมพ์ข้อความ `บริการ`
   - ปุ่ม **"ช่าง"**: พิมพ์ข้อความ `ช่าง`
   - ปุ่ม **"ติดต่อร้าน"**: พิมพ์ข้อความ `ติดต่อร้าน`

---

### Step 5: Vercel Deployment

1. Push โค้ดทั้งหมดขึ้น GitHub:
   ```bash
   git add .
   git commit -m "Deploy production hair salon booking system"
   git push origin main
   ```
2. Import repository เข้าสู่ [Vercel](https://vercel.com)
3. ใส่ Environment Variables ใน Vercel Settings ให้ครบถ้วนตาม `.env.example`
4. กด **Deploy**

---

### Step 6: Automated Reminder Cron Setup (Vercel Cron)

สร้างไฟล์ `vercel.json` ใน Root project (ถ้าต้องการให้ส่งแจ้งเตือนก่อนถึงเวลานัด 24 ชม. และ 1 ชม.):

```json
{
  "crons": [
    {
      "path": "/api/line/reminder",
      "schedule": "0 * * * *"
    }
  ]
}
```

---

## 🧪 การทดสอบระบบ (Verification Checklist)

- [x] **Database Initialization**: ตรวจสอบว่าไม่มีข้อมูลตัวอย่าง (Demo Data) ในระบบ ฐานข้อมูลเริ่มต้นจะว่างเปล่าตามข้อกำหนด Production
- [x] **Concurrency Locking**: ตรวจสอบ stored procedure `create_booking_atomic` ด้วยการลองจองเวลาเดียวกันพร้อมกัน ระบบจะป้องกันคิวชน 100%
- [x] **LINE Reply Verification**: พิมพ์คำว่า "บริการ" ใน LINE OA ระบบจะตอบกลับด้วย Reply message จากฐานข้อมูล Supabase
- [x] **LIFF Flow**: เปิด LIFF -> เลือกบริการ -> เลือกช่าง -> เลือกวันที่ -> เลือกรอบเวลาที่ว่างจริง -> กรอกชื่อเบอร์โทร -> กดยืนยัน -> รับข้อความ Flex Message ทาง LINE
