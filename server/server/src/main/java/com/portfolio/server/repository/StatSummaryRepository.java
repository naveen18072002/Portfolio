package com.portfolio.server.repository;

import com.portfolio.server.entity.StatSummaryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StatSummaryRepository extends JpaRepository<StatSummaryEntity, Long> {
    List<StatSummaryEntity> findAllByOrderByDisplayOrderAsc();
}
