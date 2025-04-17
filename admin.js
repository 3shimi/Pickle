document.getElementById('add-court-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    const formData = new FormData(event.target);
    const courtData = {};
    formData.forEach((value, key) => {
        // Convert numeric fields from string to number
        if (key === 'lat' || key === 'lng') {
            courtData[key] = parseFloat(value);
        } else {
            courtData[key] = value;
        }
    });

    // Find the next available ID (simple approach, assumes IDs are sequential)
    // In a real application, this should be handled server-side or by reading data.js
    // For now, we'll just use a placeholder or require manual ID input
    // Let's assume we need to manually add the ID for now.
    const nextId = 'NEW_ID'; // Placeholder - user needs to replace this manually

    // Format the data as a string for data.js
    const outputString = `  {
    id: ${nextId}, // <-- Replace NEW_ID with the next available ID
    city: "${courtData.city}",
    name: "${courtData.name}",
    address: "${courtData.address || ''}",
    hours: "${courtData.hours}",
    indoor: "${courtData.indoor}",
    fee: "${courtData.fee}",
    notes: "${courtData.notes || ''}",
    lat: ${courtData.lat},
    lng: ${courtData.lng}
  },`;

    // Display the generated string
    document.getElementById('output').textContent = outputString;
});