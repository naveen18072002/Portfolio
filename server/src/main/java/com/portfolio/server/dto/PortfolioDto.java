package com.portfolio.server.dto;

import java.util.List;

public class PortfolioDto {
    private ProfileDto profile;
    private AboutDto about;
    private List<ProjectDto> projects;
    private ResumeDto resume;

    public PortfolioDto() {}

    public PortfolioDto(ProfileDto profile, AboutDto about, List<ProjectDto> projects, ResumeDto resume) {
        this.profile = profile;
        this.about = about;
        this.projects = projects;
        this.resume = resume;
    }

    public ProfileDto getProfile() { return profile; }
    public void setProfile(ProfileDto profile) { this.profile = profile; }

    public AboutDto getAbout() { return about; }
    public void setAbout(AboutDto about) { this.about = about; }

    public List<ProjectDto> getProjects() { return projects; }
    public void setProjects(List<ProjectDto> projects) { this.projects = projects; }

    public ResumeDto getResume() { return resume; }
    public void setResume(ResumeDto resume) { this.resume = resume; }
}
