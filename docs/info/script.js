function abbrState(input, to) {
    var states = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];
    if (to == 'abbr') {
        input = input.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
        for (i = 0; i < states.length; i++) {
            if (states[i][0] == input) {
                return (states[i][1]);
            }
        }
    } else if (to == 'name') {
        input = input.toUpperCase();
        for (i = 0; i < states.length; i++) {
            if (states[i][1] == input) {
                return (states[i][0]);
            }
        }
    }
}

let params = (new URL(document.location)).searchParams;
let state = params.get("state");
if (state === null) {
    state = "OR";
}
var stateName = abbrState(state, 'name');
document.getElementById('stateTitle').innerHTML = stateName;

mapApiKey = "XIrafQAAKpIourUn2VWelMfXz7WHAIe7"

var map = L.map('map', {
    center: [43.93844, -120.55674],
    zoom: 6,
    zoomControl: false,
    attributionControl: false,
});

var CartoDB_DarkMatter = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 16
})
var Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 16
}).addTo(map);
var Stamen_TonerHybrid = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-hybrid/{z}/{x}/{y}{r}.{ext}', {
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
}).addTo(map);

map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();
map.boxZoom.disable();
map.keyboard.disable();
map.dragging.disable();

stateArr = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']

async function getStateMap() {
    const url = `https://api.tomtom.com/search/2/geocode/${state}, United States.json?key=${mapApiKey}`
    const response = await fetch(url);
    var json = await response.json();
    var mapJson = json.results[0]
    for (let i = 0; i < json.results.length; i++) {
        if (stateArr.includes(json.results[i].address.countrySubdivisionName)) {
            if (!('countrySecondarySubdivision' in json.results[i].address) /*|| (json.results[i].type != "Goegraphy")*/) {
                mapJson = json.results[i]
                break;
            }
        }
    }

    if (state == "AK") {
        map.flyTo([64.55608, -152.72149], 3.5)
    }
    else if (state == "CO") {
        map.flyTo([39.5501, -105.7821], 6)
    }
    else if (state == "HI") {
        map.flyTo([19.74175, -155.844437], 6)
    }
    else {
        // console.log(json);
        map.flyTo([mapJson.position.lat, mapJson.position.lon])
        map.flyToBounds([
            [mapJson.viewport.topLeftPoint.lat, mapJson.viewport.topLeftPoint.lon],
            [mapJson.viewport.btmRightPoint.lat, mapJson.viewport.btmRightPoint.lon]
        ])
    }

}
getStateMap();

var gasConsumption = Array.from({ length: 23 }, _ => 0);
var coalConsumption = Array.from({ length: 23 }, _ => 0);
var nuclearConsumption = Array.from({ length: 23 }, _ => 0);
var petrolConsumption = Array.from({ length: 23 }, _ => 0);
var renewableConsumption = Array.from({ length: 23 }, _ => 0);

var solarConsumption = Array.from({ length: 23 }, _ => 0);
var hydroConsumption = Array.from({ length: 23 }, _ => 0);
var windConsumption = Array.from({ length: 23 }, _ => 0);
var biomassConsumption = Array.from({ length: 23 }, _ => 0);
var geothermalConsumption = Array.from({ length: 23 }, _ => 0);

var hydroProjection = Array.from({ length: 28 }, _ => 0);
var coalProjection = Array.from({ length: 28 }, _ => 0);
var biomassProjection = Array.from({ length: 28 }, _ => 0);
var oilAndGasProjection = Array.from({ length: 28 }, _ => 0);
var nuclearProjection = Array.from({ length: 28 }, _ => 0);

var co2Emissions = {}

function randomColor(brightness) {
    function randomChannel(brightness) {
        var r = 255 - brightness;
        var n = 0 | ((Math.random() * r) + brightness);
        var s = n.toString(16);
        return (s.length == 1) ? '0' + s : s;
    }
    return '#' + randomChannel(brightness) + randomChannel(brightness) + randomChannel(brightness);
}

