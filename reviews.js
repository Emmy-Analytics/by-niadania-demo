// ================= By.Niadania — Customer reviews =================
// Public gallery reads only PUBLISHED reviews from the Apps Script.
// New submissions go to the same endpoint; the server stores them as PENDING.
// Apps Script deployment must be refreshed after Code.gs changes.

const REVIEW_ENDPOINT = window.APPS_SCRIPT_URL_REVIEWS ||
"https://script.google.com/macros/s/AKfycbwhpr1RzCefxiHnizBd8h5ON-Zz8_ggRCUl_WNZtOXnRgifGZ9tSan3AZEh4sP3PDk/exec";

const REVIEW_I18N = {
  en: {
    review_write: "Write a review",
    review_text: "Real experiences from By.Niadania customers. Every review is read and approved before it appears here.",
    reviews_empty_title: "No published reviews yet.",
    reviews_empty_text: "Be the first to share your story — your review will appear here once it's been approved.",
    reviews_summary_of: "reviews",
    rv_title: "Share your experience",
    rv_name: "Name or nickname *",
    rv_name_ph: "e.g. Sarah W.",
    rv_service: "Service you used *",
    rv_service_ph: "Select a service",
    rf_upload_limits_label_photo: "Add a photo (JPG, PNG, or WebP). Maximum size: 5 MB.",
    rf_upload_limits_label_video: "Add a video (MP4 or WebM). Maximum size: 10 MB.",
    rf_status_waiting: "Preparing files…",
    rf_status_sending: "Sending your review…",
    rf_timeout: "The request took too long and was stopped. Your review was not sent — please try again.",
    rf_rating: "Rating *",
    rf_text: "Your review *",
    rf_text_ph: "How was your visit?",
    rf_photo: "Photo (optional)",
    rf_video: "Video (optional)",
    rf_consent: "I agree that my review text and media may be published on this website after review.",
    rf_rights: "I confirm I have the right to share the attached media.",
    rf_note: "Reviews are checked before being shown. To request changes or removal later, just message By.Niadania on WhatsApp.",
    rf_submit: "Send review",
    rf_submitting: "Sending…",
    rf_err_name: "Please enter your name or nickname.",
    rf_err_service: "Please choose a service.",
    rf_err_rating: "Please pick a star rating.",
    rf_err_text: "Please write a short review.",
    rf_err_consent: "Please confirm publication consent.",
    rf_err_rights: "Please confirm media rights.",
    rf_file_too_big: "File is too large (max {max} MB).",
    rf_file_bad_type: "File type is not supported.",
    rf_remove_file: "Remove file",
    rf_uploading: "Uploading your review…",
    rf_success: "Terima kasih sudah berbagi cerita dengan By.Niadania! Ulasanmu sudah kami terima dan akan ditinjau sebelum ditampilkan di website.",
    rf_success_en: "Thank you for sharing your story with By.Niadania! We've received your review and it will be checked before it appears on the website.",
    rf_error: "Something went wrong. Please try again in a moment.",
    rf_network_error: "Network problem — your review was not sent. Please try again.",
    rv_media_view: "View media",
    rf_cat_all: "All",
    rf_cat_nail: "Nail Art",
    rf_cat_eyelash: "Eyelash",
    rf_cat_brow: "Brow",
    rf_cat_makeup: "Makeup",
    rv_confirm_remove: "Booking not confirmed — schedule to be confirmed by By.Niadania."
  },
  id: {
    review_write: "Tulis Ulasan",
    review_text: "Pengalaman nyata pelanggan By.Niadania. Setiap ulasan dibaca dan disetujui sebelum tampil di sini.",
    reviews_empty_title: "Belum Ada Ulasan",
    reviews_empty_text: "Jadilah yang pertama berbagi pengalaman bersama By.Niadania.",
    reviews_summary_of: "ulasan",
    rv_title: "Bagikan pengalamanmu",
    rv_name: "Nama atau nama samaran *",
    rv_name_ph: "mis. Sarah W.",
    rv_service: "Layanan yang kamu pakai *",
    rv_service_ph: "Pilih layanan",
    rf_upload_limits_label_photo: "Format JPG, JPEG, PNG, atau WebP. Maksimal 5 MB per foto.",
    rf_upload_limits_label_video: "Format MP4 atau WebM. Maksimal 10 MB per video.",
    rf_status_waiting: "Menyiapkan berkas…",
    rf_status_sending: "Mengirim ulasan…",
    rf_timeout: "Waktu tunggu habis, pengiriman dihentikan. Ulasan belum terkirim — silakan coba lagi.",
    rf_rating: "Rating *",
    rf_text: "Ulasan kamu *",
    rf_text_ph: "Bagaimana kunjungan kamu?",
    rf_photo: "Foto (opsional)",
    rf_video: "Video (opsional)",
    rf_consent: "Saya setuju teks dan media ulasan saya dipublikasikan di website ini setelah ditinjau.",
    rf_rights: "Saya menyatakan berhak membagikan media yang dilampirkan.",
    rf_note: "Ulasan diperiksa dulu sebelum ditampilkan. Untuk perubahan atau penghapusan nanti, cukup kirim pesan WhatsApp ke By.Niadania.",
    rf_submit: "Kirim Ulasan",
    rf_submitting: "Mengirim…",
    rf_err_name: "Mohon isi nama atau nama samaran.",
    rf_err_service: "Mohon pilih layanan.",
    rf_err_rating: "Mohon pilih rating bintang.",
    rf_err_text: "Mohon tulis ulasan singkat.",
    rf_err_consent: "Mohon centang persetujuan publikasi.",
    rf_err_rights: "Mohon centang konfirmasi hak media.",
    rf_file_too_big: "Ukuran file terlalu besar (maks {max} MB).",
    rf_file_bad_type: "Tipe file tidak didukung.",
    rf_remove_file: "Hapus file",
    rf_uploading: "Mengunggah ulasanmu…",
    rf_success: "Terima kasih sudah berbagi cerita dengan By.Niadania! Ulasanmu sudah kami terima dan akan ditinjau sebelum ditampilkan di website.",
    rf_success_en: "Thank you for sharing your story with By.Niadania! We've received your review and it will be checked before it appears on the website.",
    rf_error: "Terjadi kesalahan. Coba lagi sebentar ya.",
    rf_network_error: "Masalah jaringan — ulasan belum terkirim. Coba lagi ya.",
    rv_media_view: "Lihat media",
    rf_cat_all: "Semua",
    rf_cat_nail: "Seni Kuku",
    rf_cat_eyelash: "Bulu Mata",
    rf_cat_brow: "Alis",
    rf_cat_makeup: "Rias Wajah",
    rv_media_view: "Lihat media",
    rv_confirm_remove: "Booking belum dikonfirmasi — jadwal perlu konfirmasi dari By.Niadania."
  }
};

