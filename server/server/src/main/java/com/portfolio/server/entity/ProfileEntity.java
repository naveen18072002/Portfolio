package com.portfolio.server.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "PORTFOLIO_PROFILE")
public class ProfileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "NAME", nullable = false)
    private String name;

    @Column(name = "TITLE")
    private String title;

    @Column(name = "AVATAR_URL")
    private String avatarUrl;

    @Column(name = "RESUME_LINK", length = 1000)
    private String resumeLink;

    @Lob
    @Column(name = "CONTACTS")
    private String contactsJson;

    @Lob
    @Column(name = "SOCIALS")
    private String socialsJson;

    public ProfileEntity() {}

    public ProfileEntity(String name, String title, String avatarUrl, String resumeLink, String contactsJson, String socialsJson) {
        this.name = name;
        this.title = title;
        this.avatarUrl = avatarUrl;
        this.resumeLink = resumeLink;
        this.contactsJson = contactsJson;
        this.socialsJson = socialsJson;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getResumeLink() {
        return resumeLink;
    }

    public void setResumeLink(String resumeLink) {
        this.resumeLink = resumeLink;
    }

    public String getContactsJson() {
        return contactsJson;
    }

    public void setContactsJson(String contactsJson) {
        this.contactsJson = contactsJson;
    }

    public String getSocialsJson() {
        return socialsJson;
    }

    public void setSocialsJson(String socialsJson) {
        this.socialsJson = socialsJson;
    }
}
