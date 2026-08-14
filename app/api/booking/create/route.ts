import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { lineClient } from '@/lib/line/bot';
import { createBookingConfirmationMessage } from '@/lib/line/templates';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      lineUserId,
      customerName,
      customerPhone,
      customerEmail,
      staffId,
      serviceId,
      bookingDate,
      startTime,
      note,
    } = body;

    if (!lineUserId || !customerName || !customerPhone || !staffId || !serviceId || !bookingDate || !startTime) {
      return NextResponse.json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' }, { status: 400 });
    }

    const { data: result, error: rpcError } = await supabaseAdmin.rpc('create_booking_atomic', {
      p_line_user_id: lineUserId,
      p_customer_name: customerName,
      p_customer_phone: customerPhone,
      p_customer_email: customerEmail || null,
      p_staff_id: staffId,
      p_service_id: serviceId,
      p_booking_date: bookingDate,
      p_start_time: startTime,
      p_note: note || null,
    });

    if (rpcError) {
      let friendlyMessage = 'เกิดข้อผิดพลาดในการสร้างคิว';
      if (rpcError.message.includes('TIME_SLOT_ALREADY_BOOKED')) {
        friendlyMessage = 'ขออภัย ช่วงเวลานี้ถูกจองไปแล้ว กรุณาเลือกเวลาอื่น';
      } else if (rpcError.message.includes('STAFF_ON_HOLIDAY')) {
        friendlyMessage = 'ช่างหยุดให้บริการในวันที่เลือก';
      } else if (rpcError.message.includes('OUTSIDE_WORKING_HOURS')) {
        friendlyMessage = 'เวลานี้อยู่นอกเวลาทำการของช่าง';
      } else if (rpcError.message.includes('STAFF_BREAK_CONFLICT')) {
        friendlyMessage = 'เวลานี้ตรงกับเวลาพักของช่าง';
      }
      return NextResponse.json({ error: friendlyMessage }, { status: 400 });
    }

    const { data: staffData } = await supabaseAdmin
      .from('staff')
      .select('name, nickname')
      .eq('id', staffId)
      .single();

    const staffDisplayName = staffData
      ? `ช่าง${staffData.name} ${staffData.nickname ? `(${staffData.nickname})` : ''}`
      : 'ช่าง';

    try {
      const messages = createBookingConfirmationMessage({
        queueNumber: result.queue_number,
        customerName: customerName,
        serviceName: result.service_name,
        staffName: staffDisplayName,
        bookingDate: bookingDate,
        startTime: startTime,
        price: result.price,
      });

      await lineClient.pushMessage({
        to: lineUserId,
        messages: messages as any,
      });

      await supabaseAdmin.from('notifications').insert({
        appointment_id: result.appointment_id,
        customer_id: result.customer_id,
        notification_type: 'booking_created',
        status: 'success',
      });
    } catch (lineErr: any) {
      console.error('Customer LINE push failed:', lineErr);
      await supabaseAdmin.from('notifications').insert({
        appointment_id: result.appointment_id,
        customer_id: result.customer_id,
        notification_type: 'booking_created',
        status: 'failed',
        error_message: lineErr.message,
      });
    }

    return NextResponse.json({
      success: true,
      appointmentId: result.appointment_id,
      queueNumber: result.queue_number,
      message: 'จองคิวสำเร็จแล้ว',
    });
  } catch (err: any) {
    console.error('Booking create API error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
