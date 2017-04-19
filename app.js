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
server.post('/api/messages', connector.listen());

//=========================================================

let addresses = {};
let users = {};

const isAuth = (id) => {
	return users[id] && users[id].isAuth;
};

const isExists = (id) => {
	return !!users[id];
};

const addUser = (address, login, password, isAuth) => {
	users[address.channelId + "-" + address.user.id] = {
		address, login, password, isAuth
	};
};

const deleteUser = (address) => {
	delete users[address.channelId + "-" + address.user.id];
};

const bot = new builder.UniversalBot(connector);

//=========================================================

bot.on("receive", (message) => {
	null;
});

bot.on("conversationUpdate", (message) => {
	bot.beginDialog(message.address, "greetings");
	//deleteUser(message.address);
});

bot.dialog("greetings", [
	session => {
		if (isExists(session.message.address.channelId + "-" + session.message.address.user.id)) { return; }
		addUser(session.message.address);
		session.sendTyping();
		let msg = "Вас приветствует const-z-bot";
		session.send(msg).endDialog();
	}
]);

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog("/", [
	session => {
		delete addresses[session.message.address.channelId + "-" + session.message.address.user.id];
		if (!isAuth(session.message.address.channelId + "-" + session.message.address.user.id)) {
			session.beginDialog("auth");
		}
	}
]);

bot.dialog("auth", [
	session => {
		builder.Prompts.text(session, "Введите логин");
	},
	(session, results) => {
		if (typeof results.response !== "string") {
			session.replaceDialog("login");
			return;
		}
		session.userData.login = results.response;
		builder.Prompts.text(session, "Введите пароль");
	},
	(session, results) => {
		if (typeof results.response !== "string") {
			session.replaceDialog("password");
			return;
		}
		addUser(session.message.address, session.userData.login, results.response, true);
		session.userData.isAuth = true;
		session.send("Вы успешно авторизовались в системе").endDialog();
	}
]);


bot.dialog("file", session => {
	session.sendTyping();
	var msg = new builder.Message(session)
		.addAttachment({
			contentUrl: "https://www.cryptopro.ru/sites/default/files/products/pdf/files/CryptoProPDF_UserGuide.pdf",
			contentType: "application/pdf",
			name: "test.pdf"
		});
	session.send(msg).endDialog();
}).triggerAction({ matches: /file/i });

bot.dialog("subscription", session => {
	addresses[session.message.address.channelId + "-" + session.message.address.user.id] = session.message.address;
	session.send("added to subscriptions");
}).triggerAction({ matches: /subs/i });

bot.dialog("ping", session => {
	session
		.send(new Date().toISOString())
		.endDialog();
}).triggerAction({ matches: /ping/i });

setInterval(() => {
	Object.keys(addresses).map(key => {
		bot.isInConversation(addresses[key], (err, date) => {
			console.log("CONVERSATION", err, date);
			bot.beginDialog(addresses[key], "ping");
		});
	});
}, 5000);