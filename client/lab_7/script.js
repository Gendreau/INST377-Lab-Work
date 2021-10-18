let mymap = L.map('mapid').setView([38.9,-76.9],10)
let layerGroup = L.layerGroup().addTo(mymap)
let top5 = []

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiZzNuZHJlYXUiLCJhIjoiY2t1d2I3bmo0MG04ZDJvcWYyOWMzazNudCJ9.YAYejWu1Pz2UkYMf9AYLcw'
}).addTo(mymap);

async function windowAction() {
    const endpoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';
    const endpoint2 = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json'
    
    const request = await fetch(endpoint)
    
    const places = await request.json()
    
    function findMatches(wordToMatch, places) {
        return places.filter(place => {
            const regex = new RegExp(wordToMatch, 'gi')
            return place.zip.match(regex) || place.name.match(regex) || place.category.match(regex)
        })
    }
    
    /*function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }*/
    
    function displayMatches(event) {
        if (!event.target.value) {
            suggestions.innerHTML = "";
            return false;
          }
        const matchArray = findMatches(event.target.value, places)
        for (let i=0; i<5; i++) { //I realize this isn't the best way to do this but I had already
                                  // implemented this top5 thing before I realized I only needed to
                                  // display 5 results
            top5[i] = matchArray[i]
        }
        const html = top5.map(place => {
            // const regex = new RegExp(event.target.value, 'gi')
            // const zipcode = place.zip.replace(regex, `<span class="hl">${event.target.value}</span>`)
            // const pname = place.name.replace(regex, `<span class="hl">${event.target.value.toUpperCase()}</span>`)
            
            return `
                <li>
                    <span class='result'>${place.name} <br>${place.address_line_1}</span>
                </li>
                `
        }).join('');
        suggestions.innerHTML = html;
    }

    function clearResults(event) {
        suggestions.innerHTML = ``
        console.log('success')
    }
    
    
    
    const searchInput = document.querySelector('.search')
    const suggestions = document.querySelector('.suggestions')
    
    searchInput.addEventListener('input', displayMatches)
    searchInput.addEventListener('input', setMap)
    
    }
    
    
window.onload = windowAction()

function setMap(event) {
    layerGroup.clearLayers()
    for (let i=0; i<top5.length; i++) {
        L.marker([top5[i].geocoded_column_1.coordinates[1],top5[i].geocoded_column_1.coordinates[0]]).addTo(layerGroup)
    }
    mymap.panTo([top5[0].geocoded_column_1.coordinates[1],top5[0].geocoded_column_1.coordinates[0]])
}