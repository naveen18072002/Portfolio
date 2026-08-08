package com.portfolio.server.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "PORTFOLIO_PROJECT")
public class ProjectEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "TITLE", nullable = false)
    private String title;

    @Column(name = "CATEGORY")
    private String category;

    @Column(name = "ICON")
    private String icon;

    @Lob
    @Column(name = "DESCRIPTION", columnDefinition = "TEXT")
    private String description;

    @Column(name = "TAGS", length = 1000)
    private String tags;

    @Lob
    @Column(name = "IMAGE", columnDefinition = "TEXT")
    private String image;

    @Column(name = "DEMO_LINK", length = 1000)
    private String demoLink;

    @Column(name = "GITHUB_LINK", length = 1000)
    private String githubLink;

    public ProjectEntity() {}

    public ProjectEntity(String title, String category, String icon, String description, String tags, String image, String demoLink, String githubLink) {
        this.title = title;
        this.category = category;
        this.icon = icon;
        this.description = description;
        this.tags = tags;
        this.image = image;
        this.demoLink = demoLink;
        this.githubLink = githubLink;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
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
