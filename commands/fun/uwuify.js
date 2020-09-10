const Discord = require('discord.js');
const uwuify = require('owoify-js').default;

module.exports.run = async (bot, message, args) => {
    message.delete();
    let text = args.join(' ');
    message.channel.send(uwuify(text, 'uwu'));
}

module.exports.help = {
    name: 'uwuify'
}