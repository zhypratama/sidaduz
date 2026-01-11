# SISKO - Development Log
**Last Updated**: 2026-01-11
**Status**: Active Development

## 1. Project Overview
Aplikasi Sistem Informasi Sekolah (SISKO) berbasis web untuk manajemen Siswa, GTK, Surat, dan Kurikulum.

### Technology Stack
- **Framework**: Laravel 12 (PHP 8.2+)
- **Frontend**: Inertia.js + React + Tailwind CSS
- **Database**: MySQL
- **Packages**:
  - `spatie/laravel-permission` (Roles & Permissions)
  - `barryvdh/laravel-dompdf` (PDF Export)
  - `maatwebsite/excel` (Excel Export)
  - `simplesoftwareio/simple-qrcode` (QR Code)
  - `date-fns` (Date Manipulation)

## 2. Module Status

### A. Authentication & Users
- [x] Login/Logout (Breeze)
- [x] Profile Management (Update Info, Password, Delete)
- [x] Role-based Access Control (Admin, Guru, Siswa, etc.)

### B. Manajemen Sekolah (`/sekolah`)
- [x] Profil Sekolah (Update Data Sekolah) `SchoolProfileController`
- [x] Tahun Ajaran (CRUD & Aktivasi) `TahunAjaranController`

### C. Siswa (`/siswa`)
- [x] Data Siswa (List, Create, Edit, Delete) `StudentController`
- [x] Akun Siswa (Generate & Reset Password)

### D. GTK - Guru & Tenaga Kependidikan (`/gtk`)
- [x] Data GTK (List, Create, Edit, Delete) `GtkController`
- [x] Akun GTK (Generate & Reset Password)
- [x] Jadwal Piket

### E. Persuratan (`/surat`)
- [x] Surat Masuk (Input & List) `SuratController`
- [x] Surat Keluar (Input, List, PDF Export, Validasi QR)
- [x] Template Surat `SuratTemplateController`
- [ ] Arsip Surat (Placeholder exists: `Surat/Arsip.jsx`)
- [ ] Pengaturan Surat (Placeholder exists: `Surat/Pengaturan.jsx`)

### F. Kurikulum (`/kurikulum`)
- [x] Kalender Akademik (Agenda, Libur, Ujian) `KurikulumController`
  - *Recent Update*: Added Edit (PATCH) & Delete (DELETE) functionality.

### G. Pengaturan Sistem (`/settings`)
- [x] App Settings (Maintenance Mode, Theme Config) `SettingController`

## 3. Recent Changes Log
**[2026-01-11]** - *Feature Implementation: Academic Calendar*
- **Modified**: `routes/web.php` adding `PATCH` and `DELETE` routes for calendar.
- **Modified**: `app/Models/AcademicCalendar.php` added casts for `start`, `end`, `is_holiday`.
- **Modified**: `app/Http/Controllers/KurikulumController.php` added `updateCalendar` and `destroyCalendar`.
- **Modified**: `resources/js/Pages/Kurikulum/Kalender/Index.jsx` implemented Edit Modal and Delete confirmation.

## 4. Pending / Next Tasks
1. **Verification**: User need to test the newly implemented Edit/Delete feature in Calendar.
2. **Persuratan**: Logic implementation for `Arsip` and `Pengaturan`.
3. **Optimizations**: Review `SettingController` logic for cleaner state management (as noted in TODOs).

---

## 5. Workflow Protocols
- **Strict Logging**: Every development process must be logged in this file **BEFORE** execution (Plan/Start) and **AFTER** completion (Result).

**[2026-01-11 00:41]** - *Plan: Configure Roles & Permissions*
- **Objective**: Grant 'Admin Sekolah' full access EXCEPT for 'Surat Approval'. 'Surat Approval' must be exclusive to 'Kepala Sekolah'.
- **Steps**:

  1. Identify Role/Permission Seeder.
  2. Identify specific permission for Letter Approval (validation).
  3. Modify Seeder to assign permissions correctly.
  4. Verify logic in Controller/Middleware.

**[2026-01-11 00:42]** - *Execution: Implement Approval Workflow*
- **Database**: Adding `status` enum('draft', 'approved', 'rejected') to `surat_keluars`.
- **Seeder**: Define permissions (`surat.view`, `surat.create`, `surat.edit`, `surat.delete`, `surat.approve`).
- **Roles**:
    - `Admin Sekolah`: All except `surat.approve`.
    - `Kepala Sekolah`: `surat.approve` + View.

