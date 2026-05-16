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
// KELAS
// ======================

function formatKelas(kelas) {

    return kelas == 5 ? "V" :
           kelas == 6 ? "VI" :
           kelas == 7 ? "VII" :
           kelas;
}

// ======================
// STYLE KESUBURAN TANAH
// ======================

function getColorKesuburan(Kesuburan) {

    return Kesuburan ==
           "Tingkat Kesuburan Tanah Rendah"

           ? "#ff0000" :

           Kesuburan ==
           "Tingkat Kesuburan Tanah Sedang"

           ? "#ffff00" :

           "#cccccc";
}

// ======================
// SET VIEW [3]
// ======================

map.setView([-7.312, 108.420], 16);

// ======================
// GLOBAL LAYER
// ======================

var kemampuanLahan;

var kesuburanTanah;

var titikKemampuan;

var titikKesuburan;

// ======================
// LOAD GEOJSON - KEMAMPUAN LAHAN
// ======================

fetch('data/kemampuan_lahan.geojson')
.then(res => res.json())
.then(data => {

    kemampuanLahan = L.geoJSON(data, {

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
// LOAD TITIK PENGAMATAN - KEMAMPUAN LAHAN
// ======================

fetch('data/titik_pengamatan.geojson')

.then(res => res.json())

.then(data => {

    titikKemampuan = L.geoJSON(data, {

        // STYLE POINT
        pointToLayer: function(feature, latlng) {

            return L.circleMarker(latlng, {

                radius: 4.5,

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
// LOAD TITIK PENGAMATAN - KESUBURAN TANAH
// ======================

fetch('data/titik_pengamatan.geojson')

.then(res => res.json())

.then(data => {

    titikKesuburan = L.geoJSON(data, {

        // STYLE POINT
        pointToLayer: function(feature, latlng) {

            return L.circleMarker(latlng, {

                radius: 4.5,

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

                "<b>N Total (%):</b> " +
                feature.properties.N_total +

                "<br>" +

                "<b>P Tersedia (ppm):</b> " +
                feature.properties.P_Tersedia +

                "<br>" +

                "<b>K-dd (cmol (+)/kg):</b> " +
                feature.properties.K_dd +

                "<br>" +

                "<b>pH:</b> " +
                feature.properties.pH +

                "<br>" +

                "<b>C Organik (%):</b> " +
                feature.properties.C_Organik +

                "<br><br>" +

                "<b>Tingkat Kesuburan Tanah:</b> " +
                feature.properties.Kesuburan,

                {
                    maxWidth: 220,
                    className: 'custom-popup-point'
                }

            );
        }

    });

});

// ======================
// LOAD GEOJSON - KESUBURAN TANAH
// ======================

fetch('data/kesuburan_tanah.geojson')

.then(res => res.json())

.then(data => {

    kesuburanTanah = L.geoJSON(data, {

        // STYLE POLYGON
        style: function(feature) {

            return {

                color: "#333",

                weight: 1,

                fillColor: getColorKesuburan(
                    feature.properties.KelasSubur
                ),

                fillOpacity: 0.7
            };
        },

        // POPUP
        onEachFeature: function(feature, layer) {

            layer.bindPopup(

                "<b>Tingkat Kesuburan:<br></b> " +
                feature.properties.KelasSubur +

                "<br><br>" +

                "<b>Luas Area:</b> " +
                feature.properties.Luas.toFixed(2) + " Ha",

                {
                    maxWidth: 180,
                    className: 'custom-popup'
                }

            );
        }

    });

});

// ======================
// LEGEND
// ======================

var legend = L.control({
    position: 'bottomleft'
});

legend.onAdd = function(map) {

    var div = L.DomUtil.create('div', 'info legend');

    div.innerHTML = `

        <h4>Legenda</h4>

        <span class="legend-color"
              style="background:#ffff00">
        </span>

        Kelas V <br>

        <span class="legend-color"
              style="background:#d98c10">
        </span>

        Kelas VI <br>

        <span class="legend-color"
              style="background:#c00000">
        </span>

        Kelas VII <br>

        <hr>

        <span class="legend-point"></span>

        Titik Pengamatan
    `;

    return div;
};

legend.addTo(map);

// ======================
// UPDATE LEGEND
// ======================

function updateLegend(type) {

    var legendContent =
        document.querySelector('.legend');

    // ======================
    // LEGENDA KEMAMPUAN
    // ======================

    if(type == "kemampuan") {

        legendContent.innerHTML = `

            <h4>Legenda</h4>

            <span class="legend-color"
                  style="background:#ffff00">
            </span>

            Kelas V <br>

            <span class="legend-color"
                  style="background:#d98c10">
            </span>

            Kelas VI <br>

            <span class="legend-color"
                  style="background:#c00000">
            </span>

            Kelas VII <br>

            <hr>

            <span class="legend-point"></span>

            Titik Pengamatan
        `;
    }

    // ======================
    // LEGENDA KESUBURAN
    // ======================

    if(type == "kesuburan") {

        legendContent.innerHTML = `

            <h4>Legenda</h4>

            <span class="legend-color"
                  style="background:#ff0000">
            </span>

            Tingkat Kesuburan Tanah Rendah <br>

            <span class="legend-color"
                  style="background:#ffff00">
            </span>

            Tingkat Kesuburan Tanah Sedang <br>

            <hr>

            <span class="legend-point"></span>

            Titik Pengamatan
        `;
    }
}

// ======================
// NAVIGATION BUTTON
// ======================

// BUTTON
var btnKemampuan =
    document.getElementById('btn-kemampuan');

var btnKesuburan =
    document.getElementById('btn-kesuburan');

// TITLE
var mapTitle =
    document.getElementById('map-title');


// ======================
// BUTTON KEMAMPUAN LAHAN
// ======================

btnKemampuan.onclick = function() {

    // HAPUS LAYER
    map.removeLayer(kesuburanTanah);

    map.removeLayer(titikKesuburan);

    // TAMBAH LAYER
    map.addLayer(kemampuanLahan);

    map.addLayer(titikKemampuan);

    titikKemampuan.bringToFront();

    // UPDATE TITLE
    mapTitle.innerHTML =
        "Peta Kemampuan Lahan";

    updateLegend("kemampuan");

    // ACTIVE BUTTON
    btnKemampuan.classList.add('active');

    btnKesuburan.classList.remove('active');
};


// ======================
// BUTTON KESUBURAN TANAH
// ======================

btnKesuburan.onclick = function() {

    // HAPUS LAYER
    map.removeLayer(kemampuanLahan);

    map.removeLayer(titikKemampuan);

    // TAMBAH LAYER
    map.addLayer(kesuburanTanah);

    map.addLayer(titikKesuburan);

    titikKesuburan.bringToFront();

    // UPDATE TITLE
    mapTitle.innerHTML =
        "Peta Kesuburan Tanah";

    updateLegend("kesuburan");

    // ACTIVE BUTTON
    btnKesuburan.classList.add('active');

    btnKemampuan.classList.remove('active');
};