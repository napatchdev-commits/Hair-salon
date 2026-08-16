import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { formatTo24HourTime } from '@/lib/utils/time';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: setting, error } = await supabaseAdmin
      .from('settings')
      .select('*')
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ setting });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      salonName,
      phone,
      address,
      googleMapsUrl,
      openTime,
      closeTime,
      minCancelHours,
      advanceBookingDays,
      reminder24h,
      reminder1h,
      lineAdminUserId,
    } = body;

    const payload = {
      salon_name: salonName,
      phone: phone || '',
      address: address || '',
      google_maps_url: googleMapsUrl || '',
      open_time: formatTo24HourTime(openTime, '07:00:00'),
      close_time: formatTo24HourTime(closeTime, '21:00:00'),
      min_cancel_hours: Number(minCancelHours) || 2,
      advance_booking_days: Number(advanceBookingDays) || 30,
      reminder_24h_active: Boolean(reminder24h),
      reminder_1h_active: Boolean(reminder1h),
      line_admin_user_id: lineAdminUserId || '',
      updated_at: new Date().toISOString(),
    };

    let result;
    if (id) {
      const { data, error } = await supabaseAdmin
        .from('settings')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Check if existing setting row exists
      const { data: existing } = await supabaseAdmin.from('settings').select('id').maybeSingle();
      if (existing) {
        const { data, error } = await supabaseAdmin
          .from('settings')
          .update(payload)
          .eq('id', existing.id)
          .select()
          .single();
        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabaseAdmin
          .from('settings')
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        result = data;
      }
    }

    return NextResponse.json({ success: true, setting: result });
  } catch (err: any) {
    console.error('Save settings API error:', err);
    return NextResponse.json({ error: err.message || 'ไม่สามารถบันทึกการตั้งค่าได้' }, { status: 500 });
  }
}
