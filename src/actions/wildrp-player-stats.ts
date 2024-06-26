import { action, KeyDownEvent, SingletonAction, WillAppearEvent, DidReceiveSettingsEvent, KeyUpEvent, Action, WillDisappearEvent } from "@elgato/streamdeck";
import { IStreamDeckData, PlayerStatSvg, StreamDeckStats } from "./player-stat-enums";
import Mustache from "mustache";

type PlayerStatsSettings = {
	statType: string;
};

@action({ UUID: "com.wildrp.wildrp-remote.player-stats" })
export class WildRPPlayerStats extends SingletonAction<PlayerStatsSettings> {

	private readonly _actionsToUpdate = new Set<Action>();
	private _stats: IStreamDeckData;

	private static instance: WildRPPlayerStats;
	public static getInstance(): WildRPPlayerStats {
		return WildRPPlayerStats.instance;
	}


	private _connected: boolean = false;
	public setConnected(v:boolean) {
		this._connected = v;
	}

	constructor() {
		super();
		this._stats = {
			playerStamina: 0,
			playerHealth: 0,
			playerHunger: 0,
			playerThirst: 0,
			playerAlive: false,
			playerResSicknessPercent: 0,
			playerTonicPercent: 0,
			horseStamina: 0,
			horseHealth: 0,
			horseAlive: false,
			showTelegramNotification: false,
			playerIsInPvp: true,
			isTalking: true,
			voiceRangeIndex: 1,
		}
		WildRPPlayerStats.instance = this;
	}

	public updateStats(stats: IStreamDeckData) {
		this._stats = stats;
		this._actionsToUpdate.forEach(action => {
			this.updateActionIcon(action)
		});
	}

	private async updateActionIcon(action: Action, eventSettings: PlayerStatsSettings | null = null) {
		let settings = eventSettings;
		if (settings == null)
			settings = await action.getSettings<PlayerStatsSettings>();

		let view: { [key: string]: any } = {};
		view.strokeColor = "white";

		const enabledColor = "white";
		const disabledColor = "#333";
		const lowColor = "#CC0000";
		let pct = 100;
		let alive = this._stats.playerAlive && this._connected;
		let horseAlive = this._stats.horseAlive && this._connected;

		switch (settings.statType) {
			default:
			case StreamDeckStats.playerHealth:
				view.health = true;
				pct = alive ? this._stats.playerHealth : 0;
				view.color = alive ? enabledColor : disabledColor;
				if (pct < 20 && alive) view.color = lowColor;
				break;
			case StreamDeckStats.playerStamina:
				view.stamina = true;
				pct = alive ? this._stats.playerStamina : 0;
				view.color = alive ? enabledColor : disabledColor;
				if (pct < 20 && alive) view.color = lowColor;
				break;
			case StreamDeckStats.playerHunger:
				view.hunger = true;
				pct = alive ? this._stats.playerHunger : 0;
				view.color = alive ? enabledColor : disabledColor;
				if (pct < 20 && alive) view.color = lowColor;
				break;
			case StreamDeckStats.playerThirst:
				view.thirst = true;
				pct = alive ? this._stats.playerThirst : 0;
				view.color = alive ? enabledColor : disabledColor;
				if (pct < 20 && alive) view.color = lowColor;
				break;
			case StreamDeckStats.horseHealth:
				view.horseHealth = true
				pct = this._stats.horseHealth;
				view.color = alive ? enabledColor : disabledColor;
				if (pct < 20 && horseAlive) view.color = lowColor;
				break;
			case StreamDeckStats.horseStamina:
				view.horseStamina = true;
				pct = this._stats.horseStamina;
				view.color = alive ? enabledColor : disabledColor;
				if (pct < 20 && horseAlive) view.color = lowColor;
				break;
			case StreamDeckStats.showTelegramNotification:
				view.telegram = true;
				pct = this._stats.showTelegramNotification ? 100 : 0;
				view.color = this._stats.showTelegramNotification ? enabledColor : disabledColor;
				break;
			case StreamDeckStats.micRangeIndicator:
				view.micRangeIndicator = true;
				if (this._stats.voiceRangeIndex >= 3) view.strokeColor = lowColor;
				pct = this._connected ? 25 + this._stats.voiceRangeIndex * 25 : 0;
				view.color = this._stats.isTalking ? lowColor : (this._connected ? enabledColor : disabledColor);
				break;
		}

		view.percent =(1-(pct/100)) * 722.2;

		let image = Mustache.render(PlayerStatSvg, view);
		let b = Buffer.from(image);

		action.setImage("data:image/svg+xml;base64,"+b.toString("base64"));
	}

	onWillAppear(ev: WillAppearEvent<PlayerStatsSettings>): void | Promise<void> {
		this._actionsToUpdate.add(ev.action);
		this.updateActionIcon(ev.action);
	}


	onWillDisappear(ev: WillDisappearEvent<PlayerStatsSettings>): void | Promise<void> {
		this._actionsToUpdate.delete(ev.action);
	}

	onDidReceiveSettings(ev: DidReceiveSettingsEvent<PlayerStatsSettings>): void | Promise<void> {
		this.updateActionIcon(ev.action, ev.payload.settings);
	}
}