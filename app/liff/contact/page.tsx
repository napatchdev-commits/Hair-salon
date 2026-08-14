'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MapPin, Phone, Clock, ExternalLink, Loader2, Store } from 'lucide-react';

export default function ContactPage() {
  const supabase = createClient();
  const [setting, setSetting] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase
        .from('settings')
        .select('*')
        .maybeSingle();
      setSetting(data);
      setLoading(false);
    }
    loadSettings();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-6 h-6 text-salon-600 animate-spin" />
        <p className="mt-2 text-xs text-slate-500">กำลังโหลดข้อมูลร้าน...</p>
      </div>
    );
  }

  const salonName = setting?.salon_name || 'Hair Salon';
  const phone = setting?.phone || 'ยังไม่ได้ระบุ';
  const address = setting?.address || 'ยังไม่ได้ระบุ';
  const mapsUrl = setting?.google_maps_url;
  const openTime = setting?.open_time ? setting.open_time.substring(0, 5) : '10:00';
  const closeTime = setting?.close_time ? setting.close_time.substring(0, 5) : '20:00';

  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-slate-800 flex items-center">
        <MapPin className="w-5 h-5 text-salon-600 mr-2" />
        ข้อมูลและการติดต่อร้าน (Salon Info)
      </h2>

      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
          <div className="w-12 h-12 rounded-2xl bg-salon-100 text-salon-700 flex items-center justify-center font-bold">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">{salonName}</h3>
            <p className="text-slate-500">LINE Official Salon Partner</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Clock className="w-4 h-4 text-salon-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">เวลาทำการ:</p>
              <p className="text-slate-600">{openTime} น. – {closeTime} น. (เปิดบริการทุกวัน)</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Phone className="w-4 h-4 text-salon-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">เบอร์โทรศัพท์ติดต่อ:</p>
              <p className="text-slate-600">{phone}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MapPin className="w-4 h-4 text-salon-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">ที่อยู่ร้าน:</p>
              <p className="text-slate-600 leading-relaxed">{address}</p>
            </div>
          </div>
        </div>

        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-salon-50 hover:bg-salon-100 border border-salon-200 text-salon-800 font-bold rounded-xl flex items-center justify-center space-x-2 transition-all"
          >
            <span>นำทางด้วย Google Maps</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}
