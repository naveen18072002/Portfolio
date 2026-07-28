package com.portfolio.server.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "CONTACT_MESSAGES")
public class ContactMessageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "FULLNAME", nullable = false)
    private String fullname;

    @Column(name = "EMAIL", nullable = false)
    private String email;

    @Lob
    @Column(name = "MESSAGE", nullable = false)
    private String message;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    public ContactMessageEntity() {}

    public ContactMessageEntity(String fullname, String email, String message) {
        this.fullname = fullname;
        this.email = email;
        this.message = message;
        this.createdAt = LocalDateTime.now();
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
