package com.portfolio.server.dto;

public class ContactItemDto {
    private String title;
    private String icon;
    private String value;
    private String type;
    private String href;
    private String datetime;

    public ContactItemDto() {}

    public ContactItemDto(String title, String icon, String value, String type, String href, String datetime) {
        this.title = title;
        this.icon = icon;
        this.value = value;
        this.type = type;
        this.href = href;
        this.datetime = datetime;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getHref() {
        return href;
    }

    public void setHref(String href) {
        this.href = href;
    }

    public String getDatetime() {
        return datetime;
    }

    public void setDatetime(String datetime) {
        this.datetime = datetime;
    }
}
