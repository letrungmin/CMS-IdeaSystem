package com.example.CRM1640.service.implementation;

import com.example.CRM1640.config.RabbitMQConfig;
import com.example.CRM1640.entities.other.EncourageEvent;
import com.example.CRM1640.entities.other.IdeaEvent;
import com.example.CRM1640.service.interfaces.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationConsumer {

    private final EmailService emailService;

    @RabbitListener(queues = RabbitMQConfig.QUEUE)
    public void receive(IdeaEvent event) {

        switch (event.getType()) {
            case SUBMITTED -> handleSubmitted(event);
            case APPROVED -> handleApproved(event);
            case REJECTED -> handleRejected(event);
        }
    }

    private void handleSubmitted(IdeaEvent event) {
        emailService.sendReviewEmail(event);
    }

    private void handleApproved(IdeaEvent event) {
        emailService.sendApprovedEmail(event);
    }

    private void handleRejected(IdeaEvent event) {
        emailService.sendRejectedEmail(event);
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE_ENCOURAGE)
    public void handleEncourage(EncourageEvent event) {
        emailService.sendEncourageEmail(event);
    }

}
