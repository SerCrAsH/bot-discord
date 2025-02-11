import { loadFiles } from '../../structures/utils.js';
import { pathToFileURL } from 'url';
import { DisTube } from 'distube';

const SOUND_ROOTH_PATH = 'sounds';
const soundfiles = await loadFiles(SOUND_ROOTH_PATH);
const SOUNDS = new Map();

for (const file of soundfiles) {
    const soundFilename = file.split("/").pop();
    const soundName = file.split("/").pop().split(".")[0];
    SOUNDS[soundName] = {
        path: soundFilename,
        file: file,
        fileUrl: pathToFileURL(file).href
    };
}

//console.log(`Final sounds ${JSON.stringify(SOUNDS)}`);

const DESCRIPTION = "Play a sound in a voice channel from given list: " + Object.keys(SOUNDS).join(', ');


export default {
    DESCRIPTION: DESCRIPTION,
    OWNER: false,
    execute: async (client, message, args, prefix) => {
        if (!args.length) return message.reply("You need to provide a sound name or link");
        if (args[0] == 'help') {
            return message.reply(DESCRIPTION);
        }
        if (!message?.member?.voice?.channel) return message.reply("You need to join a voice channel first");
        if ((args.length && args.length != 1) || !SOUNDS[args[0]]) {
            return message.reply("You need to provide a sound id from available list (check it using 'sound help')");
        }

        if (message.guild.members?.me?.voice?.channel
            && message.member.voice?.channel.id != message.guild.members?.me?.voice?.channel.id) {
            return message.reply("You need to be in the same voice channel as me");
        }

        const sound = SOUNDS[args[0]];

        try {
            // console.log(`playing sound ${sound.fileUrl} at ${message.member.voice?.channel}`)
            const distube = /** @type {DisTube} */ (client.DisTube);
            if (distube.getQueue(message.guildId)?.isPlaying()) {
                console.log(`Queue already playing in ${message.guild.name}`)
                return;
            }

            distube.play(message.member.voice?.channel, sound.fileUrl);
        } catch (e) {
            message.reply(`Error while playing ${sound}... : ${e}`);
            console.log(`Error: ${e}`);
        }
    }
}