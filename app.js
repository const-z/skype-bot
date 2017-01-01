var builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
	console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
	appId: process.env.MICROSOFT_APP_ID,
	appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Bot dialog
bot.dialog('/', function (session) {
	var cards = getCardsAttachments();

	// create reply with Carousel AttachmentLayout
	var reply = new builder.Message(session)
		.attachmentLayout(builder.AttachmentLayout.carousel)
		.attachments(cards);

	session.send(reply);
});

function getCardsAttachments(session) {
	return [
		new builder.HeroCard(session)
			.title('Azure Storage')
			.subtitle('Massively scalable cloud storage for your applications')
			.text('Store and help protect your data. Get durable, highly available data storage across the globe and pay only for what you use.')
			.images([
				builder.CardImage.create(session, 'https://acom.azurecomcdn.net/80C57D/cdn/mediahandler/docarticles/dpsmedia-prod/azure.microsoft.com/en-us/documentation/articles/storage-introduction/20160801042915/storage-concepts.png')
			])
			.buttons([
				builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/storage/', 'Learn More')
			]),

		new builder.ThumbnailCard(session)
			.title('DocumentDB')
			.subtitle('Blazing fast, planet-scale NoSQL')
			.text('NoSQL service for highly available, globally distributed apps—take full advantage of SQL and JavaScript over document and key-value data without the hassles of on-premises or virtual machine-based cloud database options.')
			.images([
				builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/29f4/beb4b953-ab91-4a31-b16a-71fb6d6829f4/WhatisAzureDocumentDB_960.jpg')
			])
			.buttons([
				builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/documentdb/', 'Learn More')
			]),

		new builder.HeroCard(session)
			.title('Azure Functions')
			.subtitle('Process events with serverless code')
			.text('Azure Functions is a serverless event driven experience that extends the existing Azure App Service platform. These nano-services can scale based on demand and you pay only for the resources you consume.')
			.images([
				builder.CardImage.create(session, 'https://azurecomcdn.azureedge.net/cvt-8636d9bb8d979834d655a5d39d1b4e86b12956a2bcfdb8beb04730b6daac1b86/images/page/services/functions/azure-functions-screenshot.png')
			])
			.buttons([
				builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/functions/', 'Learn More')
			]),

		new builder.ThumbnailCard(session)
			.title('Cognitive Services')
			.subtitle('Build powerful intelligence into your applications to enable natural and contextual interactions')
			.text('Enable natural and contextual interaction with tools that augment users\' experiences using the power of machine-based intelligence. Tap into an ever-growing collection of powerful artificial intelligence algorithms for vision, speech, language, and knowledge.')
			.images([
				builder.CardImage.create(session, 'https://azurecomcdn.azureedge.net/cvt-8636d9bb8d979834d655a5d39d1b4e86b12956a2bcfdb8beb04730b6daac1b86/images/page/services/functions/azure-functions-screenshot.png')
			])
			.buttons([
				builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/functions/', 'Learn More')
			])
	];
}

// const Hapi = require("hapi");
// const builder = require('botbuilder');

// const server = new Hapi.Server();
// server.connection({ host: "0.0.0.0", port: 3000 });

// // Initialize your connector
// const connector = new builder.ChatConnector({
//     appId: process.env.MICROSOFT_APP_ID,
//     appPassword: process.env.MICROSOFT_APP_PASSWORD
// });

// const bot = new builder.UniversalBot(connector);
// //=========================================================
// // Bots Dialogs
// //=========================================================

// // bot.dialog('/', function(session) {
// // 	session.sendTyping();
// // 	setTimeout(function () {
// //     	session.send(session.message.text);
// // 	}, 5000);
// // });

// bot.dialog('/', [
//     function (session) {
//         builder.Prompts.text(session, "Hello... What's your name?");
//     },
//     function (session, results) {
//         session.userData.name = results.response;
//         builder.Prompts.number(session, "Hi " + results.response + ", How many years have you been coding?");
//     },
//     function (session, results) {
//         session.userData.coding = results.response;
//         builder.Prompts.choice(session, "What language do you code Node using?", ["JavaScript", "CoffeeScript", "TypeScript"]);
//     },
//     function (session, results) {
//         session.userData.language = results.response.entity;
//         session.send("Got it... " + session.userData.name +
//                      " you've been programming for " + session.userData.coding +
//                      " years and use " + session.userData.language + ".");
//     }
// ]);

// // bot.dialog('/create-subscription', function(session) {
// //     var address = JSON.stringify(session.message.address);

// //     // Save subscription with address to storage.
// //     session.sendTyping();
// //     createSubscription(args.userId, address, function(err) {
// //         // Notify the user of success or failure and end the dialog.
// //         var reply = err ? 'unable to create subscription.' : 'subscription created';
// //         session.endDialog(reply);
// //     });
// // });

// // Here botHandler is a function that takes raw request and response object
// const botHandler = connector.listen();
// server.route({
//     method: 'POST',
//     path: '/api/messages',
//     handler: function(request, reply) {
//         request.raw.req.body = request.payload;
//         request.raw.res.status = reply;
//         botHandler(request.raw.req, request.raw.res); // Forwarded!!!
//     }
// });
// server.start((err) => {
//     if (err) {
//         throw err;
//     }
//     console.log(`Server running at: ${server.info.uri}`);
// });