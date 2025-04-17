require('dotenv').config(); // Load .env file variables

const fs = require('fs');
const csv = require('csv-parser');
const NodeGeocoder = require('node-geocoder');

// --- Geocoder Configuration ---

// Configure OSM Geocoder
const osmOptions = {
  provider: 'openstreetmap',
  formatter: null,
  timeout: 5000 // Add a timeout for OSM requests
};
const osmGeocoder = NodeGeocoder(osmOptions);

// Configure Google Geocoder
const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
let googleGeocoder = null;

if (!googleApiKey) {
  console.warn('WARN: GOOGLE_MAPS_API_KEY not found in environment variables. Google Maps fallback will be disabled.');
} else {
  const googleOptions = {
    provider: 'google',
    apiKey: googleApiKey,
    formatter: null,
    timeout: 5000 // Add a timeout for Google requests
  };
  googleGeocoder = NodeGeocoder(googleOptions);
  console.log('INFO: Google Maps Geocoder initialized.');
}

// --- Data Processing ---

const results = [];
const geocodePromises = [];
let processedCount = 0;
let successOSM = 0;
let successGoogle = 0;
let failedBoth = 0;

console.log('INFO: Starting CSV processing...');

fs.createReadStream('Pickleball Courts.csv')
  .pipe(csv({
    mapHeaders: ({ header, index }) => {
      // Remove BOM from the first header if present
      if (index === 0 && header.charCodeAt(0) === 0xFEFF) {
        return header.substring(1);
      }
      return header.trim(); // Trim headers as well
    }
  }))
  .on('data', (data) => {
    processedCount++;
    const currentId = parseInt(data['序號']);
    // Basic validation
    if (!data['城市'] || !data['匹克球場地'] || isNaN(currentId)) {
        console.warn(`WARN: Skipping row ${processedCount} due to missing City, Name, or invalid ID:`, data);
        return; // Skip this row if essential data is missing
    }

    const address = `${data['城市']} ${data['匹克球場地']}`.trim();
    const courtData = {
        id: currentId,
        city: data['城市'].trim(), // Use original city name from CSV, trimmed
        name: data['匹克球場地'].trim(),
        hours: data['開放時間'] ? data['開放時間'].trim() : '未知',
        type: data['室內/戶外'] ? data['室內/戶外'].trim() : '未知',
        fee: data['收費'] === '是' ? '是' : '否',
        notes: data['備註'] ? data['備註'].trim() : '',
        lat: null,
        lng: null
    };

    // Geocoding promise with fallback logic
    const geocodePromise = osmGeocoder.geocode(address)
      .then(osmRes => {
        if (osmRes && osmRes.length > 0) {
          courtData.lat = osmRes[0].latitude;
          courtData.lng = osmRes[0].longitude;
          successOSM++;
          console.log(`(${processedCount}) OSM Success: [${courtData.id}] ${address} -> ${courtData.lat.toFixed(5)}, ${courtData.lng.toFixed(5)}`);
          return courtData; // OSM succeeded
        } else {
          // OSM failed (0 results), try Google if available
          console.warn(`(${processedCount}) OSM Failed (0 results): [${courtData.id}] ${address}. Trying Google...`);
          if (googleGeocoder) {
            return googleGeocoder.geocode(address)
              .then(googleRes => {
                if (googleRes && googleRes.length > 0) {
                  courtData.lat = googleRes[0].latitude;
                  courtData.lng = googleRes[0].longitude;
                  successGoogle++;
                  console.log(`(${processedCount}) Google Success: [${courtData.id}] ${address} -> ${courtData.lat.toFixed(5)}, ${courtData.lng.toFixed(5)}`);
                } else {
                  failedBoth++;
                  console.error(`(${processedCount}) Google Failed (0 results): [${courtData.id}] ${address}`);
                }
                return courtData; // Return data even if Google failed
              })
              .catch(googleErr => {
                failedBoth++;
                console.error(`(${processedCount}) Google Error for [${courtData.id}] ${address}: ${googleErr.message}`);
                return courtData; // Return data even on Google error
              });
          } else {
            // Google geocoder not available
            failedBoth++;
            console.warn(`(${processedCount}) Google Geocoder unavailable. Skipping fallback for [${courtData.id}] ${address}.`);
            return courtData; // Return data without Google attempt
          }
        }
      })
      .catch(osmErr => {
        // OSM Error, try Google if available
        console.error(`(${processedCount}) OSM Error for [${courtData.id}] ${address}: ${osmErr.message}. Trying Google...`);
        if (googleGeocoder) {
          return googleGeocoder.geocode(address)
            .then(googleRes => {
              if (googleRes && googleRes.length > 0) {
                courtData.lat = googleRes[0].latitude;
                courtData.lng = googleRes[0].longitude;
                successGoogle++;
                console.log(`(${processedCount}) Google Success (after OSM error): [${courtData.id}] ${address} -> ${courtData.lat.toFixed(5)}, ${courtData.lng.toFixed(5)}`);
              } else {
                failedBoth++;
                console.error(`(${processedCount}) Google Failed (after OSM error): [${courtData.id}] ${address}`);
              }
              return courtData; // Return data even if Google failed
            })
            .catch(googleErr => {
              failedBoth++;
              console.error(`(${processedCount}) Google Error (after OSM error) for [${courtData.id}] ${address}: ${googleErr.message}`);
              return courtData; // Return data even on Google error
            });
        } else {
          // Google geocoder not available
          failedBoth++;
          console.warn(`(${processedCount}) Google Geocoder unavailable. Skipping fallback for [${courtData.id}] ${address} after OSM error.`);
          return courtData; // Return data without Google attempt
        }
      })
      .then(finalCourtData => {
          // Ensure data is always pushed, regardless of geocoding outcome
          if (finalCourtData) { // finalCourtData should always be the courtData object here
              results.push(finalCourtData);
          } else {
              // This case should ideally not happen with the current logic, but as a safeguard:
              console.error(`(${processedCount}) ERROR: finalCourtData was unexpectedly null for ID ${courtData.id}. Pushing original data.`);
              results.push(courtData); // Push original data if something went wrong
          }
      });

    geocodePromises.push(geocodePromise);
  })
  .on('error', (err) => {
      console.error('ERROR reading CSV file:', err);
  })
  .on('end', async () => {
    console.log('INFO: CSV file successfully processed. Waiting for all geocoding requests to complete...');

    // Wait for all geocoding promises to settle (either resolve or reject)
    // Using Promise.allSettled might be better if we wanted detailed error info per promise,
    // but Promise.all works here because we handle errors within each promise chain and always resolve with courtData.
    await Promise.all(geocodePromises);

    console.log('INFO: All geocoding attempts finished.');

    // Sort results by ID to maintain original order (or ensure consistency)
    results.sort((a, b) => a.id - b.id);

    const jsContent = `// Taiwan Pickleball Courts Data (Generated: ${new Date().toISOString()})
const pickleballCourts = ${JSON.stringify(results, null, 2)};`;

    try {
        fs.writeFileSync('data.js', jsContent);
        console.log('\n--- Conversion Summary ---');
        console.log(`Total rows processed from CSV: ${processedCount}`);
        console.log(`Courts written to data.js: ${results.length}`);
        console.log(`Geocoding Success (OSM): ${successOSM}`);
        console.log(`Geocoding Success (Google Fallback): ${successGoogle}`);
        console.log(`Geocoding Failed (Both/Unavailable): ${failedBoth}`);
        console.log('--------------------------');
        console.log('SUCCESS: Conversion completed! Data saved to data.js');
    } catch (writeErr) {
        console.error('ERROR writing data.js file:', writeErr);
    }
  });