require ('dotenv').config()

const { Command } = require('commander')
const pLimit = require ('p-limit')
const {parseCSV} = require('./parser')
const {validateRow} = require('./validator')
const {uploadPOI} = require('./uploader')
const {generateReport} = require('./reporter')
const {chunk, sleepWithJitter} = require('./utils')        // ← removed unused 'sleep'
const {info, success, warning, errlog } = require('./logger')
const { getRegionByProvince } = require('./regionMap')

const API_URL = process.env.POI_API_URL
const API_KEY = process.env.POI_API_KEY
const IMPORT_MODE = process.env.IMPORT_MODE

const program = new Command

program
    .name('poi-ingest')
    .description('POI Ingestion CLI tool')
    .version('1.0.0')
    .argument('<file>', 'CSV file to import')
    .option('--dry-run', 'simulate without API calls')
    .option('--batch-size <numbers>', 'number of row per batch', '25')
    .option('--cooldown <ms>', 'cooldown between batches in ms', '250')
    .option('--concurrency <number>', 'parallel batches at once', '3')
    .parse(process.argv)

const batch_size  = parseInt(program.opts().batchSize)
const batch_delay = parseInt(program.opts().cooldown)
const concurrency = parseInt(program.opts().concurrency)
const filePath    = program.args[0]
const DRY_RUN     = program.opts().dryRun

// ── SAFETY GUARDRAIL ──
if (IMPORT_MODE !== 'test') {
    errlog('IMPORT_MODE must be "test". Aborting for safety.')
    process.exit(1)
}
// ─────────────────────

if (!DRY_RUN && !API_KEY) { errlog('API_KEY is missing.'); process.exit(1) }
if (!DRY_RUN && !API_URL) { errlog('API_URL is invalid.'); process.exit(1) }

const run = async () => {
    const startTime = Date.now()
    info(`Reading file: ${filePath}`)

    const rows    = parseCSV(filePath)
    const batches = chunk(rows, batch_size)
    const results = []

    info(`${rows.length} rows - split into ${batches.length} batches`)
    if (DRY_RUN) warning('DRY_RUN: no data will be sent to the API')

    const limit = pLimit(concurrency)

    const batchTasks = batches.map((batch, b) => {
        return limit(async () => {
            let batchSuccess = 0
            let batchFailed  = 0

            for (const [i, row] of batch.entries()) {
                row.barangay = row.barangay || 'N/A'
                row.province = row.province || 'N/A'
                if (!row.region || row.region.trim() === '') {
                    row.region = getRegionByProvince(row.province) || ''
                }

                const { valid, errors } = validateRow(row, i)

                if (!valid) {
                    results.push({ success: false, row, reason: errors.join(', ') })
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
                    results.push({ success: false, row, reason: err.message })
                    batchFailed++
                }
            }

            // ── batch progress ──
            if (batchFailed === 0) {
                success(`Batch ${b + 1}/${batches.length} — ${batchSuccess}/${batch.length}`)
            } else {
                info(`Batch ${b + 1}/${batches.length} — ${batchSuccess}/${batch.length}`)
            }

            // ── cooldown with jitter ──
            if (b < batches.length - 1) {
                info(`Cooldown ${batch_delay}ms`)
                await sleepWithJitter(batch_delay)
            }
        })
    })

    await Promise.all(batchTasks)
    generateReport(results, startTime)
}

run().catch(err => {
    errlog(err.message)
    process.exit(1)
})