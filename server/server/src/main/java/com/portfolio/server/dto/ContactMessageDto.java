package com.portfolio.server.dto;

import java.time.LocalDateTime;

public class ContactMessageDto {
    private Long id;
    private String fullname;
    private String email;
    private String message;
    private LocalDateTime createdAt;

    public ContactMessageDto() {}

    public ContactMessageDto(Long id, String fullname, String email, String message, LocalDateTime createdAt) {
        this.id = id;
        this.fullname = fullname;
        this.email = email;
        this.message = message;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
