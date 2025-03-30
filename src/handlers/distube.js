import { DisTube } from 'distube';
import { SpotifyPlugin } from '@distube/spotify';
import { YouTubePlugin } from '@distube/youtube';
import { FilePlugin } from '@distube/file';
import { SoundCloudPlugin } from '@distube/soundcloud';
import { YtDlpPlugin } from '@distube/yt-dlp';
import Discord from 'discord.js';
import fs from 'fs';

const leaveTimers = new Map();
const MAX_WAIT_TIME = 5 * 60 * 1000; // X min

export default client => {
   console.log(`Music handler loaded`.red);


   client.DisTube = new DisTube(client, {
      emitNewSongOnly: false,
      savePreviousSongs: true,
      emitAddSongWhenCreatingQueue: false,
      nsfw: false,
      plugins: [ // Order matters!
         new FilePlugin(),
         new YouTubePlugin({
            ytdlOptions: {
               quality: 'highestaudio',
                //playerClients: ["ANDROID"]
                //playerClients: ["ANDROID"]
                //playerClients: ["ANDROID", "WEB", "WEB_CREATOR", "IOS", "WEBEMBEDDED", "MWEB"] // only ANDROID is working
            },
            cookies: process.env.USE_YT_COOKIES === 'true'
               ? JSON.parse(fs.readFileSync(`./cookies.json`))
               : null
         }),
         new SpotifyPlugin(),
         new SoundCloudPlugin(),
         new YtDlpPlugin({ update: true }),

      ]
   });

   const distube = /** @type {DisTube} */ (client.DisTube);

   // if debugging
   if (process.env.DEBUG_FFMPEG === 'true') {
      distube.on("ffmpegDebug", (debug) => {
         console.log(`ffmpegDebug: ${debug}`.red);
      });
   }
   if (process.env.DEBUG_DISTUBE === 'true') {
      distube.on("error", (error, queue, song) => {
         console.error(`DisTube error: ${error}`)
      });
   }

   distube.on("playSong", (queue, song) => {

      // Reset leave timers
      const guildId = (queue.voiceChannel || queue.textChannel).guildId;
      if (leaveTimers.has(guildId)) {
         clearTimeout(leaveTimers.get(guildId));
         leaveTimers.delete(guildId);
      }

      // Send message to channel
      if (!queue.textChannel) {
         distube.setVolume(guildId, 150);
         return;
      }

      distube.setVolume(guildId, 50);

      queue.textChannel.send({
         embeds: [new Discord.EmbedBuilder()
            .setColor("#3498db")
            .setDescription(`** [\`${song.name}\`](${song.url}) **`)
            .setURL(song.url)
            .setThumbnail(song.thumbnail)
            .addFields([
               {
                  name: `Requested By`,
                  value: `\`${song.user.tag}\``,
                  inline: true,
               },
               {
                  name: `Author`,
                  value: `\`${song.uploader.name}\``,
                  inline: true,
               },
               {
                  name: `Duration`,
                  value: `\`${song.formattedDuration}\``,
                  inline: true,
               },
            ])
            .setFooter({
               text: `🔹 ${queue.songs.length} songs in queue`,
               iconURL: song.user.displayAvatarURL({ dynamic: true })
            }),
         ]
      });
   });

   distube.on("addSong", (queue, song) => {
      let description = `**Queued:** [\`${song.name}\`](${song.url}) - ${song.formattedDuration}`;

      if (song.url?.startsWith('file:')) {
         description = `**Queued:** [\`${song.name}\`] - ${song.formattedDuration}`;
         return;
      }

      queue.textChannel && queue.textChannel.send({
         embeds: [
            new Discord.EmbedBuilder()
               .setColor("#3498db")
               .setDescription(`**Queued:** [\`${song.name}\`](${song.url}) - ${song.formattedDuration}`)
               .setThumbnail(song.thumbnail)
               .addFields([
                  {
                     name: `Added song by`,
                     value: `\`${song.user.tag}\``,
                     inline: true,
                  },
                  {
                     name: `Author`,
                     value: `\`${song.uploader.name}\``,
                     inline: true,
                  },
                  {
                     name: `Duration`,
                     value: `\`${song.formattedDuration}\``,
                     inline: true,
                  },
               ])
               .setFooter({
                  text: `🔹 ${queue.songs.length} songs in queue`,
                  iconURL: song.user.displayAvatarURL({ dynamic: true })
               })
         ]
      });
   });


   distube.on("finish", (queue) => {
      const voiceChannel = queue.voice;
      if (!voiceChannel) return;
      const guildId = (queue.voiceChannel || queue.textChannel).guildId;

      const timer = setTimeout(() => {
         queue.voice.leave();
         leaveTimers.delete(guildId);
      }, MAX_WAIT_TIME);

      leaveTimers.set(guildId, timer);
   });
};