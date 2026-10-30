
/**
 * By.Niadania API
 * Mendukung daftar harga (Menu) dan portfolio.
 * Menu tetap menjadi aksi default untuk kompatibilitas API lama.
 */
const SPREADSHEET_ID = '1liQcy4CyAS3_Gjq0sdMRoXTUJT7Px0uo1jBdmwaypcM';
// Folder Drive penyimpanan foto/video ulasan (disediakan pemilik).
const REVIEW_MEDIA_FOLDER_ID = '1uBRXMfSKq1tRQ8Zmm0x4jN97kZCHUz7z';
const REVIEW_SHEET = 'Reviews';
const ALLOWED_MEDIA = {
  photo: { mimes: ['image/jpeg', 'image/png', 'image/webp'], exts: ['jpg', 'jpeg', 'png', 'webp'], maxBytes: 5 * 1024 * 1024, field: 'photo' },
  video: { mimes: ['video/mp4', 'video/webm'], exts: ['mp4', 'webm'], maxBytes: 40 * 1024 * 1024, field: 'video' }
};

function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const action = String(e?.parameter?.action || 'menu')
      .trim()
      .toLowerCase();

    if (action === 'portfolio') {
      return json_(getPortfolio_(ss, e));
    }

    if (action === 'media') {
      return json_(getMedia_(ss));
    }

    if (action === 'reviews') {
      return json_(getReviews_(ss));
    }

    if (action === 'menu') {
      return json_(getMenu_(ss, e));
    }

    return json_({
      success: false,
      error: 'Action tidak dikenal. Gunakan action=menu, action=portfolio, action=media, atau action=reviews.',
      data: []
    });
  } catch (err) {
    return json_({
      success: false,
      error: String(err.message || err),
      data: []
    });
  }
}

function getMenu_(ss, e) {
  const sheet = ss.getSheetByName('Menu');
  if (!sheet) throw new Error('Tab "Menu" tidak ditemukan.');

  const values = sheet.getDataRange().getDisplayValues();
  if (values.length < 2) {
    return { success: true, count: 0, data: [] };
  }

  const headers = values[0].map(h => String(h).trim());
  let data = values.slice(1)
    .filter(row => row.some(cell => String(cell).trim() !== ''))
    .map(row => {
      const obj = {};
      headers.forEach((header, i) => obj[header] = row[i] || '');
      return obj;
    });

  const category = String(e?.parameter?.category || '')
    .trim()
    .toLowerCase();

  if (category) {
    data = data.filter(item =>
      String(item.kategori || '').trim().toLowerCase() === category
    );
  }

  return { success: true, count: data.length, data };
}

function getPortfolio_(ss, e) {
  const sheet = ss.getSheetByName('Portfolio');
  if (!sheet) throw new Error('Tab "Portfolio" tidak ditemukan.');

  const values = sheet.getDataRange().getDisplayValues();
  if (values.length < 2) {
    return { success: true, count: 0, data: [] };
  }

  const headers = values[0].map(h => String(h).trim());
  const required = [
    'id', 'kategori', 'judul', 'tipe_media', 'instagram_url',
    'cover_url', 'deskripsi', 'unggulan', 'status_data', 'urutan'
  ];

  const missing = required.filter(header => !headers.includes(header));
  if (missing.length) {
    throw new Error('Kolom Portfolio tidak ditemukan: ' + missing.join(', '));
  }

  let data = values.slice(1)
    .filter(row => row.some(cell => String(cell).trim() !== ''))
    .map(row => {
      const obj = {};
      headers.forEach((header, i) => obj[header] = row[i] || '');
      return obj;
    })
    .filter(item =>
      String(item.status_data || '').trim().toUpperCase() === 'PUBLISHED'
    );

  const category = String(e?.parameter?.category || '')
    .trim()
    .toLowerCase();

  if (category && category !== 'all' && category !== 'semua') {
    data = data.filter(item =>
      String(item.kategori || '').trim().toLowerCase() === category
    );
  }

  data.sort((a, b) => {
    const orderA = Number(a.urutan) || 9999;
    const orderB = Number(b.urutan) || 9999;
    return orderA - orderB;
  });

  return { success: true, count: data.length, data };
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

// ================= Reviews: public read + submit + media upload =================
// doGet action=reviews -> hanya status PUBLISHED.
// POST action=submitReview (multipart/form-data) -> status PENDING + upload Drive.
function getReviews_(ss) {
  const sheet = ss.getSheetByName(REVIEW_SHEET);
  if (!sheet) throw new Error('Tab "Reviews" tidak ditemukan.');
  const values = sheet.getDataRange().getDisplayValues();
  if (values.length < 2) return { success: true, count: 0, data: [] };
  const headers = values[0].map(h => String(h).trim());
  const data = values.slice(1)
    .filter(row => row.some(c => String(c).trim() !== ''))
    .map(row => {
      const obj = {};
      headers.forEach((h, i) => obj[h] = String(row[i] || '').trim());
      return obj;
    })
    .filter(r => String(r.status || '').trim().toUpperCase() === 'PUBLISHED')
    .map(r => ({
      review_id: r.review_id,
      created_at: r.created_at,
      display_name: r.display_name,
      service_id: r.service_id,
      service_name: r.service_name,
      rating: Number(r.rating) || 0,
      review_text: r.review_text,
      media_ids: r.media_ids,
      media_types: r.media_types,
      media_urls: r.media_urls
    }))
    .filter(r => r.rating >= 1 && r.rating <= 5);
  return { success: true, count: data.length, data };
}

function doGetReviews(e) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  return json_(getReviews_(ss));
}

