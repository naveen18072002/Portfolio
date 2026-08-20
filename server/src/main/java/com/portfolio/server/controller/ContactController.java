package com.portfolio.server.controller;

import com.portfolio.server.dto.ApiResponse;
import com.portfolio.server.dto.ContactMessageDto;
import com.portfolio.server.service.ContactMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/contact")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ContactController {

    @Autowired
    private ContactMessageService contactMessageService;

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse> submitContactMessage(@RequestBody ContactMessageDto dto) {
        // Honeypot anti-spam verification: If honeypot is filled, discard request silently
        if (dto.getHoneypot() != null && !dto.getHoneypot().trim().isEmpty()) {
            return ResponseEntity.ok(new ApiResponse(true, "Thank you! Your message has been sent and stored successfully."));
        }

        if (dto.getFullname() == null || dto.getEmail() == null || dto.getMessage() == null) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Name, email and message are required."));
        }
        contactMessageService.saveAndNotify(dto);
        return ResponseEntity.ok(new ApiResponse(true, "Thank you! Your message has been sent and stored successfully."));
    }

    @GetMapping("/messages")
    public ResponseEntity<List<ContactMessageDto>> getAllMessages() {
        return ResponseEntity.ok(contactMessageService.getAllMessages());
    }

    @DeleteMapping("/messages/{id}")
    public ResponseEntity<ApiResponse> deleteMessage(@PathVariable Long id) {
        boolean deleted = contactMessageService.deleteMessage(id);
        if (deleted) {
            return ResponseEntity.ok(new ApiResponse(true, "Message deleted successfully."));
        } else {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Message not found."));
        }
    }
}
