const fetch= require('node-fetch');
const fs = require('fs');

const langs = ['ca','en','es'];
const platacon_url = process.env.PLATACON_API_URL || "https://transfer.research.uoc.edu"
const endpointSearch = '/api/search';
const grups_recerca_filename = 'grups_recerca'

const folderPath = './data';

// Verificar si la carpeta 'data' existe, si no, se crea
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

function sortData(data) {
  data.hits.hit = data.hits.hit.sort((a, b) => {
    // Parseamos los id como números enteros antes de compararlos
    const idA = parseInt(a.id);
    const idB = parseInt(b.id);

    return idA - idB;
  });
  return data
}

function getGrupsRecerca() {
  const apiSearchEndpoint = new URL(`${platacon_url}${endpointSearch}`);
  for (const lang of langs) {
    const params = new URLSearchParams();
    params.append('tipus', 'grup');
    params.append('idioma', lang);
    const url = `${apiSearchEndpoint}?${params}`;
    console.info(`Obteniendo grupos de investigación para el idioma ${lang}: ${url}`);
    
    fetch(url,    { 
      method: 'GET',
      mode: 'cors'
    })
    .then(response => response.json())
    .then(data => {
      console.info(`Guardando los resultados del idioma ${lang}`);
      const filename = `${folderPath}/${grups_recerca_filename}.${lang}.json`;      
      fs.writeFile(filename, JSON.stringify(sortData(data), null, 2), err => {
        if (err) {
          console.error('Error al guardar el archivo JSON:', err);
        } else {
          console.log(`Datos guardados en ${filename}`);
        }
      });
    })
    .catch(error => {
      console.error('Error en la llamada fetch:', error);
    });
  }
} 

getGrupsRecerca()