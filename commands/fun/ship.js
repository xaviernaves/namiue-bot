const Discord = require('discord.js');
const { ship } = require('../../functions');

module.exports.run = async (bot, message, args) => {
    let mentions = args.map(mention => message.guild.members.cache.find(user => user.id === mention.slice(3, mention.length - 1)));
    if (mentions.length == 1) {
        if (mentions[0] == undefined) return message.channel.send('Invalid arguments');
        let mention = mentions[0].user, msg;

        if (message.author.id == mention.id) {
            msg = `${message.author.username} x ${mention.username} = ❤`
        } else {
            mentions.unshift(message.guild.members.cache.find(user => user.id == message.author.id));
            msg = `${mentions[0].user.username} x ${mentions[1].user.username} = ${ship(mentions)} <:nm_pepo_umm:727890378459447396>`;
        }
        message.channel.send(msg);
    } else if (mentions.length == 2) {
        if (mentions[0] == undefined || mentions[1] == undefined) return message.channel.send('Invalid arguments');
        let msg = `${mentions[0].user.username} x ${mentions[1].user.username} = ${ship(mentions)} <:nm_pepo_umm:727890378459447396>`;
        message.channel.send(msg);
    }
}

module.exports.help = {
    name: "ship"
}