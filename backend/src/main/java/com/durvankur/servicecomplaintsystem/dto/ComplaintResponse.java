package com.durvankur.servicecomplaintsystem.dto;

import com.durvankur.servicecomplaintsystem.entity.ComplaintStatus;
import com.durvankur.servicecomplaintsystem.entity.Priority;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintResponse {

	private Long id;
	private String title;
	private String description;
	private ComplaintStatus status;
	private Priority priority;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private UserSummary createdBy;

	@Getter
	@Setter
	@NoArgsConstructor
	@AllArgsConstructor
	@Builder
	public static class UserSummary {
		private Long id;
		private String name;
		private String email;
	}
}
