package com.portfolio.server.service;

import com.portfolio.server.dto.ProjectDto;
import com.portfolio.server.entity.ProjectEntity;
import com.portfolio.server.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Transactional(readOnly = true)
    @Cacheable(value = "projects")
    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    @CacheEvict(value = "projects", allEntries = true)
    public ProjectDto saveProject(ProjectDto dto) {
        ProjectEntity entity = convertToEntity(dto);
        entity = projectRepository.save(entity);
        return convertToDto(entity);
    }

    @Transactional
    @CacheEvict(value = "projects", allEntries = true)
    public List<ProjectDto> saveAllProjects(List<ProjectDto> dtoList) {
        projectRepository.deleteAll();
        List<ProjectEntity> entities = new ArrayList<>();
        if (dtoList != null) {
            for (ProjectDto dto : dtoList) {
                entities.add(convertToEntity(dto));
            }
        }
        List<ProjectEntity> saved = projectRepository.saveAll(entities);
        return saved.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Transactional
    @CacheEvict(value = "projects", allEntries = true)
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    private ProjectDto convertToDto(ProjectEntity entity) {
        List<String> tagsList = new ArrayList<>();
        if (entity.getTags() != null && !entity.getTags().isBlank()) {
            tagsList = Arrays.stream(entity.getTags().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
        }

        return new ProjectDto(
                entity.getId() != null ? entity.getId().toString() : null,
                entity.getTitle(),
                entity.getCategory(),
                entity.getIcon(),
                entity.getDescription(),
                tagsList,
                entity.getImage(),
                entity.getDemoLink(),
                entity.getGithubLink()
        );
    }

    private ProjectEntity convertToEntity(ProjectDto dto) {
        ProjectEntity entity = new ProjectEntity();
        if (dto.getId() != null && !dto.getId().isBlank()) {
            try {
                entity.setId(Long.parseLong(dto.getId()));
            } catch (NumberFormatException ignored) {}
        }
        entity.setTitle(dto.getTitle());
        entity.setCategory(dto.getCategory());
        entity.setIcon(dto.getIcon());
        entity.setDescription(dto.getDescription());
        if (dto.getTags() != null) {
            entity.setTags(String.join(", ", dto.getTags()));
        } else {
            entity.setTags("");
        }
        entity.setImage(dto.getImage());
        entity.setDemoLink(dto.getDemoLink());
        entity.setGithubLink(dto.getGithubLink());
        return entity;
    }
}