**[2026-01-11 00:46]** - *Completion: Approval Workflow Implemented*
- **Database**: Migration `add_status_to_surat_keluars` applied.
- **Roles**: `RoleSeeder` updated. `Kepala Sekolah` has exclusive `surat.approve`. `Admin Sekolah` has restricted access.

**[2026-01-11 00:47]** - *Plan: Debug Sidebar Visibility*
- **Issue**: User reports missing sidebar menu items.
- **Hypothesis**: `Sidebar.jsx` uses permission checks that may be mismatched with the newly created roles/permissions.

**[2026-01-11 00:48]** - *Completion: Sidebar Visibility Fixed*
- **Issue Found**: Menu 'Kurikulum' was hidden for 'Kepala Sekolah'.

**[2026-01-11 00:49]** - *Fix: Sidebar Role Check Logic*
- **Issue**: `Sidebar.jsx` checks `r.name` but backend sends array of strings.

**[2026-01-11 00:50]** - *Plan: Grant Full Access to Admin Sekolah*
- **Reason**: Ease of testing during development phase.

**[2026-01-11 00:51]** - *Completion: Role Adjustment*

**[2026-01-11 00:53]** - *Plan: Role Permission Matrix in Settings*
- **Objective**: Create a matrix table in System Settings to toggle permissions for each role dynamically.
- **UI UX**: Added explicit labels (**Atas, Bawah, Kiri, Kanan**) to the Page Margin inputs for better clarity.
- **Feature**: Implemented **Template Integration**. A dynamic dropdown now appears when selecting a Classification, allowing users to load predefined templates associated with that classification (with confirmation prompt).
- **Visual**: Updated global styles to set **Font Color to Blue** (`text-blue-400`) when **Dark Mode** is active, as requested.
- **Fix (Critical)**: Resolved "Surat Cannot Save" issue.
  - **Cause**: Missing `spacing` column in DB vs Frontend sending it.
  - **Action**: Added `spacing` JSON column, updated Model & Controller.
  - **Action**: Added `spacing` JSON column, updated Model & Controller.
  - **Result**: Letter now saves correctly with full layout settings and redirects to Index with success message.

