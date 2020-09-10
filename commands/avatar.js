const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
    if (args[0]) {
        if (args[0].toString().includes(message.mentions.users.first().id)) {
            let embed = new Discord.MessageEmbed()
            .setImage(message.mentions.users.first().displayAvatarURL())

            message.channel.send(embed);
        }
    } else {
        message.channel.send('You have to specify a user');
    }
}

module.exports.help = {
    name: "avatar"
}