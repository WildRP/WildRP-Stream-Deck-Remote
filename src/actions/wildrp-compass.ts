import { action, SingletonAction, WillAppearEvent, Action, WillDisappearEvent } from "@elgato/streamdeck";
import Mustache from "mustache";
import { CompassSvg } from "./compass-svg";

type CompassSettings = {
};

export interface IStreamDeckCompassData {
    compassRotation:number,
    showCompass:boolean,
}

@action({ UUID: "com.wildrp.wildrp-remote.compass" })
export class WildRPCompass extends SingletonAction<CompassSettings> {

	private readonly _actionsToUpdate = new Set<Action>();
	private _data: IStreamDeckCompassData;

	private static instance: WildRPCompass;
	public static getInstance(): WildRPCompass {
		return WildRPCompass.instance;
	}

	public setConnected(v:boolean) {
		if (v == false) {
			this._data = {
				compassRotation: 0,
				showCompass: false
			}
			this.updateData(this._data);
		}
	}

	constructor() {
		super();
		this._data = {
			showCompass: false,
			compassRotation: 0
		}
		WildRPCompass.instance = this;
	}

	public updateData(data: IStreamDeckCompassData) {
		this._data = data;
		this._actionsToUpdate.forEach(action => {
			this.updateActionIcon(action)
		});
	}

	private async updateActionIcon(action: Action) {
		let image = Mustache.render(CompassSvg, this._data);
		let b = Buffer.from(image);
		action.setImage("data:image/svg+xml;base64,"+b.toString("base64"));
	}

	onWillAppear(ev: WillAppearEvent<CompassSettings>): void | Promise<void> {
		this._actionsToUpdate.add(ev.action);
		this.updateActionIcon(ev.action);
	}


	onWillDisappear(ev: WillDisappearEvent<CompassSettings>): void | Promise<void> {
		this._actionsToUpdate.delete(ev.action);
	}
}