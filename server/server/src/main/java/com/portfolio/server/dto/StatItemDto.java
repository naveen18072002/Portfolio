package com.portfolio.server.dto;

public class StatItemDto {
    private Long id;
    private String icon;
    private String value;
    private String label;
    private String text;

    public StatItemDto() {}

    public StatItemDto(Long id, String icon, String value, String label, String text) {
        this.id = id;
        this.icon = icon;
        this.value = value;
        this.label = label;
        this.text = text;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
}
