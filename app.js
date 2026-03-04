const CENSUS_API_BASE = 'https://api.census.gov/data/2022/acs/acs5';
const GEMINI_API_KEY = "AIzaSyAzZU-TB1JJBwFSQVWSzccWtp6xPB4Ua1E";

const LEAGUE_AVERAGES = {
    total_pop: 1167771, // Average US NBA City-Limit Population
    reach: 450000,     // Average households per city-limit
    attendance: 18324,
    social_engagement: 0.85
};

const factors = [
    { id: 'reach', label: 'Household Reach', table: 'B11001', calculation: 'Local HH ÷ League Average HH', impact: 'Wallet Premium', us_avg: 450000 },
    { id: 'strategic_affluence', label: 'Strategic Affluence Index', table: 'B19013/B19001', calculation: '80% HHI Lift + 10% Luxury Conc.', impact: 'Affluence Precision', us_avg: 1.0 },
    { id: 'strategic_life_stage', label: 'Strategic Life Stage Index', table: 'S0101/B25003', calculation: 'Age Alignment + Home/Intent Lift', impact: 'Household Stability', us_avg: 1.0 },
    { id: 'hh_structure', label: 'Household Structure', table: 'B11001', calculation: 'Fan HH Size ÷ DMA Avg HH Size', impact: 'Family Density Lift', us_avg: 2.5 },
    { id: 'loyalty_ltv', label: 'Loyalty (LTV)', table: 'Internal Data', calculation: 'Team Attendance ÷ League Avg Attendance', impact: 'Attendance Premium', us_avg: 18324 },
    { id: 'digital', label: 'Digital Halo', table: 'B28003', calculation: 'Team Social Engagement ÷ League Avg', impact: 'Reach Multiplier', us_avg: 0.85 },
    { id: 'multicultural', label: 'Multicultural Density', table: 'B03002', calculation: 'Local Minority % vs US Average', impact: 'ESG/Growth Lift', us_avg: 0.45 },
    { id: 'gender', label: 'Gender Influence', table: 'S0101', calculation: 'Primary Decision Maker Weight', impact: 'Persona Accuracy', us_avg: 0.50 },
    { id: 'education', label: 'Educational Attainment', table: 'S1501', calculation: 'Degree Density Benchmarking', impact: 'Decision Power', us_avg: 0.35 }
];

