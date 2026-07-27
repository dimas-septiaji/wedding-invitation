# 💍 Undangan Pernikahan Digital — Tema Kejawen

Website undangan pernikahan digital single-page bertema Jawa klasik (Kejawen) yang elegan, modern, dan mobile-first.

## 🎯 Fitur

- **Cover Interaktif** — Nama tamu dari parameter URL (`?to=NamaTamu`), tombol "Buka Undangan"
- **Countdown Real-time** — Hitung mundur ke hari-H, update tiap detik
- **Profil Mempelai** — Foto, nama, dan info orang tua
- **Detail Acara** — Akad & Resepsi + embed Google Maps + link navigasi
- **Galeri Foto** — Grid foto prewedding + lightbox dengan navigasi keyboard
- **RSVP** — Form konfirmasi kehadiran + simpan ke Google Sheets (fallback localStorage)
- **Ucapan & Doa** — Form kirim ucapan + tampilan list ucapan
- **Amplop Digital** — Info rekening + tombol "Salin" (copy to clipboard)
- **Musik Latar** — Autoplay setelah buka undangan + toggle mute mengambang
- **Scroll Animation** — Fade-up halus pada semua section
- **Responsive** — Mobile-first, optimal di 375–430px

## 📁 Struktur File

```
wedding-invitation/
├── index.html          # Halaman utama
├── style.css           # Semua styling
├── script.js           # Semua interaktivitas
├── README.md           # Dokumentasi ini
└── assets/
    ├── groom.jpg       # Foto pengantin pria
    ├── bride.jpg       # Foto pengantin wanita
    ├── gallery-1.jpg   # Foto prewedding 1 (featured/besar)
    ├── gallery-2.jpg   # Foto prewedding 2
    ├── gallery-3.jpg   # Foto prewedding 3
    ├── gallery-4.jpg   # Foto prewedding 4
    ├── gallery-5.jpg   # Foto prewedding 5
    ├── gallery-6.jpg   # Foto prewedding 6
    └── music.mp3       # Musik latar (gamelan/instrumental)
```

## 🚀 Cara Deploy

1. Upload semua file ke hosting static (Netlify, Vercel, GitHub Pages, dsb.)
2. Atau buka langsung `index.html` di browser untuk preview lokal

## ✏️ Cara Ganti Data

### 1. Data Mempelai & Tanggal

Edit bagian `CONFIG` di awal file **`script.js`**:

```javascript
const CONFIG = {
  groomNickname: 'NamaPanggilanPria',
  brideNickname: 'NamaPanggilanWanita',
  groomFullName: 'Nama Lengkap Pria, S.T.',
  brideFullName: 'Nama Lengkap Wanita, S.Pd.',
  groomParents: 'Putra dari Bapak ... & Ibu ...',
  brideParents: 'Putri dari Bapak ... & Ibu ...',

  // PERHATIAN: Bulan dimulai dari 0 (Januari=0, Desember=11)
  weddingDate: new Date(2025, 11, 28, 8, 0, 0),
  // ...
};
```

### 2. Detail Acara & Lokasi

Edit `CONFIG.akad` dan `CONFIG.resepsi` di **`script.js`**, lalu update juga teks di **`index.html`** pada section `#acara`.

Untuk embed Google Maps:
1. Buka Google Maps → cari lokasi → Share → Embed a map → Copy src URL
2. Ganti URL di atribut `src` pada `<iframe>` di `index.html`
3. Ganti link `href` pada tombol "Buka di Google Maps"

### 3. Foto

Ganti file di folder `assets/`:
- `groom.jpg` — Foto pengantin pria (rasio 1:1, min 400×400px)
- `bride.jpg` — Foto pengantin wanita (rasio 1:1, min 400×400px)
- `gallery-1.jpg` s/d `gallery-6.jpg` — Foto prewedding (rasio 1:1)
- `music.mp3` — Musik latar (cari gamelan instrumental bebas royalti)

> **Tips**: Kompres foto menggunakan [tinypng.com](https://tinypng.com) atau [squoosh.app](https://squoosh.app) agar loading cepat. Target < 200KB per foto.

### 4. Rekening

Edit `CONFIG.accounts` di **`script.js`** dan update juga di **`index.html`** section `#amplop`.

### 5. Quote/Doa

Edit teks langsung di **`index.html`** pada section `#hero` (pembuka) dan `#penutup` (penutup).

### 6. Nama di Cover & Title

Edit di **`index.html`**:
- Tag `<title>` di `<head>`
- Tag `<meta>` og:title dan og:description
- Nama di `.cover-couple-names`
- Tanggal di `.cover-date`

## 📊 Setup Google Sheets (RSVP & Ucapan)

### Langkah 1: Buat Google Sheet

1. Buka [Google Sheets](https://sheets.google.com) → Buat spreadsheet baru
2. **Sheet 1** (rename jadi `RSVP`): Buat header di baris 1:
   | A | B | C | D | E |
   |---|---|---|---|---|
   | Nama | Kehadiran | Jumlah Tamu | Pesan | Timestamp |

3. **Sheet 2** (rename jadi `Ucapan`): Buat header di baris 1:
   | A | B | C |
   |---|---|---|
   | Nama | Ucapan | Timestamp |

### Langkah 2: Buat Apps Script

1. Di Google Sheet, klik **Extensions → Apps Script**
2. Hapus kode default, paste kode berikut:

```javascript
function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const data = JSON.parse(e.postData.contents);

  if (data.type === 'wish') {
    // Ucapan
    const sheet = ss.getSheetByName('Ucapan');
    sheet.appendRow([data.name, data.message, data.timestamp]);
  } else {
    // RSVP
    const sheet = ss.getSheetByName('RSVP');
    sheet.appendRow([data.name, data.attendance, data.guests, data.message, data.timestamp]);
  }

  return ContentService.createTextOutput(
    JSON.stringify({ status: 'success' })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

3. Klik **Deploy → New deployment**
4. Pilih type: **Web app**
5. Execute as: **Me**
6. Who has access: **Anyone**
7. Klik **Deploy** → Copy URL yang muncul

### Langkah 3: Pasang URL

Di **`script.js`**, ganti:
```javascript
googleScriptURL: 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE',
```
dengan URL dari langkah sebelumnya.

## 🔗 Cara Share via WhatsApp

Format link undangan:
```
https://domainanda.com/?to=Nama+Tamu
```

Contoh pesan WhatsApp:
```
Assalamu'alaikum Wr. Wb.

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:

🔗 https://domainanda.com/?to=Budi+Santoso

Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir. Terima kasih 🙏
```

## 🎨 Kustomisasi Warna

Edit CSS custom properties di awal file **`style.css`**:

```css
:root {
  --color-dark-green: #2D4A3E;    /* Warna utama gelap */
  --color-green-light: #3D6B5A;   /* Hijau terang */
  --color-maroon: #7B2D26;        /* Merah bata/marun */
  --color-gold: #C9A84C;          /* Emas/gold */
  --color-cream: #F5F0E8;         /* Krem */
  --color-ivory: #FBF8F3;         /* Background utama */
}
```

## 📋 Teknologi

- HTML5 + CSS3 + Vanilla JavaScript (tanpa framework)
- Google Fonts: Playfair Display, Poppins, Great Vibes
- Intersection Observer API (scroll animation)
- Clipboard API (copy rekening)
- Google Apps Script (backend RSVP)

## 📄 Lisensi

Bebas digunakan dan dimodifikasi untuk keperluan pribadi.
