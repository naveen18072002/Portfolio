package com.portfolio.server.dto;

public class TechItemDto {
    private Long id;
    private String name;
    private String iconClass;

    public TechItemDto() {}

    public TechItemDto(Long id, String name, String iconClass) {
        this.id = id;
        this.name = name;
        this.iconClass = iconClass;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getIconClass() { return iconClass; }
    public void setIconClass(String iconClass) { this.iconClass = iconClass; }
}