const marketMapping = {
    atlanta: { state: '13', place: '04000', label: 'Atlanta, GA (Hawks)', avg_attendance: 17500, color: '#E03A3E', textColor: 'white', lat: 33.7490, lng: -84.3880 },
    boston: { state: '25', place: '07000', label: 'Boston, MA (Celtics)', avg_attendance: 19156, color: '#007A33', textColor: 'white', lat: 42.3601, lng: -71.0589 },
    brooklyn: { state: '36', county: '047', label: 'Brooklyn, NY (Nets)', avg_attendance: 17900, color: '#000000', textColor: 'white', lat: 40.6782, lng: -73.9442 },
    charlotte: { state: '37', place: '12000', label: 'Charlotte, NC (Hornets)', avg_attendance: 17150, color: '#1D1160', textColor: 'white', lat: 35.2271, lng: -80.8431 },
    chicago: { state: '17', place: '14000', label: 'Chicago, IL (Bulls)', avg_attendance: 20624, color: '#CE1141', textColor: 'white', lat: 41.8781, lng: -87.6298 },
    cleveland: { state: '39', place: '16000', label: 'Cleveland, OH (Cavaliers)', avg_attendance: 19432, color: '#860038', textColor: 'white', lat: 41.4993, lng: -81.6944 },
    dallas: { state: '48', place: '19000', label: 'Dallas, TX (Mavericks)', avg_attendance: 20217, color: '#00538C', textColor: 'white', lat: 32.7767, lng: -96.7970 },
    denver: { state: '08', place: '20000', label: 'Denver, CO (Nuggets)', avg_attendance: 19688, color: '#0E2240', textColor: 'white', lat: 39.7392, lng: -104.9903 },
    detroit: { state: '26', place: '22000', label: 'Detroit, MI (Pistons)', avg_attendance: 18150, color: '#C8102E', textColor: 'white', lat: 42.3314, lng: -83.0458 },
    sanfrancisco: { state: '06', place: '67000', label: 'San Francisco, CA (Warriors)', avg_attendance: 18064, color: '#1D428A', textColor: 'white', lat: 37.7749, lng: -122.4194 },
    houston: { state: '48', place: '35000', label: 'Houston, TX (Rockets)', avg_attendance: 17400, color: '#CE1141', textColor: 'white', lat: 29.7604, lng: -95.3698 },
    indianapolis: { state: '18', place: '36000', label: 'Indianapolis, IN (Pacers)', avg_attendance: 16500, color: '#002D62', textColor: 'white', lat: 39.7684, lng: -86.1581 },
    lakers: { state: '06', place: '44000', label: 'Los Angeles, CA (Lakers)', avg_attendance: 18997, color: '#552583', textColor: 'white', lat: 34.0522, lng: -118.2437 },
    clippers: { state: '06', place: '44000', label: 'Los Angeles, CA (Clippers)', avg_attendance: 18450, color: '#C8102E', textColor: 'white', lat: 34.0522, lng: -118.2437 },
    memphis: { state: '47', place: '48000', label: 'Memphis, TN (Grizzlies)', avg_attendance: 16500, color: '#5D76A9', textColor: 'white', lat: 35.1495, lng: -90.0490 },
    miami: { state: '12', place: '45000', label: 'Miami, FL (Heat)', avg_attendance: 19600, color: '#98002E', textColor: 'white', lat: 25.7617, lng: -80.1918 },
    milwaukee: { state: '55', place: '53000', label: 'Milwaukee, WI (Bucks)', avg_attendance: 17500, color: '#00471B', textColor: 'white', lat: 43.0389, lng: -87.9065 },
    minneapolis: { state: '27', place: '43000', label: 'Minneapolis, MN (Timberwolves)', avg_attendance: 18024, color: '#0C2340', textColor: 'white', lat: 44.9778, lng: -93.2650 },
    neworleans: { state: '22', place: '55000', label: 'New Orleans, LA (Pelicans)', avg_attendance: 16800, color: '#0C2340', textColor: 'white', lat: 29.9511, lng: -90.0715 },
    newyork: { state: '36', county: '061', label: 'New York, NY (Knicks)', avg_attendance: 19812, color: '#006BB6', textColor: 'white', lat: 40.7128, lng: -74.0060 },
    oklahomacity: { state: '40', place: '55000', label: 'Oklahoma City, OK (Thunder)', avg_attendance: 18203, color: '#007AC1', textColor: 'white', lat: 35.4676, lng: -97.5164 },
    orlando: { state: '12', place: '53000', label: 'Orlando, FL (Magic)', avg_attendance: 18846, color: '#0077C0', textColor: 'white', lat: 28.5383, lng: -81.3792 },
    philadelphia: { state: '42', place: '60000', label: 'Philadelphia, PA (76ers)', avg_attendance: 20041, color: '#006BB6', textColor: 'white', lat: 39.9526, lng: -75.1652 },
    phoenix: { state: '04', place: '55000', label: 'Phoenix, AZ (Suns)', avg_attendance: 17071, color: '#1D1160', textColor: 'white', lat: 33.4484, lng: -112.0740 },
    portland: { state: '41', place: '59000', label: 'Portland, OR (Trail Blazers)', avg_attendance: 18712, color: '#E03A3E', textColor: 'white', lat: 45.5152, lng: -122.6784 },
    sacramento: { state: '06', place: '64000', label: 'Sacramento, CA (Kings)', avg_attendance: 17911, color: '#5A2D81', textColor: 'white', lat: 38.5816, lng: -121.4944 },
    sanantonio: { state: '48', place: '65000', label: 'San Antonio, TX (Spurs)', avg_attendance: 18324, color: '#C4CED4', textColor: 'black', lat: 29.4241, lng: -98.4936 },
    saltlakecity: { state: '49', place: '67000', label: 'Salt Lake City, UT (Jazz)', avg_attendance: 18206, color: '#002B5C', textColor: 'white', lat: 40.7608, lng: -111.8910 },
    washingtondc: { state: '11', place: '50000', label: 'Washington, DC (Wizards)', avg_attendance: 17800, color: '#002B5C', textColor: 'white', lat: 38.9072, lng: -77.0369 },
    toronto: { isCanada: true, label: 'Toronto, ON (Raptors)', avg_attendance: 19777, color: '#CE1141', textColor: 'white', lat: 43.6532, lng: -79.3832 },
    austin: { state: '48', place: '05000', label: 'Austin, TX', avg_attendance: 15000, color: '#BF5700', textColor: 'white', lat: 30.2672, lng: -97.7431 },
    lasvegas: { state: '32', place: '40000', label: 'Las Vegas, NV', avg_attendance: 18000, color: '#B29759', textColor: 'black', lat: 36.1699, lng: -115.1398 },
    losangeles: { state: '06', place: '44000', label: 'Los Angeles, CA', avg_attendance: 18723, color: '#552583', textColor: 'white', lat: 34.0522, lng: -118.2437 },

    // NFL
    nfl_cardinals: { state: '04', place: '55000', label: 'Arizona Cardinals', color: '#97233F', textColor: 'white', lat: 33.5276, lng: -112.2626 },
    nfl_falcons: { state: '13', place: '04000', label: 'Atlanta Falcons', color: '#A71930', textColor: 'white', lat: 33.7553, lng: -84.4006 },
    nfl_ravens: { state: '24', place: '04000', label: 'Baltimore Ravens', color: '#241773', textColor: 'white', lat: 39.2850, lng: -76.6215 },
    nfl_bills: { state: '36', county: '029', label: 'Buffalo Bills', color: '#00338D', textColor: 'white', lat: 42.7740, lng: -78.7870 },
    nfl_panthers: { state: '37', place: '12000', label: 'Carolina Panthers', color: '#0085CA', textColor: 'white', lat: 35.2258, lng: -80.8528 },
    nfl_bears: { state: '17', place: '14000', label: 'Chicago Bears', color: '#0B162A', textColor: 'white', lat: 41.8623, lng: -87.6167 },
    nfl_bengals: { state: '39', place: '15000', label: 'Cincinnati Bengals', color: '#FB4F14', textColor: 'black', lat: 39.0955, lng: -84.5161 },
    nfl_browns: { state: '39', place: '16000', label: 'Cleveland Browns', color: '#311D00', textColor: 'white', lat: 41.5061, lng: -81.6995 },
    nfl_cowboys: { state: '48', place: '04000', label: 'Dallas Cowboys', color: '#003594', textColor: 'white', lat: 32.7473, lng: -97.0945 },
    nfl_denver: { state: '08', place: '20000', label: 'Denver Broncos', color: '#FB4F14', textColor: 'white', lat: 39.7439, lng: -105.0201 },
    nfl_lions: { state: '26', place: '22000', label: 'Detroit Lions', color: '#0076B6', textColor: 'white', lat: 42.3400, lng: -83.0456 },
    nfl_packers: { state: '55', place: '31000', label: 'Green Bay Packers', color: '#203731', textColor: 'white', lat: 44.5013, lng: -88.0622 },
    nfl_texans: { state: '48', place: '35000', label: 'Houston Texans', color: '#03202F', textColor: 'white', lat: 29.6847, lng: -95.4082 },
    nfl_colts: { state: '18', place: '36000', label: 'Indianapolis Colts', color: '#002C5F', textColor: 'white', lat: 39.7601, lng: -86.1639 },
    nfl_jaguars: { state: '12', place: '35000', label: 'Jacksonville Jaguars', color: '#006778', textColor: 'white', lat: 30.3239, lng: -81.6373 },
    nfl_chiefs: { state: '29', place: '38000', label: 'Kansas City Chiefs', color: '#E31837', textColor: 'white', lat: 39.0489, lng: -94.4839 },
    nfl_raiders: { state: '32', place: '40000', label: 'Las Vegas Raiders', color: '#000000', textColor: '#A5ACAF', lat: 36.0909, lng: -115.1833 },
    nfl_chargers: { state: '06', place: '44000', label: 'LA Chargers', color: '#0080C6', textColor: 'white', lat: 33.9535, lng: -118.3390 },
    nfl_rams: { state: '06', place: '44000', label: 'LA Rams', color: '#003594', textColor: '#FFA300', lat: 33.9535, lng: -118.3390 },
    nfl_dolphins: { state: '12', place: '45000', label: 'Miami Dolphins', color: '#008E97', textColor: 'white', lat: 25.9581, lng: -80.2389 },
    nfl_vikings: { state: '27', place: '43000', label: 'Minnesota Vikings', color: '#4F2683', textColor: 'white', lat: 44.9739, lng: -93.2575 },
    nfl_patriots: { state: '25', county: '021', label: 'New England Patriots', color: '#002244', textColor: 'white', lat: 42.0909, lng: -71.2643 },
    nfl_saints: { state: '22', place: '55000', label: 'New Orleans Saints', color: '#D3BC8D', textColor: 'black', lat: 29.9511, lng: -90.0812 },
    nfl_nygiants: { state: '34', county: '003', label: 'New York Giants', color: '#0B2265', textColor: 'white', lat: 40.8128, lng: -74.0742 },
    nfl_nyjets: { state: '34', county: '003', label: 'New York Jets', color: '#125740', textColor: 'white', lat: 40.8128, lng: -74.0742 },
    nfl_philadelphia: { state: '42', place: '60000', label: 'Philadelphia Eagles', color: '#004C54', textColor: 'white', lat: 39.9012, lng: -75.1675 },
    nfl_steelers: { state: '42', place: '61000', label: 'Pittsburgh Steelers', color: '#FFB81C', textColor: 'black', lat: 40.4468, lng: -80.0158 },
    nfl_sanfrancisco: { state: '06', place: '68000', label: 'San Francisco 49ers', color: '#AA0000', textColor: 'white', lat: 37.4033, lng: -121.9694 },
    nfl_seahawks: { state: '53', place: '63000', label: 'Seattle Seahawks', color: '#002244', textColor: '#69BE28', lat: 47.5952, lng: -122.3316 },
    nfl_buccaneers: { state: '12', place: '71000', label: 'Tampa Bay Buccaneers', color: '#D50A0A', textColor: 'white', lat: 27.9759, lng: -82.5033 },
    nfl_titans: { state: '47', place: '52014', label: 'Tennessee Titans', color: '#0C2340', textColor: 'white', lat: 36.1665, lng: -86.7713 },
    nfl_commanders: { state: '24', place: '41000', label: 'Washington Commanders', color: '#5A1414', textColor: 'white', lat: 38.9077, lng: -76.8645 },

    // MLB - Additional
    mlb_angels: { state: '06', place: '02000', label: 'LA Angels', color: '#BA0021', textColor: 'white', lat: 33.8003, lng: -117.8827 },
    mlb_astros: { state: '48', place: '35000', label: 'Houston Astros', color: '#002D62', textColor: 'white', lat: 29.7573, lng: -95.3559 },
    mlb_athletics: { state: '06', place: '53000', label: 'Oakland Athletics', color: '#003831', textColor: 'white', lat: 37.7516, lng: -122.2005 },
    mlb_bluejays: { isCanada: true, label: 'Toronto Blue Jays', color: '#134A8E', textColor: 'white', lat: 43.6414, lng: -79.3894 },
    mlb_brewers: { state: '55', place: '53000', label: 'Milwaukee Brewers', color: '#12284B', textColor: '#FFC52F', lat: 43.0284, lng: -87.9712 },
    mlb_cardinals: { state: '29', place: '65000', label: 'St. Louis Cardinals', color: '#C41E3A', textColor: 'white', lat: 38.6226, lng: -90.1928 },
    mlb_diamondbacks: { state: '04', place: '55000', label: 'Arizona Diamondbacks', color: '#A71930', textColor: 'white', lat: 33.4455, lng: -112.0667 },
    mlb_dodgers: { state: '06', place: '44000', label: 'LA Dodgers', color: '#005A9C', textColor: 'white', lat: 34.0739, lng: -118.2400 },
    mlb_giants: { state: '06', place: '67000', label: 'SF Giants', color: '#FD5A1E', textColor: 'black', lat: 37.7786, lng: -122.3893 },
    mlb_guardians: { state: '39', place: '16000', label: 'Cleveland Guardians', color: '#0C2340', textColor: 'white', lat: 41.4962, lng: -81.6852 },
    mlb_mariners: { state: '53', place: '63000', label: 'Seattle Mariners', color: '#0C2C56', textColor: 'white', lat: 47.5914, lng: -122.3323 },
    mlb_marlins: { state: '12', place: '45000', label: 'Miami Marlins', color: '#00A3E0', textColor: 'white', lat: 25.7783, lng: -80.2197 },
    mlb_mets: { state: '36', county: '081', label: 'NY Mets', color: '#002D72', textColor: 'white', lat: 40.7571, lng: -73.8458 },
    mlb_nationals: { state: '11', place: '50000', label: 'Washington Nationals', color: '#AB0003', textColor: 'white', lat: 38.8730, lng: -77.0074 },
    mlb_orioles: { state: '24', place: '04000', label: 'Baltimore Orioles', color: '#DF4601', textColor: 'black', lat: 39.2840, lng: -76.6216 },
    mlb_padres: { state: '06', place: '66000', label: 'San Diego Padres', color: '#2F241D', textColor: '#FFC72C', lat: 32.7073, lng: -117.1566 },
    mlb_phillies: { state: '42', place: '60000', label: 'Philadelphia Phillies', color: '#E81828', textColor: 'white', lat: 39.9061, lng: -75.1665 },
    mlb_pirates: { state: '42', place: '61000', label: 'Pittsburgh Pirates', color: '#27251F', textColor: '#FDB827', lat: 40.4473, lng: -80.0057 },
    mlb_rangers: { state: '48', place: '04000', label: 'Texas Rangers', color: '#003278', textColor: 'white', lat: 32.7512, lng: -97.0825 },
    mlb_rays: { state: '12', place: '63000', label: 'Tampa Bay Rays', color: '#092C5C', textColor: '#8FBCE6', lat: 27.7682, lng: -82.6501 },
    mlb_redsox: { state: '25', place: '07000', label: 'Boston Red Sox', color: '#BD3039', textColor: 'white', lat: 42.3467, lng: -71.0972 },
    mlb_reds: { state: '39', place: '15000', label: 'Cincinnati Reds', color: '#C6011F', textColor: 'white', lat: 39.0975, lng: -84.5071 },
    mlb_rockies: { state: '08', place: '20000', label: 'Colorado Rockies', color: '#33006F', textColor: 'white', lat: 39.7559, lng: -104.9942 },
    mlb_royals: { state: '29', place: '38000', label: 'Kansas City Royals', color: '#004687', textColor: 'white', lat: 39.0517, lng: -94.4803 },
    mlb_tigers: { state: '26', place: '22000', label: 'Detroit Tigers', color: '#0C2340', textColor: 'white', lat: 42.3392, lng: -83.0485 },
    mlb_twins: { state: '27', place: '43000', label: 'Minnesota Twins', color: '#002B5C', textColor: 'white', lat: 44.9817, lng: -93.2778 },
    mlb_whitesox: { state: '17', place: '14000', label: 'Chicago White Sox', color: '#27251F', textColor: 'white', lat: 41.8300, lng: -87.6339 },
    mlb_yankees: { state: '36', county: '005', label: 'NY Yankees', color: '#003087', textColor: 'white', lat: 40.8296, lng: -73.9262 },

    // MLS - Additional
    mls_atlanta: { state: '13', place: '04000', label: 'Atlanta United', color: '#80000A', textColor: 'white', lat: 33.7553, lng: -84.4006 },
    mls_austin: { state: '48', place: '05000', label: 'Austin FC', color: '#00B140', textColor: 'black', lat: 30.3887, lng: -97.7196 },
    mls_charlotte: { state: '37', place: '12000', label: 'Charlotte FC', color: '#1A85C8', textColor: 'white', lat: 35.2258, lng: -80.8528 },
    mls_chicago: { state: '17', place: '14000', label: 'Chicago Fire FC', color: '#FF0000', textColor: 'white', lat: 41.8614, lng: -87.6167 },
    mls_cincinnati: { state: '39', place: '15000', label: 'FC Cincinnati', color: '#FA4616', textColor: 'white', lat: 39.1114, lng: -84.5222 },
    mls_colorado: { state: '08', place: '20000', label: 'Colorado Rapids', color: '#862633', textColor: 'white', lat: 39.8058, lng: -104.8918 },
    mls_columbus: { state: '39', place: '18000', label: 'Columbus Crew', color: '#FEDD00', textColor: 'black', lat: 39.9678, lng: -83.0061 },
    mls_dallas: { state: '48', place: '27684', label: 'FC Dallas', color: '#B01639', textColor: 'white', lat: 33.1544, lng: -96.8353 },
    mls_dcunited: { state: '11', place: '50000', label: 'D.C. United', color: '#EF3E42', textColor: 'white', lat: 38.8681, lng: -77.0122 },
    mls_houston: { state: '48', place: '35000', label: 'Houston Dynamo', color: '#FF6B00', textColor: 'black', lat: 29.7523, lng: -95.3524 },
    mls_lafc: { state: '06', place: '44000', label: 'LAFC', color: '#000000', textColor: '#C3a868', lat: 34.0130, lng: -118.2847 },
    mls_galaxy: { state: '06', place: '11530', label: 'LA Galaxy', color: '#00245D', textColor: '#FFD200', lat: 33.8644, lng: -118.2611 },
    mls_miami: { state: '12', place: '24000', label: 'Inter Miami CF', color: '#F7B5CD', textColor: '#231F20', lat: 26.1923, lng: -80.1610 },
    mls_minnesota: { state: '27', place: '58000', label: 'Minnesota United', color: '#8CD2F4', textColor: 'black', lat: 44.9529, lng: -93.1648 },
    mls_montreal: { isCanada: true, label: 'CF Montréal', color: '#004E9E', textColor: 'white', lat: 45.5630, lng: -73.5539 },
    mls_nashville: { state: '47', place: '52014', label: 'Nashville SC', color: '#EDE939', textColor: '#1F1646', lat: 36.1306, lng: -86.7631 },
    mls_revolution: { state: '25', county: '021', label: 'New England Revolution', color: '#002E5E', textColor: 'white', lat: 42.0909, lng: -71.2643 },
    mls_nycfc: { state: '36', county: '005', label: 'NYCFC', color: '#6CACE4', textColor: 'black', lat: 40.8296, lng: -73.9262 },
    mls_rbny: { state: '34', county: '013', label: 'NY Red Bulls', color: '#B10B41', textColor: 'white', lat: 40.7367, lng: -74.1503 },
    mls_orlando: { state: '12', place: '53000', label: 'Orlando City SC', color: '#633492', textColor: 'white', lat: 28.5411, lng: -81.3892 },
    mls_philadelphia: { state: '42', place: '13208', label: 'Philadelphia Union', color: '#002D55', textColor: 'white', lat: 39.8339, lng: -75.3789 },
    mls_portland: { state: '41', place: '59000', label: 'Portland Timbers', color: '#00482B', textColor: '#EAE827', lat: 45.5217, lng: -122.6917 },
    mls_realsaltlake: { state: '49', place: '67440', label: 'Real Salt Lake', color: '#B30838', textColor: 'white', lat: 40.5828, lng: -111.8906 },
    mls_sanjose: { state: '06', place: '68000', label: 'San Jose Earthquakes', color: '#0067B1', textColor: 'white', lat: 37.3512, lng: -121.9247 },
    mls_seattle: { state: '53', place: '63000', label: 'Seattle Sounders FC', color: '#5D9741', textColor: 'white', lat: 47.5952, lng: -122.3316 },
    mls_sportingkc: { state: '20', place: '36000', label: 'Sporting KC', color: '#91B0D7', textColor: '#002F65', lat: 39.1214, lng: -94.8231 },
    mls_stlouis: { state: '29', place: '65000', label: 'St. Louis CITY SC', color: '#E31351', textColor: 'white', lat: 38.6300, lng: -90.2000 },
    mls_toronto: { isCanada: true, label: 'Toronto FC', color: '#B30838', textColor: 'white', lat: 43.6331, lng: -79.4186 },
    mls_vancouver: { isCanada: true, label: 'Vancouver Whitecaps', color: '#00245E', textColor: 'white', lat: 49.2821, lng: -123.1118 },

    // WNBA
    wnba_dream: { state: '13', place: '18536', label: 'Atlanta Dream', color: '#C8102E', textColor: 'white', lat: 33.7431, lng: -84.4539 },
    wnba_sky: { state: '17', place: '14000', label: 'Chicago Sky', color: '#5BC2E7', textColor: 'white', lat: 41.8614, lng: -87.6167 },
    wnba_sun: { state: '09', county: '011', label: 'Connecticut Sun', color: '#E31837', textColor: 'white', lat: 41.4883, lng: -72.0883 },
    wnba_fever: { state: '18', place: '36000', label: 'Indiana Fever', color: '#002D62', textColor: 'white', lat: 39.7640, lng: -86.1555 },
    wnba_liberty: { state: '36', county: '047', label: 'New York Liberty', color: '#6F2633', textColor: 'white', lat: 40.6826, lng: -73.9753 },
    wnba_aces: { state: '32', place: '40000', label: 'Las Vegas Aces', color: '#000000', textColor: '#D0D3D4', lat: 36.0909, lng: -115.1833 },
    wnba_sparks: { state: '06', place: '44000', label: 'LA Sparks', color: '#552583', textColor: '#FDB927', lat: 34.0430, lng: -118.2673 },
    wnba_lynx: { state: '27', place: '43000', label: 'Minnesota Lynx', color: '#0C2340', textColor: '#236192', lat: 44.9795, lng: -93.2761 },
    wnba_mercury: { state: '04', place: '55000', label: 'Phoenix Mercury', color: '#1D1160', textColor: 'white', lat: 33.4455, lng: -112.0667 },
    wnba_storm: { state: '53', place: '63000', label: 'Seattle Storm', color: '#2C5234', textColor: '#FEE11A', lat: 47.6221, lng: -122.3533 },
    wnba_mystics: { state: '11', place: '50000', label: 'Washington Mystics', color: '#002B5C', textColor: 'white', lat: 38.8681, lng: -76.9881 },
    wnba_wings: { state: '48', place: '04000', label: 'Dallas Wings', color: '#002B5E', textColor: '#C4D600', lat: 32.7303, lng: -97.1082 },

    // NWSL
    nwsl_angelcity: { state: '06', place: '44000', label: 'Angel City FC', color: '#000000', textColor: '#F7A7A5', lat: 34.0130, lng: -118.2847 },
    nwsl_bay: { state: '06', place: '68000', label: 'Bay FC', color: '#000000', textColor: '#B1B3B3', lat: 37.3512, lng: -121.9247 },
    nwsl_chicago: { state: '17', place: '11000', label: 'Chicago Red Stars', color: '#053159', textColor: 'white', lat: 41.7647, lng: -87.8058 },
    nwsl_houston: { state: '48', place: '35000', label: 'Houston Dash', color: '#F6821F', textColor: 'black', lat: 29.7523, lng: -95.3524 },
    nwsl_kansas: { state: '29', place: '38000', label: 'Kansas City Current', color: '#E31837', textColor: 'white', lat: 39.1111, lng: -94.5778 },
    nwsl_gotham: { state: '34', place: '30450', label: 'NJ/NY Gotham FC', color: '#000000', textColor: '#A7A9AC', lat: 40.7367, lng: -74.1503 },
    nwsl_carolina: { state: '37', place: '10620', label: 'North Carolina Courage', color: '#132442', textColor: 'white', lat: 35.8340, lng: -78.7840 },
    nwsl_reign: { state: '53', place: '63000', label: 'Seattle Reign FC', color: '#002D55', textColor: 'white', lat: 47.5952, lng: -122.3316 },
    nwsl_orlando: { state: '12', place: '53000', label: 'Orlando Pride', color: '#633492', textColor: 'white', lat: 28.5411, lng: -81.3892 },
    nwsl_louisville: { state: '21', place: '48000', label: 'Racing Louisville FC', color: '#7E2C8E', textColor: 'white', lat: 38.2527, lng: -85.7585 },
    nwsl_sandiego: { state: '06', place: '66000', label: 'San Diego Wave FC', color: '#004C97', textColor: 'white', lat: 32.7831, lng: -117.1194 },
    nwsl_portland: { state: '41', place: '59000', label: 'Portland Thorns FC', color: '#E31837', textColor: 'white', lat: 45.5217, lng: -122.6917 },
    nwsl_royals: { state: '49', place: '67440', label: 'Utah Royals', color: '#B30838', textColor: '#FEE11A', lat: 40.5828, lng: -111.8906 },
    nwsl_spirit: { state: '11', place: '50000', label: 'Washington Spirit', color: '#002B5C', textColor: 'white', lat: 38.8681, lng: -77.0122 }
};

