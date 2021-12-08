import { CommandsHandler, ICommand, ICommandHandler, ICommandsHandler, IPayload } from "./DiscordCommandsParser";

import * as Discord from "discord.js";
import * as dotenv from "dotenv";

dotenv.config();

class gayWebsite implements ICommandHandler {
    execute(payload: IPayload) {
        console.log(payload);
    }
}

const list: Array<ICommand> = [
    {
        name: ["OwO"],
        out: new gayWebsite,
        multicase: true
    }
];

const handler: ICommandsHandler = new CommandsHandler(list, "|");

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });

client.on("messageCreate", handler.getEventHandler());

client.login(process.env.TOKEN);