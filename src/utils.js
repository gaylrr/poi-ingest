const sleep = (ms) => { //cooldown between each batch
    return new Promise(resolve => setTimeout(resolve, ms));
}

const chunk = (array, size) => { //splitsarray into smaller batches
    const result = []
    for (let i = 0; i < array.length; i += size){
        result.push(array.slice(i, i + size))
    }
    return result;
}
const sleepWithJitter = (ms, jitter = 50) => {
    const randomJitter = Math.floor(Math.random() * jitter)
    return sleep(ms + randomJitter)
}

module.exports = {
    sleep,
    chunk, 
    sleepWithJitter
}