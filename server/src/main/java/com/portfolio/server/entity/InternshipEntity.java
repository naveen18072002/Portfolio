package com.portfolio.server.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "RESUME_INTERNSHIP")
public class InternshipEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "TITLE")
    private String title;

    @Column(name = "ROLE")
    private String role;

    @Column(name = "PERIOD")
    private String period;

    @Lob
    @Column(name = "DESCRIPTION_TEXT")
    private String text;

    public InternshipEntity() {}

    public InternshipEntity(String title, String role, String period, String text) {
        this.title = title;
        this.role = role;
        this.period = period;
        this.text = text;
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
