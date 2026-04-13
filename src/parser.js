const fs = require('fs')

// CSV parser (unchanged)
const splitLine = (line) => {
    const result = []
    let current = ''
    let insideQuote = false

    for (let i = 0; i < line.length; i++) {
        const char = line[i]

        if (char === '"') {
            if (insideQuote && line[i + 1] === '"') {
                current += '"'
                i++
            } else {
                insideQuote = !insideQuote
            }
        } else if (char === ',' && !insideQuote) {
            result.push(current.trim())
            current = ''
        } else {
            current += char
        }
    }

    result.push(current.trim())
    return result
}

const parseCSV = (filePath) => {
    const buffer = fs.readFileSync(filePath)
    const content = buffer.toString('utf-8')
        .replace(/\uFEFF/g, '')
        .replace(/\r/g, '')

    const lines = content.split('\n')
    const headers = splitLine(lines[0]).map(h => h.trim())
    const rows = []

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue
        const values = splitLine(line)
        const row = {}
        headers.forEach((header, index) => {
            row[header] = values[index] || ''
        })
        rows.push(row)
    }

    return rows
}

// Main processing
const run = () => {
    const nationalList = parseCSV('national-list.csv')
    const failures = []

    nationalList.forEach(row => {
        const missingFields = []
        const invalids = []

        // Check latitude
        if (!row.latitude) {
            missingFields.push('latitude')
            invalids.push('invalid latitude')
        } else if (isNaN(Number(row.latitude))) {
            invalids.push('invalid latitude')
        }

        // Check longitude
        if (!row.longitude) {
            missingFields.push('longitude')
            invalids.push('invalid longitude')
        } else if (isNaN(Number(row.longitude))) {
            invalids.push('invalid longitude')
        }

        // Check city
        if (!row.city) {
            missingFields.push('city')
        }

        if (missingFields.length > 0 || invalids.length > 0) {
            const reasonParts = []
            if (missingFields.length > 0) reasonParts.push(`missing field: ${missingFields.join(', ')}`)
            if (invalids.length > 0) reasonParts.push(invalids.join(', '))

            // Save exact values for debugging
            const valueParts = []
            if (missingFields.includes('latitude') || invalids.includes('invalid latitude')) valueParts.push(`latitude="${row.latitude || '(missing)'}"`)
            if (missingFields.includes('longitude') || invalids.includes('invalid longitude')) valueParts.push(`longitude="${row.longitude || '(missing)'}"`)
            if (missingFields.includes('city')) valueParts.push(`city="${row.city || '(missing)'}"`)

            failures.push({
                name: row.name,
                reason: reasonParts.join(', '),
                value: valueParts.join(', ')
            })
        }
    })

    // Save failures to CSV
    // if (failures.length > 0) {
    //     const header = 'name,reason,value\n'
    //     const lines = failures.map(f => `"${f.name}","${f.reason}","${f.value}"`).join('\n')
    //     fs.writeFileSync('./src/failure.csv', header + lines, 'utf-8')
    //     console.log(`Failures saved to ./src/failure.csv (${failures.length} rows)`)
    // }
}

run()
module.exports = { parseCSV }