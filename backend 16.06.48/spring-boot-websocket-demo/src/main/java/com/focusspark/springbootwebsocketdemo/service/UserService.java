package com.focusspark.springbootwebsocketdemo.service;

import com.focusspark.springbootwebsocketdemo.model.Status;
import com.focusspark.springbootwebsocketdemo.model.User;
import com.focusspark.springbootwebsocketdemo.repository.UserRepository;
import com.focusspark.springbootwebsocketdemo.service.iml.UserServiceIml;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements UserServiceIml {

    private final UserRepository repository;

    public void saveUser(User user) {
        user.setStatus(Status.ONLINE);
        repository.save(user);
    }

    public void disconnect(User user) {
        var storedUser = repository.findById(user.getId()).orElse(null);
        if (storedUser != null) {
            storedUser.setStatus(Status.OFFLINE);
            repository.save(storedUser);
        }
    }

    public List<User> findConnectedUsers() {
        return repository.findAllByStatus(Status.ONLINE);
    }

    @Transactional
    @Override
    public Optional<User> getUser(String nickName) {
        return repository.findByNickName(nickName);
    }

    @Override
    public Optional<User> findByUser(Long userId) {
        return repository.findById(userId);
    }

}
