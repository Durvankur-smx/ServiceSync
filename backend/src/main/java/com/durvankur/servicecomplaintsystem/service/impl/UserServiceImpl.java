package com.durvankur.servicecomplaintsystem.service.impl;

import com.durvankur.servicecomplaintsystem.entity.User;
import com.durvankur.servicecomplaintsystem.exception.EntityNotFoundException;
import com.durvankur.servicecomplaintsystem.repository.UserRepository;
import com.durvankur.servicecomplaintsystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	@Transactional
	public User registerUser(User user) {
		if (userRepository.existsByEmail(user.getEmail())) {
			throw new IllegalArgumentException("Email is already registered");
		}

		user.setPassword(passwordEncoder.encode(user.getPassword()));
		return userRepository.save(user);
	}

	@Override
	@Transactional(readOnly = true)
	public User getUserByEmail(String email) {
		return userRepository.findByEmail(email)
				.orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));
	}
}
