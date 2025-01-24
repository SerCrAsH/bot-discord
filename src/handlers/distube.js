import { DisTube } from 'distube';
import { SpotifyPlugin } from '@distube/spotify';
import { YouTubePlugin } from '@distube/youtube';
import { SoundCloudPlugin } from '@distube/soundcloud';
import { YtDlpPlugin } from '@distube/yt-dlp';
import ytdlUtils from "@distube/ytdl-core/lib/utils.js";
import ytdl from "@distube/ytdl-core";
import { createAgent } from "@distube/ytdl-core/lib/agent.js";
import Discord from 'discord.js';
import fs from 'fs';

export default client => {
   console.log(`Music handler loaded`.red);


   client.DisTube = new DisTube(client, {
      emitNewSongOnly: false,
      savePreviousSongs: true,
      emitAddSongWhenCreatingQueue: false,
      nsfw: false,
      plugins: [
         new YouTubePlugin({
            ytdlOptions: {
               // playerClients: ["ANDROID", "WEB", "WEB_CREATOR", "IOS", "WEBEMBEDDED", "MWEB"] // only ANDROID is working
            },
            cookies: process.env.USE_YT_COOKIES === 'true'
               ? JSON.parse(fs.readFileSync(`./cookies.json`))
               : null
         }),
         new YtDlpPlugin({ update: true }),
         new SpotifyPlugin(),
         new SoundCloudPlugin()
      ]
   });


   // if debugging
   if (process.env.DEBUG_FFMPEG === 'true') {
      client.DisTube.on("ffmpegDebug", (debug) => {
         console.log(`ffmpegDebug: ${debug}`.red);
      });
   }
   if (process.env.DEBUG_DISTUBE === 'true') {
      client.DisTube.on("error", (error, queue, song) => {
         console.error(`DisTube error: ${error}`)
      });
   }

   client.DisTube.on("playSong", (queue, song) => {
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

   client.DisTube.on("addSong", (queue, song) => {
      queue.textChannel.send({
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
};