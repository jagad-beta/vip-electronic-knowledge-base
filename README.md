# VIP Electronic Knowladge Base

Website pusat pengetahuan dengan gaya dashboard seperti aplikasi kerja yang dapat dipakai sebagai **Lark Custom Web App**. Dibuat dengan HTML, CSS, dan JavaScript murni, tanpa ketergantungan CDN, framework, atau proses build.

> **Penting:** Nama *Knowladge* mengikuti nama yang diminta. Ejaan bahasa Inggris bakunya adalah *Knowledge*. Anda dapat mengubah seluruh teks nama di `index.html` bila diperlukan.

## Apa yang bisa digunakan?

| Fitur | Status | Penyimpanan |
| --- | --- | --- |
| Dashboard: total artikel, kategori, favorit | Berfungsi | Berdasarkan koleksi saat ini |
| Pencarian judul, ringkasan, isi, kategori, tag | Berfungsi | Diproses di browser |
| Filter kategori & urutan tanggal/judul | Berfungsi | Diproses di browser |
| Tambah, lihat, sunting, hapus artikel | Berfungsi | `localStorage` perangkat |
| Favorit | Berfungsi | `localStorage` perangkat |
| Riwayat aktivitas | Berfungsi | `localStorage` perangkat; maksimal 80 catatan |
| Impor, ekspor, template dan pemulihan JSON | Berfungsi | File diunduh/dibaca di browser |
| Akses artikel dengan parameter URL `?article=id` | Berfungsi | Artikel harus tersedia di browser penerima |
| Desain responsif, sidebar seluler | Berfungsi | Browser desktop/seluler |
| Dipasang sebagai Lark Web App | Siap dikonfigurasi | Membutuhkan pengaturan di konsol Lark |
| Login SSO Lark, akses per karyawan, data realtime bersama | **Belum disediakan** | Membutuhkan backend privat |

**Catatan:** Semua isi `data/articles.json` adalah contoh dan harus diganti sebelum aplikasi dipakai resmi.

## Mulai cepat di komputer

Ekstrak ZIP, lalu buka `index.html` untuk mencoba fitur aplikasi. Jika browser memblokir pembacaan JSON pada mode file lokal, aplikasi memakai enam artikel fallback agar semua fungsi antarmuka tetap bisa dicoba. Untuk memuat sepuluh contoh artikel dari `data/articles.json`, jalankan server lokal:

```bash
python -m http.server 8000
```

Lalu buka `http://localhost:8000`. Perintah harus dijalankan dari folder yang berisi `index.html`.

## Pasang ke GitHub Pages

1. Login ke https://github.com/ dan buat repositori **publik** baru, misalnya `vip-electronic-knowledge-base`.
2. Unggah **isi folder ini** (bukan hanya file ZIP) ke cabang `main`, termasuk `.nojekyll`, `index.html`, `app.js`, `styles.css`, `data/`, dan `assets/`. Pastikan `index.html` berada di root.
3. Buka **Settings → Pages**, pada `Build and deployment` pilih `Deploy from a branch`.
4. Pilih branch `main` dan folder `/(root)`, lalu **Save**.
5. Setelah situs terbit, buka alamat HTTPS Pages yang ditampilkan GitHub. Contoh untuk akun `jagad-beta` dan nama repositori di atas: `https://jagad-beta.github.io/vip-electronic-knowledge-base/`. URL ini contoh sampai Anda benar-benar membuat dan menerbitkan repositori.

GitHub Pages bukan sistem database; saat seseorang mengedit lewat website, perubahan **tidak otomatis tersimpan pada GitHub**.

### Bagaimana memperbarui artikel yang dibaca semua orang?

1. Sunting atau tambah artikel melalui editor.
2. Buka **Pengaturan Data → Unduh JSON**; file bernama `articles.json`.
3. Dalam repositori GitHub, ganti `data/articles.json` dengan hasil ekspor tadi, lalu commit.
4. Setelah versi baru terbit, pengguna yang mempunyai perubahan lokal lama perlu memilih **Pengaturan Data → Pulihkan Data Bawaan**.

Perubahan dari beberapa browser tidak digabung otomatis. Jika ada banyak editor, tetapkan seorang pengelola publikasi atau buat backend/database dengan autentikasi dan alur persetujuan.

## Integrasi ke Lark

Baca [Panduan lengkap](docs/PANDUAN_LARK.md). Ringkasnya:

1. Buka https://open.larksuite.com/ dan buat **Custom App**.
2. Tambahkan fitur **Web app**.
3. Pasang URL HTTPS dari GitHub Pages sebagai halaman utama desktop dan mobile.
4. Terbitkan aplikasi, atur ketersediaannya, dan selesaikan persetujuan yang diwajibkan admin Lark.

**Sangat penting:** Berada di dalam Lark tidak berarti ada login Lark atau pembatasan konten GitHub Pages.

## Struktur berkas

```text
index.html              antarmuka seluruh halaman, dialog dan CSP dasar
styles.css              gaya responsif desktop dan seluler
app.js                  navigasi, CRUD, pencarian, favorite, impor/ekspor
assets/favicon.svg      ikon aplikasi
data/articles.json       koleksi awal (contoh)
docs/PANDUAN_LARK.md     petunjuk deploy GitHub dan integrasi Lark
docs/KEAMANAN.md         audit ringan dan batasan keamanan
docs/AUTENTIKASI.md      alur arsitektur SSO untuk pengembangan backend
README.md               petunjuk utama
tests/test_e2e.py        skrip tes browser interaksi
.nojekyll               agar Pages mengunggah file tanpa Jekyll
```

## Validasi dan uji

- `node --check app.js` untuk pemeriksaan sintaks.
- `python -m json.tool data/articles.json` untuk pemeriksaan data JSON.
- `python tests/test_e2e.py` untuk uji antarmuka; memerlukan Python Playwright dan Chromium lokal.

Tes menguji navigasi, CRUD, pencarian, kategori, favorit, penyimpanan lokal, berkas JSON, pemulihan, riwayat, dan input XSS sederhana. Pengujian ini adalah **smoke test**, bukan audit penetrasi, uji multi-pengguna, uji SSO, atau jaminan tidak ada bug. Lingkungan tes menggunakan penyuntikan DOM karena navigasi localhost pada browser pengujian dibatasi. Lakukan uji ulang di URL produksi dan di klien Lark sebelum digunakan secara resmi.

## Keamanan data

Website ini tidak mempunyai fitur autentikasi. Tidak ada username/password atau `app_secret` di frontend. Data awal yang dimuat GitHub Pages **publik** dan dapat diakses tanpa Lark. `localStorage` tidak boleh dianggap sebagai sistem penyimpanan aman untuk data sensitif. Lihat `docs/KEAMANAN.md`.

## Referensi resmi

- GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- Lark Web App: https://open.larksuite.com/document/client-docs/h5/development-guide/step1
- Lark application authentication: https://open.larksuite.com/document/server-docs/getting-started/authen-v1/build-login-free-system-
