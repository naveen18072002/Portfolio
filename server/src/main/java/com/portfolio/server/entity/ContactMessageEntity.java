package com.portfolio.server.entity;

import jakarta.persistence.*;
import java.time.Instant;

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

    @Column(name = "MESSAGE", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "CREATED_AT")
    private Instant createdAt;

    @Column(name = "IS_READ")
    private Boolean isRead = false;

    public ContactMessageEntity() {}

    public ContactMessageEntity(String fullname, String email, String message) {
        this.fullname = fullname;
        this.email = email;
        this.message = message;
        this.createdAt = Instant.now();
        this.isRead = false;
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

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean getIsRead() {
        return isRead != null && isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }
}
