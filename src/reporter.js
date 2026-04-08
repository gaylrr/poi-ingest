const fs = require('fs')

const escapeCsv = (val) => String(val ?? '').replace(/"/g, '""')

const generateReport = (results, startTime) => {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    const total = results.length
    const success = results.filter(r => r.success).length
    const failed = total - success

    console.log('\n========== SUMMARY ==========')
    console.log(`Total:    ${total}`)
    console.log(`Success:  ${success}`)
    console.log(`Failed:   ${failed}`)
    console.log(`Duration: ${duration}s`)
    console.log('==============================\n')

    const failures = results.filter(r => !r.success)

    if (failures.length > 0) {
        const lines = ['name,reason']
        for (const f of failures) {
            const name = f.row?.name ?? 'UNKNOWN'
            lines.push(`"${escapeCsv(name)}","${escapeCsv(f.reason)}"`)
        }
        fs.writeFileSync('failures.csv', lines.join('\n'))
        console.log(`failures.csv written with ${failures.length} record(s)`)
    }
}

module.exports = { generateReport }