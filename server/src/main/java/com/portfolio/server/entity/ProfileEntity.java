package com.portfolio.server.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.util.ArrayList;
import java.util.List;

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

    @Lob
    @Column(name = "AVATAR_URL", columnDefinition = "LONGTEXT")
    private String avatarUrl;

    @Column(name = "RESUME_LINK", length = 1000)
    private String resumeLink;

    @Column(name = "AVAILABLE_FOR_WORK")
    private Boolean availableForWork = true;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ContactEntity> contacts = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SocialEntity> socials = new ArrayList<>();

    public ProfileEntity() {}

    public ProfileEntity(String name, String title, String avatarUrl, String resumeLink) {
        this.name = name;
        this.title = title;
        this.avatarUrl = avatarUrl;
        this.resumeLink = resumeLink;
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

    public Boolean getAvailableForWork() {
        return availableForWork == null || availableForWork;
    }

    public void setAvailableForWork(Boolean availableForWork) {
        this.availableForWork = availableForWork;
    }

    public List<ContactEntity> getContacts() {
        return contacts;
    }

    public void setContacts(List<ContactEntity> contacts) {
        this.contacts = contacts;
    }

    public List<SocialEntity> getSocials() {
        return socials;
    }

    public void setSocials(List<SocialEntity> socials) {
        this.socials = socials;
    }

    public void addContact(ContactEntity contact) {
        contacts.add(contact);
        contact.setProfile(this);
    }

    public void removeContact(ContactEntity contact) {
        contacts.remove(contact);
        contact.setProfile(null);
    }

    public void addSocial(SocialEntity social) {
        socials.add(social);
        social.setProfile(this);
    }

    public void removeSocial(SocialEntity social) {
        socials.remove(social);
        social.setProfile(null);
    }
}
