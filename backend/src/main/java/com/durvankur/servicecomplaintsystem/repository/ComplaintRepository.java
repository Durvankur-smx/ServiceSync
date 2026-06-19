package com.durvankur.servicecomplaintsystem.repository;

import com.durvankur.servicecomplaintsystem.entity.Complaint;
import com.durvankur.servicecomplaintsystem.entity.ComplaintStatus;
import com.durvankur.servicecomplaintsystem.entity.Priority;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

	@Query("SELECT c FROM Complaint c WHERE c.status = :status")
	Page<Complaint> findByStatus(@Param("status") ComplaintStatus status, Pageable pageable);

	@Query("SELECT c FROM Complaint c WHERE c.priority = :priority")
	Page<Complaint> findByPriority(@Param("priority") Priority priority, Pageable pageable);

	@Query("SELECT COUNT(c) FROM Complaint c WHERE c.status = :status")
	long countByStatus(@Param("status") ComplaintStatus status);

	@Query("SELECT c FROM Complaint c WHERE c.createdBy.id = :userId")
	Page<Complaint> findByCreatedByUserId(@Param("userId") Long userId, Pageable pageable);
}
