package com.portfolio.server.dto;

public class ExperienceDto {
    private String title;
    private String role;
    private String period;
    private String text;

    public ExperienceDto() {}

    public ExperienceDto(String title, String role, String period, String text) {
        this.title = title;
        this.role = role;
        this.period = period;
        this.text = text;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
