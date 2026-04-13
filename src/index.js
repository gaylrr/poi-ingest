require ('dotenv').config()

const {parseCSV} = require('./parser')
const {validateRow} = require('./validator')
const {uploadPOI} = require('./uploader')
const {generateReport} = require('./reporter')
const {chunk, sleep} = require('./utils')
const {info, success, warning, errlog } = require('./logger')
const { getRegionByProvince } = require('./regionMap');

const batch_size = 50 //sends 50 rows at a time 
const batch_delay = 250 //wait 250 ms between batches

const API_URL = process.env.POI_API_URL
const API_KEY = process.env.POI_API_KEY
const IMPORT_MODE = process.env.IMPORT_MODE
const DRY_RUN = process.argv.includes('--dry-run') // list of words that is typed in the terminal

if(IMPORT_MODE !== 'test') {
    errlog('IMPORT_MODE must be "test". Aborting for safety.')
    process.exit(1) //stop everything
};

if (!DRY_RUN && !API_KEY) {
    errlog('API_KEY is missing.')
    process.exit(1)
}
if (!DRY_RUN && !API_URL) {
    errlog('API_URL is invalid.')
    process.exit(1)
}
const filePath = process.argv.slice(2).find(arg => !arg.startsWith('--')) // array of everything that is typed || does not care about order
    if (!filePath) {
        errlog('Please provide a CSV file: (path)')
        process.exit(1)
}
const run = async () => {
    const startTime = Date.now()
    info(`Reading file: ${filePath}`)

    const rows = parseCSV(filePath)
    const batches = chunk(rows, batch_size)
    const results = []

    info(`${rows.length} rows - split into ${batches.length} batches`)
    if (DRY_RUN) warning('DRY_RUN: no data will be sent to the API') // only required if not dry-run since it will skip the api call


  for (let b = 0; b < batches.length; b++) {
        const batch = batches[b]
        let batchSuccess = 0
        let batchFailed = 0

            
        // const batchResults = await Promise.all(batch.map(async (row, i) => {
            for (const[i, row] of batch.entries()) {
            row.barangay = row.barangay || 'N/A'
            row.province = row.province || 'N/A'
            if (!row.region || row.region.trim() === '') {
                row.region = getRegionByProvince(row.province) || ''
            }

            const {valid, errors} = validateRow(row, i)

            if (!valid) {
                results.push ({success: false, row, reason: errors.join(', ')})
                batchFailed++
                continue
            }

            try {
                const result = await uploadPOI(row, API_URL, API_KEY, DRY_RUN)
                result.row = row
                results.push(result)
                batchSuccess++
            } catch (err) {
                errlog(`Row ${i} upload failed: ${err.message}`)
                results.push({success: false, row, reason: err.message})
                batchFailed++
            }
          }
        // const batchSuccess = results.filter(r => r.success).length
        // const batchFailed = batch.length - batchSuccess
        // results.push(...batchResults)
        info(`Batch ${b + 1}/${batches.length} done - ${batchSuccess} success`)

        if (b < batches.length - 1) 
            info (`Cooldown ${batch_delay} ms`) 
            await sleep(batch_delay)
    }
    generateReport(results, startTime)
};

run().catch(err=>{
    errlog(err.message)
    process.exit(1)
});
