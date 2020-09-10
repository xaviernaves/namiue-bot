const Discord = require('discord.js');
const fs = require('fs');
const { requireUncached, findByUID, leaderboard } = require('../functions');
let config = require('../config.json');

module.exports.run = async (bot, message, args) => {
    let coins = requireUncached('./db/coins.json');

    let lb = leaderboard(coins, 'coins', 5);
    let lbEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('nmcoins leaderboard:')

    let i = 1;

    lb.forEach(entry => {
        let user = message.guild.members.cache.find(user => user.id === entry.uid);
        let user_coins = coins[findByUID(coins, entry.uid)];

        if (user) {
            lbEmbed.addField(`[${i}]: ${user.user.username}`, `:moneybag: ${user_coins.coins} nmcoins`);
        }
        i++;
    });

    message.channel.send(lbEmbed);
}

module.exports.help = {
    name: 'top'
}