// Mirror the site's active language without touching script.js internals.
function rvLang() {
  return (document.documentElement.lang === "id") ? "id" : "en";
}
function rt(key, vars) {
  const dict = REVIEW_I18N[rvLang()] || REVIEW_I18N.en;
  let s = dict[key] || REVIEW_I18N.en[key] || key;
  if (vars) Object.keys(vars).forEach(k => { s = s.replace(`{${k}}`, vars[k]); });
  return s;
}

function rvEscape(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Service list mirrors the booking form's options (kept in sync manually — the
// Sheet "Menu" tab names are used where available).
const REVIEW_SERVICES_EN = ["Nail Art", "Eyelash", "Brow", "Makeup"];
const REVIEW_SERVICES_ID = ["Nail Art", "Eyelash", "Brow", "Makeup"];

const reviewState = { items: [], loaded: false, failed: false, rating: 0, photoFile: null, videoFile: null, submitting: false, activeFilter: "all" };

// ---------------- Public gallery ----------------
// media_urls arrives pipe-separated from the Apps Script; tolerate arrays too.
function rvParseList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value || "").split("|").map(s => s.trim()).filter(Boolean);
}

async function loadReviews() {
  const grid = document.querySelector("#reviewsGrid");
  if (!grid) return;
  try {
    const res = await fetch(`${REVIEW_ENDPOINT}${REVIEW_ENDPOINT.includes("?") ? "&" : "?"}action=reviews`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const payload = await res.json();
    if (!payload || payload.success !== true || !Array.isArray(payload.data)) throw new Error("Unexpected response");
    // Keep every PUBLISHED row the server sends. review with empty service_id,
    // empty media columns, or an unknown category must NOT be discarded —
    // only a missing review_id or invalid rating is fatal.
    reviewState.items = payload.data.filter(r => r && r.review_id && Number(r.rating) >= 1 && Number(r.rating) <= 5)
      .map(r => ({ ...r, rating: Number(r.rating), media_urls: rvParseList(r.media_urls), media_types: rvParseList(r.media_types) }));
    reviewState.loaded = true;
    reviewState.failed = false;
    renderReviews();
  } catch (err) {
    reviewState.failed = true;
    reviewState.loaded = true;
    renderReviews();
  }
}

// ---------------- Media display (Google Drive) ----------------
// Sheets store plain Drive share URLs. Convert per kind at render time.
function rvMediaSrc(url, kind) {
  const raw = String(url || "").trim();
  try {
    const u = new URL(raw);
    if (!/(^|\.)google\.com$/.test(u.hostname) && !/(^|\.)googleusercontent\.com$/.test(u.hostname)) return raw;
    let id = u.searchParams.get("id") || "";
    if (!id) { const m = raw.match(/\/file\/d\/([\w-]{20,})/) || raw.match(/\/d\/([\w-]{20,})/); if (m) id = m[1]; }
    if (!id) return raw;
    // Images: lh3 thumbnail proxy renders inline reliably for link-shared files.
    if (kind !== "video") return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
    // Videos: the native preview page works inside an iframe; export=download does not stream in <video>.
    return `https://drive.google.com/file/d/${id}/preview`;
  } catch (e) { return raw; }
}

function rvMediaItemHtml(url, type, alt, active) {
  if (type === "video") {
    const src = rvMediaSrc(url, "video");
    const isDirect = /^https?:\/\/.*(\.mp4|\.webm)(\?|$)/i.test(src);
    return isDirect
      ? `<div class="rv-media-slide"><video controls preload="metadata" playsinline src="${rvEscape(src)}"${active ? "" : " preload=\"none\""}></video></div>`
      : `<div class="rv-media-slide"><iframe src="${rvEscape(src)}" allow="autoplay; encrypted-media; fullscreen" allowfullscreen loading="lazy" title="${rvEscape(alt)}"></iframe></div>`;
  }
  return `<div class="rv-media-slide"><img loading="lazy" src="${rvEscape(rvMediaSrc(url, "photo"))}" alt="${rvEscape(alt)}"></div>`;
}

function starRowHtml(rating) {
  return `<span class="rv-stars-display" aria-label="${rating} / 5">${"★".repeat(rating)}${"☆".repeat(5 - rating)}</span>`;
}

function reviewCard(r) {
  const date = r.created_at_display || "";
  const urls = r.media_urls || [];
  const types = r.media_types || [];
  const mediaStrip = urls.length
    ? `<div class="rv-media-strip" data-review-media="${rvEscape(r.review_id)}" role="button" tabindex="0" aria-label="${rvEscape(rt("rv_media_view"))}">
        ${urls.map((u, i) => {
          const t = types[i] || "photo";
          const thumbSrc = t === "video" ? "" : rvMediaSrc(u, "photo");
          return t === "video"
            ? `<div class="rv-thumb rv-thumb-video" data-media-index="${i}"><span class="rv-thumb-play" aria-hidden="true">▶</span></div>`
            : `<div class="rv-thumb" data-media-index="${i}"><img loading="lazy" src="${rvEscape(thumbSrc)}" alt="${rvEscape(r.display_name)} ${i + 1}" onerror="this.parentElement.classList.add('rv-thumb-broken');this.remove()"></div>`;
        }).join("")}
      </div>`
    : "";
  return `<article class="review-card">
    <div class="review-card-head">
      ${starRowHtml(r.rating)}
      <span class="review-card-date">${rvEscape(date)}</span>
    </div>
    <h3 class="review-card-name">${rvEscape(r.display_name)}</h3>
    ${r.service_name ? `<p class="review-card-service">${rvEscape(r.service_name)}</p>` : ""}
    ${mediaStrip}
    <p class="review-card-text">${rvEscape(r.review_text)}</p>
  </article>`;
}

function normalizeReviewCategory(name) {
  const n = String(name || "").trim().toLowerCase();
  if (n.includes("nail")) return "nail-art";
  if (n.includes("lash") || n.includes("eyelash")) return "eyelash";
  if (n.includes("brow")) return "brow";
  if (n.includes("makeup") || n.includes("make up")) return "makeup";
  return "other";
}

function filteredReviews() {
  if (reviewState.activeFilter === "all") return reviewState.items;
  const f = reviewState.activeFilter === "nail" ? "nail-art" : reviewState.activeFilter;
  return reviewState.items.filter(r => normalizeReviewCategory(r.service_name) === f);
}

function renderReviews() {
  const grid = document.querySelector("#reviewsGrid");
  const empty = document.querySelector("#reviewsEmpty");
  const summary = document.querySelector("#reviewsSummary");
  if (!grid) return;

  // Rating summary: PUBLISHED items only (server already filters; extra guard).
  // Rounded to 1 decimal, counted from PUBLISHED reviews only.
  if (summary) {
    const items = reviewState.items;
    if (items.length) {
      const avg = items.reduce((s, r) => s + Number(r.rating || 0), 0) / items.length;
      summary.hidden = false;
      summary.innerHTML = `<strong>${avg.toFixed(1)}</strong> / 5 · ${items.length} ${rvEscape(rt("reviews_summary_of"))}`;
    } else {
      summary.hidden = true;
      summary.innerHTML = "";
    }
  }

  const visible = filteredReviews();
  renderReviewFilters();
  if (!visible.length) {
    grid.innerHTML = "";
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;
  grid.innerHTML = visible.map(reviewCard).join("");
  grid.querySelectorAll("[data-review-media]").forEach(strip => {
    const open = e => {
      // Opening from a specific thumbnail starts the lightbox at that media.
      const idx = e && e.target && e.target.closest && e.target.closest("[data-media-index]");
      const found = reviewState.items.find(r => r.review_id === strip.dataset.reviewMedia);
      if (found) openReviewMediaModal(found, idx ? Number(idx.dataset.mediaIndex) : 0);
    };
    strip.addEventListener("click", open);
    strip.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(e); } });
  });
}

