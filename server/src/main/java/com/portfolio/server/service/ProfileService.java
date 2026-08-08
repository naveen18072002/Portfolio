package com.portfolio.server.service;

import com.portfolio.server.dto.ContactItemDto;
import com.portfolio.server.dto.ProfileDto;
import com.portfolio.server.dto.SocialItemDto;
import com.portfolio.server.entity.ContactEntity;
import com.portfolio.server.entity.ProfileEntity;
import com.portfolio.server.entity.SocialEntity;
import com.portfolio.server.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    @Transactional(readOnly = true)
    @Cacheable(value = "profile")
    public ProfileDto getProfile() {
        List<ProfileEntity> profiles = profileRepository.findAll();
        if (profiles.isEmpty()) {
            return null;
        }
        return convertToDto(profiles.get(0));
    }

    @Transactional
    @CacheEvict(value = "profile", allEntries = true)
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

        // Update contacts
        entity.getContacts().clear();
        if (dto.getContacts() != null) {
            for (ContactItemDto cDto : dto.getContacts()) {
                ContactEntity cEntity = new ContactEntity(
                        cDto.getTitle(),
                        cDto.getIcon(),
                        cDto.getValue(),
                        cDto.getType(),
                        cDto.getHref(),
                        cDto.getDatetime()
                );
                cEntity.setProfile(entity);
                entity.getContacts().add(cEntity);
            }
        }

        // Update socials
        entity.getSocials().clear();
        if (dto.getSocials() != null) {
            for (SocialItemDto sDto : dto.getSocials()) {
                SocialEntity sEntity = new SocialEntity(
                        sDto.getName(),
                        sDto.getIcon(),
                        sDto.getUrl()
                );
                sEntity.setProfile(entity);
                entity.getSocials().add(sEntity);
            }
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

        List<ContactItemDto> contactsList = new ArrayList<>();
        if (entity.getContacts() != null) {
            for (ContactEntity c : entity.getContacts()) {
                contactsList.add(new ContactItemDto(
                        c.getTitle(),
                        c.getIcon(),
                        c.getValue(),
                        c.getType(),
                        c.getHref(),
                        c.getDatetime()
                ));
            }
        }
        dto.setContacts(contactsList);

        List<SocialItemDto> socialsList = new ArrayList<>();
        if (entity.getSocials() != null) {
            for (SocialEntity s : entity.getSocials()) {
                socialsList.add(new SocialItemDto(
                        s.getName(),
                        s.getIcon(),
                        s.getUrl()
                ));
            }
        }
        dto.setSocials(socialsList);

        return dto;
    }
}
