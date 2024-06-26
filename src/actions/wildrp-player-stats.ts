import { action, KeyDownEvent, SingletonAction, WillAppearEvent, DidReceiveSettingsEvent, KeyUpEvent, Action, WillDisappearEvent } from "@elgato/streamdeck";
import CommandServer from "../command-server";
import { IPlayerStats, PlayerStatSvg, PlayerStats } from "./player-stat-enums";
import Mustache from "mustache";

type PlayerStatsSettings = {
	statType: string;
};

@action({ UUID: "com.wildrp.wildrp-remote.player-stats" })
export class WildRPPlayerStats extends SingletonAction<PlayerStatsSettings> {

	private readonly _actionsToUpdate = new Set<Action>();
	private _stats: IPlayerStats;

	private static instance: WildRPPlayerStats;
	public static getInstance(): WildRPPlayerStats {
		return WildRPPlayerStats.instance;
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
			playerIsInPvp: true
		}
		WildRPPlayerStats.instance = this;
	}

	public updateStats(stats: IPlayerStats) {
		this._stats = stats;
		console.log("Time to update stats!");
		this._actionsToUpdate.forEach(action => {
			this.updateActionIcon(action)
		});
	}

	private async updateActionIcon(action: Action, eventSettings: PlayerStatsSettings | null = null) {
		let settings = eventSettings;
		if (settings == null)
			settings = await action.getSettings<PlayerStatsSettings>();

		console.log("Updating action icon with stat type " + settings.statType);

		let view: { [key: string]: any } = {};
		const enabledColor = "white";
		const disabledColor = "#333";
		const lowColor = "#740000";
		let pct = 100;
		let alive = this._stats.playerAlive;
		let horseAlive = this._stats.horseAlive;

		switch (settings.statType) {
			default:
			case PlayerStats.playerHealth:
				view.health = true;
				pct = alive ? this._stats.playerHealth : 0;
				view.color = alive ? enabledColor : disabledColor;
				if (pct < 20 && alive) view.color = lowColor;
				break;
			case PlayerStats.playerStamina:
				view.stamina = true;
				pct = alive ? this._stats.playerStamina : 0;
				view.color = alive ? enabledColor : disabledColor;
				if (pct < 20 && alive) view.color = lowColor;
				break;
			case PlayerStats.playerHunger:
				view.hunger = true;
				pct = alive ? this._stats.playerHunger : 0;
				view.color = alive ? enabledColor : disabledColor;
				if (pct < 20 && alive) view.color = lowColor;
				break;
			case PlayerStats.playerThirst:
				view.thirst = true;
				pct = alive ? this._stats.playerThirst : 0;
				view.color = alive ? enabledColor : disabledColor;
				if (pct < 20 && alive) view.color = lowColor;
				break;
			case PlayerStats.horseHealth:
				view.horseHealth = true
				pct = this._stats.horseHealth;
				view.color = alive ? enabledColor : disabledColor;
				if (pct < 20 && horseAlive) view.color = lowColor;
				break;
			case PlayerStats.horseStamina:
				view.horseStamina = true;
				pct = this._stats.horseStamina;
				view.color = alive ? enabledColor : disabledColor;
				if (pct < 20 && horseAlive) view.color = lowColor;
				break;
			case PlayerStats.showTelegramNotification:
				view.telegram = true;
				pct = this._stats.showTelegramNotification ? 100 : 0;
				view.color = this._stats.showTelegramNotification ? enabledColor : disabledColor;
				break;
		}

		view.percent =(1-(pct/100)) * 722.2;

		let image = Mustache.render(PlayerStatSvg, view);
		console.log(image);
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