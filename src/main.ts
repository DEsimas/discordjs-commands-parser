import * as Discord from "discord.js";
import * as dotenv from "dotenv";

import { CommandsHandler } from "./DiscordCommadsParser/CommandsParser";
import { ICommand, ICommandHandler, ICommandsHandler, IMiddleware, INext, IParserOptions, IPayload } from "./DiscordCommadsParser/types";

dotenv.config();

class OwO implements ICommandHandler {
    execute(payload: IPayload) {
        console.log("OwO");
    }
}

class UwU implements ICommandHandler {
    execute(payload: IPayload) {
        console.log(payload.message.content);
    }
}

const list: Array<ICommand> = [
    {
        name: ["OwO"],
        out: new OwO(),
        multicase: true
    },
    {
        name: ["UwU"],
        out: new UwU()
    }
];

function logger(payload: IPayload, next: INext): void {
    console.log((new Date()).toString() + ":" + payload.message.content);
    next(payload);
}

function changePrefix(payload: IPayload, next: INext): void {
    payload.prefix = "$";
    next(payload);
}

const options: IParserOptions = {
    commandsList: list,
    prefix: "|",
    middlewares: [changePrefix, logger]
}

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
const handler: ICommandsHandler = new CommandsHandler(options);
client.on("messageCreate", handler.getEventHandler());
client.login(process.env.TOKEN);