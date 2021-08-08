const Discord = require("discord.js")
const client = new Discord.Client();
const fetch = require("node-fetch");
const dotenv = require('dotenv').config();
const Canvas = require('canvas');

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
}); 

client.on("message", async msg => {
  if(msg.content.startsWith("$", 0)){
    if(msg.content.startsWith("$pogoda", 0)){
      pogoda(msg);
    }
    if (msg.content === "$obraz"){
      createCanvas(msg); 
    }
    if (msg.content.startsWith("$help", 0)){
      help(msg);
    }
  }else {}
});



console.log(process.env.TOKEN);

//client.login(process.env.TOKEN);

async function pogoda(msg){
  const list = msg.content.split(' '); 
    if(list.length === 3 && list[2].length === 2){
      const city = list[1];
      const country = list[2];
      return fetchWeather(city, country).then( data => msg.channel.send(data) );
    }
}


async function fetchWeather(city, country, lang="pl"){
  return await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},
  ${country}&APPID=${process.env.WEATHERTOKEN}&lang=${lang}&units=metric`)
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

async function createCanvas(msg){
  const canvas = Canvas.createCanvas(100, 100);
  const context = canvas.getContext('2d');

  const pepe = await Canvas.loadImage('./img/pepe.jpg');

  context.drawImage(pepe, 0, 0, canvas.width, canvas.height);
  context.font = '20px sans-serif';
  // Select the style that will be used to fill the text in
  context.fillStyle = '#ffffff';
  context.fillText('THE PEPE', canvas.width / 2.5, canvas.height / 1.8);

  const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-to-pepe.png');

  return msg.channel.send({ content: `Its a pepe bro, ${msg.author.username}`, files: [attachment] });
}

async function help(msg){
  const list = msg.content.split(' ');
    if(list[1] === "pogoda"){
      return msg.channel.send(`pogoda gets 2 arguments: city, and country. Example $pogoda london uk`);
    }else{
      return msg.channel.send(
        `Here is list of available commands (without prefix $): \n
        pogoda, obraz, help, for further information type $help <command>`
      )}
}

module.exports.help = help; 