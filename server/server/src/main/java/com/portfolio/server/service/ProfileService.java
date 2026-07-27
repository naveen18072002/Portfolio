package com.portfolio.server.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.server.dto.ContactItemDto;
import com.portfolio.server.dto.ProfileDto;
import com.portfolio.server.dto.SocialItemDto;
import com.portfolio.server.entity.ProfileEntity;
import com.portfolio.server.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public ProfileDto getProfile() {
        List<ProfileEntity> profiles = profileRepository.findAll();
        if (profiles.isEmpty()) {
            return null;
        }
        return convertToDto(profiles.get(0));
    }

    public ProfileDto saveProfile(ProfileDto dto) {
        List<ProfileEntity> profiles = profileRepository.findAll();
        ProfileEntity entity;
        if (profiles.isEmpty()) {
            entity = new ProfileEntity();
        } else {
            entity = profiles.get(0);
        }

        entity.setName(dto.getName());
        entity.setTitle(dto.getTitle());
        entity.setAvatarUrl(dto.getAvatarUrl());
        entity.setResumeLink(dto.getResumeLink());

        try {
            entity.setContactsJson(objectMapper.writeValueAsString(dto.getContacts() != null ? dto.getContacts() : new ArrayList<>()));
            entity.setSocialsJson(objectMapper.writeValueAsString(dto.getSocials() != null ? dto.getSocials() : new ArrayList<>()));
        } catch (Exception e) {
            e.printStackTrace();
        }

        entity = profileRepository.save(entity);
        return convertToDto(entity);
    }



    private ProfileDto convertToDto(ProfileEntity entity) {
        ProfileDto dto = new ProfileDto();
        dto.setName(entity.getName());
        dto.setTitle(entity.getTitle());
        dto.setAvatarUrl(entity.getAvatarUrl());
        dto.setResumeLink(entity.getResumeLink());

        try {
            if (entity.getContactsJson() != null && !entity.getContactsJson().isBlank()) {
                dto.setContacts(objectMapper.readValue(entity.getContactsJson(), new TypeReference<List<ContactItemDto>>() {}));
            } else {
                dto.setContacts(new ArrayList<>());
            }

            if (entity.getSocialsJson() != null && !entity.getSocialsJson().isBlank()) {
                dto.setSocials(objectMapper.readValue(entity.getSocialsJson(), new TypeReference<List<SocialItemDto>>() {}));
            } else {
                dto.setSocials(new ArrayList<>());
            }
        } catch (Exception e) {
            e.printStackTrace();
            dto.setContacts(new ArrayList<>());
            dto.setSocials(new ArrayList<>());
        }

        return dto;
    }
}
