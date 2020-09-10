const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const { requireUncached, findByUID } = require('./functions');
bot.commands = new Discord.Collection();

let msgCooldown = new Set();
let cdseconds = 60;
let coinCooldown = new Set();
let config = requireUncached('./config.json');

bot.on("ready", async () => {
    bot.user.setActivity("you 😉 || nm_help", { type: "PLAYING" });
});

let readCommands = (dir) => {
    try {
        fs.readdir(dir, (err, files) => {
            if (err) console.log(err);

            let jsfile = files.filter(f => f.split('.').pop() === 'js')
            if (jsfile.length <= 0) {
                console.log(`Couldn't find commands in ${dir}`);
                return;
            }
            jsfile.forEach((f, i) => {
                let props = require(`${dir}/${f}`);
                console.log(`${dir}/${f} loaded`);
                bot.commands.set(props.help.name, props);
            });
        });
    } catch (error) { }
}

readCommands('./commands');
readCommands('./commands/actions');
readCommands('./commands/emotes');
readCommands('./commands/fun');

bot.on('message', async message => {
    config = requireUncached('./config.json');
    let teams = Array.from(require('./db/teams.json'));
    let coins = requireUncached('./db/coins.json');
    let xp = requireUncached('./db/xp.json');
    let prefix = config.prefix;
    
    if (message.content.toLocaleLowerCase().startsWith(prefix)) {
        let msgArray = message.content.split(" ");
        let cmnd = msgArray[0];
        let args = msgArray.slice(1);
        if (message.author.bot) return;

        let commandfile = bot.commands.get(cmnd.slice(prefix.length));
        if (commandfile) commandfile.run(bot, message, args);
    } else {
        let author = message.author;
        if (config.teamsActive == true && author.id != bot.user.id) {
            try {
                if (findByUID(xp, author.id) == -1) {
                    xp.push({
                        uid: author.id,
                        xp: 0,
                        level: 0,
                        messages: 0,
                        team: teams.find(t => { return (t.hasOwnProperty(author.id)) })[author.id].team
                    });
                }

                if (msgCooldown.has(author.id)) return;
                let userXP = xp[findByUID(xp, author.id)];
                let xpAdd = Math.floor(Math.random() * 5) + Math.floor(Math.random() * 10) + 6;
                let nxtLvl = (userXP.level == 0) ? 100 : 200 * userXP.level;
                userXP.xp = userXP.xp + xpAdd;
                userXP.messages++;
                if (nxtLvl <= userXP.xp) {
                    userXP.level++;
                    message.channel.send(`Congrats <@${author.id}>, you are now level ${userXP.level}!`);
                }
                fs.writeFile('./db/xp.json', JSON.stringify(xp, null, 4), (err) => {
                    if (err) console.log(err);
                });

                msgCooldown.add(author.id);
                setTimeout(() => {
                    msgCooldown.delete(author.id);
                }, cdseconds * 1000);
            } catch (error) { }
        }

        if (!coinCooldown.has(author.id) && author.bot == false) {
            try {
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

                let coinsAdd = Math.floor(Math.floor(Math.random() * (30 - 10 + 1) + 10) * Math.floor(config.nmCoinsBoost * coins[findByUID(coins, author.id)].boost));
                coins[findByUID(coins, author.id)].coins += coinsAdd;

                fs.writeFileSync('./db/coins.json', JSON.stringify(coins, null, 4), (err) => {
                    if (err) console.log(err);
                });

                coinCooldown.add(author.id);
                setTimeout(() => {
                    coinCooldown.delete(author.id);
                }, cdseconds * 1000);
            } catch (error) { }
        }
    }
});

bot.login(config.token);