function slug_(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'file';
}

/** Simpan satu blob ke folder Drive. Mengembalikan {id, url, type}.
 *  Tidak mengubah izin file otomatis — dokumentasikan bahwa folder harus
 *  dibagikan "Anyone with the link" bila media mau tampil di website. */
function saveMedia_(folder, blob, kind) {
  const rule = ALLOWED_MEDIA[kind];
  const mime = blob.getContentType() || '';
  const name = String(blob.getName() || '');
  const ext = (name.split('.').pop() || '').toLowerCase();
  const mimeOk = rule.mimes.indexOf(mime) !== -1;
  const extOk = rule.exts.indexOf(ext) !== -1;
  if (!mimeOk && !extOk) throw new Error('Tipe file tidak didukung: ' + name);
  if (mimeOk && !extOk) throw new Error('Ekstensi file tidak cocok: ' + name);
  if (blob.getBytes().length > rule.maxBytes) {
    throw new Error('Ukuran file melebihi ' + Math.round(rule.maxBytes / 1024 / 1024) + ' MB: ' + name);
  }
  const unique = Utilities.getUuid().slice(0, 8);
  const finalName = 'review-' + slug_(name.replace(/\.[^.]+$/, '')) + '-' + unique + '.' + ext;
  const file = folder.createFile(blob.setName(finalName));
  if (!file || !file.getId()) throw new Error('Gagal menyimpan file ke Drive: ' + finalName);
  return {
    id: file.getId(),
    type: kind === 'video' ? 'video' : 'photo',
    url: 'https://drive.google.com/uc?export=view&id=' + file.getId()
  };
}

