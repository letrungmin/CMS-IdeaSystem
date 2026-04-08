package com.example.CRM1640.service.implementation;

import com.example.CRM1640.config.RabbitMQConfig;
import com.example.CRM1640.entities.other.EncourageEvent;
import com.example.CRM1640.entities.other.IdeaEvent;
import com.example.CRM1640.service.interfaces.RabbitMQProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RabbitMQProducerImpl implements RabbitMQProducer {

    private final RabbitTemplate rabbitTemplate;

    @Override
    public void send(IdeaEvent event) {
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.ROUTING_KEY,
                event
        );
    }

    @Override
    public void sendEncourage(EncourageEvent event) {
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_SEND_ENCOURAGE, RabbitMQConfig.ROUTING_KEY_ENCOURAGE, event);
    }
}
