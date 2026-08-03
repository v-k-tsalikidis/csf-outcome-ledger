# CSF Outcome Ledger - Setup, Prerequisites & Troubleshooting Guide

This guide provides step-by-step instructions for installing, running, troubleshooting, and operating **CSF Outcome Ledger**.

---

## 📋 System Prerequisites

Before running the application, ensure your environment has:
- **Node.js**: `v18.0.0` or higher (`node -v`)
- **npm**: `v9.0.0` or higher (`npm -v`)
- **Modern Browser**: Chrome, Edge, Firefox, or Safari (supporting ES Modules & Web Crypto API)

---

## 🚀 Quick Setup & Execution

### 1. Fresh Installation
```bash
# Navigate to the project folder
cd /path/to/csf-outcome-ledger

# Clean install all Node dependencies
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```
Open your browser and navigate to:  
👉 **`http://localhost:5173`**

### 3. Production Build & Audit Validation
```bash
# Verify TypeScript & compile production bundle
npm run build
```

---

## 🛠️ Common Issues & Troubleshooting

### Problem 1: Browser shows a blank white page when opening `index.html` directly
- **Root Cause**: Modern React & Vite applications use ES Modules (`/src/main.tsx`). Opening `index.html` via `file:///` double-click from the file browser will not execute TypeScript or load CSS.
- **Solution**: Always run `npm run dev` and open `http://localhost:5173` in your web browser.

---

### Problem 2: Port Conflict / "Port 5173 is in use"
- **Root Cause**: A previous Vite process is still running in the background holding port `5173`.
- **Solution**:
  - **macOS / Linux**: Kill the process using port 5173:
    ```bash
    npx kill-port 5173
    # or
    lsof -ti :5173 | xargs kill -9
    ```
  - Then run `npm run dev` again.

---

### Problem 3: Vite HMR Overlay Error (`@layer base is used but no matching...`)
- **Root Cause**: Cached CSS directives or stale Node/Vite build cache.
- **Solution**:
  1. Clear Vite cache and reinstall:
     ```bash
     rm -rf node_modules/.vite
     npm run build
     ```
  2. Refresh your browser (`Cmd + R` or `F5`).

---

## 🖥️ User Interaction Guide: How the User Operates the Application

The interface is designed under a **Premium Minimalist Light** layout. Here is how an auditor or CISO interacts with the system from **Top-to-Bottom, Left-to-Right**:

### 1. Top Navigation Bar (Header)
- **Sector Threat Index (Top Center)**: Displays the live threat level computed from CISA’s Known Exploited Vulnerabilities (KEV) feed.
- **EU DORA / NIS2 Overlay (Button)**: Toggle to instantly reveal European DORA & NIS2 regulatory compliance articles for every control.
- **Topology Map (Button)**: Opens an interactive visual graph connecting `Live Threat ➔ NIST Outcome ➔ SP 800-53 Control ➔ Risk Scenario ➔ SHA-256 Evidence`.
- **CISO Board Report (Button)**: Generates a 1-click, print-ready executive summary for Board & CISO presentations.
- **Upload / Download (Icons)**:
  - **Upload (Import JSON)**: Instant batch import of any previously exported `ledger.json` dataset without manual entry.
  - **Download (Export JSON)**: 1-click JSON backup of all mapping decisions, hashes, and risks.

### 2. Live Threat Intelligence Panel (Top Section)
- Displays active exploited CVEs (Palo Alto, Citrix, Ivanti) correlated directly with affected control families.
- Click **"NVD"** to open official NIST NVD vulnerability details.
- Click **"Sync Feed"** to execute a live HTTP fetch against `cisa.gov`.

### 3. NIST CSF 2.0 & SP 800-53 Mapping Ledger (Main Grid)
- **Category & Description**: Reads the NIST outcome (`PR.AA-01`, `DE.AE-01`, etc.) and associated SP 800-53 & ISO 27001 badges.
- **Status Selector**: Choose `SUPPORTED`, `UNSUPPORTED`, `STALE (>180 Days)`, or `OUT OF SCOPE`.
- **`# Add Evidence` Button**: Opens the Evidence Hasher modal. Browse a local document (e.g. `ISO27001_Audit_Report.pdf`)—the browser computes its **SHA-256 hash 100% locally** using Web Crypto API.
- **`Risk Assessment` Button**: Opens the Risk Register drawer to set Likelihood, Impact, Risk Treatment (`Mitigate`, `Accept`, `Transfer`, `Avoid`), and target remediation dates.

---

## 📥 Batch Import & Automated Data Feeding (JSON Compatibility)

### Can the user feed data automatically without manual typing?
**YES!** 

1. Prepare or export a `csf_outcome_ledger_export.json` file.
2. Click the **Upload (Import JSON)** icon in the top right header.
3. Select your `.json` file.
4. **Result**: The entire dashboard instantly populates all control statuses, audit rationales, SHA-256 hashes, and risk contexts in 1 second!
