# 🚀 DEVELOPMENT PHASES — Hệ thống Thiệp Cưới Online

> **Tổng thời gian ước tính:** 10–12 tuần (solo dev)  
> **Stack:** Next.js 14 + Express.js + PostgreSQL + Prisma + Cloudinary  
> **Tham khảo spec:** `docs/MASTER-SPEC.md`

---

## 📊 TỔNG QUAN CÁC PHASE

| Phase | Tên | Thời gian | Kết quả |
|-------|-----|-----------|---------|
| **P0** | Setup & Foundation | 3–4 ngày | Project scaffold, DB, config |
| **P1** | Auth & Dashboard | 4–5 ngày | Login, Register, Dashboard cơ bản |
| **P2** | Templates System | 3–4 ngày | Template gallery, seed data |
| **P3** | Editor Core | 7–10 ngày | Canvas + 5 panel cơ bản |
| **P4** | Guest View | 4–5 ngày | Public URL, RSVP, Lời chúc, OG |
| **P5** | Editor Premium | 5–7 ngày | Widgets, Effects, Preset, Music |
| **P6** | Guest Management | 3–4 ngày | Dashboard KM, RSVP tracking |
| **P7** | Analytics | 2–3 ngày | Events, Dashboard stats |
| **P8** | Payments | 3–4 ngày | VNPay, plan gating |
| **P9** | Polish & Launch | 3–5 ngày | SEO, performance, QA |

---

## ═══ PHASE 0: SETUP & FOUNDATION ═══

### Sprint 0.1 — Project Structure
```
Tạo cấu trúc thư mục:
frontend/
  app/
    (marketing)/          # Public pages
    (auth)/               # Login, register
    (dashboard)/          # Protected pages  
    [slug]/               # Guest view
  components/
    ui/                   # Button, Input, Modal, Badge...
    editor/               # Editor components
    layout/               # Navbar, Footer, Sidebar
  lib/
    api.js                # API client
    auth.js               # NextAuth config
    utils.js              # Helpers
  hooks/
    useEditor.js          # Editor state
    useInvitation.js
  store/
    editorStore.js        # Zustand

backend/
  src/
    routes/               # Express routers
    controllers/          # Business logic
    middleware/           # Auth, validation
    services/             # Cloudinary, VNPay...
    prisma/
      schema.prisma
      seed.js
```

### Sprint 0.2 — Database Setup
- [ ] Cài Prisma, kết nối PostgreSQL
- [ ] Viết `schema.prisma` (8 models: User, Template, Invitation, Guest, Message, AnalyticsEvent, Media, Payment)
- [ ] Chạy `prisma migrate dev`
- [ ] Viết seed script: 10 template records đa dạng (wedding/basic/premium mix)

### Sprint 0.3 — Config & Env
- [ ] `.env` setup: DATABASE_URL, CLOUDINARY_*, JWT_SECRET, VNPAY_*
- [ ] Next.js config: `next.config.js` (images domains, rewrites)
- [ ] Tailwind config: custom colors (rose/pink palette), fonts (Google Fonts)
- [ ] Base UI components: Button, Input, Badge, Modal, Spinner, Card

---

## ═══ PHASE 1: AUTH & DASHBOARD CƠ BẢN ═══

### Sprint 1.1 — Backend Auth API
- [ ] `POST /api/auth/register` — validate + hash + create user
- [ ] `POST /api/auth/login` — check + JWT
- [ ] `POST /api/auth/logout` — clear session
- [ ] `GET /api/auth/me` — return current user
- [ ] Middleware: `authMiddleware` (verify JWT, attach `req.user`)
- [ ] Error handling: 400 (validation), 401 (unauth), 403 (forbidden)

### Sprint 1.2 — Frontend Auth Pages
- [ ] `/login` — form email/password + Google OAuth button
- [ ] `/register` — form + validation (Zod)
- [ ] `/forgot-password` — email form → success message
- [ ] NextAuth.js config: credentials provider + Google provider
- [ ] Auth hooks: `useSession()`, protected route HOC
- [ ] Redirect logic: after login → dashboard hoặc `callbackUrl`

**Mockup:** login_register_mockup.png