function abbreviateNumber(value) {
    var newValue = value;
    if (value >= 1000) {
        var suffixes = ["", "k", "M", "B", "T"];
        var suffixNum = Math.floor(("" + value).length / 3);
        var shortValue = '';
        for (var precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
        newValue = shortValue + suffixes[suffixNum];
    }
    return newValue;
}

const apiKey = "cndBJguN5EusydBJLXOaIh49PRK4Agmmz6AOQnv1"
const apiKey2 = "5rkeiGzdiiTUpk4R9GhCAKOeXR3AdzQFfkW6C18B"

async function getData(energy, infoType, urlParams) {
    const url = `https://api.eia.gov/v2/${energy}/${infoType}/data/?api_key=${apiKey}&${urlParams}`;
    const response = await fetch(url);
    const json = await response.text();
    return JSON.parse(json);
}
async function getMapData() {
    const url = `https://services7.arcgis.com/FGr1D95XCGALKXqM/arcgis/rest/services/Power_Plants_Testing/FeatureServer/0/query?where=State='${stateName}'&outFields=Total_MW, State,PrimSource,Longitude,Latitude&returnGeometry=false&outSR=4326&f=json`
    const response = await fetch(url);
    const json = await response.text();
    const objs = JSON.parse(json).features;
    const getSetting = (totalMw, source) => {
        let color = "Gray";
        switch (source) {
            case "hydroelectric":
                color = "#004060";
                break;
            case "biomass":
                color = "#006080";
                break;
            case "natural gas":
                color = "#0083a6";
                break;
            case "wind":
                color = "#00a0b9";
                break;
            case "solar":
                color = "#00d0d8";
                break;
            case "geothermal":
                color = "#00ffff";
                break;
            case "nuclear":
                color = "#ccffff";
                break;
        }
        return { radius: Math.sqrt(totalMw) * 1000, fillColor: color, stroke: false, fillOpacity: .4 }
        // return totalMw > 50 ? { radius: Math.sqrt(totalMw) * 1000, fillColor: color, stroke: false, fillOpacity: .8 } : { radius: 0, fillColor: color, stroke: false, fillOpacity: 0 };
    }
    objs.forEach(obj =>
        L.circle([obj.attributes.Latitude, obj.attributes.Longitude],
            getSetting(obj.attributes.Total_MW, obj.attributes.PrimSource)
        ).addTo(map))


    /* objs.forEach(obj =>
        L.circle([obj.attributes.Latitude, obj.attributes.Longitude], {
            radius: obj.attributes.Total_MW * 10, color: "Red"
        })
            .addTo(map)); */
    //L.circle([obj.attributes.latitude, obj.attributes.longitude], { radius: 10000, color: "Red" }).addTo(map)
    //L.circle([43.8041, -120.5542], { radius: 100000, color: "Red" }).addTo(map)

    //return objs;
}
getMapData()

/*

*/



async function getSEDS(frequency, seriesID,) {
    const url = `https://api.eia.gov/v2/seds/data/?api_key=${apiKey}&frequency=${frequency}&data[0]=value&facets[stateId][]=${state}&facets[seriesId][]=${seriesID}&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=5000`
    const response = await fetch(url);
    const json = await response.text();
    return JSON.parse(json);
}

async function getAEO(frequency, seriesID) {
    const url = `https://api.eia.gov/v2/aeo/2023/data/?api_key=${apiKey2}&frequency=${frequency}&data[0]=value&facets[scenario][]=ref2023&facets[seriesId][]=${seriesID}&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=5000`
    const response = await fetch(url);
    const json = await response.text();
    return JSON.parse(json);
}

async function showConsume(seriesID, frequency, chartArray, btuConvers, dataIndex) {
    const results = await getSEDS(frequency, seriesID)
    let consumptions = 0;
    // let units = results.response.data[0].unit;
    // let title = results.response.data[0].seriesDescription;
    results.response.data.forEach(record => {
        consumptions += (record.value || 0);
    });

    results.response.data.forEach(record => {
        if (record.period >= 2000) {
            if (chartArray[record.period - 2000] <= 0) {
                chartArray[record.period - 2000] = record.value * btuConvers;
            }
            else {
                chartArray[record.period - 2000] += (record.value * btuConvers);
            }
        }
    })
    consumptionChart.data.datasets[dataIndex].data = chartArray;
    consumptionChart.update();
}

async function showRenew(seriesID, frequency, chartArray, btuConvers, dataIndex) {
    const results = await getSEDS(frequency, seriesID)
    let consumptions = 0;
    // let units = results.response.data[0].unit;
    // let title = results.response.data[0].seriesDescription;
    results.response.data.forEach(record => {
        consumptions += (record.value || 0);
    });

    results.response.data.forEach(record => {
        if (record.period >= 2000) {
            if (chartArray[record.period - 2000] <= 0) {
                chartArray[record.period - 2000] = record.value * btuConvers;
            }
            else {
                chartArray[record.period - 2000] += (record.value * btuConvers);
            }
        }
    })
    renewableChart.data.datasets[dataIndex].data = chartArray;
    renewableChart.update();
}

async function showProject(seriesID, frequency, chartArray, dataIndex) {
    const results = await getAEO(frequency, seriesID)
    console.log(results)
    let projections = 0;
    results.response.data.forEach(record => {
        projections += (record.value || 0);
    });
    results.response.data.forEach(record => {
        if (record.period >= 2022) {
            if (chartArray[record.period - 2022] <= 0) {
                chartArray[record.period - 2022] = record.value;
            }
            else {
                chartArray[record.period - 2022] = (record.value);
            }
        }
    })
    projectionChart.data.datasets[dataIndex].data = chartArray;
    projectionChart.update();
}

`https://services7.arcgis.com/FGr1D95XCGALKXqM/arcgis/rest/services/Power_Plants_Testing/FeatureServer/0/query?where=1%3D1&outFields=Plant_Code,Plant_Name,sector_name,State,Longitude,Latitude&returnGeometry=false&outSR=4326&f=json`

showConsume("NGTCB", "annual", gasConsumption, 1, 0);
showConsume("CLTCB", "annual", coalConsumption, 1, 1);
showConsume("NUETB", "annual", nuclearConsumption, 1, 2);
showConsume("PATCB", "annual", petrolConsumption, 1, 3);
showConsume("RETCB", "annual", renewableConsumption, 1, 4);

showRenew("WYTCB", "annual", windConsumption, 1, 0);
showRenew("SOTCB", "annual", solarConsumption, 1, 1);
showRenew("HYTCB", "annual", hydroConsumption, 1, 2);
showRenew("BMTCB", "annual", biomassConsumption, 1, 3);
showRenew("GETCB", "annual", geothermalConsumption, 1, 4);

showProject("sup_prd_NA_NA_cr_NA_usa_millbrlpdy", "annual", oilAndGasProjection, 0);
showProject("sup_prd_ten_NA_nuc_NA_usa_qbtu", "annual", nuclearProjection, 1);
showProject("sup_prd_ten_NA_bms_NA_usa_qbtu", "annual", biomassProjection, 2);
showProject("sup_prd_ten_NA_hyd_cnv_usa_qbtu", "annual", hydroProjection, 3);

async function stateEmissions() {
    const energy = "co2-emissions"
    const infoType = "co2-emissions-and-carbon-coefficients"
    const frequency = "annual"
    const data = "emissions"
    const start = 2000
    const end = 2018
    //frequency=annual&data[0]=emissions&facets[stateId][]=OR&start=2000&end=2018&sort[0][column]=emissions&sort[0][direction]=desc&offset=0&length=2000
    const urlParams = `frequency=${frequency}&data[0]=${data}&facets[stateId][]=${state}&start=${start}&end=${end}&sort[0][column]=emissions&sort[0][direction]=desc&offset=0&length=2000`
    const results = await getData(energy, infoType, urlParams);
    // console.log(results)
    results.response.data.forEach(record => {
        if (record.emissions > 0) {
            if (record['fuel-name'] in co2Emissions) {
                // console.log(record.emissions + ", " + record['fuel-name'])
                co2Emissions[record['fuel-name']][record.period - 2000] += record.emissions;
            }
            else {
                co2Emissions[record['fuel-name']] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                // console.log(record.emissions + ", " + record['fuel-name'])
                co2Emissions[record['fuel-name']][record.period - 2000] = record.emissions;
            }
        }
    });

    arr = Object.entries(co2Emissions).sort((a, b) => a[1].reduce((a, b) => a + b, 0) < b[1].reduce((a, b) => a + b, 0) ? 1 : -1);

    for (let [key, value] of arr) {
        emissionsChart.data.datasets.push({
            data: value,
            label: key,
            borderColor: "Gray",
        });
    }
    emissionsChart.data.datasets.push({
        data: -1,
        label: "Other",
        borderColor: "Grey",
    });
    emissionsChart.update();
}
stateEmissions();

async function stateRanking() {
    const energy = "electricity"
    const infoType = "state-electricity-profiles/summary"
    const frequency = "annual"
    var start = "2025"
    var urlParams = `frequency=${frequency}&data[0]=average-retail-price&data[1]=average-retail-price-rank&data[2]=carbon-dioxide&data[3]=carbon-dioxide-lbs&data[4]=carbon-dioxide-rank&data[5]=carbon-dioxide-rank-lbs&data[6]=net-generation&data[7]=net-generation-rank&data[8]=prime-source&data[9]=total-retail-sales&data[10]=total-retail-sales-rank&facets[stateID][]=${state}&start=${start}&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=2000`
    var results = await getData(energy, infoType, urlParams);
    while (results.response.data.length == 0) {
        // console.log(results.response.data.length + ", " + start)
        start = parseInt(start) - 1 + "";
        urlParams = `frequency=${frequency}&data[0]=average-retail-price&data[1]=average-retail-price-rank&data[2]=carbon-dioxide&data[3]=carbon-dioxide-lbs&data[4]=carbon-dioxide-rank&data[5]=carbon-dioxide-rank-lbs&data[6]=net-generation&data[7]=net-generation-rank&data[8]=prime-source&data[9]=total-retail-sales&data[10]=total-retail-sales-rank&facets[stateID][]=${state}&start=${start}&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=2000`
        results = await getData(energy, infoType, urlParams);
    }
    // console.log(results);
    let res = results.response.data[0];
    $('#date').html(res['period'])
    $('#primeSource').html(res['prime-source'])
    $('#co2Rank').css("background", `radial-gradient(closest-side, white 80%, transparent 80% 100%), conic-gradient(rgb(11 164 193) ${100 - (res['carbon-dioxide-rank'] / 50 * 100)}%, rgb(193 250 255) 0)`)
    $('#co2Rank').attr('data-before', res['carbon-dioxide-rank'])
    $('#co2Amt').html(abbreviateNumber(res['carbon-dioxide'] * 1000))
    $('#retailPrice').html(res['average-retail-price'])
    $('#retailRank').css("background", `radial-gradient(closest-side, white 80%, transparent 80% 100%), conic-gradient(rgb(11 164 193) ${100 - (res['average-retail-price-rank'] / 50 * 100)}%, rgb(193 250 255) 0)`)
    $('#retailRank').attr('data-before', res['average-retail-price-rank'])
    $('#genRank').css("background", `radial-gradient(closest-side, white 80%, transparent 80% 100%), conic-gradient(rgb(11 164 193) ${100 - (res['net-generation-rank'] / 50 * 100)}%, rgb(193 250 255) 0)`)
    $('#genRank').attr('data-before', res['net-generation-rank'])
    $('#genAmt').html(abbreviateNumber(res['net-generation']))

    $.getJSON('./renewableGen.json', function (data) {
        //console.log(data);
        for (let [key, value] of Object.entries(data)) {
            if (value.State == stateName) {
                var index = parseInt(key) + 1
                $('#renewRank').css("background", `radial-gradient(closest-side, white 80%, transparent 80% 100%), conic-gradient(rgb(11 164 193) ${100 - (index / 50 * 100)}%, rgb(193 250 255) 0)`)
                $('#renewRank').attr('data-before', index)
                $('#renewAmt').html(abbreviateNumber(value.renewableGen * 1000000));
            }
        }
    })
}
stateRanking();

async function totalCustomers() {
    const energy = "electricity"
    const infoType = "retail-sales"
    const frequency = "annual"
    const start = "2021"
    const end = "2021"
    const urlParams = `frequency=${frequency}&data[0]=customers&facets[stateid][]=${state}&start=${start}&end=${end}&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=2000`
    const results = await getData(energy, infoType, urlParams);
    results.response.data.forEach(record => {
        if (record.sectorName == "all sectors") {
            numCustomers = abbreviateNumber(record.customers);
        }
    });
    $('#numCustomers').html(numCustomers)
}

totalCustomers();

Chart.defaults.color = "#000";

var consumptionChart = new Chart(document.getElementById('consumption'), {
    type: 'line',
    data: {
        labels: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021],
        datasets: [{
            data: gasConsumption,
            label: "Natural Gas",
            borderColor: "#023858",
            fill: false
        }, {
            data: coalConsumption,
            label: "Coal",
            borderColor: "#04508d",
            fill: false
        }, {
            data: nuclearConsumption,
            label: "Nuclear",
            borderColor: "#3690c0",
            fill: false
        }, {
            data: petrolConsumption,
            label: "Petroleum",
            borderColor: "#74a9cf",
            fill: false
        }, {
            data: renewableConsumption,
            label: "Renewable",
            borderColor: "#a6bddb",
            fill: false
        },
        ]
    },
    options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: stateName + ' Energy Consumptions',
            },
            legend: {
                labels: {
                    boxWidth: 2,
                },
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'British Thermal Units',
                    type: 'logarithmic',
                },
                ticks: {
                    callback: function (value, index, values) {
                        return abbreviateNumber(value);
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Years'
                }
            }
        }
    }
});
var emissionsChart = new Chart(document.getElementById('emissions'), {
    type: 'line',
    data: {
        labels: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018],

    },
    options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: stateName + ' CO2 Emissions',
            },
            legend: {
                labels: {
                    boxWidth: 2,
                    filter: function (item, data) {
                        const colors = ["#023858", "#04508d", "#3690c0", "#74a9cf", "#a6bddb"]
                        // console.log(data.datasets[item.datasetIndex])
                        var peakMin = 0;
                        for (var i = 0; i < data.datasets[4].data.length; i++) {
                            if (data.datasets[4].data[i] > peakMin)
                                peakMin = data.datasets[4].data[i];
                        }

                        var peak = 0;
                        for (var i = 0; i < data.datasets[item.datasetIndex].data.length; i++) {
                            if (data.datasets[item.datasetIndex].data[i] > peak)
                                peak = data.datasets[item.datasetIndex].data[i];
                        }

                        // console.log(peak + " , " + data.datasets[item.datasetIndex].label + ", " + peakMin)
                        if (peak >= peakMin || data.datasets[item.datasetIndex].label == "Other") {
                            data.datasets[item.datasetIndex].borderColor = colors[item.datasetIndex]
                            return true;
                        }
                        else {
                            data.datasets[item.datasetIndex].borderColor = "Gray";
                        }
                    },
                }
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'CO2 metric tons'
                },
                beginAtZero: true,
                ticks: {
                    callback: function (value, index, values) {
                        return abbreviateNumber(value);
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Years'
                },
            }
        },
        //defaults.scales[logarithmic]
    }
});

