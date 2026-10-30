# Panduan Media By.Niadania — Kelola Foto & Video dari Google Sheets

Panduan ini menjelaskan cara mengganti foto hero, foto layanan, dan video studio
tanpa menyentuh kode website. Semua data diambil dari tab **Media** di spreadsheet
By.Niadania melalui Google Apps Script (`?action=media`).

---

## 1. Struktur tab Media

Buka spreadsheet By.Niadania → tab **Media**. Header yang didukung (dua-duanya valid):

**Skema lama (masih berfungsi):**

```
media_id | section | judul | tipe_media | media_url | thumbnail_url | deskripsi | status | urutan
```

**Skema baru (disarankan bila mulai dari nol):**

```
id | section | judul | tipe_media | media_url | alt_text | aktif | urutan
```

Aturan filter di sisi Apps Script (`getMedia_` di Code.gs):
- Jika ada kolom `status` → hanya baris `status = PUBLISHED` yang tampil.
- Jika ada kolom `aktif` → baris aktif bila nilainya `TRUE` / `ya` / `1` / `yes`.
- Baris tanpa URL yang valid (`http://` atau `https://`) selalu diabaikan.
- Urutan tampil mengikuti kolom `urutan` (angka kecil = lebih dulu).

## 2. Nilai `section` yang dikenali website

| section | Dipakai untuk |
|---|---|
| `hero` | Slide carousel utama di halaman depan |
| `service_nail` | Foto kartu layanan Nail Art |
| `service_eyelash` | Foto kartu layanan Eyelash |
| `service_makeup` | Foto kartu layanan Makeup |
| `service_brow` | Foto kartu layanan Brow |
| `studio` | Video studio (ambil baris bertipe `video` pertama yang aktif) |

Tab **Portfolio** tetap menjadi sumber karya individual di galeri — jangan
memindahkan karya ke tab Media.

## 3. Cara menambahkan foto baru

1. Buka tab **Media**, klik baris kosong di bawah data terakhir.
2. Isi: `id` (bebas, mis. `hero-3`), `section` (`hero`, `service_nail`, dst.),
   `judul` (nama yang muncul sebagai teks alternatif bila `alt_text` kosong),
   `tipe_media` (`foto` atau `video`), `media_url`, `status` = `PUBLISHED`
   (atau `aktif` = `TRUE`), dan `urutan` (angka).
3. Simpan. Website akan menampilkan foto pada refresh berikutnya (cache 5 menit).

## 4. Cara mengganti URL foto

Cukup ubah isi kolom `media_url` pada baris yang ingin diganti. Jangan mengosongkan
kolom lain. Untuk memaksa website langsung memuat ulang (tanpa menunggu cache),
jalankan di konsol browser (F12 → Console):

```js
await window.refreshMedia();
```

## 5. Cara mengganti video studio

1. Pastikan ada satu baris `section = studio`, `tipe_media = video`.
2. Isi `media_url` dengan URL video yang bisa diputar browser (lihat §7).
3. Opsional isi `thumbnail_url` sebagai poster sebelum video diputar.
4. Website otomatis menampilkan fallback elegan bila video gagal dimuat.

## 6. Cara mengaktifkan / menonaktifkan media

- Skema lama: ubah `status` menjadi `PUBLISHED` (aktif) atau selain itu (nonaktif).
- Skema baru: ubah `aktif` menjadi `TRUE` (aktif) atau `FALSE` (nonaktif).

Baris nonaktif tidak pernah dikirim ke website — aman dipakai sebagai "draft".

## 7. Format URL yang didukung

**Gambar (foto):**
- URL langsung yang berakhir `.jpg`, `.jpeg`, `.png`, `.webp`.
- Google Drive: bagikan file sebagai "Anyone with the link", lalu gunakan format:
  `https://drive.google.com/uc?export=view&id=FILE_ID`
  Website otomatis mengonversi link `.../file/d/FILE_ID/view` menjadi format di atas
  asalkan ID file bisa dibaca. Jika file tidak publik, gambar akan gagal dimuat —
  inilah sebabnya izin "Anyone with the link" wajib.

**Video:**
- Format yang bisa diputar browser: `.mp4` (H.264) atau `.webm`.
- Google Drive: gunakan `https://drive.google.com/uc?export=download&id=FILE_ID`
  untuk file mp4 publik.
- URL halaman Instagram **tidak** bisa dipakai sebagai sumber video langsung.

**Selalu:** URL harus bisa diakses tanpa login. Uji dengan membuka URL di tab
penyamaran (Incognito) — kalau di sana gagal, website juga gagal menampilkannya.

## 8. Cara mengetes endpoint Media

Tempel di browser (ganti URL jika deployment berubah):

```
https://script.google.com/macros/s/AKfycbwhpr1RzCefxiHnizBd8h5ON-Zz8_ggRCUl_WNZtOXnRgifGZ9tSan3AZEh4sP3PDk/exec?action=media
```

Respons yang benar:

```json
{ "success": true, "count": 2, "data": [ { "section": "hero", "media_url": "https://...", ... } ] }
```

Jika `count: 0`, cek: kolom `status`/`aktif`, kolom `media_url` harus diawali `http`.

## 9. Memastikan perubahan spreadsheet tampil di website

1. Ubah data di tab Media → tunggu ±5 menit (cache sessionStorage) atau pakai
   `await window.refreshMedia();` di konsol → refresh halaman.
2. Jika masih lama, kemungkinan cache browser: tekan **Ctrl + Shift + R**.

## 10. Mengembalikan media ke kondisi sebelumnya

1. Google Sheets menyimpan riwayat versi: **File → Version history → See version
   history** → pilih versi sebelum perubahan → **Restore this version**.
2. Atau, jika hanya satu baris yang salah: kembalikan isi `media_url` lama
   (salin dulu nilai sebelumnya ke kolom `deskripsi` sebagai catatan).
3. Jalankan `await window.refreshMedia();` lalu refresh halaman.

---

## Ringkasan kolom

| Kolom (baru) | Kolom (lama) | Wajib? | Keterangan |
|---|---|---|---|
| `id` | `media_id` | tidak* | identitas baris |
| `section` | `section` | **ya** | lihat §2 |
| `judul` | `judul` | disarankan | judul/alt cadangan |
| `tipe_media` | `tipe_media` | **ya** | `foto` / `video` |
| `media_url` | **ya** | harus diawali `http` |
| `alt_text` | `thumbnail_url` | opsional | alt text gambar |
| `aktif` | `status` | **ya** | `TRUE` atau `PUBLISHED` |
| `urutan` | `urutan` | disarankan | angka urutan tampil |

\* Apps Script saat ini menerima kedua skema; baris tanpa URL valid otomatis dilewati.
