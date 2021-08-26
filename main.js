const Discord = require("discord.js")
const client = new Discord.Client();
const { random } = Math;
const { pogoda } = require('./util/weather');
const { serveImage, createCanvas} = require('./util/serveimg');

const MongoClient = require('mongodb').MongoClient;
const config = require('./config.json');
const url = config['db-url']; 
const { TOKEN } = config;

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

client.login(TOKEN);

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

module.exports = {help, client}; 