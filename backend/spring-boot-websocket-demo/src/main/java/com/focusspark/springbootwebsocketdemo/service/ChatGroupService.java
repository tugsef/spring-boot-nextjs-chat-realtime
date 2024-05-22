package com.focusspark.springbootwebsocketdemo.service;

import com.focusspark.springbootwebsocketdemo.model.ChatGroup;
import com.focusspark.springbootwebsocketdemo.repository.ChatGroupRepository;
import com.focusspark.springbootwebsocketdemo.repository.ChatMessageRepository;
import com.focusspark.springbootwebsocketdemo.service.iml.ChatGroupServiceIml;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatGroupService implements ChatGroupServiceIml  {

    private final ChatGroupRepository chatGroupRepository;


    @Override
    public Optional<String> getChatRoomId(Long senderId, Long recipientId, boolean createNewRoomIfNotExists) {
        return chatGroupRepository
                .findBySenderIdAndRecipientId(senderId, recipientId)
                .map(ChatGroup::getChatId)
                .or(() -> {
                    if(createNewRoomIfNotExists) {
                        var chatId = createChatId(senderId, recipientId);
                        return Optional.of(chatId);
                    }

                    return  Optional.empty();
                });
    }

    @Override
    public String createChatId(Long senderId, Long recipientId) {
        var chatId = String.format("%s_%s", senderId, recipientId);

        ChatGroup senderRecipient = ChatGroup
                .builder()
                .chatId(chatId)
                .senderId(senderId)
                .recipientId(recipientId)
                .build();

        ChatGroup recipientSender = ChatGroup
                .builder()
                .chatId(chatId)
                .senderId(recipientId)
                .recipientId(senderId)
                .build();

        chatGroupRepository.save(senderRecipient);
        chatGroupRepository.save(recipientSender);

        return chatId;
    }

    @Override
    public List<ChatGroup> findGroupMessages(Long userId) {
        return chatGroupRepository.findAllBySenderId(userId);
    }
}
