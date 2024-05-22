package com.focusspark.springbootwebsocketdemo.repository;

import com.focusspark.springbootwebsocketdemo.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage,Long> {
    List<ChatMessage> findByChatId(String chatId);

}
