package com.durvankur.servicecomplaintsystem.service.impl;

import com.durvankur.servicecomplaintsystem.dto.AuthResponse;
import com.durvankur.servicecomplaintsystem.dto.LoginRequest;
import com.durvankur.servicecomplaintsystem.dto.SignupRequest;
import com.durvankur.servicecomplaintsystem.entity.Role;
import com.durvankur.servicecomplaintsystem.entity.User;
import com.durvankur.servicecomplaintsystem.security.CustomUserDetails;
import com.durvankur.servicecomplaintsystem.security.JwtService;
import com.durvankur.servicecomplaintsystem.service.AuthService;
import com.durvankur.servicecomplaintsystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

	private final UserService userService;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;

	@Override
	public AuthResponse signup(SignupRequest request) {
		User user = User.builder()
				.name(request.getName())
				.email(request.getEmail())
				.password(request.getPassword())
				.role(Role.USER)
				.build();

		userService.registerUser(user);

		return AuthResponse.builder()
				.message("User Registered Successfully")
				.build();
	}

	@Override
	public AuthResponse login(LoginRequest request) {
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

		CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
		String token = jwtService.generateToken(userDetails);

		return AuthResponse.builder()
				.token(token)
				.build();
	}
}
