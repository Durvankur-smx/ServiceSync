package com.durvankur.servicecomplaintsystem.dto;

import com.durvankur.servicecomplaintsystem.entity.ComplaintStatus;
import com.durvankur.servicecomplaintsystem.entity.Priority;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintRequest {

	@NotBlank(message = "Title is required")
	private String title;

	@NotBlank(message = "Description is required")
	private String description;

	private ComplaintStatus status;

	private Priority priority;
}
