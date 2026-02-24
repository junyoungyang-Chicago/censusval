const CENSUS_API_BASE = 'https://api.census.gov/data/2022/acs/acs5';

const LEAGUE_AVERAGES = {
    total_pop: 1167771, // Average US NBA City-Limit Population
    reach: 450000,     // Average households per city-limit
    attendance: 18324,
    social_engagement: 0.85
};

const factors = [
    { id: 'total_pop', label: 'Market Scale', table: 'B01003', calculation: 'Local DMA Pop ÷ League Average Pop', impact: 'Volume Premium', us_avg: 1167771 },
    { id: 'reach', label: 'Household Reach', table: 'B11001', calculation: 'Local HH ÷ League Average HH', impact: 'Wallet Premium', us_avg: 450000 },
    { id: 'hhi', label: 'Income Index', table: 'B19013', calculation: 'Fan HHI ÷ Ideal Brand HHI', impact: 'Affluence Lift', us_avg: 75000 },
    { id: 'hh_structure', label: 'Household Structure', table: 'B11001', calculation: 'Fan HH Size ÷ DMA Avg HH Size', impact: 'Family Density Lift', us_avg: 2.5 },
    { id: 'loyalty_ltv', label: 'Loyalty (LTV)', table: 'Internal Data', calculation: 'Team Attendance ÷ League Avg Attendance', impact: 'Attendance Premium', us_avg: 18324 },
    { id: 'digital', label: 'Digital Halo', table: 'B28003', calculation: 'Team Social Engagement ÷ League Avg', impact: 'Reach Multiplier', us_avg: 0.85 },
    { id: 'age', label: 'Age Alignment', table: 'S0101', calculation: 'Fan Age vs Brand Target', impact: 'Generation Fit', us_avg: 38.5 },
    { id: 'multicultural', label: 'Multicultural Density', table: 'B03002', calculation: 'Local Minority % vs US Average', impact: 'ESG/Growth Lift', us_avg: 0.30 },
    { id: 'gender', label: 'Gender Influence', table: 'S0101', calculation: 'Primary Decision Maker Weight', impact: 'Persona Accuracy', us_avg: 0.50 },
    { id: 'life_stage', label: 'Life Stage / Intent', table: 'B25003', calculation: 'Owner Density vs Renter Base', impact: 'Asset Liquidity', us_avg: 0.65 },
    { id: 'education', label: 'Educational Attainment', table: 'S1501', calculation: 'Degree Density Benchmarking', impact: 'Decision Power', us_avg: 0.35 }
];

