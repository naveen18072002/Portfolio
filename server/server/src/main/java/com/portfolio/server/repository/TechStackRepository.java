package com.portfolio.server.repository;

import com.portfolio.server.entity.TechStackEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TechStackRepository extends JpaRepository<TechStackEntity, Long> {
    List<TechStackEntity> findAllByOrderByDisplayOrderAsc();
}
