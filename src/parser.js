const fs = require('fs')

// CSV parser 
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

module.exports = { parseCSV }