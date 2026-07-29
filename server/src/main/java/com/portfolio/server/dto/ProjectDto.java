package com.portfolio.server.dto;

import java.util.List;

public class ProjectDto {
    private String id;
    private String title;
    private String category;
    private String icon;
    private String description;
    private List<String> tags;
    private String image;
    private String demoLink;
    private String githubLink;

    public ProjectDto() {}

    public ProjectDto(String id, String title, String category, String icon, String description, List<String> tags, String image, String demoLink, String githubLink) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.icon = icon;
        this.description = description;
        this.tags = tags;
        this.image = image;
        this.demoLink = demoLink;
        this.githubLink = githubLink;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
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

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getDemoLink() {
        return demoLink;
    }

    public void setDemoLink(String demoLink) {
        this.demoLink = demoLink;
    }

    public String getGithubLink() {
        return githubLink;
    }

    public void setGithubLink(String githubLink) {
        this.githubLink = githubLink;
    }
}
