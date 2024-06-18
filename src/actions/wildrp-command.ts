import { action, KeyDownEvent, SingletonAction, WillAppearEvent, DidReceiveSettingsEvent, KeyUpEvent } from "@elgato/streamdeck";
import CommandServer from "../command-server";

type CommandSettings = {
	command: string;
};

@action({ UUID: "com.wildrp.wildrp-remote.send-command" })
export class WildrpCommand extends SingletonAction<CommandSettings> {

	onWillAppear(ev: WillAppearEvent<CommandSettings>): void | Promise<void> {
		return ev.action.setTitle(`${ev.payload.settings.command ?? "Command"}`);
	}

	onDidReceiveSettings(ev: DidReceiveSettingsEvent<CommandSettings>): void | Promise<void> {
		console.log("Received Settings:");
		console.log(ev.payload);
		ev.action.setTitle(`${ev.payload.settings.command ?? "Command"}`)
		.catch((error: unknown) => {
			console.error(error);
		  });
	}

	onKeyUp(ev: KeyUpEvent<CommandSettings>): void | Promise<void> {
		var cmd = ev.payload.settings.command;
		console.log("Pressed key with command: " + cmd);
		CommandServer.getInstance().sendCommand("COMMAND::"+cmd);
	}
}