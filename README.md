# 📖 Quran Application

> A performant, feature-rich Quran reading experience built for everyone — from beginners to advanced readers.

---

## ✨ Key Features

### 🧭 Navigation & Reading Modes
Multiple flexible navigation modes supported:
- **Surah** — Browse by chapter
- **Juz** — Navigate by part (1–30)
- **Page** — Traditional Mushaf page layout
- **Ruku** — Section-based navigation
- **Manzil** — Weekly division navigation
- **Sajda** — Jump to prostration verses

---

### 🎨 Personalization
Real-time customization with persistent preferences:
- Adjustable **Arabic font size**
- Adjustable **Translation font size**
- Selectable **Font family**
- All preferences automatically saved via **local storage** — your settings survive page reloads

---

### 📚 Reading Support
Catering to all levels of readers:
- **Word-by-Word** mode — ideal for beginners learning Arabic
- **Full Translation** mode — for comprehension and study

---

### ⚡ Performance & Optimization

| Technique | Benefit |
|-----------|---------|
| TanStack Infinite Scrolling | Minimizes unnecessary data fetching, reduces bandwidth |
| TanStack Virtualization | Keeps DOM lightweight, prevents performance degradation |
| Static first 10 Ayahs per Surah | Served via CDN for rapid initial page load |

The first 10 ayahs of each Surah are pre-rendered as **static content**, enabling CDN delivery and significantly improving Time-to-First-Byte (TTFB).

---

### 🗄️ Database Architecture

A **dual-database approach** for optimal performance and flexibility:

```
Client Request
     │
     ├──▶ Server-Side DB (O(1) lookup)
     │         └── Direct data retrieval, low latency
     │
     └──▶ MongoDB
               └── Complex filtering & search queries
```

- **Server-side DB** — handles direct client-to-server data lookup, reducing internet latency
- **MongoDB** — supports advanced filtering and search, ensuring speed and flexibility

---

### 🔄 Core Data Flow

```
1. Client sends request via URL parameters
         ↓
2. CDN serves first 10 ayahs instantly (no delay)
         ↓
3. User scrolls → subsequent ayahs fetched via O(1) server lookup
         ↓
4. Search queries → routed to MongoDB for advanced filtering
```

---

## 🚧 Current Status

This is an **MVP (Minimum Viable Product)** — a solid, functional foundation.

Several areas are identified for improvement and will be systematically addressed in subsequent iterations to elevate the product to the next level.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Data Fetching | TanStack Query (Infinite Scroll + Virtualization) |
| Primary Database | Server-side DB (O(1) lookup) |
| Search Database | MongoDB |
| Content Delivery | CDN (static ayahs) |
| Persistence | Local Storage |

---

*Built with care for the Quran. May it be of benefit.* 🤲