function doPost(e) {
  const uploaded = []; // track untuk pembersihan bila penyimpanan review gagal
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    const action = String(e && e.parameter && e.parameter.action || '').trim();
    if (action !== 'submitReview') {
      return json_({ success: false, message: 'Action tidak dikenal.', data: [] });
    }
    if (!e || !e.postData && !e.parameters) {
      return json_({ success: false, message: 'Payload tidak valid.', data: [] });
    }
    const p = e.parameter || {};
    const displayName = String(p.display_name || '').trim();
    const serviceName = String(p.service_name || '').trim();
    const rating = Number(p.rating || 0);
    const reviewText = String(p.review_text || '').trim();
    const lang = String(p.lang || 'id').trim();

    // Validasi server-side — frontend validation bukan pengganti.
    if (!displayName || displayName.length > 60) return json_({ success: false, message: 'Nama tidak valid.', data: [] });
    if (!serviceName) return json_({ success: false, message: 'Layanan wajib dipilih.', data: [] });
    if (!(rating >= 1 && rating <= 5)) return json_({ success: false, message: 'Rating harus 1-5.', data: [] });
    if (!reviewText || reviewText.length > 1000) return json_({ success: false, message: 'Ulasan tidak valid.', data: [] });

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(REVIEW_SHEET);
    if (!sheet) throw new Error('Tab "Reviews" tidak ditemukan.');
    const folder = DriveApp.getFolderById(REVIEW_MEDIA_FOLDER_ID);

    const mediaIds = [], mediaTypes = [], mediaUrls = [];
    ['photo', 'video'].forEach(kind => {
      const field = ALLOWED_MEDIA[kind].field;
      // multipart form-data: file muncul di e.parameters[field] sebagai nama,
      // blob asli ada di e.parameters[field] hanya untuk beberapa host; cara
      // paling andal di Apps Script adalah membaca dari e.parameters sebagai
      // Blob untuk input tunggal:
      const blob = e.parameters && e.parameters[field];
      if (!blob || typeof blob !== 'object' || typeof blob.getBytes !== 'function') return;
      const meta = saveMedia_(folder, blob, kind);
      uploaded.push(meta);
      mediaIds.push(meta.id);
      mediaTypes.push(meta.type);
      mediaUrls.push(meta.url);
    });

    const reviewId = Utilities.getUuid();
    const now = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss');
    sheet.appendRow([
      reviewId,
      now,
      displayName,
      '',                       // service_id: belum dipetakan dari tab Menu (dibedakan dari data palsu)
      serviceName,
      rating,
      reviewText,
      mediaIds.join('|'),
      mediaTypes.join('|'),
      mediaUrls.join('|'),
      'PENDING',                // moderasi manual oleh pemilik di sheet
      '',
      ''
    ]);
    return json_({ success: true, message: 'Review tersimpan, menunggu persetujuan.', data: [{ review_id: reviewId }] });
  } catch (err) {
    // Jangan sisakan file yatim: hapus file yang sudah terupload bila review gagal disimpan.
    uploaded.forEach(m => {
      try { DriveApp.getFileById(m.id).setTrashed(true); } catch (e2) {}
    });
    return json_({ success: false, message: String(err.message || err), data: [] });
  } finally {
    try { lock.releaseLock(); } catch (e3) {}
  }
}

// Jalankan manual dari editor untuk memeriksa tab Menu.
function testReadMenu() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Menu');
  if (!sheet) throw new Error('Tab "Menu" tidak ditemukan.');
  Logger.log(sheet.getDataRange().getDisplayValues());
}

// Jalankan manual dari editor untuk memeriksa data Portfolio terpublikasi.
function testReadPortfolio() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const result = getPortfolio_(ss, {});
  Logger.log(JSON.stringify(result, null, 2));
}


function getMedia_(ss) {
  const sheet = ss.getSheetByName('Media');

  if (!sheet) {
    throw new Error('Tab "Media" tidak ditemukan.');
  }

  const values = sheet.getDataRange().getDisplayValues();

  if (values.length < 2) {
    return { success: true, count: 0, data: [] };
  }

  const headers = values[0].map(h => String(h).trim());

  // Wajib hanya kolom inti. Kolom status mendukung DUA skema:
  //  - lama : media_id, ..., status (PUBLISHED)
  //  - baru : id, ..., alt_text, aktif (TRUE/ya/1)
  // Dua-duanya diterima selama tidak merusak integrasi existing.
  const required = ['media_url', 'tipe_media', 'section'];

  const missing = required.filter(h => !headers.includes(h));

  if (missing.length) {
    throw new Error(
      'Kolom Media tidak ditemukan: ' + missing.join(', ')
    );
  }

  const isPublished = (item) => {
    if (headers.includes('status')) {
      return String(item.status || '').trim().toUpperCase() === 'PUBLISHED';
    }
    if (headers.includes('aktif')) {
      const v = String(item.aktif || '').trim().toLowerCase();
      return v === 'true' || v === 'ya' || v === '1' || v === 'yes';
    }
    // Tanpa kolom status apa pun -> anggap aktif agar sheet kosong tidak mengunci situs.
    return true;
  };

  const data = values.slice(1)
    .filter(row => row.some(cell => String(cell).trim() !== ''))
    .map(row => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = String(row[i] || '').trim();
      });
      return obj;
    })
    .filter(item =>
      // Baris kosong / tanpa URL media selalu diabaikan.
      /^https?:\/\//i.test(item.media_url || '') &&
      isPublished(item)
    )
    .sort((a, b) =>
      (Number(a.urutan) || 9999) -
      (Number(b.urutan) || 9999)
    );

  return {
    success: true,
    count: data.length,
    data: data
  };
}
