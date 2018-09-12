## ActiveMQ Stomp Protocol

["Stomp Protocol Documentation"](https://stomp.github.io/stomp-specification-1.2.html#UNSUBSCRIBE)
["nodejs module to use stomp protocol"](https://github.com/mseld/node-stomp)

To deploy activemq service I've use a docker image named ["webcenter/activemq:latest"](https://hub.docker.com/r/webcenter/activemq/)


## To pull image exec this command in your terminal:
docker pull webcenter/activemq:latest

## To create an container whit the pulled image only exec this command in your terminal:
docker run -d --name='activemq' -p 8161:8161 -p 61613:61613 webcenter/activemq:latest

## After this you already have an activemq service running in your localhost, to see informations about your queue list and messages go to below link(default user:admin, default password:admin):
http://localhost:8161/admin/queues.jsp


## When you execute "producer.js" file three messages will be produced in the queue named 'boostacq.chimp.post.in'.

    {"id":1, "name":"One"}
    {"id":2, "name":"Two"}
    {"id":3, "name":"Three"}

## When you execute "consumer.js" file will be consume only one message for each execution and the result will be put in another queue named 'boostacq.chimp.post.out'

    {"id":1, "name":"One", "result":25}

<p align="center">
    <br><br>
    <img src="./img/2018-08-18 14_42_18-Windows PowerShell.png"/>
    <br><br>
    <img src="./img/2018-08-18 14_44_05-localhost _ Queues.png"/>
    <br><br>
    <img src="./img/2018-08-18 14_44_34-Windows PowerShell.png"/>
    <br><br>
    <img src="./img/2018-08-18 14_44_54-localhost _ Message ID_0f361e7fa1a7-41059-1534531989138-5_191_-1_1_1.png"/>
</p>
