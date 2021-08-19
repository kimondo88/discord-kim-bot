const Discord = require("discord.js")
const client = new Discord.Client();
const fetch = require("node-fetch");
const dotenv = require('dotenv').config();
const Canvas = require('canvas');
const { random } = Math

const MongoClient = require('mongodb').MongoClient;
const config = require('./config.json');
const url = config['db-url']; 

const prfx = "$";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
}); 

client.on("message", async msg => {
  if(msg.content.startsWith(`${prfx}`, 0)){
    if(msg.content.startsWith(`${prfx}pogoda`, 0)){
      pogoda(msg);
    }
    else if (msg.content === `${prfx}obraz`){
      createCanvas(msg); 
    }
    else if (msg.content.startsWith(`${prfx}help`, 0)){
      help(msg);
    }
    else if (msg.content === `${prfx}gacha`){
      gacha(msg);
    }
  }else {}
});



console.log(process.env.TOKEN);

client.login(process.env.TOKEN);

async function pogoda(msg){
  const list = msg.content.split(' '); 
    if(list.length === 3 && list[2].length === 2){
      const city = list[1];
      const country = list[2];
      return fetchWeather(city, country).then( data => msg.channel.send(data));
    }
}


async function fetchWeather(city, country, lang="pl"){
  return await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&APPID=${process.env.WEATHERTOKEN}&lang=${lang}&units=metric`)
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

async function serveImage(msg, filePath, message, rarity){
  const canvas = Canvas.createCanvas(35, 35);
  const context = canvas.getContext('2d');

  const image = await Canvas.loadImage(`./img/${filePath}.png`);

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  context.font = '8 px sans-serif';
  // Select the style that will be used to fill the text in
  context.fillStyle = '#000000';
  context.fillText(rarity, canvas.width / 2.5, canvas.height / 1.8);

  const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'result.png');

  return msg.channel.send({ content: `${message}`, files: [attachment] });
}

async function help(msg){
  const list = msg.content.split(' ');
    if(list[1] === "pogoda"){
      return msg.channel.send(`pogoda gets 2 arguments: city, and country. Example $pogoda london uk`);
    }else{
      return msg.channel.send(
        `Here is list of available commands (without prefix $): \n
        pogoda, obraz, gacha, help, for further information type $help <command>`
      )}
}

async function gacha(msg){
  const array = [3, 7, 15, 30, 45]
  const drops = [ 'Divine', 'Legendary', 'Epic', 'Rare', 'Common']
  const stars = ['S*', '5*', '4*', '3*', '2*']
  const randNumber = (random()*100).toFixed(0); 
  var sum = 0;

  for(let i = 0; i < array.length ; i++){
    sum += array[i];
    if(checkRange (randNumber, i, array[i])){
      return await serveImage(msg, drops[i], `Woah ${msg.author.username}, you got: ` + drops[i], stars[i])
    }
    else if(checkRange(randNumber, sum + 1 - array[i], sum)){
      return await serveImage(msg, drops[i], `Nice catch ${msg.author.username}, you got: ` + drops[i], stars[i])
    }
  }
}


function checkRange(number, num0, num1){
  return (number >= num0) && (number <= num1)
}

module.exports = {help, createCanvas, fetchWeather, pogoda, client}; 