const LEAGUES = {
    'NFL': ['nfl_cardinals', 'nfl_falcons', 'nfl_ravens', 'nfl_bills', 'nfl_panthers', 'nfl_bears', 'nfl_bengals', 'nfl_browns', 'nfl_cowboys', 'nfl_denver', 'nfl_lions', 'nfl_packers', 'nfl_texans', 'nfl_colts', 'nfl_jaguars', 'nfl_chiefs', 'nfl_raiders', 'nfl_chargers', 'nfl_rams', 'nfl_dolphins', 'nfl_vikings', 'nfl_patriots', 'nfl_saints', 'nfl_nygiants', 'nfl_nyjets', 'nfl_philadelphia', 'nfl_steelers', 'nfl_sanfrancisco', 'nfl_seahawks', 'nfl_buccaneers', 'nfl_titans', 'nfl_commanders'],
    'MLB': ['mlb_angels', 'mlb_astros', 'mlb_athletics', 'mlb_bluejays', 'mlb_brewers', 'mlb_cardinals', 'mlb_diamondbacks', 'mlb_dodgers', 'mlb_giants', 'mlb_guardians', 'mlb_mariners', 'mlb_marlins', 'mlb_mets', 'mlb_nationals', 'mlb_orioles', 'mlb_padres', 'mlb_phillies', 'mlb_pirates', 'mlb_rangers', 'mlb_rays', 'mlb_redsox', 'mlb_reds', 'mlb_rockies', 'mlb_royals', 'mlb_tigers', 'mlb_twins', 'mlb_whitesox', 'mlb_yankees'],
    'NBA': ['atlanta', 'boston', 'brooklyn', 'charlotte', 'chicago', 'cleveland', 'dallas', 'denver', 'detroit', 'sanfrancisco', 'houston', 'indianapolis', 'lakers', 'clippers', 'memphis', 'miami', 'milwaukee', 'minneapolis', 'neworleans', 'newyork', 'oklahomacity', 'orlando', 'philadelphia', 'phoenix', 'portland', 'sacramento', 'sanantonio', 'saltlakecity', 'toronto', 'washingtondc'],
    'MLS': ['mls_atlanta', 'mls_austin', 'mls_charlotte', 'mls_chicago', 'mls_cincinnati', 'mls_colorado', 'mls_columbus', 'mls_dallas', 'mls_dcunited', 'mls_houston', 'mls_lafc', 'mls_galaxy', 'mls_miami', 'mls_minnesota', 'mls_montreal', 'mls_nashville', 'mls_revolution', 'mls_nycfc', 'mls_rbny', 'mls_orlando', 'mls_philadelphia', 'mls_portland', 'mls_realsaltlake', 'mls_sanjose', 'mls_seattle', 'mls_sportingkc', 'mls_stlouis', 'mls_toronto', 'mls_vancouver'],
    'WNBA': ['wnba_dream', 'wnba_sky', 'wnba_sun', 'wnba_fever', 'wnba_liberty', 'wnba_aces', 'wnba_sparks', 'wnba_lynx', 'wnba_mercury', 'wnba_storm', 'wnba_mystics', 'wnba_wings'],
    'NWSL': ['nwsl_angelcity', 'nwsl_bay', 'nwsl_chicago', 'nwsl_houston', 'nwsl_kansas', 'nwsl_gotham', 'nwsl_carolina', 'nwsl_reign', 'nwsl_orlando', 'nwsl_louisville', 'nwsl_sandiego', 'nwsl_portland', 'nwsl_royals', 'nwsl_spirit']
};

const brandProfiles = {
    'Luxury Automotive': {
        targets: ['strategic_affluence', 'education', 'loyalty_ltv', 'strategic_life_stage'],
        persona: "Luxury Auto brands target high-net-worth individuals. They value high-fidelity income concentration ($200k+) and premium median HHI lift.",
        idealAge: 45,
        idealHhi: 125000,
        idealDiversity: 0.85,
        idealEducation: 0.45,
        idealGender: 35
    },
    'Fintech / Crypto': {
        targets: ['diversity', 'strategic_affluence', 'strategic_life_stage'],
        persona: "Fintech disruptors seek young, tech-savvy professionals. They prioritize digital connectivity and strategic affluence concentration for market penetration.",
        idealAge: 28,
        idealHhi: 85000,
        idealDiversity: 0.95,
        idealEducation: 0.40,
        idealGender: 40
    },
    'Mass Market Retail': {
        targets: ['reach', 'strategic_life_stage', 'hh_structure'],
        persona: "Retailers value raw volume and family density. They prioritize total 'Wallets' and middle-income stability for high-frequency low-ticket sales.",
        idealAge: 38,
        idealHhi: 55000,
        idealDiversity: 0.70,
        idealEducation: 0.25,
        idealGender: 55
    },
    'Health & Wellness': {
        targets: ['strategic_life_stage', 'multicultural', 'education'],
        persona: "Wellness brands thrive in urban, diverse markets with high educational attainment. They target healthy, active personas with disposable income for lifestyle products.",
        idealAge: 32,
        idealHhi: 75000,
        idealDiversity: 0.85,
        idealEducation: 0.45,
        idealGender: 65
    },
    'Global Beverage': {
        targets: ['multicultural', 'diversity', 'reach', 'strategic_life_stage'],
        persona: "Beverage giants seek maximum multicultural reach and social media 'Halo' impact to drive brand awareness across the broadest possible audience denominator.",
        idealAge: 24,
        idealHhi: 45000,
        idealDiversity: 0.90,
        idealEducation: 0.25,
        idealGender: 50
    },
    'International Brand': {
        targets: ['multicultural', 'diversity', 'education', 'strategic_life_stage'],
        persona: "International brands focus on high-growth diversity markets. They prioritize multicultural density and educational attainment as key indicators for global scalability.",
        idealAge: 30,
        idealHhi: 65000,
        idealDiversity: 0.88,
        idealEducation: 0.45,
        idealGender: 50
    }
};




const censusCache = {};
let currentPersonaTargets = null;
let currentContext = 'nba';
let aiDebounceTimer = null;

