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
cities.forEach(city => {
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
        const cityMatch = selectedCity === 'all' || court.city.includes(selectedCity);
        const indoorMatch = selectedIndoor === 'all' || court.indoor === selectedIndoor;
        const feeMatch = selectedFee === 'all' || court.fee === selectedFee;
        
        return cityMatch && indoorMatch && feeMatch;
    });
    
    // Add filtered markers to the map
    addMarkersToMap(filteredCourts);
}

// Function to add markers to the map
function addMarkersToMap(courts) {
    courts.forEach(court => {
        // Create marker
        const marker = L.marker([court.lat, court.lng]);
        
        // Create popup content
        const popupContent = `
            <div class="popup-content">
                <h3>${court.name}</h3>
                <p><strong>城市 (City):</strong> ${court.city}</p>
                <p><strong>地址 (Address):</strong> ${court.address || '未提供'}</p>
                <p><strong>開放時間 (Hours):</strong> ${court.hours}</p>
                <p><strong>室內/室外 (Indoor/Outdoor):</strong> ${court.indoor}</p>
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
    });
    
    // Add markers to map
    map.addLayer(markers);
}

// Function to show court info in the sidebar
function showCourtInfo(court) {
    const courtInfo = document.getElementById('court-info');
    
    courtInfo.innerHTML = `
        <h2>場地資訊 (Court Information)</h2>
        <div class="court-details">
            <h3>${court.name}</h3>
            <p><span class="label">城市 (City):</span> ${court.city}</p>
            <p><span class="label">地址 (Address):</span> ${court.address || '未提供'}</p>
            <p><span class="label">開放時間 (Hours):</span> ${court.hours}</p>
            <p><span class="label">室內/室外 (Indoor/Outdoor):</span> ${court.indoor}</p>
            <p><span class="label">收費 (Fee):</span> ${court.fee}</p>
            ${court.notes ? `<p><span class="label">備註 (Notes):</span> ${court.notes}</p>` : ''}
        </div>
    `;
}

// Add event listeners to filters
document.getElementById('city-filter').addEventListener('change', filterCourts);
document.getElementById('indoor-filter').addEventListener('change', filterCourts);
document.getElementById('fee-filter').addEventListener('change', filterCourts);

// Initialize map with all courts
addMarkersToMap(pickleballCourts);

// Show instructions initially
document.getElementById('court-info').innerHTML = `
    <h2>場地資訊 (Court Information)</h2>
    <p>點擊地圖上的標記以查看詳細資訊 (Click on a marker to view details)</p>
    <p>使用上方的篩選器來過濾場地 (Use the filters above to filter courts)</p>
    <p>總共顯示 ${pickleballCourts.length} 個匹克球場地 (Showing ${pickleballCourts.length} pickleball courts)</p>
`;