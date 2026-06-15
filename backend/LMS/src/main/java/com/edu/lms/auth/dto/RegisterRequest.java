package com.edu.lms.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
public class RegisterRequest {

    @NotBlank
    private String email;

    @NotBlank
    private String name;

    @NotBlank
    private String providerId;

    @NotBlank
    private String avatarUrl;
}