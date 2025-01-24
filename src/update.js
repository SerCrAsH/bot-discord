import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { glob } from 'glob';
import { pathToFileURL } from 'url';
config();

const commands = [];
// Grab all the command folders from the commands directory you created earlier

const pattern = `${process.cwd().replace(/\\/g, "/")}/src/slashCommands/**/*.js`;
const files = glob.sync(pattern).map((file) => file.replace(/\\/g, "/"));


for (const file of files) {
    const command = (await import(pathToFileURL(file).href)).default;
    const commandName = file.split("/").pop().split(".")[0];

    if ('CMD' in command && 'execute' in command) {
        command.CMD.name = commandName;
        commands.push(command.CMD.toJSON());
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.BOT_TOKEN);

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest
            .put(
                Routes.applicationCommands(process.env.BOT_CLIENT_ID),
                { body: commands },
            );

        console.log(`Successfully reloaded ${JSON.stringify(data)} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();