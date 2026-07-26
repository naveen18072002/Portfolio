package com.portfolio.server.config;

import com.portfolio.server.entity.User;
import com.portfolio.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User(
                    "admin",
                    "naveenofficial6677@gmail.com",
                    passwordEncoder.encode("Admin@123"),
                    "ROLE_ADMIN"
            );
            userRepository.save(admin);
        }
    }
}
