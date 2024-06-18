import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { WildrpCommand } from "./actions/wildrp-command";
import CommandServer from "./command-server";

console.log("Let's boot it!");

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded.
streamDeck.logger.setLevel(LogLevel.TRACE);

// Register actions
streamDeck.actions.registerAction(new WildrpCommand());

// Finally, connect to the Stream Deck.
streamDeck.connect();

CommandServer.start();