function renderReviewFilters() {
  const bar = document.querySelector("#reviewFilters");
  if (!bar || bar.dataset.built === "1") { syncReviewFilterButtons(); return; }
  bar.dataset.built = "1";
  const cats = ["all", "nail", "eyelash", "brow", "makeup"];
  bar.innerHTML = cats.map(c => `<button type="button" class="filter review-filter" data-review-filter="${c}">${rvEscape(rt("rf_cat_" + c))}</button>`).join("");
  bar.addEventListener("click", e => {
    const btn = e.target.closest("[data-review-filter]");
    if (!btn) return;
    reviewState.activeFilter = btn.dataset.reviewFilter;
    renderReviews();
  });
  syncReviewFilterButtons();
}

function syncReviewFilterButtons() {
  document.querySelectorAll("[data-review-filter]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.reviewFilter === reviewState.activeFilter);
    btn.textContent = rvEscape(rt("rf_cat_" + btn.dataset.reviewFilter));
  });
}

function openReviewMediaModal(review, startIndex) {
  const modal = document.querySelector("#reviewModal");
  if (!modal) return;
  const urls = review.media_urls || [];
  const types = review.media_types || [];
  if (!urls.length) return;
  const name = review.display_name || "";
  modal.innerHTML = `
    <button class="dialog-close rv-lightbox-close" aria-label="Close"><span></span><span></span></button>
    <div class="rv-lightbox-stage"></div>
    <div class="rv-lightbox-bar">
      <button type="button" class="rv-lightbox-nav" data-rv-prev aria-label="Previous">&#8249;</button>
      <span class="rv-lightbox-pos"></span>
      <button type="button" class="rv-lightbox-nav" data-rv-next aria-label="Next">&#8250;</button>
    </div>`;
  const stage = modal.querySelector(".rv-lightbox-stage");
  const posEl = modal.querySelector(".rv-lightbox-pos");
  let index = Math.min(Math.max(0, Number(startIndex) || 0), urls.length - 1);
  const videos = [];
  urls.forEach((u, i) => {
    const wrap = document.createElement("div");
    wrap.innerHTML = rvMediaItemHtml(u, types[i] || "photo", `${name} — ${i + 1}`, true);
    const node = wrap.firstElementChild;
    node.hidden = i !== 0;
    stage.appendChild(node);
    const vid = node.querySelector("video");
    if (vid) videos.push(vid);
  });
  const slides = [...stage.children];
  const render = () => {
    slides.forEach((s, i) => { s.hidden = i !== index; });
    posEl.textContent = `${index + 1} / ${slides.length}`;
    modal.querySelector("[data-rv-prev]").hidden = slides.length < 2;
    modal.querySelector("[data-rv-next]").hidden = slides.length < 2;
  };
  const stopVideos = () => videos.forEach(v => { try { v.pause(); } catch (e) {} });
  const go = d => { index = (index + d + slides.length) % slides.length; stopVideos(); render(); };
  modal.querySelector("[data-rv-prev]").addEventListener("click", () => go(-1));
  modal.querySelector("[data-rv-next]").addEventListener("click", () => go(1));
  // Swipe (mobile)
  let sx = null;
  stage.addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", e => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    sx = null;
  }, { passive: true });
  const onKey = e => {
    if (!modal.open) return;
    if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "ArrowRight") go(1);
  };
  document.addEventListener("keydown", onKey);
  modal.addEventListener("close", () => {
    stopVideos();
    document.removeEventListener("keydown", onKey);
    document.body.classList.remove("no-scroll");
    modal.innerHTML = ""; // reset for next open
  }, { once: true });
  modal.querySelector(".rv-lightbox-close").addEventListener("click", () => modal.close());
  modal.addEventListener("click", e => { if (e.target === modal) modal.close(); });
  render();
  if (!modal.open) {
    modal.showModal();
    document.body.classList.add("no-scroll");
  }
}

