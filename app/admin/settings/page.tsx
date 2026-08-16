'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Settings as SettingsIcon, Save, Store, Clock, ShieldAlert, Bell, Loader2, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [settingId, setSettingId] = useState<string>('');

  // Form fields
  const [salonName, setSalonName] = useState<string>('Hair Salon');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState<string>('');
  const [openTime, setOpenTime] = useState<string>('07:00');
  const [closeTime, setCloseTime] = useState<string>('21:00');
  const [minCancelHours, setMinCancelHours] = useState<number>(2);
  const [advanceBookingDays, setAdvanceBookingDays] = useState<number>(30);
  const [reminder24h, setReminder24h] = useState<boolean>(true);
  const [reminder1h, setReminder1h] = useState<boolean>(true);

  const [successNotice, setSuccessNotice] = useState<boolean>(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('settings').select('*').maybeSingle();
      if (data) {
        setSettingId(data.id);
        setSalonName(data.salon_name || 'Hair Salon');
        setPhone(data.phone || '');
        setAddress(data.address || '');
        setGoogleMapsUrl(data.google_maps_url || '');
        setOpenTime(data.open_time ? data.open_time.substring(0, 5) : '10:00');
        setCloseTime(data.close_time ? data.close_time.substring(0, 5) : '20:00');
        setMinCancelHours(data.min_cancel_hours ?? 2);
        setAdvanceBookingDays(data.advance_booking_days ?? 30);
        setReminder24h(data.reminder_24h_active ?? true);
        setReminder1h(data.reminder_1h_active ?? true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccessNotice(false);

    try {
      const payload = {
        salon_name: salonName,
        phone,
        address,
        google_maps_url: googleMapsUrl,
        open_time: `${openTime}:00`,
        close_time: `${closeTime}:00`,
        min_cancel_hours: Number(minCancelHours),
        advance_booking_days: Number(advanceBookingDays),
        reminder_24h_active: reminder24h,
        reminder_1h_active: reminder1h,
        updated_at: new Date().toISOString(),
      };

      if (settingId) {
        const { error } = await supabase.from('settings').update(payload).eq('id', settingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('settings').insert(payload);
        if (error) throw error;
      }

      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 4000);
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาดในการบันทึกการตั้งค่า');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-salon-500" />
        <p className="mt-2 text-xs">กำลังโหลดข้อมูลการตั้งค่า...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-white">ตั้งค่าร้านและกฎการจอง (Salon Settings)</h1>
          <p className="text-xs text-slate-400">กำหนดชื่อร้าน เบอร์โทร เวลาเปิด/ปิด เงื่อนไขการยกเลิก และการแจ้งเตือน</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2.5 bg-salon-600 hover:bg-salon-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-lg"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>บันทึกการตั้งค่า</span>
            </>
          )}
        </button>
      </div>

      {successNotice && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>บันทึกข้อมูลการตั้งค่าระบบเรียบร้อยแล้ว</span>
        </div>
      )}

      {/* 1. Salon General Profile */}
      <div className="bg-slate-800 border border-slate-700/60 p-5 rounded-2xl space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center">
          <Store className="w-4 h-4 text-salon-400 mr-2" />
          ข้อมูลทั่วไปของร้าน (General Info)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">ชื่อร้านทำผม <span className="text-rose-400">*</span></label>
            <input
              type="text"
              required
              value={salonName}
              onChange={(e) => setSalonName(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">เบอร์โทรศัพท์ร้าน</label>
            <input
              type="tel"
              placeholder="02-XXX-XXXX หรือ 08X-XXX-XXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-300 font-semibold mb-1">ที่อยู่ร้าน</label>
            <textarea
              rows={2}
              placeholder="ระบุที่อยู่ของร้านอย่างละเอียด"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-300 font-semibold mb-1">ลิงก์ Google Maps</label>
            <input
              type="url"
              placeholder="https://maps.google.com/..."
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Working Hours & Booking Rules */}
      <div className="bg-slate-800 border border-slate-700/60 p-5 rounded-2xl space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center">
          <ShieldAlert className="w-4 h-4 text-salon-400 mr-2" />
          เวลาเปิด/ปิด & กฎการจองคิว (Salon Operating & Rules)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">เวลาเปิดร้าน</label>
            <input
              type="time"
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">เวลาปิดร้าน</label>
            <input
              type="time"
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">เปิดให้จองล่วงหน้าได้ไม่เกิน (วัน)</label>
            <input
              type="number"
              min="1"
              max="180"
              value={advanceBookingDays}
              onChange={(e) => setAdvanceBookingDays(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">ห้ามยกเลิก/เลื่อนนัดก่อนถึงเวลา (ชั่วโมง)</label>
            <input
              type="number"
              min="0"
              max="72"
              value={minCancelHours}
              onChange={(e) => setMinCancelHours(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Notification Settings */}
      <div className="bg-slate-800 border border-slate-700/60 p-5 rounded-2xl space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center">
          <Bell className="w-4 h-4 text-salon-400 mr-2" />
          การแจ้งเตือนอัตโนมัติผ่าน LINE (LINE Automated Reminders)
        </h2>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-700">
            <div>
              <p className="font-bold text-white">แจ้งเตือนเตือนคิวก่อน 24 ชั่วโมง</p>
              <p className="text-slate-400 text-[11px]">ส่ง Push message ทาง LINE แจ้งเตือนลูกค้าล่วงหน้า 1 วัน</p>
            </div>
            <button
              type="button"
              onClick={() => setReminder24h(!reminder24h)}
              className={`px-3 py-1.5 rounded-xl font-bold ${
                reminder24h ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'
              }`}
            >
              {reminder24h ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-700">
            <div>
              <p className="font-bold text-white">แจ้งเตือนเตือนคิวก่อน 1 ชั่วโมง</p>
              <p className="text-slate-400 text-[11px]">ส่ง Push message ทาง LINE แจ้งเตือนเมื่อใกล้ถึงเวลานัดหมาย</p>
            </div>
            <button
              type="button"
              onClick={() => setReminder1h(!reminder1h)}
              className={`px-3 py-1.5 rounded-xl font-bold ${
                reminder1h ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'
              }`}
            >
              {reminder1h ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
