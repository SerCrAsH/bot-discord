const roll = function (min = 1, max = 100) {
    // Rnd number between 0 and max-min
    const random = Math.floor(Math.random() * (max - min));
    return random + min;
}

const DESCRIPTION = "Roll numbers 1-100 by default or give <min> <max> values. For example: roll 1 6";

export default {
    DESCRIPTION: DESCRIPTION,
    OWNER: false,
    execute: async (client, message, args) => {
        if (args[0] == 'help') {
            return message.reply(DESCRIPTION);
        }
        if (args.length && args.length != 2) {
            return message.reply("You need to provide a min number and a max number or let it empty. *For example*: roll 1 6");
        }

        try {
            let min = 1;
            let max = 100;
            if (args && args.length == 2) {
                min = parseInt(args[0]);
                max = parseInt(args[1]);

                if (isNaN(min) || isNaN(max) || max < 0 || min < 0) {
                    return message.reply("Try with positive numbers");
                } else if (max < min) {
                    return message.reply("Max number should be greather than min number");
                } else if (max == min) {
                    return message.reply(`🎲 ${min} ... 🥴🥴`);
                }
            }

            const number = roll(min, max);
            message.reply(`🎲 ${number}`);
        } catch (e) {
            message.reply(`Error while rolling (?) : ${e}`);
            console.log(`Error: ${e}`);
        }
    }
}