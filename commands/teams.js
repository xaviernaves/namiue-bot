const Discord = require("discord.js");
const fs = require('fs');
const { requireUncached, findByUID, leaderboard } = require('../functions');

let current_team = "blue";
module.exports.run = async (bot, message, args) => {
    let config = requireUncached('./config.json');
    let teams = requireUncached('./db/teams.json');
    let xp = requireUncached('./db/xp.json');

    if (args.length == 0) {
        if (config.teamsActive) {
            let blue = message.guild.roles.cache.find(role => role.id === config.teams.blue);
            let red = message.guild.roles.cache.find(role => role.id === config.teams.red);

            let team_members_embed = {
                "blue": "",
                "red": ""
            }

            blue.members.forEach(member => {
                team_members_embed.blue += `${member.user.username}\n`;
            });
            red.members.forEach(member => {
                team_members_embed.red += `${member.user.username}\n`;
            });

            message.channel.send({
                embed: {
                    color: '#0099ff',
                    title: "Team members:",
                    fields: [
                        {
                            name: "_ _",
                            value: `**<@&${config.teams.blue}>**\n` + team_members_embed['blue'],
                            inline: true
                        },
                        {
                            name: "_ _",
                            value: '\u200B',
                            inline: true
                        },
                        {
                            name: "_ _",
                            value: `**<@&${config.teams.red}>**\n` + team_members_embed['red'],
                            inline: true
                        }
                    ]
                }
            });
        }
    } else {
        let isAdmin = message.guild.member(message.author).hasPermission('ADMINISTRATOR');
        switch (args[0]) {
            case 'leaderboard':
                let lb = leaderboard(xp, 'xp', 5);
                let lbEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Teams leaderboard:')

                let i = 1;
                lb.forEach(entry => {
                    let user = message.guild.members.cache.find(user => user.id === entry.uid);
                    let role = user.roles.cache.find(role => role.id == config.teams.blue)
                        || user.roles.cache.find(role => role.id == config.teams.red);

                    let user_xp = xp[findByUID(xp, entry.uid)]
                    lbEmbed.addField(`[${i}]: ${user.user.username}`, `<@&${role.id}> \t Level: ${user_xp.level} \t EXP: ${user_xp.xp}`);
                    i++;
                });

                message.channel.send(lbEmbed);
                break;
            case 'shuffle':
                if (isAdmin) {
                    if (args[1]) {
                        message.channel.messages.fetch(args[1]).then(msg => {
                            message.delete();
                            msg.reactions.cache.each(reaction => {
                                if (reaction._emoji.name == '👍') {
                                    let team_members_embed = {
                                        "blue": "",
                                        "red": ""
                                    }

                                    teams = [];
                                    reaction.users.fetch().then(usrs => {
                                        let users = Array.from(usrs);
                                        for (let i = users.length - 1; i > 0; i--) {
                                            const j = Math.floor(Math.random() * (i + 1));
                                            [users[i], users[j]] = [users[j], users[i]];
                                        }

                                        users.forEach(usr => {
                                            //let role = message.guild.roles.cache.find(role => role.id === config.teams[current_team]);
                                            let role = config.teams[current_team];
                                            let user = message.guild.members.cache.find(user => user.id === usr[0]);
                                            user.roles.add(role);

                                            teams.push({
                                                [user.id]: {
                                                    team: role
                                                }
                                            }
                                            );

                                            team_members_embed[current_team] += `${user.user.username}\n`;
                                            current_team = (current_team == "blue") ? "red" : "blue";
                                        });

                                        message.channel.send({
                                            embed: {
                                                color: '#0099ff',
                                                title: "Team selection:",
                                                fields: [
                                                    {
                                                        name: "_ _",
                                                        value: `**<@&${config.teams.blue}>**\n` + team_members_embed['blue'],
                                                        inline: true
                                                    },
                                                    {
                                                        name: "_ _",
                                                        value: '\u200B',
                                                        inline: true
                                                    },
                                                    {
                                                        name: "_ _",
                                                        value: `**<@&${config.teams.red}>**\n` + team_members_embed['red'],
                                                        inline: true
                                                    }
                                                ]
                                            }
                                        });

                                        config.teamsActive = true;
                                        fs.writeFile('./db/config.json', JSON.stringify(config, null, 4), (err) => {
                                            if (err) console.log(err);
                                        });

                                        fs.writeFile('./db/teams.json', JSON.stringify(teams, null, 4), (err) => {
                                            if (err) console.log(err);
                                        });
                                    });
                                    return;
                                }
                            });
                        }).catch(console.error);
                    } else {
                        message.channel.send('Specify the message id with the :thumbsup: reactions');
                    }
                } else {
                    message.channel.send('You must be an administrator to use this command.');
                }
                break;

            case 'clear':
                if (isAdmin) {
                    if (args[1] == 'roles') {
                        let blue = message.guild.roles.cache.find(role => role.id === config.teams.blue).members;
                        let red = message.guild.roles.cache.find(role => role.id === config.teams.red).members;
    
                        blue.forEach(member => {
                            member.roles.remove(config.teams.blue);
                        });
                        red.forEach(member => {
                            member.roles.remove(config.teams.red);
                        });
    
                        teams = [];
                        fs.writeFile('./db/teams.json', JSON.stringify(teams, null, 4), (err) => {
                            if (err) console.log(err);
                        });
                    }
    
                    if (args[1] == 'xp') {
                        xp = JSON.stringify([], null, 4);
                        fs.writeFile('./db/xp.json', xp, (err) => {
                            if (err) console.log(err);
                        });
                    }
                } else {
                    message.channel.send('You must be an administrator to use this command.');
                }
                break;

            case 'resume':
                if (isAdmin) {
                    config.teamsActive = true;
                    fs.writeFile('./config.json', JSON.stringify(config, null, 4), (err) => {
                        if (err) console.log(err);
                    });
    
                    message.delete();
                    message.channel.send('Resumed tracking team activities.').then(sentMessage => {
                        sentMessage.delete({ timeout: 3000 })
                    }).catch(err => console.log(err));
                } else {
                    message.channel.send('You must be an administrator to use this command.');
                }
                break;
            case 'pause':
                if (isAdmin) {
                    config.teamsActive = false;
                    fs.writeFile('./config.json', JSON.stringify(config, null, 4), (err) => {
                        if (err) console.log(err);
                    });
    
                    message.delete();
                    message.channel.send('Paused tracking team activities.').then(sentMessage => {
                        sentMessage.delete({ timeout: 3000 })
                    }).catch(err => console.log(err));
                } else {
                    message.channel.send('You must be an administrator to use this command.');
                }
                break;
            default:
                break;
        }
    }
}

module.exports.help = {
    name: 'teams'
}