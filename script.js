// By.Niadania website interactions
// TODO before publication: verify every draft price with the owner.
// TODO: add the owner's real Google Form URL to GOOGLE_FORM_URL.

const WHATSAPP_NUMBER = "6281515809420";

/**
 * Local, licensed stock photos (Unsplash / Pexels) used as ILLUSTRATIVE fallbacks
 * while the owner has not filled `cover_url` in the Portfolio sheet yet.
 * They are clearly labelled "Illustrative photo" and are never presented as
 * By.Niadania's own work.
 */
const CATEGORY_PHOTOS = {
  "nail-art": ["assets/photos/nail.jpg", "assets/photos/nail2.jpg"],
  "eyelash": ["assets/photos/eyelash.jpg", "assets/photos/makeup2.jpg"],
  "brow": ["assets/photos/brow.jpg"],
  "makeup": ["assets/photos/makeup.jpg", "assets/photos/makeup2.jpg"]
};
const HERO_FALLBACK_PHOTO = "assets/photos/nail2.jpg";
const FALLBACK_CAPTION_EN = "Illustrative photo — placeholder until the real work is published.";
const FALLBACK_CAPTION_ID = "Foto ilustrasi — pengganti sementara sebelum karya asli dipublikasikan.";

/** Deterministic local photo per portfolio item (stable across renders). */
function localPhotoFor(item) {
  const pool = CATEGORY_PHOTOS[item.category] || CATEGORY_PHOTOS["nail-art"];
  const seed = String(item.id || item.title || "x").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return pool[seed % pool.length];
}

/** Instagram embeds often fail (login walls, blocked iframes). The cover
 *  photo + a real link out is the dependable primary experience. */
function isReliableEmbed(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace("www.", "") === "instagram.com" && /^\/p\/[\w-]+\/?$/.test(u.pathname);
  } catch (e) { return false; }
}
const GOOGLE_FORM_URL = "";

/**
 * Apps Script Web App base URL.
 * PASTE the /exec URL here AFTER redeploying the updated Code.gs
 * (Deploy > New deployment > Web app > Execute as: Me, Access: Anyone).
 * While empty, the gallery shows a friendly notice instead of fake content,
 * and the price list falls back to the brochure prices already in index.html.
 */
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwhpr1RzCefxiHnizBd8h5ON-Zz8_ggRCUl_WNZtOXnRgifGZ9tSan3AZEh4sP3PDk/exec";

const BUSINESS_SOCIALS = {
  instagram: "https://www.instagram.com/by.niadania/",
  whatsapp: "https://wa.me/6281515809420",
  facebook: "",
  tiktok: ""
};

const PORTOWEB_SOCIALS = {
  instagram: "https://www.instagram.com/portoweb.id/",
  whatsapp: "6282195670441"
};

