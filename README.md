# Todo List SQLite - Ionic Angular

Aplikasi CRUD (Create, Read, Update, Delete) untuk mengelola daftar todo menggunakan Ionic Framework dengan Angular dan Fast SQL (SQLite) sebagai database lokal.

## Fitur

- ✅ Tambah todo baru
- ✅ Lihat daftar todo
- ✅ Edit todo
- ✅ Hapus todo
- ✅ Toggle status selesai/belum selesai
- ✅ Database SQLite lokal (offline-first)
- ✅ Performa tinggi dengan Fast SQL plugin

## Teknologi

- **Ionic Framework 8** - Framework untuk membangun aplikasi mobile hybrid
- **Angular 20** - Framework JavaScript
- **Fast SQL** - High-performance SQLite plugin untuk Capacitor
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Bahasa pemrograman
- **Capacitor** - Native runtime untuk aplikasi mobile

## Setup Database

Database SQLite akan otomatis dibuat saat aplikasi pertama kali dijalankan. Tidak ada konfigurasi tambahan yang diperlukan.

### Struktur Database

Tabel `todos` dengan kolom:
- `id` - INTEGER PRIMARY KEY AUTOINCREMENT
- `title` - TEXT NOT NULL
- `description` - TEXT NOT NULL
- `completed` - INTEGER DEFAULT 0 (0 = false, 1 = true)
- `createdAt` - INTEGER (Unix timestamp)
- `updatedAt` - INTEGER (Unix timestamp)
2. Ganti konfigurasi Firebase dengan konfigurasi dari Firebase Console:

\`\`\`typescript
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
  }
## Instalasi & Menjalankan Aplikasi

### Install Dependencies

```bash
npm install
```

### Jalankan di Browser

```bash
npm start
# atau
ionic serve
```

Aplikasi akan berjalan di `http://localhost:8100`

### Build untuk Production

```bash
npm run build
```

### Build untuk Mobile

#### Android

```bash
ionic capacitor add android
ionic capacitor sync
ionic capacitor run android
```

#### iOS (Memerlukan macOS)

```bash
ionic capacitor add ios
ionic capacitor sync
ionic capacitor run ios
```

## Struktur Folder

```
src/
├── app/
│   ├── models/
│   │   └── todo.model.ts          # Interface untuk Todo
│   ├── pages/
│   │   ├── todo-list/             # Halaman daftar todo
│   │   └── todo-form/             # Halaman form tambah/edit todo
│   ├── services/
│   │   └── todo.service.ts        # Service untuk operasi CRUD SQLite
│   ├── app.component.ts
│   └── app.routes.ts              # Routing konfigurasi
├── environments/
│   ├── environment.ts             # Konfigurasi development
│   └── environment.prod.ts        # Konfigurasi production
└── main.ts                        # Bootstrap aplikasi
```

## Cara Menggunakan

### Menambah Todo

1. Klik tombol **+** (FAB) di kanan bawah
2. Isi judul dan deskripsi todo
3. Klik **Simpan**

### Mengedit Todo

1. Klik icon **pensil** pada todo yang ingin diedit
2. Ubah judul atau deskripsi
3. Klik **Update**

### Menghapus Todo

1. Klik icon **trash** pada todo yang ingin dihapus
2. Konfirmasi penghapusan

### Toggle Status Completed

1. Klik checkbox di sebelah kiri todo
2. Status akan otomatis berubah dan tersimpan ke database

## Troubleshooting

### Database tidak terbuat

Pastikan Fast SQL plugin sudah terinstall dengan benar dan Capacitor sudah di-sync:
```bash
npm install @capgo/capacitor-fast-sql
npx cap sync
```

### Error saat build mobile

Pastikan sudah menambahkan platform yang diinginkan:
```bash
ionic capacitor add android  # untuk Android
ionic capacitor add ios      # untuk iOS
```

### Dependencies warning

Warning mengenai engine version bisa diabaikan untuk development. Aplikasi akan tetap berjalan dengan baik.

## Keunggulan Fast SQL

- **Performa Tinggi**: Hingga 25x lebih cepat dibanding SQLite plugin tradisional
- **Offline-First**: Data tersimpan lokal, aplikasi tetap berfungsi tanpa internet
- **Reliable**: Lebih andal dibanding IndexedDB untuk aplikasi mobile
- **Binary Data**: Support untuk menyimpan data binary tanpa base64 encoding

## Lisensi

MIT

## Kontributor

Dibuat dengan ❤️ menggunakan Ionic Framework dan Fast SQL
