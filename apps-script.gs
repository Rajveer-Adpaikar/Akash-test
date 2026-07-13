/**
 * Akash The Band — Inquiry Form Handler
 *
 * 1. Paste this entire file into Extensions → Apps Script in your Google Sheet
 * 2. Deploy → New deployment → Web app → Execute as "Me", Access "Anyone"
 * 3. Copy the web app URL → set as VITE_GOOGLE_SHEETS_URL in Netlify env vars
 *
 * Writes submissions to the sheet + emails you the details.
 */

var SHEET_NAME = 'Inquiries';
var NOTIFY_EMAIL = 'goku006900@gmail.com';

function ensureSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (sheet) return sheet;
  sheet = ss.insertSheet(SHEET_NAME);
  sheet.appendRow(['Timestamp', 'Name', 'Phone', 'Email', 'Message']);
  sheet.getRange('1:1').setFontWeight('bold');
  return sheet;
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var name = body.name;
    var phone = body.phone;
    var email = body.email;
    var message = body.message;

    // Write to sheet
    var sheet = ensureSheet_();
    sheet.appendRow([new Date(), name, phone, email || '-', message || '-']);

    // Email notification
    var subject = '🎵 New Inquiry: ' + name + ' — Akash The Band';
    var html =
      '<h2>New Booking Inquiry</h2>' +
      '<table style="font-size:14px;border-collapse:collapse;width:100%;max-width:500px">' +
      '<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Name</td>' +
      '<td style="padding:8px;border:1px solid #ddd">' + name + '</td></tr>' +
      '<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Phone</td>' +
      '<td style="padding:8px;border:1px solid #ddd"><a href="tel:' + phone + '">' + phone + '</a></td></tr>' +
      '<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Email</td>' +
      '<td style="padding:8px;border:1px solid #ddd">' + (email || '-') + '</td></tr>' +
      '<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Message</td>' +
      '<td style="padding:8px;border:1px solid #ddd">' + (message || '-') + '</td></tr>' +
      '<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Time</td>' +
      '<td style="padding:8px;border:1px solid #ddd">' + new Date().toLocaleString('en-IN') + '</td></tr>' +
      '</table>';

    MailApp.sendEmail(NOTIFY_EMAIL, subject, '', { htmlBody: html });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