// ---------------- Centralized translations ----------------
const I18N = {
  en: {
    skip: "Skip to booking",
    announce1: "Beauty, in your own way",
    announce2: "East Jakarta · by appointment",
    nav_services: "Services",
    nav_gallery: "Nail art",
    nav_prices: "Prices",
    nav_studio: "The studio",
    nav_book: "Book an appointment",
    hero_title: "Beauty is<br><em>in the details.</em>",
    hero_desc: "Nail art, eyelash, brow and makeup — crafted in East Jakarta, made to feel entirely yours.",
    hero_book: "Book an appointment",
    hero_explore: "Explore our work",
    hero_note1: "Nail art",
    hero_note2: "Eyelash · Brow · Makeup",
    intro_title: "Beauty is<br><em>in the details.</em>",
    intro_text: "Beauty is personal. From a subtle everyday manicure to a design that feels unmistakably yours, every detail begins with your own style.",
    intro_text2: "Studio located in Cipinang, East Jakarta. Open Thursday 11.00–18.00 — by appointment.",
    intro_link: "Book an appointment",
    services_title: "Our <em>services</em>",
    svc_nail_desc: "From soft & minimal to artful details.",
    svc_lash_title: "Eyelash <em>& Brow</em>",
    svc_lash_desc: "Little details that frame your look.",
    svc_makeup_desc: "For the moments you want to remember.",
    svc_brow_desc: "Brows shaped to balance your features.",
    svc_back: "← Back to services",
    svc_book: "Book this service",
    svc_portfolio: "Full portfolio",
    svc_works_title: "Published <em>work.</em>",
    illustrative_note: "Cards without an official cover yet show clearly-labelled illustrative photography, never presented as By.Niadania's own work.",
    gallery_title: "The art of <em>being you.</em>",
    filter_all: "All styles",
    filter_minimal: "Minimal",
    filter_chrome: "Chrome & cat eye",
    filter_art: "Art & color",
    g1: "Soft French", g2: "Chrome mood", g3: "Color story", g4: "Cat eye", g5: "Blush tones",
    featured_title: "Latest <em>published work.</em>",
    featured_ig: "Explore Instagram",
    open_on_instagram: "Watch on Instagram",
    insta_fallback_note: "This work lives on Instagram — open the post there to see it in full.",
    gallery_loading: "Loading the gallery…",
    gallery_empty: "This category doesn't have published work yet. Explore the latest work on Instagram.",
    gallery_ig: "Explore Instagram",
    gallery_book: "Book an appointment",
    portfolio_notice_setup: "The published portfolio loads from By.Niadania's own Google Sheet. Once the Apps Script web app is connected, published work appears here automatically — Instagram embeds only.",
    portfolio_notice_error: "The portfolio couldn't load right now. Please try again later, or explore the latest work on Instagram.",
    filter_nail: "Nail Art",
    filter_lash: "Eyelash",
    filter_brow: "Brow",
    filter_makeup: "Makeup",
    gallery_note: "Published work loads from By.Niadania's own portfolio. Unpublished categories show a note instead of a fake gallery.",
    price_title: "The service<br><em>edit.</em>",
    price_text: "Find the service that fits your style. Prices below are drafts from the owner's material and need confirmation before publishing.",
    price_link: "Ask about a service",
    price_head1: "Nail art services",
    price_head2: "Price*",
    price_head_pkg: "Packages",
    price_head_design: "Design selection",
    price_head2b: "Natural / extension",
    p1: "Gel polish", p1s: "Free express manicure",
    p2: "Soft gel tip extension + gel polish", p2s: "Extension with gel polish",
    p3: "Manicure + scrub", p3s: "Extra care ritual",
    pa1: "Add-on overlay",
    pa2: "Art / picture, accessories", pa2s: "Per nail",
    pa3: "Nail removal", pa3s: "Per nail",
    p4: "French nail", p4s: "Clean look, free polish color",
    p5: "Basic art", p5s: "Choose 4 basic designs",
    p6: "Cat eye glass + chrome", p6s: "Soft cat-eye glow, 2 chrome designs",
    p7: "3D nail art", p7s: "2 fingers 3D, 4 fingers mix art/chrome",
    pd1: "Cat eye basic", pd2: "Cat eye glass", pd3: "Cat eye dalam", pd4: "Cat eye french", pd5: "Nail gel french", pd6: "Ombre / blush",
    price_foot: "Same design across 10 fingers, many color choices. Custom designs and accessories available. Lash & brow prices are in a separate brochure — eyelash starts at Rp90.000.",
    price_cta: "Ask / book nail art",
    review_title: "Your words,<br><em>your stories.</em>",
    review_text: "Find customer experiences and the latest work through By.Niadania's Instagram.",
    review_cta: "Explore Instagram",
    review_note: "Testimonials will be shown as quotes only after real reviews are selected and approved.",
    booking_title: "Your next<br><em>beauty moment.</em>",
    booking_text: "Tell us what you have in mind. We'll help you with the next step.",
    rules_title: "Booking <em>guide.</em>",
    rules_text: "Everything you need to know before requesting a visit. Every rule below still needs confirmation from By.Niadania — nothing here is final policy yet.",
    rules_confirm: "1 · Before booking",
    rules_confirm_text: "Pick the service you want, then choose a date and time that suit you. Fill in the short form — your request goes straight to WhatsApp as a ready-made message.",
    rules_time: "2 · Confirmation",
    rules_time_text: "Sending the form does not reserve your slot yet. By.Niadania reviews every request personally and confirms the schedule with you in chat.",
    rules_prices: "3 · Reschedule & cancellation",
    rules_prices_text: "Plans change — that's fine. Just message us as early as you can and we'll sort out a new time together.",
    rules_services: "4 · Prices & preparation",
    rules_services_text: "Prices shown are drafts from the owner's material — confirm the latest price in chat. For nail art, come with bare nails if possible; prep tips for other treatments will be shared in chat.",
    rules_note: "Draft — DP amounts, cancellation fees, and opening hours still need confirmation with By.Niadania before this guide becomes final.",
    f_name: "Your name",
    f_phone: "WhatsApp number",
    f_service: "Choose a service",
    f_service_ph: "Select a service",
    opt_nail: "Nail Art",
    opt_lash: "Eyelash",
    opt_brow: "Brow",
    opt_makeup: "Makeup",
    opt_consult: "Consultation / not sure yet",
    f_nailtype: "Nail type",
    f_nailtype_ph: "Select nail type (optional)",
    opt_natural: "Natural nails",
    opt_extension: "Extension",
    f_nailstyle: "Desired nail-art style or reference",
    f_nailstyle_ph: "e.g. soft french, chrome, custom design",
    f_date: "Preferred date",
    f_time: "Preferred time",
    f_time_ph: "Select time (optional)",
    time1: "11.00–13.00", time2: "13.00–15.00", time3: "15.00–18.00",
    time_flex: "Flexible / discuss via chat",
    f_notes: "Additional notes",
    f_notes_ph: "Style, questions, anything else...",
    f_consent: "I have read and agree to By.Niadania's booking policy.",
    f_submit: "Review booking details",
    f_footnote: "No schedule is booked until the owner confirms via WhatsApp.",
    err_name: "Please enter your name.",
    err_phone: "Please enter a valid WhatsApp number.",
    err_service: "Please choose a service.",
    err_consent: "Please confirm that you understand.",
    f_required: "required",
    options_title: "Your appointment,<br><em>your way.</em>",
    options_text: "Prefer the internal form above, or the owner's Google Form once it is connected.",
    opt_whatsapp: "Book via WhatsApp",
    opt_gform: "Google Form",
    gform_note: "The Google Form will be connected later once the official link is provided.",
    gform_note_ready: "The official By.Niadania Google Form opens in a new tab.",
    gform_missing: "The owner's Google Form link has not been added yet.",
    footer_tag: "Beauty, in your own way.",
    footer_book: "Make an appointment",
    footer_loc: "Jakarta Timur, Indonesia",
    footer_disclaimer: "Website demo. Prices, operating hours, gallery photos, and service details need verification before publishing.",
    footer_credit: "Crafted by",
    summary_title: "Your booking <em>summary</em>",
    summary_note: "Continuing opens WhatsApp with a pre-filled message. Nothing is sent until you press send in WhatsApp.",
    summary_send: "Continue to WhatsApp",
    summary_edit: "Back to edit",
    summary_none: "Not filled",
    wa_greeting: "Hello By.Niadania! I would like to submit a booking request.",
    wa_name: "Name", wa_phone: "WhatsApp number", wa_service: "Service",
    wa_date: "Preferred date", wa_time: "Preferred time", wa_nailtype: "Nail type",
    wa_nailstyle: "Nail style", wa_notes: "Notes",
    wa_flex: "Flexible / discuss via chat",
    wa_confirm: "I understand this is a booking request and the schedule awaits confirmation from By.Niadania.",
    toast_gform: "The owner's Google Form link has not been added yet.",
    toast_social: "Coming soon — the official link will be added here.",
    lightbox_close: "Close image",
    coming_soon: "Coming soon",
    add_to_cart: "Add to Cart",
    cart_view: "View Cart",
    cart_title: "Your service cart",
    cart_empty: "Your cart is still empty. Pick a service from the price list above.",
    cart_checkout: "Continue to WhatsApp",
    cart_clear: "Clear cart",
    cart_subtotal: "Estimated subtotal",
    cart_note: "*Not including items whose price still needs confirmation.",
    cart_confirm: "Price to be confirmed",
    cart_range: "from",
    cart_var_natural: "Natural nails",
    cart_var_extension: "Extension",
    cart_var_choose: "Choose variant",
    cart_remove: "Remove item",
    cart_added: "Added to your cart.",
    cart_qty: "Quantity",
    cart_other: "Other services — price on request:",
    cart_choose_variant: "Please choose a variant first.",
    cart_wa_greeting: "Hello By.Niadania! I'd like to ask about and book the following services:",
    cart_wa_variant: "Variant",
    cart_wa_price: "Price",
    cart_wa_details: "Name:\nPreferred date:\nPreferred time:",
    cart_wa_closing: "Could you help check the availability for this schedule? Thank you!"
  },
  id: {
    skip: "Lompat ke reservasi",
    announce1: "Beauty, in your own way",
    announce2: "Jakarta Timur · dengan reservasi",
    nav_services: "Layanan",
    nav_gallery: "Nail art",
    nav_prices: "Harga",
    nav_studio: "Studio",
    nav_book: "Reservasi",
    hero_title: "Keindahan ada<br><em>di dalam setiap detail.</em>",
    hero_desc: "Nail art, eyelash, brow, dan makeup — dibuat di Jakarta Timur, untuk gayamu sendiri.",
    hero_book: "Reservasi sekarang",
    hero_explore: "Lihat karya kami",
    hero_note1: "Nail art",
    hero_note2: "Eyelash · Brow · Makeup",
    intro_title: "Keindahan ada<br><em>dalam setiap detail.</em>",
    intro_text: "Keindahan itu personal. Dari manicure sehari-hari yang lembut sampai desain yang terasa khas dirimu, setiap detail dimulai dari gayamu sendiri.",
    intro_text2: "Studio berada di Cipinang, Jakarta Timur. Buka hari Kamis 11.00–18.00 — dengan appointment.",
    intro_link: "Reservasi sekarang",
    services_title: "Layanan <em>kami</em>",
    svc_nail_desc: "Dari soft & minimal sampai detail yang artistik.",
    svc_lash_title: "Eyelash <em>& Brow</em>",
    svc_lash_desc: "Detail kecil yang membingkai penampilanmu.",
    svc_makeup_desc: "Untuk momen yang ingin kamu kenang.",
    svc_brow_desc: "Alis dibentuk menyeimbangkan wajahmu.",
    svc_back: "← Kembali ke layanan",
    svc_book: "Reservasi layanan ini",
    svc_portfolio: "Portofolio lengkap",
    svc_works_title: "Karya yang <em>dipublish.</em>",
    illustrative_note: "Kartu yang belum memiliki cover resmi menampilkan foto ilustrasi berlabel jelas, bukan karya asli By.Niadania.",
    gallery_title: "Seni <em>menjadi dirimu.</em>",
    filter_all: "Semua gaya",
    filter_minimal: "Minimal",
    filter_chrome: "Chrome & cat eye",
    filter_art: "Art & warna",
    g1: "Soft French", g2: "Chrome mood", g3: "Color story", g4: "Cat eye", g5: "Blush tones",
    gallery_note: "Karya yang ditampilkan adalah dokumentasi asli By.Niadania. Kategori yang belum dipublish menampilkan keterangan, bukan galeri palsu.",
    featured_title: "Karya terbaru <em>yang sudah dipublish.</em>",
    open_on_instagram: "Buka di Instagram",
    insta_fallback_note: "Karya ini ada di Instagram — buka postingannya untuk melihat lengkap.",
    gallery_loading: "Memuat karya...",
    gallery_empty: "Kategori ini belum memiliki karya yang dipublish. Jelajahi karya terbaru di Instagram.",
    filter_nail: "Nail Art",
    filter_lash: "Eyelash",
    filter_brow: "Brow",
    filter_makeup: "Makeup",
    portfolio_notice_setup: "Portofolio yang dipublish dimuat dari Google Sheet milik By.Niadania. Setelah Apps Script web app tersambung, karya yang dipublish muncul di sini secara otomatis — hanya embed resmi Instagram.",
    portfolio_notice_error: "Portofolio belum bisa dimuat saat ini. Coba lagi nanti, atau jelajahi karya terbaru di Instagram.",
    price_title: "Daftar<br><em>layanan.</em>",
    price_text: "Temukan layanan yang sesuai dengan gayamu. Harga di bawah masih berupa draft dari materi pemilik dan perlu dikonfirmasi sebelum publikasi.",
    price_link: "Tanya tentang layanan",
    price_head1: "Layanan nail art",
    price_head2: "Harga*",
    price_head_pkg: "Paket",
    price_head_design: "Pilih design",
    price_head2b: "Kuku asli / extension",
    p1: "Kutek gel polos", p1s: "Gratis manicure express",
    p2: "Extension soft gel tip + kutek gel", p2s: "Extension dengan kutek gel",
    p3: "Manicure + scrub", p3s: "Ritual perawatan ekstra",
    pa1: "Add-on overlay",
    pa2: "Art / gambar, aksesoris", pa2s: "Per kuku",
    pa3: "Buka nail", pa3s: "Per kuku",
    p4: "French nail", p4s: "Look bersih, free pilihan warna",
    p5: "Basic art", p5s: "Pilih 4 basic design",
    p6: "Cat eye glass + chrome", p6s: "Efek cat eye glass, 2 chrome design",
    p7: "3D nail art", p7s: "2 kuku 3D, 4 kuku mix art/chrome",
    pd1: "Cat eye biasa", pd2: "Cat eye glass", pd3: "Cat eye dalam", pd4: "Cat eye french", pd5: "Nail gel french", pd6: "Ombre / blush",
    price_foot: "Design sama untuk 10 kuku, banyak pilihan warna. Custom design dan aksesoris tersedia. Harga lash & brow ada di brosur terpisah — eyelash mulai Rp90.000.",
    price_cta: "Tanya / reservasi nail art",
    review_title: "Kata-katamu,<br><em>ceritamu.</em>",
    review_text: "Temukan pengalaman pelanggan dan karya terbaru melalui Instagram By.Niadania.",
    review_cta: "Buka Instagram",
    review_note: "Testimoni akan ditampilkan sebagai kutipan hanya setelah ulasan asli dipilih dan disetujui.",
    booking_title: "Momen kecantikanmu<br><em>berikutnya.</em>",
    booking_text: "Ceritakan keinginanmu. Kami bantu langkah selanjutnya.",
    rules_title: "Panduan <em>reservasi.</em>",
    rules_text: "Yang perlu kamu tahu sebelum mengajukan reservasi. Semua poin di bawah masih perlu konfirmasi dari By.Niadania — belum ada yang bersifat final.",
    rules_confirm: "1 · Sebelum reservasi",
    rules_confirm_text: "Pilih treatment yang kamu suka, lalu tentukan tanggal dan jam yang pas. Isi formulir singkatnya — permintaanmu langsung jadi pesan WhatsApp yang siap dikirim.",
    rules_time: "2 · Konfirmasi jadwal",
    rules_time_text: "Mengirim formulir belum membuat jadwal kamu terkunci. By.Niadania mengecek setiap permintaan satu per satu, lalu konfirmasi jadwal lewat chat.",
    rules_prices: "3 · Ubah jadwal & pembatalan",
    rules_prices_text: "Rencana bisa berubah — tidak masalah. Kabari kami sedini mungkin lewat chat, nanti kita carikan waktu baru bersama.",
    rules_services: "4 · Harga & persiapan",
    rules_services_text: "Harga di sini masih draft dari materi pemilik — tanyakan harga terbaru lewat chat. Untuk nail art, datang dengan kuku bersih ya; tips persiapan treatment lain akan diinfokan lewat chat.",
    rules_note: "Draft — nominal DP, biaya pembatalan, dan jam buka masih perlu dikonfirmasi dengan By.Niadania sebelum panduan ini final.",
    f_name: "Nama kamu",
    f_phone: "Nomor WhatsApp",
    f_service: "Pilih layanan",
    f_service_ph: "Pilih layanan",
    opt_nail: "Nail Art",
    opt_lash: "Eyelash",
    opt_brow: "Brow",
    opt_makeup: "Makeup",
    opt_consult: "Konsultasi / belum yakin",
    f_nailtype: "Tipe kuku",
    f_nailtype_ph: "Pilih tipe kuku (opsional)",
    opt_natural: "Kuku asli",
    opt_extension: "Extension",
    f_nailstyle: "Style nail art yang diinginkan / referensi",
    f_nailstyle_ph: "mis. soft french, chrome, desain custom",
    f_date: "Tanggal yang diinginkan",
    f_time: "Waktu yang diinginkan",
    f_time_ph: "Pilih waktu (opsional)",
    time1: "11.00–13.00", time2: "13.00–15.00", time3: "15.00–18.00",
    time_flex: "Fleksibel / diskusikan via chat",
    f_notes: "Catatan tambahan",
    f_notes_ph: "Style, pertanyaan, atau lainnya...",
    f_consent: "Saya sudah baca dan setuju dengan panduan reservasi By.Niadania.",
    f_submit: "Tinjau detail reservasi",
    f_footnote: "Jadwal belum fix sampai pemilik mengonfirmasi lewat WhatsApp.",
    err_name: "Mohon isi nama kamu.",
    err_phone: "Mohon isi nomor WhatsApp yang valid.",
    err_service: "Mohon pilih layanan.",
    err_consent: "Mohon centang konfirmasi ini.",
    f_required: "wajib",
    options_title: "Reservasi kamu,<br><em>caramu.</em>",
    options_text: "Bisa lewat formulir di atas, atau Google Form pemilik setelah nanti tersambung.",
    opt_whatsapp: "Reservasi via WhatsApp",
    opt_gform: "Google Form",
    gform_note: "Google Form akan tersambung nanti setelah link resmi diberikan.",
    gform_note_ready: "Google Form resmi By.Niadania akan terbuka di tab baru.",
    gform_missing: "Link Google Form pemilik belum dimasukkan.",
    footer_tag: "Beauty, in your own way.",
    footer_book: "Buat reservasi",
    footer_loc: "Jakarta Timur, Indonesia",
    footer_disclaimer: "Website demo. Harga, jam operasional, foto galeri, dan detail layanan perlu diverifikasi sebelum publikasi.",
    footer_credit: "Dibuat oleh",
    summary_title: "Ringkasan <em>reservasi kamu</em>",
    summary_note: "Melanjutkan akan membuka WhatsApp dengan pesan yang sudah disusun. Pesan belum terkirim sampai kamu menekan kirim di WhatsApp.",
    summary_send: "Lanjutkan ke WhatsApp",
    summary_edit: "Kembali ke formulir",
    summary_none: "Belum diisi",
    wa_greeting: "Halo By.Niadania! Saya ingin reservasi.",
    wa_name: "Nama", wa_phone: "Nomor WhatsApp", wa_service: "Layanan",
    wa_date: "Tanggal yang diinginkan", wa_time: "Waktu yang diinginkan", wa_nailtype: "Tipe kuku",
    wa_nailstyle: "Style nail art", wa_notes: "Catatan",
    wa_flex: "Fleksibel / diskusikan via chat",
    wa_confirm: "Saya paham ini permintaan reservasi dan jadwalnya masih menunggu konfirmasi dari By.Niadania.",
    toast_gform: "Link Google Form pemilik belum dimasukkan.",
    toast_social: "Segera hadir — link resmi akan ditambahkan di sini.",
    lightbox_close: "Tutup gambar",
    coming_soon: "Segera hadir",
    add_to_cart: "Tambah ke Keranjang",
    cart_view: "Lihat Keranjang",
    cart_title: "Keranjang layananmu",
    cart_empty: "Keranjang masih kosong. Pilih layanan dari daftar harga di atas ya.",
    cart_checkout: "Lanjut ke WhatsApp",
    cart_clear: "Kosongkan keranjang",
    cart_subtotal: "Perkiraan subtotal",
    cart_note: "*Harga belum termasuk item yang masih perlu dikonfirmasi.",
    cart_confirm: "Perlu konfirmasi harga",
    cart_range: "mulai",
    cart_var_natural: "Kuku asli",
    cart_var_extension: "Extension",
    cart_var_choose: "Pilih varian",
    cart_remove: "Hapus item",
    cart_added: "Masuk ke keranjangmu.",
    cart_qty: "Jumlah",
    cart_other: "Layanan lainnya — harga menyusul:",
    cart_choose_variant: "Pilih varian dulu ya sebelum ditambahkan.",
    cart_wa_greeting: "Halo By.Niadania! Aku mau tanya dan reservasi layanan berikut:",
    cart_wa_variant: "Varian",
    cart_wa_price: "Harga",
    cart_wa_details: "Nama:\nTanggal yang diinginkan:\nJam yang diinginkan:",
    cart_wa_closing: "Boleh dibantu cek ketersediaan jadwalnya? Terima kasih!"
  }
};

