package com.durvankur.servicecomplaintsystem.service;

import com.durvankur.servicecomplaintsystem.dto.ComplaintCountResponse;
import com.durvankur.servicecomplaintsystem.dto.ComplaintRequest;
import com.durvankur.servicecomplaintsystem.dto.ComplaintResponse;
import com.durvankur.servicecomplaintsystem.entity.ComplaintStatus;
import com.durvankur.servicecomplaintsystem.entity.Priority;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ComplaintService {

	ComplaintResponse createComplaint(ComplaintRequest request, String userEmail);

	ComplaintResponse getComplaintById(Long id);

	Page<ComplaintResponse> getAllComplaints(
			ComplaintStatus status,
			Priority priority,
			Long userId,
			Pageable pageable);

	ComplaintResponse updateComplaint(Long id, ComplaintRequest request);

	void deleteComplaint(Long id);

	ComplaintCountResponse countComplaintsByStatus(ComplaintStatus status);
}
