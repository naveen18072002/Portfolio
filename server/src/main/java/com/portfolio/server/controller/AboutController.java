package com.portfolio.server.controller;

import com.portfolio.server.dto.AboutDto;
import com.portfolio.server.service.AboutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/about")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AboutController {

    @Autowired
    private AboutService aboutService;

    @GetMapping
    public ResponseEntity<AboutDto> getAbout() {
        return ResponseEntity.ok()
                .header("Cache-Control", "public, max-age=300, s-maxage=600")
                .body(aboutService.getAbout());
    }

    @PostMapping
    public ResponseEntity<AboutDto> saveAbout(@RequestBody AboutDto dto) {
        return ResponseEntity.ok(aboutService.saveAbout(dto));
    }

    @PutMapping
    public ResponseEntity<AboutDto> updateAbout(@RequestBody AboutDto dto) {
        return ResponseEntity.ok(aboutService.saveAbout(dto));
    }
}
