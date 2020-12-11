/* Global Variables */


const zipCodeElement = document.getElementById('zip');
const feelingsInputElement = document.getElementById('feelings');
const dateElement = document.getElementById('date');
const temperatureElement = document.getElementById('temp');
const contentElement = document.getElementById('content');
const generateButton = document.getElementById('generate');

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = (d.getMonth() + 1) + '.' + d.getDate() + '.' + d.getFullYear();

// Personal API Key for OpenWeatherMap API

let baseURL = 'http://api.openweathermap.org/data/2.5/weather?units=metric&zip=';
let apiKey = '&appid=';

// Get weather data from OpenWeatherMap API
const getWeatherFromExternalAPI = async () => {
    try {
        const zipCodeValue = zipCodeElement.value;
        const response = await fetch(baseURL + zipCodeValue + apiKey);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error.message);
    }
};

// Prepare POST Data 
const prepareData = async () => {
    try {
        const weatherData = await getWeatherFromExternalAPI();
        if (weatherData && weatherData.main && weatherData.main.temp) {
            const temperatureValue = weatherData.main.temp;
            const feelingsValue = feelingsInputElement.value;
            return { temperature: temperatureValue, feelings: feelingsValue, date: newDate };
        } else {
            console.log('no temperature');
        }
    } catch (error) {
        console.error(error.message);
    }
};

// Save Data by posting to server
const postData = async (url, data) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log('postData: ' + JSON.stringify(result));
        return result;
    } catch (error) {
        console.error(error.message);
    }
};

// Get Data from server
const getData = async (url) => {
    try {
        const response = await fetch(url);
        const result = await response.json();
        console.log('getData: ' + JSON.stringify(result));
        return result;
    } catch (error) {
        console.error(error.message);
    }
};

// generate button click event listener
generateButton.addEventListener('click', async () => {
    try {
        const data = await prepareData();
        if (data) {
            const postResult = await postData('/data', data);
            console.log('postResult message: ' + postResult.message);
            const result = await getData('/all');
            dateElement.innerHTML = 'Date: ' + result.date;
            contentElement.innerHTML = 'I feel ' + result.feelings;
            temperatureElement.innerHTML = 'Temperature: ' + result.temperature;
        } else {
            console.log('no data');
        }
    } catch (error) {
        console.error(error.message);
    }
});