// ---------------- Review form ----------------
const PHOTO_MAX_MB = 5, VIDEO_MAX_MB = 10;

function rvFileError(input, maxMb, types) {
  const f = input.files && input.files[0];
  if (!f) return null;
  if (!types.includes(f.type)) return rt("rf_file_bad_type");
  if (f.size > maxMb * 1024 * 1024) return rt("rf_file_too_big", { max: maxMb });
  return null;
}

function bindReviewForm() {
  const form = document.querySelector("#reviewForm");
  if (!form || form.dataset.bound === "1") return;
  form.dataset.bound = "1";

  // Populate services (bilingual lists, same options as the booking form).
  const serviceSel = form.querySelector("#rvService");
  const list = rvLang() === "id" ? REVIEW_SERVICES_ID : REVIEW_SERVICES_EN;
  serviceSel.innerHTML = `<option value="">${rvEscape(rt("rv_service_ph"))}</option>` +
    list.map(s => `<option value="${rvEscape(s)}">${rvEscape(s)}</option>`).join("");

  // Stars
  const stars = form.querySelectorAll("#rvStars [data-star]");
  const paint = () => stars.forEach(b => b.classList.toggle("active", Number(b.dataset.star) <= reviewState.rating));
  stars.forEach(b => b.addEventListener("click", () => {
    reviewState.rating = Number(b.dataset.star);
    paint();
    const err = form.querySelector('[data-err-for="rvStars"]');
    if (err) err.hidden = true;
  }));

  // File previews
  const bindFile = (inputId, infoId, previewId) => {
    const input = form.querySelector(inputId);
    const info = form.querySelector(infoId);
    const preview = form.querySelector(previewId);
    input.addEventListener("change", () => {
      const f = input.files && input.files[0];
      info.textContent = f ? `${f.name} · ${(f.size / (1024 * 1024)).toFixed(2)} MB` : "";
      preview.hidden = true;
      preview.innerHTML = "";
      if (!f) return;
      if (inputId === "#rvPhoto") {
        const bad = rvFileError(input, PHOTO_MAX_MB, ["image/jpeg", "image/png", "image/webp"]);
        if (bad) { info.textContent = bad; input.value = ""; reviewState.photoFile = null; return; }
        reviewState.photoFile = f;
        preview.innerHTML = `<img src="${URL.createObjectURL(f)}" alt=""><button type="button" class="rv-file-remove">✕ ${rvEscape(rt("rf_remove_file"))}</button>`;
      } else {
        const bad = rvFileError(input, VIDEO_MAX_MB, ["video/mp4", "video/webm"]);
        if (bad) { info.textContent = bad; input.value = ""; reviewState.videoFile = null; return; }
        reviewState.videoFile = f;
        preview.innerHTML = `<video src="${URL.createObjectURL(f)}" muted></video><button type="button" class="rv-file-remove">✕ ${rvEscape(rt("rf_remove_file"))}</button>`;
      }
      preview.hidden = false;
      preview.querySelector(".rv-file-remove").addEventListener("click", () => {
        input.value = "";
        preview.hidden = true;
        preview.innerHTML = "";
        info.textContent = "";
        if (inputId === "#rvPhoto") reviewState.photoFile = null; else reviewState.videoFile = null;
      });
    });
  };
  bindFile("#rvPhoto", "#rvPhotoInfo", "#rvPhotoPreview");
  bindFile("#rvVideo", "#rvVideoInfo", "#rvVideoPreview");

  function rvFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = String(reader.result || '');
        const comma = result.indexOf(',');

        if (comma === -1) {
          reject(new Error('File tidak dapat dibaca.'));
          return;
        }

        resolve({
          name: file.name,
          mimeType: file.type,
          data: result.slice(comma + 1)
        });
      };

      reader.onerror = () => {
        reject(new Error('Gagal membaca file dari perangkat.'));
      };

      reader.readAsDataURL(file);
    });
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (reviewState.submitting) return;
    const status = form.querySelector("#rvStatus");
    const submitBtn = form.querySelector("#rvSubmit");
    const setErr = (id, msg) => {
      const el = form.querySelector(`[data-err-for="${id}"]`);
      if (el) { el.textContent = msg || ""; el.hidden = !msg; }
    };

    const name = form.querySelector("#rvName").value.trim();
    const service = form.querySelector("#rvService").value;
    const text = form.querySelector("#rvText").value.trim();
    const consent = form.querySelector("#rvConsent").checked;
    const rights = form.querySelector("#rvRights").checked;

    let firstBad = null;
    const check = (id, ok, msg) => { setErr(id, ok ? "" : msg); if (!ok && !firstBad) firstBad = id; };
    check("rvName", !!name, rt("rf_err_name"));
    check("rvService", !!service, rt("rf_err_service"));
    check("rvStars", reviewState.rating >= 1, rt("rf_err_rating"));
    check("rvText", !!text, rt("rf_err_text"));
    check("rvConsent", consent, rt("rf_err_consent"));
    check("rvRights", rights, rt("rf_err_rights"));
    if (firstBad) { form.querySelector(`#${firstBad}`)?.focus(); return; }

    reviewState.submitting = true;
    submitBtn.disabled = true;
    const submitLabel = submitBtn.textContent;
    submitBtn.textContent = rt("rf_submitting");
    const hasMedia = !!(reviewState.photoFile || reviewState.videoFile);
    status.hidden = false;
    status.textContent = hasMedia ? rt("rf_status_waiting") : rt("rf_status_sending");
    status.className = "rv-status is-busy";

   
    try {
      status.textContent = hasMedia
        ? rt("rf_uploading")
        : rt("rf_status_sending");

      // Siapkan payload ulasan.
      const payload = {
        action: "submitReview",
        display_name: name,
        service_name: service,
        rating: Number(reviewState.rating),
        review_text: text,
        lang: rvLang(),
        consent: consent,
        rights: rights,
        photo: null,
        video: null
      };

      // Ubah file menjadi Base64 hanya jika file dipilih.
      if (reviewState.photoFile) {
        payload.photo = await rvFileToBase64(reviewState.photoFile);
      }

      if (reviewState.videoFile) {
        payload.video = await rvFileToBase64(reviewState.videoFile);
      }

      // Kirim JSON sebagai text/plain agar tidak memicu CORS preflight.
      const ctrl = new AbortController();
      const timer = window.setTimeout(() => ctrl.abort(), 180000);

      let res;

      try {
        res = await fetch(REVIEW_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify(payload),
          signal: ctrl.signal
        });
      } finally {
        window.clearTimeout(timer);
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const responseText = await res.text();
      let result;

      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error("Respons server tidak dapat dibaca.");
      }

      if (!result || result.success !== true) {
        throw new Error(
          result && result.message
            ? result.message
            : "Pengiriman ulasan gagal."
        );
      }

      // Server sudah mengonfirmasi penyimpanan.
      status.textContent = rt("rf_success");
      status.className = "rv-status is-ok";

      form.reset();
      reviewState.rating = 0;
      reviewState.photoFile = null;
      reviewState.videoFile = null;

      form.querySelectorAll(".rv-preview").forEach(p => {
        p.hidden = true;
        p.innerHTML = "";
      });

      form.querySelectorAll(".rv-file-info").forEach(i => {
        i.textContent = "";
      });

      form.querySelectorAll("#rvStars [data-star]").forEach(b => {
        b.classList.remove("active");
      });

      window.setTimeout(() => {
        const modal = document.querySelector("#reviewFormModal");

        if (modal && modal.open) {
          modal.close();
          document.body.classList.remove("no-scroll");
        }

        status.hidden = true;
      }, 5200);

    
    } catch (err) {
      const isNetwork = err instanceof TypeError || /Failed to fetch|NetworkError/i.test(err.message || "");
      const isTimeout = err && (err.name === "AbortError" || /abort/i.test(err.message || ""));
      status.textContent = isTimeout
        ? rt("rf_timeout")
        : isNetwork
          ? rt("rf_network_error")
          : (err.message || rt("rf_error"));
      status.className = "rv-status is-err";
      // Form contents and chosen files kept so the customer can retry without retyping.
    } finally {
      reviewState.submitting = false;
      submitBtn.disabled = false;
      submitBtn.textContent = submitLabel;
    }
  });
}