var renewableChart = new Chart(document.getElementById('renewable'), {
    type: 'line',
    data: {
        labels: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021],
        datasets: [{
            data: windConsumption,
            label: "Wind",
            borderColor: "#023858",
            fill: false
        }, {
            data: hydroConsumption,
            label: "Hydropower",
            borderColor: "#04508d",
            fill: false
        }, {
            data: solarConsumption,
            label: "Solar",
            borderColor: "#3690c0",
            fill: false
        }, {
            data: biomassConsumption,
            label: "Biomass",
            borderColor: "#74a9cf",
            fill: false
        }, {
            data: geothermalConsumption,
            label: "Geothermal",
            borderColor: "#a6bddb",
            fill: false
        },
        ]
    },
    options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: stateName + ' Renewable Energy Consumptions',
            },
            legend: {
                labels: {
                    boxWidth: 2,
                }
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'British Thermal Units',
                    type: 'logarithmic',
                },
                ticks: {
                    callback: function (value, index, values) {
                        return abbreviateNumber(value);
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Years'
                }
            }
        }
    }
});

var projectionChart = new Chart(document.getElementById('projections'), {
    type: 'line',
    data: {
        labels: [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040, 2041, 2042, 2043, 2044, 2045, 2046, 2047, 2048, 2049, 2050],
        datasets: [{
            data: oilAndGasProjection,
            label: "Oil, Gas & Crude Oil",
            borderColor: "#04508d",
            fill: false
        }, {
            data: nuclearProjection,
            label: "Nuclear",
            borderColor: "#3690c0",
            fill: false
        }, {
            data: biomassProjection,
            label: "Biomass",
            borderColor: "#74a9cf",
            fill: false
        }, {
            data: hydroProjection,
            label: "Hydropower",
            borderColor: "#a6bddb",
            fill: false
        },
        ]
    },
    options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'United States Energy Projections',
            },
            legend: {
                labels: {
                    boxWidth: 2,
                }
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: '',
                    type: 'logarithmic',
                },
                ticks: {
                    callback: function (value, index, values) {
                        return abbreviateNumber(value);
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Years'
                }
            }
        }
    }
});

    // let arr = Object.entries(co2Emissions);
    // for (let i = arr.length - 1; i > arr.length - 6; i--) {
    //     emissionsChart.data.datasets.push({
    //         data: arr[i][1],
    //         label: arr[i][0],
    //         borderColor: randomColor(25),
    //     })
    // }
    // arr.pop(); arr.pop(); arr.pop(); arr.pop(); arr.pop();

    // for (let [key, value] of arr) {
    //     emissionsChart.data.datasets.push({
    //         data: value,
    //         label: "Other",
    //         borderColor: "Gray",
    //     });
    // }

