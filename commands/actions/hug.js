const Discord = require('discord.js');
const fetch = require('node-fetch');
const { tenorSearch } = require('../../functions');

module.exports.run = async (bot, message, args) => {
    if (args[0]) {
        try {
            if (args[0].toString().includes(message.mentions.users.first().id)) {
                let mention = message.mentions.users.first();
                if (mention.id == message.author.id) {
                    message.channel.send('Imagine trying to hug yourself...');
                } else {
                    let msg, img;
                    tenorSearch('anime-hug').then(obj => {
                        let random_gif = obj.results[Math.floor(Math.random() * obj.results.length)];
                        msg = `${message.author.username} hugs ${mention.username} owo`;
                        img = random_gif.media[0].gif.url || random_gif.media[0].tinygif.url;

                        let embed = new Discord.MessageEmbed()
                            .setAuthor(msg, message.author.displayAvatarURL(), random_gif.itemurl)
                            .setImage(img)
                        message.channel.send(embed);
                    });
                }
            }
        } catch (error) {
            message.channel.send('Yikes...Are you tryna hug the air bruh? <:nm_pepo_mock:727909363490095146>')
        }
    } else {
        message.channel.send('Yikes...Are you tryna hug the air bruh? <:nm_pepo_mock:727909363490095146>')
    }
}

module.exports.help = {
    name: "hug"
}