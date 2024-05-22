# Realtime Chat Application using Spring Boot and React

---

##### Introduction

This project is a realtime chat application developed using Spring Boot and WebSocket. The application allows users to join, chat, and leave chat rooms in real-time. Spring Boot provides a robust and scalable architecture for the application, while WebSocket enables real-time communication between the server and clients. The application has features such as joining chat rooms, sending messages, and leaving chat rooms, providing a seamless and interactive chatting experience for its users.

#####3 Introduction(Watch Youtube)

   <a href="https://youtu.be/lHQQVwERzSo">
      <img src="docs/screen.png"/>
      </a>

---

##### Websocket

WebSocket is a computer communications protocol, providing full-duplex communication channels over a single TCP connection. WebSocket is distinct from HTTP.

The protocol enables interaction between a web browser (or other client application) and a web server with lower overhead than half-duplex alternatives such as HTTP polling, facilitating real-time data transfer from and to the server.

Once a websocket connection is established between a client and a server, both can exchange information until the connection is closed by any of the parties.

This is the main reason why WebSocket is preferred over the HTTP protocol when building a chat-like communication service that operates at high frequencies with low latency.

---

##### Stomp JS

Simple (or Streaming) Text Oriented Message Protocol (STOMP), formerly known as TTMP, is a simple text-based protocol, designed for working with message-oriented middleware (MOM). It provides an interoperable wire format that allows STOMP clients to talk with any message broker supporting the protocol.

Since websocket is just a communication protocol, it doesn't know how to send a message to a particular user. STOMP is basically a messaging protocol which is useful for these functionalities.

---

##### Sock JS

SockJS is used to enable fallback options for browsers that don't support WebSocket. The goal of SockJS is to let applications use a WebSocket API but fall back to non-WebSocket alternatives when necessary at runtime, i.e. without the need to change application code.

Under the hood, SockJS tries to use native WebSockets first. If that fails, it can use a variety of browser-specific transport protocols and presents them through WebSocket-like abstractions.

---

##### Codes

---

##### Backend

##### Websocket configuration

This Java code configures WebSocket using the Spring Framework. WebSocket is commonly used in real-time applications to enable bi-directional communication between client and server. The code implements the `WebSocketMessageBrokerConfigurer` interface to enable and customize the WebSocket message broker. Let's go through the code in detail:

Path: config>WebSocketConfig.java

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {}

```

- `@Configuration`: Indicates that this class is a configuration class. Spring will load this class when the application context is started and apply the configuration settings.
- `@EnableWebSocketMessageBroker`: This annotation enables the WebSocket message broker, allowing the application to support WebSocket messaging.
- The WebSocketConfig class implements the `WebSocketMessageBrokerConfigurer` interface, which allows for customization of the WebSocket messaging configuration.

```java
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/user");
        registry.setApplicationDestinationPrefixes("/app");
        registry.setUserDestinationPrefix("/user");
    }

```

- The configureMessageBroker method configures the message broker.
  - `registry.enableSimpleBroker("/user")`: Enables a simple in-memory message broker and sets /user as the prefix for destinations that the broker will handle.
  - `registry.setApplicationDestinationPrefixes("/app")`: Specifies that messages sent from clients with destinations prefixed with /app should be routed to message-handling methods in the application.
  - `registry.setUserDestinationPrefix("/user"):` Sets the prefix used for user-specific messages. This is useful for private messaging.

```java
   @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:3000")
                .withSockJS();
    }
```

- The registerStompEndpoints method registers STOMP (Simple Text Oriented Messaging Protocol) endpoints.
  - `registry.addEndpoint("/ws"):` Adds an endpoint at /ws for clients to establish WebSocket connections.
  - `.setAllowedOrigins("http://localhost:3000")`: Specifies that connections to this endpoint are allowed from the origin http://localhost:3000.
  - `.withSockJS():` Enables SockJS support, which provides fallback options for browsers that do not support WebSocket.

```java
     @Override
    public boolean configureMessageConverters(List<MessageConverter> messageConverters) {
        DefaultContentTypeResolver resolver = new DefaultContentTypeResolver();
        resolver.setDefaultMimeType(MimeTypeUtils.APPLICATION_JSON);
        MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter();
        converter.setObjectMapper(new ObjectMapper());
        converter.setContentTypeResolver(resolver);
        messageConverters.add(converter);
        return false;
    }
