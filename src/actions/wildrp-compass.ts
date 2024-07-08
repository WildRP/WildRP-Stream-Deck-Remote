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

	private renderInterval: NodeJS.Timeout;

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
		this.renderInterval = setInterval( () => {
			this.updateIconImages();
		}, 1000/30);
	}

	public static lerpDegrees(start: number, end: number, amount: number)
    {
        let difference = start - end;
		if (difference < 0) difference *= -1;

        if (difference > 180)
        {
            // We need to add on to one of the values.
            if (end > start)
            {
                // We'll add it on to start...
                start += 360;
            }
            else
            {
                // Add it on to end.
                end += 360;
            }
        }

        // Interpolate it.
        let value = (start + ((end - start) * amount));

        // Wrap it..
        const rangeZero = 360;

        if (value >= 0 && value <= 360)
            return value;

        return (value % rangeZero);
    }

	public updateData(data: IStreamDeckCompassData) {
		this._data = data;
	}

	private imageBuffer:Buffer | null = null;
	private smoothedCompassRotation = 0;

	private async updateIconImages() {
		this.smoothedCompassRotation = WildRPCompass.lerpDegrees(this.smoothedCompassRotation, this._data.compassRotation, 0.25);

		let view: { [key: string]: any } = {};
		view.compassRotation = this.smoothedCompassRotation;

		let image = Mustache.render(CompassSvg, view);
		this.imageBuffer = Buffer.from(image);
		this._actionsToUpdate.forEach(action => {
			this.updateActionIcon(action)
		});
	}

	private async updateActionIcon(action: Action) {
		action.setImage("data:image/svg+xml;base64,"+this.imageBuffer?.toString("base64"));
	}

	onWillAppear(ev: WillAppearEvent<CompassSettings>): void | Promise<void> {
		this._actionsToUpdate.add(ev.action);
		this.updateActionIcon(ev.action);
	}


	onWillDisappear(ev: WillDisappearEvent<CompassSettings>): void | Promise<void> {
		this._actionsToUpdate.delete(ev.action);
	}
}