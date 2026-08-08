package com.portfolio.server.controller;

import com.portfolio.server.dto.ProfileDto;
import com.portfolio.server.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping()
    public ResponseEntity<ProfileDto> getProfile() {
        return ResponseEntity.ok()
                .header("Cache-Control", "public, max-age=300, s-maxage=600")
                .body(profileService.getProfile());
    }

    @PostMapping()
    public ResponseEntity<ProfileDto> saveProfile(@RequestBody ProfileDto profileDto) {
        ProfileDto updated = profileService.saveProfile(profileDto);
        return ResponseEntity.ok(updated);
    }

    @PutMapping()
    public ResponseEntity<ProfileDto> updateProfile(@RequestBody ProfileDto profileDto) {
        ProfileDto updated = profileService.saveProfile(profileDto);
        return ResponseEntity.ok(updated);
    }
}
