package com.portfolio.server.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "RESUME_SKILL")
public class SkillEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "NAME", nullable = false)
    private String name;

    @Column(name = "PROFICIENCY_VALUE")
    private Integer value;

    @Column(name = "ICON")
    private String icon;

    public SkillEntity() {}

    public SkillEntity(String name, Integer value, String icon) {
        this.name = name;
        this.value = value;
        this.icon = icon;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getValue() {
        return value;
    }

    public void setValue(Integer value) {
        this.value = value;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}
