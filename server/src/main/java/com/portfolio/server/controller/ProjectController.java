package com.portfolio.server.controller;

import com.portfolio.server.dto.ProjectDto;
import com.portfolio.server.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping()
    public ResponseEntity<List<ProjectDto>> getAllProjects() {
        return ResponseEntity.ok()
                .header("Cache-Control", "public, max-age=300, s-maxage=600")
                .body(projectService.getAllProjects());
    }

    @PostMapping()
    public ResponseEntity<ProjectDto> saveProject(@RequestBody ProjectDto projectDto) {
        ProjectDto saved = projectService.saveProject(projectDto);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/batch")
    public ResponseEntity<List<ProjectDto>> saveAllProjects(@RequestBody List<ProjectDto> projectDtos) {
        List<ProjectDto> savedList = projectService.saveAllProjects(projectDtos);
        return ResponseEntity.ok(savedList);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
