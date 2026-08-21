package com.portfolio.server.service;

import com.portfolio.server.dto.ContactMessageDto;
import com.portfolio.server.entity.ContactMessageEntity;
import com.portfolio.server.repository.ContactMessageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ContactMessageService {

    private static final Logger log = LoggerFactory.getLogger(ContactMessageService.class);

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
                dto.getMobile(),
                dto.getMessage()
        );
        ContactMessageEntity saved = contactMessageRepository.save(entity);

        // Send email notification to Admin asynchronously in background (non-blocking)
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            try {
                emailService.sendContactNotificationEmail(adminEmail, dto.getFullname(), dto.getEmail(), dto.getMobile(), dto.getMessage());
            } catch (Exception e) {
                log.error("Contact saved to DB (id={}), but async email notification to {} failed",
                        saved.getId(), adminEmail, e);
            }
        });

        return new ContactMessageDto(
                saved.getId(),
                saved.getFullname(),
                saved.getEmail(),
                saved.getMobile(),
                saved.getMessage(),
                saved.getCreatedAt(),
                saved.getIsRead()
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
                    e.getMobile(),
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

    @Transactional(readOnly = true)
    public boolean replyToMessage(Long id, String replyBody) {
        return contactMessageRepository.findById(id).map(entity -> {
            emailService.sendReplyEmail(entity.getEmail(), entity.getFullname(), replyBody, entity.getMessage());
            return true;
        }).orElse(false);
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
