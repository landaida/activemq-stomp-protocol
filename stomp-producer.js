const stomp = require('node-stomp');
let myInterval = null
// Set debug to true for more verbose output.
// login and passcode are optional (required by rabbitMQ)
let stomp_args = {
    port: 61613,
    host: 'localhost',
    debug: true,
    login: 'admin',
    passcode: 'admin',
};

// Set to true if you want a receipt of all messages sent.
let receipt = false;
let messages = 0;

let client = new stomp.Stomp(stomp_args);

client.IsConnected = false;
client.IsSubscribed = false;
client.AllowReconnect = true;

let headers = {
    'destination': null,
    'body': null,
    'persistent': 'true',
    'expires': 0
};

self = module.exports = {
    connect:async()=>{
        return new Promise(resolve=>{
            console.log(`inside connect producer`)
            // start connection with active-mq
            client.connect()
            myInterval = setInterval(self.reconnect, 5000);
            client.on('connected', function() {
                console.log('[AMQ] Producer Connected');
                client.IsConnected = true;
                client.IsSubscribed = true;
                resolve()
            });
        })
    },
    enqueue:(queue, message, expires)=>{
        messages++;
        headers.destination = queue
        headers.body = message
        expires ? headers.expires = expires : null
        console.log(`before send message:${message}`)
        return client.send(headers, receipt);
    },
    reconnect:()=>{
        // console.log(`producer check reconnect is necessary`)
        if (client.AllowReconnect && client.IsConnected === false) {
            console.log(`producer check reconnect is necessary`)
            client.connect();
        }
    }
}



client.on('disconnected', function() {
    console.log('[AMQ] Producer Disconnected');
    client.IsConnected = false;
    client.IsSubscribed = false;
    clearInterval(myInterval)
});

client.on('error', function(error_frame) {
    if (Object.keys(error_frame).length > 0) {
        if (error_frame.hasOwnProperty('headers')) {
            console.log('[AMQ] Producer message : ' + error_frame.headers['message']);
        }
    }
    client.disconnect();
});

client.on('receipt', function(receipt) {
    console.log("[AMQ] Producer RECEIPT : " + receipt);
});

process.on("exit", function() {
    console.log('[AMQ] Producer No. of produced [' + messages + '] messages');
});

// exist process on SIGINT
process.on('SIGINT', function() {
    client.IsSubscribed = false;
    client.AllowReconnect = false;
    setTimeout(() => {
        client.unsubscribe(headers);
        client.disconnect();
    }, 2000);
});

process.on('SIGTERM', function() {
    client.IsSubscribed = false;
    client.AllowReconnect = false;
    setTimeout(() => {
        client.unsubscribe(headers);
        client.disconnect();
    }, 2000);
});
