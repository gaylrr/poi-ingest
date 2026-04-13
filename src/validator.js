const REQUIRED_FIELDS = [
    'name', 'latitude', 'longitude', 'category', 
    'barangay', 'city', 'province'
]

const validateRow = (row, index) => {
    const errors = [];  
    // remove anything that is a number
    row.latitude = row.latitude?.toString().trim()
    .replace(/[^\d.-]/g, '')
    .replace(/^0+(\d)/, '$1')
    .replace(/(\.\d+)\..*$/, '$1')

    row.longitude = row.longitude?.toString().trim()
    .replace(/[^\d.-]/g, '')
    .replace(/^0+(\d)/, '$1')
    .replace(/(\.\d+)\..*$/, '$1')

    const latF = parseFloat(row.latitude)
    const lngF = parseFloat(row.longitude)

    if (!isNaN(latF) && !isNaN(lngF)){
        // swapping the coordinates
        const latLooksLikeLng = latF >= 116 && latF <= 127
        const lngLooksLikeLat = lngF >= 4.5 && lngF <= 21.5

        if (latLooksLikeLng && lngLooksLikeLat){
            const temp = row.latitude
            row.latitude = row.longitude
            row.longitude = temp
        }

        else if (latLooksLikeLng && (isNaN(lngF) || lngF < -180 || lngF >180)){
            const temp = row.latitude
            row.latitude = row.longitude
            row.longitude = temp
        }
        // lat looks like lng but can't swap — try stripping first digit
        // e.g. 116.41 → 16.41
        else if (latLooksLikeLng){
            const fixed = parseFloat(row.latitude.toString().substring(1))
            if (!isNaN(fixed) && fixed >= 4.5 && fixed <= 21.5 ){
                row.latitude = fixed.toString()
            }
        }
        const fixMissingDecimal = (val, isLng) => {
            const num = parseFloat(val)
            if(isNaN(num) || val?.includes('.')) return val
            const str = val.toString()

            if(isLng && num > 180 && str.startsWith('12') && str.length >= 9){
                return str.slice(0, 3) + '.' + str.slice(3)
            }
            if(!isLng && num > 90 && str.startsWith('1') && str.length >= 8){
                return str.slice(0, 2) + '.' + str.slice(2)
            }
            return val
        }
        row.latitude = fixMissingDecimal(row.latitude, false)
        row.longitude = fixMissingDecimal(row.longitude, true)
    }

    for (const field of REQUIRED_FIELDS) {
        if(!row[field] || row[field].trim() === '') {
            errors.push(`missing field: ${field}`)
    }
}
    const lat = parseFloat(row.latitude)
    const lng = parseFloat(row.longitude)

    if (isNaN(lat) || lat < - 90 || lat > 90)
        errors.push(`invalid latitude: ${row.latitude}`)
    if (isNaN(lng) || lng < - 180 || lng > 180)
        errors.push(`invalid longitude: ${row.longitude}`)

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