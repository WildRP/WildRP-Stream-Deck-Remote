import { action, KeyDownEvent, SingletonAction, WillAppearEvent, DidReceiveSettingsEvent, KeyUpEvent } from "@elgato/streamdeck";
import CommandServer from "../command-server";

type MultiCommandSettings = {
	command1: string;
	command2: string;
	command3: string;
	command4: string;
	command5: string;
};

@action({ UUID: "com.wildrp.wildrp-remote.multi-command" })
export class WildrpMultiCommand extends SingletonAction<MultiCommandSettings> {

	onKeyUp(ev: KeyUpEvent<MultiCommandSettings>): void | Promise<void> {
		let cmds: Array<string> = []
		let s = ev.payload.settings;

		if (s.command1.length > 1) cmds.push(s.command1);
		if (s.command2.length > 1) cmds.push(s.command2);
		if (s.command3.length > 1) cmds.push(s.command3);
		if (s.command4.length > 1) cmds.push(s.command4);
		if (s.command5.length > 1) cmds.push(s.command5);

		if (cmds.length > 0) {
			var cmd = cmds[Math.floor(Math.random()*cmds.length)];

			CommandServer.getInstance().sendCommand("COMMAND::"+cmd);
		}
	}
}