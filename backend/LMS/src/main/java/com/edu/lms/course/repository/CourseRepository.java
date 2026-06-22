package com.edu.lms.course.repository;

import com.edu.lms.course.entity.Course;
import com.edu.lms.course.entity.CourseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CourseRepository extends JpaRepository<Course, UUID> {

    List<Course> findByStatus(CourseStatus status);


    // CourseRepository.java
    @Query("""
    SELECT c FROM Course c
    LEFT JOIN FETCH c.modules m
    LEFT JOIN FETCH m.lessons
    WHERE c.id = :id
    """)
    Optional<Course> findWithModulesAndLessonsById(@Param("id") UUID id);
}