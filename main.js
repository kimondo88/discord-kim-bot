const Discord = require("discord.js")
const client = new Discord.Client();
const fetch = require("node-fetch");
const dotenv = require('dotenv').config();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
}); 

client.on("message", msg => {
  if (msg.content === "ping") {
    msg.reply("pong");
  }
  if (msg.content[0] === "$"){
    if(msg.content.startsWith("$pogoda", 0)){
      const list = msg.content.split(' '); 
      if(list.length === 3 && list[2].length === 2){
        const city = list[1];
        const country = list[2];
        fetchWeather(city, country).then( data => msg.channel.send(data) );
      }
     
    }
  }
});



console.log(process.env.TOKEN);

client.login(process.env.TOKEN);

async function fetchWeather(city, country){
  return await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&APPID=${process.env.WEATHERTOKEN}`)
  .then(res => {
    console.log(`fetching api weather for ${city}, ${country}`); 
    //console.log(res);
    return res.json(); 
  })
  .then(data => {
    //console.log(data); 
    return JSON.stringify(data); 
  })
}