async function fetchCensusData(marketKey, zipCode = null) {
    const cacheKey = zipCode ? `zip_${zipCode}` : marketKey;
    if (censusCache[cacheKey]) return censusCache[cacheKey];

    // Increased throttle to 300ms for Census stability
    await new Promise(r => setTimeout(r, 300));

    let url;
    if (zipCode) {
        const variables = 'B11001_001E,B19013_001E,B01002_001E,B03002_001E,B03002_003E,B19001_001E,B19001_017E,B24011_001E,B24011_002E,B25003_001E,B25003_002E';
        url = `${CENSUS_API_BASE}?get=${variables}&for=zip%20code%20tabulation%20area:${zipCode}`;
    } else {
        const geo = marketMapping[marketKey];
        if (!geo) throw new Error(`Market key "${marketKey}" not found.`);

        if (geo.isCanada) {
            // Toronto static data (US-normalized estimates from CDA Census 2021)
            const result = {
                population: 2794356,
                hh_size: 2.6,
                hhi: 65000,
                age: 39.2,
                multicultural: 0.515,
                affluence_burst: 0.068,
                life_stage: 0.53,
                digital: 0.88,
                education: 0.44
            };
            censusCache[cacheKey] = result;
            return result;
        }

        const variables = 'B11001_001E,B19013_001E,B01002_001E,B03002_001E,B03002_003E,B19001_001E,B19001_017E,B24011_001E,B24011_002E,B25003_001E,B25003_002E';
        if (geo.county) {
            url = `${CENSUS_API_BASE}?get=${variables}&for=county:${geo.county}&in=state:${geo.state}`;
        } else {
            url = `${CENSUS_API_BASE}?get=${variables}&for=place:${geo.place}&in=state:${geo.state}`;
        }
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

        const total_pop_b03002 = parseInt(values[3]) || 1;
        const non_hispanic_white = parseInt(values[4]) || 0;
        const hh_total = parseInt(values[5]) || 1;
        const hh_200k = parseInt(values[6]) || 0;
        const workforce_total = parseInt(values[7]) || 1;
        const workforce_mgmt = parseInt(values[8]) || 0;
        const tenure_total = parseInt(values[9]) || 1;
        const tenure_owner = parseInt(values[10]) || 0;

        const result = {
            hhi: parseInt(values[1]),
            age: parseFloat(values[2]),
            multicultural: (total_pop_b03002 - non_hispanic_white) / total_pop_b03002,
            gender: 0.51,
            life_stage: tenure_owner / tenure_total,
            education: 0.42,
            digital: 0.85 + (Math.random() * 0.1),
            hh_size: 2.6,
            b2b: 0.30,
            reach: parseInt(values[0]),
            affluence_burst: hh_200k / hh_total,
            executive_density: workforce_mgmt / workforce_total,
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
            if (geo.offsets.affluence_burst) result.affluence_burst *= geo.offsets.affluence_burst;
            if (geo.offsets.executive_density) result.executive_density *= geo.offsets.executive_density;
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
            hhi: 68000 + (Math.random() * 40000),
            age: 32 + (Math.random() * 8),
            multicultural: 0.45,
            gender: 0.50,
            life_stage: 0.65,
            education: 0.35,
            digital: 0.82,
            hh_size: 2.5,
            b2b: 0.25,
            reach: LEAGUE_AVERAGES.reach * (0.9 + Math.random() * 0.2),
            affluence_burst: 0.095 + (Math.random() * 0.04 - 0.02),
            executive_density: 0.42 + (Math.random() * 0.06 - 0.03),
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
            if (geo.offsets.affluence_burst) fallback.affluence_burst *= geo.offsets.affluence_burst;
            if (geo.offsets.executive_density) fallback.executive_density *= geo.offsets.executive_density;
        }

        fallback.gender += (Math.random() * 0.04 - 0.02);
        fallback.life_stage += (Math.random() * 0.06 - 0.03);
        fallback.education += (Math.random() * 0.06 - 0.03);

        censusCache[cacheKey] = fallback;
        return fallback;
    }
}

/**
 * Unified calculation logic for strategic multipliers and values.
 */
function calculateFactorImpact(factor, market, ctx) {
    const {
        assetType, mode, brandName, brand, activeTargets,
        fanAgeInput, fanHhiInput, fanDiversityInput,
        idealAge, idealHhi, idealDiversity, idealDigital,
        benchAge, benchHhi, benchDiversity,
        teamAttendance, isInternational, isEfficiency, weightedFormula
    } = ctx;

    // CUSTOM WEIGHTING LOGIC
    let customWeight = 1.0;
    const container = document.getElementById('persona-sortable-container');

    if (weightedFormula === 'Balanced') {
        customWeight = 1.0; // All factors weighted equally
    } else if (container) {
        // Trajektory or Custom use exponential weighting based on current DOM rank
        const items = [...container.querySelectorAll('.draggable-persona-item')];
        const index = items.findIndex(item => item.getAttribute('data-factor-id') === factor.id);
        if (index !== -1) {
            // Formula: Weight = e^(-λ * rank) where λ = 0.6
            customWeight = Math.exp(-0.6 * index);
        }
    }

    let currentUsAvg = (factor.id === 'reach') ? 200000 : factor.us_avg;
    let marketVal = market[factor.id] || currentUsAvg;
    if (factor.id === 'hh_structure') marketVal = market.hh_size || currentUsAvg;

    // Base calculation for fanVal
    let fanVal = marketVal * 1.08; // Default lift
    if (factor.id === 'age') fanVal = fanAgeInput;
    if (factor.id === 'multicultural') fanVal = fanDiversityInput;

    if (factor.id === 'strategic_affluence') {
        const calcFanHhi = fanHhiInput;
        marketVal = ((market.hhi / 75000) * 0.7) + ((market.affluence_burst / 0.06) * 0.2) + 0.1;
        fanVal = ((calcFanHhi / 75000) * 0.8) + (((market.affluence_burst * 1.05) / 0.06) * 0.1) + 0.1;
    }

    if (factor.id === 'hh_structure') fanVal = marketVal * 1.05;

    let multiplier = 1.0;
    let formula = "";
    let impact = factor.impact || "Standard Lift";

    if (factor.id === 'reach') {
        multiplier = marketVal / currentUsAvg;
        formula = "Local Households / League Average Households";
    } else if (factor.id === 'strategic_affluence') {
        const currentFanHhi = fanHhiInput;
        const w1 = Math.log(currentFanHhi / (market.hhi || 1));
        const w2 = Math.log(currentFanHhi / idealHhi);
        const w2Capped = Math.max(-0.35, Math.min(0.40, w2));
        const hhiMult = Math.exp((0.6 * w2Capped) + (0.4 * w1));

        const affLiftRaw = (market.affluence_burst * 1.05) / 0.06;
        const affLift = Math.max(0.7, Math.min(1.75, affLiftRaw));

        multiplier = (hhiMult * 0.8) + (affLift * 0.1) + 0.1;
        multiplier = Math.max(0.85, Math.min(1.35, multiplier));

        const eventHhiAlignment = (fanHhiInput / benchHhi) * 0.4 + 0.6;
        multiplier *= eventHhiAlignment;

        impact = hhiMult > 1.2 ? "High-Net-Worth Concentration" : "Affluence Precision";
        formula = `(HHI Fit & Alignment) × Local Benchmark Alignment (${formatCurrency(benchHhi)})`;
        if (activeTargets.includes('strategic_affluence')) {
            multiplier *= 1.10;
            formula = "(80/10 Composite) + Strategic Alignment";
        }
    } else if (factor.id === 'hh_structure') {
        multiplier = fanVal / marketVal;
        formula = "Fan Household Size / Market Average Household Size";
    } else if (factor.id === 'loyalty_ltv') {
        marketVal = LEAGUE_AVERAGES.attendance;
        fanVal = teamAttendance;
        multiplier = fanVal / marketVal;
        formula = `Team Attendance / Property Avg (${marketVal.toLocaleString()})`;
        if (activeTargets.includes('loyalty_ltv')) {
            formula = "Strategic Priority Target Alignment (Target Fit)";
        }
    } else if (factor.id === 'strategic_life_stage') {
        const ageVal = fanAgeInput;
        const ageDiff = Math.abs(ageVal - idealAge);
        const eventAgeDiff = Math.abs(ageVal - benchAge);
        const ageMultiplier = Math.max(0.8, 1.25 - (ageDiff * 0.02) - (eventAgeDiff * 0.01));

        const marketAgeDiff = Math.abs((market.age || 38) - idealAge);
        const marketAgeMult = Math.max(0.8, 1.25 - (marketAgeDiff * 0.02));

        const lsVal = market.life_stage || 0.65;
        const lsMultiplier = (lsVal * 1.05) / 0.65;
        const marketLsMult = lsVal / 0.65;

        const stabilityKeywords = ["Insurance", "Home", "Improvement", "Stability", "Real Estate", "Mortgage", "Security"];
        const isStabilityBrand = stabilityKeywords.some(kw =>
            brandName.toLowerCase().includes(kw.toLowerCase()) ||
            (brand.persona && brand.persona.toLowerCase().includes(kw.toLowerCase()))
        );

        const weightAge = isStabilityBrand ? 0.5 : 0.8;
        const weightLs = isStabilityBrand ? 0.5 : 0.2;

        fanVal = (ageMultiplier * weightAge) + (lsMultiplier * weightLs);
        marketVal = (marketAgeMult * weightAge) + (marketLsMult * weightLs);
        multiplier = fanVal / marketVal;

        formula = isStabilityBrand ?
            "Strategic Life Stage (50% Age Alignment / 50% Home Ownership Focus)" :
            "Strategic Life Stage (80% Age Alignment / 20% Home Ownership Focus)";

        impact = isStabilityBrand ? "Stability & Intent Focus" : "Generational Alignment";
        if (activeTargets.includes('strategic_life_stage')) multiplier *= 1.10;
    } else if (factor.id === 'digital') {
        const baseDigitalMult = (market.digital || 0.85) / LEAGUE_AVERAGES.social_engagement;
        const socialPremium = assetType === 'Social' ? 1.25 : 1.0;
        multiplier = baseDigitalMult * socialPremium;
        if (isInternational) multiplier *= 1.15;
        formula = "(Market Digital Readiness × Platform Premium) " + (isInternational ? "× Global Lift" : "");
        if (activeTargets.includes('digital')) {
            formula = "Strategic Priority Target Alignment (Target Fit)";
        }
        impact = multiplier > 1.2 ? "Social Reach Premium" : "Platform Standard";
        if (isInternational) impact += " (Global)";
    } else if (factor.id === 'multicultural') {
        const isStrategic = activeTargets.includes('multicultural');
        const isGlobal = isInternational || brandName === 'International Brand';

        if (isStrategic || isGlobal) {
            const benchMulticultural = benchDiversity || factor.us_avg;
            multiplier = fanVal / benchMulticultural;
            formula = `Fan Diversity (${(fanVal * 100).toFixed(0)}%) / Local Benchmark (${(benchMulticultural * 100).toFixed(0)}%)`;

            if (isStrategic) {
                const alignmentMult = (fanVal / idealDiversity) * 0.5 + 0.5;
                multiplier *= alignmentMult;
                if (brandName === 'International Brand') {
                    multiplier *= 1.45;
                    impact = "International Diversity Power";
                } else if (isInternational) {
                    multiplier *= 1.15;
                    impact = "Global Diversity Premium";
                } else {
                    multiplier *= 1.10;
                    impact = "Strategic Diversity Focus";
                }
            } else if (isInternational) {
                multiplier *= 1.15;
                impact = "Global Reach Entry";
            } else {
                impact = "Diversity Growth Lift";
            }
        } else {
            multiplier = 1.0;
            formula = "Standard Alignment (Domestic Focus)";
            impact = "Neutral Base (US Market)";
        }
    } else if (factor.id === 'gender') {
        const genderVal = ctx.fanGenderInput || 51.0;
        const targetGender = ctx.idealGender || 50;
        const genderAlign = Math.max(0.85, 1.15 - Math.abs(genderVal - targetGender) * 0.005);
        multiplier = genderAlign;
        formula = `Gender Alignment (Fan Profile: ${genderVal.toFixed(0)}% vs Target: ${targetGender}% Female)`;
        if (activeTargets.includes('gender')) multiplier *= 1.10;
        impact = multiplier > 1.05 ? "Target Gender Match" : "Neutral Influence";
    } else if (factor.id === 'education') {
        const eduVal = ctx.fanEduInput || market.education || 0.35;
        const targetEdu = ctx.idealEducation || 0.35;
        const eduAlign = Math.max(0.8, 1.20 - Math.abs(eduVal - targetEdu) * 0.5);
        multiplier = eduAlign;
        formula = `Educational Alignment (Fan Profile: ${(eduVal * 100).toFixed(0)}% vs Target: ${(targetEdu * 100).toFixed(0)}%+)`;
        if (activeTargets.includes('education')) multiplier *= 1.10;
        impact = multiplier > 1.05 ? "Precision Education Fit" : "Standard Decision Power";
    } else {
        if (activeTargets.includes(factor.id)) {
            multiplier = fanVal > marketVal ? 1.25 : 1.1;
            formula = "Strategic Priority Target Alignment (Target Fit)";
        } else {
            multiplier = 1.02;
            formula = "Standard Market Base Lift";
        }
    }

    // Apply weighted lift model
    // multiplier = 1 + (baseLift - 1) * weight
    // This ensures W:0.1 reduces the impact of the lift/penalty rather than making the index 0.1x
    const finalMultiplier = 1 + (multiplier - 1) * customWeight;

    return { multiplier: finalMultiplier, fanVal, marketVal, currentUsAvg, formula, impact, baseMultiplier: multiplier };
}

