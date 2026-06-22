package com.edu.lms.module.controller;

import com.edu.lms.common.response.ApiResponse;
import com.edu.lms.module.dto.CreateModuleRequest;
import com.edu.lms.module.dto.ModuleDto;
import com.edu.lms.module.dto.UpdateModuleRequest;
import com.edu.lms.module.service.ModuleService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
public class ModuleController {

    private final ModuleService moduleService;

    @PostMapping("/{courseId}/modules")
    @Operation(summary = "create module within the course")
    public ApiResponse<ModuleDto> createModule(
            @PathVariable UUID courseId,
            @RequestBody CreateModuleRequest request) {

        return ApiResponse.success(
                "Module created",
                moduleService.createModule(
                        courseId,
                        request));
    }

    @PutMapping("/{courseId}/modules/{moduleId}")
    @Operation(summary = "update module with id")
    public ApiResponse<ModuleDto> updateModule(
            @PathVariable UUID moduleId,
            @RequestBody UpdateModuleRequest request) {

        return ApiResponse.success(
                "Module updated",
                moduleService.updateModule(
                        moduleId,
                        request));
    }

    @Operation(summary = "delete module within the course")
    @DeleteMapping("/{courseId}/modules/{moduleId}")
    public ApiResponse<String> deleteModule(
            @PathVariable UUID moduleId) {

        moduleService.deleteModule(moduleId);

        return ApiResponse.success(
                "Module deleted",
                "SUCCESS");
    }
}
