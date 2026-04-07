const {sleep} = require ('./utils')

const uploadPOI = async (row, apiUrl, apiKey, dryRun) => {
    const body = {
        name: row.name,
        lat: parseFloat(row.latitude),
        lng: parseFloat(row.longitude),
        category: row.category,
        landmark: row.landmark || '', // use empty string instead of crashing 
        address: row.address,
        barangay: row.barangay,
        city: row.city,
        province: row.province || '',
        region: row.region || ''
    }

if (dryRun) {
    return { success: true, dryRun: true }
}
let attempt = 0;
const maxRetries = 3;

while(attempt < maxRetries) {
    const res = await fetch (`${apiUrl}/api/pois`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey
        },
        body: JSON.stringify(body)
    });
    if (res.ok) return {success:true}

    if (res.status === 429 || res.status >= 500){
        attempt++
        const waitMs= 500 * Math.pow(2, attempt)
        await sleep(waitMs)
        continue;
    }
    return {success: false , reason: `HTTP ${res.status}`}
}
    return {success: false, reason: 'max retries exceeded'}
}
module.exports = {uploadPOI}