const t = key => I18N[state.lang][key] || I18N.en[key] || key;

// ---------------- State ----------------
const state = {
  lang: "en",
  editData: null
};

// ---------------- DOM refs ----------------
const form = document.querySelector("#bookingForm");
const dialog = document.querySelector("#bookingDialog");
const summaryContent = document.querySelector("#summaryContent");
const toast = document.querySelector("#toast");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const header = document.querySelector(".site-header");
const serviceSelect = document.querySelector("#service");
const nailTypeRow = document.querySelector("#nailTypeRow");
const nailStyleRow = document.querySelector("#nailStyleRow");
const nailTypeSelect = document.querySelector("#nailType");
const nailStyleInput = document.querySelector("#nailStyle");
let pendingWhatsAppMessage = "";

// ---------------- Conditional nail fields + category preselect ----------------
function updateNailFields() {
  if (!serviceSelect) return; // booking form only exists on index.html
  const isNail = serviceSelect.value === "Nail Art";
  if (nailTypeRow) nailTypeRow.hidden = !isNail;
  if (nailStyleRow) nailStyleRow.hidden = !isNail;
  if (!isNail && nailTypeSelect) { nailTypeSelect.value = ""; if (nailStyleInput) nailStyleInput.value = ""; }
}

serviceSelect?.addEventListener("change", updateNailFields);

// Service cards preselect the booking category
document.querySelectorAll(".service-card[data-category]").forEach(card => {
  card.addEventListener("click", () => {
    serviceSelect.value = card.dataset.category;
    updateNailFields();
  });
});

// ---------------- Language switcher ----------------
function applyLanguage(lang) {
  state.lang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  document.querySelectorAll("[data-title-i18n]").forEach(el => { el.dataset.title = t(el.dataset.titleI18n); });
  // Re-render portfolio-dependent UI in the new language. Uses optional chaining-style guard:
  // applyLanguage can run before portfolioState is initialized (saved-language restore
  // executes earlier in the file than portfolioState's declaration).
  if (window.__portfolioReady === true) {
    renderPortfolio(portfolioState.activeFilter);
    renderFeaturedWorks();
  } else if (window.__portfolioNoticeKey) {
    renderPortfolioNotice(t(window.__portfolioNoticeKey));
  }
  // Preserve entered values in the service select
  const selected = serviceSelect?.value ?? "";
  if (serviceSelect) {
    [...serviceSelect.options].forEach((option, i) => {
      const keys = ["", "opt_nail", "opt_lash", "opt_brow", "opt_makeup", "opt_consult"];
      option.textContent = i === 0 ? t("f_service_ph") : t(keys[i]);
    });
    serviceSelect.value = selected;
  }
  if (nailTypeSelect) {
    [...nailTypeSelect.options].forEach((option, i) => {
      const keys = ["", "opt_natural", "opt_extension"];
      option.textContent = i === 0 ? t("f_nailtype_ph") : t(keys[i]);
    });
  }
  [...(document.querySelector("#preferredTime")?.options || [])].forEach((option, i) => {
    const keys = ["", "time1", "time2", "time3", "time_flex"];
    option.textContent = i === 0 ? t("f_time_ph") : t(keys[i]);
  });
  document.querySelectorAll(".lang-btn").forEach(b => b.classList.toggle("active", b.dataset.lang === lang));
  try { localStorage.setItem("byniadania-lang", lang); } catch (e) { /* private mode */ }
}

