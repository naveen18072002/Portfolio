package com.portfolio.server.repository;

import com.portfolio.server.entity.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {
    List<ServiceEntity> findAllByOrderByDisplayOrderAsc();
}
