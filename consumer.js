const consumer = require('./stomp-consumer')
const producer = require('./stomp-producer')
const queueIn = 'boostacq.chimp.post.in'
const queueOut = 'boostacq.chimp.post.out'

let run = async()=>{
    try {
        console.log(`begin consumer`)
        await consumer.connect(queueIn)
        let message = await consumer.subscribe()
        let messageId = message.headers['message-id']
        console.log(`messageId:${messageId}`)
        try {
            await consumer.ack(messageId);
            await consumer.unsubscribe()
            await consumer.disconnect()
            await producer.connect(queueOut)
            message = JSON.parse(message.body[0])
            message.result = 25
            result = producer.enqueue(queueOut, JSON.stringify(message))
        } catch (err) {
            console.log(err)
            await consumer.nack(messageId)
        } finally{
            process.exit()
        }
    } catch (err) {
        console.log(err)
    } finally {
        console.log(`finish consumer`)
    }
}
run()