document.querySelectorAll(".lang-btn").forEach(button => {
  button.addEventListener("click", () => applyLanguage(button.dataset.lang));
});
try {
  const saved = localStorage.getItem("byniadania-lang");
  if (saved === "en" || saved === "id") applyLanguage(saved);
} catch (e) { /* ignore */ }

// ---------------- Menu ----------------
menuToggle?.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  navLinks.classList.toggle("open", !expanded);
});
navLinks?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

// ---------------- Scroll header ----------------
const onScroll = () => header?.classList.toggle("scrolled", window.scrollY > 20);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------------- Reveal animations ----------------
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reducedMotion) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach(el => observer.observe(el));
} else {
  revealElements.forEach(el => el.classList.add("visible"));
}

// ---------------- Hero 3D parallax (pointer-driven, layered transforms) ----------------
const heroScene = document.querySelector("#heroScene");
if (heroScene && !reducedMotion && window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
  const layers = heroScene.querySelectorAll("[data-depth]");
  let raf = 0;
  heroScene.addEventListener("pointermove", event => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const rect = heroScene.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      layers.forEach(layer => {
        const depth = parseFloat(layer.dataset.depth);
        layer.style.transform = `translate3d(${x * depth * 1000}px, ${y * depth * 1000}px, 0)`;
      });
    });
  });
  heroScene.addEventListener("pointerleave", () => {
    layers.forEach(layer => { layer.style.transform = ""; });
  });
}

// ---------------- Hero carousel (interactive image carousel) ----------------
const heroState = { slides: [], index: 0, timer: null, dragging: false, startX: 0, deltaX: 0 };
const heroCarousel = document.querySelector("#heroCarousel");

function heroSlidesFromPortfolio() {
  // Featured first; fall back to any published item. Every slide always has a
  // real photo: the sheet cover when present, otherwise a local category photo.
  const items = portfolioState.items;
  if (!items.length) return [];
  const featured = items.filter(item => item.featured);
  return (featured.length ? featured : items).slice(0, 5);
}

function buildHeroCarousel() {
  if (!heroCarousel) return;
  const track = heroCarousel.querySelector("#heroTrack");
  const dots = heroCarousel.querySelector("#heroDots");
  if (!track || !dots) return;
  const slides = heroSlidesFromPortfolio();
  if (!slides.length) return; // keep the existing fallback slide

  heroState.slides = slides;
  track.innerHTML = slides.map((item, i) => `
    <div class="hero-slide${i === 0 ? " active" : ""}" role="img" aria-label="${escapeHtml(item.title)}"
      style="background-image:url('${escapeHtml(item.cover || localPhotoFor(item))}');background-position:${item.category === "nail-art" ? "center 70%" : "center 30%"}"
      data-index="${i}" data-title="${escapeHtml(item.title)}" data-category="${escapeHtml(item.category)}" data-url="${escapeHtml(item.url)}" data-media="${item.media}"></div>`
  ).join("");
  dots.innerHTML = slides.map((item, i) => `
    <button class="hero-dot${i === 0 ? " active" : ""}" type="button" role="tab" aria-label="${escapeHtml(item.title)}" data-index="${i}"></button>
  `).join("");

  heroState.index = 0;
  bindHeroControls();
  startHeroAutoplay();
}

function goHero(index) {
  const track = heroCarousel?.querySelector("#heroTrack");
  if (!track || heroState.slides.length < 2) return;
  const count = heroState.slides.length;
  heroState.index = (index + count) % count;
  track.style.transform = `translateX(-${heroState.index * 100}%)`;
  track.querySelectorAll(".hero-slide").forEach((slide, i) => slide.classList.toggle("active", i === heroState.index));
  heroCarousel.querySelectorAll(".hero-dot").forEach((dot, i) => dot.classList.toggle("active", i === heroState.index));
}

function startHeroAutoplay() {
  if (reducedMotion || heroState.slides.length < 2) return;
  stopHeroAutoplay();
  heroState.timer = window.setInterval(() => goHero(heroState.index + 1), 6000);
}
function stopHeroAutoplay() {
  if (heroState.timer) { window.clearInterval(heroState.timer); heroState.timer = null; }
}

function bindHeroControls() {
  if (!heroCarousel) return;
  const prev = heroCarousel.querySelector("#heroPrev");
  const next = heroCarousel.querySelector("#heroNext");
  const track = heroCarousel.querySelector("#heroTrack");

  prev?.addEventListener("click", () => { stopHeroAutoplay(); goHero(heroState.index - 1); });
  next?.addEventListener("click", () => { stopHeroAutoplay(); goHero(heroState.index + 1); });
  heroCarousel.querySelectorAll(".hero-dot").forEach(dot => {
    dot.addEventListener("click", () => { stopHeroAutoplay(); goHero(Number(dot.dataset.index)); });
  });

  // Pause autoplay while pointer hovers or keyboard focus is inside.
  heroCarousel.addEventListener("pointerenter", stopHeroAutoplay);
  heroCarousel.addEventListener("pointerleave", startHeroAutoplay);
  heroCarousel.addEventListener("focusin", stopHeroAutoplay);
  heroCarousel.addEventListener("focusout", startHeroAutoplay);

  // Click a slide -> portfolio modal (only if it was not a drag)
  track?.querySelectorAll(".hero-slide").forEach(slide => {
    slide.addEventListener("click", () => {
      if (heroState.dragged) { heroState.dragged = false; return; }
      const item = heroState.slides[heroState.index];
      if (item) openInstagramModal(item.url, item.title, item);
    });
  });

  // Drag (desktop pointer) and swipe (touch) share one gesture handler.
  let startX = 0, delta = 0, dragging = false;
  const begin = clientX => { dragging = true; startX = clientX; delta = 0; stopHeroAutoplay(); track.style.transition = "none"; };
  const move = clientX => {
    if (!dragging) return;
    delta = clientX - startX;
    track.style.transform = `translateX(calc(-${heroState.index * 100}% + ${delta}px))`;
  };
  const end = () => {
    if (!dragging) return;
    dragging = false;
    heroState.dragged = Math.abs(delta) > 40;
    track.style.transition = "";
    if (Math.abs(delta) > 60) goHero(heroState.index + (delta < 0 ? 1 : -1));
    else goHero(heroState.index); // snap back
    startHeroAutoplay();
  };

  heroCarousel.addEventListener("pointerdown", e => { if (e.pointerType === "mouse") begin(e.clientX); });
  window.addEventListener("pointermove", e => { if (dragging && e.pointerType === "mouse") move(e.clientX); });
  window.addEventListener("pointerup", end);
  heroCarousel.addEventListener("touchstart", e => begin(e.touches[0].clientX), { passive: true });
  heroCarousel.addEventListener("touchmove", e => move(e.touches[0].clientX), { passive: true });
  heroCarousel.addEventListener("touchend", end);

  // Keyboard navigation
  heroCarousel.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") { stopHeroAutoplay(); goHero(heroState.index - 1); }
    if (e.key === "ArrowRight") { stopHeroAutoplay(); goHero(heroState.index + 1); }
  });
}

// Hero lightbox replaced by the shared portfolio modal; kept as thin wrapper.
function openHeroLightbox(item) {
  openInstagramModal(item.url, item.title, item);
}

