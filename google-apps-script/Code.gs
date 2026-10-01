/**
 * ===================================================================
 * AI.LABS — Demo Booking Form Backend (Google Apps Script)
 * ===================================================================
 * This script receives demo booking submissions from the AI.LABS
 * website, appends the data to Google Sheets, and sends an email
 * notification to the website owner.
 * ===================================================================
 */

// CONFIGURATION: Set your owner notification email and optional sheet details here
const CONFIG = {
  // Website Owner Email to receive demo notifications
  OWNER_EMAIL: 'info@aidotlabs.in', // <-- Replace with your email address
  
  // Optional: If this script is NOT bound to the spreadsheet, paste the Spreadsheet ID here.
  // If this script is created via Extensions > Apps Script inside the Google Sheet, leave this empty.
  SPREADSHEET_ID: '', 
  
  // Name of the sheet/tab to store responses
  SHEET_NAME: 'Demo Bookings'
};

/**
 * Handles HTTP GET requests (for testing and health checks)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'AI.LABS Demo Booking API is active and running.'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handles HTTP POST requests from the website demo booking form
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  
  try {
    // Wait for up to 30 seconds for other concurrent requests
    lock.waitLock(30000);
    
    // Parse incoming data (supports both JSON payload and form encoded data)
    let data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }
    
    // Extract submission fields with fallbacks
    const lookingFor = data.lookingFor || data.category || 'School Partnership';
    const demoAudience = data.demoAudience || data.target || 'School';
    const studentCount = data.studentCount || data.scale || '10–20';
    const fullName = data.fullName || data.name || 'Anonymous';
    const organization = data.organization || data.orgName || data.school || 'N/A';
    const email = data.email || 'N/A';
    const mobile = data.mobile || data.phone || 'N/A';
    
    const timestamp = new Date();
    const formattedTimestamp = Utilities.formatDate(timestamp, Session.getScriptTimeZone() || 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss');
    
    // 1. Save data to Google Sheet
    const sheet = getTargetSheet();
    sheet.appendRow([
      formattedTimestamp,
      lookingFor,
      demoAudience,
      studentCount,
      fullName,
      organization,
      email,
      mobile
    ]);
    
    // 2. Send email notification to owner
    sendOwnerNotificationEmail({
      timestamp: formattedTimestamp,
      lookingFor: lookingFor,
      demoAudience: demoAudience,
      studentCount: studentCount,
      fullName: fullName,
      organization: organization,
      email: email,
      mobile: mobile
    });
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Demo booking submitted successfully!'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } finally {
    lock.releaseLock();
  }
}

/**
 * Retrieves the target Google Sheet, creating default headers if empty
 */
function getTargetSheet() {
  let ss;
  if (CONFIG.SPREADSHEET_ID && CONFIG.SPREADSHEET_ID.trim() !== '') {
    ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID.trim());
  } else {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }
  
  if (!ss) {
    throw new Error('Spreadsheet not found. Please bind this script to a Google Sheet or provide SPREADSHEET_ID.');
  }
  
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    // If specific tab does not exist, use active sheet or create one
    sheet = ss.getActiveSheet();
    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    }
  }
  
  // Check if headers exist, if not, add them
  if (sheet.getLastRow() === 0) {
    const headers = [
      'Timestamp',
      'Looking For',
      'Demo Audience',
      'Student Count',
      'Full Name',
      'School / Organization',
      'Email',
      'Mobile Number'
    ];
    sheet.appendRow(headers);
    
    // Format header row with blue style
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#0055ff');
    headerRange.setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    
    // Auto-resize columns
    for (let i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
  }
  
  return sheet;
}

/**
 * Sends a rich HTML email notification to the site owner
 */
function sendOwnerNotificationEmail(info) {
  if (!CONFIG.OWNER_EMAIL || CONFIG.OWNER_EMAIL.includes('example.com')) {
    Logger.log('Owner email not configured or using example.com. Skipping email.');
    return;
  }
  
  const subject = `🚀 New Demo Booking: ${info.fullName} (${info.organization})`;
  
  const plainBody = `
New Demo Booking Request Received!

• Timestamp: ${info.timestamp}
• Full Name: ${info.fullName}
• School / Organization: ${info.organization}
• Email: ${info.email}
• Mobile: ${info.mobile}
• Looking For: ${info.lookingFor}
• Demo Audience: ${info.demoAudience}
• Student Count: ${info.studentCount}

Log into your Google Sheet to view full details.
  `.trim();

  const htmlBody = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7fc; margin: 0; padding: 24px; color: #1e293b; }
      .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0, 85, 255, 0.08); border: 1px solid #e2e8f0; }
      .header { background: linear-gradient(135deg, #0055ff, #00c3ff); padding: 28px; text-align: center; color: #ffffff; }
      .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
      .header p { margin: 6px 0 0 0; opacity: 0.9; font-size: 14px; }
      .content { padding: 28px; }
      .section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 12px; }
      .info-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
      .info-table td { padding: 10px 14px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
      .info-table td.label { width: 38%; font-weight: 600; color: #475569; background-color: #f8fafc; }
      .info-table td.val { width: 62%; color: #0f172a; font-weight: 500; }
      .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; background: #eff6ff; color: #0055ff; }
      .footer { background-color: #f8fafc; padding: 18px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      .cta-btn { display: inline-block; background: #0055ff; color: #ffffff !important; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 13px; margin-top: 8px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>AI.LABS — New Demo Booking</h1>
        <p>A new potential partner has booked a demo session</p>
      </div>
      <div class="content">
        <div class="section-title">Contact Information</div>
        <table class="info-table">
          <tr>
            <td class="label">Full Name</td>
            <td class="val"><strong>${info.fullName}</strong></td>
          </tr>
          <tr>
            <td class="label">Organization / School</td>
            <td class="val">${info.organization}</td>
          </tr>
          <tr>
            <td class="label">Email Address</td>
            <td class="val"><a href="mailto:${info.email}" style="color: #0055ff; text-decoration: none;">${info.email}</a></td>
          </tr>
          <tr>
            <td class="label">Mobile Number</td>
            <td class="val"><a href="tel:${info.mobile}" style="color: #0055ff; text-decoration: none;">+91 ${info.mobile}</a></td>
          </tr>
          <tr>
            <td class="label">Submitted On</td>
            <td class="val">${info.timestamp}</td>
          </tr>
        </table>

        <div class="section-title">Demo Requirements</div>
        <table class="info-table">
          <tr>
            <td class="label">Looking For</td>
            <td class="val"><span class="badge">${info.lookingFor}</span></td>
          </tr>
          <tr>
            <td class="label">Demo Audience</td>
            <td class="val"><span class="badge">${info.demoAudience}</span></td>
          </tr>
          <tr>
            <td class="label">Estimated Students</td>
            <td class="val"><span class="badge">${info.studentCount}</span></td>
          </tr>
        </table>

        <div style="text-align: center; margin-top: 20px;">
          <a href="tel:${info.mobile}" class="cta-btn">📞 Call Contact Directly</a>
        </div>
      </div>
      <div class="footer">
        Automated notification from AI.LABS Website Demo Booking System.<br>
        Powered by RoboAI Hub
      </div>
    </div>
  </body>
  </html>
  `;

  try {
    MailApp.sendEmail({
      to: CONFIG.OWNER_EMAIL,
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody
    });
  } catch (err) {
    Logger.log('Failed to send email: ' + err.toString());
  }
}
