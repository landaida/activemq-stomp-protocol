ActiveMQ Stomp Protocol

To deploy activemq service I've use a docker image named "webcenter/activemq:latest":
https://hub.docker.com/r/webcenter/activemq/

Pull image with this command:
docker pull webcenter/activemq:latest

Than only run with this command:
docker run -d --name='activemq' -p 8161:8161 -p 61613:61613 webcenter/activemq:latest

After run your docker container go to queue list:
http://127.0.0.1:8161/admin/queues.jsp


When you run the main.js the scrip will create two messages and than will consume one these messages and will add return atrribute to this message.



