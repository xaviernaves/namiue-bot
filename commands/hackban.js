const Discord = require('discord.js');
const fs = require('fs');

module.exports.run = async (bot, message, args) => {
    let isAdmin = message.guild.member(message.author).hasPermission('ADMINISTRATOR');
    let reason = args.slice(1).join(' ');
    if (args[0]) {
        if (isAdmin) {
            bot.users.fetch(args[0]).then(user => {
                let bans = message.guild.fetchBans().then(bans => {
                    console.log(bans);
    
                    let banned_user = bans.find(usr => usr.user.id == user.id);
    
                    console.log(banned_user);
    
                    if (banned_user) {
                        message.channel.send('This user is already banned.')
                    } else {
                        try {
                            message.guild.members.ban(user.id, { reason: reason });
    
                            let reason_text = (reason.length > 0) ? reason : 'None provided';
                            let banEmbed = new Discord.MessageEmbed()
                                .setColor('#0099ff')
                                .setAuthor(message.author.username, message.author.displayAvatarURL())
                                .setDescription(`Successfully banned ${user.username}#${user.discriminator}`)
                                .addField('Reason', reason_text)
                                .setFooter(`${message.author.username}#${message.author.discriminator}`)
                                .setTimestamp()
                            message.channel.send(banEmbed);
                        } catch (error) {
                            console.log(error);
                        }
                    }
                });
            }).catch(err => {
                message.channel.send('Could not find user.');
            });
        } else {
            message.channel.send('You must be an administrator to use this.');
        }
    } else {
        message.channel.send('**nm_hackban <user_id> reason')
    }
}

module.exports.help = {
    name: 'hackban'
}