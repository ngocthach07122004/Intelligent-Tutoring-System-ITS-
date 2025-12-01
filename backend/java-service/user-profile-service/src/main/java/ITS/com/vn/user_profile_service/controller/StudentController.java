package ITS.com.vn.user_profile_service.controller;

import ITS.com.vn.user_profile_service.dto.student.*;
import ITS.com.vn.user_profile_service.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()") // Allow any authenticated user for now, or refine permissions
    public ResponseEntity<Student> getStudentProfile(@PathVariable UUID id) {
        return ResponseEntity.ok(studentService.getStudentProfile(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Student> updateStudentProfile(@PathVariable UUID id, @RequestBody Student studentDto) {
        return ResponseEntity.ok(studentService.updateStudentProfile(id, studentDto));
    }

    @GetMapping("/{id}/academic-history")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AcademicRecord>> getStudentAcademicHistory(@PathVariable UUID id) {
        return ResponseEntity.ok(studentService.getStudentAcademicHistory(id));
    }

    @GetMapping("/{id}/analytics")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<LearningAnalytics> getStudentAnalytics(
            @PathVariable UUID id,
            @RequestParam(required = false, defaultValue = "semester") String timeframe) {
        return ResponseEntity.ok(studentService.getStudentAnalytics(id, timeframe));
    }

    @GetMapping("/{id}/subjects/{subjectId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CurrentSubject> getStudentSubject(
            @PathVariable UUID id,
            @PathVariable String subjectId) {
        return ResponseEntity.ok(studentService.getStudentSubject(id, subjectId));
    }

    @GetMapping("/{id}/subjects")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CurrentSubject>> getStudentSubjects(@PathVariable UUID id) {
        return ResponseEntity.ok(studentService.getStudentSubjects(id));
    }

    @GetMapping("/{id}/achievements")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Achievement>> getStudentAchievements(@PathVariable UUID id) {
        return ResponseEntity.ok(studentService.getStudentAchievements(id));
    }
}
