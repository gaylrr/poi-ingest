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
<<<<<<< HEAD
=======
All code was written manually

## Validation
The validator runs 4 checks on every row:

1. Auto-fix — fills blank `barangay` and `province` with `N/A`
2. Clean coordinates — strips stray characters from lat/lng
3. Required fields — rejects rows missing name, latitude, longitude, category, or city
4. Coordinate bounds — rejects coordinates outside the Philippines

# Output
After each run, the terminal shows a summary:
========== SUMMARY ==========
Total:    22104
Success:  21950
Failed:   154
Duration: 7.45s
==============================

# Fixing Failures
1. Open `failures.csv` in Excel
2. Check the `reason` column for each row
3. Fix the data
4. Re-run the script with the fixed file


# Performance
- Batch size: 50 rows per batch
- Delay between batches: 300ms
- Retries on failure: 3 attempts with exponential backoff

# Cloning the Project
1. Open your terminal
2. Clone the repository:
git clone https://github.com/your-username/poi-ingest.git
3. Go into the project folder:
cd poi-ingest
4. Install dependencies:
npm install
5. Create your `.env` file (see Setup above)

# Environment set up
  Create a `.env` file in the backend root directory:

   ```env
POI_API_KEY = POI_API_KEY=your-api-key-here
POI_API_URL =https://dmap-api.inovers.dev
IMPORT_MODE = test
the 'test' for hard coded validation

# Pushing Changes to GitHub

# First time setup
git init
git remote add origin https://github.com/your-username/poi-ingest.git

# Every time you make changes
git add .
git commit -m "describe your changes here"
git push origin main

# Common commit message examples
git commit -m "fix: swapped coordinate detection in validator"
git commit -m "feat: add auto-fix for missing barangay and province"
git commit -m "fix: reporter now writes full row data to failures.csv"

# .gitignore
Make sure your `.gitignore` includes these so sensitive files are never pushed:
node_modules/
.env
.env.local
failures.csv
bad-data.csv
>>>>>>> e4e62be (README file)
