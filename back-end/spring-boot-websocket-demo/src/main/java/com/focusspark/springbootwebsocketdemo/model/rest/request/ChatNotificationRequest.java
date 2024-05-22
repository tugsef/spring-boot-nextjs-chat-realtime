package com.focusspark.springbootwebsocketdemo.model.rest.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatNotificationRequest {
    private Long id;
    private Long senderId;
    private Long recipientId;
    private String content;
}