async function calculateValuation() {
    const mainCard = document.querySelector('.final-value-card');
    if (mainCard) {
        mainCard.classList.remove('discovery-avg-mode');
        document.getElementById('valuation-label').innerText = "Strategic Market Index";
    }

    // Update Matrix Title
    const matrixTitle = document.getElementById('matrix-title');
    const marketKeyInput = document.getElementById('market-dma').value;
    const marketsToFetchList = marketKeyInput.split(',').filter(k => k);

    if (matrixTitle) {
        if (marketsToFetchList.length > 1) {
            matrixTitle.innerText = "11-Factor Decision Matrix - Portfolio Analysis";
        } else if (marketsToFetchList.length === 1) {
            let label = marketMapping[marketsToFetchList[0]]?.label || marketsToFetchList[0];
            const teamMatch = label.match(/\((.*?)\)/);
            if (teamMatch) label = teamMatch[1];
            matrixTitle.innerText = `11-Factor Decision Matrix - ${label}`;
        } else {
            matrixTitle.innerText = "11-Factor Decision Matrix";
        }
    }
    const baseline = 1;
    const mode = 'nba'; // Hardcode mode to 'nba'

    // Choose correct market and fan inputs (now only NBA logic)
    const marketKey = document.getElementById('market-dma').value;
    const fanAgeInput = parseFloat(document.getElementById('fan-target-age').value) || 38;
    const fanHhiInput = parseFloat(document.getElementById('fan-target-hhi').value) || 85000;
    const fanDiversityInput = parseFloat(document.getElementById('fan-target-diversity').value) / 100;
    const fanEduInput = parseFloat(document.getElementById('fan-target-education').value) || 0.35;
    const fanGenderInput = parseFloat(document.getElementById('fan-target-gender').value) || 50;

    // Benchmarks for NBA are US national averages or league specific
    const benchAge = 35;
    const benchHhi = 75000;
    const benchDiversity = 0.45;

    const brandName = document.getElementById('target-brand').value;

    // BRAND IDEAL INPUTS
    const idealAge = Math.max(1, parseFloat(document.getElementById('brand-target-age').value) || 35);
    const idealHhi = Math.max(5000, parseFloat(document.getElementById('brand-target-hhi').value) || 75000);
    const idealDiversity = parseFloat(document.getElementById('brand-target-diversity').value) / 100;
    const idealEducation = parseFloat(document.getElementById('brand-target-education').value) || 0.35;
    const idealGender = parseFloat(document.getElementById('brand-target-gender').value) || 50;

    const idealDigital = 0.85; // Default digital benchmark
    const teamAttendance = parseFloat(document.getElementById('team-attendance').value);

    const assetType = document.getElementById('asset-name').value;
    const weightedFormula = document.getElementById('weighted-formula')?.value || 'Trajektory Weighting';
    const isEfficiency = document.getElementById('efficiency-toggle').checked;
    const isInternational = document.getElementById('international-toggle').checked;
    const zipCode = isEfficiency ? document.getElementById('zip-code').value.trim() : null;

    // Handle Portfolio Aggregation if multiple selected
    let marketsToFetch = marketKey.split(',').filter(k => k);
    let market;

    if (marketsToFetch.length > 1) {
        // Aggregate Mode
        const results = await Promise.all(marketsToFetch.map(k => fetchCensusData(k)));
        market = {
            hhi: results.reduce((a, b) => a + b.hhi, 0) / results.length,
            age: results.reduce((a, b) => a + b.age, 0) / results.length,
            multicultural: results.reduce((a, b) => a + b.multicultural, 0) / results.length,
            gender: results.reduce((a, b) => a + b.gender, 0) / results.length,
            life_stage: results.reduce((a, b) => a + b.life_stage, 0) / results.length,
            education: results.reduce((a, b) => a + b.education, 0) / results.length,
            digital: results.reduce((a, b) => a + b.digital, 0) / results.length,
            hh_size: results.reduce((a, b) => a + b.hh_size, 0) / results.length,
            affluence_burst: results.reduce((a, b) => a + b.affluence_burst, 0) / results.length,
            executive_density: results.reduce((a, b) => a + b.executive_density, 0) / results.length,
            reach: results.reduce((a, b) => a + b.reach, 0) / results.length
        };
        if (mainCard) {
            mainCard.classList.add('discovery-avg-mode');
            document.getElementById('valuation-label').innerText = "Portfolio Strategic Index (AVG)";
        }
    } else {
        market = await fetchCensusData(marketKey, zipCode && zipCode.length === 5 ? zipCode : null);
    }

    // Update fanHhiInput fallback contextually if needed
    if (!document.getElementById('fan-target-hhi').value) {
        fanHhiInput = market.hhi * 1.18;
    }
    const brand = brandProfiles[brandName] || { targets: ['hhi'], persona: `${brandName} seeks high-value markets.` };

    // Use AI Targets if available, otherwise fallback to brand profile
    const activeTargets = currentPersonaTargets || brand.targets;

    const matrixBody = document.getElementById('matrix-body');
    const cardsGrid = document.getElementById('factor-cards-grid');
    matrixBody.innerHTML = '';
    cardsGrid.innerHTML = '';

    let currentHhiMult = 1.0;
    let currentAffMult = 1.0;
    let currentAgeMult = 1.0;
    let currentLsMult = 1.0;

    let totalMultiplier = 1.0;

    const ctx = {
        assetType, mode, brandName, brand, activeTargets,
        fanAgeInput, fanHhiInput, fanDiversityInput, fanEduInput, fanGenderInput,
        idealAge, idealHhi, idealDiversity, idealDigital, idealEducation, idealGender,
        benchAge, benchHhi, benchDiversity,
        teamAttendance, isInternational, isEfficiency, weightedFormula
    };

    factors.forEach(factor => {
        // Exclusion logic: skip LTV (if not Venue), Digital (if Broadcast), Scale (if Efficiency), Reach (if Zip)
        if (factor.id === 'loyalty_ltv' && assetType !== 'In-Venue') return;
        if (factor.id === 'digital' && assetType === 'Broadcast') return;
        if (factor.id === 'total_pop' && isEfficiency) return;
        if (factor.id === 'reach' && isEfficiency) return;

        const result = calculateFactorImpact(factor, market, ctx);
        const { multiplier, fanVal, marketVal, currentUsAvg, formula, impact } = result;

        totalMultiplier *= multiplier;

        const row = document.createElement('tr');
        if (activeTargets.includes(factor.id)) {
            row.classList.add('ai-affected-row');
            if (currentPersonaTargets && currentPersonaTargets.includes(factor.id) && !brand.targets.includes(factor.id)) {
                factor.impact = "Strategic AI Target";
            }
        }

        row.innerHTML = `
            <td>
                <div class="factor-name">
                    ${(factor.id === 'strategic_affluence' || factor.id === 'strategic_life_stage') ? `<span class="expand-toggle expanded" onclick="toggleSubRows('${factor.id}', this)">▾</span>` : ''}
                    ${factor.label}
                </div>
                <small style="color: var(--text-secondary)">${factor.calculation}</small>
            </td>
            <td><span class="census-tag">${factor.table}</span></td>
            <td>${formatValue(factor.id, marketVal)}</td>
            <td>${formatValue(factor.id, fanVal)}</td>
            <td>${formatValue(factor.id, currentUsAvg)}</td>
            <td class="multiplier-cell">
                <span class="multiplier-val" data-formula="${formula}">${multiplier.toFixed(3)}x</span>
            </td>
            <td><span class="impact-${multiplier > 1.2 ? 'high' : 'neutral'}">
                ${factor.impact || 'Standard Lift'}
            </span></td>
        `;
        matrixBody.appendChild(row);

        // --- RENDER CARD ---
        const card = document.createElement('div');
        card.className = `factor-card ${activeTargets.includes(factor.id) ? 'ai-affected-card' : ''}`;
        card.onclick = () => flipCard(card);

        let subFactorsHtml = '';
        if (factor.id === 'strategic_affluence') {
            subFactorsHtml = `
                <div class="sub-factors-list">
                    <div class="sub-factor-item"><span>Median HHI:</span> <span>${formatCurrency(market.hhi * 1.18)}</span></div>
                    <div class="sub-factor-item"><span>Affluence Burst:</span> <span>${(market.affluence_burst * 1.05 * 100).toFixed(1)}%</span></div>
                </div>
            `;
        } else if (factor.id === 'strategic_life_stage') {
            subFactorsHtml = `
                <div class="sub-factors-list">
                    <div class="sub-factor-item"><span>Age (Fans):</span> <span>${((market.age || 38.5) * 0.96).toFixed(1)}</span></div>
                    <div class="sub-factor-item"><span>Home Ownership:</span> <span>${((market.life_stage || 0.65) * 1.05 * 100).toFixed(1)}%</span></div>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="factor-card-inner">
                <div class="factor-card-front">
                    <div class="card-title">${factor.label}</div>
                    ${subFactorsHtml}
                    <div class="card-multiplier">
                        <span class="label">Multiplier</span>
                        <div class="value">${multiplier.toFixed(3)}x</div>
                    </div>
                    <div class="card-impact-badge card-impact-${multiplier > 1.2 ? 'high' : 'neutral'}">
                        ${factor.impact || 'Standard Lift'}
                    </div>

                </div>
                <div class="factor-card-back">
                    <div class="card-title" style="font-size: 1.1rem; margin-bottom: 1.5rem;">Calculation Details</div>
                    <div class="card-details">
                        <div class="detail-item">
                            <span class="label">Local Demo</span>
                            <span class="val">${formatValue(factor.id, marketVal)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Fan Demo</span>
                            <span class="val">${formatValue(factor.id, fanVal)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">League/US Avg</span>
                            <span class="val">${formatValue(factor.id, currentUsAvg)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Census Table</span>
                            <span class="census-tag">${factor.table}</span>
                        </div>
                    </div>
                    <div class="formula-box">
                        <span class="formula-label">Equation</span>
                        <div class="formula-text">${formula}</div>
                    </div>

                </div>
            </div>
        `;
        cardsGrid.appendChild(card);

        if (factor.id === 'strategic_affluence') {
            const hhiRow = document.createElement('tr');
            hhiRow.className = 'sub-row strategic_affluence-detail';
            hhiRow.innerHTML = `
                <td><div class="factor-name">└ Median Household Income</div></td>
                <td><span class="census-tag">B19013</span></td>
                <td>${formatCurrency(market.hhi)}</td>
                <td>${formatCurrency(fanHhiInput)}</td>
                <td>${formatCurrency(benchHhi)}</td>
                <td><span class="multiplier-val" data-formula="exp(0.6 * log(Fan/Target) + 0.4 * log(Fan/Local))">${currentHhiMult.toFixed(3)}x</span></td>
                <td>Raw Input</td>
            `;
            matrixBody.appendChild(hhiRow);

            const burstRow = document.createElement('tr');
            burstRow.className = 'sub-row strategic_affluence-detail';
            burstRow.innerHTML = `
                <td><div class="factor-name">└ Affluence Burst ($200k+)</div></td>
                <td><span class="census-tag">B19001</span></td>
                <td>${(market.affluence_burst * 100).toFixed(1)}%</td>
                <td>${(market.affluence_burst * 1.05 * 100).toFixed(1)}%</td>
                <td>6.0%</td>
                <td><span class="multiplier-val" data-formula="(Market Burst * 1.05) / 0.06 Benchmark">${currentAffMult.toFixed(3)}x</span></td>
                <td>Raw Input</td>
            `;
            matrixBody.appendChild(burstRow);
        }

        if (factor.id === 'strategic_life_stage') {
            const ageRow = document.createElement('tr');
            ageRow.className = 'sub-row strategic_life_stage-detail';
            ageRow.innerHTML = `
                <td><div class="factor-name">└ Age Alignment (Fans)</div></td>
                <td><span class="census-tag">S0101</span></td>
                <td>${(market.age || 38.5).toFixed(1)}</td>
                <td>${fanAgeInput.toFixed(1)}</td>
                <td>${benchAge.toFixed(1)}</td>
                <td><span class="multiplier-val" data-formula="max(0.8, 1.25 - (AgeDiff * 0.025))">${currentAgeMult.toFixed(3)}x</span></td>
                <td>Raw Input</td>
            `;
            matrixBody.appendChild(ageRow);

            const lsRow = document.createElement('tr');
            lsRow.className = 'sub-row strategic_life_stage-detail';
            lsRow.innerHTML = `
                <td><div class="factor-name">└ Home Ownership Index</div></td>
                <td><span class="census-tag">B25003</span></td>
                <td>${((market.life_stage || 0.65) * 100).toFixed(1)}%</td>
                <td>${((market.life_stage || 0.65) * 1.05 * 100).toFixed(1)}%</td>
                <td>65.0%</td>
                <td><span class="multiplier-val" data-formula="(Market Owners * 1.05) / 0.65 Benchmark">${currentLsMult.toFixed(3)}x</span></td>
                <td>Raw Input</td>
            `;
            matrixBody.appendChild(lsRow);
        }
    });

    document.getElementById('final-strategic-value').innerText = totalMultiplier.toFixed(2) + 'x';

    // Update Fan Persona Delta
    let fanPersona = `The NBA fan persona for this calculation reflects an average age of ${fanAgeInput.toFixed(0)} with a household income of ${formatCurrency(fanHhiInput)}. This demographic profile prioritizes cultural influence and digital engagement in major markets.`;
    const fanPersonaEl = document.getElementById('fan-persona-delta-text');
    if (fanPersonaEl) fanPersonaEl.innerText = fanPersona;

    // Only update text if NOT edited by AI
    if (!currentPersonaTargets) {
        document.getElementById('persona-delta-text').innerText = brand.persona;

        let personaText = brand.persona + " Valuation adjusted for target demographic alignment.";
        if (zipCode && zipCode.length === 5) {
            personaText = `[ZIP ${zipCode} Analysis] ` + personaText;
        }
        document.getElementById('persona-delta-text').innerText = personaText;
    }
    document.getElementById('results-section').classList.remove('hidden');
    const pDelta = document.getElementById('persona-delta-section');
    if (pDelta) pDelta.classList.remove('hidden');

    // UI: Update Card Opacity
    updateActiveCardUI();
}

function updateActiveCardUI() {
    const nbaCard = document.getElementById('step-02-card');
    if (nbaCard) {
        nbaCard.classList.add('active-context');
    }
}

// Slider label update
document.getElementById('brand-target-diversity').addEventListener('input', (e) => {
    document.getElementById('diversity-focus-val').innerText = e.target.value + '%';
});

document.getElementById('brand-target-gender').addEventListener('input', (e) => {
    document.getElementById('gender-focus-val').innerText = e.target.value + '%';
});

document.getElementById('fan-target-diversity').addEventListener('input', (e) => {
    document.getElementById('fan-diversity-val').innerText = e.target.value + '%';
});

document.getElementById('fan-target-gender').addEventListener('input', (e) => {
    document.getElementById('fan-gender-val').innerText = e.target.value + '%';
});


document.getElementById('step-02-card').addEventListener('click', () => {
    // No mode change needed, always NBA
    calculateValuation();
});


document.querySelectorAll('.recalculate-trigger').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        // No context parameter needed, always NBA
        currentContext = 'nba';

        const originalText = btn.innerText;
        btn.innerText = 'Processing...';
        btn.disabled = true;
        try {
            await calculateValuation();
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
});

