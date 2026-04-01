package com.example.CRM1640.service.interfaces;

import com.example.CRM1640.entities.other.IdeaEvent;

public interface EmailService {

    void sendReviewEmail(IdeaEvent event);

    void sendApprovedEmail(IdeaEvent event);

    void sendRejectedEmail(IdeaEvent event);
}
