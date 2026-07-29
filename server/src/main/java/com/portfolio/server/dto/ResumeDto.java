package com.portfolio.server.dto;

import java.util.ArrayList;
import java.util.List;

public class ResumeDto {
    private List<EducationDto> education = new ArrayList<>();
    private List<ExperienceInternshipDto> experiences = new ArrayList<>();
    private List<ExperienceInternshipDto> internships = new ArrayList<>();
    private List<AcademicProjectDto> academicProjects = new ArrayList<>();
    private List<SkillDto> skills = new ArrayList<>();

    public ResumeDto() {}

    public ResumeDto(List<EducationDto> education, List<ExperienceInternshipDto> experiences, List<ExperienceInternshipDto> internships, List<AcademicProjectDto> academicProjects, List<SkillDto> skills) {
        if (education != null) this.education = education;
        if (experiences != null) this.experiences = experiences;
        if (internships != null) this.internships = internships;
        if (academicProjects != null) this.academicProjects = academicProjects;
        if (skills != null) this.skills = skills;
    }

    public List<EducationDto> getEducation() {
        return education;
    }

    public void setEducation(List<EducationDto> education) {
        this.education = education;
    }

    public List<ExperienceInternshipDto> getExperiences() {
        return experiences;
    }

    public void setExperiences(List<ExperienceInternshipDto> experiences) {
        this.experiences = experiences;
    }

    public List<ExperienceInternshipDto> getInternships() {
        return internships;
    }

    public void setInternships(List<ExperienceInternshipDto> internships) {
        this.internships = internships;
    }

    public List<AcademicProjectDto> getAcademicProjects() {
        return academicProjects;
    }

    public void setAcademicProjects(List<AcademicProjectDto> academicProjects) {
        this.academicProjects = academicProjects;
    }

    public List<SkillDto> getSkills() {
        return skills;
    }

    public void setSkills(List<SkillDto> skills) {
        this.skills = skills;
    }
}
