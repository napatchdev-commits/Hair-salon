import { NextRequest, NextResponse } from 'next/server';
import { validateSignature, lineClient } from '@/lib/line/bot';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { formatCurrency } from '@/lib/utils/formatters';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-line-signature') || '';

    // Validate LINE signature
    if (process.env.NODE_ENV === 'production' && !validateSignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const events = payload.events || [];

    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const text = event.message.text.trim();
        const replyToken = event.replyToken;
        const liffUrl = process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/liff` : 'https://liff.line.me/' + process.env.NEXT_PUBLIC_LIFF_ID;

        if (text.includes('จองคิว') || text.includes('จอง')) {
          await lineClient.replyMessage({
            replyToken,
            messages: [
              {
                type: 'text',
                text: `✂️ จองคิวทำผมออนไลน์ได้ง่ายๆ ผ่านลิงก์ด้านล่างนี้ได้เลยครับ:\n\n👉 ${liffUrl}`
              }
            ]
          });
        } else if (text.includes('คิวของฉัน') || text.includes('เช็คคิว')) {
          await lineClient.replyMessage({
            replyToken,
            messages: [
              {
                type: 'text',
                text: `🗓 ตรวจสอบคิวของฉันและจัดการการจอง:\n\n👉 ${liffUrl}/my-queue`
              }
            ]
          });
        } else if (text.includes('บริการ') || text.includes('เมนู')) {
          // Fetch active services from DB
          const { data: services } = await supabaseAdmin
            .from('services')
            .select('*')
            .eq('status', true);

          if (!services || services.length === 0) {
            await lineClient.replyMessage({
              replyToken,
              messages: [{ type: 'text', text: 'ยังไม่มีข้อมูลบริการในขณะนี้' }]
            });
          } else {
            const listText = services
              .map((s) => `• ${s.name}: ${formatCurrency(s.price)} (${s.duration_minutes} นาที)`)
              .join('\n');
            await lineClient.replyMessage({
              replyToken,
              messages: [
                {
                  type: 'text',
                  text: `💇 รายการบริการของทางร้าน:\n\n${listText}\n\nกดจองคิวได้เลยที่: ${liffUrl}`
                }
              ]
            });
          }
        } else if (text.includes('ช่าง')) {
          // Fetch active staff from DB
          const { data: staffList } = await supabaseAdmin
            .from('staff')
            .select('*')
            .eq('status', true);

          if (!staffList || staffList.length === 0) {
            await lineClient.replyMessage({
              replyToken,
              messages: [{ type: 'text', text: 'ยังไม่มีข้อมูลช่างทำผมในขณะนี้' }]
            });
          } else {
            const staffText = staffList
              .map((st) => `• ช่าง${st.name} ${st.nickname ? `(${st.nickname})` : ''}`)
              .join('\n');
            await lineClient.replyMessage({
              replyToken,
              messages: [
                {
                  type: 'text',
                  text: `👩‍🦰 ทีมช่างประจำร้าน:\n\n${staffText}\n\nเลือกช่างและจองคิว: ${liffUrl}`
                }
              ]
            });
          }
        } else if (text.includes('ติดต่อร้าน') || text.includes('ที่อยู่') || text.includes('เบอร์')) {
          const { data: setting } = await supabaseAdmin
            .from('settings')
            .select('*')
            .maybeSingle();

          const name = setting?.salon_name || 'Hair Salon';
          const phone = setting?.phone || '-';
          const address = setting?.address || '-';
          const maps = setting?.google_maps_url ? `\n🗺 Google Maps: ${setting.google_maps_url}` : '';

          await lineClient.replyMessage({
            replyToken,
            messages: [
              {
                type: 'text',
                text: `📍 ข้อมูลการติดต่อร้าน ${name}\n\n📞 เบอร์โทรศัพท์: ${phone}\n🏢 ที่อยู่: ${address}${maps}`
              }
            ]
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('LINE Webhook Error:', error);
    return NextResponse.json({ error: error.message || 'Webhook internal error' }, { status: 500 });
  }
}
