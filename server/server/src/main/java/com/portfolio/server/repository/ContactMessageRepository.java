package com.portfolio.server.repository;

import com.portfolio.server.entity.ContactMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessageEntity, Long> {
    List<ContactMessageEntity> findAllByOrderByCreatedAtDesc();
}