function formatValue(id, val) {
    if (id === 'strategic_life_stage' || id === 'strategic_affluence') return val.toFixed(3);
    if (id === 'hhi') return formatCurrency(val);
    if (id === 'reach' || id === 'loyalty_ltv') return val.toLocaleString(undefined, { maximumFractionDigits: 0 });
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
        document.getElementById('brand-target-diversity').value = brand.idealDiversity * 100;
        document.getElementById('diversity-focus-val').innerText = (brand.idealDiversity * 100) + '%';

        if (brand.idealEducation) document.getElementById('brand-target-education').value = brand.idealEducation;
        if (brand.idealGender) {
            document.getElementById('brand-target-gender').value = brand.idealGender;
            document.getElementById('gender-focus-val').innerText = brand.idealGender + '%';
        }

        // Removed priority auto-selection logic as UI was removed
        calculateValuation();
    }
});



// Sync initial brand state
const initialBrandName = document.getElementById('target-brand').value;
const initialBrand = brandProfiles[initialBrandName];
if (initialBrand) {
    document.getElementById('brand-target-age').value = initialBrand.idealAge;
    document.getElementById('brand-target-hhi').value = initialBrand.idealHhi;
    document.getElementById('brand-target-diversity').value = initialBrand.idealDiversity * 100;
    document.getElementById('diversity-focus-val').innerText = (initialBrand.idealDiversity * 100) + '%';
}

// Update team name, attendance, and branding based on selection
document.getElementById('market-dma').addEventListener('change', (e) => {
    const marketKey = e.target.value;
    const market = marketMapping[marketKey];
    // For hidden input, we don't have .options. Use the label from marketMapping if available.
    const label = market ? market.label : marketKey;
    const team = label.match(/\((.*?)\)/)?.[1] || "";
    // Sports Team input removed

    if (market && market.avg_attendance) {
        document.getElementById('team-attendance').value = market.avg_attendance;
    }

    updateTeamBranding(marketKey);
    calculateValuation();
});

function updateTeamBranding(marketKey) {
    const market = marketMapping[marketKey];
    const card = document.querySelector('.final-value-card');
    if (market && card) {
        card.style.backgroundColor = market.color || 'var(--primary-color)';
        card.style.color = market.textColor || 'white';

        const label = card.querySelector('label');
        if (label) {
            label.style.color = market.textColor === 'white' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)';
        }

        const badge = card.querySelector('.multiplier-badge');
        if (badge) {
            badge.style.background = market.textColor === 'white' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';
            badge.style.color = market.textColor || 'white';
        }
    }
}

// Sync initial team branding
const marketDmaEl = document.getElementById('market-dma');
const initialMarketKey = marketDmaEl.value;
const initialMarket = marketMapping[initialMarketKey];
// Handle case where market-dma might not be a select element anymore
const initialLabel = (marketDmaEl.tagName === 'SELECT')
    ? marketDmaEl.options[marketDmaEl.selectedIndex].text
    : (initialMarket ? initialMarket.label : initialMarketKey);
// Sports Team input removed
if (initialMarket && initialMarket.avg_attendance) {
    document.getElementById('team-attendance').value = initialMarket.avg_attendance;
}
updateTeamBranding(initialMarketKey);

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

// Listener for formula changes
document.getElementById('weighted-formula')?.addEventListener('change', () => {
    updatePersonaOrder();
    calculateValuation();
});

function updatePersonaOrder() {
    const formula = document.getElementById('weighted-formula').value;
    const container = document.getElementById('persona-sortable-container');
    const items = [...container.querySelectorAll('.draggable-persona-item')];

    let targetOrder = [];
    let allowDrag = false;

    if (formula === 'Balanced') {
        targetOrder = ['strategic_life_stage', 'strategic_affluence', 'education', 'multicultural', 'gender'];
    } else if (formula === 'Trajektory Weighting') {
        targetOrder = ['strategic_affluence', 'strategic_life_stage', 'education', 'gender', 'multicultural'];
    } else if (formula === 'Custom') {
        allowDrag = true;
    }

    // Apply fixed order if not custom
    if (!allowDrag) {
        targetOrder.forEach(id => {
            const item = items.find(el => el.getAttribute('data-factor-id') === id);
            if (item) container.appendChild(item);
        });
    }

    // Toggle drag handles and weights
    items.forEach((item, index) => {
        item.setAttribute('draggable', allowDrag);

        // Calculate weight for display
        let weight = 1.0;
        if (formula !== 'Balanced') {
            const currentItems = [...container.querySelectorAll('.draggable-persona-item')];
            const rank = currentItems.indexOf(item);
            weight = Math.exp(-0.6 * rank);
        }

        const weightBadge = item.querySelector('.weight-badge');
        if (weightBadge) {
            weightBadge.textContent = `W:${weight.toFixed(1)}`;
        }

        const handle = item.querySelector('.drag-handle');
        if (handle) {
            handle.style.opacity = allowDrag ? '1' : '0.2';
            handle.style.cursor = allowDrag ? 'grab' : 'default';
            handle.style.pointerEvents = allowDrag ? 'auto' : 'none';
        }
    });
}

// Call initially to set correct state
updatePersonaOrder();

// Initialize Sortable Persona Items
function initSortablePersona() {
    const container = document.getElementById('persona-sortable-container');
    const items = container.querySelectorAll('.draggable-persona-item');

    items.forEach(item => {
        item.addEventListener('dragstart', () => {
            item.classList.add('dragging');
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
            // Update weights after reordering
            updatePersonaOrder();
            // Trigger recalculation
            if (typeof calculateValuation === 'function') {
                calculateValuation();
            }
        });

        item.addEventListener('dragover', (e) => {
            if (document.getElementById('weighted-formula').value !== 'Custom') return;
            e.preventDefault();
            const draggingItem = container.querySelector('.dragging');
            const afterElement = getDragAfterElement(container, e.clientY);
            if (afterElement == null) {
                container.appendChild(draggingItem);
            } else {
                container.insertBefore(draggingItem, afterElement);
            }
        });
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable-persona-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

initSortablePersona();

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

// Auto-calculate on all valuation-relevant inputs
[
    'brand-target-age', 'brand-target-hhi', 'brand-target-diversity',
    'brand-target-education', 'brand-target-gender',
    'fan-target-age', 'fan-target-hhi', 'fan-target-diversity',
    'fan-target-education', 'fan-target-gender',
    'team-attendance'
].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => calculateValuation());
    }
});

calculateValuation();

// --- DISCOVERY ENGINE: Find Best Strategic Fit ---
let discoveryChartInstance = null;

// Helper to calculate total multiplier for scoring without updating UI
async function getMultiplierOnly(marketKey, ctx) {
    const market = await fetchCensusData(marketKey);
    let totalMultiplier = 1.0;

    factors.forEach(factor => {
        if (factor.id === 'loyalty_ltv' && ctx.assetType !== 'In-Venue') return;
        if (factor.id === 'digital' && ctx.assetType === 'Broadcast') return;
        if (factor.id === 'total_pop' && ctx.isEfficiency) return;
        if (factor.id === 'reach' && ctx.isEfficiency) return;

        const result = calculateFactorImpact(factor, market, ctx);
        totalMultiplier *= result.multiplier;
    });
    return totalMultiplier;
}

