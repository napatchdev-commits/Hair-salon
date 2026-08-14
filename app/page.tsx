import Link from 'next/link';
import { Scissors, Calendar, ShieldCheck, Sparkles, Smartphone, ChevronRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-salon-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-8 relative z-10">
        {/* Header Badge */}
        <div className="space-y-3">
          <div className="w-16 h-16 bg-salon-700/40 border border-salon-500/40 text-salon-400 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
            <Scissors className="w-8 h-8 text-salon-gold" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">HAIR SALON</h1>
          <p className="text-xs font-medium text-slate-400 max-w-xs mx-auto">
            ระบบจองคิวร้านทำผมผ่าน LINE Official Account & LIFF
          </p>
        </div>

        {/* Action Buttons Container */}
        <div className="space-y-3">
          <Link
            href="/liff"
            className="w-full p-4 bg-gradient-to-r from-salon-700 via-salon-600 to-salon-800 hover:from-salon-600 hover:to-salon-700 text-white rounded-2xl font-bold shadow-xl transition-all flex items-center justify-between border border-white/10 group"
          >
            <div className="flex items-center space-x-3 text-left">
              <div className="p-2 bg-white/10 rounded-xl">
                <Smartphone className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold">เปิดแอปจองคิวสำหรับลูกค้า (LIFF App)</h2>
                <p className="text-[11px] text-salon-200">จองคิว เลือกช่าง เลือกเวลา เช็คคิวของฉัน</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/admin"
            className="w-full p-4 bg-slate-800/90 hover:bg-slate-800 text-slate-200 rounded-2xl font-bold border border-slate-700 shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3 text-left">
              <div className="p-2 bg-slate-700 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-salon-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold">เข้าสู่ระบบสำหรับเจ้าของร้าน (Admin)</h2>
                <p className="text-[11px] text-slate-400">แดชบอร์ด ตารางงานช่าง จัดการบริการ</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-500 space-y-1">
          <p>Production Ready • Supabase PostgreSQL • LINE Messaging API</p>
          <p>Timezone: Asia/Bangkok</p>
        </div>
      </div>
    </div>
  );
}
