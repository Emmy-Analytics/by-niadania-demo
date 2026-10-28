/**
 * By.Niadania public API (read-only)
 * Tabs: "Menu" (price list) and "Portfolio" (karya).
 * Upload workbook to Google Sheets, then set SPREADSHEET_ID.
 * Deploy as Web App only if this data is intended to be public.
 * All prices and portfolio items must be confirmed by the owner before production.
 *
 * Endpoints:
 *   ?action=prices               (default when no action)  -> price list from "Menu"
 *   ?action=portfolio            -> portfolio items from "Portfolio" (status_data=PUBLISHED only)
 *   ?category=...                -> optional filter for either endpoint
 * Backward compatible: requests without an action parameter still return the price list.
 */
const SPREADSHEET_ID = 'PASTE_GOOGLE_SHEET_ID_HERE';
const SHEET_NAME = 'Menu';
const PORTFOLIO_SHEET_NAME = 'Portfolio';

function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const action = e && e.parameter && e.parameter.action
      ? String(e.parameter.action).trim().toLowerCase() : '';

    if (action === 'portfolio') {
      return json_(readSheet_(ss, PORTFOLIO_SHEET_NAME, e, filterPublished_));
    }
    // Default: existing price-list behavior (unchanged contract)
    return json_(readSheet_(ss, SHEET_NAME, e));
  } catch (err) {
    return json_({ success: false, error: String(err.message || err), data: [] });
  }
}

/**
 * Reads a sheet by name, maps rows by header, applies optional category filter,
 * and applies an optional row-level validator (e.g. portfolio publish status).
 */
function readSheet_(ss, sheetName, e, rowValidator) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error('Tab "' + sheetName + '" tidak ditemukan.');

  const values = sheet.getDataRange().getDisplayValues();
  if (values.length < 2) return { success: true, count: 0, data: [] };

  const headers = values[0].map(h => String(h).trim());
  let data = values.slice(1)
    .filter(row => row.some(cell => String(cell).trim() !== ''))
    .map(row => {
      const obj = {};
      headers.forEach((header, i) => obj[header] = row[i] || '');
      return obj;
    });

  if (rowValidator) data = data.filter(rowValidator);

  const category = e && e.parameter && e.parameter.category
    ? String(e.parameter.category).trim().toLowerCase() : '';
  if (category) {
    data = data.filter(item => String(item.kategori || '').trim().toLowerCase() === category);
  }

  return { success: true, count: data.length, data: data };
}

/**
 * Portfolio rows: only PUBLISHED items go to the public site.
 * DRAFT, empty, or any other status value stays hidden.
 */
function filterPublished_(row) {
  const status = String(row.status_data || '').trim().toLowerCase();
  if (status !== 'published') return false;
  // Required fields for a usable portfolio item
  if (!row.id || !row.judul || !row.instagram_url) return false;
  return true;
}

/**
 * Test helper: checks the Portfolio tab exists and shows the parsed data.
 * Run from the Apps Script editor, not the deployed web app.
 */
function testReadPortfolio() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  Logger.log(readSheet_(ss, PORTFOLIO_SHEET_NAME, null, filterPublished_));
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function testReadMenu() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  Logger.log(readSheet_(ss, SHEET_NAME, null));
}
