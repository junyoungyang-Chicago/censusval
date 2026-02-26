# Trajektory Sponsorship Valuator: NBA Market Intelligence

A premium, strategic market intelligence platform designed for NBA sponsorships. This tool utilizes real-time US Census ACS (American Community Survey) data to benchmark NBA markets, analyze brand persona alignment, and calculate strategic valuation multipliers.

## 🚀 Core Features

### 1. Strategic Valuator (3-Column Input)
- **Asset Baseline**: Define the core value of the sponsorship asset.
- **Brand Persona Focus**: Select from preset brand personas (e.g., Luxury Auto, Fintech, Mass Market) or customize target demographics.
- **NBA Market Context**: Benchmarking local market data against NBA league averages and brand-specific "Ideal State" targets.

### 2. AI Discovery Engine
- One-click analysis of all 30 NBA markets.
- Identifies the "Best Strategic Fit" based on the weighted priority of the selected brand persona.
- Accounts for geographic scale, digital engagement, and demographic alignment.

### 3. Market Comparison (Delta Analysis)
- Side-by-side comparison of any two NBA markets.
- **Strategic Winner Logic**: Calculates a weighted "Strategic Fit Score" for both markets.
- **Factor Mini-Badges**: Visual winner marks (★) highlight which market leads for specific demographic factors.
- **LA Team Differentiation**: Advanced logic that separates **LA Lakers** and **LA Clippers** by applying custom "fan footprint" offsets, despite sharing the same geographic location.

---

## 📊 Demographic Factors Explained

The valuation engine uses 10 core factors to determine the "Strategic Multiplier." Each factor is benchmarked against either a league average or a specific brand target.

### 1. Household Reach
- **Source**: US Census B11001
- **Description**: Total number of households in the market.
- **Strategic Value**: Estimates the "Wallet Density" of a market. Critical for subscription-based or utility-focused sponsors.

### 2. Strategic Affluence Index
- **Source**: US Census B19013 & B19001
- **Description**: A composite score (70/30 weight) combining Median Household Income and the concentration of $200k+ earners.
- **Strategic Value**: Provides a high-fidelity look at market wealth. Benchmarked against **NBA Market Averages** (e.g., 5.5% for $200k+ HHs) rather than national averages for higher precision.

### 3. Household Structure
- **Source**: US Census B11001
- **Description**: Average household size and composition.
- **Strategic Value**: Used to identify "Family Density." Sponsors like insurance or family-oriented CPG brands value high household structures.

### 4. Loyalty (LTV)
- **Source**: NBA Attendance Records
- **Description**: Benchmarks team-specific attendance against the league average (18,324).
- **Strategic Value**: Represents physical engagement and "In-Venue" asset value. Higher attendance indicates a more committed, high-value fan base.

### 5. Digital Halo
- **Source**: US Census B28003 & Social Engagement
- **Description**: A composite score of high-speed internet adoption and team-specific social media engagement.
- **Strategic Value**: Critical for **Fintech/Crypto** sponsors. A high Digital Halo allows for reach beyond the local geographic market.

### 6. Age Alignment
- **Source**: US Census S0101
- **Description**: Median age of the fan base vs. the brand's target demographic.
- **Strategic Value**: Calculates a "Generation Fit." A market with a median age of 28 is a stronger fit for a Fintech brand than a 45-year-old market.

### 7. Multicultural Density
- **Source**: US Census B03002
- **Description**: Concentration of minority populations compared to US averages.
- **Strategic Value**: Identifies growth opportunities and ESG/Diversity alignment. High-growth sectors and international brands prioritize this for "ESG/Growth Lift."

### 8. Gender Influence
- **Source**: US Census S0101
- **Description**: Weighting of primary decision-makers within the fan base.
- **Strategic Value**: Refines persona accuracy for brands targeting specific decision-maker profiles.

### 9. Life Stage / Intent
- **Source**: US Census B25003
- **Description**: Home ownership density vs. renter base.
- **Strategic Value**: Acts as a proxy for "Asset Liquidity." High ownership density indicates stability; high renter density indicates an upwardly mobile, urban professional base.

### 10. Educational Attainment
- **Source**: US Census S1501
- **Description**: Percentage of the market with a bachelor’s degree or higher.
- **Strategic Value**: Indicates "Decision Power" and disposable income potential. Luxury and professional services brands seek high educational alignment.

---

## 🛠 Technology Stack
- **Frontend**: Vanilla HTML5, CSS3 (Custom Glass-morphism UI), JavaScript (ES6+).
- **Data Integration**: US Census Bureau ACS5 API Integration.
- **Caching**: Local intelligent caching for API resilience.

## ⚙️ How to Run Locally
1. Clone the repository.
2. Navigate to the directory: `cd Censusmatch`.
3. Start a local server: `python3 -m http.server 8000`.
4. Open your browser to `http://localhost:8000`.

---
*Created for the Trajektory Strategic Intelligence Team.*
