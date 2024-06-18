import { action, KeyDownEvent, SingletonAction, WillAppearEvent, DidReceiveSettingsEvent, KeyUpEvent } from "@elgato/streamdeck";
import CommandServer from "../command-server";

type ClothingToggleSettings = {
	category: string;
};

@action({ UUID: "com.wildrp.wildrp-remote.clothingtoggle" })
export class WildrpClothingToggle extends SingletonAction<ClothingToggleSettings> {

	onDidReceiveSettings(ev: DidReceiveSettingsEvent<ClothingToggleSettings>): void | Promise<void> {
		console.log("Received Settings:");
		console.log(ev.payload);
		ev.action.setTitle(`${ev.payload.settings.category ?? "Command"}`)
		.catch((error: unknown) => {
			console.error(error);
		  });
	}

	onKeyUp(ev: KeyUpEvent<ClothingToggleSettings>): void | Promise<void> {
		var cmd = ev.payload.settings.category;
		console.log("Toggling Clothing Category:" + cmd);
		CommandServer.getInstance().sendCommand("CLOTHING::"+cmd);
	}
}