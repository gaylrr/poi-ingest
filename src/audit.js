const { parseCSV } = require('./parser')

const rows = parseCSV(process.argv[2])

console.log('Headers:', Object.keys(rows[0]))

// show first 5 rows latitude and longitude raw values
rows.slice(0, 5).forEach((row, i) => {
    console.log(`Row ${i + 1}: lat="${row.latitude}" lng="${row.longitude}"`)
})

// find rows where parseFloat fails
const bad = rows.filter(row => {
    const lat = parseFloat(row.latitude)
    const lng = parseFloat(row.longitude)
    return isNaN(lat) || isNaN(lng)
})

console.log(`\nBad coordinate rows: ${bad.length}`)
bad.slice(0, 5).forEach((row, i) => {
    console.log(`  lat="${row.latitude}" lng="${row.longitude}" name="${row.name}"`)
})