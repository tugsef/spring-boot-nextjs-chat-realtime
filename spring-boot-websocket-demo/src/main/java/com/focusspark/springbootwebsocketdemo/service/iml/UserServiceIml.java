package com.focusspark.springbootwebsocketdemo.service.iml;

import com.focusspark.springbootwebsocketdemo.model.User;
import com.focusspark.springbootwebsocketdemo.repository.UserRepository;

import java.util.List;
import java.util.Optional;

public interface UserServiceIml {


    void saveUser(User user);

    void disconnect(User user);

    List<User> findConnectedUsers();

    Optional<User>  getUser(String nickName);

    Optional<User>  findByUser(Long userId);

}
