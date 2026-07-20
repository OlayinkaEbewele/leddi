export const DEMAND_NOTICE_TEMPLATE_HTML = `<p><strong>Subject: Demand Notice — Outstanding Loan Arrears</strong></p>
<p>Dear Customer,</p>
<p>This is to formally notify you that your loan account remains in arrears. Despite previous reminders, we have not received the outstanding instalment(s) due on your facility.</p>
<p>Please remit the full overdue amount within <strong>7 calendar days</strong> of this notice to avoid further recovery action, including possible repossession of the financed asset.</p>
<p>If you have already made payment, kindly disregard this notice and forward proof of payment to our collections team.</p>
<p>Regards,<br/>Collections Operations</p>`;

export const PAYMENT_REMINDER_TEMPLATE_HTML = `<p>Dear Customer,</p>
<p>This is a friendly reminder that your loan repayment is due. Please ensure payment is made on or before the due date to avoid penalties.</p>
<p>Regards,<br/>Collections Operations</p>`;

export const NOTE_TEMPLATE_OPTIONS = [
  { value: 'demand_notice', html: DEMAND_NOTICE_TEMPLATE_HTML },
  { value: 'payment_reminder', html: PAYMENT_REMINDER_TEMPLATE_HTML },
] as const;

export type NoteTemplateValue = (typeof NOTE_TEMPLATE_OPTIONS)[number]['value'];

export const NOTE_CHANNEL_OPTIONS = ['EMAIL', 'SMS', 'WHATSAPP', 'PHONE_CALL'] as const;

export type NoteChannelValue = (typeof NOTE_CHANNEL_OPTIONS)[number];
