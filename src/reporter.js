const fs = require ('fs') // calls file-system from node.js, read file

const generateReport = (results, startTime) => { // calculation of how long the whole thing takes 
    const duration = ((Date.now() - startTime) / 1000).toFixed(2) // current time in ms | round to 2 decimal places
    const total = results.length
    const success  = results.filter(r => r.success).length //it keeps the filtered success item
    const failed = total - success

    console.log('\n========== SUMMARY ==========')
    console.log(`Total:    ${total}`)
    console.log(`Success:  ${success}`)
    console.log(`Failed:   ${failed}`)
    console.log(`Duration: ${duration}s`)
    console.log('==============================\n')

    const failures = results.filter(r => !r.success) // states the failure if any

    if (failures.length > 0) { // counts the failure and add it in the failure.csv file
        const lines = ['name,reason'] // CSV header row
        for (const f of failures) {
            lines.push(`"${f.row.name}","${f.reason}"`)
        }
        fs.writeFileSync('failures.csv', lines.join('\n')) //connect all lines with a newline between data
        console.log(`failures.csv written with ${failures.length} record(s)`)
    }
}
module.exports = {
    generateReport
}