/* function getData(facets, frequency, stuf) {
    let url = `https://api.eia/gov/v2/${energy}/${infoType}/data/?api_key=${apiKey}`;
    url += facets ? Object.keys(facets).map(key=>(`facets[${key}][]=${facets[key]}`)).join('&') : "";
    url += frequency ? `&frequency=${frequency}` : "";
    url += s ? "stuf" : "";
} */

//const url = `https://api.eia.gov/v2/electricity/retail-sales/data/?api_key=${apiKey}&facets[stateid][]=${state}&facets[sectorid][]=RES&frequency=monthly`
//const url3 = "https://api.eia.gov/v2/electricity/retail-sales/data/?api_key=5yTHxQr2TqVW9JenE4eFekolih26wYHS5rnJm3EF&facets[stateid][]=OR&facets[sectorid][]=RES&frequency=monthly"
//const url2 = `https://api.eia.gov/v2/${energy}/${infoType}/data/?api_key=${apiKey}&facets[stateid][]=${state}&facets[sectorid][]=RES&frequency=monthly`
//console.log(url2)
//document.getElementById('aTest').innerHTML = url3;

/* const coalConsumption = `https://api.eia.gov/v2/coal/consumption-and-quality/data/?api_key=${apiKey}&frequency=annual&data[0]=consumption&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=5000`
 
 */