```

- The configureMessageConverters method configures the message converters.
  - `DefaultContentTypeResolver resolver = new DefaultContentTypeResolver()`: Creates a default content type resolver.
  - `resolver.setDefaultMimeType(MimeTypeUtils.APPLICATION_JSON)`: Sets the default MIME type to JSON.
  - `MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter()`: Creates a message converter for JSON messages.
  - `converter.setObjectMapper(new ObjectMapper())`: Configures the converter to use a Jackson ObjectMapper for JSON serialization and deserialization.
  - `converter.setContentTypeResolver(resolver)`: Sets the content type resolver for the converter.
  - `messageConverters.add(converter)`: Adds this converter to the list of message converters.
  - `return false`: Indicates that the default message converters should not be overridden. If this returned true, only the custom converters added would be used.\*

##### Dependencies

This code relies on the following Spring Framework imports:

- `org.springframework.context.annotation.Configuration`: Indicates that this class is a configuration class.
- `org.springframework.messaging.simp.config.MessageBrokerRegistry`: Allows configuration of the message broker for WebSocket communication.
- `org.springframework.web.socket.config.annotation.*`: Provides annotations and interfaces for configuring WebSocket endpoints.

---

### Frontend

This React code snippet demonstrates how to set up a WebSocket connection using the SockJS and STOMP (Simple Text Oriented Messaging Protocol) libraries, and how to handle real-time messaging. It uses the useEffect hook to establish the connection and subscribe to a specific message queue. Here's a detailed breakdown of what each part of the code does:

#### useEffect Hook

The useEffect hook is used to set up and clean up the WebSocket connection. It runs when the testMessage dependency changes.

```js
useEffect(() => {
  const socket = new SockJS("http://localhost:8080/ws");
  const stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => console.log(str),
    onConnect: () => {
      console.log("Connected");
      stompClient.subscribe(
        `/user/${testMessage.id}/queue/messages`,
        (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages({
            id: newMessage.id,
            content: newMessage.content,
            recipientId: newMessage.recipientId,
            senderId: newMessage.senderId,
          });
        }
      );
    },
    onDisconnect: () => {
      console.log("Disconnected");
    },
  });

  stompClient.activate();
  setClient(stompClient);

  return () => {
    stompClient.deactivate();
  };
}, [testMessage]);
```

#### Socket Initialization:

- `const socket = new SockJS('http://localhost:8080/ws')`;

  - This creates a new SockJS connection to the specified URL (`http://localhost:8080/ws`).

#### `STOMP Client Configuration`:

- const stompClient = new Client({ ... });
  - This initializes a new STOMP client with several options:
  - webSocketFactory: Uses the SockJS connection.
  - debug: Logs debug messages to the console.
  - onConnect: Callback function that runs when the connection is established. \* onDisconnect: Callback function that runs when the connection is disconnected.

#### Subscription to Messages:

- `stompClient.subscribe(/user/${testMessage.id}/queue/messages, (message) => { ... })`;
  - Subscribes to a specific message queue (`/user/${testMessage.id}/queue/messages`). When a message is received, it parses the message and updates the state (`setMessages`) with the new message details.

#### Activation and Deactivation:

- `stompClient.activate()`;
  - Activates the STOMP client, establishing the connection.
- `return () => { stompClient.deactivate(); };`

  - Cleans up by deactivating the STOMP client when the component unmounts or when `testMessage` changes.

#### `sendMessage` Function

The `sendMessage` function is used to send a message to the server.

```js
const sendMessage = () => {
  if (client && input) {
    client.publish({
      destination: "/app/chat",
      body: JSON.stringify({
        senderId: testMessage.senderId,
        recipientId: testMessage.recipientId,
        content: input,
        timestamp: Date.now(),
      }),
    });
    setInput("");
  }
};
```

- Checks for Client and Input:

  - `if (client && input)`
    - Ensures that there is an active STOMP client and input is not empty.

- Publishing a Message:

  - `client.publish({ destination: '/app/chat', body: JSON.stringify({ ... }) })`;
    - Sends a message to the server with the specified destination (`/app/chat`) and the message body in JSON format. The message includes `senderId`, `recipientId`, content, and a timestamp.

- Resetting the Input:

  - `setInput('')`;
    - Clears the input field after the message is sent.

#### Summary

