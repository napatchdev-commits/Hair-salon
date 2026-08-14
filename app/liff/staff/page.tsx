'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { UserCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function StaffPage() {
  const supabase = createClient();
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadStaff() {
      const { data } = await supabase
        .from('staff')
        .select('*')
        .eq('status', true);
      setStaffList(data || []);
      setLoading(false);
    }
    loadStaff();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-slate-800 flex items-center">
        <UserCheck className="w-5 h-5 text-salon-600 mr-2" />
        ทีมช่างทำผมประจำร้าน (Hair Stylists)
      </h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-salon-600 animate-spin" />
          <p className="mt-2 text-xs text-slate-500">กำลังโหลดข้อมูลช่าง...</p>
        </div>
      ) : staffList.length === 0 ? (
        <div className="bg-white p-6 rounded-2xl border text-center text-xs text-slate-500">
          ยังไม่มีข้อมูลช่างทำผมในระบบ
        </div>
      ) : (
        <div className="space-y-3">
          {staffList.map((st) => (
            <div key={st.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-salon-100 text-salon-700 font-bold text-lg flex items-center justify-center border border-salon-200">
                  {st.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    ช่าง{st.name} {st.nickname ? `(${st.nickname})` : ''}
                  </h3>
                  <p className="text-xs text-slate-500">{st.phone || 'ช่างประจำร้าน'}</p>
                </div>
              </div>
              <Link
                href="/liff"
                className="px-3 py-1.5 bg-salon-50 text-salon-700 font-bold text-xs rounded-xl border border-salon-200 hover:bg-salon-100"
              >
                จองช่างคนนี้
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
