const Discord = require('discord.js');
const fs = require('fs');
const { requireUncached, findByUID, leaderboard } = require('../functions');
let config = require('../config.json');

module.exports.run = async (bot, message, args) => {
    let coins = requireUncached('./db/coins.json');
    let user = message.mentions.users.first() || message.author;

    if (args.length == 0 || args[0].toString().includes(user.id)) {
        if (findByUID(coins, user.id) == -1) {
            coins.push({
                uid: user.id,
                coins: 0,
                daily: Date.now(),
                streak: {
                    number: 0,
                    breaks_at: 0,
                    multiplier: 0.5
                },
                boost: 1
            });
        }
        let lb = leaderboard(coins, 'coins');
        let coinsEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`:moneybag: ${coins[findByUID(coins, user.id)].coins} nmcoins`)
            .setFooter(`Place ${findByUID(lb, user.id) + 1} in the leaderboard`)

        fs.writeFileSync('./db/coins.json', JSON.stringify(coins, null, 4), (err) => {
            if (err) console.log(err);
        });
        message.channel.send(coinsEmbed);
    }
}

module.exports.help = {
    name: 'coins'
}