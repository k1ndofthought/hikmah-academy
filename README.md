# Hikmah Academy - Full-Stack Comparative Theology & Article platform

Hikmah Academy is a professional, high-performance, full-stack application designed for researching comparative theology, scholarly articles, and sacred scriptures. 

This project is engineered as a cross-platform solution, utilizing a **React + TypeScript + Tailwind CSS** frontend packaged for iOS and Android using **Capacitor**, backed by a powerful **FastAPI + PostgreSQL** backend. It is designed to demonstrate industry-best practices in modular software architecture, database integration, state management, and mobile-responsive design.

---

## 🌟 Key Features

### 1. Interactive Comparative Dashboard
- **Scripture Alignment**: Dynamic side-by-side comparative views of Biblical and Quranic verses.
- **Micro-Animations**: Elegant transitions powered by `Framer Motion` for a premium, non-distracting visual user experience.
- **Multilingual Support**: Real-time localization toggles (English & Amharic translations).

### 2. Scholarly Articles & Research Portal
- **Advanced Filtering & Search**: Categorized article searching with Tag systems, Perspectives, and Author-specific archives.
- **Dynamic Articles Engine**: Custom layout parser that renders layered structured articles (multi-part chapters, scholarly quotes, reading progress tracking).
- **Offline Resilience**: Automatic caching fallback of articles and study notes.

### 3. Native Mobile Capabilities (iOS & Android)
- **Capacitor Integration**: Hardened configuration (`capacitor.config.json`) ready for compiling into native mobile binaries using Xcode and Android Studio.
- **Touch Targets**: Accessible, touch-first mobile controls complying with iOS Human Interface Guidelines and Android Material Design.

### 4. Live PostgreSQL & FastAPI Sync
- **FastAPI Backend Services**: Modern Python API using Pydantic schemas for data validation, asynchronous endpoints, and relational integrity.
- **PostgreSQL JSON storage**: Clean mapping of complex nested JSON data (like multi-part article content) inside PostgreSQL JSONB blocks using SQLAlchemy ORM.
- **Connection Diagnostics**: Built-in network utility to test API availability, preset emulator/localhost configurations, and manually trigger remote database synchronization.

---

## 🛠️ Architecture & Tech Stack

```
                     ┌──────────────────────────────┐
                     │      Capacitor Wrapper       │
                     │  (Android Studio / Xcode)    │
                     └──────────────┬───────────────┘
                                    │ Runs inside WebView
┌───────────────────────────────────▼───────────────────────────────────┐
│                           REACT FRONTEND                              │
│  - TypeScript & React 18+                      - Tailwind CSS         │
│  - Framer Motion (Micro-animations)            - Lucide Icons         │
│  - Local Cache (Notes / Offlines)                                      │
└───────────────────────────────────┬───────────────────────────────────┘
                                    │
                                    │ HTTP / JSON API REST Requests
                                    ▼
┌───────────────────────────────────────────────────────────────────────┐
│                          FASTAPI BACKEND                              │
│  - Python 3.10+                               - FastAPI Framework     │
│  - SQLAlchemy ORM                             - Pydantic Validations  │
└───────────────────────────────────┬───────────────────────────────────┘
                                    │
                                    │ PostgreSQL Connection Protocol
                                    ▼
┌───────────────────────────────────────────────────────────────────────┐
│                        POSTGRESQL DATABASE                            │
│  - Relational Integrity                       - Dynamic JSON storage   │
└───────────────────────────────────────────────────────────────────────┘
```

### Frontend Stack:
- **Framework**: React 18+ (Vite Bundler)
- **Language**: TypeScript (Strict Typings)
- **Styling**: Tailwind CSS
- **Native Packaging**: `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/ios`

### Backend Stack (Local Desktop Workspace):
- **Framework**: FastAPI (Python)
- **Database ORM**: SQLAlchemy
- **Data Schemas**: Pydantic v2
- **Database**: PostgreSQL (v14+)
- **Data Seeding**: Python request-based uploader (`upload.py`)

---

## 🚀 Getting Started (Step-by-Step Setup)

To demonstrate this system locally and display its full capabilities, set up both the frontend and your desktop backend:

### Part 1: Running the React Frontend
1. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```
2. **Run in Development Mode**:
   ```bash
   npm run dev
   ```
   The application will boot up and run on [http://localhost:3000](http://localhost:3000).

---

### Part 2: Setting up your PostgreSQL Database (Desktop)
1. **Open PostgreSQL shell or PgAdmin** and create your schema database:
   ```sql
   CREATE DATABASE hikmah_db;
   ```
2. Confirm your database username and password. By default, the database connector is configured for:
   - **User**: `postgres`
   - **Password**: `12345678` (Update `database.py` with your custom password if different)
   - **Host**: `localhost`
   - **Port**: `5432`

---

### Part 3: Running the FastAPI Server (Desktop)
1. Navigate to your Python project folder and install required dependencies:
   ```bash
   pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic requests
   ```
2. Ensure you have the following 3 files inside your desktop folder:
   - `database.py` (SQLAlchemy engine configuration)
   - `models.py` (SQLAlchemy Article and Part tables)
   - `main.py` (FastAPI router & CORS settings)
3. **Launch the Server**:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   *Note: Binding to `--host 0.0.0.0` allows your mobile emulator or testing devices to reach the API server directly.*

---

### Part 4: Seeding & Syncing your custom Articles
1. **Upload your custom `articles.json` dataset**:
   Run the test python script to populate your PostgreSQL database with your customized layout:
   ```bash
   python upload.py
   ```
2. **Configure your App**:
   - Go to the **"You" (Profile)** tab inside the Hikmah Academy App.
   - Enter your FastAPI address (e.g., `http://localhost:8000` or use the **Android Emulator IP preset** `http://10.0.2.2:8000`).
   - Click **Save & Connect**.
   - Click **Test Connection** to confirm a successful network handshake.
   - Click **Sync Articles** to live-stream your PostgreSQL records straight into the app!

---

### Part 5: Building for Native Mobile (Android & iOS)
This project is configured and ready to be loaded into Android Studio or Xcode:
1. **Build the production web distribution**:
   ```bash
   npm run build
   ```
2. **Add Native Platforms (Once)**:
   ```bash
   npm run cap:add:android
   # or
   npm run cap:add:ios
   ```
3. **Sync web bundle with native projects**:
   ```bash
   npm run cap:sync
   ```
4. **Boot in Android Studio / Xcode**:
   ```bash
   npm run cap:open:android
   # or
   npm run cap:open:ios
   ```

---

## 📈 Developer & Job Market Showcases

This project is built to showcase several core engineering principles to potential employers:
* **JSON-to-Relational Mapping**: Handled nested, unstructured documents in a relational database (`PostgreSQL JSON` column integration).
- **Asynchronous Network Interfaces**: Clean, non-blocking UI state updates during background API polling and network handshakes.
- **Cross-Platform Native Portability**: Shows competency in bridging progressive web technology into the native Android/iOS ecosystem using Capacitor.
- **Micro-interactions & UX Sensibility**: Custom crafted design language that stays away from generic templates, demonstrating care for typography, touch safety, and interactive delight.

Developed with 🕌 and 💡 by **Salih Yasin**.
