package com.example.CRM1640.service.interfaces;

import com.example.CRM1640.entities.other.IdeaEvent;

public interface RabbitMQProducer {

    void send(IdeaEvent event);
}