// ---------------- Gallery filters ----------------
document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    document.querySelectorAll(".gallery-item").forEach(item => {
    item.classList.toggle("is-hidden", filter !== "all" && item.dataset.kind !== filter);
    });
    });
    });

    // ---------------- Portfolio data (single source: Google Sheets via Apps Script) ----------------
    const portfolioState = {
    items: [],        // valid PUBLISHED items only
    loaded: false,
    failed: false,
    noticeKey: "portfolio_notice_setup", // last notice shown, re-translated on language switch
    activeFilter: "all"
    };

    const CATEGORY_ALIASES = {
    "nail art": "nail-art",
    "nailart": "nail-art",
    "eyelash": "eyelash",
    "lash": "eyelash",
    "brow": "brow",
    "eyebrow": "brow",
    "makeup": "makeup"
    };

    function normalizeCategory(raw) {
    const key = String(raw || "").trim().toLowerCase();
    return CATEGORY_ALIASES[key] || null; // unmapped categories (e.g. "Studio / Brand") return null
    }

    function isValidInstagramUrl(url) {
    try {
    const u = new URL(url);
    return u.hostname.endsWith("instagram.com") && /^\/p\/[\w-]+\/?$/.test(u.pathname);
    } catch (e) { return false; }
    }

    /**
     * Client-side validation mirror of the Apps Script filter.
     * Extra safety: even if a DRAFT item somehow reaches the client, it stays hidden.
     */
    function isPublicPortfolioItem(row) {
    if (String(row.status_data || "").trim().toLowerCase() !== "published") return false;
    if (!row.id || !row.judul || !row.instagram_url) return false;
    if (!isValidInstagramUrl(row.instagram_url)) return false;
    const category = normalizeCategory(row.kategori);
    if (!category) return false; // Studio/Brand or mixed categories stay out of the treatment gallery
    return true;
    }

    async function loadPortfolio() {
    const grid = document.querySelector("#galleryGrid") || document.querySelector("#serviceGrid");
    if (!grid) return;
    if (!APPS_SCRIPT_URL.trim()) {
    renderPortfolioNotice(t("portfolio_notice_setup"), "portfolio_notice_setup");
    return;
    }
    try {
    const response = await fetch(`${APPS_SCRIPT_URL}${APPS_SCRIPT_URL.includes("?") ? "&" : "?"}action=portfolio`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (!payload || payload.success !== true || !Array.isArray(payload.data)) {
      throw new Error("Unexpected response");
    }
    portfolioState.items = payload.data
      .filter(isPublicPortfolioItem)
      .map(row => ({
            id: row.id,
            title: row.judul,
            category: normalizeCategory(row.kategori),
            media: String(row.tipe_media || "Foto").trim().toLowerCase() === "video" ? "video" : "foto",
            url: row.instagram_url,
            cover: row.cover_url && /^https?:\/\//.test(String(row.cover_url).trim()) ? row.cover_url.trim() : "",
            description: row.deskripsi || "",
            featured: String(row.unggulan || "").trim().toUpperCase() === "TRUE",
            order: Number(row.urutan) || 0
      }))
      .sort((a, b) => a.order - b.order);
    portfolioState.loaded = true;
    portfolioState.failed = false;
    window.__portfolioReady = true;
    window.__portfolioNoticeKey = null;
    renderPortfolio();
    renderFeaturedWorks();
    buildHeroCarousel();
    } catch (err) {
    portfolioState.failed = true;
    renderPortfolioNotice(t("portfolio_notice_error"), "portfolio_notice_error");
    addRetryButton();
    }
    }

    function addRetryButton() {
    const grid = document.querySelector("#galleryGrid");
    if (!grid) return;
    const btn = document.createElement("button");
    btn.className = "button button-outline gallery-retry";
    btn.type = "button";
    btn.textContent = state.lang === "id" ? "Coba lagi" : "Try again";
    btn.addEventListener("click", () => { btn.remove(); loadPortfolio(); });
    grid.appendChild(btn);
    }

    function renderPortfolioNotice(message, key) {
    const grid = document.querySelector("#galleryGrid");
    if (!grid) return;
    portfolioState.noticeKey = key || portfolioState.noticeKey || "portfolio_notice_setup";
    window.__portfolioNoticeKey = portfolioState.noticeKey;
    grid.innerHTML = `<div class="gallery-notice">${escapeHtml(message)}</div>`;
    const emptyEl = document.querySelector("#galleryEmpty");
    if (emptyEl) emptyEl.hidden = true;
    }

    function placeholderFor(category) {
    return {
      "nail-art": "assets/placeholders/nail-art.svg",
      "eyelash": "assets/placeholders/eyelash.svg",
      "brow": "assets/placeholders/brow.svg",
      "makeup": "assets/placeholders/makeup.svg"
    }[category] || "assets/placeholders/nail-art.svg";
    }

    /**
     * Media for cards: real cover if available (with onerror fallback to the
     * category placeholder), otherwise the placeholder directly.
     * Never renders an empty card.
     */
    function cardMedia(item, className) {
    const cls = className ? ` class="${className}"` : "";
    const eager = arguments[2] === true ? "" : " loading=\"lazy\"";
    // Real cover from the sheet, with a local category photo as onerror fallback.
    if (item.cover) {
      const fb = localPhotoFor(item);
      return `<img${cls} src="${escapeHtml(item.cover)}" alt="${escapeHtml(item.title)}"${eager} onerror="this.onerror=null;this.src='${fb}';this.closest('[data-preview-card]')?.classList.add('is-preview');">`;
    }
    // No cover yet: show a real, local, category-matched illustrative photo.
    return `<img${cls} src="${localPhotoFor(item)}" alt="${escapeHtml(item.title)} (illustrative photo)"${eager} data-placeholder="1">`;
    }

    function portfolioCard(item) {
    const isPreview = !item.cover;
    const play = item.media === "video" ? `<span class="media-play" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5-11-6.5z"/></svg></span>` : "";
    return `<button class="gallery-item${item.media === "video" ? " has-video" : ""}${isPreview ? " is-preview" : ""}" type="button" data-preview-card="1" data-category-key="${item.category}" data-url="${escapeHtml(item.url)}" data-title="${escapeHtml(item.title)}" data-id="${escapeHtml(item.id)}" aria-label="${escapeHtml(item.title)}">
    ${cardMedia(item)}
    ${play}
    <span class="gallery-label">${escapeHtml(item.title)}</span>
    <span class="media-preview-tag">Illustrative</span>
    </button>`;
    }

    function renderPortfolio() {
    const grid = document.querySelector("#galleryGrid");
    if (!grid || !portfolioState.loaded) return;
    const filter = portfolioState.activeFilter;
    const items = filter === "all" ? portfolioState.items : portfolioState.items.filter(item => item.category === filter);
    grid.innerHTML = items.map(portfolioCard).join("");
    const emptyEl = document.querySelector("#galleryEmpty");
    if (emptyEl) emptyEl.hidden = items.length > 0;
    bindGalleryItems();
    }

    function bindGalleryItems() {
    document.querySelectorAll("#galleryGrid .gallery-item").forEach(item => {
    item.addEventListener("click", () => {
      const found = portfolioState.items.find(w => w.title === item.dataset.title && w.category === item.dataset.categoryKey);
      openInstagramModal(item.dataset.url, item.dataset.title, found);
    });
    });
    }

    /**
     * Premium two-column portfolio modal: media left, info right on desktop;
     * stacked on mobile. Always shows a real photo (cover or local fallback)
     * plus a direct link to the original Instagram post — no raw embeds.
     * Focus returns to the originating card on close.
     */
    let lastModalTrigger = null;
    function openInstagramModal(postUrl, title, item) {
      lastModalTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const modal = document.createElement("dialog");
      modal.className = "portfolio-modal";
      const media = item ? cardMedia(item, "", true) : `<img src="${HERO_FALLBACK_PHOTO}" alt="">`;
      const play = item && item.media === "video"
        ? `<span class="media-play" aria-hidden="true"><svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5-11-6.5z"/></svg></span>`
        : "";
      const isIllustrative = item && !item.cover;
      const descKey = isIllustrative ? (state.lang === "id" ? FALLBACK_CAPTION_ID : FALLBACK_CAPTION_EN) : (item && item.description ? item.description : "");
      const cat = item && item.category ? item.category.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase()) : "";
      modal.innerHTML = `
      <button class="lightbox-close" aria-label="${t("lightbox_close")}"><span></span><span></span></button>
      <div class="portfolio-modal-grid">
        <div class="portfolio-modal-media">${media}${play}</div>
        <div class="portfolio-modal-info">
          ${cat ? `<p class="portfolio-modal-cat">${escapeHtml(cat)}${item.media === "video" ? " · Video" : ""}</p>` : ""}
          <h3>${escapeHtml(title || "")}</h3>
          ${descKey ? `<p class="portfolio-desc${isIllustrative ? " is-illustrative" : ""}">${escapeHtml(descKey)}</p>` : ""}
          <div class="portfolio-modal-actions">
            <a class="button button-dark" href="${escapeHtml(postUrl)}" target="_blank" rel="noopener noreferrer" data-i18n="open_on_instagram">Watch on Instagram</a>
            <a class="button button-outline" href="index.html#booking" data-close-portfolio data-i18n="gallery_book">Book an appointment</a>
          </div>
        </div>
      </div>`;
      document.body.appendChild(modal);
      modal.showModal();
      document.body.classList.add("no-scroll");
      const close = () => modal.close();
      modal.querySelector(".lightbox-close").addEventListener("click", close);
      modal.querySelector("[data-close-portfolio]")?.addEventListener("click", () => close());
      modal.addEventListener("click", e => { if (e.target === modal) close(); });
      modal.addEventListener("close", () => {
        modal.remove();
        document.body.classList.remove("no-scroll");
        if (lastModalTrigger && document.contains(lastModalTrigger)) lastModalTrigger.focus();
      }, { once: true });
    }

    // ---------------- Gallery filters (dynamic portfolio + fallback) ----------------
    document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    portfolioState.activeFilter = button.dataset.filter;
    if (portfolioState.loaded) {
      renderPortfolio();
    } else {
      document.querySelectorAll("#galleryGrid .gallery-item").forEach(item => {
            item.classList.toggle("is-hidden", portfolioState.activeFilter !== "all" && item.dataset.categoryKey !== portfolioState.activeFilter);
      });
    }
    });
    });

