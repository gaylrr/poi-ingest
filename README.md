# POI- INGESTION CLI
A command-line tool that reads POI data from a CSV file, 
validates each row, and uploads them to an API endpoint in batches.
## Setup
1. Clone the repo
2. Run: npm install
3. Create a .env file with:
   POI_API_KEY=your-test-key
   POI_API_URL=your-api-url
   IMPORT_MODE=test
   ## Commands
# Dry run (no API calls)
node src/index.js yourfile.csv --dry-run

# Live import
node src/index.js yourfile.csv

## AI Research Log
Used AI to understand async/await concepts
Used AI to research exponential backoff pattern
Used AI to look up csv-parse documentation
