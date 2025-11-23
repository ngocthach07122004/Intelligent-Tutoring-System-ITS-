package ITS.com.vn.assessment_service.controller;

import ITS.com.vn.assessment_service.dto.request.AttemptSubmitRequest;
import ITS.com.vn.assessment_service.dto.response.AttemptResultResponse;
import ITS.com.vn.assessment_service.dto.response.AttemptStartResponse;
import ITS.com.vn.assessment_service.dto.response.AttemptSubmitResponse;
import ITS.com.vn.assessment_service.service.AttemptService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AttemptController {

    private final AttemptService attemptService;

    @PostMapping("/exams/{configId}/start")
    public ResponseEntity<AttemptStartResponse> startAttempt(@PathVariable Long configId) {
        return ResponseEntity.ok(attemptService.startAttempt(configId));
    }

    @PostMapping("/attempts/{id}/submit")
    public ResponseEntity<AttemptSubmitResponse> submitAttempt(@PathVariable Long id,
            @Valid @RequestBody AttemptSubmitRequest request) {
        return ResponseEntity.ok(attemptService.submitAttempt(id, request));
    }

    @GetMapping("/attempts/{id}/result")
    public ResponseEntity<AttemptResultResponse> getAttemptResult(@PathVariable Long id) {
        return ResponseEntity.ok(attemptService.getAttemptResult(id));
    }
}
