package ITS.com.vn.assessment_service.controller;

import ITS.com.vn.assessment_service.dto.request.ExamConfigRequest;
import ITS.com.vn.assessment_service.dto.response.ExamConfigResponse;
import ITS.com.vn.assessment_service.service.ExamConfigService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/exams")
@RequiredArgsConstructor
public class ExamConfigController {

    private final ExamConfigService examConfigService;

    @PostMapping
    public ResponseEntity<ExamConfigResponse> createExamConfig(@Valid @RequestBody ExamConfigRequest request) {
        return ResponseEntity.ok(examConfigService.createExamConfig(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExamConfigResponse> updateExamConfig(@PathVariable Long id,
            @Valid @RequestBody ExamConfigRequest request) {
        return ResponseEntity.ok(examConfigService.updateExamConfig(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamConfigResponse> getExamConfig(@PathVariable Long id) {
        return ResponseEntity.ok(examConfigService.getExamConfig(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExamConfig(@PathVariable Long id) {
        examConfigService.deleteExamConfig(id);
        return ResponseEntity.noContent().build();
    }
}
