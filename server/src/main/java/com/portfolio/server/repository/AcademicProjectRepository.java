package com.portfolio.server.repository;

import com.portfolio.server.entity.AcademicProjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AcademicProjectRepository extends JpaRepository<AcademicProjectEntity, Long> {
}
