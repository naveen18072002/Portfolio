package com.portfolio.server.repository;

import com.portfolio.server.entity.AboutBioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AboutBioRepository extends JpaRepository<AboutBioEntity, Long> {
    List<AboutBioEntity> findAllByOrderByDisplayOrderAsc();
}