// ---------------- Gallery lightbox ----------------
document.querySelectorAll(".gallery-item").forEach(item => {
  item.addEventListener("click", () => {
    const image = item.querySelector("img");
    if (!image) return;
    const lightbox = document.createElement("dialog");
    lightbox.className = "image-lightbox";
    lightbox.innerHTML = `<button class="lightbox-close" aria-label="${t("lightbox_close")}"><span></span><span></span></button><img alt=""><p></p>`;
    lightbox.querySelector("img").src = image.src;
    lightbox.querySelector("img").alt = image.alt;
    lightbox.querySelector("p").textContent = item.dataset.title || image.alt;
    document.body.appendChild(lightbox);
    lightbox.showModal();
    document.body.classList.add("no-scroll");
    const close = () => { lightbox.close(); lightbox.remove(); document.body.classList.remove("no-scroll"); };
    lightbox.querySelector("button").addEventListener("click", close);
    lightbox.addEventListener("click", e => { if (e.target === lightbox) close(); });
    lightbox.addEventListener("close", () => { lightbox.remove(); document.body.classList.remove("no-scroll"); }, { once: true });
  });
});

// ---------------- Toast ----------------
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 3200);
}

// ---------------- Booking form ----------------
const PHONE_RE = /^(\+?62|0)8\d{7,12}$/;

function setFieldError(field, errorEl, hasError) {
  field.classList.toggle("invalid", hasError);
  errorEl.classList.toggle("visible", hasError);
  field.setAttribute("aria-invalid", String(hasError));
}

function validateBooking() {
  let ok = true;
  const name = document.querySelector("#customerName");
  const phone = document.querySelector("#customerPhone");
  const consent = document.querySelector("#confirm");
  const nameError = name.parentElement.querySelector(".field-error");
  const phoneError = phone.parentElement.querySelector(".field-error");
  const serviceError = serviceSelect.parentElement.querySelector(".field-error");
  const consentError = consent.parentElement.querySelector(".field-error");

  setFieldError(name, nameError, !name.value.trim());
  setFieldError(phone, phoneError, !PHONE_RE.test(phone.value.trim()));
  setFieldError(serviceSelect, serviceError, !serviceSelect.value);
  setFieldError(consent, consentError, !consent.checked);
  ok = name.value.trim() && PHONE_RE.test(phone.value.trim()) && serviceSelect.value && consent.checked;

  if (!ok) {
    const firstInvalid = document.querySelector(".booking-form .invalid");
    firstInvalid?.focus();
    firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  return ok;
}

function formatDate(value) {
  if (!value) return "";
  const d = new Date(`${value}T00:00:00`);
  const locale = state.lang === "id" ? "id-ID" : "en-GB";
  return Number.isNaN(d.getTime()) ? value : new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(d);
}

form?.addEventListener("submit", event => {
  event.preventDefault();
  if (!validateBooking()) return;
  const data = new FormData(form);
  const service = data.get("service");
  const isNail = service === "Nail Art";
  const dateVal = data.get("preferredDate");
  const timeVal = data.get("preferredTime");

  const fields = [
    [t("wa_name"), data.get("customerName"), true],
    [t("wa_phone"), data.get("customerPhone"), true],
    [t("wa_service"), service, true],
    [t("wa_date"), formatDate(dateVal), !!dateVal],
    [t("wa_time"), timeVal || t("wa_flex"), !!timeVal],
    [t("wa_nailtype"), data.get("nailType"), isNail && !!data.get("nailType")],
    [t("wa_nailstyle"), data.get("nailStyle"), isNail && !!data.get("nailStyle")],
    [t("wa_notes"), data.get("notes"), !!data.get("notes")]
  ];
  const shown = fields.filter(([, , include]) => include);

  summaryContent.innerHTML = shown.map(([label, value]) =>
    `<div class="summary-row"><span>${escapeHtml(label)}</span><span>${escapeHtml(String(value))}</span></div>`
  ).join("");

  pendingWhatsAppMessage = [
    t("wa_greeting"),
    "",
    ...shown.map(([label, value]) => `${label}: ${value}`),
    "",
    t("wa_confirm")
  ].join("\n");

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
    document.body.classList.add("no-scroll");
  } else {
    const confirmed = window.confirm(t("summary_note"));
    if (confirmed) openWhatsApp();
  }
});

// ---------------- Dialog ----------------
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}
function closeDialog() {
  dialog.close();
  document.body.classList.remove("no-scroll");
}
document.querySelector("#closeDialog")?.addEventListener("click", closeDialog);
document.querySelector("#editBooking")?.addEventListener("click", () => {
  state.editData = true;
  closeDialog();
});
dialog?.addEventListener("click", event => { if (event.target === dialog) closeDialog(); });
dialog?.addEventListener("close", () => document.body.classList.remove("no-scroll"));

