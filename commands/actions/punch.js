const Discord = require('discord.js');
const fetch = require('node-fetch');
const { tenorSearch } = require('../../functions');

module.exports.run = async (bot, message, args) => {    
    if (args[0]) {
        if (args[0].toString().includes(message.mentions.users.first().id)) {
            let mention = message.mentions.users.first();
            if (mention.id == message.author.id) {
                message.channel.send('Dont hurt urself pwz');
            } else {
                let msg, img;
                tenorSearch('anime-punch').then(obj => {
                    let random_gif = obj.results[Math.floor(Math.random() * obj.results.length)];
                    msg = `${message.author.username} punches ${mention.username}, AND THATS A ONE HIT K.O!`;
                    img = random_gif.media[0].gif.url || random_gif.media[0].tinygif.url;

                    let embed = new Discord.MessageEmbed()
                        .setAuthor(msg, message.author.displayAvatarURL(), random_gif.itemurl)
                        .setImage(img)
                    message.channel.send(embed);
                });
            }
        }
    } else {
        message.channel.send('Bruh <:nm_pepo_mock:727909363490095146>')
    }
}

module.exports.help = {
    name: "punch"
}