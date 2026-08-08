package com.portfolio.server.controller;

import com.portfolio.server.dto.ResumeDto;
import com.portfolio.server.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/resume")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @GetMapping
    public ResponseEntity<ResumeDto> getResume() {
        return ResponseEntity.ok()
                .header("Cache-Control", "public, max-age=300, s-maxage=600")
                .body(resumeService.getResume());
    }

    @PostMapping
    public ResponseEntity<ResumeDto> saveResume(@RequestBody ResumeDto resumeDto) {
        ResumeDto updated = resumeService.saveResume(resumeDto);
        return ResponseEntity.ok(updated);
    }

    @PutMapping
    public ResponseEntity<ResumeDto> updateResume(@RequestBody ResumeDto resumeDto) {
        ResumeDto updated = resumeService.saveResume(resumeDto);
        return ResponseEntity.ok(updated);
    }
}
