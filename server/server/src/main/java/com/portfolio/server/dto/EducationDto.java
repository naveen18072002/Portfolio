package com.portfolio.server.dto;

public class EducationDto {
    private String degree;
    private String institution;
    private String detail;
    private String period;

    public EducationDto() {}

    public EducationDto(String degree, String institution, String detail, String period) {
        this.degree = degree;
        this.institution = institution;
        this.detail = detail;
        this.period = period;
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
