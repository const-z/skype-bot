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
	appPassword: config.bot.appPassword,
	serviceUrl: "https://smba.trafficmanager.net"
});

const bot = new builder.UniversalBot(connector, [
	session => {
		session.beginDialog("rootMenu");
	}
]);

server.post('/api/messages', connector.listen());

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
	// const fs = require("fs");
	// let data = fs.readFileSync("/home/ubuntu/test.pdf");
	// data = new Buffer(data).toString("base64");
	var msg = new builder.Message(session)
		.addAttachment({
			contentUrl: "https://www.cryptopro.ru/sites/default/files/products/pdf/files/CryptoProPDF_UserGuide.pdf",
			// content: data,
			contentType: "application/pdf",
			name: "test.pdf"
		});
	session.send(msg);
	session.endDialog();
	// var contentType = "application/pdf";
	// var attachment = new Attachment(contentType, "https://localhost/api/documents.download");
	// var response = await client.GetAsync("https://localhost/api/documents.download");
}).triggerAction({ matches: /file/i });