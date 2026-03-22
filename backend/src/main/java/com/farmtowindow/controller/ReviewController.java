package com.farmtowindow.controller;

import com.farmtowindow.dto.ReviewDto;
import com.farmtowindow.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/{productId}")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<ReviewDto.ReviewResponse> addReview(
            @PathVariable Long productId,
            @RequestBody ReviewDto.ReviewRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(reviewService.addReview(productId, request, authentication.getName()));
    }

    @GetMapping("/{productId}")
    public ResponseEntity<List<ReviewDto.ReviewResponse>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId));
    }
}