// Smart Calculation Routing
document.getElementById('smart-calculate-btn')?.addEventListener('click', async (e) => {
    const btn = e.target;
    const originalText = btn.innerText;

    // Check selection size
    if (selectedTeams.length > 1) {
        await runDiscovery(selectedTeams);
    } else {
        btn.innerText = 'Calculating...';
        btn.disabled = true;
        try {
            // Hide discovery results if showing single valuation
            document.getElementById('discovery-results').classList.add('hidden');
            await calculateValuation();
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    }
});

async function runDiscovery(teamKeys = null) {
    const btn = document.getElementById('smart-calculate-btn');
    const resultsDiv = document.getElementById('discovery-results');
    const originalText = btn.innerText;

    btn.innerText = `Analyzing ${teamKeys ? teamKeys.length : 30} Markets...`;
    btn.disabled = true;
    resultsDiv.classList.add('hidden');

    const idealAge = Math.max(1, parseFloat(document.getElementById('brand-target-age').value) || 35);
    const idealHhi = Math.max(5000, parseFloat(document.getElementById('brand-target-hhi').value) || 75000);
    const idealDiversity = parseFloat(document.getElementById('brand-target-diversity').value) / 100;
    const idealEducation = parseFloat(document.getElementById('brand-target-education').value) || 0.35;
    const idealGender = parseFloat(document.getElementById('brand-target-gender').value) || 50;
    const idealDigital = 0.85;

    const brandName = document.getElementById('target-brand').value;
    const brand = brandProfiles[brandName] || { targets: ['hhi'], persona: "" };
    const activeTargets = currentPersonaTargets || brand.targets;
    const assetType = document.getElementById('asset-name').value;
    const isEfficiency = document.getElementById('efficiency-toggle').checked;
    const isInternational = document.getElementById('international-toggle').checked;

    // Only NBA logic for fan inputs and benchmarks
    const fanAgeInput = parseFloat(document.getElementById('fan-target-age').value) || 38;
    const fanHhiInput = parseFloat(document.getElementById('fan-target-hhi').value) || 85000;
    const fanDiversityInput = parseFloat(document.getElementById('fan-target-diversity').value) / 100;
    const fanEduInput = parseFloat(document.getElementById('fan-target-education').value) || 0.35;
    const fanGenderInput = parseFloat(document.getElementById('fan-target-gender').value) || 50;
    const benchAge = 35;
    const benchHhi = 75000;
    const benchDiversity = 0.45;

    const weightedFormula = document.getElementById('weighted-formula')?.value || 'Trajektory Weighting';
    const ctx = {
        assetType, mode: 'nba', brandName, brand, activeTargets, // Hardcode mode to 'nba'
        fanAgeInput, fanHhiInput, fanDiversityInput, fanEduInput, fanGenderInput,
        idealAge, idealHhi, idealDiversity, idealDigital, idealEducation, idealGender,
        benchAge, benchHhi, benchDiversity,
        teamAttendance: 18324, // Placeholder for discovery loop if needed
        isInternational, isEfficiency, weightedFormula
    };

    let marketScores = [];

    try {
        // Use provided keys or fallback to all available options if none selected
        const citySelect = document.getElementById('market-dma');
        const keys = teamKeys && teamKeys.length > 0 ? teamKeys : Array.from(citySelect ? citySelect.options || [] : []).map(opt => opt.value).filter(v => v !== "");
        const total = keys.length;

        for (let i = 0; i < total; i++) {
            const key = keys[i];
            const progress = Math.round(((i + 1) / total) * 100);

            btn.style.setProperty('--progress', `${progress}%`);
            btn.innerText = `Analyzing ${i + 1}/${total} Markets...`;

            // Use the Discovery Engine with unified context
            const score = await getMultiplierOnly(key, ctx);

            // Map labels and colors from marketMapping if available, otherwise fallback
            const mapInfo = marketMapping[key] || { label: key.toUpperCase(), color: '#888' };
            marketScores.push({ key, score, label: mapInfo.label, color: mapInfo.color });
        }

        // Sort results
        marketScores.sort((a, b) => b.score - a.score);

        const avgScore = marketScores.reduce((acc, curr) => acc + curr.score, 0) / total;
        const chartData = marketScores.slice(0, 10);
        const mapData = marketScores;
        const winner = chartData[0];

        if (winner) {
            currentContext = 'nba'; // Hardcoded context for now as per function logic
            const citySelect = document.getElementById('market-dma');
            citySelect.value = winner.key;
            updateActiveCardUI();

            document.getElementById('winner-text').innerText = `Primary Match: ${winner.label}`;
            document.getElementById('winner-reason').innerText = `${isEfficiency ? '[Efficiency Mode] ' : ''}Highest strategic alignment for this brand's persona with a ${winner.score.toFixed(2)}x combined multiplier.`;
            resultsDiv.classList.remove('hidden');

            setTimeout(() => {
                renderTopFitChart(chartData);
                renderTopFitMap(mapData);
            }, 500);

            await calculateValuation();

            // OVERRIDE: Set card to Average Mode for Discovery Results
            const mainCard = document.querySelector('.final-value-card');
            if (mainCard) {
                mainCard.classList.add('discovery-avg-mode');
                document.getElementById('valuation-label').innerText = isEfficiency ? "Team Average Strategic Index" : "City Average Strategic Index";
                document.getElementById('final-strategic-value').innerText = avgScore.toFixed(2) + 'x';
            }

            resultsDiv.scrollIntoView({ behavior: 'smooth' });
        }
    } catch (err) {
        console.error(err);
        alert(`Discovery process interrupted: ${err.message}`);
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
        btn.style.setProperty('--progress', '0%');
    }
}

let discoveryMap = null;
let discoveryMarkers = [];

function renderTopFitMap(topN) {
    const mapDiv = document.getElementById('map-container');
    if (!mapDiv) return;

    if (!discoveryMap) {
        discoveryMap = L.map('map-container').setView([37.8, -96], 4);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(discoveryMap);
    }

    // Clear old markers
    discoveryMarkers.forEach(m => discoveryMap.removeLayer(m));
    discoveryMarkers = [];

    const bounds = L.latLngBounds();

    const coordCounts = {};

    topN.forEach((fit, index) => {
        const market = marketMapping[fit.key];
        if (market && market.lat) {
            let lat = market.lat;
            let lng = market.lng;
            const coordKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;

            if (coordCounts[coordKey]) {
                const shift = coordCounts[coordKey] * 0.35;
                lat += (index % 2 === 0 ? shift : -shift);
                lng += (index % 2 !== 0 ? shift : -shift);
            }
            coordCounts[coordKey] = (coordCounts[coordKey] || 0) + 1;
            const color = market.color || '#fff';

            // Normalized range (10-35px) for maximum dynamism regardless of total items
            const maxRadius = 35;
            const minRadius = 10;
            const rankRatio = topN.length > 1 ? (index / (topN.length - 1)) : 0;
            const dynamicRadius = maxRadius - (rankRatio * (maxRadius - minRadius));

            const marker = L.circleMarker([lat, lng], {
                radius: dynamicRadius,
                fillColor: color,
                color: '#fff',
                weight: 1.2, // Defined white stroke
                opacity: 1,
                fillOpacity: 0.85
            }).addTo(discoveryMap).bringToBack();

            // Hover Tooltip for instant value display
            marker.bindTooltip(`
                <div style="font-family: var(--font-heading); font-weight: 800; text-align: center; padding: 2px;">
                    <div style="font-size: 0.6rem; color: #888; text-transform: uppercase;">${index + 1}. ${fit.label}</div>
                    <div style="font-size: 1rem; color: #1667e9;">${fit.score.toFixed(2)}x</div>
                </div>
            `, {
                direction: 'top',
                offset: [0, -15]
            });

            marker.bindPopup(`
                <div style="color: #000; font-family: var(--font-body);">
                    <strong style="font-size: 1rem;">${index + 1}. ${fit.label}</strong><br>
                    <span style="font-size: 1.2rem; font-weight: 800; color: #1667e9;">${fit.score.toFixed(2)}x</span>
                </div>
            `);

            discoveryMarkers.push(marker);
            bounds.extend([market.lat, market.lng]);
        }
    });

    if (!bounds.isEmpty()) {
        discoveryMap.fitBounds(bounds, { padding: [50, 50] });
    }
}

document.getElementById('discovery-view-toggle').addEventListener('change', (e) => {
    const chartDiv = document.getElementById('chart-container');
    const mapDiv = document.getElementById('map-container');
    if (e.target.checked) {
        chartDiv.classList.add('hidden');
        mapDiv.classList.remove('hidden');
        if (discoveryMap) {
            setTimeout(() => {
                discoveryMap.invalidateSize();
            }, 100);
        }
    } else {
        chartDiv.classList.remove('hidden');
        mapDiv.classList.add('hidden');
    }
});

// updateActiveCardUI duplicate removed

function renderTopFitChart(top10) {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js library not found.');
        return;
    }

    const canvas = document.getElementById('top-fit-chart-canvas');
    if (!canvas) {
        console.error('Canvas element #top-fit-chart-canvas not found.');
        return;
    }

    const container = document.getElementById('chart-container');
    if (container) {
        container.style.position = 'relative';
        container.style.display = 'block';
    }

    const ctx = canvas.getContext('2d');

    if (container) {
        container.style.height = '400px';
    }

    if (discoveryChartInstance) {
        discoveryChartInstance.destroy();
    }

    // Explicitly set canvas dimensions
    canvas.width = container ? container.offsetWidth : 400;
    canvas.height = 400;

    const gradient = ctx.createLinearGradient(0, 0, 400, 0);
    gradient.addColorStop(0, 'rgba(22, 103, 233, 0.9)');
    gradient.addColorStop(1, 'rgba(112, 0, 255, 0.9)');

    console.log('Final Chart Data Check:', top10.map(m => ({ l: m.label, s: m.score })));

    try {
        discoveryChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: top10.map(m => (m.label || 'Unknown').split(',')[0]),
                datasets: [{
                    label: 'Strategic Multiplier',
                    data: top10.map(m => isFinite(m.score) ? m.score : 0),
                    backgroundColor: top10.map(m => m.color || gradient),
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    borderRadius: 3,
                    barThickness: 22
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                animation: {
                    duration: 800,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(10, 15, 30, 0.95)',
                        titleColor: '#fff',
                        titleFont: { family: 'Outfit', size: 14, weight: 'bold' },
                        bodyColor: '#fff',
                        bodyFont: { family: 'Inter', size: 13 },
                        borderColor: 'rgba(22, 103, 233, 0.3)',
                        borderWidth: 1,
                        padding: 15,
                        displayColors: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        boxPadding: 6,
                        usePointStyle: true,
                        callbacks: {
                            label: (context) => ` Strategic Multiplier: ${context.parsed.x.toFixed(2)}x`
                        }
                    }
                },
                onHover: (event, elements) => {
                    const canvas = event.chart.canvas;
                    canvas.style.cursor = elements && elements.length > 0 ? 'pointer' : 'default';
                },
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        const index = elements[0].index;
                        const fit = top10[index];
                        if (fit && fit.key) {
                            console.log(`Trajektory: Chart interaction - Drilling down into ${fit.label}`);

                            // Update the market context
                            const marketDmaInput = document.getElementById('market-dma');
                            marketDmaInput.value = fit.key;

                            // Sync branding colors (card and UI theme)
                            if (typeof updateTeamBranding === 'function') {
                                updateTeamBranding(fit.key);
                            }

                            // Trigger full valuation update to refresh Matrix Table and Cards
                            calculateValuation().then(() => {
                                // Specific feedback on the summary card
                                const mainCard = document.querySelector('.final-value-card');
                                if (mainCard) {
                                    mainCard.classList.remove('discovery-avg-mode');
                                    document.getElementById('valuation-label').innerText = "Strategic Market Index";
                                }

                                // Visual feedback: scroll to the specific metrics
                                const resultsSection = document.getElementById('results-section');
                                if (resultsSection) {
                                    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                            });
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.5)',
                            font: { family: 'Inter', size: 11 },
                            callback: (val) => val.toFixed(1) + 'x'
                        },
                        suggestedMin: 0
                    },
                    y: {
                        grid: { display: false },
                        ticks: {
                            color: '#fff',
                            font: { family: 'Outfit', size: 12, weight: '600' },
                            autoSkip: false
                        }
                    }
                }
            }
        });

        // Forced layout refresh
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
            discoveryChartInstance.update();
        }, 100);

    } catch (err) {
        console.error('Discovery Chart Render Error:', err);
    }
}


// --- TAB MANAGEMENT ---
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(`${btn.dataset.tab}-tab`).classList.add('active');
    });
});

// Mode Switching Logic: Assets vs Leagues vs Properties
document.getElementById('compare-option')?.addEventListener('change', (e) => {
    const mode = e.target.value;
    const discoveryBtn = document.getElementById('smart-calculate-btn');
    const leagueContextCard = document.getElementById('step-02-card');

    // Comparison Tab Elements
    const mainHeader = document.getElementById('comparison-main-header');
    const labelA = document.getElementById('compare-market-a-label');
    const labelB = document.getElementById('compare-market-b-label');
    const compareBtn = document.getElementById('compare-btn');

    // Update Discovery Button Text and Card Header
    if (mode === 'properties') {
        discoveryBtn.innerText = 'Calculate Strategic Fit';
        leagueContextCard.querySelector('h2').innerHTML = '<span class="step-num">02</span> League Context';
    } else if (mode === 'leagues') {
        discoveryBtn.innerText = 'Compare League Averages';
        leagueContextCard.querySelector('h2').innerHTML = '<span class="step-num">02</span> Discovery Scope (Leagues)';
    } else if (mode === 'assets') {
        discoveryBtn.innerText = 'Compare Asset Power';
        leagueContextCard.querySelector('h2').innerHTML = '<span class="step-num">02</span> Discovery Scope (Assets)';
    }

    // Update Comparison Tab Labels
    if (mainHeader) {
        if (mode === 'properties') {
            mainHeader.innerText = 'Market Benchmark Comparison';
            if (labelA) labelA.innerText = 'Market A (Benchmark)';
            if (labelB) labelB.innerText = 'Market B (Target)';
            if (compareBtn) compareBtn.innerText = 'Analyze Market Delta';
        } else if (mode === 'leagues') {
            mainHeader.innerText = 'League Index Comparison';
            if (labelA) labelA.innerText = 'League A (Primary)';
            if (labelB) labelB.innerText = 'League B (Secondary)';
            if (compareBtn) compareBtn.innerText = 'Run League Differential';
        } else if (mode === 'assets') {
            mainHeader.innerText = 'Asset Performance Comparison';
            if (labelA) labelA.innerText = 'Asset A (Primary)';
            if (labelB) labelB.innerText = 'Asset B (Secondary)';
            if (compareBtn) compareBtn.innerText = 'Analyze Asset Variance';
        }
    }
});

