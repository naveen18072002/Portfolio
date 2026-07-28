package com.portfolio.server.dto;

import java.util.List;

public class AcademicProjectDto {
    private String title;
    private String badge;
    private String icon;
    private String description;
    private List<String> tags;
    private List<String> features;

    public AcademicProjectDto() {}

    public AcademicProjectDto(String title, String badge, String icon, String description, List<String> tags, List<String> features) {
        this.title = title;
        this.badge = badge;
        this.icon = icon;
        this.description = description;
        this.tags = tags;
        this.features = features;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBadge() {
        return badge;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public List<String> getFeatures() {
        return features;
    }

    public void setFeatures(List<String> features) {
        this.features = features;
    }
}
