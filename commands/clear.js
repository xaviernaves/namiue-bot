const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
    //console.log(JSON.parse(args.slice(1).join('')));
    let isAdmin = message.guild.member(message.author).hasPermission('ADMINISTRATOR');
    switch (args[0]) {
        case 'nick':
            message.delete();
            if (isAdmin) {
                if (args[1] == 'all') {
                    let members = message.guild.members.cache;
                    members.forEach(member => {
                        try { member.setNickname(null); } catch (error) { }
                    });
                } else {
                    let member = message.guild.member(args[1]);
                    if (member) {
                        try { member.setNickname(null); } catch (error) { }
                    }
                }
                break;
            }

        default:
            break;
    }
}

module.exports.help = {
    name: 'clear'
}