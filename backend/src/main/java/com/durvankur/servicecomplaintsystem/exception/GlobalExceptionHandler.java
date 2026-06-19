package com.durvankur.servicecomplaintsystem.exception;

import com.durvankur.servicecomplaintsystem.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(EntityNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleEntityNotFound(EntityNotFoundException ex) {
		return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
		return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
	}

	@ExceptionHandler({BadCredentialsException.class, UsernameNotFoundException.class})
	public ResponseEntity<ErrorResponse> handleAuthenticationFailure(RuntimeException ex) {
		return buildResponse(HttpStatus.UNAUTHORIZED, "Invalid email or password");
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
		String message = ex.getBindingResult().getFieldErrors().stream()
				.map(FieldError::getDefaultMessage)
				.collect(Collectors.joining(", "));
		return buildResponse(HttpStatus.BAD_REQUEST, message);
	}

	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<ErrorResponse> handleRuntime(RuntimeException ex) {
		return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
	}

	private ResponseEntity<ErrorResponse> buildResponse(HttpStatus status, String message) {
		ErrorResponse error = ErrorResponse.builder()
				.status(status.value())
				.message(message)
				.timestamp(System.currentTimeMillis())
				.build();
		return ResponseEntity.status(status).body(error);
	}
}