function openReviewForm() {
  const modal = document.querySelector("#reviewFormModal");
  if (!modal) return;
  bindReviewForm();
  modal.showModal();
  document.body.classList.add("no-scroll");
}

function bindReviewsUI() {
  const btn = document.querySelector("#writeReviewBtn");
  if (btn && btn.dataset.bound !== "1") {
    btn.dataset.bound = "1";
    btn.addEventListener("click", openReviewForm);
  }
  const closeBtn = document.querySelector("#reviewFormClose");
  if (closeBtn && closeBtn.dataset.bound !== "1") {
    closeBtn.dataset.bound = "1";
    closeBtn.addEventListener("click", () => {
      const modal = document.querySelector("#reviewFormModal");
      if (modal && modal.open) { modal.close(); document.body.classList.remove("no-scroll"); }
    });
  }
  const modal = document.querySelector("#reviewFormModal");
  if (modal && modal.dataset.bound !== "1") {
    modal.dataset.bound = "1";
    modal.addEventListener("close", () => document.body.classList.remove("no-scroll"));
  }
}

document.addEventListener("click", e => {
  if (!e.target.closest(".lang-btn")) return;
  window.setTimeout(() => {
    if (reviewState.loaded) renderReviews();
    const form = document.querySelector("#reviewForm");
    if (form && form.dataset.bound === "1") {
      // Refresh service options + static labels handled by data-i18n in script.js.
      const serviceSel = form.querySelector("#rvService");
      const current = serviceSel.value;
      const list = rvLang() === "id" ? REVIEW_SERVICES_ID : REVIEW_SERVICES_EN;
      serviceSel.innerHTML = `<option value="">${rvEscape(rt("rv_service_ph"))}</option>` +
        list.map(s => `<option value="${rvEscape(s)}">${rvEscape(s)}</option>`).join("");
      serviceSel.value = current;
    }
  }, 60);
});

bindReviewsUI();
loadReviews();
