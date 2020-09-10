const Discord = require('discord.js');
const fs = require('fs');
const { requireUncached, findByUID } = require('../functions');
const items = require('../db/shop_items.json');

module.exports.run = async (bot, message, args) => {
    if (args.length == 0) {
        let shopEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Shop Items')
            .setFooter('Use nm_shop buy itemNumber to buy an item')
            let i = 1;
            items.forEach(item => {
                shopEmbed.addField(`[${i}]. ${item.name}: :moneybag: ${item.price} nmcoins`, item.description);
                if (i < items.length) {
                    shopEmbed.addField('\u200B', '\u200B');
                }
                i++;
            })
        message.channel.send(shopEmbed);
    } else {
        switch (args[0]) {
            case 'buy':
                let coins = requireUncached('./db/coins.json');
                if (args[1] > 0 && args[1] <= items.length) {
                    let item = items[args[1]-1];
                    let user = message.guild.members.cache.find(user => user.id === message.author.id);
                    
                    if (user.roles.cache.has(item.role)) return message.channel.send('You already own this item.');
                    if (coins[findByUID(coins, message.author.id)].coins < item.price) return message.channel.send('You don\'t have enough nmcoins to buy this.');

                    user.roles.add(item.role);
                    coins[findByUID(coins, message.author.id)].coins -= item.price;
                    fs.writeFileSync('./db/coins.json', JSON.stringify(coins, null, 4), (err) => {
                        if (err) console.log(err);
                    });


                    let msg = (item.hasOwnProperty('channel'))
                    ? `Great! You now have the **${item.name.toLowerCase()}**, go check it out in <\#${item.channel}>!`
                    : `Great! You now have the **${item.name.toLowerCase()}**`;
                    message.channel.send(msg);
                } else if (!args[1]) {
                    message.channel.send('You must specify the item you want to buy');
                } else if (!(args[1] > 0 && args[1] < items.length)) {
                    message.channel.send('You specified a wrong value');
                }
                break;
                
            case 'sell':
                break
            default:
                break;
        }
    }
}

module.exports.help = {
    name: 'shop'
}