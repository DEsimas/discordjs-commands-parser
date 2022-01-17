# Discordjs commands parser

Class for parsing discord messages. [Github](https://github.com/DEsimas/discordjs-commands-parser)

## Installation

`npm i discordjs-commands-parser`

# Usage

You should create instance of the CommandsParser class. Method `getEventHandler()` will return function for handling messages.

```  javascript
import * as Discord from "discord.js";                      // const Discord = require("discord.js");
import { CommandsParser } from "discordjs-commands-parser"; // const Discord = require("discordjs-commands-parser");

const options = {...}; // commands parser options

const handler = new CommandsParser(options); //creating instance of the CommandsHandler class

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
client.on("messageCreate", handler.getEventHandler()); //passing handling function
```
## Options

Options is an object that have to have this fields:

`commandsList` - Array of bot commands

`prefix` - Bot prefix

`client` - Bot client

`middlewares` - Array of middlewares (optional)

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
    client: client,
    prefix: "|",
    middlewares: [saveUser, logger] //optional
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
const middlewares = [saveUser, logger];

async function saveUser(payload, next) {
    const user = await DAO.save(payload.message.author.id);
    if(user.error) return; // stops handling this message
}

function logger(payload, next) {
    console.log((new Date()).toString() + ":" + payload.message.content);
    next(payload); //if not called message handling will be stopped
}
```

# Summary

## Javascript

``` javascript
import Discord from "discord.js";                             // const Discord = require("discord.js");
import { CommandsParser } from "discordjs-commands-parser";   // const Discord = require("discordjs-commands-parser");

class Help {
    constructor(payload) {
        this.payload = payload;
    }

    execute() {
        this.payload.commands.forEach((el) => {
            console.log(el.name[0]);
        });

        this.payload.message.channel.send("Done!");
    }
};

class SayHi {
    constructor(payload) {
        this.message = message;
    }

    execute() {
        this.message.channel.send("Hi!");
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

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });

const options = {
    client: client,
    commandsList: list,
    prefix: "|"
}

const handler = new CommandsParser(options);
client.on("messageCreate", handler.getEventHandler());
client.login(proces.env.TOKEN);
```

## Typescript

``` typescript
import * as Discord from "discord.js";
import { CommandsParser } from "discordjs-commands-parser";
import { Command, CommandHandler, Middleware, ParserOptions, Payload } from "discordjs-commands-parser/dist/types";

class Help implements CommandHandler {
    constructor(private readonly payload: Payload) {}

    public async execute(): Promise<void> {
        this.payload.commands.forEach((el) => {
            console.log(el.name[0]);
        });

        await this.payload.message.channel.send("Done!");
    }
};

class SayHi implements CommandHandler {
    private readonly message: Discord.Message;

    constructor(payload: Payload) {
        this.message = payload.message;
    }
    
    public async execute(): Promise<void> {
        await this.message.channel.send("Hi!");
    }
};

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });

const list: Array<Command> = [
    {
        name: ["Help"],
        out: Help,
        multicase: true
    },
    {
        name: ["sayhi", "SayHi"],
        out: SayHi
    }
];

const middlewares: Array<Middleware> = [
    (payload, next) => {
        payload.prefix = "$";
        next(payload);
    },
    (payload, next) => {
        console.log(`${payload.message.author.username} sent a message`);
        next(payload);
    }
];

const options: ParserOptions = {
    client: client,
    commandsList: list,
    prefix: "|",
    middlewares: middlewares
};

const handler = new CommandsParser(options);
client.on("messageCreate", handler.getEventHandler());
client.login(proces.env.TOKEN);
```