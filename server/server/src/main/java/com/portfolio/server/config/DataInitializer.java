package com.portfolio.server.config;

import com.portfolio.server.entity.*;
import com.portfolio.server.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private EducationRepository educationRepository;

    @Autowired
    private ExperienceInternshipRepository experienceInternshipRepository;

    @Autowired
    private AcademicProjectRepository academicProjectRepository;

    @Autowired
    private TechnicalProficiencyRepository technicalProficiencyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User(
                    "admin",
                    "naveenkumarrnk6677@gmail.com",
                    passwordEncoder.encode("Admin@123"),
                    "ROLE_ADMIN"
            );
            userRepository.save(admin);
        

                }
    }

        }
