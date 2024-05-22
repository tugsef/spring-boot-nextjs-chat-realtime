package com.focusspark.springbootwebsocketdemo.service;

import com.focusspark.springbootwebsocketdemo.model.ChatMessage;
import com.focusspark.springbootwebsocketdemo.model.rest.request.MessageCreateRequest;
import com.focusspark.springbootwebsocketdemo.repository.ChatMessageRepository;
import com.focusspark.springbootwebsocketdemo.service.iml.ChatGroupServiceIml;
import com.focusspark.springbootwebsocketdemo.service.iml.ChatMessageServiceIml;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService implements ChatMessageServiceIml {

    private final ChatMessageRepository repository;
    private final ChatGroupServiceIml chatGroupServiceIml;

    @Override
    public ChatMessage save(MessageCreateRequest messageCreateRequest) {

ChatMessage chatMessage = ChatMessage.builder().content(messageCreateRequest.getContent()).recipientId(messageCreateRequest.getRecipientId()).timestamp(messageCreateRequest.getTimestamp()).senderId(messageCreateRequest.getSenderId()).build();
        var chatId = chatGroupServiceIml
               .getChatRoomId(chatMessage.getSenderId(), chatMessage.getRecipientId(), true)
                .orElseThrow(); // You can create your own dedicated exception

        chatMessage.setChatId(chatId);
        repository.save(chatMessage);
        return chatMessage;
    }

    @Override
    public List<ChatMessage> findChatMessages(Long senderId, Long recipientId) {
        var chatId = chatGroupServiceIml.getChatRoomId(senderId, recipientId, false);
        return chatId.map(repository::findByChatId).orElse(new ArrayList<>());
    }
}
