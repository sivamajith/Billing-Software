const test = require('node:test');
const assert = require('node:assert/strict');
const invoicesModule = require('../routes/invoices');

test('resolveNotificationRecipient falls back to the invoice customer contact details', () => {
  const invoice = { customerEmail: 'customer@example.com', customerPhone: '+919999999999' };

  assert.equal(invoicesModule.resolveNotificationRecipient('email', '', invoice), 'customer@example.com');
  assert.equal(invoicesModule.resolveNotificationRecipient('sms', '', invoice), '+919999999999');
  assert.equal(invoicesModule.resolveNotificationRecipient('whatsapp', '', invoice), '+919999999999');
  assert.equal(invoicesModule.resolveNotificationRecipient('email', 'manual@example.com', invoice), 'manual@example.com');
});

test('buildEmailMessage includes the custom message in the email body', () => {
  const result = invoicesModule.buildEmailMessage('INV-00001', 1250, 'Thanks for your purchase!');

  assert.match(result.text, /Thanks for your purchase/i);
  assert.match(result.html, /Thanks for your purchase/i);
  assert.match(result.html, /INV-00001/i);
});

test('email notification reports a skipped state when SMTP is not configured', async () => {
  const result = await invoicesModule.sendEmailNotification(
    'customer@example.com',
    'Invoice INV-00001',
    'Invoice ready',
    Buffer.from('pdf-data'),
    'INV-00001'
  );

  assert.equal(result.success, false);
  assert.match(result.message, /SMTP/i);
});

test('sms notification reports a skipped state when Twilio is not configured', async () => {
  const result = await invoicesModule.sendSMSNotification('+919999999999', 'Invoice ready');

  assert.equal(result.success, false);
  assert.match(result.message, /Twilio|SMS/i);
});

test('whatsapp notification reports a skipped state when Twilio is not configured', async () => {
  const result = await invoicesModule.sendWhatsAppNotification('+919999999999', 'Invoice ready');

  assert.equal(result.success, false);
  assert.match(result.message, /Twilio|WhatsApp/i);
});
