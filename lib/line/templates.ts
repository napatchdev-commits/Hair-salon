import { formatThaiDate, formatTimeSlot } from '@/lib/utils/time';
import { formatCurrency } from '@/lib/utils/formatters';

export function createBookingConfirmationMessage(data: {
  queueNumber: string;
  customerName: string;
  serviceName: string;
  staffName: string;
  bookingDate: string;
  startTime: string;
  price: number;
  salonName?: string;
  salonPhone?: string;
}) {
  return [
    {
      type: 'flex',
      altText: `ยืนยันการจองคิว #${data.queueNumber}`,
      contents: {
        type: 'bubble',
        size: 'mega',
        header: {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#7e22ce',
          paddingAll: '20px',
          contents: [
            {
              type: 'text',
              text: '✂️ จองคิวสำเร็จแล้ว!',
              weight: 'bold',
              color: '#ffffff',
              size: 'xl'
            },
            {
              type: 'text',
              text: `หมายเลขคิว: ${data.queueNumber}`,
              color: '#e9d5ff',
              size: 'sm',
              marginTop: '5px'
            }
          ]
        },
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          contents: [
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                { type: 'text', text: 'ชื่อลูกค้า:', color: '#666666', size: 'sm', flex: 2 },
                { type: 'text', text: data.customerName, weight: 'bold', color: '#111111', size: 'sm', flex: 3 }
              ]
            },
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                { type: 'text', text: 'บริการ:', color: '#666666', size: 'sm', flex: 2 },
                { type: 'text', text: data.serviceName, weight: 'bold', color: '#7e22ce', size: 'sm', flex: 3 }
              ]
            },
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                { type: 'text', text: 'ช่างทำผม:', color: '#666666', size: 'sm', flex: 2 },
                { type: 'text', text: data.staffName, weight: 'bold', color: '#111111', size: 'sm', flex: 3 }
              ]
            },
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                { type: 'text', text: 'วันที่:', color: '#666666', size: 'sm', flex: 2 },
                { type: 'text', text: formatThaiDate(data.bookingDate), weight: 'bold', color: '#111111', size: 'sm', flex: 3 }
              ]
            },
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                { type: 'text', text: 'เวลา:', color: '#666666', size: 'sm', flex: 2 },
                { type: 'text', text: formatTimeSlot(data.startTime), weight: 'bold', color: '#111111', size: 'sm', flex: 3 }
              ]
            },
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                { type: 'text', text: 'ราคา:', color: '#666666', size: 'sm', flex: 2 },
                { type: 'text', text: formatCurrency(data.price), weight: 'bold', color: '#059669', size: 'sm', flex: 3 }
              ]
            }
          ]
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          contents: [
            {
              type: 'text',
              text: 'ขอบคุณที่ใช้บริการครับ/ค่ะ กรุณามาก่อนเวลา 5-10 นาที',
              size: 'xs',
              color: '#888888',
              align: 'center',
              wrap: true
            }
          ]
        }
      }
    }
  ];
}

export function createAdminNewBookingMessage(data: {
  queueNumber: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  staffName: string;
  bookingDate: string;
  startTime: string;
  price: number;
}) {
  return [
    {
      type: 'text',
      text: `🔔 มีการจองคิวใหม่เข้ามา!\n\n📌 คิวที่: ${data.queueNumber}\n👤 ลูกค้า: ${data.customerName} (${data.customerPhone})\n💇 บริการ: ${data.serviceName}\n👩‍🦰 ช่าง: ${data.staffName}\n📅 วันที่: ${formatThaiDate(data.bookingDate)}\n⏰ เวลา: ${formatTimeSlot(data.startTime)}\n💰 ราคา: ${formatCurrency(data.price)}`
    }
  ];
}

export function createReminderMessage(data: {
  queueNumber: string;
  customerName: string;
  serviceName: string;
  staffName: string;
  bookingDate: string;
  startTime: string;
  hoursLeft: number;
}) {
  return [
    {
      type: 'text',
      text: `⏰ แจ้งเตือนคิวทำผม (เหลืออีก ${data.hoursLeft} ชั่วโมง)\n\nสวัสดีครับ คุณ ${data.customerName}\nคุณมีนัดทำผมคิว #${data.queueNumber}\n💇 บริการ: ${data.serviceName}\n👩‍🦰 ช่าง: ${data.staffName}\n📅 วันที่: ${formatThaiDate(data.bookingDate)}\n⏰ เวลา: ${formatTimeSlot(data.startTime)}\n\nแล้วพบกันนะครับ!`
    }
  ];
}