/* async function showCoalConsume(frequency) {
    const energy = "coal";
    const infoType = "consumption-and-quality";
    const urlParams = `frequency=${frequency}&data[0]=consumption&data[1]=price&facets[location][]=${state}&offset=0&length=300`;
    const results = await getData(energy, infoType, urlParams);
    let consumptions = 0;
    results.response.data.forEach(record => consumptions += (record.consumption * 20754000 || 0));
    results.response.data.forEach(record => {
        if (record.period >= 2000) {
            if (coalConsumption[record.period - 2000] <= 0) {
                coalConsumption[record.period - 2000] = record.consumption * 20754000;
            }
            else {
                coalConsumption[record.period - 2000] += record.consumption * 20754000;
            }
        }
    })
    consumptionChart.data.datasets[1].data = coalConsumption;
    consumptionChart.update();
    const elem = document.getElementById("coalConsume");
    elem.innerHTML = consumptions + " BTU";
}

async function showGasConsume(frequency) {
    const energy = "natural-gas";
    const infoType = "cons/sum";
    const urlParams = `frequency=${frequency}&data[0]=value&facets[duoarea][]=S${state}&offset=0&length=5000`;
    const results = await getData(energy, infoType, urlParams);

    let consumptions = 0;
    results.response.data.forEach(record => consumptions += (record.value * 1027000000 || 0));
    results.response.data.forEach(record => {
        if (record.period >= 2000) {
            if (gasConsumption[record.period - 2000] <= 0) {
                gasConsumption[record.period - 2000] = record.value * 1027000000;
            }
            else {
                gasConsumption[record.period - 2000] += record.value * 1027000000;
            }
        }
    })
    consumptionChart.data.datasets[0].data = gasConsumption;
    consumptionChart.update();
    const elem = document.getElementById("gasConsume");
    elem.innerHTML = consumptions + " BTU";
}

async function showElecConsume(frequency) { 
    const energy = "electricity";
    const infoType = "retail-sales";
    const urlParams = `frequency=${frequency}&data[0]=sales&facets[stateid][]=${state}&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=5000`;
    const results = await getData(energy, infoType, urlParams);
    let consumptions = 0;
    results.response.data.forEach(record => consumptions += (record.sales * 3.412142e+9 || 0));

    results.response.data.forEach(record => {
        if (record.period >= 2000) {
            if (electricConsumption[record.period - 2000] <= 0) {
                electricConsumption[record.period - 2000] = record.sales * 3.412142e+9;
            }
            else {
                electricConsumption[record.period - 2000] += record.sales * 3.412142e+9;
            }
        }
    })
    consumptionChart.data.datasets[0].data = gasConsumption;
    consumptionChart.update();

    const elem = document.getElementById("elecConsume");
    elem.innerHTML = consumptions + " BTU";
}*/