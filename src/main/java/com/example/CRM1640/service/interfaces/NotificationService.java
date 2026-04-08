package com.example.CRM1640.service.interfaces;

import org.apache.xmlbeans.impl.xb.xmlconfig.Extensionconfig;

public interface NotificationService {

    void sendEncourageEmail(Long departmentId, String message);

    void sendEncourageEmailForManager(String message);

}
