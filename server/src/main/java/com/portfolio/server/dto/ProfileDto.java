package com.portfolio.server.dto;

import java.util.List;

public class ProfileDto {
    private String name;
    private String title;
    private String avatarUrl;
    private String resumeLink;
    private Boolean availableForWork = true;
    private List<ContactItemDto> contacts;
    private List<SocialItemDto> socials;

    public ProfileDto() {}

    public ProfileDto(String name, String title, String avatarUrl, String resumeLink, List<ContactItemDto> contacts, List<SocialItemDto> socials) {
        this.name = name;
        this.title = title;
        this.avatarUrl = avatarUrl;
        this.resumeLink = resumeLink;
        this.contacts = contacts;
        this.socials = socials;
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

    public List<ContactItemDto> getContacts() {
        return contacts;
    }

    public void setContacts(List<ContactItemDto> contacts) {
        this.contacts = contacts;
    }

    public List<SocialItemDto> getSocials() {
        return socials;
    }

    public void setSocials(List<SocialItemDto> socials) {
        this.socials = socials;
    }
}
