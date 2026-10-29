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
    if (action === 'reviews') {
      return json_(doGetReviews_(e));
    }
    // Default: existing price-list behavior (unchanged contract)
    return json_(readSheet_(ss, SHEET_NAME, e));
  } catch (err) {
    return json_({ success: false, error: String(err.message || err), data: [] });
  }
}

/** POST handler: multipart/form-data from reviews.js (action=submitReview). */
function doPost(e) {
  try {
    const params = (e && e.parameter) || {};
    const action = String(params.action || '').trim().toLowerCase();
    if (action !== 'submitreview') return json_({ success: false, message: 'Unknown action' });
    const payload = {
      display_name: params.display_name,
      service_name: params.service_name,
      rating: params.rating,
      review_text: params.review_text,
      lang: params.lang
    };
    // mediaFile name is a parameter; actual blob comes from e.parameters.<name>
    const mediaParam = String(params.mediaFile || '').trim();
    if (mediaParam && e.parameters && e.parameters[mediaParam]) {
      payload.media = e.parameters[mediaParam][0];
    }
    if (payload.media) {
      payload.media.bytes = Utilities.base64Decode(params.mediaData);
    }
    const res = submitReview_(payload);
    return json_(res);
  } catch (err) {
    return json_({ success: false, message: 'Server error' });
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

/* ================= Customer reviews (PENDING -> PUBLISHED) =================
 * New tab "Reviews" (created lazily). One row per review; media stored as
 * pipe-separated Drive file IDs per review. Public endpoint returns only
 * PUBLISHED rows. Owner moderates by editing the status column in the Sheet.
 * Frontend review form posts here as multipart/form-data (see reviews.js).
 *
 * Deployment: after editing this file, create a NEW deployment (or redeploy)
 * so the live web app picks the changes up.
 */
const REVIEWS_SHEET_NAME = 'Reviews';
const REVIEWS_FOLDER_NAME = 'By.Niadania Reviews';
const REVIEW_PHOTO_MAX_MB = 5;
const REVIEW_VIDEO_MAX_MB = 40;
const REVIEW_MEDIA_MAX_FILES = 3;
const REVIEW_TEXT_MAX_LEN = 1000;

// Ensure the Reviews tab exists with the canonical header order.
function ensureReviewsSheet_(ss) {
  let sheet = ss.getSheetByName(REVIEWS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(REVIEWS_SHEET_NAME);
    sheet.appendRow(['review_id', 'created_at', 'display_name', 'service_id', 'service_name',
      'rating', 'review_text', 'media_ids', 'media_types', 'media_urls',
      'status', 'moderated_at', 'moderator_note']);
  }
  return sheet;
}

function reviewsFolder_(ss) {
  const it = DriveApp.getFoldersByName(REVIEWS_FOLDER_NAME);
  return it.hasNext() ? it.next() : DriveApp.createFolder(REVIEWS_FOLDER_NAME);
}

function newReviewId_() {
  return 'rv_' + Utilities.getUuid().replace(/-/g, '').slice(0, 20);
}

function validReviewRating_(value) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : null;
}

function uploadReviewMedia_(file) {
  const folder = reviewsFolder_();
  const blob = file.getAs(file.getName().toLowerCase().endsWith('.webm') ? 'video/webm' : file.getContentType() || 'application/octet-stream');
  const created = folder.createFile(blob.setName('rv_' + Date.now() + '_' + file.getName()));
  try { created.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (e) { /* permissions locked by domain */ }
  return { id: created.getId(), type: blob.getContentType().startsWith('video/') ? 'video' : 'photo', name: file.getName() };
}

function doGetReviews_(e) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ensureReviewsSheet_(ss);
  const values = sheet.getDataRange().getDisplayValues();
  if (values.length < 2) return { success: true, count: 0, data: [] };
  const headers = values[0].map(h => String(h).trim());
  const data = values.slice(1)
    .filter(row => row.some(c => String(c).trim() !== ''))
    .map(row => {
      const o = {};
      headers.forEach((h, i) => o[h] = row[i] || '');
      return o;
    })
    .filter(r => String(r.status || '').trim().toLowerCase() === 'published')
    .map(r => ({
      review_id: r.review_id,
      display_name: r.display_name,
      service_name: r.service_name,
      rating: Number(r.rating) || 0,
      review_text: r.review_text,
      created_at_display: r.created_at,
      media_urls: String(r.media_urls || '').split('|').filter(Boolean),
      media_types: String(r.media_types || '').split('|').filter(Boolean)
    }));
  return { success: true, count: data.length, data: data };
}

/** Submits a customer review. Always stores as PENDING. */
function submitReview_(payload) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ensureReviewsSheet_(ss);
    const name = String(payload.display_name || '').trim();
    const serviceName = String(payload.service_name || '').trim();
    const text = String(payload.review_text || '').trim();
    const rating = validReviewRating_(payload.rating);
    if (!name || name.length > 60) return { success: false, message: 'Invalid name' };
    if (!serviceName || serviceName.length > 80) return { success: false, message: 'Invalid service' };
    if (!rating) return { success: false, message: 'Invalid rating' };
    if (!text || text.length > REVIEW_TEXT_MAX_LEN) return { success: false, message: 'Invalid review text' };
    if (!payload.photo && !payload.video && !payload.media) return { success: false, message: 'Missing media' };

    const media = [];
    const saveMedia = (blob, mime) => {
      const folder = reviewsFolder_();
      const created = folder.createFile(blob.setName('rv_' + Date.now() + '_' + (blob.getName() || 'media')));
      try { created.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (e) { /* domain-locked */ }
      return { id: created.getId(), type: mime.indexOf('video') === 0 ? 'video' : 'photo' };
    };
    if (payload.photo) {
      if (!/^image\/(jpeg|png|webp)$/.test(payload.photo.type || '')) return { success: false, message: 'Unsupported photo type' };
      if (payload.photo.bytes.length > REVIEW_PHOTO_MAX_MB * 1024 * 1024) return { success: false, message: 'Photo too large' };
      media.push(saveMedia(payload.photo, payload.photo.type));
    }
    if (payload.video) {
      if (!/^video\/(mp4|webm)$/.test(payload.video.type || '')) return { success: false, message: 'Unsupported video type' };
      if (payload.video.bytes.length > REVIEW_VIDEO_MAX_MB * 1024 * 1024) return { success: false, message: 'Video too large' };
      media.push(saveMedia(payload.video, payload.video.type));
    }

    const reviewId = newReviewId_();
    const now = new Date();
    sheet.appendRow([
      reviewId,
      Utilities.formatDate(now, Session.getScriptTimeZone(), 'd MMM yyyy'),
      name, '', serviceName, String(rating),
      text,
      media.map(m => m.id).join('|'),
      media.map(m => m.type).join('|'),
      media.map(m => 'https://drive.google.com/uc?export=view&id=' + m.id).join('|'),
      'PENDING', '', ''
    ]);
    return { success: true, review_id: reviewId };
  } finally {
    lock.releaseLock();
  }
}

/** Public endpoint for the published reviews gallery. */
function getPublishedReviews() {
  try {
    return ContentService.createTextOutput(JSON.stringify(doGetReviews_()))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Server error', data: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/** Test helper: submit a fake review, then check the tab. */
function testSubmitReview() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  ensureReviewsSheet_(ss);
  const res = submitReview_({
    display_name: 'QA Test',
    service_name: 'Nail Art',
    rating: 5,
    review_text: 'Automated QA review - safe to delete.',
    lang: 'en'
  });
  Logger.log(res);
}
