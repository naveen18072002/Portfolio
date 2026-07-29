package com.portfolio.server.dto;

import java.util.List;

public class ServiceItemDto {
    private Long id;
    private String title;
    private String icon;
    private String text;
    private List<String> tags;

    public ServiceItemDto() {}

    public ServiceItemDto(Long id, String title, String icon, String text, List<String> tags) {
        this.id = id;
        this.title = title;
        this.icon = icon;
        this.text = text;
        this.tags = tags;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
}
