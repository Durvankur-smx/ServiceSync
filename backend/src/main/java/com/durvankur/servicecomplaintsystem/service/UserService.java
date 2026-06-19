package com.durvankur.servicecomplaintsystem.service;

import com.durvankur.servicecomplaintsystem.entity.User;

public interface UserService {

	User registerUser(User user);

	User getUserByEmail(String email);
}
