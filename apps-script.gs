/**
 * Akash The Band — Inquiry Form Handler
 *
 * 1. Paste this entire file into Extensions → Apps Script in your Google Sheet
 * 2. Deploy → New deployment → Web app → Execute as "Me", Access "Anyone"
 * 3. Copy the web app URL → set as VITE_GOOGLE_SHEETS_URL in .env
 *
 * Writes submissions to the sheet + emails you the details.
 */

const SHEET_NAME = 'Inquiries';
const NOTIFY_EMAIL = 'kanwarbharat@gmail.com';

function ensureSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (sheet) return sheet;
  sheet = ss.insertSheet(SHEET_NAME);
  sheet.appendRow(['Timestamp', 'Name', 'Phone', 'Email', 'Message']);
  sheet.getRange('1:1').setFontWeight('bold');
  return sheet;
}

function doPost(e: GoogleAppsScript.Events.DoPost) {
  try {
    const body = JSON.parse(e.postData.contents);
    const { name, phone, email, message } = body;

    // Write to sheet
    const sheet = ensureSheet_();
    sheet.appendRow([new Date(), name, phone, email || '-', message || '-']);

    // Email notification
    const subject = `🎵 New Inquiry: ${name} — Akash The Band`;
    const html = `
      <h2>New Booking Inquiry</h2>
      <table style="font-size:14px;border-collapse:collapse;width:100%;max-width:500px">
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Name</td><td style="padding:8px;border:1px solid #ddd">${name}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Phone</td><td style="padding:8px;border:1px solid #ddd"><a href="tel:${phone}">${phone}</a></td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #ddd">${email || '-'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Message</td><td style="padding:8px;border:1px solid #ddd">${message || '-'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Time</td><td style="padding:8px;border:1px solid #ddd">${new Date().toLocaleString('en-IN')}</td></tr>
      </table>`;

    MailApp.sendEmail({ to: NOTIFY_EMAIL, subject, htmlBody: html });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
