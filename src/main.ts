import { hello } from "./hello";

import * as Discord from "discord.js";
import * as dotenv from "dotenv";

dotenv.config();

console.log(hello(process.env.TOKEN ? process.env.TOKEN : "undefined"));

/*try {
    dotenv.config();
    const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
    
    client.login(process.env.TOKEN);
} catch(err) {
    console.log(err);
}*/