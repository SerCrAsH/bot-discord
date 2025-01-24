import { Client, ActivityType, GatewayIntentBits, Partials, PresenceUpdateStatus, Collection, Colors } from "discord.js";
import { pathToFileURL } from 'url';
import BotUtils from "./utils.js";

export default class extends Client {
    constructor(options = {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessageReactions,
        ],
        partials: [Partials.User, Partials.Message, Partials.GuildMember, Partials.Channel, Partials.Reaction],
        allowedMentions: {
            parse: ["users", "roles"],
            repliedUser: false
        },
        presence: {
            status: PresenceUpdateStatus.Online,
            activities: [{
                name: process.env.STATUS,
                type: ActivityType[process.env.STATUS_TYPE]
            }],
            color: process.env.COLOR
        },
    }) {
        super({ ...options });
        this.commands = new Collection();
        this.slashCommands = new Collection();
        this.slashArray = [];

        this.utils = new BotUtils(this);

        this.start();
    }

    async start() {
        await this.loadHandlers();
        await this.loadEvents();
        await this.loadCommands();
        await this.loadSlashCommands();

        this.login(process.env.BOT_TOKEN);
    }

    async loadCommands() {
        //console.log(`${process.env.PREFIX} Loading commands...`);
        this.commands.clear();
        const files = await this.utils.loadFiles('commands');

        for (const file of files) {
            try {
                const command = (await import(pathToFileURL(file).href)).default;
                const commandName = file.split("/").pop().split(".")[0];
                command.name = commandName;

                if (commandName) {
                    this.commands.set(commandName, command);
                }
            } catch (e) {
                console.error(`Error loading file ${file}: `, e);
            }
        };
        console.log(`(${process.env.PREFIX}) ${this.commands.size} commands loaded!`.yellow);
    }

    async loadSlashCommands() {
        //console.log(`(/) Loading slash commands...`);
        await this.slashCommands.clear();
        this.slashArray = [];
        const files = await this.utils.loadFiles('slashCommands');

        for (const file of files) {
            try {
                const command = (await import(pathToFileURL(file).href)).default;
                const commandName = file.split("/").pop().split(".")[0];
                command.CMD.name = commandName;

                if (commandName) {
                    this.slashCommands.set(commandName, command);
                }

                this.slashArray.push(command.CMD.toJSON());
            } catch (e) {
                console.error(`Error loading file ${file}: `, e);
            }
        }

        console.log(`(/) ${this.slashCommands.size} slashCommands loaded!`.yellow);

        if (this?.application?.commands) {
            await this.application.commands.set(this.slashArray);
            console.log(`(/) ${this.slashCommands.size} slashCommands loaded!`.yellow);
        }
    }

    async loadHandlers() {
        //console.log(`(-) Loading handlers...`);
        const files = await this.utils.loadFiles('handlers');

        for (const file of files) {
            try {
                (await import(pathToFileURL(file).href)).default(this);
            } catch (e) {
                console.error(`Error loading file ${file}: `, e);
            }
        }

        console.log(`(-) ${files.length} handlers loaded!`.yellow);
    }


    async loadEvents() {
        //console.log(`(+) Loading events...`);
        this.removeAllListeners();
        const files = await this.utils.loadFiles('events');

        for (const file of files) {
            try {
                const command = (await import(pathToFileURL(file).href)).default;
                const eventName = file.split("/").pop().split(".")[0];
                this.on(eventName, command.bind(null, this));
            } catch (e) {
                console.error(`Error loading file ${file}: `, e);
            }
        }

        console.log(`(+) ${files.length} events loaded!`);
    }
}