### Sprint 1.3 — Dashboard Shell
- [ ] `/dashboard` page — layout với left sidebar + main content
- [ ] Left nav: Dashboard / Thiệp của tôi / Khách mời / Thống kê / Cài đặt / Nâng cấp
- [ ] Stats cards (hardcode data trước): Thiệp đã tạo, Lượt xem, Xác nhận, Lời chúc
- [ ] Grid thiệp `InvitationCard` component: thumbnail + status badge + actions
- [ ] "+ Tạo thiệp mới" card dashed border → redirect `/templates`
- [ ] Plan banner: "Gói hiện tại: Free | Nâng cấp"

**Backend:**
- [ ] `GET /api/invitations` — danh sách thiệp của user
- [ ] `DELETE /api/invitations/:id` — xóa thiệp

**Mockup:** dashboard_mockup.png

---

## ═══ PHASE 2: TEMPLATES SYSTEM ═══

### Sprint 2.1 — Template Gallery
- [ ] `/templates` page — header + filter tabs + grid
- [ ] Category filter tabs: Tất cả / Thiệp cưới / Sinh nhật / ... (7 categories)
- [ ] Dropdown filter: "Tất cả gói ▼" (Free/Basic/Premium)
- [ ] Grid 6 cột responsive (2 trên mobile, 3 tablet, 6 desktop)
- [ ] `TemplateCard` component: thumbnail + badge (BASIC/PREMIUM colored pill) + hover overlay
  - Hover: "Xem trước" + "Dùng mẫu này"

**Backend:**
- [ ] `GET /api/templates` — filter by category, tier. paginate 24/page
- [ ] `GET /api/templates/:id` — chi tiết template
- [ ] `POST /api/templates/:id/preview` — increment preview_count

**Mockup:** templates_gallery_mockup.png

### Sprint 2.2 — Template Selection Flow
- [ ] Click "Dùng mẫu này" → check auth (redirect /login?callbackUrl=)
- [ ] Check plan vs tier → nếu không đủ → `UpgradeModal` component
- [ ] `POST /api/invitations` → clone config_json → redirect `/editor-template/:id`
- [ ] Seed 15 templates: mix wedding (8) + birthday (3) + graduation (2) + other (2)
  - 5 free, 7 basic, 3 premium
  - Mỗi template có thumbnail_url (Cloudinary hoặc placeholder)

---

## ═══ PHASE 3: EDITOR CORE ═══

### Sprint 3.1 — Editor Layout Shell
- [ ] `/editor-template/[id]` page — load invitation + render editor layout
- [ ] `EditorLayout.jsx` — 3 panel wrapper (sidebar + canvas + right)
- [ ] `LeftSidebar.jsx` — 10 icon tabs, active state, click → switch panel
- [ ] `CanvasArea.jsx` — scrollable với overflow-y, width 390px centered
- [ ] `RightPanel.jsx` — switch between `GlobalSettings` và `ElementProperties`
- [ ] `TopBar.jsx` — menu, undo/redo, save status, preview, publish buttons
- [ ] Zustand store: `useEditorStore` — `{ invitation, selectedElement, history, canUndo, canRedo }`

**Backend:**
- [ ] `GET /api/invitations/:id` — load invitation + config_json
- [ ] `PUT /api/invitations/:id` — save config_json (auto-save)

### Sprint 3.2 — Canvas Rendering
- [ ] Parse `config_json.sections[]` → render `<Section>` components
- [ ] `<Section>` render các element types:
  - `type=text` → `<TextElement>` (editable div)
  - `type=image` → `<ImageElement>` (img with src)
  - `type=shape` → `<ShapeElement>` (svg)
- [ ] Element selection: click → `selectedElement` state → show resize handles
- [ ] Drag to move: mouse/touch drag → update x/y in store
- [ ] Delete key → remove selected element
- [ ] Deselect: click empty area

