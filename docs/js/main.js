const hash = window.location.hash;
let initialCenter = [11.34, 44.49];
let initialZoom = 13;
if (hash && /^#\d+(\.\d+)?\/[-\d.]+\/[-\d.]+$/.test(hash)) {
    const match = hash.match(/#(\d+(?:\.\d+)?)\/(\-?\d+(?:\.\d+)?)\/(\-?\d+(?:\.\d+)?)/);
    if (match) {
        const [, zoom, lat, lon] = match;
        initialZoom = parseFloat(zoom);
        initialCenter = [parseFloat(lon), parseFloat(lat)];
    }
}

const map = new maplibregl.Map({
    attributionControl: false,
    container: 'map',
    style: {
        version: 8,
        sources: {
            osm: {
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution: '© OpenStreetMap contributors'
            },
            ortofoto: {
                type: 'raster',
                tiles: ['https://sitmappe.comune.bologna.it/tms/tileserver/Ortofoto2024/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution: '© Comune di Bologna, 2024'
            }
        },
        layers: [{ id: 'base-osm', type: 'raster', source: 'osm' }]
    },
    center: initialCenter,
    zoom: initialZoom,
    maxZoom: 20
});

let deltaBounds = null;

map.addControl(new maplibregl.NavigationControl(), 'top-right');
map.addControl(new maplibregl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true
}), 'top-right');

map.on('load', async () => {
    const layerColors = {
        z_score_class: ["#313695", "#4575b4", "#74add1", "#abd9e9", "#e0f3f8", "#fee090", "#fdae61", "#f46d43", "#d73027", "#a50026"],
        ndvi_class: ["#ffffcc", "#c2e699", "#78c679", "#006837"],
        albedo_class: ["#ffffff", "#cccccc", "#999999", "#000000"],
        heat_ret_class: ["#ffffe0", "#ffe08c", "#ffc04d", "#ff9933", "#ff6600", "#cc0000", "#800000"],
        heat_veg_class: ["#ffffcc", "#ffeda0", "#feb24c", "#f03b20"],
        uhei_class: ["#ffffcc", "#ffeda0", "#fd8d3c", "#bd0026"],
        delta_lst_class: ["#30123b", "#4662d8", "#35abf8", "#1be5b5", "#74fe5d", "#c9ef34", "#fbb938", "#f56918", "#c92903", "#7a0403"]
    };

    const layerDescriptions = {
        z_score_class: { title: "📊🌡️ Scostamento dalla media", description: "Indica quanto una zona si discosta dalla media delle temperature urbane.", labels: ["Molto più fredda", "Più fredda", "Fredda", "Leggermente fredda", "Nella media", "Leggermente calda", "Calda", "Più calda", "Molto calda", "Estremamente calda"] },
        ndvi_class: { title: "🌿🌱 Presenza di verde", description: "Misura la quantità di vegetazione presente (valori alti = più verde).", labels: ["Assente", "Poca", "Media", "Molta"] },
        albedo_class: { title: "☀️⬛⬛ Riflettività della superficie", description: "Indica quanto una superficie riflette la luce solare: bianco riflette, nero assorbe.", labels: ["Molto riflettente", "Riflettente", "Assorbente", "Molto assorbente"] },
        heat_ret_class: { title: "🌡️⏳ Accumulo di calore", description: "Quanto una superficie trattiene il calore nel tempo. Indica dove il calore viene assorbito e rilasciato lentamente.", labels: ["Molto bassa", "Bassa", "Moderata", "Media", "Alta", "Molto alta", "Estrema"] },
        heat_veg_class: { title: "🔥🌿 Calore/Vegetazione", description: "Relazione tra calore e presenza di vegetazione. Individua dove fa caldo e manca il verde.", labels: ["Basso", "Moderato", "Alto", "Molto alto"] },
        uhei_class: { title: "🌇🔥 Esposizione complessiva", description: "Esposizione complessiva al calore urbano. Dove il rischio da calore urbano è più elevato.", labels: ["Bassa", "Media", "Alta", "Molto alta"] },
        delta_lst_class: { title: "🌞🌙🌡️ Escursione termica della superficie", description: "Variazione della temperatura superficiale tra giorno e notte.", labels: ["Freddo notte", "Meno caldo", "Neutro", "Leggero caldo", "Moderato caldo", "Caldo", "Piuttosto Caldo", "Molto caldo", "Estremo", "Estremamente caldo"] }
    };

    let currentLayer = null;
    document.getElementById('layerSelect').value = 'delta_lst_class';

    document.getElementById('layerSelect').addEventListener('change', async function () {
        if (currentLayer) {
            if (map.getLayer(currentLayer)) map.removeLayer(currentLayer);
            if (map.getSource(currentLayer)) map.removeSource(currentLayer);
            document.getElementById('legend').innerHTML = '';
            currentLayer = null;
        }
        const layer = this.value;
        if (!layer) return;
        const response = await fetch(`topojson/${layer}.topojson`);
        const topo = await response.json();
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

    document.getElementById('opacityRange').addEventListener('input', function () {
        if (currentLayer) {
            map.setPaintProperty(currentLayer, 'fill-opacity', parseFloat(this.value));
        }
    });

    document.querySelectorAll('input[name="basemap"]').forEach(r => {
        r.addEventListener('change', function () {
            const isOSM = this.value === 'osm';
            map.setLayoutProperty('base-osm', 'visibility', isOSM ? 'visible' : 'none');
            if (!map.getLayer('base-ortofoto')) {
                map.addLayer({ id: 'base-ortofoto', type: 'raster', source: 'ortofoto' });
            }
            map.setLayoutProperty('base-ortofoto', 'visibility', isOSM ? 'none' : 'visible');
        });
    });

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

    document.getElementById('layerSelect').dispatchEvent(new Event('change'));

    // Assicura che la legenda venga sempre mostrata quando un layer è selezionato


    if (!localStorage.getItem('talea-controls-tooltip-shown')) {
        const btn = document.getElementById('toggleControls');
        btn.setAttribute('title', 'Tocca qui per nascondere/mostrare i controlli');
        setTimeout(() => btn.removeAttribute('title'), 4000);
        localStorage.setItem('talea-controls-tooltip-shown', '1');
    }

    const toggleButton = document.getElementById('toggleControls');
    toggleButton.style.position = 'absolute';
    toggleButton.style.left = '10px';
    toggleButton.style.top = '60px';
    toggleButton.style.width = document.querySelector('.controls').offsetWidth + 'px';
    toggleButton.style.backgroundColor = '#ffffff';
    toggleButton.style.zIndex = '2';
    // spostato in alto per evitare duplicazioni
    let controlsVisible = true;
    toggleButton.addEventListener('click', () => {
        const legendEl = document.querySelector('.controls');
        legendEl.classList.toggle('d-none');
        legendEl.style.marginTop = '30px';
        controlsVisible = !controlsVisible;
    });
});
function updateHash() {
    const center = map.getCenter();
    const zoom = map.getZoom().toFixed(2);
    const lat = center.lat.toFixed(6);
    const lon = center.lng.toFixed(6);
    window.location.hash = `#${zoom}/${lat}/${lon}`;
}
map.on('moveend', updateHash);
updateHash();


const bbox = turf.bbox(geojson);
map.fitBounds(bbox, { padding: 20 });
const zoom = map.getZoom();
map.setMaxZoom(zoom + 1);
