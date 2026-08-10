package com.portfolio.server.controller;

import com.portfolio.server.dto.PortfolioDto;
import com.portfolio.server.service.AboutService;
import com.portfolio.server.service.ProfileService;
import com.portfolio.server.service.ProjectService;
import com.portfolio.server.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PortfolioController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private AboutService aboutService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ResumeService resumeService;

    /**
     * Combined endpoint that returns all portfolio data in a single response.
     * This eliminates 4 separate HTTP round trips from the frontend.
     */
    @GetMapping("/portfolio")
    public ResponseEntity<PortfolioDto> getAllPortfolioData() {
        PortfolioDto portfolio = new PortfolioDto(
            profileService.getProfile(),
            aboutService.getAbout(),
            projectService.getAllProjects(),
            resumeService.getResume()
        );
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(5, TimeUnit.MINUTES).cachePublic())
                .body(portfolio);
    }
}
