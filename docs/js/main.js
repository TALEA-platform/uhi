const hash = window.location.hash;
let initialCenter = [11.34, 44.49];
let initialZoom = 10;

// Parsing dell'hash: #zoom/lat/lon/fgLayerIndex/bgLayerIndex
if (hash && /^#([\d.]+)\/([-.\d]+)\/([-.\d]+)(?:\/(\d+)\/(\d+))?$/.test(hash)) {
    const match = hash.match(/^#([\d.]+)\/([-.\d]+)\/([-.\d]+)(?:\/(\d+)\/(\d+))?$/);
    if (match) {
        const [, zoom, lat, lon, fgIdx, bgIdx] = match;
        initialZoom = parseFloat(zoom);
        initialCenter = [parseFloat(lon), parseFloat(lat)];
        if (fgIdx !== undefined) {
            const layerSelect = document.getElementById('layerSelect');
            if (layerSelect && layerSelect.options[fgIdx]) {
                layerSelect.selectedIndex = parseInt(fgIdx);
            }
        }
        if (bgIdx !== undefined) {
            const radios = document.querySelectorAll('input[name="basemap"]');
            if (radios[bgIdx]) radios[bgIdx].checked = true;
        }
    }
}

const map = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: initialCenter,
    zoom: initialZoom,
    minZoom: 8,
    maxZoom: 20
});

map.setMaxBounds([
    [10.489197, 44.193036],
    [12.174225, 44.783785]
]);

map.addControl(new maplibregl.ScaleControl({
    maxWidth: 200,
    unit: 'metric'
}), 'bottom-right');

const layerColors = {
    z_score_class: ["#313695", "#4575b4", "#74add1", "#abd9e9", "#e0f3f8", "#fee090", "#fdae61", "#f46d43", "#d73027", "#a50026"],
    ndvi_class: ["#ffffcc", "#c2e699", "#78c679", "#006837"],
    albedo_class: ["#000000", "#999999", "#cccccc", "#ffffff"],
    heat_ret_class: ["#ffffe0", "#ffe08c", "#ffc04d", "#ff9933", "#ff6600", "#cc0000", "#800000"],
    heat_veg_class: ["#ffffcc", "#ffeda0", "#feb24c", "#f03b20"],
    uhei_class: ["#ffffcc", "#ffeda0", "#fd8d3c", "#bd0026"],
    delta_lst_class: ["#30123b", "#4662d8", "#35abf8", "#1be5b5", "#74fe5d", "#c9ef34", "#fbb938", "#f56918", "#c92903", "#7a0403"]
};

const layerDescriptions = {
    z_score_class: { title: "📊🌡️ Scostamento dalla media", description: "Indica quanto una zona si discosta dalla media delle temperature urbane.", labels: ["Molto più fredda", "Più fredda", "Fredda", "Leggermente fredda", "Nella media", "Leggermente calda", "Calda", "Più calda", "Molto calda", "Estremamente calda"] },
    ndvi_class: { title: "🌿🌱 Presenza di verde", description: "Misura la quantità di vegetazione presente (valori alti = più verde).", labels: ["Assente", "Poca", "Media", "Molta"] },
    albedo_class: { title: "☀️⬛⬛ Assorbimento della superficie", description: "Indica quanto una superficie assorbe la luce solare: bianco riflette, nero assorbe.", labels: ["Molto assorbente", "Assorbente", "Riflettente", "Molto riflettente"] },
    heat_ret_class: { title: "🌡️⏳ Accumulo di calore", description: "Quanto una superficie trattiene il calore nel tempo. Indica dove il calore viene assorbito e rilasciato lentamente.", labels: ["Molto bassa", "Bassa", "Moderata", "Media", "Alta", "Molto alta", "Estrema"] },
    heat_veg_class: { title: "🔥🌿 Calore/Vegetazione", description: "Relazione tra calore e presenza di vegetazione. Individua dove fa caldo e manca il verde.", labels: ["Basso", "Moderato", "Alto", "Molto alto"] },
    uhei_class: { title: "🌇🔥 Esposizione complessiva", description: "Esposizione complessiva al calore urbano. Dove il rischio da calore urbano è più elevato.", labels: ["Bassa", "Media", "Alta", "Molto alta"] },
    delta_lst_class: { title: "🌞🌙🌡️ Escursione termica della superficie", description: "Variazione della temperatura superficiale tra giorno e notte.", labels: ["Freddo notte", "Meno caldo", "Neutro", "Leggero caldo", "Moderato caldo", "Caldo", "Piuttosto Caldo", "Molto caldo", "Estremo", "Estremamente caldo"] }
};

let currentLayer = null;

