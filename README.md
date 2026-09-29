# ResQ — India Emergency-Care Coordination Concept Demo

> **CRITICAL DEMO NOTICE**: ResQ is an emergency-care coordination concept demonstration using synthetic data. It is **NOT** connected to live emergency services, does **NOT** dispatch ambulances, and does **NOT** autonomously diagnose patients or guarantee hospital acceptance.

---

## 🚨 Product Purpose

In emergency situations across India, families and bystanders face immense friction repeating medical histories, finding landmarks, and coordinating with emergency desks. **ResQ** is a mobile-first coordination interface designed to:
- Prepare a concise, standardized SBAR patient handover.
- Facilitate direct dialing to the National Emergency Helpline (**112**) without faking call placement.
- Share a real-time, non-inferred incident timeline with an authorized demo responder.
- Alleviate coordination anxiety through structured, attributed observations.

---

## 🎨 Design Direction

Built according to the **RESQ ONE** design philosophy:
- **Palette**: Near-black (`#141618`), emergency red (`#EB232D`), white, and restrained neutral greys (`#24272B`, `#383D43`, `#8E959E`, `#F4F5F7`).
- **Ergonomics**: Mobile-first touch targets ($\ge 48\text{px}$) optimized for single-handed Android operation in the natural thumb zone.
- **Tone**: High-contrast, calm, clinical copy without decorative animation or alarmist gimmicks.
- **Desktop Responder View**: Side-by-side coordination desk view for triage operators.

---

## ⚡ Key Flows & Features

1. **Family & Patient Profiles**:
   - Create, edit, and remove fictional family members.
   - Pre-loaded with synthetic Indian profiles (*Ramesh Sharma*, *Priya Nair*, *Aarav Patel*).
   - Captures self-reported conditions, critical allergies, current medicines, insurance reference, and hospital preferences.
   - Distinctly marked: `Patient/family reported — not clinically verified`.
   - Built-in **Sharing Preview** displaying the exact minimal data view exposed to responders.

2. **Emergency Home & Lifeline 112 Dialler**:
   - Prominent **"Open phone to call 112"** control.
   - Explains clearly that opening the dialler does not mean a call was placed or answered.
   - Never calls 112 automatically and never uses fake workarounds.

3. **Active Incident Session**:
   - HTML5 Geolocation with fallback to an Indian-context manual address form (Building/Flat, Landmark, City, Pincode).
   - Source distinction: `Device GPS (±Xm)` vs. `Manually entered by user`.
   - User-reported symptom/episode timer with live stopwatch (`User-reported, not AI-detected`).
   - Zero invented ambulance ETAs.

4. **Bystander Observations**:
   - Structured, attributed observation entries (*Bystander*, *Family member*, *Self*).
   - Non-inferred symptom categories with explicit support for `Unknown / not observed`.
   - Never converts subjective or uncertain observation into a clinical fact.

5. **Desktop Responder Coordination Desk**:
   - Dedicated desktop station view for triage operators.
   - Scoped to active incident summary (protects full family profile privacy).
   - One-click **"Demo Acknowledge"** button that syncs state across tabs in real-time.
   - Labeled: `Demo responder acknowledged` (never "ambulance dispatched" or "help is on the way").

6. **Simulated Clinical Handover**:
   - Concise SBAR handover sheet.
   - Insurance status disclaimer: `Available for hospital verification. Pre-authorisation NOT filed; cashless care NOT approved; claim NOT submitted.`
   - Destination disclaimer: `Hospital preference is a family preference, not an automated destination decision or hospital acceptance.`
   - 1-click clipboard copy and browser print/PDF export.

7. **Video Room Demo**:
   - Bystander-to-responder video interface with real device camera/mic permission check (`navigator.mediaDevices.getUserMedia`).
   - Graceful permission denial fallback to *Audio-First / Text Demonstration Mode*.
   - Mute, camera-off, audio-first fallback, and disconnect controls.
   - Clearly disclaims: `VIDEO UI DEMO — NO LIVE TRANSMISSION`.

8. **Practice Drill Mode**:
   - Training mode with amber watermarks and banners to practice emergency handover without panic or emergency confusion.

9. **Clinical Guidance Roadmap**:
   - Future protocol module shown as disabled per safety guidelines (requires licensed clinician review and NMC/AIIMS vetting).

---

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 + Plus Jakarta Sans + JetBrains Mono
- **Icons**: Lucide React
- **Sync**: HTML5 `BroadcastChannel` API + `localStorage` for cross-tab multi-view simulation

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or bun

### Installation
```bash
# Clone the repository
git clone <YOUR_GITHUB_REPO_URL>
cd resq-emergency-coordination

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to interact with the application.

---

## 🧪 Simulation & Safety Boundaries

| Feature | Implementation State | Verification Status |
| :--- | :--- | :--- |
| **Emergency Dialing** | Device keypad trigger (`tel:112`) | User-confirmed manual call only |
| **Location** | Browser Geolocation API / Manual | Explicit source labeling |
| **Responder Desk** | Cross-tab simulation | `Demo responder acknowledged` |
| **Hospital Handover** | Printable SBAR sheet | Pre-auth not filed; preference only |
| **Video Room** | Local camera check + WebRTC mock | No live streaming / recording |
| **AI Diagnosis** | Completely omitted per safety policy | No autonomous medical triage |

---

## 📄 License
Apache-2.0