function openWhatsApp() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(pendingWhatsAppMessage)}`;
  window.open(url, "_blank", "noopener,noreferrer");
  closeDialog();
}
document.querySelector("#sendWhatsApp")?.addEventListener("click", openWhatsApp);

// ---------------- Google Form option ----------------
const googleFormLink = document.querySelector("#googleFormLink");
const googleFormNote = document.querySelector("#googleFormNote");
if (GOOGLE_FORM_URL.trim() && googleFormLink) {
  googleFormLink.href = GOOGLE_FORM_URL;
  googleFormLink.target = "_blank";
  googleFormLink.rel = "noopener noreferrer";
  if (googleFormNote) googleFormNote.textContent = t("gform_note_ready");
} else if (googleFormLink) {
  googleFormLink.addEventListener("click", event => {
    event.preventDefault();
    showToast(t("toast_gform"));
  });
}

// ---------------- Socials ----------------
document.querySelectorAll(".social-btn").forEach(button => {
  const key = button.dataset.social;
  const url = BUSINESS_SOCIALS[key];
  if (!url) {
    button.addEventListener("click", event => {
      event.preventDefault();
      showToast(t("toast_social"));
    });
  }
});

// ---------------- PortoWeb credit (WhatsApp text link + Instagram icon) ----------------
// The credit line is now a real WhatsApp text link, so the coming-soon handler is no longer needed.
document.querySelectorAll(".footer-credit [data-i18n]").forEach(el => el.remove());

// ---------------- Footer year ----------------
const yearEl = document.querySelector("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------------- Injected lightbox styles (kept from original) ----------------
const style = document.createElement("style");
style.textContent = `
.image-lightbox{width:min(900px,calc(100% - 40px));max-height:92vh;padding:20px;border:0;border-radius:24px;background:#f4efe8;color:#27272a;overflow:auto}
.image-lightbox::backdrop{background:#171719dd;backdrop-filter:blur(4px)}
.image-lightbox img{max-height:78vh;width:100%;object-fit:contain;border-radius:16px}
.image-lightbox p{margin:12px 0 0;font:italic 20px Fraunces,Georgia,serif}
.lightbox-close{position:sticky;top:0;float:right;z-index:2;margin-bottom:-40px;border:0;border-radius:50%;width:38px;height:38px;background:#f4efe8;color:#27272a;cursor:pointer}
.lightbox-close span{position:absolute;left:50%;top:50%;width:16px;height:1.6px;background:currentColor;transform:translate(-50%,-50%) rotate(45deg)}
.lightbox-close span:last-child{transform:translate(-50%,-50%) rotate(-45deg)}
`;
document.head.appendChild(style);

// ---------------- Featured works (driven by portfolio data, defensive) ----------------
function renderFeaturedWorks() {
  const wrap = document.querySelector("#featuredWorks");
  if (!wrap || !portfolioState.loaded) return;
  const featured = portfolioState.items.filter(item => item.featured);
  const items = featured.length ? featured : portfolioState.items.slice(0, 3);
  const grid = wrap.querySelector(".featured-grid");
  if (!items.length) { wrap.hidden = true; return; }
  wrap.hidden = false;
  grid.innerHTML = items.map(featuredCard).join("");
  grid.querySelectorAll(".featured-item").forEach(item => {
    const found = portfolioState.items.find(w => w.title === item.dataset.title);
    item.addEventListener("click", () => openInstagramModal(item.dataset.url, item.dataset.title, found));
  });
  wrap.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
}

function featuredCard(item) {
  const play = item.media === "video" ? `<span class="media-play" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5-11-6.5z"/></svg></span>` : "";
  return `<button class="featured-item${item.cover ? "" : " is-preview"}" type="button" data-preview-card="1" data-url="${escapeHtml(item.url)}" data-title="${escapeHtml(item.title)}" data-id="${escapeHtml(item.id)}" aria-label="${escapeHtml(item.title)}">
    ${cardMedia(item)}${play}<span class="featured-label">${escapeHtml(item.title)}</span>
    <span class="media-preview-tag">Illustrative</span>
  </button>`;
}

window.loadPortfolioRef = loadPortfolio;
loadPortfolio();

// ================= Price list API (Google Sheets via Apps Script) =================
// Enriches the brochure rows in index.html with live data from the ?action=prices
// endpoint. index.html remains the offline fallback; the Sheet is the source of truth.
const PRICES_ENRICHED_KEY = "byniadania-prices-loaded";

function parseIdr(value) {
  const clean = String(value || "").replace(/[^\d]/g, "");
  return clean ? parseInt(clean, 10) : null;
}

function normalizePriceKey(name) {
  return String(name || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function enrichPriceList() {
  if (document.querySelector(PRICES_ENRICHED_KEY)) return; // service.html has no price list
  if (!APPS_SCRIPT_URL.trim()) return;
  try {
    const response = await fetch(`${APPS_SCRIPT_URL}${APPS_SCRIPT_URL.includes("?") ? "&" : "?"}action=prices`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (!payload || payload.success !== true || !Array.isArray(payload.data)) throw new Error("Unexpected response");
    const rows = payload.data;
    const byKey = new Map();
    rows.forEach(row => {
      const key = normalizePriceKey(row.layanan);
      if (key) byKey.set(key, row);
    });
    document.querySelectorAll("#prices .price-row").forEach(rowEl => {
      const nameEl = rowEl.querySelector("h3");
      if (!nameEl) return;
      const row = byKey.get(normalizePriceKey(nameEl.textContent));
      if (!row) return;
      const priceEl = rowEl.querySelector("strong");
      if (!priceEl) return;
      priceEl.dataset.priceId = row.id || "";
      if (row.harga_idr && String(row.harga_idr).trim()) {
        priceEl.textContent = String(row.harga_idr).trim().replace("Rp ", "Rp");
      } else if (row.harga_min_idr && row.harga_max_idr) {
        priceEl.textContent = `${String(row.harga_min_idr).trim().replace("Rp ", "Rp")}–${String(row.harga_max_idr).trim().replace("Rp ", "Rp")}`;
      } else if (row.harga_min_idr) {
        priceEl.textContent = `${String(row.harga_min_idr).trim().replace("Rp ", "Rp")}+`;
      }
    });
    document.documentElement.dataset[PRICES_ENRICHED_KEY.replace(/-/g, "_")] = "1";
  } catch (err) {
    /* Offline or endpoint unavailable: keep the brochure prices already in index.html. */
  }
}
enrichPriceList();

// ================= Reserving transition (light panel move, no heavy scroll) =================
function focusBooking(allowNativeScroll) {
  const section = document.querySelector("#booking");
  if (!section || !section.scrollIntoView) return;
  if (allowNativeScroll) {
    section.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    return;
  }
  if (reducedMotion) {
    section.scrollIntoView({ behavior: "auto", block: "start" });
    return;
  }
  section.style.transition = "transform .25s ease";
  section.style.transform = "translateY(6px)";
  section.style.opacity = "0.4";
  section.scrollIntoView({ behavior: "smooth", block: "start" });
  requestAnimationFrame(() => {
    section.style.transition = "transform .28s ease, opacity .28s ease";
    section.style.transform = "";
    section.style.opacity = "";
  });
  window.setTimeout(() => {
    section.style.transition = "";
    section.style.opacity = "";
  }, 380);
}

// All reserving CTAs move to the reserving section with the light panel transition.
document.querySelectorAll('a[href="#booking"]').forEach(link => {
  link.addEventListener("click", event => {
    if (link.dataset.noBookingTransition === "1") return;
    event.preventDefault();
    focusBooking(true);
  });
});

// ---------------- Expose internals for service.html ----------------
window.I18N_REF = I18N;
window.applyLanguageRef = applyLanguage;
window.portfolioCard = portfolioCard;
window.bindGalleryItems = bindGalleryItems;
Object.defineProperty(window, "__portfolioItems", { get: () => portfolioState.items });

// ---------------- Booking preselect from service pages ----------------
try {
  const preselected = sessionStorage.getItem("byniadania-service");
  if (preselected && serviceSelect) {
    const match = [...serviceSelect.options].find(o => o.value === preselected || o.text === preselected);
    if (match) { serviceSelect.value = match.value; updateNailFields(); }
    sessionStorage.removeItem("byniadania-service");
  }
} catch (e) { /* ignore */ }

// ================= Service page hero photo click -> lightbox (service.html) =================
(function bindServiceHeroPhoto() {
  const photo = document.querySelector("#servicePhoto");
  if (!photo) return;
  photo.style.cursor = "zoom-in";
  photo.setAttribute("role", "button");
  photo.setAttribute("tabindex", "0");
  photo.setAttribute("aria-label", "Buka foto layanan lebih besar");
  const open = () => {
    const src = photo.style.backgroundImage.match(/url\(["']?(.+?)["']?\)/);
    if (!src) return;
    openServiceLightbox(src[1], "");
  };
  photo.addEventListener("click", open);
  photo.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
})();

/** Simple single-image lightbox for service pages (photo already in the DOM). */
function openServiceLightbox(imageSrc, caption) {
  const lightbox = document.createElement("dialog");
  lightbox.className = "image-lightbox";
  lightbox.innerHTML = `<button class="lightbox-close" aria-label="${t("lightbox_close")}"><span></span><span></span></button><img alt=""><p></p>`;
  lightbox.querySelector("img").src = imageSrc;
  lightbox.querySelector("p").textContent = caption || "";
  document.body.appendChild(lightbox);
  lightbox.showModal();
  document.body.classList.add("no-scroll");
  const close = () => { lightbox.close(); lightbox.remove(); document.body.classList.remove("no-scroll"); };
  lightbox.querySelector("button").addEventListener("click", close);
  lightbox.addEventListener("click", e => { if (e.target === lightbox) close(); });
  lightbox.addEventListener("close", () => { lightbox.remove(); document.body.classList.remove("no-scroll"); }, { once: true });
}

// ================= Service cart (WhatsApp) =================
// Items come from the price enrich step above, which reads ?action=prices
// (Google Sheet "Menu" tab via Apps Script). Cart state survives page changes.
const CART_STORAGE_KEY = "byniadania-cart-v1";

let cartState = [];
try {
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  const parsed = raw ? JSON.parse(raw) : [];
  cartState = Array.isArray(parsed)
    ? parsed.filter(it => it && typeof it === "object" && it.id && it.name).slice(0, 30)
    : [];
} catch (e) { cartState = []; try { localStorage.removeItem(CART_STORAGE_KEY); } catch (e2) {} }

function persistCart() {
  try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState)); } catch (e) { /* private mode */ }
}

function cartCount() {
  return cartState.reduce((sum, it) => sum + (it.qty || 1), 0);
}

function parseIdrToNumber(text) {
  const clean = String(text || "").replace(/[^\d]/g, "");
  if (!clean) return null;
  const n = parseInt(clean, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function formatRupiah(number) {
  return `Rp${number.toLocaleString("id-ID")}`;
}

/** Item price status: exact / range / confirm. Never shows Rp0, NaN, or undefined. */
function cartItemPrice(item) {
  if (item.min != null && item.max != null) return { type: "range", min: item.min, max: item.max };
  if (item.price != null) return { type: "exact", value: item.price };
  return { type: "confirm" };
}

function cartSubtotal() {
  let total = 0;
  let allConfirmed = true;
  cartState.forEach(it => {
    const p = cartItemPrice(it);
    if (p.type === "exact") total += p.value * (it.qty || 1);
    else if (p.type === "range") total += p.min * (it.qty || 1);
    else allConfirmed = false;
  });
  return { total, allConfirmed };
}

function buildCartUI() {
  const has = cartState.length > 0;
  const cartBadge = document.querySelector("#cartBadge");
  const floatBtn = document.querySelector("#cartFloat");
  const items = cartState.length ? cartState.map(it => {
    const p = cartItemPrice(it);
    const priceText = p.type === "exact" ? formatRupiah(p.value)
      : p.type === "range" ? `${t("cart_range")} ${formatRupiah(p.min)}`
      : t("cart_confirm");
    return `<li class="cart-item">
      <div class="cart-item-copy">
        <strong>${escapeHtml(it.name)}</strong>
        ${it.variant ? `<span class="cart-item-variant">${t("cart_wa_variant")}: ${escapeHtml(it.variant)}</span>` : ""}
        <span class="cart-item-price${p.type === "confirm" ? " is-confirm" : ""}">${escapeHtml(priceText)}</span>
      </div>
      <div class="cart-item-actions">
        <button class="cart-item-remove" data-cart-remove="${escapeHtml(it.id)}" aria-label="${t("cart_remove")}">&times;</button>
      </div>
    </li>`;
  }).join("") : `<li class="cart-empty">${escapeHtml(t("cart_empty"))}</li>`;
  const sub = cartSubtotal();
  const subtotalBlock = cartState.length && (sub.total > 0 || !sub.allConfirmed)
    ? `<div class="cart-subtotal">
        <span>${escapeHtml(t("cart_subtotal"))}</span>
        <strong>${sub.total > 0 ? formatRupiah(sub.total) : ""}</strong>
      </div>
      ${!sub.allConfirmed ? `<p class="cart-note">${escapeHtml(t("cart_note"))}</p>` : ""}`
    : "";
  const otherCats = ["Eyelash", "Brow", "Makeup"];
  const catCounts = cartState.reduce((acc, it) => { acc[it.category] = (acc[it.category] || 0) + 1; return acc; }, {});
  const missingCats = otherCats.filter(c => !catCounts[c]);
  const otherBlock = cartState.length && missingCats.length
    ? `<p class="cart-other">${escapeHtml(t("cart_other"))} ${missingCats.map(escapeHtml).join(", ")}</p>`
    : "";
  if (cartBadge) { cartBadge.textContent = cartCount(); cartBadge.hidden = !has; }
  if (floatBtn) floatBtn.hidden = !has;
  const body = document.querySelector("#cartItems");
  if (body) body.innerHTML = items + subtotalBlock + otherBlock;
  const checkout = document.querySelector("#cartCheckout");
  if (checkout) checkout.hidden = !has;
  const clear = document.querySelector("#cartClear");
  if (clear) clear.hidden = !has;
}

function openCartDrawer() {
  const drawer = document.querySelector("#cartDrawer");
  if (!drawer || typeof drawer.showModal !== "function") return;
  buildCartUI();
  drawer.showModal();
  document.body.classList.add("no-scroll");
}

function closeCartDrawer() {
  const drawer = document.querySelector("#cartDrawer");
  if (drawer && drawer.open) drawer.close();
  document.body.classList.remove("no-scroll");
}

function cartWaMessage() {
  const lines = [t("cart_wa_greeting"), ""];
  cartState.forEach((it, i) => {
    const p = cartItemPrice(it);
    const priceText = p.type === "exact" ? formatRupiah(p.value)
      : p.type === "range" ? `${t("cart_range")} ${formatRupiah(p.min)}`
      : t("cart_confirm");
    lines.push(`${i + 1}. ${it.name}`);
    if (it.variant) lines.push(`   ${t("cart_wa_variant")}: ${it.variant}`);
    lines.push(`   ${t("cart_wa_price")}: ${priceText}`);
  });
  const sub = cartSubtotal();
  if (sub.total > 0) lines.push("", `${t("cart_subtotal")}: ${formatRupiah(sub.total)}`);
  if (!sub.allConfirmed) lines.push(t("cart_note"));
  lines.push("", t("cart_wa_details"), "", t("cart_wa_closing"));
  return lines.join("\n");
}

function initCartUI() {
  if (document.querySelector("#cartFloat")) return; // already initialized
  const floatBtn = document.createElement("button");
  floatBtn.id = "cartFloat";
  floatBtn.type = "button";
  floatBtn.className = "cart-float";
  floatBtn.setAttribute("aria-label", t("cart_view"));
  floatBtn.hidden = cartState.length === 0;
  floatBtn.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.8h7.7a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="10" cy="21" r="1.4"/><circle cx="18" cy="21" r="1.4"/></svg>
    <span class="cart-float-badge" id="cartBadge" hidden>${cartCount()}</span>`;
  floatBtn.addEventListener("click", openCartDrawer);
  document.body.appendChild(floatBtn);

  const drawer = document.createElement("dialog");
  drawer.id = "cartDrawer";
  drawer.className = "cart-drawer";
  drawer.innerHTML = `
    <button class="dialog-close cart-close" id="cartClose" aria-label="${t("lightbox_close")}"><span></span><span></span></button>
    <h2>${escapeHtml(t("cart_title"))}</h2>
    <ul class="cart-items" id="cartItems"></ul>
    <div class="cart-actions">
      <button class="button button-dark" id="cartCheckout" type="button">${escapeHtml(t("cart_checkout"))}</button>
      <button class="text-link" id="cartClear" type="button">${escapeHtml(t("cart_clear"))}</button>
    </div>`;
  document.body.appendChild(drawer);

  drawer.querySelector("#cartClose").addEventListener("click", closeCartDrawer);
  drawer.querySelector("#cartClear").addEventListener("click", () => {
    cartState = [];
    persistCart();
    buildCartUI();
  });
  drawer.querySelector("#cartCheckout").addEventListener("click", () => {
    if (!cartState.length) return;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(cartWaMessage())}`;
    window.open(url, "_blank", "noopener,noreferrer");
    // Cart stays filled so the customer can go back and edit the selection.
  });
  drawer.addEventListener("click", e => { if (e.target === drawer) closeCartDrawer(); });
  drawer.addEventListener("close", () => document.body.classList.remove("no-scroll"), { once: true });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && drawer.open) closeCartDrawer(); });

  // Remove buttons are delegated so re-renders stay bound.
  drawer.querySelector("#cartItems").addEventListener("click", e => {
    const btn = e.target.closest("[data-cart-remove]");
    if (!btn) return;
    cartState = cartState.filter(it => it.id !== btn.dataset.cartRemove);
    persistCart();
    buildCartUI();
  });

  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-cart-add]");
    if (!btn) return;
    const existing = cartState.find(it => it.id === btn.dataset.cartAdd);
    if (existing) { existing.qty = (existing.qty || 1) + 1; }
    else {
      cartState.push({
        id: btn.dataset.cartAdd,
        name: btn.dataset.cartName,
        variant: btn.dataset.cartVariant || "",
        category: btn.dataset.cartCategory || "",
        price: btn.dataset.cartPrice ? parseIdrToNumber(btn.dataset.cartPrice) : null,
        min: btn.dataset.cartMin ? parseIdrToNumber(btn.dataset.cartMin) : null,
        max: btn.dataset.cartMax ? parseIdrToNumber(btn.dataset.cartMax) : null,
        qty: 1
      });
    }
    persistCart();
    buildCartUI();
    showToast(t("cart_added"));
  });
}
initCartUI();

