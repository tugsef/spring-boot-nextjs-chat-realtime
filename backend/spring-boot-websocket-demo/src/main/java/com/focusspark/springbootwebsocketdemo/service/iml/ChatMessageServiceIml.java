package com.focusspark.springbootwebsocketdemo.service.iml;

import com.focusspark.springbootwebsocketdemo.model.ChatMessage;
import com.focusspark.springbootwebsocketdemo.model.rest.request.MessageCreateRequest;

import java.util.List;

public interface ChatMessageServiceIml {
    ChatMessage save(MessageCreateRequest messageCreateRequest);
    List<ChatMessage> findChatMessages(Long senderId, Long recipientId);

}