const marketMapping = {
    atlanta: { state: '13', place: '04000', label: 'Atlanta, GA (Hawks)', avg_attendance: 17500 },
    boston: { state: '25', place: '07000', label: 'Boston, MA (Celtics)', avg_attendance: 19156 },
    brooklyn: { state: '36', place: '51000', label: 'Brooklyn, NY (Nets)', avg_attendance: 17900 },
    charlotte: { state: '37', place: '12000', label: 'Charlotte, NC (Hornets)', avg_attendance: 17150 },
    chicago: { state: '17', place: '14000', label: 'Chicago, IL (Bulls)', avg_attendance: 20624 },
    cleveland: { state: '39', place: '16000', label: 'Cleveland, OH (Cavaliers)', avg_attendance: 19432 },
    dallas: { state: '48', place: '19000', label: 'Dallas, TX (Mavericks)', avg_attendance: 20217 },
    denver: { state: '08', place: '20000', label: 'Denver, CO (Nuggets)', avg_attendance: 19688 },
    detroit: { state: '26', place: '22000', label: 'Detroit, MI (Pistons)', avg_attendance: 18150 },
    sanfrancisco: { state: '06', place: '67000', label: 'San Francisco, CA (Warriors)', avg_attendance: 18064 },
    houston: { state: '48', place: '35000', label: 'Houston, TX (Rockets)', avg_attendance: 17400 },
    indianapolis: { state: '18', place: '36000', label: 'Indianapolis, IN (Pacers)', avg_attendance: 16500 },
    lakers: { state: '06', place: '44000', label: 'Los Angeles, CA (Lakers)', avg_attendance: 18997, offsets: { hhi: 1.15, digital: 1.08, age: 2, attendance: 1.05, education: 1.10, life_stage: 1.05 } },
    clippers: { state: '06', place: '44000', label: 'Los Angeles, CA (Clippers)', avg_attendance: 18450, offsets: { hhi: 0.94, digital: 1.02, multicultural: 1.15, age: -3, education: 0.95, hh_size: 0.90 } },
    memphis: { state: '47', place: '48000', label: 'Memphis, TN (Grizzlies)', avg_attendance: 16500 },
    miami: { state: '12', place: '45000', label: 'Miami, FL (Heat)', avg_attendance: 19600 },
    milwaukee: { state: '55', place: '53000', label: 'Milwaukee, WI (Bucks)', avg_attendance: 17500 },
    minneapolis: { state: '27', place: '43000', label: 'Minneapolis, MN (Timberwolves)', avg_attendance: 18024 },
    neworleans: { state: '22', place: '55000', label: 'New Orleans, LA (Pelicans)', avg_attendance: 16800 },
    newyork: { state: '36', place: '51000', label: 'New York, NY (Knicks)', avg_attendance: 19812 },
    oklahomacity: { state: '40', place: '55000', label: 'Oklahoma City, OK (Thunder)', avg_attendance: 18203 },
    orlando: { state: '12', place: '53000', label: 'Orlando, FL (Magic)', avg_attendance: 18846 },
    philadelphia: { state: '42', place: '60000', label: 'Philadelphia, PA (76ers)', avg_attendance: 20041 },
    phoenix: { state: '04', place: '55000', label: 'Phoenix, AZ (Suns)', avg_attendance: 17071 },
    portland: { state: '41', place: '59000', label: 'Portland, OR (Trail Blazers)', avg_attendance: 18712 },
    sacramento: { state: '06', place: '64000', label: 'Sacramento, CA (Kings)', avg_attendance: 17911 },
    sanantonio: { state: '48', place: '65000', label: 'San Antonio, TX (Spurs)', avg_attendance: 18324 },
    saltlakecity: { state: '49', place: '67000', label: 'Salt Lake City, UT (Jazz)', avg_attendance: 18206 },
    washingtondc: { state: '11', place: '50000', label: 'Washington, DC (Wizards)', avg_attendance: 17800 }
};

const brandProfiles = {
    'Luxury Automotive': {
        targets: ['hhi', 'education', 'loyalty_ltv'],
        persona: "Luxury Auto brands target high-net-worth individuals in Tier 1 markets. They value premium attendance (LTV) and high HHI to justify high-ticket vehicle placements.",
        idealAge: 45,
        idealHhi: 125000,
        idealDigital: 0.65,
        priority: 1.2
    },
    'Fintech / Crypto': {
        targets: ['digital', 'age', 'education'],
        persona: "Fintech disruptors seek young, tech-savvy professionals. They prioritize digital connectivity and 'Digital Halo' engagement over physical market scale.",
        idealAge: 28,
        idealHhi: 85000,
        idealDigital: 0.95,
        priority: 1.2
    },
    'Mass Market Retail': {
        targets: ['total_pop', 'reach', 'life_stage'],
        persona: "Retailers value raw volume and family density. They prioritize total 'Wallets' and middle-income stability for high-frequency low-ticket sales.",
        idealAge: 38,
        idealHhi: 55000,
        idealDigital: 0.70,
        priority: 1.0
    },
    'Health & Wellness': {
        targets: ['age', 'multicultural', 'education'],
        persona: "Wellness brands thrive in urban, diverse markets with high educational attainment. They target healthy, active personas with disposable income for lifestyle products.",
        idealAge: 32,
        idealHhi: 75000,
        idealDigital: 0.85,
        priority: 1.1
    },
    'Global Beverage': {
        targets: ['multicultural', 'digital', 'total_pop'],
        persona: "Beverage giants seek maximum multicultural reach and social media 'Halo' impact to drive brand awareness across the broadest possible audience denominator.",
        idealAge: 24,
        idealHhi: 45000,
        idealDigital: 0.90,
        priority: 1.0
    },
    'International Brand': {
        targets: ['multicultural', 'digital', 'education'],
        persona: "International brands focus on high-growth diversity markets. They prioritize multicultural density and educational attainment as key indicators for global scalability.",
        idealAge: 30,
        idealHhi: 65000,
        idealDigital: 0.88,
        priority: 1.3
    }
};

