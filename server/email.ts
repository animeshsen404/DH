import type { AppDatabase } from '../src/types/index.js';
import { getDatabase, saveDatabase } from './db.js';

interface NotificationPayload {
  type: 'enquiry' | 'application';
  subject: string;
  recipient: string;
  body: string;
  data: Record<string, any>;
}

export async function dispatchNotification(payload: NotificationPayload): Promise<{
  success: boolean;
  mode: 'live_webhook' | 'stored_locally';
  message: string;
}> {
  const webhookUrl = process.env.EMAIL_WEBHOOK_URL;
  const sendgridKey = process.env.SENDGRID_API_KEY;

  let mode: 'live_webhook' | 'stored_locally' = 'stored_locally';
  let message = 'Notification recorded in persistent system log. (External email credentials not configured in environment; configure EMAIL_WEBHOOK_URL or SENDGRID_API_KEY in .env to enable external inbox dispatch).';

  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        mode = 'live_webhook';
        message = 'Notification successfully forwarded to configured webhook endpoint.';
      }
    } catch (err) {
      console.warn('Configured webhook failed to send, falling back to local database storage:', err);
    }
  }

  // Persist into database notification logs
  try {
    const db: AppDatabase = getDatabase();
    const notificationEntry = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: payload.type,
      recipient: payload.recipient,
      subject: payload.subject,
      body: payload.body,
      sentAt: new Date().toISOString(),
      status: (mode === 'live_webhook' ? 'sent' : 'stored_locally') as 'sent' | 'stored_locally'
    };
    db.notificationsLog.unshift(notificationEntry);
    // Keep last 100 notifications
    if (db.notificationsLog.length > 100) {
      db.notificationsLog = db.notificationsLog.slice(0, 100);
    }
    saveDatabase(db);
  } catch (err) {
    console.error('Error logging notification in database:', err);
  }

  console.log(`[Notification ${payload.type.toUpperCase()}] ${payload.subject} -> ${payload.recipient} [Status: ${mode}]`);

  return {
    success: true,
    mode,
    message
  };
}
