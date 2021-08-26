const {WEATHERTOKEN } = require('../config.json');
const fetch = require("node-fetch");

function weather(){

async function pogoda(msg){
    const list = msg.content.split(' '); 
      if(list.length === 3 && list[2].length === 2){
        const city = list[1];
        const country = list[2];
        return fetchWeather(city, country).then( data => msg.channel.send(data));
      }
  }
  
  
  async function fetchWeather(city, country, lang="pl"){
    const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&APPID=${WEATHERTOKEN}&lang=${lang}&units=metric`);
    const res = await data.json();
    return JSON.stringify(res)
  }

  return { pogoda, fetchWeather }
}

module.exports = weather(); 