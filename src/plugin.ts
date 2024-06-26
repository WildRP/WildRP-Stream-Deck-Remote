import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { WildrpCommand } from "./actions/wildrp-command";
import CommandServer from "./command-server";
import { WildrpMultiCommand } from "./actions/wildrp-multi-command";
import { WildRPPlayerStats } from "./actions/wildrp-player-stats";
import { WildRPCompass } from "./actions/wildrp-compass";

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded.
streamDeck.logger.setLevel(LogLevel.INFO);

CommandServer.start();


// Register actions
streamDeck.actions.registerAction(new WildrpCommand());
streamDeck.actions.registerAction(new WildrpMultiCommand());
streamDeck.actions.registerAction(new WildRPPlayerStats());
streamDeck.actions.registerAction(new WildRPCompass());

// Finally, connect to the Stream Deck.
streamDeck.connect();