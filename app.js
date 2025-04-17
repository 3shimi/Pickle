// Initialize the map centered on Taiwan
const map = L.map('map').setView([23.7, 121], 7);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
}).addTo(map);

// Initialize marker cluster group
const markers = L.markerClusterGroup();

// Populate city filter dropdown
const cityFilter = document.getElementById('city-filter');
const uniqueCities = [...new Set(pickleballCourts.map(court => {
    // Extract base city/county name (e.g., "台北市", "新北市", "台中市", "彰化縣")
    // Handles cases like "台北市信義區" -> "台北市", "新北市三重區" -> "新北市"
    const match = court.city.match(/^[^市縣]+[市縣]/);
    return match ? match[0] : court.city; // Return matched base name or original if no match
}))];

// Define the desired order of cities (North to South, East, Islands)
// Define the desired order of cities based on data.js format (North to South, East)
const cityOrder = [
    "基隆市", "台北市", "新北市", "桃園市", "新竹市", "新竹縣", // North (Assuming Hsinchu County exists in new data)
    "台中市", "彰化縣", "南投縣", "雲林縣",                   // Central (Assuming Yunlin County exists)
    "嘉義市", "台南市", "高雄市", "屏東縣",                   // South (Assuming Kaohsiung City exists)
    "宜蘭縣", "花蓮縣"                                        // East
    // Add other cities/counties if they appear in the new data.js
    // e.g., "苗栗縣", "台東縣", "澎湖縣", "金門縣", "連江縣" if needed
];

// Sort cities based on the defined order
const sortedCities = cityOrder.filter(city => uniqueCities.includes(city))
    .concat(uniqueCities.filter(city => !cityOrder.includes(city))
    .sort((a, b) => {
        const aInOrder = cityOrder.indexOf(a);
        const bInOrder = cityOrder.indexOf(b);
        
        // Both in order - sort by predefined order
        if (aInOrder !== -1 && bInOrder !== -1) return aInOrder - bInOrder;
        // Only a in order - a comes first
        if (aInOrder !== -1) return -1;
        // Only b in order - b comes first
        if (bInOrder !== -1) return 1;
        // Neither in order - sort alphabetically
        return a.localeCompare(b, 'zh-Hant');
    }));

// Verify sorted cities order
console.log('Sorted cities:', sortedCities);

// Add sorted cities to the dropdown
sortedCities.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    cityFilter.appendChild(option);
});

// Function to filter courts based on selected criteria
function filterCourts() {
    const selectedCity = document.getElementById('city-filter').value;
    const selectedIndoor = document.getElementById('indoor-filter').value;
    const selectedFee = document.getElementById('fee-filter').value;
    
    // Clear existing markers
    markers.clearLayers();
    
    // Filter courts based on selected criteria
    const filteredCourts = pickleballCourts.filter(court => {
        // Check if the full city name in data starts with the selected base city name from dropdown
        const cityMatch = selectedCity === 'all' || court.city.startsWith(selectedCity);
        const indoorMatch = selectedIndoor === 'all' || court.type === selectedIndoor;
        const feeMatch = selectedFee === 'all' || court.fee === selectedFee;
        
        return cityMatch && indoorMatch && feeMatch;
    });
    
    // Add filtered markers to the map
    addMarkersToMap(filteredCourts);
}

// Function to add markers to the map
function addMarkersToMap(courts) {
    let courtsWithCoords = 0;
    courts.forEach(court => {
        // Only add marker if lat and lng are available
        if (court.lat !== null && court.lng !== null) {
            courtsWithCoords++;
            // Create marker
            const marker = L.marker([court.lat, court.lng]);
            
            // Create popup content
            const popupContent = `
                <div class="popup-content">
                    <h3>${court.name}</h3>
                    <p><strong>城市 (City):</strong> ${court.city}</p>
                    <p><strong>開放時間 (Hours):</strong> ${court.hours}</p>
                    <p><strong>類型 (Type):</strong> ${court.type}</p>
                    <p><strong>收費 (Fee):</strong> ${court.fee}</p>
                    ${court.notes ? `<p><strong>備註 (Notes):</strong> ${court.notes}</p>` : ''}
                </div>
            `;
            
            // Bind popup to marker
            marker.bindPopup(popupContent);
            
            // Add click event to show court info in the sidebar
            marker.on('click', function() {
                showCourtInfo(court);
            });
            
            // Add marker to cluster group
            markers.addLayer(marker);
        }
    });
    
    // Add markers to map
    map.addLayer(markers);
    
    // Update initial info message with count of plotted courts
    updateInitialInfo(courtsWithCoords);
}

// Function to show court info in the sidebar
function showCourtInfo(court) {
    const courtInfo = document.getElementById('court-info');
    
    courtInfo.innerHTML = `
        <h2>場地資訊 (Court Information)</h2>
        <div class="court-details">
            <h3>${court.name}</h3>
            <p><span class="label">城市 (City):</span> ${court.city}</p>
            <p><span class="label">開放時間 (Hours):</span> ${court.hours}</p>
            <p><span class="label">類型 (Type):</span> ${court.type}</p>
            <p><span class="label">收費 (Fee):</span> ${court.fee}</p>
            ${court.notes ? `<p><span class="label">備註 (Notes):</span> ${court.notes}</p>` : ''}
            ${court.lat && court.lng ? `<p><span class="label">座標 (Coords):</span> ${court.lat.toFixed(5)}, ${court.lng.toFixed(5)}</p>` : '<p><span class="label">座標 (Coords):</span> 未提供 (Not Available)</p>'}
        </div>
    `;
}

// Add event listeners to filters
document.getElementById('city-filter').addEventListener('change', filterCourts);
document.getElementById('indoor-filter').addEventListener('change', filterCourts);
document.getElementById('fee-filter').addEventListener('change', filterCourts);

// Function to update the initial/default info panel message
function updateInitialInfo(count) {
    document.getElementById('court-info').innerHTML = `
        <h2>場地資訊 (Court Information)</h2>
        <p>點擊地圖上的標記以查看詳細資訊 (Click on a marker to view details)</p>
        <p>使用上方的篩選器來過濾場地 (Use the filters above to filter courts)</p>
        <p>地圖上顯示 ${count} 個匹克球場地 (Showing ${count} pickleball courts on the map)</p>
        <p>(總資料 ${pickleballCourts.length} 筆，部分場地無座標資訊) (Total ${pickleballCourts.length} records, some lack coordinates)</p>
    `;
}

// Initialize map with all courts
addMarkersToMap(pickleballCourts);

// Show instructions initially (will be updated by addMarkersToMap)
updateInitialInfo(0); // Initial call, count will be updated