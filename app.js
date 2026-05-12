// ======================
// INIT MAP [1]
// ======================

var map = L.map('map', {
    zoomControl: false,
    maxZoom: 18,
    zoomSnap: 0.5
});

// ======================
// ZOOM CONTROL [4]
// ======================

L.control.zoom({
    position: 'bottomright'
}).addTo(map);

// ======================
// BASEMAP [2]
// ======================

// SATELLITE
var satellite = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
        attribution: 'Tiles © Esri'
    }
);

// STREET MAP
var osm = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: '&copy; OpenStreetMap contributors'
    }
);

// tampilkan default basemap
satellite.addTo(map);

// ======================
// BASEMAP SWITCHER
// ======================

L.control.layers(
    {
        "Satellite": satellite,
        "Street Map": osm
    },
    null,
    {
        position: 'bottomright'
    }
).addTo(map);

// ======================
// STYLE KEMAMPUAN LAHAN
// ======================

function getColor(Kelas) {

    return Kelas == 5 ? "#f1c40f" :
           Kelas == 6 ? "#e67e22" :
           Kelas == 7 ? "#c0392b" :
           "#cccccc";
}

// ======================
// FORMAT KELAS
// ======================

function formatKelas(kelas) {

    return kelas == 5 ? "V" :
           kelas == 6 ? "VI" :
           kelas == 7 ? "VII" :
           kelas;
}

// ======================
// SET VIEW [3]
// ======================

map.setView([-7.312, 108.420], 16);

// ======================
// LOAD GEOJSON - KEMAMPUAN LAHAN
// ======================

fetch('data/kemampuan_lahan.geojson')
.then(res => res.json())
.then(data => {

    var kemampuanLahan = L.geoJSON(data, {

        // STYLE POLYGON
        style: function(feature) {

            return {
                color: "#333",
                weight: 1,

                fillColor: getColor(feature.properties.Kelas),

                fillOpacity: 0.7
            };
        },

        // INTERAKSI
        onEachFeature: function(feature, layer) {

            // POPUP
            layer.bindPopup(

                "<b>Kelas Kemampuan Lahan: </b>" +
                formatKelas(feature.properties.Kelas) +

                "<br><br>" +

                "<b>Rekomendasi:</b> " +
                feature.properties.Rekomend +

                "<br><br>" +

                "<b>Luas Area:</b> " +
                feature.properties.Luas.toFixed(2) + " Ha",

                {
                    maxWidth: 175,
                    className: 'custom-popup'
                }

            );
        }

    }).addTo(map);

    // ZOOM KE LAYER
    map.fitBounds(kemampuanLahan.getBounds());

});

// ======================
// LOAD TITIK PENGAMATAN
// ======================

fetch('data/titik_pengamatan.geojson')

.then(res => res.json())

.then(data => {

    var titikPengamatan = L.geoJSON(data, {

        // STYLE POINT
        pointToLayer: function(feature, latlng) {

            return L.circleMarker(latlng, {

                radius: 3,

                fillColor: "#000000",

                color: "#ffffff",

                weight: 1,

                fillOpacity: 1
            });
        },

        // POPUP
        onEachFeature: function(feature, layer) {

            layer.bindPopup(

                "<b>Titik Pengamatan: </b>" +
                feature.properties.Name +

                "<br><br>" +

                "<b>Bentuk Lahan: </b>" +
                feature.properties.Bentuk_Lah +

                "<br>" +

                "<b>Penggunaan Lahan: </b>" +
                feature.properties.Penggunaan +

                "<br>" +

                "<b>Skor Lereng: </b>" +
                feature.properties.Lereng +

                "<br>" +

                "<b>Skor Kedalaman: </b>" +
                feature.properties.Kedalaman_ +

                "<br>" +

                "<b>Skor Tekstur: </b>" +
                feature.properties.Tekstur +

                "<br>" +

                "<b>Skor Drainase: </b>" +
                feature.properties.Drainase +

                "<br>" +

                "<b>Skor Permeabilitas: </b>" +
                feature.properties.Permeabili +

                "<br>" +

                "<b>Skor Erosi: </b>" +
                feature.properties.Erosi +

                "<br>" +

                "<b>Skor Banjir Genangan: </b>" +
                feature.properties.Banjir_Gen +

                "<br><br>" +

                "<b>Total Skor: </b>" +
                feature.properties.Total_Skor,

                {
                    maxWidth: 280,
                    className: 'custom-popup-point'
                }

            );
        }

    }).addTo(map);

});

// ======================
// LEGEND
// ======================

var legend = L.control({
    position: 'bottomleft'
});

legend.onAdd = function(map) {

    var div = L.DomUtil.create('div', 'legend');

    div.innerHTML = `

        <h4>Legenda</h4>

        <div>
            <span class="legend-color"
                style="background:#f1c40f;"></span>
            Kelas V
        </div>

        <div>
            <span class="legend-color"
                style="background:#e67e22;"></span>
            Kelas VI
        </div>

        <div>
            <span class="legend-color"
                style="background:#c0392b;"></span>
            Kelas VII
        </div>

        <hr>

        <div>
            <span class="legend-point"></span>
            Titik Pengamatan
        </div>

    `;

    return div;
};

legend.addTo(map);