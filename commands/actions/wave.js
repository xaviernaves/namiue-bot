const Discord = require('discord.js');
const fetch = require('node-fetch');
const { tenorSearch } = require('../../functions');

module.exports.run = async (bot, message, args) => {
    if (args[0]) {
        if (args[0].toString().includes(message.mentions.users.first().id)) {
            let mention = message.mentions.users.first();
            if (mention.id == message.author.id) {
                message.channel.send('Thats a bit weird but ok');
            } else {
                let msg, img;
                tenorSearch('anime-wave').then(obj => {
                    let random_gif = obj.results[Math.floor(Math.random() * obj.results.length)];
                    msg = `${message.author.username} waves ${mention.username}`;
                    img = random_gif.media[0].gif.url || random_gif.media[0].tinygif.url;

                    let embed = new Discord.MessageEmbed()
                        .setAuthor(msg, message.author.displayAvatarURL(), random_gif.itemurl)
                        .setImage(img)
                    message.channel.send(embed);
                });
            }
        }
    } else {
        let img;
        tenorSearch('anime-wave').then(obj => {
            let random_gif = obj.results[Math.floor(Math.random() * obj.results.length)];;
            img = random_gif.media[0].gif.url || random_gif.media[0].tinygif.url;

            let embed = new Discord.MessageEmbed()
                .setImage(img)
            message.channel.send(embed);
        });
    }
}
module.exports.help = {
    name: "wave"
}