const Discord = require('discord.js');
const fetch = require('node-fetch');
const { tenorSearch } = require('../../functions');

module.exports.run = async (bot, message, args) => {
    let img;
    tenorSearch('anime-smile').then(obj => {
        let random_gif = obj.results[Math.floor(Math.random() * obj.results.length)];;
        img = random_gif.media[0].gif.url || random_gif.media[0].tinygif.url;

        let embed = new Discord.MessageEmbed()
            .setImage(img)
        message.channel.send(embed);
    });
}

module.exports.help = {
    name: "smile"
}