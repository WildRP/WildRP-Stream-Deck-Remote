import streamDeck, { LogLevel } from "@elgato/streamdeck";
import WebSocket, { WebSocketServer } from 'ws';

// Sends commands to connected clients on the local machine
export default class CommandServer {
	private static instance: CommandServer | null = null;
	private wss: WebSocketServer;
	
	private readonly port = 41582;

	public static start(): void {
		this.getInstance();
	}

	public static getInstance(): CommandServer {
		if (CommandServer.instance == null) {
			CommandServer.instance = new CommandServer();
		}
		return CommandServer.instance;
	}

	public constructor() {
		this.wss = new WebSocketServer({port: this.port, path: "/streamdeck"});
		this.wss.on('connection', this.onConnection);
		console.log("Started WebSocket server on port "+ this.port);
	}

	private onConnection(ws: WebSocket) {
		console.log("WildRP Client connected");
		streamDeck.logger.info("WildRP Client connected");
		ws.on('error', console.error);
		ws.on('message', (data) => {
			console.log('Received: %s', data);
			streamDeck.logger.info('Received: '+ data);
			if (data.toString() == "ping") ws.send("PONG::Heartbeat");
		});
		ws.on('close', (stream) => console.log("WildRP Client disconnected!"));
	}

	public sendCommand(cmd: string) {
		this.wss.clients.forEach(
			function each(client) {
				client.send(cmd);
			}
		);
	}

}