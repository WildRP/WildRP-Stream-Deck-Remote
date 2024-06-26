import streamDeck, { LogLevel } from "@elgato/streamdeck";
import WebSocket, { WebSocketServer } from 'ws';
import { IStreamDeckData } from "./actions/player-stat-enums.js";
import { WildRPPlayerStats } from "./actions/wildrp-player-stats";
import { IStreamDeckCompassData, WildRPCompass } from "./actions/wildrp-compass.js";

// Sends commands to connected clients on the local machine
export default class CommandServer {
	private static instance: CommandServer | null = null;
	private wss: WebSocketServer;
	private readonly port = 41582;
	private connected: boolean = false;
	
	private playerStatsAction: WildRPPlayerStats | null = null;

	public isConnected(): boolean {
		return this.connected;
	}

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
		this.connected = true;
		streamDeck.logger.info("WildRP Client connected");
		ws.on('error', console.error);

		ws.on('message', (data) => {
			if (data.toString() == "ping")
				ws.send("PONG::Heartbeat");

			else if (data.toString().startsWith("PLAYERSTATS")) {
				let stats: IStreamDeckData = JSON.parse(data.toString().split("::")[1]);
				WildRPPlayerStats.getInstance().setConnected(true);
				WildRPPlayerStats.getInstance().updateStats(stats);
			}
			else if (data.toString().startsWith("COMPASS")) {
				let compass: IStreamDeckCompassData = JSON.parse(data.toString().split("::")[1]);
				WildRPCompass.getInstance().updateData(compass);
			}
		});

		ws.on('close', (stream) => {
			console.log("WildRP Client disconnected!");
			this.connected = false;
			WildRPPlayerStats.getInstance().setConnected(false);
			WildRPCompass.getInstance().setConnected(false);
		});
	}

	public sendCommand(cmd: string) {
		this.wss.clients.forEach(
			function each(client) {
				client.send(cmd);
			}
		);
	}

}