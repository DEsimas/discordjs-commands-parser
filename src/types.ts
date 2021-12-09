import { Message } from 'discord.js';

export interface ICommandHandler {
	execute(payload: IPayload): void;
};

export interface IPayload {
	message: Message;
	commands: Array<ICommand>;
    prefix: string;
    args: Array<string>;
    middlewares: Array<IMiddleware>; 
	[key: string]: any;
}

export interface ICommand {
	name: Array<string>;
	out: ICommandHandler;
	multicase?: boolean;
	[key: string]: any;
};

export interface ICommandsHandler {
	getEventHandler: () => (message: Message) => void;
}

export interface IMiddleware {
    (payload: IPayload, next: INext): void;
}

export interface INext {
    (payload: IPayload): void;
}

export interface IParserOptions {
    commandsList: Array<ICommand>;
    prefix: string;
    middlewares?: Array<IMiddleware>;
    [key: string]: any;
}