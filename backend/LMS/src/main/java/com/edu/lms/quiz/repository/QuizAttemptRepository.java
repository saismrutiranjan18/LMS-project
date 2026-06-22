package com.edu.lms.quiz.repository;

import com.edu.lms.quiz.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, UUID> {
    long countByStudentIdAndQuizId(UUID studentId, UUID quizId);
    List<QuizAttempt> findByStudentIdAndQuizIdOrderByStartedAtDesc(UUID studentId, UUID quizId);


    // QuizAttemptRepository.java
    @Query("""
    SELECT a FROM QuizAttempt a
    JOIN FETCH a.quiz
    WHERE a.student.id = :studentId AND a.quiz.id = :quizId
    ORDER BY a.startedAt DESC
    """)
    List<QuizAttempt> findWithQuizByStudentIdAndQuizId(
            @Param("studentId") UUID studentId,
            @Param("quizId") UUID quizId);
}