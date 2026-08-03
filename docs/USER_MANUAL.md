# CSF Outcome Ledger - Complete Step-by-Step User Manual

> **Beginner-Friendly Guide for Auditors, CISOs, IT Managers, and Security Practitioners**

Welcome to **CSF Outcome Ledger**. This manual provides a step-by-step walkthrough for evaluating your organization’s cybersecurity readiness using **NIST CSF 2.0, NIST SP 800-53 Rev. 5, and EU DORA/NIS2** standards—without needing complex enterprise software or uploading private files to the internet.

---

## 🏁 Step 1: Opening the Application

1. Open your web browser (Chrome, Edge, Safari, or Firefox).
2. Navigate to: **`http://localhost:5173`**
3. You will immediately see the **CSF Outcome Ledger** dashboard with a clean light design.

---

## 🗺️ Step 2: Understanding the Screen Layout

The dashboard is structured into 4 main sections from top to bottom:

1. **Top Bar (Header)**:
   - **Logo & Title**: Indicates the application version (`v1.0.0`).
   - **Sector Threat Index (Pill)**: Shows real-time threat levels based on live vulnerability feeds.
   - **EU DORA / NIS2 Overlay (Button)**: Click to reveal European regulatory requirements alongside NIST controls.
   - **Topology Map (Button)**: Opens a visual diagram showing how threat feeds, controls, and evidence connect.
   - **CISO Board Report (Button)**: Generates a 1-click printable summary for executive management.
   - **Upload / Download Icons**: For batch importing or saving your ledger progress as a JSON file.

2. **Live CISA Threat Feed (Top Panel)**:
   - Displays real-world active exploits (Palo Alto, Citrix, Ivanti) impacting global organizations.
   - Click **NVD** on any threat card to read full technical details on NIST’s vulnerability database.

3. **NIST Implementation Tier & Profile Progression (Middle Panel)**:
   - **Current Profile**: Calculates your current maturity tier (*Tier 1: Partial* up to *Tier 4: Adaptive*).
   - **Target Profile**: Shows your target goal (*Tier 3: Repeatable*).
   - **Gap Remediation Checklist**: Shows the exact list of missing controls required to reach the next tier.

4. **NIST CSF 2.0 Mapping Ledger (Main Grid)**:
   - Lists outcomes across **GOVERN, IDENTIFY, PROTECT, DETECT, RESPOND, RECOVER**.
   - Contains badges for **NIST SP 800-53**, **ISO 27001**, **DORA**, and **NIS2**.

---

## 📝 Step 3: Performing a Security Audit (Step-by-Step)

For every outcome in the Main Grid (e.g. `PROTECT.PR.AA-01` - Access Control & MFA):

### 3.1 Select Control Status
Click the status dropdown on the right side of the outcome card:
- **`✓ SUPPORTED`**: Select this if your organization has implemented the control and has evidence to back it up.
- **`✕ UNSUPPORTED`**: Select this if the control is missing or represents a gap.
- **`⏳ STALE (>180 Days)`**: Select this if the control was implemented in the past but hasn't been re-evaluated in 6 months.
- **`OUT OF SCOPE`**: Select this if the outcome does not apply to your environment.

### 3.2 Add Audit Evidence (SHA-256 Hasher)
1. Click the **`# Add Evidence`** button.
2. Click **Browse File** and select any supporting document on your computer (e.g. `MFA_Policy_2026.pdf`).
3. **Automatic Hashing**: The app automatically computes a unique **SHA-256 cryptographic hash** locally on your computer. *The file is NEVER uploaded to the internet.*
4. Type your name in **Reviewer / Auditor**.
5. Set an **Evidence Expiry Date**.
6. Type a brief 1-line rationale explaining why this document supports the control.
7. Click **Record Decision**.

### 3.3 Record Risk Context (For Gaps)
1. Click the **`Risk Assessment`** button next to any gap.
2. Describe the risk scenario (e.g. "Risk of unauthorized access due to missing MFA on legacy portal").
3. Select **Likelihood** (`Low`, `Medium`, `High`, `Critical`) and **Business Impact**.
4. Select **Risk Treatment Strategy**:
   - `MITIGATE`: Plan to fix it.
   - `ACCEPT`: Accept the risk temporarily.
   - `TRANSFER`: Use insurance or vendor contract.
   - `AVOID`: Disable the risky feature.
5. Set a **Target Remediation Date** and click **Save Risk Assessment**.

---

## 📊 Step 4: Generating Executive Reports & Saving Progress

### 4.1 Exporting the CISO Board Report
1. Click the **`CISO Board Report`** button in the top header.
2. A clean executive summary modal opens showing your overall threat index, compliance match percentage, Current vs. Target Profile metrics, and full control status matrix.
3. Click **Print / Export PDF** to print or save a PDF report for your Chief Information Security Officer (CISO) or Board of Directors!

### 4.2 Saving & Reloading Your Work (Data Import / Export)
- **Save Backup**: Click the **Download (Export JSON)** icon in the top header to save `csf_outcome_ledger_export.json` to your computer.
- **Reload Backup**: Click the **Upload (Import JSON)** icon, select your saved `.json` file, and all your decisions, SHA-256 hashes, and risk contexts will load instantly in 1 second!

---

## 💡 Quick Tips for Beginners

- **Zero Cloud Risk**: All your data stays 100% inside your web browser. You can safely use this tool offline.
- **Tier Progression**: As you add supported outcomes and SHA-256 evidence, watch your **Current Profile Tier** automatically upgrade from *Tier 1 Partial* to *Tier 3 Repeatable*!
