# SahakarSeva (साथोग सेवा) 🏛️

**Cooperative Gig Services Platform for Household & Community Services**  
*Smart India Hackathon 2026 — Problem Statement ID: 26089*  
*Theme: Agriculture, FoodTech & Rural Development*  
*Team: Team Karmanya*

---

## 📌 About The Project

**SahakarSeva** connects India's verified cooperative labor workforce directly to household service consumers — eliminating the 20–30% extractive aggregator cut (e.g., Urban Company, Snabbit, Pronto) in favor of a zero/near-zero commission model governed by state labor cooperative federations.

Extending the proven cooperative model validated by the **Ministry of Cooperation** (under *Bharat Taxi*), SahakarSeva ensures:
1. **Cooperative-Owned**: Federations govern verification, wage floors, and worker audits.
2. **Fair Wage Engine**: 100% direct payouts with automated contribution to worker welfare & insurance funds.
3. **Geo-Matched Booking**: Real-time matching of households to nearby verified craftspeople.
4. **AI Workforce Planning**: Demand forecasting to allocate shifts and balance union capacity.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Modern Flexbox/Grid Design System), JavaScript (ES6+)
- **Server**: Node.js HTTP Server (`server.js`)
- **Branding**: Official Teal Palette (`#028090`) & Cooperative Crest Logo
- **Architecture**: Multi-Role Dynamic Authentication (Customer, Worker, Federation Admin)

---

## 📂 Project Structure

```
code/
├── index.html               # Landing page & public service offerings
├── booking.html             # Service browsing, filter sidebar & worker cards
├── login.html               # Multi-role login (Customer, Worker, Federation Admin)
├── admin.html               # Federation Board Control Panel & AI demand chart
├── worker-dashboard.html    # Cooperative Worker Dashboard & job queue
├── server.js                # Local development server (Node.js)
├── css/
│   └── style.css            # Unified design system & responsive styling
├── js/
│   ├── auth.js              # Client-side session management & role guarding
│   └── script.js            # Dynamic category filtering, slider & queue actions
└── assets/
    └── images/              # Photorealistic AI-generated craft photos & logo
        ├── logo.png
        ├── electrician.jpg
        ├── plumber.jpg
        ├── carpenter.jpg
        ├── domestic_help.jpg
        ├── caregiver.jpg
        └── painter.jpg
```

---

## 🚀 Running Locally

1. Clone or navigate to the repository folder:
   ```bash
   cd code
   ```
2. Start the local server:
   ```bash
   node server.js
   ```
3. Open your browser at:
   ```text
   http://localhost:3000/
   ```

---

## 👥 Roles Supported

- **Customer**: Browse services, filter verified craftspeople, schedule jobs.
- **Worker**: Toggle on/off duty status, view instant payouts, track welfare/insurance.
- **Federation Admin**: Review worker audit queue, monitor demand surges, analyze regional metrics.

---

*Governed under the cooperative principles of "एक सब के लिए, सब एक के लिए" (One for all, all for one).*
