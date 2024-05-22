package com.focusspark.springbootwebsocketdemo.repository;

import com.focusspark.springbootwebsocketdemo.model.ChatGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ChatGroupRepository extends JpaRepository<ChatGroup,Long> {
    Optional<ChatGroup> findBySenderIdAndRecipientId(Long senderId, Long recipientId);

    List<ChatGroup> findAllBySenderId(Long senderId)   ;

    Optional<ChatGroup> findBySenderIdOrRecipientId(Long senderId, Long recipientId);

}
