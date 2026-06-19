package com.durvankur.servicecomplaintsystem.service.impl;

import com.durvankur.servicecomplaintsystem.dto.ComplaintCountResponse;
import com.durvankur.servicecomplaintsystem.dto.ComplaintRequest;
import com.durvankur.servicecomplaintsystem.dto.ComplaintResponse;
import com.durvankur.servicecomplaintsystem.entity.Complaint;
import com.durvankur.servicecomplaintsystem.entity.ComplaintStatus;
import com.durvankur.servicecomplaintsystem.entity.Priority;
import com.durvankur.servicecomplaintsystem.entity.User;
import com.durvankur.servicecomplaintsystem.exception.EntityNotFoundException;
import com.durvankur.servicecomplaintsystem.repository.ComplaintRepository;
import com.durvankur.servicecomplaintsystem.service.ComplaintService;
import com.durvankur.servicecomplaintsystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ComplaintServiceImpl implements ComplaintService {

	private final ComplaintRepository complaintRepository;
	private final UserService userService;

	@Override
	@Transactional
	public ComplaintResponse createComplaint(ComplaintRequest request, String userEmail) {
		User user = userService.getUserByEmail(userEmail);

		Complaint complaint = Complaint.builder()
				.title(request.getTitle())
				.description(request.getDescription())
				.status(request.getStatus() != null ? request.getStatus() : ComplaintStatus.OPEN)
				.priority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM)
				.createdBy(user)
				.build();

		return mapToResponse(complaintRepository.save(complaint));
	}

	@Override
	@Transactional(readOnly = true)
	public ComplaintResponse getComplaintById(Long id) {
		Complaint complaint = complaintRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Complaint not found with id: " + id));
		return mapToResponse(complaint);
	}

	@Override
	@Transactional(readOnly = true)
	public Page<ComplaintResponse> getAllComplaints(
			ComplaintStatus status,
			Priority priority,
			Long userId,
			Pageable pageable) {

		Page<Complaint> complaints;

		if (userId != null) {
			complaints = complaintRepository.findByCreatedByUserId(userId, pageable);
		} else if (status != null) {
			complaints = complaintRepository.findByStatus(status, pageable);
		} else if (priority != null) {
			complaints = complaintRepository.findByPriority(priority, pageable);
		} else {
			complaints = complaintRepository.findAll(pageable);
		}

		return complaints.map(this::mapToResponse);
	}

	@Override
	@Transactional
	public ComplaintResponse updateComplaint(Long id, ComplaintRequest request) {
		Complaint complaint = complaintRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Complaint not found with id: " + id));

		complaint.setTitle(request.getTitle());
		complaint.setDescription(request.getDescription());

		if (request.getStatus() != null) {
			complaint.setStatus(request.getStatus());
		}
		if (request.getPriority() != null) {
			complaint.setPriority(request.getPriority());
		}

		return mapToResponse(complaintRepository.save(complaint));
	}

	@Override
	@Transactional
	public void deleteComplaint(Long id) {
		if (!complaintRepository.existsById(id)) {
			throw new EntityNotFoundException("Complaint not found with id: " + id);
		}
		complaintRepository.deleteById(id);
	}

	@Override
	@Transactional(readOnly = true)
	public ComplaintCountResponse countComplaintsByStatus(ComplaintStatus status) {
		long count = complaintRepository.countByStatus(status);
		return ComplaintCountResponse.builder()
				.status(status.name())
				.count(count)
				.build();
	}

	private ComplaintResponse mapToResponse(Complaint complaint) {
		User createdBy = complaint.getCreatedBy();

		return ComplaintResponse.builder()
				.id(complaint.getId())
				.title(complaint.getTitle())
				.description(complaint.getDescription())
				.status(complaint.getStatus())
				.priority(complaint.getPriority())
				.createdAt(complaint.getCreatedAt())
				.updatedAt(complaint.getUpdatedAt())
				.createdBy(ComplaintResponse.UserSummary.builder()
						.id(createdBy.getId())
						.name(createdBy.getName())
						.email(createdBy.getEmail())
						.build())
				.build();
	}
}
