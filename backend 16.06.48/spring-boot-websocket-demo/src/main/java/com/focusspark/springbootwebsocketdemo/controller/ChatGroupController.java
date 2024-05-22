package com.focusspark.springbootwebsocketdemo.controller;

import com.focusspark.springbootwebsocketdemo.model.ChatGroup;
import com.focusspark.springbootwebsocketdemo.service.iml.ChatGroupServiceIml;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class ChatGroupController {
    private final ChatGroupServiceIml chatGroupService;
    @GetMapping("/group/{senderId}")
    public ResponseEntity<List<ChatGroup>> findGroupMessages(@PathVariable Long senderId) {
        return ResponseEntity
                .ok(chatGroupService.findGroupMessages(senderId));
    }
}
