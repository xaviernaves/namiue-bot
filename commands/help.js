const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
    let isAdmin = message.guild.member(message.author).hasPermission('ADMINISTRATOR');
    let helpEmbed = new Discord.MessageEmbed()
    if (args.length == 0) {
        helpEmbed
            .setColor('#0099ff')
            .setTitle('Help')
            .addField('coins', 'Display the amount of nmcoins you have')
            .addField('daily', 'Claim your fwee daily nmcoins')
            .addField('level', 'Check your level on a team-based event, you will get EXP for each message when it is active')
            .addField('shop', 'This is where your nmcoins can be spent, run **nm_help shop** for more information')
            .addField('teams', 'Run **nm_help teams** for more information')
            .setFooter('It does not add EXP or nmcoins on spam messages, so no point in spamming.')
        message.channel.send(helpEmbed);
    } else {
        switch (args[0]) {
            case 'shop':
                helpEmbed
                    .setColor('#0099ff')
                    .setTitle('Shop help')
                    .addField('nm_shop', 'Displays all the items in the store')
                    .addField('nm_shop buy [item number]', 'Buy the selected item')
                message.channel.send(helpEmbed);
                break;

            case 'teams':
                    helpEmbed
                        .setColor('#0099ff')
                        .setTitle('Teams help')
                        .addField('nm_teams', 'Display team members')
                        .addField('nm_teams leaderboard', 'List the top 5 participants')

                    if (isAdmin) {
                        helpEmbed.addField('nm_teams shuffle [messageID]', 'Randomize the teams based on the :thumbsup: reactions of the selected message')
                            .addField('nm_teams clear roles', 'Remove the roles of all participants')
                            .addField('nm_teams clear xp', 'Clear the exp gained from all participants')
                            .addField('nm_teams pause', 'Pause exp gain')
                            .addField('nm_teams resume', 'Resume exp gain')
                    }
                    message.channel.send(helpEmbed);
                break;

            case 'coins':
                helpEmbed
                    .setColor('#0099ff')
                    .setTitle('nmcoins help')
                    .addField('nm_coins', 'Display the amount of nmcoins you have')
                    .addField('nm_coins leaderboard', 'Show a leaderboard with the top 5 members with the most monei')
                break;
            default:
                break;
        }
    }
}

module.exports.help = {
    name: 'help'
}