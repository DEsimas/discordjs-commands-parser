# Discordjs commands parser

Class for parsing discord messages. [Github](https://github.com/DEsimas/discordjs-commands-parser)

## Installation

`npm i discordjs-commands-parser`

# Usage

You should create instance of the CommandsHandler class. Method `getEventHandler()` will return function for handling messages.

```  javascript
import { CommandsHandler } from "discordjs-commands-parser";

const handler = new CommandsHandler(options); //creating instance of the CommandsHandler class

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
client.on("messageCreate", handler.getEventHandler()); //passing handling function
```
## Options

Options is an object that have to have fields `commandsList` and `prefix`. Also you can add array of middlewares.

``` javascript
const options: IParserOptions = {
    commandsList: [
        {
            name: ["help"],
            out: Help,
            multicase: true //optional
        },
        {
            name: ["banuser", "BanUser"],
            out: BanUser
        }
    ],
    prefix: "|",
    middlewares: [addUserInDB, logger] //optional
}
```

## Commands list

Commands list is an array with objects that describe each command. You can have as many fields as you want (your command class will have access to them), but `name` and `out` are required. 
```javascript
const command = {
    name: ["help", "h"],
    out: Help,
    multicase: true //optional (allows commands like "Help, "hELP", ect.)
    description: "Sends help message" //optional (can be used from middlewares or command handlers)
}
```

## Command.out

Command.out is class that have to accept `payload in it's constructor` and have method `execute`.

```javascript
class Help {
    constructor(payload) {
        this.payload = payload;
    }

    execute() {
        console.log(this.payload);
        this.payload.commands.forEach((el) => {
            console.log(el.name[0]);
        });

        this.payload.message.channel.send("Done!");
    }
};
```

## Middlewares

Middleware is a function that will be called before handling message. Here you can modify payload or stop handling this message.

```javascript
function logger(payload, next) {
    console.log((new Date()).toString() + ":" + payload.message.content);
    next(payload); //if not called message handling will be stopped
}
```

# Summary

``` javascript
import Discord from "discord.js";
import { CommandsHandler } from "discordjs-commands-parser";

class Help {
    execute(payload) {
        payload.commands.forEach((el) => {
            console.log(el.name[0]);
        });

        payload.message.channel.send("Done!");
    }
};

class SayHi {
    execute(payload) {
        payload.message.channel.send("Hi!");
    }
};

const list = [
    {
        name: ["help"],
        out: Help,
        multicase: true
    },
    {
        name: ["sayhi", "SayHi"],
        out: SayHi
    }
];

const options = {
    commandsList: list,
    prefix: "|"
}

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
const handler = new CommandsHandler(options);
client.on("messageCreate", handler.getEventHandler());
client.login(proces.env.TOKEN);
```