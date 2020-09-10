const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
    var title, description;
    let isAdmin = message.guild.member(message.author).hasPermission('ADMINISTRATOR');

    if (isAdmin) {
        let msg = message.channel.send('Gimme a title 4 d embedded text');
        let title_collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 20000 });
        title_collector.on('collect', (message) => {
            title = message.content;
            msg.then(message => {
                message.edit('Gimme a description 4 d embedded text');
            });

            title_collector.stop();
            let desc_collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 20000 });
            desc_collector.on('collect', (message) => {
                description = message.content;

                let embedmsg = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(title)
                    .setDescription(description);

                message.channel.send(embedmsg);
                desc_collector.stop();
            });
        });
    }
    /*if (args.length > 0) {
        try {
            let msg = message.content.replace('nm_embed ', '');
            console.log(msg);
            
            let clearmsg = (msg) => {
                let stringified = JSON.stringify(msg);
                console.log(stringified);
                
                let beginning = stringified.substr(0, stringified.indexOf('description\\'));
                let description = stringified.substr(stringified.indexOf('description\\'), stringified.length);
                console.log(description);
                
                return beginning;
            }
            //console.log(clearmsg(msg));
            let embedmsg = JSON.parse(msg);
            embedmsg.description = embedmsg.description.join('\n\n');
            console.log(embedmsg);
            
            message.channel.send({
                embed: embedmsg
            });
        } catch (error) {
            console.log(error);
            
        }
    }*/
}

module.exports.help = {
    name: 'embed'
}