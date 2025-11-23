package ITS.com.vn.assessment_service.service.impl;

import ITS.com.vn.assessment_service.domain.entity.QuestionPool;
import ITS.com.vn.assessment_service.dto.request.QuestionPoolRequest;
import ITS.com.vn.assessment_service.dto.response.QuestionPoolResponse;
import ITS.com.vn.assessment_service.mapper.QuestionPoolMapper;
import ITS.com.vn.assessment_service.repository.QuestionPoolRepository;
import ITS.com.vn.assessment_service.service.QuestionPoolService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class QuestionPoolServiceImpl implements QuestionPoolService {

    private final QuestionPoolRepository questionPoolRepository;
    private final QuestionPoolMapper questionPoolMapper;

    @Override
    public QuestionPoolResponse createPool(QuestionPoolRequest request) {
        QuestionPool pool = questionPoolMapper.toEntity(request);
        pool.setInstructorId(getCurrentUserId());
        pool = questionPoolRepository.save(pool);
        return questionPoolMapper.toResponse(pool);
    }

    @Override
    public QuestionPoolResponse updatePool(Long id, QuestionPoolRequest request) {
        QuestionPool pool = questionPoolRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Question Pool not found"));
        // Add ownership check here if needed
        questionPoolMapper.updateEntityFromRequest(request, pool);
        pool = questionPoolRepository.save(pool);
        return questionPoolMapper.toResponse(pool);
    }

    @Override
    public void deletePool(Long id) {
        if (!questionPoolRepository.existsById(id)) {
            throw new EntityNotFoundException("Question Pool not found");
        }
        questionPoolRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public QuestionPoolResponse getPool(Long id) {
        QuestionPool pool = questionPoolRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Question Pool not found"));
        return questionPoolMapper.toResponse(pool);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuestionPoolResponse> getMyPools() {
        String userId = getCurrentUserId();
        return questionPoolRepository.findByInstructorId(userId).stream()
                .map(questionPoolMapper::toResponse)
                .collect(Collectors.toList());
    }

    private String getCurrentUserId() {
        // Placeholder for getting user ID from Security Context
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        }
        return "system"; // Fallback
    }
}
