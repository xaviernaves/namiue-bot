const Discord = require("discord.js");
const fs = require('fs');
const { requireUncached, findByUID } = require('../functions');

module.exports.run = async (bot, message, args) => {
    let teams = Array.from(requireUncached('./db/teams.json'));
    let xp = requireUncached('./db/xp.json');
    let config = requireUncached('./config.json');
    let author = message.mentions.users.first() || message.author;

    try {
        if (findByUID(xp, author.id) == -1) {
            xp.push({
                uid: author.id,
                xp: 0,
                level: 0,
                messages: 0,
                team: teams.find(t => { return (t.hasOwnProperty(author.id))})[author.id].team
            });
            fs.writeFile('./db/xp.json', JSON.stringify(xp, null, 4), (err) => {
                if (err) console.log(err);
            });
        }
    } catch (error) {
        if (!config.teamsActive) return message.channel.send('Team event is not active');
        return message.channel.send(`${author.username} is not in any team ;-;`)
    }
    
    if (!config.teamsActive) return message.channel.send('Team event is not active');
    let userXP = xp[findByUID(xp, author.id)];
    let currEXP = userXP.xp;
    let currLvl = userXP.level;
    let nxtLvlEXP = (currLvl == 0) ? 100 : 200 * currLvl;
    let difference = nxtLvlEXP - currEXP;
    let lvlEmbed = new Discord.MessageEmbed()
    .setThumbnail(author.displayAvatarURL())
    .setColor('#0099ff')
    .addField("Level", currLvl, true)
    .addField("Exp", currEXP, true)
    .addField("EXP till Level up", difference)
    .addField("Team", `<@&${userXP.team}>`)

    message.channel.send(lvlEmbed);
}

module.exports.help = {
    name: 'level'
}