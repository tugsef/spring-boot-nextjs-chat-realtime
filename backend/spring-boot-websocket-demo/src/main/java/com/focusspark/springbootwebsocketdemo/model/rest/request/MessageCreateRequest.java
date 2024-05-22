package com.focusspark.springbootwebsocketdemo.model.rest.request;

import com.focusspark.springbootwebsocketdemo.model.ChatGroup;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class MessageCreateRequest {

    private Long senderId;
    private Long recipientId;
    private String content;
    private Date timestamp;

}
