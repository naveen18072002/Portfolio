package com.portfolio.server.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "SERVICES")
public class ServiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "TITLE", length = 200)
    private String title;

    @Column(name = "ICON", length = 100)
    private String icon;

    @Column(name = "SERVICE_TEXT", columnDefinition = "TEXT")
    private String text;

    @Column(name = "TAGS", length = 1000)
    private String tags;

    @Column(name = "DISPLAY_ORDER")
    private Integer displayOrder;

    public ServiceEntity() {}

    public ServiceEntity(String title, String icon, String text, String tags, Integer displayOrder) {
        this.title = title;
        this.icon = icon;
        this.text = text;
        this.tags = tags;
        this.displayOrder = displayOrder;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}
