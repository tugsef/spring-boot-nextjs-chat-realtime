package com.focusspark.springbootwebsocketdemo.controller;

import com.focusspark.springbootwebsocketdemo.model.ChatGroup;
import com.focusspark.springbootwebsocketdemo.model.User;
import com.focusspark.springbootwebsocketdemo.service.iml.UserServiceIml;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping
@RequiredArgsConstructor
public class UserController {

    private final UserServiceIml userService;

    @MessageMapping("/user.addUser")
    @SendTo("/user/public")
    public User addUser(
            @Payload User user
    ) {
        userService.saveUser(user);
        return user;
    }

    @MessageMapping("/user.disconnectUser")
    @SendTo("/user/public")
    public User disconnectUser(
            @Payload User user
    ) {
        userService.disconnect(user);
        return user;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> findConnectedUsers() {
        return ResponseEntity.ok(userService.findConnectedUsers());
    }

    @GetMapping("/user/{nickName}")
    public ResponseEntity<Optional<User>> findGroupMessages(@PathVariable String nickName) {
        return ResponseEntity
                .ok(userService.getUser(nickName));
    }

    @GetMapping("/user/id/{userId}")
    public ResponseEntity<Optional<User>> findByUser(@PathVariable Long userId) {
        return ResponseEntity
                .ok(userService.findByUser(userId));
    }
}
