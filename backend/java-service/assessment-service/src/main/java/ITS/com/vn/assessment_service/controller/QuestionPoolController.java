package ITS.com.vn.assessment_service.controller;

import ITS.com.vn.assessment_service.dto.request.QuestionPoolRequest;
import ITS.com.vn.assessment_service.dto.response.QuestionPoolResponse;
import ITS.com.vn.assessment_service.service.QuestionPoolService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pools")
@RequiredArgsConstructor
public class QuestionPoolController {

    private final QuestionPoolService questionPoolService;

    @PostMapping
    public ResponseEntity<QuestionPoolResponse> createPool(@Valid @RequestBody QuestionPoolRequest request) {
        return ResponseEntity.ok(questionPoolService.createPool(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionPoolResponse> updatePool(@PathVariable Long id,
            @Valid @RequestBody QuestionPoolRequest request) {
        return ResponseEntity.ok(questionPoolService.updatePool(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePool(@PathVariable Long id) {
        questionPoolService.deletePool(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionPoolResponse> getPool(@PathVariable Long id) {
        return ResponseEntity.ok(questionPoolService.getPool(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<QuestionPoolResponse>> getMyPools() {
        return ResponseEntity.ok(questionPoolService.getMyPools());
    }
}
