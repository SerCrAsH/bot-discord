import { joinVoiceChannel, createAudioPlayer, createAudioResource } from '@discordjs/voice';
import { loadFiles } from '../../structures/utils.js';

const SOUND_ROOTH_PATH = 'sounds';
const soundfiles = await loadFiles(SOUND_ROOTH_PATH);
const SOUNDS = new Map();

for (const file of soundfiles) {
    const soundFilename = file.split("/").pop();
    const soundName = file.split("/").pop().split(".")[0];
    SOUNDS[soundName] = {
        path: soundFilename
    };
}

// console.log(`Final sounds ${JSON.stringify(SOUNDS)}`);

const DESCRIPTION = "Play a sound in a voice channel from given list: " + Object.keys(SOUNDS);

export default {
    DESCRIPTION: DESCRIPTION,
    OWNER: false,
    execute: async (client, message, args) => {
        if (args[0] == 'help') {
            return message.reply(DESCRIPTION);
        }

        if (args.length && args.length != 1 && !SOUNDS[args[0]]) {
            return message.reply("You need to provide a sound id from available list (check it using 'sound help')");
        }
        if (!message.member.voice.channel) {
            return message.reply('You need to be in a voice channel');
        }
        const sound = SOUNDS[args[0]];

        try {
            const connection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });

            const player = createAudioPlayer();
            const resourcePath = `src/${SOUND_ROOTH_PATH}/${sound.path}`;
            const resource = createAudioResource(resourcePath);

            player.play(resource);
            connection.subscribe(player);
        } catch (e) {
            message.reply(`Error while playing sound : ${e}`);
            console.log(`Error: ${e}`);
        }
    }
}