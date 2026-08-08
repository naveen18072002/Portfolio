package com.portfolio.server.service;

import com.portfolio.server.dto.*;
import com.portfolio.server.entity.*;
import com.portfolio.server.repository.*;
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
public class AboutService {

    @Autowired
    private AboutBioRepository aboutBioRepository;

    @Autowired
    private StatSummaryRepository statSummaryRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private TechStackRepository techStackRepository;

    @Transactional(readOnly = true)
    @Cacheable(value = "about")
    public AboutDto getAbout() {
        List<AboutBioEntity> bios = aboutBioRepository.findAllByOrderByDisplayOrderAsc();
        List<StatSummaryEntity> stats = statSummaryRepository.findAllByOrderByDisplayOrderAsc();
        List<ServiceEntity> services = serviceRepository.findAllByOrderByDisplayOrderAsc();
        List<TechStackEntity> techStack = techStackRepository.findAllByOrderByDisplayOrderAsc();

        List<String> bioParagraphs = bios.stream()
                .map(AboutBioEntity::getParagraphText)
                .collect(Collectors.toList());

        List<StatItemDto> statDtos = stats.stream().map(s -> new StatItemDto(
                s.getId(), s.getIcon(), s.getValue(), s.getLabel(), s.getText()
        )).collect(Collectors.toList());

        List<ServiceItemDto> serviceDtos = services.stream().map(s -> {
            List<String> tags = s.getTags() != null && !s.getTags().trim().isEmpty()
                    ? Arrays.stream(s.getTags().split(","))
                            .map(String::trim)
                            .filter(t -> !t.isEmpty())
                            .collect(Collectors.toList())
                    : new ArrayList<>();
            return new ServiceItemDto(s.getId(), s.getTitle(), s.getIcon(), s.getText(), tags);
        }).collect(Collectors.toList());

        List<TechItemDto> techDtos = techStack.stream().map(t -> new TechItemDto(
                t.getId(), t.getName(), t.getIconClass()
        )).collect(Collectors.toList());

        return new AboutDto(bioParagraphs, statDtos, serviceDtos, techDtos);
    }

    @Transactional
    @CacheEvict(value = "about", allEntries = true)
    public AboutDto saveAbout(AboutDto dto) {
        aboutBioRepository.deleteAll();
        statSummaryRepository.deleteAll();
        serviceRepository.deleteAll();
        techStackRepository.deleteAll();

        if (dto.getBioParagraphs() != null) {
            int order = 0;
            for (String para : dto.getBioParagraphs()) {
                if (para != null && !para.trim().isEmpty()) {
                    aboutBioRepository.save(new AboutBioEntity(para.trim(), order++));
                }
            }
        }

        if (dto.getStats() != null) {
            int order = 0;
            for (StatItemDto stat : dto.getStats()) {
                statSummaryRepository.save(new StatSummaryEntity(
                        stat.getIcon(), stat.getValue(), stat.getLabel(), stat.getText(), order++
                ));
            }
        }

        if (dto.getServices() != null) {
            int order = 0;
            for (ServiceItemDto s : dto.getServices()) {
                String tagsStr = s.getTags() != null ? String.join(", ", s.getTags()) : "";
                serviceRepository.save(new ServiceEntity(
                        s.getTitle(), s.getIcon(), s.getText(), tagsStr, order++
                ));
            }
        }

        if (dto.getTechStack() != null) {
            int order = 0;
            for (TechItemDto t : dto.getTechStack()) {
                techStackRepository.save(new TechStackEntity(
                        t.getName(), t.getIconClass(), order++
                ));
            }
        }

        return getAbout();
    }
}