**[2026-01-11 02:40]** - *Fix: QR Code & Token Validation*
- **Issue**: `BaconQrCode` runtime error due to missing `imagick` extension on user's environment.
- **Fix**: Switched QR Code format to `SVG` (no external dependency needed) in `template.blade.php`.
- **Fix**: Switched QR Code format to `SVG` (no external dependency needed) in `template.blade.php`.
- **Feature**: Implemented **Token-based PDF URL** (`/surat/keluar/token/{token}`) usage in QR Code, replacing the ID-based URL for better security/validation flow as requested.
- **Fix**: Sanitized PDF Filename. Replaced invalid characters (`/`, `\`) in letter number with hyphens to prevent `InvalidArgumentException` during download.

**[2026-01-11 02:45]** - *Fix: PDF Preview & Logic Accuracy*
- **Kop Surat**: Logic updated to prioritize the **Uploaded Kop Image** (if exists) over the default Logo+Text fallback.
- **Footer**: Added `footer_text` to database to persist user edits. Template now correctly renders the saved custom footer.
- **Footer**: Added `footer_text` to database to persist user edits. Template now correctly renders the saved custom footer.
- **QR Code**: Added condition to **HIDE** QR Code on Draft letters. It now only appears when Status is `approved`, preventing confusion.

**[2026-01-11 02:50]** - *Rebranding*
- **Application Name**: Changed global App Name to **SIDADU**. 
- **Full Name**: Updated Footer to display "SIDADU (Sistem Informasi Data Terpadu - Fz&T)".
- **Application Name**: Changed global App Name to **SIDADU**. 
- **Full Name**: Updated Footer to display "SIDADU (Sistem Informasi Data Terpadu - Fz&T)".
- **Sidebar**: Updated Sidebar Header.
- **Fix**: Resolved `Data truncated` error on approval. Converted `status` column from strict `ENUM` to flexible `VARCHAR(50)` to allow 'approved' status.
- **Fix (Critical)**: Resolved "Halaman Surat Keluar Tidak Bisa Diakses". 
  - **Cause**: Frontend crash due to incorrect route name (`route('keluar.pdf')`) which is only rendered when a letter is Approved.
  - **Action**: Corrected route to `route('surat-keluar.pdf')` in `Index.jsx`.
  - **Bonus**: Updated `approve` method to correctly record `approved_by` and `approved_at`.

**[2026-01-11 03:00]** - *Refinement: PDF Header & Settings UI*
- **PDF**: Removed the double line border from the Header if an **Uploaded Kop Surat** is present (to avoid double lines).
- **Settings UI**: Fixed duplicated "Persuratan" menu tab in `Admin/Settings`.
- **Database**: Seeded `footer_text_surat` into `app_settings` to ensure the Default Footer Text setting works properly.

**[2026-01-11 03:45]** - *Refinement: Layout Defaults & SK Template*
- **Page Layout**: Updated default margins (Top/Bottom: 0.8cm, Left/Right: 1.8cm) and spacing (Gap: 0.4cm) as requested.
- **Surat Keputusan (SK)**: Implemented automatic content injection when "Surat Keputusan" is selected:
  - **Header**: "SURAT KEPUTUSAN" (16pt Bold), No. Surat, "Kepala Sekolah...", "Memutuskan", Perihal (14pt Bold). All Center Aligned, Times New Roman.
  - **Date Position**: Automatically set to "Kanan Bawah".
  - **Date Position**: Automatically set to "Kanan Bawah".
- **Manual Signature**: Fixed Footer Text logic to correctly load the Default Setting instead of a hardcoded string. QR Code appears properly when approved.

**[2026-01-11 03:55]** - *Refinement: Manual Signature QR Placement*
- **Footer QR**: For "Tanda Tangan Basah" (Manual), moved the Validation QR Code to the **Left side of the Footer** area (bottom of page), separating it from the Signature block as requested.
- **Visuals**: QR Code is absolutely positioned in the footer strip, ensuring it appears cleanly alongside the centered footer text.
- **Smart Visual Editor**: Updated the Live Preview to reflect these changes. Now, when selecting "Manual", a placeholder QR box appears in the footer, and the signature area is left clean.

**[2026-01-11 03:58]** - *Refinement: Footer Alignment*
- **Alignment**: Changed Footer Text alignment to **Left (Rata Kiri)** for all signature types as requested.
- **Layout Logic**:
  - **Manual Signature**: Added dynamic left padding (90px) to the text to accommodate the QR code on the left.
  - **TTE**: Standard left alignment without extra padding.
- **Editor Fix**: Forcefully corrected the `text-center` class to `text-left` in the React Component to match the user's requirement.

**[2026-01-11 04:00]** - *Refinement: Auto Margin for Manual Signature*
- **Logic**: Implemented automatic page margin adjustment in Smart Visual Editor.
  - **Manual Signature**: Bottom margin automatically changes to **1.2 cm**.
  - **TTE/Other**: Bottom margin resets to **0.8 cm**.

**[2026-01-11 04:05]** - *Refinement: Paper Size Accuracy*
- **PDF Print**: Added explicit `@page { size: ... }` CSS rule to the template.
  - **F4**: 215mm x 330mm (Previously relied on browser default which caused cutting).
  - **Letter**: 216mm x 279mm.
  - **A4**: 210mm x 297mm.
- **Editor**: Updated the visual editor canvas to dynamically resize (width & height) to match the real-world dimensions of the selected paper.

**[2026-01-11 04:20]** - *Feature: Upload Scan & Footer Cleanup*
- **Footer**: Removed the hardcoded "Dicetak pada..." line from the PDF template. Now the footer strictly displays ONLY what is configured in "Pengaturan Persuratan" (or nothing if empty).
- **Upload Scan**: Implemented a workflow for "Tanda Tangan Basah" (Manual).
  - **Action**: New "Upload Scan" button in the Letter Index table for manual approved letters.
  - **Logic**: Allows uploading PDF/JPG of the signed physical letter.
  - **Validation**: Once uploaded, the "Cetak PDF" and "QR Validasi" links automatically serve the **Uploaded Scan** instead of the generated template, ensuring the valid wet signature is shown.

**[2026-01-11 04:25]** - *Security: Token Length*
- **Token**: Increased the TTE Security Token length from 12 characters to **32 characters** for stronger uniqueness and security, as requested.
- **Token**: Increased the TTE Security Token length from 12 characters to **32 characters** for stronger uniqueness and security, as requested.
- **Backend**: Update `SettingController` to pass `roles` and `permissions`. Add `updatePermission` endpoint.

**[2026-01-11 04:45]** - *Feature: App Maintenance & Dashboard Fix*
- **Dashboard**: Connected the main dashboard to **Real-time Database Counts**.
  - Total Siswa, Guru, Surat Keluar, and Surat Masuk now reflect actual database records.
- **Maintenance System**:
  - **Core**: Implemented `CheckMaintenanceMode` middleware to restrict access when active.
  - **Access**: "Admin Sekolah" & "Kepala Sekolah" retain FULL ACCESS during maintenance. Unauthorized users see a Maintenance Page.
  - **UI**: Added a Maintenance Page with **Countdown Timer** and Custom Message.
  - **Control**: Added "Mode Maintenance" toggle, Message input, and End Time picker in **Settings > Umum**.

**[2026-01-11 05:05]** - *Feature: Import Data GTK*
- **Database**: Expanded `gtks` table with ~40 new fields to accommodate detailed educator profiles (NUPTK, NPWP, Bank, Keluarga, SK, dll) according to standardized Excel template.
- **Import Engine**: Implemented `GtkImport.php` using `maatwebsite/excel`.
  - **Auto-Update**: Intelligently updates existing records matching NIP, NUPTK, or Nama+Tanggal Lahir.
  - **Data Mapping**: Maps Excel headers strictly to DB columns.
- **UI**: Added "Import Data" button in `Manajemen GTK` with a drag-and-drop modal for Excel files.

**[2026-01-11 05:15]** - *Fix: Dashboard Crash*
- **Issue**: SQL Error `Column not found: jenis_kelamin` on Dashboard.
- **Cause**: Trying to count gender on `users` table which lacks the column.
- **Fix**: Switched query to use `Gtk` table for gender statistics. Dashboard now loads correctly.

**[2026-01-11 00:55]** - *Completion: Role Permission Matrix Implemented*
- **Feature**: Added "Hak Akses" tab in `Settings`.
- **UI**: Interactive Matrix Table (Rows: Permissions, Cols: Roles).

**[2026-01-11 00:56]** - *Fix: Frontend Compilation Error*
- **Issue**: Duplicate import in `Admin/Settings/Index.jsx`.

**[2026-01-11 00:58]** - *Fix: Refactored Access Control to Menu-Based Permissions*
- **Reason**: User blocked from Kurikulum; requested granular table control matching menu structure.
- **Changes**:
  - `database/seeders/RoleSeeder.php`: Added `view.[module]` permissions (dashboard, sekolah, surat, gtk, siswa, kurikulum, ppdb, settings). Re-seeded.
  - `routes/web.php`: Replaced `role:name` middleware with `can:view.module` middleware for all major groups.
  - `resources/js/Components/Sidebar.jsx`: Updated `hidden` logic to check `hasPermission('view.module')` instead of `hasRole()`.
  - `resources/js/Pages/Admin/Settings/Index.jsx`: Grouped the Access Table into "Akses Menu", "Persuratan", etc.
- **Result**: "Hak Akses" table now matches menu structure. Kurikulum access should be restored if the user has `view.kurikulum` permission (granted to Admin/Kepsek/Kurikulum in seeder).

**[2026-01-11 01:21]** - *Feature: Enhanced Academic Calendar*
- **Action**: Refactored `Kurikulum/Kalender/Index` to match "Kalender Pendidikan" visual style.
- **New Features**:
  - **Reference Sync**: Added button to sync standard events from Jabar 2024/2025 Reference.
  - **Smart Editor**: New modal with visual Color/Category selection (Kegiatan, Libur, Ujian).
  - **Visuals**: Full colored grid cells matching official calendar aesthetics.
- **Database**: 
  - Added `type` and `color` columns to `academic_calendars`.
  - Created `ReferenceCalendarSeeder`.

**[2026-01-11 07:41]** - *Fix: Fatal Error in GtkController*
- **Issue**: `Cannot redeclare App\Http\Controllers\GtkController::akun()` fatal error.
- **Cause**: Accidental duplication of `akun` and `roleIndex` methods during previous refactoring.
- **Fix**: Removed the duplicate method definitions to restore functionality.

**[2026-01-11 07:53]** - *Feature: Professional Secure Login (Split Screen + Captcha)*
- **Objective**: Redesign Login page to meet "High Security Standard" and "Professional" look.
- **UI Changes**:
  - **Split Screen**: Left side branding (Deep Blue, Patterns, Logo), Right side Clean Form.
  - **Visuals**: Added "Secure Encrypted Connection" badge, modern inputs with floating labels/icons.
- **Security Features**:
  - **Math Captcha**: Implemented server-side Math Verification (e.g., "5 + 3 = ?").
    - **Backend**: `AuthenticatedSessionController::create()` generates random numbers -> Session.
    - **Validation**: `LoginRequest` validates input against session value.
- **UX**: Added Show/Hide Password toggle. Restored specific footer text requirement.