// ================= Price list cart buttons (index.html) =================
(function buildCartButtons() {
  const list = document.querySelector("#prices .price-list");
  if (!list) return; // service.html has no price list
  document.querySelectorAll("#prices .price-row").forEach(rowEl => {
    const nameEl = rowEl.querySelector("h3");
    const priceEl = rowEl.querySelector("strong");
    if (!nameEl || !priceEl) return;
    if (rowEl.querySelector("[data-cart-add]")) return;
    const id = priceEl.dataset.priceId || `local-${normalizePriceKey(nameEl.textContent)}`;
    const name = nameEl.textContent.trim();
    const needsVariant = /\b(French|Basic art|Cat eye|3D|Nail gel|Ombre|Blush)\b/i.test(name);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "button button-outline cart-add-btn";
    btn.dataset.cartAdd = id;
    btn.dataset.cartName = name;
    btn.dataset.cartCategory = "Nail Art";
    btn.textContent = t("add_to_cart");
    if (priceEl.textContent.includes("–") || priceEl.textContent.includes("/") || priceEl.textContent.includes("+")) {
      // Range or dual (natural/extension) price: no fixed price in the cart.
      // "Rp100K / 150K" style values carry an implied K suffix per part.
      const parts = priceEl.textContent.split(/[–/]/);
      const hasK = /K\b/i.test(priceEl.textContent);
      const nums = parts
        .map(p => {
          const clean = p.replace(/[^\d]/g, "");
          if (!clean) return null;
          let n = parseInt(clean, 10);
          if (hasK) n *= 1000;
          return n;
        })
        .filter(n => n != null);
      if (nums.length >= 2) { btn.dataset.cartMin = String(nums[0]); btn.dataset.cartMax = String(nums[1]); }
    } else if (/^Rp\d/.test(priceEl.textContent.trim())) {
      btn.dataset.cartPrice = priceEl.textContent.trim();
    } else {
      btn.removeAttribute("data-cart-price");
    }
    if (needsVariant) {
      const variantRow = document.createElement("div");
      variantRow.className = "cart-variant-row";
      const select = document.createElement("select");
      select.className = "cart-variant-select";
      select.setAttribute("aria-label", t("cart_var_choose"));
      select.innerHTML = `<option value="">${escapeHtml(t("cart_var_choose"))}</option>
        <option value="${escapeHtml(t("cart_var_natural"))}">${escapeHtml(t("cart_var_natural"))}</option>
        <option value="${escapeHtml(t("cart_var_extension"))}">${escapeHtml(t("cart_var_extension"))}</option>`;
      select.addEventListener("change", () => {
        btn.dataset.cartVariant = select.value || "";
      });
      variantRow.appendChild(select);
      variantRow.appendChild(btn);
      btn.addEventListener("click", e => {
        if (!select.value) { e.stopImmediatePropagation(); e.preventDefault(); showToast(t("cart_choose_variant")); }
      }, true);
      rowEl.appendChild(variantRow);
    } else {
      rowEl.appendChild(btn);
    }
  });
  applyCartButtonLanguage();
})();

function applyCartButtonLanguage() {
  document.querySelectorAll("[data-cart-add]").forEach(btn => { btn.textContent = t("add_to_cart"); });
  document.querySelectorAll(".cart-variant-select").forEach(sel => {
    const current = sel.value;
    sel.innerHTML = `<option value="">${escapeHtml(t("cart_var_choose"))}</option>
      <option value="${escapeHtml(t("cart_var_natural"))}">${escapeHtml(t("cart_var_natural"))}</option>
      <option value="${escapeHtml(t("cart_var_extension"))}">${escapeHtml(t("cart_var_extension"))}</option>`;
    sel.value = current;
  });
  document.querySelectorAll("#cartDrawer h2").forEach(el => { el.textContent = t("cart_title"); });
  const checkout = document.querySelector("#cartCheckout");
  if (checkout) checkout.textContent = t("cart_checkout");
  const clear = document.querySelector("#cartClear");
  if (clear) clear.textContent = t("cart_clear");
  const floatBtn = document.querySelector("#cartFloat");
  if (floatBtn) floatBtn.setAttribute("aria-label", t("cart_view"));
}

// Hook into the language switcher.
if (typeof applyLanguage === "function") {
  document.querySelectorAll(".lang-btn").forEach(button => {
    button.addEventListener("click", () => { setTimeout(applyCartButtonLanguage, 50); });
  });
}