- **WebSocket Connection**: The useEffect hook sets up a WebSocket connection to the server using SockJS and STOMP.
- **Subscription**: Subscribes to a specific message queue to receive messages.
- **Message Handling**: Parses received messages and updates the state.
- **Cleanup**: Deactivates the STOMP client when the component unmounts or when testMessage changes.
- **Sending Messages**: The sendMessage function allows sending messages to the server.

This setup is useful for real-time applications where live updates and instant messaging are required.

---


<<<<<<< HEAD
This method is annotated with `@MessageMapping("/chat.register")` and is invoked when a client sends a message to the "/app/chat.register" destination. It receives a `ChatMessage` object as a payload and a `SimpMessageHeaderAccessor` object to access message headers.

The method sets the sender's username from the received `ChatMessage` object as a session attribute using the `headerAccessor`. It returns the same `ChatMessage` object, which will be broadcasted to all subscribers of the "/topic/public" channel.

*   `@Payload`: Annotation indicating that the method parameter should be bound to the payload of the received message.
    
*   `@SendTo("/topic/public")`: Annotation specifying that the return value of the method should be sent as a message to the "/topic/public" destination.
    
*   Return: The `ChatMessage` object received as the payload.
    

#### `sendMessage`

This method is annotated with `@MessageMapping("/chat.send")` and is invoked when a client sends a message to the "/app/chat.send" destination. It receives a `ChatMessage` object as a payload.

The method simply returns the received `ChatMessage` object, which will be broadcasted to all subscribers of the "/topic/public" channel.

*   `@Payload`: Annotation indicating that the method parameter should be bound to the payload of the received message.
    
*   `@SendTo("/topic/public")`: Annotation specifying that the return value of the method should be sent as a message to the "/topic/public" destination.
    
*   Return: The `ChatMessage` object received as the payload.
    

This controller class is responsible for handling incoming WebSocket messages related to user registration and sending chat messages. The `register` method is used to register a user by storing their username in the session attributes, while the `sendMessage` method is used to broadcast chat messages to all connected clients. These methods are annotated to specify the destination paths for the messages and the return destinations for broadcasting.

* * *

##### UI

Path: `resources` directory

Basic HTML, CSS code and;

JavaScript code  
Path: resources>js>main.js
```
"use strict";

var usernamePage = document.querySelector("#username-page");
var chatPage = document.querySelector("#chat-page");
var usernameForm = document.querySelector("#usernameForm");
var messageForm = document.querySelector("#messageForm");
var messageInput = document.querySelector("#message");
var messageArea = document.querySelector("#messageArea");
var connectingElement = document.querySelector(".connecting");

var stompClient = null;
var username = null;
//mycode
var password = null;

var colors = \[
  "#2196F3",
  "#32c787",
  "#00BCD4",
  "#ff5652",
  "#ffc107",
  "#ff85af",
  "#FF9800",
  "#39bbb0",
  "#fcba03",
  "#fc0303",
  "#de5454",
  "#b9de54",
  "#54ded7",
  "#54ded7",
  "#1358d6",
  "#d611c6",
\];

function connect(event) {
  username = document.querySelector("#name").value.trim();
  password = document.querySelector("#password").value;
  if (username) {
    // Please create a password
    if (password == "YOUR PASSWORD") {
      usernamePage.classList.add("hidden");
      chatPage.classList.remove("hidden");

      var socket = new SockJS("/websocket");
      stompClient = Stomp.over(socket);

      stompClient.connect({}, onConnected, onError);
    } else {
      let mes = document.getElementById("mes");
      mes.innerText = "Wrong password";
    }
  }
  event.preventDefault();
}

function onConnected() {
  // Subscribe to the Public Topic
  stompClient.subscribe("/topic/public", onMessageReceived);

  // Tell your username to the server
  stompClient.send(
    "/app/chat.register",
    {},
    JSON.stringify({ sender: username, type: "JOIN" })
  );

  connectingElement.classList.add("hidden");
}

function onError(error) {
  connectingElement.textContent =
    "Could not connect to WebSocket! Please refresh the page and try again or contact your administrator.";
  connectingElement.style.color = "red";
}

function send(event) {
  var messageContent = messageInput.value.trim();

  if (messageContent && stompClient) {
    var chatMessage = {
      sender: username,
      content: messageInput.value,
      type: "CHAT",
    };

    stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
    messageInput.value = "";
  }
  event.preventDefault();
}

function onMessageReceived(payload) {
  var message = JSON.parse(payload.body);

  var messageElement = document.createElement("li");

  if (message.type === "JOIN") {
    messageElement.classList.add("event-message");
    message.content = message.sender + " joined!";
  } else if (message.type === "LEAVE") {
    messageElement.classList.add("event-message");
    message.content = message.sender + " left!";
  } else {
    messageElement.classList.add("chat-message");

    var avatarElement = document.createElement("i");
    var avatarText = document.createTextNode(message.sender\[0\]);
    avatarElement.appendChild(avatarText);
    avatarElement.style\["background-color"\] = getAvatarColor(message.sender);

    messageElement.appendChild(avatarElement);

    var usernameElement = document.createElement("span");
    var usernameText = document.createTextNode(message.sender);
    usernameElement.appendChild(usernameText);
    messageElement.appendChild(usernameElement);
    // \* update
    usernameElement.style\["color"\] = getAvatarColor(message.sender);
    //\* update end
  }

  var textElement = document.createElement("p");
  var messageText = document.createTextNode(message.content);
  textElement.appendChild(messageText);

  messageElement.appendChild(textElement);
  // \* update
  if (message.sender === username) {
    // Add a class to float the message to the right
    messageElement.classList.add("own-message");
  } // \* update end
  messageArea.appendChild(messageElement);
  messageArea.scrollTop = messageArea.scrollHeight;
}

function getAvatarColor(messageSender) {
  var hash = 0;
  for (var i = 0; i < messageSender.length; i++) {
    hash = 31 \* hash + messageSender.charCodeAt(i);
  }

  var index = Math.abs(hash % colors.length);
  return colors\[index\];
}

usernameForm.addEventListener("submit", connect, true);
messageForm.addEventListener("submit", send, true);
 ```     

