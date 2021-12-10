# Discordjs commands parser

Class for parsing discord messages. [Github](https://github.com/DEsimas/discordjs-commands-parser)

## Installation

`npm i discordjs-commands-parser`

# Usage

You should create instance of the CommandsHandler class. Method `getEventHandler()` will return function for handling messages.

```  javascript
import { CommandsHandler } from "discordjs-commands-parser";

const handler = new CommandsHandler(options);

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
client.on("messageCreate", handler.getEventHandler());
```
## Options

Options is an object that have to have fields `commandsList` and `prefix`. Also you can add array of middlewares.

``` javascript
const options: IParserOptions = {
    commandsList: [
        {
            name: ["help"],
            out: new Help(),
            multicase: true //optional
        },
        {
            name: ["banuser", "BanUser"],
            out: new BanUser()
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
    out: new Help(),
    multicase: true //optional
}
```

## Command.out

Command.out is class that have to have method `execute` that takes payload.

```javascript
class Help {
    execute(payload) {
        payload.commandsList.forEach((el) => {
            console.log(el.name[0]);
        });

        payload.message.channel.send("Done!");
    }
};
```

## Middlewares

Middleware is a function that will be called before handling message. Here you can modify payload (it can be used for changing bot prefix or logging)

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
        payload.commandsList.forEach((el) => {
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
        out: new Help(),
        multicase: true
    },
    {
        name: ["sayhi", "SayHi"],
        out: new SayHi()
    }
];

const options = {
    commandsList: list,
    prefix: "|",
}

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
const handler = new CommandsHandler(options);
client.on("messageCreate", handler.getEventHandler());
client.login(proces.env.TOKEN);
```