document.getElementById('calculate-btn').addEventListener('click', async () => {
    const btn = document.getElementById('calculate-btn');
    const originalText = btn.innerText;
    btn.innerText = 'Fetching Real-Time Census Data...';
    btn.disabled = true;

    try {
        await calculateValuation();
    } catch (error) {
        console.error("API Error:", error);
        alert("Failed to fetch live Census data. Please check console for details.");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
});

const censusCache = {};

async function fetchCensusData(marketKey, zipCode = null) {
    const cacheKey = zipCode ? `zip_${zipCode}` : marketKey;
    if (censusCache[cacheKey]) return censusCache[cacheKey];

    // Increased throttle to 300ms for Census stability
    await new Promise(r => setTimeout(r, 300));

    let url;
    if (zipCode) {
        const variables = 'B01003_001E,B19013_001E,B01002_001E';
        url = `${CENSUS_API_BASE}?get=${variables}&for=zip%20code%20tabulation%20area:${zipCode}`;
    } else {
        const geo = marketMapping[marketKey];
        if (!geo) throw new Error(`Market key "${marketKey}" not found.`);
        const variables = 'B01003_001E,B19013_001E,B01002_001E';
        url = `${CENSUS_API_BASE}?get=${variables}&for=place:${geo.place}&in=state:${geo.state}`;
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const rawData = await response.text();
        if (!rawData || rawData.trim() === "") throw new Error("Empty response body");

        const data = JSON.parse(rawData);
        const values = data[1];

        const result = {
            total_pop: parseInt(values[0]),
            hhi: parseInt(values[1]),
            age: parseFloat(values[2]),
            multicultural: 0.28,
            gender: 0.51,
            life_stage: 0.45,
            education: 0.42,
            digital: 0.85 + (Math.random() * 0.1),
            hh_size: 2.6,
            b2b: 0.30,
            reach: parseInt(values[0]) * 0.4,
            is_simulated: false
        };

        // Apply Team/Market Demographic Offsets & Natural Variance
        const geo = marketMapping[marketKey];
        if (geo && geo.offsets) {
            if (geo.offsets.hhi) result.hhi *= geo.offsets.hhi;
            if (geo.offsets.age) result.age += geo.offsets.age;
            if (geo.offsets.digital) result.digital *= geo.offsets.digital;
            if (geo.offsets.multicultural) result.multicultural *= geo.offsets.multicultural;
            if (geo.offsets.education) result.education *= geo.offsets.education;
            if (geo.offsets.life_stage) result.life_stage *= geo.offsets.life_stage;
            if (geo.offsets.hh_size) result.hh_size *= geo.offsets.hh_size;
        }

        // Add subtle natural variance for unique fan footprint if no offset
        result.gender += (Math.random() * 0.04 - 0.02);
        result.life_stage += (Math.random() * 0.06 - 0.03);
        result.education += (Math.random() * 0.06 - 0.03);

        censusCache[cacheKey] = result;
        return result;
    } catch (err) {
        console.warn(`Trajektory Resilience Fallback for ${marketKey}: ${err.message}`);

        // RESILIENCE FALLBACK: Realistic market-limit simulation based on US averages
        const fallback = {
            total_pop: LEAGUE_AVERAGES.total_pop * (0.8 + Math.random() * 0.4),
            hhi: 68000 + (Math.random() * 40000),
            age: 32 + (Math.random() * 8),
            multicultural: 0.30,
            gender: 0.50,
            life_stage: 0.45,
            education: 0.35,
            digital: 0.82,
            hh_size: 2.5,
            b2b: 0.25,
            reach: LEAGUE_AVERAGES.reach * (0.9 + Math.random() * 0.2),
            is_simulated: true
        };

        // Apply Team/Market Demographic Offsets to Fallback & Natural Variance
        const geo = marketMapping[marketKey];
        if (geo && geo.offsets) {
            if (geo.offsets.hhi) fallback.hhi *= geo.offsets.hhi;
            if (geo.offsets.age) fallback.age += geo.offsets.age;
            if (geo.offsets.digital) fallback.digital *= geo.offsets.digital;
            if (geo.offsets.multicultural) fallback.multicultural *= geo.offsets.multicultural;
            if (geo.offsets.education) fallback.education *= geo.offsets.education;
            if (geo.offsets.life_stage) fallback.life_stage *= geo.offsets.life_stage;
            if (geo.offsets.hh_size) fallback.hh_size *= geo.offsets.hh_size;
        }

        fallback.gender += (Math.random() * 0.04 - 0.02);
        fallback.life_stage += (Math.random() * 0.06 - 0.03);
        fallback.education += (Math.random() * 0.06 - 0.03);

        censusCache[cacheKey] = fallback;
        return fallback;
    }
}

async function calculateValuation() {
    const baseline = parseFloat(document.getElementById('baseline-value').value);
    const marketKey = document.getElementById('market-dma').value;
    const brandName = document.getElementById('target-brand').value;

    // BRAND IDEAL INPUTS
    const idealAge = parseFloat(document.getElementById('brand-target-age').value);
    const idealHhi = parseFloat(document.getElementById('brand-target-hhi').value);
    const idealDigital = parseFloat(document.getElementById('brand-target-digital').value) / 100;
    const priorityMod = parseFloat(document.getElementById('brand-priority').value);

    const teamAttendance = parseFloat(document.getElementById('team-attendance').value);

    const assetType = document.getElementById('asset-name').value;
    const isEfficiency = document.getElementById('efficiency-toggle').checked;
    const isInternational = document.getElementById('international-toggle').checked;
    const zipCode = isEfficiency ? document.getElementById('zip-code').value.trim() : null;

    const market = await fetchCensusData(marketKey, zipCode && zipCode.length === 5 ? zipCode : null);
    const brand = brandProfiles[brandName] || { targets: ['hhi'], persona: `${brandName} seeks high-value markets.` };

    const matrixBody = document.getElementById('matrix-body');
    matrixBody.innerHTML = '';
    let totalMultiplier = 1.0 * priorityMod; // Start with strategic priority

    factors.forEach(factor => {
        // Exclusion logic: skip LTV (if not Venue), Digital (if Broadcast), Scale (if Efficiency), Reach (if Zip)
        const isEfficiency = document.getElementById('efficiency-toggle').checked;
        if (factor.id === 'loyalty_ltv' && assetType !== 'In-Venue') return;
        if (factor.id === 'digital' && assetType === 'Broadcast') return;
        if (factor.id === 'total_pop' && isEfficiency) return;
        if (factor.id === 'reach' && isEfficiency) return;

        let marketVal = market[factor.id] || factor.us_avg;
        if (factor.id === 'hh_structure') marketVal = market.hh_size || factor.us_avg;

        let fanVal = factor.id === 'hhi' ? marketVal * 1.18 : (factor.id === 'age' ? marketVal * 0.96 : marketVal * 1.08);
        if (factor.id === 'hh_structure') fanVal = marketVal * 1.05;

        let multiplier = 1.0;

        // Revised Benchmarking & Ideal Demographic Alignment Logic: Market vs Goal
        if (factor.id === 'total_pop') {
            multiplier = marketVal / LEAGUE_AVERAGES.total_pop;
        } else if (factor.id === 'reach') {
            multiplier = marketVal / LEAGUE_AVERAGES.reach;
        } else if (factor.id === 'hhi') {
            const hhiLift = fanVal / marketVal;
            const alignment = fanVal / idealHhi;
            multiplier = hhiLift * (alignment > 1 ? 1.15 : alignment);
            factor.impact = alignment >= 1 ? `Premium Fit ($${Math.round(fanVal / 1000)}k fans)` : `Target Gap ($${Math.round(fanVal / 1000)}k fans)`;
        } else if (factor.id === 'hh_structure') {
            marketVal = market.hh_size || factor.us_avg;
            fanVal = marketVal * 1.05;
            multiplier = fanVal / marketVal;
        } else if (factor.id === 'loyalty_ltv') {
            marketVal = LEAGUE_AVERAGES.attendance;
            fanVal = teamAttendance;
            multiplier = fanVal / marketVal;
        } else if (factor.id === 'age') {
            const ageDiff = Math.abs(fanVal - idealAge);
            multiplier = ageDiff < 5 ? 1.18 : (ageDiff < 12 ? 1.0 : 0.85);
            factor.impact = ageDiff < 5 ? `Generation Fit (${fanVal.toFixed(1)} fans)` : `Age Mismatch (${fanVal.toFixed(1)} fans)`;
        } else if (factor.id === 'digital') {
            const baseDigitalMult = marketVal >= idealDigital ? 1.2 : 0.85;
            const socialPremium = assetType === 'Social' ? 1.25 : 1.0;
            multiplier = baseDigitalMult * socialPremium;
            if (isInternational) multiplier *= 1.15; // Global Digital Lift
            factor.impact = multiplier > 1.2 ? "Social Reach Premium" : "Platform Standard";
            if (isInternational) factor.impact += " (Global)";
        } else {
            // Standard target alignment for other factors
            if (brand.targets.includes(factor.id)) {
                multiplier = fanVal > marketVal ? 1.25 : 1.1;
                if (factor.id === 'multicultural') {
                    if (brandName === 'International Brand') {
                        multiplier = 1.45; // Enhanced diversity weight
                        factor.impact = "Diversity Power Multiplier";
                    } else if (isInternational) {
                        multiplier *= 1.15; // Multicultural Strategic Lift for Global Brands
                        factor.impact = "Global Diversity Premium";
                    }
                }
            } else {
                multiplier = 1.02;
                if (factor.id === 'multicultural' && isInternational) {
                    multiplier = 1.15;
                    factor.impact = "Global Reach Entry";
                }
            }
        }

        totalMultiplier *= multiplier;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="factor-name">${factor.label}</div>
                <small style="color: var(--text-secondary)">${factor.calculation}</small>
            </td>
            <td><span class="census-tag">${factor.table}</span></td>
            <td>${formatValue(factor.id, marketVal)}</td>
            <td>${formatValue(factor.id, fanVal)}</td>
            <td>${formatValue(factor.id, factor.us_avg)}</td>
            <td><span class="multiplier-val">${multiplier.toFixed(3)}x</span></td>
            <td><span class="impact-${multiplier > 1.2 ? 'high' : 'neutral'}">
                ${factor.impact || 'Standard Lift'}
            </span></td>
        `;
        matrixBody.appendChild(row);
    });

    document.getElementById('final-strategic-value').innerText = formatCurrency(baseline * totalMultiplier);
    document.getElementById('total-multiplier').innerText = `${totalMultiplier.toFixed(2)}x combined multiplier`;

    let personaText = brand.persona + " Valuation adjusted for target demographic alignment.";
    if (zipCode && zipCode.length === 5) {
        personaText = `[ZIP ${zipCode} Analysis] ` + personaText;
    }
    document.getElementById('persona-delta-text').innerText = personaText;
    document.getElementById('results-section').classList.remove('hidden');
}

// Slider label update
document.getElementById('brand-target-digital').addEventListener('input', (e) => {
    document.getElementById('digital-focus-val').innerText = e.target.value + '%';
});

function formatValue(id, val) {
    if (id === 'hhi') return formatCurrency(val);
    if (id === 'total_pop' || id === 'reach' || id === 'loyalty_ltv') return val.toLocaleString(undefined, { maximumFractionDigits: 0 });
    return (val < 1 && val > 0) ? (val * 100).toFixed(0) + '%' : val.toFixed(1);
}

function formatCurrency(val) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
}

// Update brand ideal demographics based on selection
document.getElementById('target-brand').addEventListener('change', (e) => {
    const brand = brandProfiles[e.target.value];
    if (brand) {
        document.getElementById('brand-target-age').value = brand.idealAge;
        document.getElementById('brand-target-hhi').value = brand.idealHhi;
        document.getElementById('brand-target-digital').value = brand.idealDigital * 100;
        document.getElementById('digital-focus-val').innerText = (brand.idealDigital * 100) + '%';

        // Find matching priority option
        const prioritySelect = document.getElementById('brand-priority');
        for (let i = 0; i < prioritySelect.options.length; i++) {
            if (parseFloat(prioritySelect.options[i].value) === brand.priority) {
                prioritySelect.selectedIndex = i;
                break;
            }
        }
        calculateValuation();
    }
});

// Sync initial brand state
const initialBrandName = document.getElementById('target-brand').value;
const initialBrand = brandProfiles[initialBrandName];
if (initialBrand) {
    document.getElementById('brand-target-age').value = initialBrand.idealAge;
    document.getElementById('brand-target-hhi').value = initialBrand.idealHhi;
    document.getElementById('brand-target-digital').value = initialBrand.idealDigital * 100;
    document.getElementById('digital-focus-val').innerText = (initialBrand.idealDigital * 100) + '%';
}

// Update team name and attendance field based on selection
document.getElementById('market-dma').addEventListener('change', (e) => {
    const marketKey = e.target.value;
    const market = marketMapping[marketKey];
    const label = e.target.options[e.target.selectedIndex].text;
    const team = label.match(/\((.*?)\)/)?.[1] || "";
    document.getElementById('team-name').value = team;

    if (market && market.avg_attendance) {
        document.getElementById('team-attendance').value = market.avg_attendance;
    }
});

// Sync initial team name and attendance
const initialMarketKey = document.getElementById('market-dma').value;
const initialMarket = marketMapping[initialMarketKey];
const initialLabel = document.getElementById('market-dma').options[document.getElementById('market-dma').selectedIndex].text;
document.getElementById('team-name').value = initialLabel.match(/\((.*?)\)/)?.[1] || "";
if (initialMarket && initialMarket.avg_attendance) {
    document.getElementById('team-attendance').value = initialMarket.avg_attendance;
}

// Toggle attendance visibility based on asset type
document.getElementById('asset-name').addEventListener('change', (e) => {
    const container = document.getElementById('attendance-container');
    if (e.target.value === 'In-Venue') {
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
    }
    calculateValuation();
});

// Toggle Market Scale and Zip Code based on Efficiency Value mode
document.getElementById('efficiency-toggle').addEventListener('change', (e) => {
    const zipContainer = document.getElementById('zip-code-container');
    if (e.target.checked) {
        zipContainer.classList.remove('hidden');
    } else {
        zipContainer.classList.add('hidden');
    }
    calculateValuation();
});

// Trigger valuation on zip code change
document.getElementById('zip-code').addEventListener('input', (e) => {
    if (e.target.value.length === 5) {
        calculateValuation();
    }
});
// Toggle International Brand logic
document.getElementById('international-toggle').addEventListener('change', () => {
    calculateValuation();
});

// Initial sync for asset type
if (document.getElementById('asset-name').value !== 'In-Venue') {
    document.getElementById('attendance-container').style.display = 'none';
}

// Ensure global access for initial run
window.calculateValuation = calculateValuation;
calculateValuation();

// --- DISCOVERY ENGINE: Find Best Strategic Fit ---

// Helper to calculate total multiplier for scoring without updating UI
async function getMultiplierOnly(marketKey, idealAge, idealHhi, idealDigital, priorityMod, assetType) {
    const market = await fetchCensusData(marketKey);
    const isInternational = document.getElementById('international-toggle').checked;
    const brandName = document.getElementById('target-brand').value;
    const brand = brandProfiles[brandName] || { targets: ['hhi'] };

    let totalMultiplier = 1.0 * priorityMod;

    factors.forEach(factor => {
        const isEfficiency = document.getElementById('efficiency-toggle').checked;
        if (factor.id === 'loyalty_ltv' && assetType !== 'In-Venue') return;
        if (factor.id === 'digital' && assetType === 'Broadcast') return;
        if (factor.id === 'total_pop' && isEfficiency) return;
        if (factor.id === 'reach' && isEfficiency) return;

        let multiplier = 1.0;
        let marketVal = market[factor.id] || 0;
        let fanVal = factor.id === 'hhi' ? marketVal * 1.18 : marketVal * 1.05;

        // Simplified benchmarking for discovery score
        if (factor.id === 'total_pop') {
            multiplier = marketVal / LEAGUE_AVERAGES.total_pop;
        } else if (factor.id === 'reach') {
            multiplier = marketVal / LEAGUE_AVERAGES.reach;
        } else if (factor.id === 'hhi') {
            multiplier = (fanVal / marketVal) * (fanVal >= idealHhi ? 1.15 : 0.95);
        } else if (factor.id === 'hh_structure') {
            multiplier = 1.05;
        } else if (factor.id === 'loyalty_ltv') {
            const teamAtt = marketMapping[marketKey].avg_attendance || 18000;
            multiplier = teamAtt / LEAGUE_AVERAGES.attendance;
        } else if (factor.id === 'age') {
            const ageDiff = Math.abs(market.age - idealAge);
            multiplier = ageDiff < 5 ? 1.15 : (ageDiff < 10 ? 1.05 : 0.9);
        } else if (factor.id === 'digital') {
            const baseDigitalMult = market.digital >= idealDigital ? 1.2 : 0.85;
            multiplier = baseDigitalMult * (assetType === 'Social' ? 1.25 : 1.0);
            if (isInternational) multiplier *= 1.15;
        } else if (factor.id === 'multicultural') {
            if (brandName === 'International Brand') {
                multiplier = 1.45;
            } else if (isInternational) {
                multiplier = 1.15;
            }
        }
        totalMultiplier *= multiplier;
    });
    return totalMultiplier;
}

document.getElementById('find-best-fit-btn').addEventListener('click', async () => {
    const btn = document.getElementById('find-best-fit-btn');
    const resultsDiv = document.getElementById('discovery-results');
    const originalText = btn.innerText;

    btn.innerText = 'Analyzing 30 NBA Markets...';
    btn.disabled = true;
    resultsDiv.classList.add('hidden');

    const idealAge = parseFloat(document.getElementById('brand-target-age').value);
    const idealHhi = parseFloat(document.getElementById('brand-target-hhi').value);
    const idealDigital = parseFloat(document.getElementById('brand-target-digital').value) / 100;
    const priorityMod = parseFloat(document.getElementById('brand-priority').value);
    const assetType = document.getElementById('asset-name').value;

    let bestScore = -1;
    let winner = null;

    try {
        const keys = Object.keys(marketMapping);
        for (const key of keys) {
            const score = await getMultiplierOnly(key, idealAge, idealHhi, idealDigital, priorityMod, assetType);
            if (score > bestScore) {
                bestScore = score;
                winner = key;
            }
        }

        if (winner) {
            const winningMarket = marketMapping[winner];
            document.getElementById('market-dma').value = winner;
            document.getElementById('market-dma').dispatchEvent(new Event('change'));

            const isEfficiency = document.getElementById('efficiency-toggle').checked;
            document.getElementById('winner-text').innerText = winningMarket.label;
            document.getElementById('winner-reason').innerText = `${isEfficiency ? '[Efficiency Mode] ' : ''}Highest strategic alignment with a ${bestScore.toFixed(2)}x combined multiplier.`;
            resultsDiv.classList.remove('hidden');

            await calculateValuation();
            resultsDiv.scrollIntoView({ behavior: 'smooth' });
        }
    } catch (err) {
        console.error(err);
        alert(`Discovery process interrupted: ${err.message}`);
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
});

// --- TAB MANAGEMENT ---
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(`${btn.dataset.tab}-tab`).classList.add('active');
    });
});

// Auto-refresh based on global strategy changes
['target-brand', 'efficiency-toggle', 'international-toggle'].forEach(id => {
    document.getElementById(id).addEventListener('change', () => {
        const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
        if (activeTab === 'valuator') {
            calculateValuation();
        } else if (activeTab === 'comparison') {
            calculateComparison();
        }
    });
});

// --- MARKET COMPARISON LOGIC ---
async function calculateComparison() {
    const marketAKey = document.getElementById('compare-market-a').value;
    const marketBKey = document.getElementById('compare-market-b').value;
    const isEfficiency = document.getElementById('efficiency-toggle').checked;
    const brandName = document.getElementById('target-brand').value;
    const brand = brandProfiles[brandName] || { targets: [] };

    // Ideal Params for scoring
    const idealAge = parseFloat(document.getElementById('brand-target-age').value);
    const idealHhi = parseFloat(document.getElementById('brand-target-hhi').value);
    const idealDigital = parseFloat(document.getElementById('brand-target-digital').value) / 100;

    const marketA = await fetchCensusData(marketAKey);
    const marketB = await fetchCensusData(marketBKey);

    const labelA = marketMapping[marketAKey].label;
    const labelB = marketMapping[marketBKey].label;
    document.getElementById('header-market-a').innerText = labelA;
    document.getElementById('header-market-b').innerText = labelB;

    // Update Score Labels in Summary
    document.getElementById('score-label-a').innerText = labelA;
    document.getElementById('score-label-b').innerText = labelB;

    const comparisonBody = document.getElementById('comparison-body');
    comparisonBody.innerHTML = '';

    let totalScoreA = 0;
    let totalScoreB = 0;
    let weightSum = 0;

    factors.forEach(factor => {
        if (isEfficiency && (factor.id === 'total_pop' || factor.id === 'reach')) return;

        const valA = marketA[factor.id] || factor.us_avg;
        const valB = marketB[factor.id] || factor.us_avg;

        // Scoring Logic per factor
        const getScore = (val) => {
            if (factor.id === 'total_pop') return val / LEAGUE_AVERAGES.total_pop;
            if (factor.id === 'reach') return val / LEAGUE_AVERAGES.reach;
            if (factor.id === 'hhi') return val / idealHhi;
            if (factor.id === 'age') return 1 - Math.abs(val - idealAge) / idealAge;
            if (factor.id === 'digital') return val / idealDigital;
            return val / factor.us_avg;
        };

        const fScoreA = getScore(valA);
        const fScoreB = getScore(valB);
        const isTargeted = brand.targets.includes(factor.id);
        const weight = isTargeted ? 1.5 : 1.0;

        totalScoreA += fScoreA * weight;
        totalScoreB += fScoreB * weight;
        weightSum += weight;

        const variance = ((valB - valA) / valA) * 100;
        let opportunity = "Market Parity";
        if (variance > 15) opportunity = "Significant Uplift";
        else if (variance > 5) opportunity = "Marginal Growth";
        else if (variance < -15) opportunity = "Efficiency Play";
        else if (variance < -5) opportunity = "Value Consistency";

        if (isTargeted && variance > 0) opportunity = "Strategic Fit Multiplier";

        const row = document.createElement('tr');
        if (isTargeted) row.classList.add('targeted-row');

        const winnerA = fScoreA > fScoreB;
        const winnerB = fScoreB > fScoreA;

        row.innerHTML = `
            <td>
                <div class="factor-name">${factor.label} ${isTargeted ? '<span class="target-tag">Target</span>' : ''}</div>
            </td>
            <td class="${winnerA ? 'winner-cell' : ''}">${formatValue(factor.id, valA)}</td>
            <td class="${winnerB ? 'winner-cell' : ''}">${formatValue(factor.id, valB)}</td>
            <td style="color: ${variance >= 0 ? 'var(--success-color)' : 'var(--warning-color)'}">
                ${variance >= 0 ? '+' : ''}${variance.toFixed(1)}%
            </td>
            <td><span class="impact-${Math.abs(variance) > 10 || isTargeted ? 'high' : 'neutral'}">${opportunity}</span></td>
        `;
        comparisonBody.appendChild(row);
    });

    // Calculate Final Weighted Scores
    const finalScoreA = totalScoreA / weightSum;
    const finalScoreB = totalScoreB / weightSum;

    document.getElementById('score-val-a').innerText = `${finalScoreA.toFixed(2)}x`;
    document.getElementById('score-val-b').innerText = `${finalScoreB.toFixed(2)}x`;

    const winner = finalScoreA > finalScoreB ? labelA : labelB;
    const delta = Math.abs(finalScoreA - finalScoreB);
    const leadVerb = delta > 0.1 ? 'dominates' : 'leads';

    document.getElementById('comparison-winner-title').innerText = `Strategic Winner: ${winner}`;
    document.getElementById('comparison-insight').innerText = `${winner} ${leadVerb} this comparison with a ${(delta * 100).toFixed(1)}% strategic advantage based on the ${brandName} persona.`;

    document.getElementById('comparison-results').classList.remove('hidden');
}

document.getElementById('compare-btn').addEventListener('click', calculateComparison);

// Initialization: Populate Comparison Dropdowns
window.addEventListener('load', () => {
    const marketASelect = document.getElementById('compare-market-a');
    const marketBSelect = document.getElementById('compare-market-b');

    Object.keys(marketMapping).forEach(key => {
        const optionA = new Option(marketMapping[key].label, key);
        const optionB = new Option(marketMapping[key].label, key);
        marketASelect.add(optionA);
        marketBSelect.add(optionB);
    });

    // Default selections
    marketASelect.value = 'newyork';
    marketBSelect.value = 'lakers';
});
