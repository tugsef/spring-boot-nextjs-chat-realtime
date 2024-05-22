package com.focusspark.springbootwebsocketdemo.repository;

import com.focusspark.springbootwebsocketdemo.model.Status;
import com.focusspark.springbootwebsocketdemo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.beans.JavaBean;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    List<User> findAllByStatus(Status status);
    Optional<User>  findByNickName(String nickName);
}
