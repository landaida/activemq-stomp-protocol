const producer = require('./stomp-producer')
const queue = 'boostacq.chimp.post.in'

let run = async()=>{
    try {
        console.log(`begin producer`)
        let entities = []
        entities.push({"id":1, "name":"One"})
        entities.push({"id":2, "name":"Two"})
        entities.push({"id":3, "name":"Three"})

        await producer.connect(queue)
        entities.forEach((entity)=>{
            const entityStr = JSON.stringify(entity)
            let result = producer.enqueue(queue, entityStr)
            console.log(`produce entity:${entityStr}`)
        })
    } catch (err) {
        console.log(err)
    } finally {
        console.log(`finish producer`)
    }
}
run()