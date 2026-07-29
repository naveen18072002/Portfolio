package com.portfolio.server.dto;

import java.util.ArrayList;
import java.util.List;

public class AboutDto {
    private List<String> bioParagraphs = new ArrayList<>();
    private List<StatItemDto> stats = new ArrayList<>();
    private List<ServiceItemDto> services = new ArrayList<>();
    private List<TechItemDto> techStack = new ArrayList<>();

    public AboutDto() {}

    public AboutDto(List<String> bioParagraphs, List<StatItemDto> stats, List<ServiceItemDto> services, List<TechItemDto> techStack) {
        this.bioParagraphs = bioParagraphs != null ? bioParagraphs : new ArrayList<>();
        this.stats = stats != null ? stats : new ArrayList<>();
        this.services = services != null ? services : new ArrayList<>();
        this.techStack = techStack != null ? techStack : new ArrayList<>();
    }

    public List<String> getBioParagraphs() { return bioParagraphs; }
    public void setBioParagraphs(List<String> bioParagraphs) { this.bioParagraphs = bioParagraphs; }

    public List<StatItemDto> getStats() { return stats; }
    public void setStats(List<StatItemDto> stats) { this.stats = stats; }

    public List<ServiceItemDto> getServices() { return services; }
    public void setServices(List<ServiceItemDto> services) { this.services = services; }

    public List<TechItemDto> getTechStack() { return techStack; }
    public void setTechStack(List<TechItemDto> techStack) { this.techStack = techStack; }
}
