package com.portfolio.server.repository;

import com.portfolio.server.entity.ContactMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessageEntity, Long> {
    List<ContactMessageEntity> findAllByOrderByCreatedAtDesc();

    @Modifying
    @Query("UPDATE ContactMessageEntity m SET m.isRead = true")
    void markAllAsRead();
}
