# 🎬 CineRate — Kino Baholash Platformasi

Foydalanuvchilar kino, serial, anime va dramalarni 9 ta mezon bo'yicha baholaydigan platforma.

## 🚀 Ishga tushirish

### Talablar
- Node.js 18+
- PostgreSQL 14+

---

## 1. PostgreSQL bazasini yarating

```sql
CREATE DATABASE cinerate;
```

---

## 2. Server (Backend)

```bash
cd server
npm install

# .env faylini yarating
cp .env.example .env
# .env faylini oching va DATABASE_URL, JWT_SECRET ni o'zgartiring

# Prisma migratsiyasini ishga tushiring
npx prisma migrate dev --name init
npx prisma generate

# Serverni ishga tushiring
npm run dev
```

Server `http://localhost:5000` da ishga tushadi.

---

## 3. Client (Frontend)

```bash
cd client
npm install
npm run dev
```

Frontend `http://localhost:5173` da ishga tushadi.

---

## 📁 Loyiha Strukturasi

```
cine-rate/
├── client/                 # React + Vite (Frontend)
│   └── src/
│       ├── pages/          # Sahifalar
│       ├── components/     # Komponentlar
│       ├── context/        # AuthContext
│       └── api/            # Axios
└── server/                 # Node.js + Express (Backend)
    ├── src/
    │   ├── controllers/    # Biznes mantiq
    │   ├── routes/         # API yo'llari
    │   └── middleware/     # Auth, Upload
    └── prisma/             # DB Schema
```

---

## 🗂️ API Endpointlar

### Auth
| Method | URL | Tavsif |
|--------|-----|--------|
| POST | /api/auth/register | Ro'yxatdan o'tish |
| POST | /api/auth/login | Kirish |
| GET | /api/auth/me | Mening profilim |

### Kinolar
| Method | URL | Tavsif |
|--------|-----|--------|
| GET | /api/movies | Barcha kinolar (filter, qidiruv) |
| GET | /api/movies/:id | Bitta kino |
| POST | /api/movies | Kino qo'shish |
| PUT | /api/movies/:id | Kinoni yangilash |

### Baholash
| Method | URL | Tavsif |
|--------|-----|--------|
| POST | /api/ratings/movie/:id | Baholash |
| GET | /api/ratings/movie/:id | Baholar ro'yxati |
| GET | /api/ratings/movie/:id/mine | Mening bahom |
| DELETE | /api/ratings/movie/:id | Bahoni o'chirish |

### Izohlar
| Method | URL | Tavsif |
|--------|-----|--------|
| GET | /api/comments/movie/:id | Izohlar |
| POST | /api/comments | Izoh qo'shish |
| DELETE | /api/comments/:id | Izohni o'chirish |
| POST | /api/comments/:id/like | Like |

### Postlar
| Method | URL | Tavsif |
|--------|-----|--------|
| GET | /api/posts | Barcha postlar |
| GET | /api/posts/:id | Bitta post |
| POST | /api/posts | Post yaratish |
| DELETE | /api/posts/:id | Postni o'chirish |
| POST | /api/posts/:id/like | Like |

---

## 🎯 Baholash tizimi

9 ta mezon (1-9 shkala):
- 📖 Syujet (Storyline)
- ✍️ Skript (Script)
- 🎭 Aktyorlik (Acting)
- 🎬 Rejissura (Direction)
- 🎵 Musiqa (Soundtrack)
- 🖼️ Vizual (Visuals/Cinematography)
- ⏱️ Temp (Pacing)
- 👥 Personajlar (Characters)
- ✨ Originallik (Originality)

**Umumiy baho** = 1-9 shkala → 1-10 shkala formulasi bilan o'tkaziladi.

---

## 🔮 Keyingi bosqichlar

- [ ] Video player integratsiyasi
- [ ] Admin panel
- [ ] Email tasdiqlash
- [ ] Kino tavsiyalari
- [ ] Mobil interfeys yaxshilash
