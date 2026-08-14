'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils/formatters';
import { Scissors, Plus, Edit2, Clock, DollarSign, Loader2 } from 'lucide-react';

export default function AdminServicesPage() {
  const supabase = createClient();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Service Modal
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingSrv, setEditingSrv] = useState<any>(null);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [duration, setDuration] = useState<string>('60');
  const [status, setStatus] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('price', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingSrv(null);
    setName('');
    setDescription('');
    setPrice('');
    setDuration('60');
    setStatus(true);
    setShowModal(true);
  }

  function openEditModal(srv: any) {
    setEditingSrv(srv);
    setName(srv.name);
    setDescription(srv.description || '');
    setPrice(srv.price.toString());
    setDuration(srv.duration_minutes.toString());
    setStatus(srv.status);
    setShowModal(true);
  }

  async function handleSaveService() {
    if (!name.trim() || !price || !duration) {
      alert('กรุณากรอกข้อมูลบริการ ราคา และระยะเวลาให้ครบถ้วน');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name,
        description,
        price: parseFloat(price),
        duration_minutes: parseInt(duration),
        status,
      };

      if (editingSrv) {
        const { error } = await supabase.from('services').update(payload).eq('id', editingSrv.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('services').insert(payload);
        if (error) throw error;
      }

      setShowModal(false);
      fetchServices();
    } catch (err: any) {
      alert(err.message || 'ไม่สามารถบันทึกข้อมูลบริการได้');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-white">บริการและราคา (Services)</h1>
          <p className="text-xs text-slate-400">เพิ่ม/แก้ไข รายการบริการ อัตราค่าบริการ และเวลาเปิด/ปิดจอง</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-3.5 py-2 bg-salon-600 hover:bg-salon-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มบริการใหม่</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin text-salon-500" />
          <span className="ml-2 text-xs">กำลังโหลดรายการบริการ...</span>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-12 text-center text-xs text-slate-500">
          ยังไม่มีรายการบริการในระบบ กรุณากดปุ่ม "เพิ่มบริการใหม่" ด้านบน
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-slate-800 border border-slate-700/60 p-5 rounded-2xl space-y-3 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-extrabold text-base text-white">{srv.name}</h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      srv.status
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {srv.status ? 'เปิดบริการ' : 'ปิดบริการ'}
                  </span>
                </div>
                {srv.description && (
                  <p className="text-xs text-slate-400 line-clamp-2">{srv.description}</p>
                )}
                <div className="flex items-center space-x-4 pt-1 text-xs">
                  <span className="font-extrabold text-salon-400 text-sm">
                    {formatCurrency(srv.price)}
                  </span>
                  <span className="text-slate-500 flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {srv.duration_minutes} นาที
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-700/50 flex justify-end">
                <button
                  onClick={() => openEditModal(srv)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center space-x-1"
                >
                  <Edit2 className="w-3.5 h-3.5 text-salon-400" />
                  <span>แก้ไขบริการ</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm text-white">
              {editingSrv ? 'แก้ไขข้อมูลบริการ' : 'เพิ่มบริการใหม่'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">ชื่อบริการ <span className="text-rose-400">*</span></label>
                <input
                  type="text"
                  placeholder="เช่น ตัดผมชาย / ดัดผมดิจิทัล"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">รายละเอียดบริการ</label>
                <textarea
                  placeholder="อธิบายรายละเอียดบริการเพิ่มเติม"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">ราคา (บาท) <span className="text-rose-400">*</span></label>
                  <input
                    type="number"
                    placeholder="350"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">ระยะเวลา (นาที) <span className="text-rose-400">*</span></label>
                  <input
                    type="number"
                    step="15"
                    placeholder="60"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-300 font-semibold">สถานะเปิดบริการ:</span>
                <button
                  type="button"
                  onClick={() => setStatus(!status)}
                  className={`px-3 py-1.5 rounded-xl font-bold ${
                    status ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                  }`}
                >
                  {status ? 'เปิดบริการ' : 'ปิดบริการ'}
                </button>
              </div>
            </div>

            <div className="flex space-x-2 pt-2 text-xs font-bold">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 bg-slate-700 text-slate-300 rounded-xl"
              >
                ยกเลิก
              </button>
              <button
                disabled={saving}
                onClick={handleSaveService}
                className="flex-1 py-2.5 bg-salon-600 text-white rounded-xl shadow-md"
              >
                {saving ? 'กำลังบันทึก...' : 'บันทึกบริการ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