### Sprint 3.3 — Panel: Văn bản
- [ ] `TextPanel.jsx` — button "Thêm tiêu đề", "Thêm văn bản", "Thêm cặp tên"
- [ ] Click → add text element vào giữa canvas
- [ ] Right panel `TextProperties.jsx`:
  - Bold/Italic/Strikethrough/Underline toggles
  - Alignment buttons (4)
  - Font size input (−/+)
  - Font dropdown (10+ Google Fonts)
  - Color pickers (text color, bg color)
  - Opacity slider
  - Collapsible: Khoảng đệm / Đường viền / Đổ bóng / Liên kết

### Sprint 3.4 — Panel: Hình ảnh
- [ ] `ImagePanel.jsx` — upload zone + gallery ảnh đã upload
- [ ] Upload flow: chọn file → validate → `POST /api/media/upload` → Cloudinary
- [ ] Hiển thị count "0/10 ảnh", progress bar dung lượng
- [ ] Click ảnh → add `image` element vào canvas
- [ ] Right panel `ImageProperties.jsx`:
  - Filter selector (None/Grayscale/Sepia/Warm/Cool)
  - Opacity slider
  - Border radius slider (0–50%)
  - Rotate (−180 → +180)
  - Flip H / Flip V buttons

**Backend:**
- [ ] `POST /api/media/upload` — Multer + Cloudinary upload
- [ ] `GET /api/media` — list user's media
- [ ] `DELETE /api/media/:id` — Cloudinary delete + DB

### Sprint 3.5 — Panel: Nền (Background)
- [ ] `BackgroundPanel.jsx` — tabs "Màu nền" / "Hình nền"
- [ ] Màu nền: color picker (react-colorful) → update section background
- [ ] Hình nền: grid texture library (30+ ảnh từ Cloudinary hoặc CDN)
  - Categories: Vải / Đá / Hoa / Abstract / Thiên nhiên
  - Click → set section background-image

### Sprint 3.6 — Right Panel: Global Settings
- [ ] `GlobalSettings.jsx` — hiện khi không có element selected
- [ ] Dropdown Danh mục, Dropdown Trạng thái (Công khai/Riêng tư)
- [ ] OG Preview section:
  - Preview box: ảnh + tiêu đề + mô tả
  - Nút "Chỉnh sửa" → form modal (upload ảnh OG, nhập title, description)

### Sprint 3.7 — Undo/Redo & Auto-save
- [ ] Zustand history stack: `past[]`, `present`, `future[]`
  - max 50 steps
  - `pushHistory()` mỗi khi thay đổi element
  - `undo()` / `redo()` functions
- [ ] Top bar: Undo/Redo buttons với disable state
- [ ] Keyboard shortcuts: Ctrl+Z, Ctrl+Y
- [ ] Auto-save: `debounce(saveToAPI, 2000)` sau mỗi `pushHistory()`
- [ ] Status indicator: "Đang lưu..." → "Đã lưu tạm thời"

### Sprint 3.8 — Publish Flow
- [ ] "Xuất bản" button → `POST /api/invitations/:id/publish`
- [ ] `PublishModal.jsx`:
  - Share URL display + copy button
  - QR code (react-qr-code)
  - Share buttons: Facebook / Zalo / Copy link
- [ ] Unpublish: menu → set draft

---

## ═══ PHASE 4: GUEST VIEW ═══

### Sprint 4.1 — Guest View Page
- [ ] `/[slug]/page.js` — SSR (generateMetadata + page component)
- [ ] `generateMetadata()` → OG tags từ invitation (og_title, og_image, og_description)
- [ ] Load invitation bằng slug → parse config_json
- [ ] Parse `?name=` searchParam → inject guest name
- [ ] Track view: `POST /api/public/:slug/track` (client-side, after hydration)
- [ ] View limit check: nếu `view_count > plan_limit` → show `<WatermarkOverlay>`

**Mockup:** guest_view_mockup.png

### Sprint 4.2 — Section Renderers
- [ ] `<SectionHero>` — ảnh full-width + overlay text (tên + ngày)
- [ ] `<SectionTimeline>` — ordered list events
- [ ] `<SectionCalendar>` — calendar widget tháng cưới
- [ ] `<SectionInfo>` — địa điểm + Google Maps iframe
- [ ] `<SectionRSVP>` — RSVP form
- [ ] `<SectionMessages>` — feed lời chúc + form gửi
- [ ] `<SectionQRBank>` — ảnh QR + thông tin ngân hàng
- [ ] `<BottomBar>` — floating action bar icons

