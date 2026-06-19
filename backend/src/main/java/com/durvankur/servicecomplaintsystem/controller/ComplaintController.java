package com.durvankur.servicecomplaintsystem.controller;

import com.durvankur.servicecomplaintsystem.dto.ComplaintCountResponse;
import com.durvankur.servicecomplaintsystem.dto.ComplaintRequest;
import com.durvankur.servicecomplaintsystem.dto.ComplaintResponse;
import com.durvankur.servicecomplaintsystem.entity.ComplaintStatus;
import com.durvankur.servicecomplaintsystem.entity.Priority;
import com.durvankur.servicecomplaintsystem.security.CustomUserDetails;
import com.durvankur.servicecomplaintsystem.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

	private final ComplaintService complaintService;

	@PostMapping
	public ResponseEntity<ComplaintResponse> createComplaint(
			@Valid @RequestBody ComplaintRequest request,
			@AuthenticationPrincipal CustomUserDetails userDetails) {
		ComplaintResponse response = complaintService.createComplaint(request, userDetails.getUsername());
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@GetMapping
	public ResponseEntity<Page<ComplaintResponse>> getAllComplaints(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "id") String sortBy,
			@RequestParam(required = false) ComplaintStatus status,
			@RequestParam(required = false) Priority priority,
			@RequestParam(required = false) Long userId) {

		Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
		Page<ComplaintResponse> responses = complaintService.getAllComplaints(status, priority, userId, pageable);
		return ResponseEntity.ok(responses);
	}

	@GetMapping("/count")
	public ResponseEntity<ComplaintCountResponse> countByStatus(@RequestParam ComplaintStatus status) {
		return ResponseEntity.ok(complaintService.countComplaintsByStatus(status));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ComplaintResponse> getComplaintById(@PathVariable Long id) {
		return ResponseEntity.ok(complaintService.getComplaintById(id));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ComplaintResponse> updateComplaint(
			@PathVariable Long id,
			@Valid @RequestBody ComplaintRequest request) {
		return ResponseEntity.ok(complaintService.updateComplaint(id, request));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteComplaint(@PathVariable Long id) {
		complaintService.deleteComplaint(id);
		return ResponseEntity.noContent().build();
	}
}
