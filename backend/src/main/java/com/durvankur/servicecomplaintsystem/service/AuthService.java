package com.durvankur.servicecomplaintsystem.service;

import com.durvankur.servicecomplaintsystem.dto.LoginRequest;
import com.durvankur.servicecomplaintsystem.dto.SignupRequest;
import com.durvankur.servicecomplaintsystem.dto.AuthResponse;

public interface AuthService {

	AuthResponse signup(SignupRequest request);

	AuthResponse login(LoginRequest request);
}