### Sprint 4.3 — RSVP & Lời chúc
- [ ] RSVP submit → `POST /api/public/:slug/rsvp`
  - Body: `{name, rsvp_status, party_size, note}`
  - Success: toast "Cảm ơn [tên]! Chúng tôi rất mong gặp bạn!"
  - Cookie 24h để prevent duplicate
- [ ] Messages load → `GET /api/public/:slug/messages`
- [ ] Messages submit → `POST /api/public/:slug/messages`
  - Hiện ngay (optimistic update)

### Sprint 4.4 — Music Player
- [ ] Floating music icon button (vị trí config từ `config_json.music`)
- [ ] Click → toggle play/pause HTMLAudioElement
- [ ] Autoplay với user interaction (browser policy)
- [ ] Icon styles: 6 kiểu vinyl/note, màu customizable

---

## ═══ PHASE 5: EDITOR PREMIUM PANELS ═══

### Sprint 5.1 — Panel: Âm nhạc
- [ ] `MusicPanel.jsx` — tabs "Thư viện nhạc" / "Nhạc của tôi"
- [ ] Thư viện: search bar + tabs (Tất cả/Nhạc ngoại/V-POP) + danh sách
  - Seed 30+ songs vào DB (tên + category + url + duration)
  - Row: ▶ preview 30s | tên bài | duration | [Sử dụng] | 👑 nếu premium
- [ ] Nhạc của tôi (Basic+): upload mp3, list files, apply
- [ ] Right panel: icon picker (6 icons) + color picker

### Sprint 5.2 — Panel: Tiện ích Free
- [ ] `WidgetsPanel.jsx` — grid icon + label
- [ ] `CalendarWidget` — render calendar từ `wedding_date`
- [ ] `CountdownWidget` — đếm ngược đến ngày cưới (DD:HH:MM:SS)
- [ ] `MapWidget` — input địa chỉ → Google Maps Static API embed
- [ ] `CallButton` — input số điện thoại → button
- [ ] `RSVPBasicWidget` — form Tên + party size + submit

### Sprint 5.3 — Panel: Tiện ích Premium (Basic+)
- [ ] Plan check trước khi add widget → upgrade modal
- [ ] `QRBoxWidget` — chọn ngân hàng + nhập STK + tên → generate VietQR
- [ ] `AlbumWidget` — multi-photo slideshow (swipe)
- [ ] `VideoWidget` — nhập YouTube URL → embed iframe
- [ ] `GuestNameWidget` — hiển thị `{{guest_name}}` từ URL param
- [ ] `ParticlesWidget` — canvas overlay (hoa anh đào / tim / tuyết)
- [ ] `EnvelopeWidget` — config effect mở phong bì

### Sprint 5.4 — Panel: Preset
- [ ] `PresetPanel.jsx` — grid preset blocks
- [ ] 8 preset blocks với thumbnail preview
- [ ] Click → add preset block (group of elements) vào cuối canvas
- [ ] Lock premium presets with 👑 icon overlay

### Sprint 5.5 — Panel: Hiệu ứng
- [ ] `EffectsPanel.jsx` — 7 lựa chọn (grid 2x3+1)
  - None / Fade In All / Slide Up All / Scale In All / Flip In All / Slide Up Mix / Fade In Mix
- [ ] Click chọn → update `config_json.effects.animation`
- [ ] Nút "Xem trước hiệu ứng" → chạy animation trên canvas 2s
- [ ] Guest view: implement Intersection Observer → apply CSS class khi element vào viewport

---

## ═══ PHASE 6: GUEST MANAGEMENT ═══

### Sprint 6.1 — Guest List Dashboard
- [ ] `/dashboard/guests/[invitationId]` page
- [ ] Breadcrumb: "← Thiệp cưới Minh & Linh"
- [ ] Stats cards: Tổng / Đồng ý / Từ chối / Chưa phản hồi / Dự kiến tham dự
- [ ] Table: Tên | Liên lạc | RSVP badge | Số người | Link | Actions (edit/delete)
- [ ] Search + filter by RSVP status
- [ ] Pagination (20/page)

