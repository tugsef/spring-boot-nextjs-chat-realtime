package com.focusspark.springbootwebsocketdemo.service.iml;

import com.focusspark.springbootwebsocketdemo.model.ChatGroup;
import com.focusspark.springbootwebsocketdemo.model.ChatMessage;

import java.util.List;
import java.util.Optional;

public interface ChatGroupServiceIml {
    Optional<String> getChatRoomId(Long senderId, Long recipientId, boolean createNewRoomIfNotExists);
    String createChatId(Long senderId, Long recipientId);
   List<ChatGroup> findGroupMessages(Long userId);
}
