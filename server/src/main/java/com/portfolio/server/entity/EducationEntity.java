package com.portfolio.server.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "RESUME_EDUCATION")
public class EducationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "DEGREE", nullable = false)
    private String degree;

    @Column(name = "INSTITUTION")
    private String institution;

    @Lob
    @Column(name = "DETAIL", columnDefinition = "LONGTEXT")
    private String detail;

    @Column(name = "PERIOD")
    private String period;

    public EducationEntity() {}

    public EducationEntity(String degree, String institution, String detail, String period) {
        this.degree = degree;
        this.institution = institution;
        this.detail = detail;
        this.period = period;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }
}
