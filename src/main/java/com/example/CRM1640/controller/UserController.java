package com.example.CRM1640.controller;

import com.example.CRM1640.dto.request.AcceptTermsRequest;
import com.example.CRM1640.dto.response.TermsStatusResponse;
import com.example.CRM1640.service.interfaces.TermService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    private final TermService service;

    @GetMapping("/me/terms-status")
    public TermsStatusResponse getMyTermsStatus() {
        return service.getMyTermsStatus();
    }

    @PostMapping("/accept-terms")
    public void acceptTerms(@RequestBody AcceptTermsRequest request) {
        service.acceptTerms(request);
    }
}