This code is a client-side JavaScript code that enables a user to connect to a chat application using a username and password. It utilizes the Stomp protocol to establish a WebSocket connection and exchange messages with a server.

##### Variables

*   `usernamePage`: Represents the element on the page that contains the username input form.
*   `chatPage`: Represents the element on the page that displays the chat interface.
*   `usernameForm`: Represents the form element for submitting the username.
*   `messageForm`: Represents the form element for submitting chat messages.
*   `messageInput`: Represents the input field where the user enters chat messages.
*   `messageArea`: Represents the area where chat messages are displayed.
*   `connectingElement`: Represents the element that indicates the connection status.
    
*   `stompClient`: Holds the Stomp client instance used for WebSocket communication.
    
*   `username`: Stores the username entered by the user.
*   `password`: Stores the password entered by the user.
    
*   `colors`: An array of colors used for generating avatar colors.
    

##### Functions

#### `connect(event)`

This function is called when the username form is submitted. It retrieves the username and password entered by the user, checks if the password is correct, and if so, establishes a WebSocket connection to the server. It hides the username page and displays the chat page.

*   `event`: The event object representing the form submission event.

#### `onConnected()`

This function is called when the WebSocket connection is successfully established. It subscribes to the "/topic/public" channel to receive messages from the server. It also sends a JOIN message to the server to notify the user's username.

#### `onError(error)`

This function is called when an error occurs during the WebSocket connection. It updates the connecting element to display an error message.

*   `error`: The error object representing the connection error.

#### `send(event)`

This function is called when the chat message form is submitted. It retrieves the message content, sends the message to the server using the Stomp client, and clears the message input field.

*   `event`: The event object representing the form submission event.

#### `onMessageReceived(payload)`

This function is called when a message is received from the server. It parses the message payload, creates the necessary DOM elements to display the message, and appends them to the message area.

*   `payload`: The message payload received from the server.

#### `getAvatarColor(messageSender)`

This function generates an avatar color based on the message sender's username. It calculates a hash value based on the characters of the username and maps it to an index in the `colors` array to select a color.

*   `messageSender`: The username of the message sender.

##### Event Listeners

*   `usernameForm.addEventListener("submit", connect, true)`: Listens for the submission of the username form and calls the `connect` function.
*   `messageForm.addEventListener("submit", send, true)`: Listens for the submission of the chat message form and calls the `send` function.
  


  ![](docs/screen.mp4)
=======
# :e-mail: Contact
|***Sefa Demirtaş***|
|:-------------|
|*Software Developer*|
|[Linkedin](https://www.linkedin.com/in/sefa-demirtas)|
|sefa.demirtas91@gmail.com|
>>>>>>> 94440da (V1 update | Chat App)
