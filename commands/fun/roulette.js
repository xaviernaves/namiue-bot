const Discord = require('discord.js');
const fs = require('fs');
const { requireUncached, findByUID } = require('../../functions');

module.exports.run = async (bot, message, args) => {
    let users = new Set();
    if (args[0]) {
        let bet = (parseInt(args[0])) ? parseInt(args[0]) : args[0];
        if (typeof bet == 'number') {
            if (bet > 1) {
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

                if (coins[findByUID(coins, author.id)].coins >= bet) {
                    users.add(message.author);
                    message.channel.send('Say join to participate in the russian roulette, you have 30 seconds to join');
                    let collector = new Discord.MessageCollector(message.channel, message => message.content.toLowerCase() == 'join', { time: 30000 });
                    collector.on('collect', (msg) => {
                        try {
                            if (coins[findByUID(coins, msg.author.id)].coins >= bet) {
                                users.add(msg.author);
                                coins[findByUID(coins, msg.author.id)].coins -= bet;
                            } else {
                                msg.reply('you don\'t have enough coins to participate');
                            }
                        } catch (error) {
                            msg.reply('you don\'t have enough coins to participate');
                        }
                    });
                    collector.on('end', () => {
                        if (users.size > 1) {
                            let collected_bet = bet * users.size;
                            let users_array = Array.from(users);
                            let random = Math.floor(Math.random() * users_array.length);

                            let winner = users_array.splice(random, 1);
                            users_array.push(winner[0]);

                            let edit_msg = message.channel.send('...');
                            var i = 0;
                            var displayMessages = function(coins, message, edit_msg, users_array, winner, collected_bet) {
                                edit_msg.then(msg => msg.edit(`Will ${users_array[i].username} be the one...?`));

                                setTimeout(function () {
                                    const user = users_array[i];
                                    if (user.id == winner[0].id) {
                                        message.channel.send(`Congratulations ${user.username}, you didn't get shot so your prize is **${collected_bet} nm_coins**! 😎`);
                                        coins[findByUID(coins, user.id)].coins += collected_bet;
                                        i++;
                                    } else {
                                        edit_msg.then(msg => msg.edit(`Oof, ${user.username} got shot and now is ded`));
                                        i++;
                                    }
                                    if (i < users_array.length) {
                                        setTimeout(displayMessages, 2000, coins, message, edit_msg, users_array, winner, collected_bet)
                                    } else {
                                        fs.writeFileSync('./db/coins.json', JSON.stringify(coins, null, 4), (err) => {
                                            if (err) console.log(err);
                                        });                                
                                    }
                                }.bind(coins, message, edit_msg, users_array, winner, collected_bet), 4000);
                            };

                            displayMessages(coins, message, edit_msg, users_array, winner, collected_bet);
                        } else {
                            message.channel.send('Not enough players to play');
                        }
                    });
                } else {
                    message.channel.send('Not enough nmcoins');
                }
            }
        } else {
            message.channel.send('Invalid arguments, specify an amount to bet');
        }
    } else {
        message.channel.send('You have to specify an amount to bet with all participants');
    }
}

module.exports.help = {
    name: "roulette"
}