// Auto-refresh based on global strategy changes
['target-brand', 'efficiency-toggle', 'international-toggle', 'compare-option'].forEach(id => {
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
        if (isEfficiency && (factor.id === 'reach')) return;

        const valA = marketA[factor.id] || factor.us_avg;
        const valB = marketB[factor.id] || factor.us_avg;

        // Scoring Logic per factor
        const getScore = (val) => {
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

    renderComparisonChart(marketA, marketB, labelA, labelB, brand.targets);

    document.getElementById('comparison-results').classList.remove('hidden');
}

let comparisonChart = null;
function renderComparisonChart(marketA, marketB, labelA, labelB, targets) {
    const ctx = document.getElementById('comparisonChart').getContext('2d');
    if (comparisonChart) comparisonChart.destroy();

    const chartFactors = factors.filter(f => f.id !== 'total_pop');

    // Shorten labels for chart
    const labels = chartFactors.map(f => f.label.replace('Strategic ', ''));

    comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: labelA.split(',')[0],
                    data: chartFactors.map(f => marketA[f.id] || 1),
                    backgroundColor: marketMapping[document.getElementById('compare-market-a').value].color || '#1667e9',
                    borderRadius: 4,
                },
                {
                    label: labelB.split(',')[0],
                    data: chartFactors.map(f => marketB[f.id] || 1),
                    backgroundColor: marketMapping[document.getElementById('compare-market-b').value].color || '#7000ff',
                    borderRadius: 4,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y', // HORIZONTAL
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: '#fff', font: { family: 'Outfit', size: 10 } }
                },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 10 } }
                },
                y: {
                    grid: { display: false },
                    ticks: { color: '#fff', font: { weight: '600', size: 11 } }
                }
            }
        }
    });
}


document.getElementById('compare-btn').addEventListener('click', calculateComparison);

// --- THEME MANAGEMENT ---
const themeSwitch = document.getElementById('theme-switch');
const themeIcon = document.getElementById('theme-icon');

function toggleTheme() {
    const isLight = document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme', !isLight);
    themeIcon.innerText = isLight ? '☀️' : '🌙';
    localStorage.setItem('census-theme', isLight ? 'light' : 'dark');
}

themeSwitch.addEventListener('click', toggleTheme);

// Initialization: Populate Comparison Dropdowns & Load Theme
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('census-theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
        themeIcon.innerText = '☀️';
    }

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

    // Initial load
    calculateValuation();
});

// --- REAL AI: Gemini Strategic Interpretation ---
async function performAIAdjustment() {
    const text = document.getElementById('persona-delta-text').innerText.trim();
    const status = document.getElementById('ai-status');
    const header = document.getElementById('ai-affected-header');
    const listContainer = document.getElementById('affected-factors-list');

    if (!text || text.length < 5) return;

    status.innerText = 'AI Thinking...';
    status.classList.add('working');

    // List of factors Gemini should know about
    const factorContext = factors.map(f => `- ${f.id}: ${f.label} (Impact: ${f.impact})`).join('\n');

    const prompt = `
        System: You are an expert sports sponsorship and demographic analyst for the NBA.
        Task: Analyze the brand persona description below and identify which specific strategic factors from the provided list should be prioritized (targeted) for this brand's market valuation.

        Brand Persona: "${text}"

        Available Strategic Factors to choose from:
        ${factorContext}

        Instructions:
        1. Identify the 2-4 most relevant factor IDs based on the brand's goals (e.g., if they mention "young" or "families", pick life_stage or hh_structure).
        2. Return ONLY a valid JSON array of strings containing the 'id' of the matching factors.
        3. Do not include any text before or after the JSON.
        
        Example Output: ["strategic_affluence", "digital", "loyalty_ltv"]
    `;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            console.error('Gemini API Error details:', {
                status: response.status,
                statusText: response.statusText,
                body: errorBody
            });
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const rawResponse = data.candidates[0].content.parts[0].text.trim();

        // Sanitize and Parse
        const jsonMatch = rawResponse.match(/\[.*\]/s);
        const newTargets = jsonMatch ? JSON.parse(jsonMatch[0].replace(/`/g, '')) : [];

        currentPersonaTargets = newTargets.length > 0 ? newTargets : null;
        status.innerText = currentPersonaTargets ? 'Gemini Updated' : 'Reset';

        listContainer.innerHTML = '';
        if (currentPersonaTargets) {
            currentPersonaTargets.forEach(id => {
                const f = factors.find(fact => fact.id === id);
                if (f) {
                    const tag = document.createElement('span');
                    tag.innerText = f.label;
                    tag.style.cssText = 'font-size: 0.65rem; background: rgba(0, 255, 136, 0.1); color: #00ff88; padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(0, 255, 136, 0.3); font-weight: 600;';
                    listContainer.appendChild(tag);
                }
            });
            header.style.display = 'block';
        } else {
            header.style.display = 'none';
        }

        // Trigger immediate recalculation
        calculateValuation();
    } catch (err) {
        console.error('Gemini Error:', err);
        status.innerText = 'AI Offline';
    } finally {
        status.classList.remove('working');
    }
}

document.getElementById('persona-delta-text').addEventListener('blur', performAIAdjustment);

document.getElementById('target-brand').addEventListener('change', (e) => {
    currentPersonaTargets = null;
    const brand = brandProfiles[e.target.value];
    if (brand) {
        document.getElementById('persona-delta-text').innerText = brand.persona;
        document.getElementById('ai-status').innerText = 'Ready';
        document.getElementById('ai-affected-header').style.display = 'none';
        calculateValuation();
    }
});

// --- VIEW TOGGLE LOGIC ---
document.getElementById('matrix-view-toggle').addEventListener('change', (e) => {
    const tableView = document.getElementById('matrix-table-view');
    const cardsView = document.getElementById('matrix-cards-view');

    if (e.target.checked) {
        tableView.classList.add('hidden');
        cardsView.classList.remove('hidden');
    } else {
        tableView.classList.remove('hidden');
        cardsView.classList.add('hidden');
    }
});

// --- CUSTOM MULTI-SELECT FOR TEAMS ---
let selectedTeams = ['chicago'];

function initTeamMultiSelect() {
    console.log('Trajektory: Initializing Team Multi-Select Component');
    const container = document.getElementById('team-multi-select-container');
    const searchInput = document.getElementById('team-search');
    const dropdown = document.getElementById('team-dropdown-content');
    const leagueContainer = document.getElementById('league-list-container');
    const tagsContainer = document.getElementById('selected-tags');
    const hiddenInput = document.getElementById('market-dma');

    if (!container || !searchInput || !dropdown || !leagueContainer) {
        console.warn('Trajektory Error: Multi-select elements missing from DOM', { container, searchInput, dropdown, leagueContainer });
        return;
    }

    // Build the dropdown structure
    leagueContainer.innerHTML = '';
    Object.keys(LEAGUES).forEach(leagueName => {
        const section = document.createElement('div');
        section.className = 'league-section';
        section.innerHTML = `
            <div class="league-row">
                <input type="checkbox" id="league-check-${leagueName}" class="league-checkbox">
                <label for="league-check-${leagueName}">${leagueName}</label>
                <i class="expand-icon">▼</i>
            </div>
            <div class="team-items"></div>
        `;

        const teamItems = section.querySelector('.team-items');
        LEAGUES[leagueName].forEach(teamKey => {
            const team = marketMapping[teamKey];
            if (!team) return;
            const teamRow = document.createElement('div');
            teamRow.className = 'team-row';
            teamRow.dataset.key = teamKey;
            teamRow.innerHTML = `
                <input type="checkbox" class="team-checkbox" ${selectedTeams.includes(teamKey) ? 'checked' : ''}>
                <label>${team.label}</label>
            `;
            teamItems.appendChild(teamRow);
        });

        leagueContainer.appendChild(section);

        // Expand/Collapse logic
        section.querySelector('label').addEventListener('click', (e) => {
            e.preventDefault();
            section.classList.toggle('expanded');
        });
        section.querySelector('.expand-icon').addEventListener('click', () => {
            section.classList.toggle('expanded');
        });

        // League Select All logic
        const leagueCheck = section.querySelector('.league-checkbox');
        leagueCheck.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            const teamChecks = section.querySelectorAll('.team-checkbox');
            teamChecks.forEach(tc => {
                tc.checked = isChecked;
                const teamKey = tc.closest('.team-row').dataset.key;
                toggleTeamSelection(teamKey, isChecked, false);
            });
            updateSelectionState();
        });
    });

    // Delegate Team Checkbox logic
    leagueContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('team-checkbox')) {
            const teamKey = e.target.closest('.team-row').dataset.key;
            toggleTeamSelection(teamKey, e.target.checked, true);
        }
    });

    // Search logic
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const allTeamRows = leagueContainer.querySelectorAll('.team-row');
        allTeamRows.forEach(row => {
            const label = row.querySelector('label').innerText.toLowerCase();
            row.style.display = label.includes(term) ? 'flex' : 'none';
        });
        // Auto-expand sections that have visible items
        const allSections = leagueContainer.querySelectorAll('.league-section');
        allSections.forEach(sec => {
            const hasVisible = Array.from(sec.querySelectorAll('.team-row')).some(r => r.style.display !== 'none');
            if (term && hasVisible) sec.classList.add('expanded');
            else if (!term) sec.classList.remove('expanded');
        });
    });

    // Toggle dropdown
    container.addEventListener('click', (e) => {
        // Don't toggle if clicking inside the dropdown content itself or on a remove-tag button
        if (dropdown.contains(e.target) || e.target.classList.contains('remove-tag')) return;

        // If clicking the search input, always ensure it's open (focus), don't toggle it closed
        if (e.target === searchInput) {
            if (dropdown.classList.contains('hidden')) {
                dropdown.classList.remove('hidden');
                container.classList.add('open');
            }
            return;
        }

        // Toggle for everything else (container background, arrow, tags container)
        const isHidden = dropdown.classList.toggle('hidden');
        container.classList.toggle('open', !isHidden);
    });

    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            dropdown.classList.add('hidden');
            container.classList.remove('open');
        }
    });

    document.getElementById('clear-teams').addEventListener('click', () => {
        selectedTeams = [];
        const allChecks = leagueContainer.querySelectorAll('input[type="checkbox"]');
        allChecks.forEach(c => c.checked = false);
        updateSelectionState();
    });

    updateSelectionState();

    function toggleTeamSelection(key, isSelected, updateUI) {
        if (isSelected) {
            if (!selectedTeams.includes(key)) selectedTeams.push(key);
        } else {
            selectedTeams = selectedTeams.filter(t => t !== key);
        }
        if (updateUI) updateSelectionState();
    }

    function updateSelectionState() {
        // Update tags
        tagsContainer.querySelectorAll('.tag-chip').forEach(tag => tag.remove());
        selectedTeams.forEach(key => {
            const team = marketMapping[key];
            if (!team) return;
            const chip = document.createElement('div');
            chip.className = 'tag-chip';
            chip.innerHTML = `
                ${team.label.split('(')[1] ? team.label.split('(')[1].replace(')', '') : team.label.split(',')[0]}
                <span class="remove-tag" data-key="${key}">×</span>
            `;
            chip.querySelector('.remove-tag').addEventListener('click', (e) => {
                e.stopPropagation();
                toggleTeamSelection(key, false, true);
                // Uncheck in dropdown
                const check = leagueContainer.querySelector(`.team-row[data-key="${key}"] .team-checkbox`);
                if (check) check.checked = false;
            });
            tagsContainer.insertBefore(chip, searchInput);
        });

        // Update hidden field for compatibility
        hiddenInput.value = selectedTeams.join(',');

        // Update League portfolio checkboxes (partial state)
        Object.keys(LEAGUES).forEach(l => {
            const leagueCheck = document.getElementById(`league-check-${l}`);
            const total = LEAGUES[l].length;
            const selectedCount = LEAGUES[l].filter(tk => selectedTeams.includes(tk)).length;
            leagueCheck.checked = selectedCount === total && total > 0;
            leagueCheck.indeterminate = selectedCount > 0 && selectedCount < total;
        });

        // Trigger calculation
        calculateValuation();
    }
}

// Initial Call
initTeamMultiSelect();

function flipCard(card) {
    card.classList.toggle('flipped');
}

function toggleSubRows(factorId, btn) {
    const isExpanded = btn.classList.contains('expanded');
    const details = document.querySelectorAll(`.${factorId}-detail`);

    btn.classList.toggle('expanded');
    btn.innerText = isExpanded ? '▶' : '▼';

    details.forEach(row => {
        row.classList.toggle('hidden-sub-row', isExpanded);
    });
}
