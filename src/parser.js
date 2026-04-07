const fs = require('fs')
//manually split the file to avoid quote errors
// splits a CSV line correctly — respects quoted values with commas inside
const splitLine = (line) => {
    const result = []
    let current = ''
    let insideQuote = false

    for (let i = 0; i < line.length; i++) {
        const char = line[i]

        if (char === '"') {
            // toggle quote mode on/off
            insideQuote = !insideQuote
        } else if (char === ',' && !insideQuote) {
            // only split on comma if NOT inside quotes
            result.push(current.trim().replace(/"/g, ''))
            current = ''
        } else {
            current += char
        }
    }
    // push the last value
    result.push(current.trim().replace(/"/g, ''))
    return result
}

const parseCSV = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf-8')
        .replace(/\r/g, '')      // removes Windows hidden characters
        .replace(/\uFEFF/g, '')  // removes invisible Excel BOM character

    // split the whole file into individual lines
    const lines = content.split('\n')
    // first line is always the header row
    const headers = splitLine(lines[0])
    const rows = []

    // start from line 1 (skip header at line 0)
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        // skip blank lines
        if (!line) continue
        // split each line by comma into values
       const values = splitLine(line)
        // pair each header with its value into an object
        const row = {}
        headers.forEach((header, index) => {
            row[header] = values[index] || ''
        })
        rows.push(row)
    }
    return rows
    // returns array of objects
}

module.exports = { parseCSV }