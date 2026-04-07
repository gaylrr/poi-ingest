const REQUIRED_FIELDS = [
    'name', 'latitude', 'longitude', 'category', 
    'barangay', 'city', 'province'
]

const validateRow = (row, index) => {
    const errors = [];  
    for (const field of REQUIRED_FIELDS) {
        if(!row[field] || row[field].trim() === '') {
            errors.push(`missing field: ${field}`)
    }
}
    const lat = parseFloat(row.latitude)
    const lng = parseFloat(row.longitude)

    if (isNaN(lat) || lat < - 90 || lat > 90)
        errors.push('invalid latitude')
    if (isNaN(lng) || lng < - 180 || lng > 180)
        errors.push('invalid longitude')

     return {
     valid: errors.length === 0,
     errors, 
     row, 
     index
     }
}
 module.exports = {
        validateRow
     }