package com.portfolio.server.repository;

import com.portfolio.server.entity.InternshipEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InternshipRepository extends JpaRepository<InternshipEntity, Long> {
}
