"use strict";

const restify = require("restify");
const builder = require("botbuilder");
const config = require("./config");

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
const server = restify.createServer();
server.listen(config.server.port, "localhost", () => {
	console.log("%s listening to %s", server.name, server.url);
});

// Create chat bot
const connector = new builder.ChatConnector({
	appId: config.bot.appId,
	appPassword: config.bot.appPassword
});

const bot = new builder.UniversalBot(connector, [
	session => {
		session.beginDialog("rootMenu");
	}
]);

server.post('/api/messages', connector.listen());

//=========================================================

bot.on("receive", (message) => {
	// console.log("receive", message);
});

bot.on("conversationUpdate", (message) => {
	// console.log("conversationUpdate", message);
});

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog("rootMenu", [
	session => {
		builder.Prompts.choice(session, "", ["get file"], { listStyle: builder.ListStyle.button });
	},
	(session, results) => {
		switch (results.response.index) {
			case 0:
				session.beginDialog("file");
				break;
			default:
				session.endDialog();
				break;
		}
	},
	session => {
		session.replaceDialog("rootMenu");
	}
]).reloadAction("showMenu", null, { matches: /^(menu|back)/i });

bot.dialog("file", session => {
	session.sendTyping();
	var msg = new builder.Message(session)
		.addAttachment({
			contentUrl: "https://www.cryptopro.ru/sites/default/files/products/pdf/files/CryptoProPDF_UserGuide.pdf",
			contentType: "application/pdf",
			name: "test.pdf"
		});
	session.send(msg);
	session.endDialog();
}).triggerAction({ matches: /file/i });

let addresses = {};

bot.dialog("subscription", session => {
	addresses[session.message.address.channelId + "-" + session.message.address.user.id] = {
		bot: session.message.address.bot,
		channelId: session.message.address.channelId,
		user: session.message.address.user,
		serviceUrl: session.message.address.serviceUrl,
		useAuth: true
	};
	session.send("added to subscriptions");
}).triggerAction({ matches: /subs/i });

bot.dialog("ping", session => {
	session.send(new Date().toISOString());
	session.endDialog();
}).triggerAction({ matches: /ping/i });

setInterval(() => {
	Object.keys(addresses).map(key => {
		bot.beginDialog(addresses[key], "ping");
	});
}, 5000);