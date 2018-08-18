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

// 'activemq.prefetchSize' is optional.
// Specified number will 'fetch' that many messages
// and dump it to the client.
let headers = {
    destination: [],
    ack: 'client',
    'activemq.prefetchSize': '1'
};

let messages = 0;

let client = new stomp.Stomp(stomp_args);

client.IsConnected = false;
client.IsSubscribed = false;
client.AllowReconnect = true;

// start connection with active-mq
var self = module.exports = { 
    connect : async(queue)=>{
        return new Promise(resolve=>{
            console.log(`inside connect queue:${queue}`)
            headers.destination.push(queue)
            client.connect()
            myInterval = setInterval(self.reconnect, 5000)

            client.on('connected', function() {
                console.log('[AMQ] Consumer Connected');
                resolve()
            })
        })
    },
    subscribe:async()=>{
        return new Promise(resolve=>{
            client.subscribe(headers);
            client.IsConnected = true;
            client.IsSubscribed = true;
            client.on('message', function(message) {
                let messageId = message.headers['message-id']
                if (client.IsSubscribed == true) {
                    messages++;
                    console.log("received message : " + message.body[0]);
                    resolve(message)
                    // setTimeout(()=>{
                    //     try {
                    //         client.ack(messageId);
                    //     } catch (error) {
                    //         client.nack(messageId)
                    //     }
                    // }, 10000)
                } else {
                    console.log("[AMQ] Consumer status : Unsubscribed");
                }
            });
        })
    },
    ack:(messageId)=>{
        client.ack(messageId);
},
nack:(messageId)=>{
        client.nack(messageId);
},
unsubscribe:async()=>{
    return new Promise(resolve=>{
        client.unsubscribe(headers);
        resolve()
    })
},
reconnect:()=>{
    // console.log(`consumer check reconnect is necessary`)
    if (client.AllowReconnect && client.IsConnected === false) {
        console.log(`consumer reconnect`)
        client.connect();
    }
},
disconnect:()=>{
    return new Promise(resolve=>{
        console.log(`consumer disconnect`)
        client.disconnect();
        client.on('disconnected', function() {
            console.log('[AMQ] Consumer Disconnected');
            client.IsConnected = false;
            client.IsSubscribed = false;
            clearInterval(myInterval)
            resolve()
        });
    })
}
}

client.on('receipt', function(receipt) {
    console.log("[AMQ] Consumer RECEIPT : " + receipt);
})
client.on('error', function(error_frame) {
    if (Object.keys(error_frame).length > 0) {
        if (error_frame.hasOwnProperty('headers')) {
            console.log('[AMQ] Consumer message : ' + error_frame.headers['message']);
        }
    }
    client.disconnect();
});

process.on("exit", function() {
    console.log('[AMQ] No. of consumed [' + messages + '] messages');
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
