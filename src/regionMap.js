const regionMap = {
  // Region I - Ilocos Region
  'ILOCOS NORTE': 'Region I',
  'ILOCOS SUR': 'Region I',
  'LA UNION': 'Region I',
  'PANGASINAN': 'Region I',

  // Region II - Cagayan Valley
  'CAGAYAN': 'Region II',
  'ISABELA': 'Region II',
  'NUEVA VIZCAYA': 'Region II',
  'QUIRINO': 'Region II',

  // Region III - Central Luzon
  'AURORA': 'Region III',
  'BATAAN': 'Region III',
  'BULACAN': 'Region III',
  'NUEVA ECIJA': 'Region III',
  'PAMPANGA': 'Region III',
  'TARLAC': 'Region III',
  'ZAMBALES': 'Region III',

  // Region IV-A - CALABARZON
  'BATANGAS': 'Region IV-A',
  'CAVITE': 'Region IV-A',
  'LAGUNA': 'Region IV-A',
  'QUEZON': 'Region IV-A',
  'RIZAL': 'Region IV-A',

  // Region IV-B - MIMAROPA
  'MARINDUQUE': 'Region IV-B',
  'OCCIDENTAL MINDORO': 'Region IV-B',
  'ORIENTAL MINDORO': 'Region IV-B',
  'PALAWAN': 'Region IV-B',
  'ROMBLON': 'Region IV-B',

  // Region V - Bicol Region
  'ALBAY': 'Region V',
  'CAMARINES NORTE': 'Region V',
  'CAMARINES SUR': 'Region V',
  'CATANDUANES': 'Region V',
  'MASBATE': 'Region V',
  'SORSOGON': 'Region V',

  // Region VI - Western Visayas
  'AKLAN': 'Region VI',
  'ANTIQUE': 'Region VI',
  'CAPIZ': 'Region VI',
  'GUIMARAS': 'Region VI',
  'ILOILO': 'Region VI',
  'NEGROS OCCIDENTAL': 'Region VI',

  // Region VII - Central Visayas
  'BOHOL': 'Region VII',
  'CEBU': 'Region VII',
  'NEGROS ORIENTAL': 'Region VII',
  'SIQUIJOR': 'Region VII',

  // Region VIII - Eastern Visayas
  'BILIRAN': 'Region VIII',
  'EASTERN SAMAR': 'Region VIII',
  'LEYTE': 'Region VIII',
  'NORTHERN SAMAR': 'Region VIII',
  'SAMAR (WESTERN SAMAR)': 'Region VIII',
  'SOUTHERN LEYTE': 'Region VIII',

  // Region IX - Zamboanga Peninsula
  'ZAMBOANGA DEL NORTE': 'Region IX',
  'ZAMBOANGA DEL SUR': 'Region IX',
  'ZAMBOANGA SIBUGAY': 'Region IX',

  // Region X - Northern Mindanao
  'BUKIDNON': 'Region X',
  'CAMIGUIN': 'Region X',
  'LANAO DEL NORTE': 'Region X',
  'MISAMIS OCCIDENTAL': 'Region X',
  'MISAMIS ORIENTAL': 'Region X',

  // Region XI - Davao Region
  'DAVAO DE ORO': 'Region XI',
  'DAVAO DEL NORTE': 'Region XI',
  'DAVAO DEL SUR': 'Region XI',
  'DAVAO OCCIDENTAL': 'Region XI',
  'DAVAO ORIENTAL': 'Region XI',

  // Region XII - SOCCSKSARGEN
  'COTABATO (NORTH COTABATO)': 'Region XII',
  'SARANGANI': 'Region XII',
  'SOUTH COTABATO': 'Region XII',
  'SULTAN KUDARAT': 'Region XII',

  // Region XIII - Caraga
  'AGUSAN DEL NORTE': 'Region XIII',
  'AGUSAN DEL SUR': 'Region XIII',
  'DINAGAT ISLANDS': 'Region XIII',
  'SURIGAO DEL NORTE': 'Region XIII',
  'SURIGAO DEL SUR': 'Region XIII',

  // CAR - Cordillera Administrative Region
  'ABRA': 'CAR',
  'APAYAO': 'CAR',
  'BENGUET': 'CAR',
  'IFUGAO': 'CAR',
  'KALINGA': 'CAR',
  'MOUNTAIN PROVINCE': 'CAR',

  // NCR - National Capital Region
  'NCR, CITY OF MANILA, FIRST DISTRICT': 'NCR',
  'NCR, SECOND DISTRICT': 'NCR',
  'NCR, THIRD DISTRICT': 'NCR',
  'NCR, FOURTH DISTRICT': 'NCR',
  'METRO MANILA': 'NCR',
  'CITY OF MANILA': 'NCR',

  // BARMM
  'MAGUINDANAO': 'BARMM',
  'LANAO DEL SUR': 'BARMM',
  'COTABATO CITY': 'BARMM',
  'MAGUINDANAO DEL NORTE': 'BARMM',

  'ZAMBOANGA PENINSULA': 'Region IX',
  'COTABATO': 'Region XII',
  'SAMAR': 'Region VIII',
};
function getRegionByProvince(rawProvince) {
  if (!rawProvince) return null;
  const normalized = rawProvince.trim().toUpperCase();
  return regionMap[normalized] ?? null;
};


module.exports = { regionMap, getRegionByProvince };
