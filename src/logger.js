const RESET  = '\x1b[0m'
const CYAN   = '\x1b[36m'
const GREEN  = '\x1b[32m'
const YELLOW = '\x1b[33m'
const RED    = '\x1b[31m'
const BOLD   = '\x1b[1m'

const info = (msg) => {
    console.log(`${CYAN}${BOLD}[INFO]${RESET} ${msg}`) // keep you udpated 
};

const success = (success) => {
    console.log(`${GREEN}${BOLD}[SUCCESS]${RESET} ${success}`) // prints when something worked/successful  
};

const warning = (warn) => {
    console.log(`${YELLOW}${BOLD}[WARN]${RESET} ${warn}`) // prints when some thing skipped or suspicious. fatal error
};

const errlog = (error) => {
    process.stderr.write(`${RED}${BOLD}[ERROR]${RESET} ${error}\n`) //stdrr for errors and warnings std put for normal or success output
}

module.exports = {
    info,
    success,
    warning,
    errlog
};