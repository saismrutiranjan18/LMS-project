package com.edu.lms.quiz.repository;

import com.edu.lms.quiz.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, UUID> {
    Optional<Quiz> findByLessonId(UUID lessonId);
    boolean existsByLessonId(UUID lessonId);

    // QuizRepository.java
    @Query("""
    SELECT q FROM Quiz q
    LEFT JOIN FETCH q.lesson l
    LEFT JOIN FETCH l.module m
    LEFT JOIN FETCH m.course
    WHERE q.id = :id
    """)
    Optional<Quiz> findWithLessonById(@Param("id") UUID id);
}