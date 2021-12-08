import { Message } from 'discord.js';

export interface ICommandHandler {
	execute(payload: IPayload): void;
};

export interface IPayload {
	message: Message;
	commands: Array<ICommand>;
	[key: string]: any;
}

export interface ICommand {
	name: Array<string>;
	out: ICommandHandler;
	multicase: boolean;
	[key: string]: any;
};

export interface ICommandsHandler {
	getEventHandler: () => (message: Message) => void;
}

export class CommandsHandler implements ICommandsHandler {
	private commands: Array<ICommand> = [];
	private prefix: string;

	constructor(commands: Array<ICommand>, prefix: string) {
		this.commands = commands;
		this.prefix = prefix;
	}

	public getEventHandler() {
		return (message: Message): void => {
			const content:string = message.content.trim();
			const args:Array<string> = content.split(" ");

			this.commands.every(command => {
				return command.name.every(name => {
					if((command.multicase ? args[0].toLowerCase() : args[0]) === (command.multicase ? (this.prefix+name).toLowerCase() : this.prefix+name)) {
						command.out.execute({ message: message, commands: this.commands });
						return false;
					}
					return true;
				});
			});
		};
	}
};