import { Message } from 'discord.js';
import { ICommand, ICommandsHandler, IMiddleware, INext, IParserOptions, IPayload } from './types';

export class CommandsHandler implements ICommandsHandler {
	private commands: Array<ICommand> = [];
	private prefix: string;
	private middlewares: Array<IMiddleware>;

	constructor(options: IParserOptions) {
		this.commands = options.commandsList;
		this.prefix = options.prefix;
		this.middlewares = options.middlewares ? options.middlewares : [];
		this.middlewares.push(this.commandHandler);
	}

	private commandHandler(payload: IPayload): void {
		payload.commands.every(command => {
			return command.name.every(name => {
				if((command.multicase ? payload.args[0].toLowerCase() : payload.args[0]) === (command.multicase ? (payload.prefix+name).toLowerCase() : payload.prefix+name)) {
					command.out.execute(payload);
					return false;
				}
				return true;
			});
		});
	}

	private getNextMiddleware(middlewares: Array<IMiddleware>, counter: number): INext {
		return (payload: IPayload) => {
			middlewares[counter](payload, this.getNextMiddleware(middlewares, ++counter));
		}
	}

	public getEventHandler() {
		return (message: Message): void => {
			const content:string = message.content.trim();
			const args:Array<string> = content.split(" ");

			const payload: IPayload = {
				prefix: this.prefix,
				message: message,
				commands: this.commands,
				middlewares: this.middlewares,
				args: args
			}
			
			this.middlewares[0](payload, this.getNextMiddleware(this.middlewares, 1));
		};
	}
};