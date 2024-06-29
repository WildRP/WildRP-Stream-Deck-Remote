import { action, KeyDownEvent, SingletonAction, WillAppearEvent, DidReceiveSettingsEvent, KeyUpEvent, Action, WillDisappearEvent } from "@elgato/streamdeck";
import { IStreamDeckData, PlayerStatSvg, StreamDeckStats, CombinedStatSvg } from "./player-stat-enums";
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
			playerIsInPvp: false,
			isTalking: true,
			voiceRangeIndex: 1,
			showInjuredPersonNotification: false,
			showLawNotification: false,
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
		let combinedStats = settings.statType == StreamDeckStats.combinedStats;

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
				if (this._stats.showLawNotification)
					view.lawIndicator = true;
				else if (this._stats.showInjuredPersonNotification)
					view.injuredIndicator = true;
				else
					view.telegram = true;

				pct = this._stats.showTelegramNotification || this._stats.showInjuredPersonNotification || this._stats.showLawNotification ? 100 : 0;
				view.color = this._stats.showTelegramNotification ? enabledColor : disabledColor;
				view.color = this._stats.showInjuredPersonNotification || this._stats.showLawNotification ? "#F4CD69" : view.color;
				break;
			case StreamDeckStats.playerIsInPvp:
				view.pvpIndicator = true;
				pct = this._stats.playerIsInPvp ? 100 : 0;
				view.color = this._stats.playerIsInPvp ? enabledColor : disabledColor;
				break;
			case StreamDeckStats.micRangeIndicator:
				view.micRangeIndicator = true;
				if (this._stats.voiceRangeIndex >= 3) view.strokeColor = lowColor;
				pct = this._connected ? 25 + this._stats.voiceRangeIndex * 25 : 0;
				view.color = this._stats.isTalking ? lowColor : (this._connected ? enabledColor : disabledColor);
				break;
			case StreamDeckStats.playerTonicPercent:
				view.tonic = true;
				pct = this._stats.playerTonicPercent;
				view.color = pct == 0 ? disabledColor : enabledColor;
				break;
			case StreamDeckStats.playerResSicknessPercent:
				view.resSickness = true;
				pct = this._stats.playerResSicknessPercent;
				if (pct == 100) pct = 0;
				view.color = pct == 0 ? disabledColor : enabledColor;
				break;
			case StreamDeckStats.combinedStats:
				if (alive) {
					view.color_hunger = this._stats.playerHunger < 20 ? lowColor : enabledColor;
					view.color_thirst = this._stats.playerThirst < 20 ? lowColor : enabledColor;
				}
				else
				{
					view.color_hunger = disabledColor;
					view.color_thirst = disabledColor;
				}

				view.percent_hunger = this.calculateSvgPercent(this._stats.playerHunger);
				view.percent_thirst = this.calculateSvgPercent(this._stats.playerThirst);
				view.percent_tonic = this.calculateSvgPercent(this._stats.playerTonicPercent);
				view.percent_res = this.calculateSvgPercent(this._stats.playerResSicknessPercent);
				if (this._stats.playerResSicknessPercent == 100) view.percent_res = this.calculateSvgPercent(0);

				view.color_tonic = this._stats.playerTonicPercent == 0 ? disabledColor : enabledColor;
				view.color_res = this._stats.playerResSicknessPercent == 0 || this._stats.playerResSicknessPercent == 100 ? disabledColor : enabledColor;
				break;
		}

		view.percent = this.calculateSvgPercent(pct);

		let image = Mustache.render(combinedStats ? CombinedStatSvg : PlayerStatSvg, view);
		let b = Buffer.from(image);

		action.setImage("data:image/svg+xml;base64,"+b.toString("base64"));
	}

	calculateSvgPercent(value:number) {
		return (1-(value/100)) * 722.2;
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