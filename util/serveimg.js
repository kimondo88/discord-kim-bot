const Canvas = require('canvas');
const Discord = require("discord.js");

function image(){

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

  return { serveImage, createCanvas }
}

module.exports = image();
