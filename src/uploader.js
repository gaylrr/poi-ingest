const { sleep } = require('./utils')

const uploadPOI = async (row, apiUrl, apiKey, dryRun) => {
    const body = {
        name: row.name,
        lat: parseFloat((row.latitude || '').replace(/,/g, '')),
        lng: parseFloat((row.longitude || '').replace(/,/g, '')),
        category: row.category,
        address: [row.barangay, row.city, row.province]
            .filter(v => v && v.trim() !== '' && v.trim() !== 'N/A')
            .join(', ') || 'N/A',
        barangay: row.barangay || 'N/A',
        city: row.city,
        province: row.province || 'N/A',
        region: row.region || 'N/A',
    }

    if (dryRun) {
        return { success: true, dryRun: true }
    }
    let attempt = 0;
    const maxRetries = 3;

while (attempt < maxRetries) {
    try {
        const res = await fetch(`${apiUrl}/api/pois`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey
        },
            body: JSON.stringify(body)
        });

        if (res.ok) return { success: true }

        if (res.status === 429 || res.status >= 500) {
            attempt++
            const waitMs = 500 * Math.pow(2, attempt)
            await sleep(waitMs)
            continue;
        }

        return { success: false, reason: `HTTP ${res.status}` }

    } catch (err) {
        attempt++
        await sleep(500 * Math.pow(2, attempt))
        continue;
        }
    }
return { success: false, reason: 'max retries exceeded' }
}

module.exports = { uploadPOI }