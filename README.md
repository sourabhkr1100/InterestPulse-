# ⚡ InterestPulse — Modern Simple Interest Calculator

A sleek, responsive, and interactive financial calculation suite built with modern Vanilla web technologies. InterestPulse allows users to compute simple interest, explore real-time balance projections, inspect mathematical formula steps, and compare rate scenarios with zero external dependencies.

---

## 🌟 Key Features

- **⚡ Real-Time Calculations:** Instantly computes total interest, maturity amount, and monthly/annual yield as you type or drag sliders.
- **🎛️ Dual-Control Inputs:** Bidirectional synchronization between numerical inputs and smooth range sliders.
- **📊 Interactive SVG Donut Chart:** Visual representation of Principal vs. Total Interest ratio with dynamic circumference calculations.
- **🏷️ Quick Presets & Chips:**
  - One-click additions (`+$5,000`, `+$25,000`, `+$50,000`, `+$100,000`).
  - Standard financial benchmarks (Savings 4.5%, FD 7.5%, Bonds 10%, Equity 12.5%).
- **⏱️ Flexible Time Horizons:** Toggle between **Years** (1–30 yrs) and **Months** (1–360 mos).
- **🌍 Multi-Currency Engine:** Seamlessly switch between USD (`$`), INR (`₹`), EUR (`€`), GBP (`£`), JPY (`¥`), CAD (`C$`), and AUD (`A$`).
- **📐 Mathematical Formula Explainer:** Step-by-step substitution display showing the exact math with live user values.
- **📈 Rate Sensitivity Matrix:** Dynamic side-by-side comparison table (-2%, -1%, Current, +1%, +2%).
- **📅 Period-by-Period Amortization Schedule:** Detailed breakdown of opening balance, interest earned, cumulative interest, and closing balance.
- **💾 Export & Utility Suite:**
  - **Copy Summary** with toast feedback.
  - **Export CSV** for Excel / Google Sheets.
  - **Print-friendly Report** layout (`@media print`).
- **🌓 Dark & Light Theme:** FinTech dark mode by default with glowing ambient elements and an executive clean light mode.

---

## 📐 Mathematical Formulation

### 1. Simple Interest ($I$)
$$I = \frac{P \times R \times T}{100}$$
Where:
- $P$ = Principal amount
- $R$ = Annual interest rate (%)
- $T$ = Duration in years ($T = \text{months} / 12$ when months selected)

### 2. Maturity Amount ($A$)
$$A = P + I$$

### 3. Rule of 72 (Doubling Time)
$$\text{Years to Double} \approx \frac{72}{R}$$

---

## 🛠️ Built With

- **HTML5:** Semantic architecture, accessible forms, ARIA attributes, and SEO meta tags.
- **CSS3 (Vanilla):** Custom CSS design tokens (Variables), backdrop-filter glassmorphism, responsive Grid/Flexbox, fluid typography, and `@media print` styling.
- **JavaScript (ES6+):** Pure Vanilla JS, state management, `requestAnimationFrame` animated number counters, SVG path calculations, and Clipboard/Blob APIs.

---

## 🚀 Getting Started

No installation, build tools, or packages required!

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sourabhkr1100/InterestPulse-.git
   ```

2. **Open the project:**
   Simply double-click `index.html` to open it in any web browser, or serve it locally:
   ```bash
   # Using Python
   python -m http.server 8000

   # Or using Node (npx)
   npx serve .
   ```

3. Visit `http://localhost:8000` in your browser.

---

## 📱 Responsive & Cross-Browser

Designed and tested to work seamlessly across:
- Google Chrome
- Mozilla Firefox
- Apple Safari
- Microsoft Edge
- Mobile and tablet browsers (iOS & Android)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
