String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.randomHalf = function () {
    return (this.length > 3)
        ? (Math.round(Math.random()) == 1)
            ? this.substr(0, Math.round(this.length / 2))
            : this.substr(Math.round(this.length / 2), this.length)
        : this
}

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

Date.prototype.addDays = function (d) {
    this.setTime(this.getTime() + (d * 24 * 60 * 60 * 1000));
    return this;
}

module.exports = {
    String,
    Date,

    requireUncached: (module) => {
        delete require.cache[require.resolve(module)];
        return require(module);
    },

    //Used to find the entry of exp and coins based on the uid
    findByUID: (arr, uid) => {
        try {
            arr = Array.from(arr);
            return arr.findIndex(object => object.uid == uid)
        } catch (error) { }
    },

    leaderboard: (arr, key, max = undefined) => {
        if (max) { return arr.sort((a, b) => { return b[key] - a[key] }).slice(0, max) }
        else { return arr.sort((a, b) => { return b[key] - a[key] }) }
    },

    tenorSearch: (params) => {
        const config = require('./config.json');
        const fetch = require('node-fetch');
        let URL = `https://api.tenor.com/v1/search?q=${params}&media_filter=minimal&key${config.tenor.key}&limit=50`;

        return fetch(URL).then(res => res.json());
    },

    ship: (mentions) => {
        let first_half, second_half, i = 1;
        mentions.forEach(mention => {
            let username = mention.user.username;

            if (i == 1) {
                first_half = String(username).randomHalf();
            } else if (i == 2) {
                second_half = String(username).randomHalf();
            }
            i++;
        });

        return String(`${first_half}${second_half}`).toLocaleLowerCase().capitalize();
    }
}