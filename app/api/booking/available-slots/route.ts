import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get('staffId');
    const serviceId = searchParams.get('serviceId');
    const bookingDate = searchParams.get('bookingDate');

    if (!staffId || !serviceId || !bookingDate) {
      return NextResponse.json({ error: 'Missing staffId, serviceId, or bookingDate' }, { status: 400 });
    }

    // Call stored procedure get_available_time_slots
    const { data: slots, error } = await supabaseAdmin.rpc('get_available_time_slots', {
      p_staff_id: staffId,
      p_service_id: serviceId,
      p_booking_date: bookingDate,
    });

    if (error) {
      console.error('Available slots RPC error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const availableSlots = (slots || []).map((s: { slot_time: string }) => s.slot_time);

    return NextResponse.json({ slots: availableSlots });
  } catch (err: any) {
    console.error('Available slots API error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
