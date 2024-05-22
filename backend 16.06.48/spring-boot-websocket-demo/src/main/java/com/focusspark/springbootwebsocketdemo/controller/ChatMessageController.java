package com.focusspark.springbootwebsocketdemo.controller;

import com.focusspark.springbootwebsocketdemo.model.ChatMessage;
import com.focusspark.springbootwebsocketdemo.model.rest.request.ChatNotificationRequest;
import com.focusspark.springbootwebsocketdemo.model.rest.request.MessageCreateRequest;
import com.focusspark.springbootwebsocketdemo.service.iml.ChatMessageServiceIml;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class ChatMessageController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageServiceIml chatMessageService;

    @MessageMapping("/chat")
    public void processMessage(@Payload MessageCreateRequest messageCreateRequest) {
        ChatMessage savedMsg = chatMessageService.save(messageCreateRequest);
        messagingTemplate.convertAndSendToUser(
                messageCreateRequest.getRecipientId().toString(), "/queue/messages",
                new ChatNotificationRequest(

                        savedMsg.getId(),
                        savedMsg.getSenderId(),
                        savedMsg.getRecipientId(),
                        savedMsg.getContent()
                )
        );
    }

    @GetMapping("/messages/{senderId}/{recipientId}")
    public ResponseEntity<List<ChatMessage>> findChatMessages(@PathVariable Long senderId,
                                                              @PathVariable Long recipientId) {
        return ResponseEntity
                .ok(chatMessageService.findChatMessages(senderId, recipientId));
    }
}
