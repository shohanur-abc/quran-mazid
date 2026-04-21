# Quran Mazid (Beta)

A modern Quran reading experience focused on speed, clarity, and flexible navigation.

## Live Application

https://quran-mazid-beta.vercel.app

## Overview

Quran Mazid is a Next.js application that combines fast static delivery with dynamic data loading. It is designed to provide smooth reading on both desktop and mobile, while supporting multiple ways to browse and search ayahs.

## Core Features

- Multiple navigation modes: Surah, Juz, Page, Ruku, Manzil, and Sajda.
- Reading modes for both full translation and word-by-word learning.
- User personalization with persisted preferences (font family, Arabic size, translation size).
- Fast infinite scrolling and virtualization for large ayah lists.
- MongoDB-backed search for flexible text queries.

## Performance Approach

- First 10 ayahs per Surah are pre-rendered and CDN-friendly for fast initial load.
- Remaining ayahs are fetched incrementally through server actions.
- Virtualized rendering keeps the DOM lightweight for long reading sessions.

## Architecture

- Primary content source: local server-side JSON datasets for deterministic, low-latency lookup.
- Search source: MongoDB collections optimized for text search workflows.
- UI data layer: TanStack Query (infinite loading) + TanStack Virtual (windowed rendering).

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Bun runtime and package manager
- MongoDB + Mongoose
- Tailwind CSS + shadcn/ui primitives

## Getting Started (Bun)

### Prerequisites

- Bun installed
- MongoDB connection available in `.env.local`

### Install

```bash
bun install
```

### Development

```bash
bun run dev
```

### Type Check

```bash
bun run typecheck
```

### Production Build

```bash
bun run build
bun run start
```

## Project Status

This project is currently in beta (MVP) and actively evolving. The current release focuses on reliable reading flow, navigation flexibility, and search performance.

---

Built with care to support Quran study and daily recitation.