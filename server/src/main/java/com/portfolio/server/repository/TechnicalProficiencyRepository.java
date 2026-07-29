package com.portfolio.server.repository;

import com.portfolio.server.entity.TechnicalProficiencyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TechnicalProficiencyRepository extends JpaRepository<TechnicalProficiencyEntity, Long> {
}
