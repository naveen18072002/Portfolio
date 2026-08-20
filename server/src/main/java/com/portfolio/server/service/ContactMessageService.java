package com.portfolio.server.service;

import com.portfolio.server.dto.ContactMessageDto;
import com.portfolio.server.entity.ContactMessageEntity;
import com.portfolio.server.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ContactMessageService {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @Autowired
    private EmailService emailService;

    @Value("${spring.mail.username:naveenkumarrnk6677@gmail.com}")
    private String adminEmail;

    @Transactional
    public ContactMessageDto saveAndNotify(ContactMessageDto dto) {
        ContactMessageEntity entity = new ContactMessageEntity(
                dto.getFullname(),
                dto.getEmail(),
                dto.getMessage()
        );
        entity = contactMessageRepository.save(entity);

        // Send email notification to Admin asynchronously in background (non-blocking)
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            try {
                emailService.sendContactNotificationEmail(adminEmail, dto.getFullname(), dto.getEmail(), dto.getMessage());
            } catch (Exception e) {
                System.err.println("Contact saved to DB, but async email notification failed: " + e.getMessage());
            }
        });

        return new ContactMessageDto(
                entity.getId(),
                entity.getFullname(),
                entity.getEmail(),
                entity.getMessage(),
                entity.getCreatedAt(),
                entity.getIsRead()
        );
    }

    @Transactional(readOnly = true)
    public List<ContactMessageDto> getAllMessages() {
        List<ContactMessageEntity> entities = contactMessageRepository.findAllByOrderByCreatedAtDesc();
        List<ContactMessageDto> dtoList = new ArrayList<>();
        for (ContactMessageEntity e : entities) {
            dtoList.add(new ContactMessageDto(
                    e.getId(),
                    e.getFullname(),
                    e.getEmail(),
                    e.getMessage(),
                    e.getCreatedAt(),
                    e.getIsRead()
            ));
        }
        return dtoList;
    }

    @Transactional
    public boolean toggleReadStatus(Long id, Boolean isRead) {
        return contactMessageRepository.findById(id).map(entity -> {
            entity.setIsRead(isRead != null ? isRead : !entity.getIsRead());
            contactMessageRepository.save(entity);
            return true;
        }).orElse(false);
    }

    @Transactional
    public void markAllAsRead() {
        contactMessageRepository.markAllAsRead();
    }

    @Transactional
    public boolean deleteMessage(Long id) {
        if (contactMessageRepository.existsById(id)) {
            contactMessageRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
