import { SOSRecipient } from '../types.ts';

export interface SendAlertParams {
  userName: string;
  userPhone: string;
  mapsUrl: string;
  accuracy: number;
  customMessage?: string;
  recipients: Array<{ name: string; phone: string }>;
}

export interface SendAlertResult {
  dispatchedRecipients: SOSRecipient[];
  rawMessage: string;
  isMock: boolean;
}

export class SMSService {
  private hasTwilioCredentials(): boolean {
    return Boolean(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER
    );
  }

  async sendAlert(params: SendAlertParams): Promise<SendAlertResult> {
    const timestamp = new Date().toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const defaultAlert = `EMERGENCY ALERT: ${params.userName} triggered SOS! Location: ${params.mapsUrl}. Accuracy: ~${params.accuracy}m. Time: ${timestamp}. Immediate help requested!`;
    const messageBody = params.customMessage
      ? `${defaultAlert} Note: "${params.customMessage}"`
      : defaultAlert;

    const dispatchedRecipients: SOSRecipient[] = [];

    if (this.hasTwilioCredentials()) {
      try {
        // Dynamic import — only loads if the 'twilio' package is installed
        const { default: twilio } = await import('twilio') as any;
        const client = twilio(
          process.env.TWILIO_ACCOUNT_SID!,
          process.env.TWILIO_AUTH_TOKEN!
        );
        console.log(`[TWILIO] Dispatching SOS alert to ${params.recipients.length} contact(s)...`);
        for (const recipient of params.recipients) {
          try {
            await client.messages.create({
              body: messageBody,
              from: process.env.TWILIO_PHONE_NUMBER!,
              to: recipient.phone,
            });
            dispatchedRecipients.push({ name: recipient.name, phone: recipient.phone, status: 'SENT' });
          } catch (smsErr) {
            console.error(`[TWILIO] Failed to send to ${recipient.phone}:`, smsErr);
            dispatchedRecipients.push({ name: recipient.name, phone: recipient.phone, status: 'FAILED' });
          }
        }
        return { dispatchedRecipients, rawMessage: messageBody, isMock: false };
      } catch (err) {
        console.warn('[TWILIO] Package not available or credentials invalid — falling back to mock mode.', err);
        // Reset and fall through to mock
        dispatchedRecipients.length = 0;
      }
    }

    // High-fidelity Mock SMS Delivery Simulation
    console.log('====================================================');
    console.log('[MOCK SMS SERVICE - HIGH FIDELITY DISPATCH]');
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log(`Sender: ${params.userName} (${params.userPhone})`);
    console.log(`Message: "${messageBody}"`);
    console.log(`Recipients Dispatched:`);
    for (const recipient of params.recipients) {
      console.log(`  -> TO: ${recipient.name} [${recipient.phone}] | Status: MOCK_SENT (Simulated Delivery Delivered via SMS Gateway)`);
      dispatchedRecipients.push({
        name: recipient.name,
        phone: recipient.phone,
        status: 'MOCK_SENT',
      });
    }
    console.log('====================================================');

    return {
      dispatchedRecipients,
      rawMessage: messageBody,
      isMock: true,
    };
  }
}

export const smsService = new SMSService();
