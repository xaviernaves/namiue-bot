const Discord = require('discord.js');
const fs = require('fs');
const { requireUncached, findByUID, Date } = require('../functions');

module.exports.run = async (bot, message, args) => {
    let coins = requireUncached('./db/coins.json');
    let author = message.author;
    if (findByUID(coins, author.id) == -1) {
        coins.push({
            uid: author.id,
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

    let userCoins = coins[findByUID(coins, author.id)];
    let streak = userCoins.streak;
    if (Date.now() >= userCoins.daily) {
        let coinsAdd = Math.floor(Math.floor((Math.random() * (125 - 80 + 1) + 80)) /1.2);

        if (Date.now() <= streak.breaks_at) {
            if (streak.number > 0) {
                coinsAdd += Math.floor((coinsAdd * (streak.number * streak.multiplier)));
            }
            streak.number++;
        } else {
            if (streak.number > 0) {
                message.channel.send('Oopsies...your streak is over ;-;')
            }
            streak.number = 1;
        }

        userCoins.coins += coinsAdd;
        userCoins.daily = new Date().addHours(18).getTime();
        streak.breaks_at = new Date().addHours(24).getTime();

        let dailyEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setAuthor(message.author.username, message.author.displayAvatarURL())

        .setDescription(`
        Streak: ${streak.number} \n
        You earned :moneybag: ${coinsAdd} **nmcoins** :3 \n
        You can claim your next daily reward in 18h, if you don't claim your reward within 6h after the daily reward is available, your streak will be reset.`)

        .setFooter(`Balance: ${userCoins.coins}`)
        message.channel.send(dailyEmbed);

        fs.writeFileSync('./db/coins.json', JSON.stringify(coins, null, 4), (err) => {
            if (err) console.log(err);
        });
    } else {
        let diff = Math.abs(userCoins.daily - Date.now()) / 1000;
        let hours = Math.floor(diff / 3600) % 24;
        let minutes = Math.floor(diff / 60) % 60;

        let msg = (hours > 0)
            ? `Looks like you will have to wait **${hours}h and ${minutes}min** to be able to claim your daily reward!`
            : `Looks like you will have to wait **${minutes}min** to be able to claim your daily reward!`;
        message.channel.send(msg);
    }
}

module.exports.help = {
    name: 'daily'
}