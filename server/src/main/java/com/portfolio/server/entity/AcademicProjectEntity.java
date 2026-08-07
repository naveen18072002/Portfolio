package com.portfolio.server.entity;

import com.portfolio.server.util.StringListConverter;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "RESUME_ACADEMIC_PROJECT")
public class AcademicProjectEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "TITLE")
    private String title;

    @Column(name = "BADGE")
    private String badge;

    @Column(name = "ICON")
    private String icon;

    @Lob
    @Column(name = "DESCRIPTION", columnDefinition = "LONGTEXT")
    private String description;

    @Convert(converter = StringListConverter.class)
    @Column(name = "TAGS", columnDefinition = "LONGTEXT")
    private List<String> tags = new ArrayList<>();

    @Convert(converter = StringListConverter.class)
    @Column(name = "FEATURES", columnDefinition = "LONGTEXT")
    private List<String> features = new ArrayList<>();

    public AcademicProjectEntity() {}

    public AcademicProjectEntity(String title, String badge, String icon, String description, List<String> tags, List<String> features) {
        this.title = title;
        this.badge = badge;
        this.icon = icon;
        this.description = description;
        if (tags != null) this.tags = tags;
        if (features != null) this.features = features;
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
