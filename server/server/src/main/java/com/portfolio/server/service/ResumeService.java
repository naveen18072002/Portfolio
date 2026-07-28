package com.portfolio.server.service;

import com.portfolio.server.dto.*;
import com.portfolio.server.entity.*;
import com.portfolio.server.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ResumeService {

    @Autowired
    private EducationRepository educationRepository;

    @Autowired
    private ExperienceInternshipRepository experienceInternshipRepository;

    @Autowired
    private AcademicProjectRepository academicProjectRepository;

    @Autowired
    private TechnicalProficiencyRepository technicalProficiencyRepository;

    @Transactional(readOnly = true)
    public ResumeDto getResume() {
        List<EducationEntity> eduEntities = educationRepository.findAll();
        List<ExperienceInternshipEntity> expEntities = experienceInternshipRepository.findByType("EXPERIENCE");
        List<ExperienceInternshipEntity> internEntities = experienceInternshipRepository.findByType("INTERNSHIP");
        List<AcademicProjectEntity> projectEntities = academicProjectRepository.findAll();
        List<TechnicalProficiencyEntity> techEntities = technicalProficiencyRepository.findAll();

        List<EducationDto> education = new ArrayList<>();
        for (EducationEntity e : eduEntities) {
            education.add(new EducationDto(e.getDegree(), e.getInstitution(), e.getDetail(), e.getPeriod()));
        }

        List<ExperienceInternshipDto> experiences = new ArrayList<>();
        for (ExperienceInternshipEntity e : expEntities) {
            experiences.add(new ExperienceInternshipDto(e.getTitle(), e.getRole(), e.getPeriod(), e.getText(), "EXPERIENCE"));
        }

        List<ExperienceInternshipDto> internships = new ArrayList<>();
        for (ExperienceInternshipEntity i : internEntities) {
            internships.add(new ExperienceInternshipDto(i.getTitle(), i.getRole(), i.getPeriod(), i.getText(), "INTERNSHIP"));
        }

        List<AcademicProjectDto> academicProjects = new ArrayList<>();
        for (AcademicProjectEntity p : projectEntities) {
            academicProjects.add(new AcademicProjectDto(
                    p.getTitle(),
                    p.getBadge(),
                    p.getIcon(),
                    p.getDescription(),
                    new ArrayList<>(p.getTags()),
                    new ArrayList<>(p.getFeatures())
            ));
        }

        List<SkillDto> skills = new ArrayList<>();
        for (TechnicalProficiencyEntity s : techEntities) {
            skills.add(new SkillDto(s.getName(), s.getValue(), s.getIcon()));
        }

        return new ResumeDto(education, experiences, internships, academicProjects, skills);
    }

    @Transactional
    public ResumeDto saveResume(ResumeDto dto) {
        if (dto == null) {
            return getResume();
        }

        // 1. Table 1: Education
        educationRepository.deleteAll();
        if (dto.getEducation() != null) {
            for (EducationDto eDto : dto.getEducation()) {
                educationRepository.save(new EducationEntity(
                        eDto.getDegree(),
                        eDto.getInstitution(),
                        eDto.getDetail(),
                        eDto.getPeriod()
                ));
            }
        }

        // 2. Table 2: Experience and Internship
        experienceInternshipRepository.deleteAll();
        if (dto.getExperiences() != null) {
            for (ExperienceInternshipDto expDto : dto.getExperiences()) {
                experienceInternshipRepository.save(new ExperienceInternshipEntity(
                        expDto.getTitle(),
                        expDto.getRole(),
                        expDto.getPeriod(),
                        expDto.getText(),
                        "EXPERIENCE"
                ));
            }
        }
        if (dto.getInternships() != null) {
            for (ExperienceInternshipDto inDto : dto.getInternships()) {
                experienceInternshipRepository.save(new ExperienceInternshipEntity(
                        inDto.getTitle(),
                        inDto.getRole(),
                        inDto.getPeriod(),
                        inDto.getText(),
                        "INTERNSHIP"
                ));
            }
        }

        // Academic Projects
        academicProjectRepository.deleteAll();
        if (dto.getAcademicProjects() != null) {
            for (AcademicProjectDto pDto : dto.getAcademicProjects()) {
                academicProjectRepository.save(new AcademicProjectEntity(
                        pDto.getTitle(),
                        pDto.getBadge(),
                        pDto.getIcon(),
                        pDto.getDescription(),
                        pDto.getTags(),
                        pDto.getFeatures()
                ));
            }
        }

        // 3. Table 3: Technical Proficiency (Skills and Percentage)
        technicalProficiencyRepository.deleteAll();
        if (dto.getSkills() != null) {
            for (SkillDto sDto : dto.getSkills()) {
                technicalProficiencyRepository.save(new TechnicalProficiencyEntity(
                        sDto.getName(),
                        sDto.getValue(),
                        sDto.getIcon()
                ));
            }
        }

        return getResume();
    }
}
