const Discord = require('discord.js');
const fetch = require('node-fetch');
const { tenorSearch } = require('../../functions');

module.exports.run = async (bot, message, args) => {    
    if (args[0]) {
        if (args[0].toString().includes(message.mentions.users.first().id)) {
            let mention = message.mentions.users.first();
            if (mention.id == message.author.id) {
                message.channel.send('...');
            } else {
                let msg, img;
                tenorSearch('anime-pat').then(obj => {
                    let random_gif = obj.results[Math.floor(Math.random() * obj.results.length)];
                    msg = `${message.author.username} pats ${mention.username} owo`;
                    img = random_gif.media[0].gif.url || random_gif.media[0].tinygif.url;

                    let embed = new Discord.MessageEmbed()
                        .setAuthor(msg, message.author.displayAvatarURL(), random_gif.itemurl)
                        .setImage(img)
                    message.channel.send(embed);
                });
            }
        }
    } else {
        message.channel.send('Yikes...Are you tryna pat the air bruh? <:nm_pepo_mock:727909363490095146>')
    }
}

module.exports.help = {
    name: "pat"
}