**Mockup:** guest_management_mockup.png

### Sprint 6.2 — CRUD Guests
- [ ] Modal "Thêm khách mời": Tên* + Phone + Email
- [ ] Inline edit (click tên → editable)
- [ ] Delete với confirm dialog
- [ ] Per-row: copy unique link button

**Backend:**
- [ ] `GET /api/invitations/:id/guests` — filter + sort + paginate
- [ ] `POST /api/invitations/:id/guests` — thêm 1 khách
- [ ] `PUT /api/invitations/:id/guests/:guestId` — update
- [ ] `DELETE /api/invitations/:id/guests/:guestId` — xóa

### Sprint 6.3 — Import / Export
- [ ] "Import CSV" button → modal drag-drop + file select
- [ ] Parse CSV: Papa Parse library
- [ ] Preview table trước khi import (20 rows first)
- [ ] `POST /api/invitations/:id/guests/import` → bulk insert (skip duplicates)
- [ ] Download template CSV link
- [ ] "Export" → generate CSV in browser

---

## ═══ PHASE 7: ANALYTICS ═══

### Sprint 7.1 — Event Tracking
- [ ] Backend: `POST /api/public/:slug/track` — nhận event + lưu DB
  - Dedup: hashed IP + invitation_id → 1 view/1h
- [ ] Track events: view, rsvp_attend, rsvp_decline, wish_sent, qr_view

### Sprint 7.2 — Analytics Dashboard
- [ ] `/dashboard/analytics/[invitationId]` page
- [ ] Stats: Tổng lượt xem / Hôm nay / RSVP / Lời chúc
- [ ] Chart lượt xem 7 ngày (recharts LineChart)
- [ ] RSVP breakdown: donut chart (Đồng ý/Từ chối/Chưa phản hồi)
- [ ] Table "Lời chúc gần đây"

**Backend:**
- [ ] `GET /api/invitations/:id/analytics` — aggregate events (group by date, type)

---

## ═══ PHASE 8: PAYMENTS & PLAN GATING ═══

### Sprint 8.1 — Plan Gating
- [ ] `featureFlags.js` — định nghĩa features theo plan
- [ ] `<PlanGate feature="qr_box" plan={user.plan}>` — HOC/wrapper
  - Nếu không đủ plan → hiển thị 👑 + disabled state
- [ ] `<UpgradeModal>` — hiện khi click feature locked
  - So sánh Free vs Basic vs Premium
  - CTA "Nâng cấp ngay"
- [ ] API middleware: `requireFeature(feature)` — 403 nếu không đủ plan
- [ ] Invitation limit check: `GET /api/invitations` → nếu count >= limit → block create

### Sprint 8.2 — VNPay Integration
- [ ] `/checkout/upgrade` page — chọn plan + thời hạn
  - Plan: Basic / Premium
  - Thời hạn: 1 tháng / 6 tháng / 12 tháng
  - Giá tự tính
- [ ] `POST /api/payments/checkout` → tạo VNPay payment URL → redirect
- [ ] `POST /api/payments/webhook` → verify HMAC signature → update user plan
- [ ] Redirect về `/dashboard?payment=success` → show success toast

### Sprint 8.3 — Settings & Plan Management
- [ ] `/dashboard/settings` page — Cài đặt tài khoản
  - Tab Thông tin cá nhân: Đổi tên, Số điện thoại, Avatar (upload Cloudinary)
  - Tab Bảo mật: Đổi mật khẩu
  - Tab Gói & Thanh toán: Xem plan hiện tại, ngày hết hạn, % dung lượng, lịch sử thanh toán
- [ ] Cron job (`node-cron`, chạy 00:00 mỗi ngày):
  - Query users `plan_expires_at < NOW() AND plan != 'free'`
  - Set `plan = 'free'`
  - (Optional) Gửi email thông báo

---

## ═══ PHASE 9: DESIGN BỔ SUNG & POLISH & LAUNCH ═══

