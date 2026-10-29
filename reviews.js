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
    rf_rating: "Rating *",
    rf_text: "Your review *",
    rf_text_ph: "How was your visit?",
    rf_photo: "Photo (optional — JPEG, PNG, WebP, max 5 MB)",
    rf_video: "Video (optional — MP4, WebM, max 40 MB)",
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
    rv_confirm_remove: "Booking not confirmed — schedule to be confirmed by By.Niadania."
  },
  id: {
    review_write: "Tulis Ulasan",
    review_text: "Pengalaman nyata pelanggan By.Niadania. Setiap ulasan dibaca dan disetujui sebelum tampil di sini.",
    reviews_empty_title: "Belum ada ulasan yang dipublikasikan.",
    reviews_empty_text: "Jadilah yang pertama berbagi cerita — ulasanmu akan tampil di sini setelah disetujui.",
    reviews_summary_of: "ulasan",
    rv_title: "Bagikan pengalamanmu",
    rv_name: "Nama atau nama samaran *",
    rv_name_ph: "mis. Sarah W.",
    rv_service: "Layanan yang kamu pakai *",
    rv_service_ph: "Pilih layanan",
    rf_rating: "Rating *",
    rf_text: "Ulasan kamu *",
    rf_text_ph: "Bagaimana kunjungan kamu?",
    rf_photo: "Foto (opsional — JPEG, PNG, WebP, maks 5 MB)",
    rf_video: "Video (opsional — MP4, WebM, maks 40 MB)",
    rf_consent: "Saya setuju teks dan media ulasan saya dipublikasikan di website ini setelah ditinjau.",
    rf_rights: "Saya menyatakan berhak membagikan media yang dilampirkan.",
    rf_note: "Ulasan diperiksa dulu sebelum ditampilkan. Untuk perubahan atau penghapusan nanti, cukup kirim pesan WhatsApp ke By.Niadania.",
    rf_submit: "Kirim ulasan",
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

const reviewState = { items: [], loaded: false, failed: false, rating: 0, photoFile: null, videoFile: null, submitting: false };

// ---------------- Public gallery ----------------
async function loadReviews() {
  const grid = document.querySelector("#reviewsGrid");
  if (!grid) return;
  try {
    const res = await fetch(`${REVIEW_ENDPOINT}${REVIEW_ENDPOINT.includes("?") ? "&" : "?"}action=reviews`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const payload = await res.json();
    if (!payload || payload.success !== true || !Array.isArray(payload.data)) throw new Error("Unexpected response");
    reviewState.items = payload.data.filter(r => r && r.review_id && r.rating >= 1 && r.rating <= 5);
    reviewState.loaded = true;
    reviewState.failed = false;
    renderReviews();
  } catch (err) {
    reviewState.failed = true;
    reviewState.loaded = true;
    renderReviews();
  }
}

function starRowHtml(rating) {
  return `<span class="rv-stars-display" aria-label="${rating} / 5">${"★".repeat(rating)}${"☆".repeat(5 - rating)}</span>`;
}

function reviewCard(r) {
  const date = r.created_at_display || "";
  const mediaCount = (r.media_urls || []).length;
  const mediaBtn = mediaCount
    ? `<button type="button" class="rv-media-btn" data-review-media="${rvEscape(r.review_id)}">${rvEscape(rt("rv_media_view"))} (${mediaCount})</button>`
    : "";
  return `<article class="review-card">
    <div class="review-card-head">
      ${starRowHtml(r.rating)}
      <span class="review-card-date">${rvEscape(date)}</span>
    </div>
    <h3 class="review-card-name">${rvEscape(r.display_name)}</h3>
    ${r.service_name ? `<p class="review-card-service">${rvEscape(r.service_name)}</p>` : ""}
    <p class="review-card-text">${rvEscape(r.review_text)}</p>
    ${mediaBtn}
  </article>`;
}

function renderReviews() {
  const grid = document.querySelector("#reviewsGrid");
  const empty = document.querySelector("#reviewsEmpty");
  const summary = document.querySelector("#reviewsSummary");
  if (!grid) return;

  // Rating summary: PUBLISHED items only (server already filters; extra guard).
  if (summary) {
    const items = reviewState.items;
    if (items.length) {
      const avg = items.reduce((s, r) => s + r.rating, 0) / items.length;
      summary.hidden = false;
      summary.innerHTML = `<strong>${avg.toFixed(1)}</strong> / 5 · ${items.length} ${rvEscape(rt("reviews_summary_of"))}`;
    } else {
      summary.hidden = true;
      summary.innerHTML = "";
    }
  }

  if (!reviewState.items.length) {
    grid.innerHTML = "";
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;
  grid.innerHTML = reviewState.items.map(reviewCard).join("");
  grid.querySelectorAll("[data-review-media]").forEach(btn => {
    btn.addEventListener("click", () => {
      const found = reviewState.items.find(r => r.review_id === btn.dataset.reviewMedia);
      if (found) openReviewMediaModal(found);
    });
  });
}

function openReviewMediaModal(review) {
  const modal = document.querySelector("#reviewModal");
  if (!modal) return;
  const mediaHtml = (review.media_urls || []).map((u, i) => {
    const type = (review.media_types || [])[i] || "photo";
    if (type === "video") {
      return `<video controls preload="metadata" src="${rvEscape(u)}"></video>`;
    }
    return `<img src="${rvEscape(u)}" alt="${rvEscape(review.display_name)} — ${i + 1}">`;
  }).join("");
modal.innerHTML = `
    <button class="dialog-close lightbox-close" aria-label="Close"><span></span><span></span></button>
    <div class="review-modal-body">${mediaHtml || `<p>${rvEscape(rt("rf_error"))}</p>`}</div>`;
  if (!modal.open) {
    modal.showModal();
    document.body.classList.add("no-scroll");
  }
  const close = () => modal.close();
  modal.querySelector(".lightbox-close").addEventListener("click", close);
  modal.addEventListener("click", e => { if (e.target === modal) close(); });
  modal.addEventListener("close", () => {
  document.body.classList.remove("no-scroll");
}, { once: true });
}

// ---------------- Review form ----------------
const PHOTO_MAX_MB = 5, VIDEO_MAX_MB = 40;

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
    status.hidden = false;
    status.textContent = rt("rf_uploading");
    status.className = "rv-status is-busy";

    try {
      const fd = new FormData();
      fd.append("action", "submitReview");
      fd.append("display_name", name);
      fd.append("service_name", service);
      fd.append("rating", String(reviewState.rating));
      fd.append("review_text", text);
      fd.append("lang", rvLang());
      if (reviewState.photoFile) fd.append("photo", reviewState.photoFile);
      if (reviewState.videoFile) fd.append("video", reviewState.videoFile);

      const res = await fetch(REVIEW_ENDPOINT, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload = await res.json();
      if (!payload || payload.success !== true) throw new Error(payload && payload.message || "Rejected");
      // Server confirmed: safe to reset and show success.
      status.textContent = rt("rf_success");
      status.className = "rv-status is-ok";
      form.reset();
      reviewState.rating = 0;
      reviewState.photoFile = null;
      reviewState.videoFile = null;
      form.querySelectorAll(".rv-preview").forEach(p => { p.hidden = true; p.innerHTML = ""; });
      form.querySelectorAll(".rv-file-info").forEach(i => { i.textContent = ""; });
      form.querySelectorAll("#rvStars [data-star]").forEach(b => b.classList.remove("active"));
      window.setTimeout(() => {
        const modal = document.querySelector("#reviewFormModal");
        if (modal && modal.open) { modal.close(); document.body.classList.remove("no-scroll"); }
        status.hidden = true;
      }, 5200);
    } catch (err) {
      const isNetwork = err instanceof TypeError || /Failed to fetch|NetworkError/i.test(err.message || "");
      status.textContent = isNetwork ? rt("rf_network_error") : rt("rf_error");
      status.className = "rv-status is-err";
      // Form contents kept so the customer can retry without retyping.
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

// Re-render with the active language when the site switches EN/ID.
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
