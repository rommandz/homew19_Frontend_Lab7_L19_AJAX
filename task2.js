/*jshint esversion: 6 */
let script = document.createElement("script");
script.setAttribute("src", "http://marsweather.ingenology.com/v1/archive/?page=1&format=jsonp&callback=parse");
document.getElementsByTagName("head")[0].appendChild(script);


let temp = document.getElementsByClassName('temp')[0];
let wdirection = document.getElementsByClassName('wdirection')[0];
let wspeed = document.getElementsByClassName('wspeed')[0];
let time = document.getElementsByClassName('time')[0];

let prev = document.getElementsByClassName("prev")[0];
let next = document.getElementsByClassName("next")[0];

let pagesInfo = {
    "current": [],
    "numofarr": 0,
    "page": 1,
    "endOfArchive": false,
    "error": true
};


const fillInfo = data => {
    temp.innerHTML = ((data.max_temp + data.min_temp) / 2).toFixed(0) + `&#8451;`;
    wdirection.innerHTML = data.wind_direction === null ? "wind direction --" : `wind direction ${data.wind_direction}`;
    wspeed.innerHTML = data.wind_speed === null ? "wind speed: none" : `wind speed: ${data.wind_speed} m/s`;
    time.innerHTML = data.terrestrial_date.split("-").reverse().join(".");
};

const updateScript = numofpage => {
    document.getElementsByTagName("head")[0].removeChild(script);
    script = document.createElement("script");
    script.setAttribute("src", `http://marsweather.ingenology.com/v1/archive/?page=${numofpage}&format=jsonp&callback=parse`);
    script.onerror = () => {
        let weather = document.getElementsByClassName("weather")[0];
        spinner(false);
        weather.innerHTML = `<h2>Failed to load information</h2>`;
        renderData(true);
    };
    document.getElementsByTagName("head")[0].appendChild(script);
};

const renderData = bool => {
    let weather = document.getElementsByClassName("weather")[0];
    weather.style.display = bool ? "block" : "none";
};

const spinner = bool => {
    let spinner = document.getElementsByClassName("spinner")[0];
    spinner.style.display = bool ? "block" : "none";
};

renderData(false);
spinner(true);

function parse(data) {
    pagesInfo.error = false;
    pagesInfo.current = data.results;
    if (data.next === null) {
        pagesInfo.endOfArchive = true;
    }
    fillInfo(pagesInfo.current[pagesInfo.numofarr]);
    spinner(false);
    renderData(true);
}

prev.addEventListener("click", getPrevWeather);
next.addEventListener("click", getNextWeather);

function getPrevWeather(event) {
    pagesInfo.numofarr++;
    if (pagesInfo.numofarr === pagesInfo.current.length) {
        if (pagesInfo.endOfArchive) {
            alert("No more availible data");
            pagesInfo.numofarr = pagesInfo.current.length - 1;
            return;
        }
        renderData(false);
        spinner(true);
        pagesInfo.page++;
        updateScript(pagesInfo.page);
        pagesInfo.numofarr = 0;
    } else {
        fillInfo(pagesInfo.current[pagesInfo.numofarr]);
    }
}

function getNextWeather(event) {
    pagesInfo.numofarr--;
    if (pagesInfo.numofarr < 0) {
        if (pagesInfo.page === 1) {
            alert("This is the latest data");
            pagesInfo.numofarr = 0;
            return;
        }
        if (pagesInfo.endOfArchive) {
            pagesInfo.endOfArchive = false;
        }
        renderData(false);
        spinner(true);
        pagesInfo.page--;
        updateScript(pagesInfo.page);
        pagesInfo.numofarr = 9;
    } else {
        fillInfo(pagesInfo.current[pagesInfo.numofarr]);
    }
}

setTimeout(() => {
    if (pagesInfo.error) {
        let weather = document.getElementsByClassName("weather")[0];
        weather.innerHTML = `<h2>Ooops... Something gone wrong</h2>`;
        spinner(false);
        renderData(true);
    }
}, 3000);
