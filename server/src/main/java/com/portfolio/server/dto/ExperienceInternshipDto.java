package com.portfolio.server.dto;

public class ExperienceInternshipDto {
    private String title;
    private String role;
    private String period;
    private String text;
    private String type; // "EXPERIENCE" or "INTERNSHIP"

    public ExperienceInternshipDto() {}

    public ExperienceInternshipDto(String title, String role, String period, String text, String type) {
        this.title = title;
        this.role = role;
        this.period = period;
        this.text = text;
        this.type = type;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