### Sprint 9.0 — Tạo Mockup Bổ Sung
- [ ] Dùng `generate_image` flow để tạo 4 mockups còn thiếu chuẩn theo style guide:
  - 1. `09-forgot-password.png` (Quên mật khẩu)
  - 2. `10-analytics.png` (Thống kê chi tiết biểu đồ)
  - 3. `11-checkout.png` (Trang thanh toán gói)
  - 4. `12-settings.png` (Cài đặt tài khoản)

### Sprint 9.1 — Animations & UX
- [ ] Framer Motion: page transitions (fade/slide)
- [ ] Hiệu ứng phong bì guest view (Framer Motion animate)
- [ ] Canvas scroll animations (Intersection Observer)
- [ ] Micro-animations: button hover, card hover, modal open/close
- [ ] Loading skeletons: template grid, guest table, editor canvas

### Sprint 9.2 — SEO & Performance
- [ ] `generateMetadata()` mỗi page (title, description, OG)
- [ ] `sitemap.xml` tự động (next-sitemap)
- [ ] `robots.txt`
- [ ] Dynamic OG image cho guest view: `@vercel/og`
- [ ] Next.js Image component tất cả ảnh
- [ ] Bundle analyzer → split chunks

### Sprint 9.3 — Responsive & Cross-browser
- [ ] Test mobile (375px, 390px, 428px)
- [ ] Test tablet (768px)
- [ ] Test desktop (1280px, 1440px)
- [ ] Cross-browser: Chrome, Firefox, Safari, Edge

### Sprint 9.4 — Testing & QA
- [ ] Unit test: auth middleware, plan gating, RSVP matching
- [ ] Integration test: create invitation → publish → guest view → RSVP flow
- [ ] E2E: signup → create thiệp → share → RSVP (Playwright)
- [ ] Load test: 100 concurrent guest views

### Sprint 9.5 — Deployment
- [ ] Frontend: Vercel (auto-deploy từ main branch)
- [ ] Backend: Railway hoặc Render
- [ ] DB: Supabase PostgreSQL
- [ ] Media: Cloudinary production account
- [ ] Environment variables config
- [ ] Custom domain setup

---

## 📋 CODING CHECKLIST (Priority order)

### Must-have (MVP)
- [x] ~~Spec & planning~~
- [ ] P0: Setup + DB schema + seed
- [ ] P1: Auth (login/register) + Dashboard shell
- [ ] P2: Template gallery + selection
- [ ] P3: Editor core (canvas + text + image + publish)
- [ ] P4: Guest view (render + RSVP + lời chúc)

### Should-have
- [ ] P5: Music panel + Effects + Widgets
- [ ] P6: Guest management (list + import + export)
- [ ] P7: Analytics dashboard

### Nice-to-have (Monetization)
- [ ] P8: VNPay + Plan gating
- [ ] P9: Polish + SEO + Deployment

---

## 🗂 FILE NAMING CONVENTION

```
components/
  editor/
    panels/
      TextPanel.jsx         # [Tab]Panel.jsx
      ImagePanel.jsx
      MusicPanel.jsx
    properties/
      TextProperties.jsx    # Element right-panel properties
      ImageProperties.jsx  
    canvas/
      Canvas.jsx
      TextElement.jsx       # [Type]Element.jsx
      ImageElement.jsx
    TopBar.jsx
    LeftSidebar.jsx
    RightPanel.jsx

  guest-view/
    SectionHero.jsx         # Section[Type].jsx
    SectionRSVP.jsx
    SectionMessages.jsx
    BottomBar.jsx

  dashboard/
    InvitationCard.jsx
    GuestTable.jsx
    StatsCard.jsx

  ui/
    Button.jsx
    Modal.jsx
    Badge.jsx
    PlanGate.jsx
    UpgradeModal.jsx
```

---

## ⚡ QUICK START COMMANDS

```bash
# Phase 0: Setup
npx create-next-app@latest ./frontend --app --js --tailwind
cd backend && npm init -y && npm install express prisma @prisma/client

# DB
npx prisma init
npx prisma migrate dev --name init
npx prisma db seed

# Dev
npm run dev              # frontend :3000
node src/index.js        # backend :5000

# Build
npm run build            # Next.js production build
```
