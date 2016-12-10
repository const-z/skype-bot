const Hapi = require("hapi");
const builder = require('botbuilder');

const server = new Hapi.Server();
server.connection({ host: "0.0.0.0", port: 3000 });

// Initialize your connector
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

const bot = new builder.UniversalBot(connector);
//=========================================================
// Bots Dialogs
//=========================================================

// bot.dialog('/', function(session) {
// 	session.sendTyping();
// 	setTimeout(function () {
//     	session.send(session.message.text);
// 	}, 5000);
// });

bot.dialog('/', [
    function (session) {
        builder.Prompts.text(session, "Hello... What's your name?");
    },
    function (session, results) {
        session.userData.name = results.response;
        builder.Prompts.number(session, "Hi " + results.response + ", How many years have you been coding?");
    },
    function (session, results) {
        session.userData.coding = results.response;
        builder.Prompts.choice(session, "What language do you code Node using?", ["JavaScript", "CoffeeScript", "TypeScript"]);
    },
    function (session, results) {
        session.userData.language = results.response.entity;
        session.send("Got it... " + session.userData.name +
                     " you've been programming for " + session.userData.coding +
                     " years and use " + session.userData.language + ".");
    }
]);

// bot.dialog('/create-subscription', function(session) {
//     var address = JSON.stringify(session.message.address);

//     // Save subscription with address to storage.
//     session.sendTyping();
//     createSubscription(args.userId, address, function(err) {
//         // Notify the user of success or failure and end the dialog.
//         var reply = err ? 'unable to create subscription.' : 'subscription created';
//         session.endDialog(reply);
//     });
// });

// Here botHandler is a function that takes raw request and response object
const botHandler = connector.listen();
server.route({
    method: 'POST',
    path: '/api/messages',
    handler: function(request, reply) {
        request.raw.req.body = request.payload;
        request.raw.res.status = reply;
        botHandler(request.raw.req, request.raw.res); // Forwarded!!!
    }
});
server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});