function addDataLayer(layer) {
    fetch(`topojson/${layer}.topojson`)
        .then(resp => resp.json())
        .then(topo => {
            const geojson = topojson.feature(topo, topo.objects[Object.keys(topo.objects)[0]]);
            const colors = layerColors[layer];
            map.addSource(layer, { type: 'geojson', data: geojson });
            map.addLayer({
                id: layer,
                type: 'fill',
                source: layer,
                paint: {
                    'fill-color': ['match', ['get', 'class'], ...colors.flatMap((c, i) => [i, c]), '#000000'],
                    'fill-opacity': parseFloat(document.getElementById('opacityRange').value)
                }
            });
            currentLayer = layer;
            drawLegend(layer);
        });
}

function drawLegend(layerId) {
    const legend = document.getElementById('legend');
    legend.innerHTML = '';
    const { title, description, labels } = layerDescriptions[layerId];
    const colors = layerColors[layerId];
    const titleEl = document.createElement('strong');
    titleEl.innerText = title;
    legend.appendChild(titleEl);
    const descEl = document.createElement('div');
    descEl.classList.add('mb-2');
    descEl.innerText = description;
    legend.appendChild(descEl);
    colors.forEach((color, i) => {
        const div = document.createElement('div');
        div.innerHTML = `<span class='legend-color' style='background:${color}'></span>${labels[i] || 'Classe ' + i}`;
        legend.appendChild(div);
    });
}

map.on('load', () => {
    const layer = document.getElementById('layerSelect').value;
    if (layer) addDataLayer(layer);

    const geocoder = new MaplibreGeocoder({
        maplibregl: maplibregl,
        marker: true,
        placeholder: 'Cerca un luogo...',
        language: 'it',
        forwardGeocode: async (config) => {
            const url = `https://nominatim.openstreetmap.org/search?format=geojson&limit=5&q=${encodeURIComponent(config.query)}`;
            const response = await fetch(url);
            const geojson = await response.json();
            return {
                features: geojson.features.map(feature => ({
                    type: 'Feature',
                    geometry: feature.geometry,
                    properties: feature.properties,
                    place_name: feature.properties.display_name,
                    center: feature.geometry.coordinates
                }))
            };
        }
    });
    map.addControl(geocoder, 'top-right');
    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.addControl(new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
    }), 'top-right');

    const toggleButton = document.getElementById('toggleControls');
    let controlsVisible = true;
    toggleButton.addEventListener('click', () => {
        const controlsContent = document.querySelector('.controls-content');
        if (!controlsContent) return;
        controlsContent.classList.toggle('d-none');
        controlsVisible = !controlsVisible;
        toggleButton.innerText = controlsVisible ? 'Nascondi' : 'Mostra legenda';
        toggleButton.setAttribute('title', controlsVisible ? 'Nascondi la legenda' : 'Mostra la legenda');
        toggleButton.classList.toggle('hidden', !controlsVisible);
    });
});

document.getElementById('layerSelect').addEventListener('change', function () {
    if (currentLayer) {
        if (map.getLayer(currentLayer)) map.removeLayer(currentLayer);
        if (map.getSource(currentLayer)) map.removeSource(currentLayer);
        document.getElementById('legend').innerHTML = '';
        currentLayer = null;
    }
    const layer = this.value;
    if (layer) addDataLayer(layer);
});

document.getElementById('opacityRange').addEventListener('input', function () {
    if (currentLayer) map.setPaintProperty(currentLayer, 'fill-opacity', parseFloat(this.value));
});

document.querySelectorAll('input[name="basemap"]').forEach(r => {
    r.addEventListener('change', function () {
        if (this.value === 'osm') {
            map.setStyle('https://tiles.openfreemap.org/styles/liberty');
        } else {
            map.setStyle({
                version: 8,
                sources: {
                    ortofoto: {
                        type: 'raster',
                        tiles: ['https://sitmappe.comune.bologna.it/tms/tileserver/Ortofoto2024/{z}/{x}/{y}.png'],
                        tileSize: 256,
                        attribution: '© Comune di Bologna, 2024'
                    }
                },
                layers: [{ id: 'base-ortofoto', type: 'raster', source: 'ortofoto' }]
            });
        }
        updateHash();
    });
});

function updateHash() {
    const center = map.getCenter();
    const zoom = map.getZoom().toFixed(2);
    const lat = center.lat.toFixed(6);
    const lon = center.lng.toFixed(6);

    const layerSelect = document.getElementById('layerSelect');
    const fgLayerIndex = layerSelect.selectedIndex;

    const basemapRadios = document.querySelectorAll('input[name="basemap"]');
    let bgLayerIndex = 0;
    basemapRadios.forEach((r, i) => {
        if (r.checked) bgLayerIndex = i;
    });

    window.location.hash = `#${zoom}/${lat}/${lon}/${fgLayerIndex}/${bgLayerIndex}`;
}

map.on('moveend', updateHash);
updateHash();
