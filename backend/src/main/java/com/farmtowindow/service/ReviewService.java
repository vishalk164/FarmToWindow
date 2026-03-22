package com.farmtowindow.service;

import com.farmtowindow.dto.ReviewDto;
import com.farmtowindow.entity.Product;
import com.farmtowindow.entity.Review;
import com.farmtowindow.entity.User;
import com.farmtowindow.repository.ProductRepository;
import com.farmtowindow.repository.ReviewRepository;
import com.farmtowindow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReviewDto.ReviewResponse addReview(Long productId, ReviewDto.ReviewRequest request, String userEmail) {
        User customer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!customer.getRole().name().equals("CUSTOMER")) {
            throw new RuntimeException("Only customers can leave reviews");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Review review = Review.builder()
                .rating(request.getRating())
                .comment(request.getComment())
                .product(product)
                .customer(customer)
                .build();

        Review savedReview = reviewRepository.save(review);
        return mapToResponse(savedReview);
    }

    public List<ReviewDto.ReviewResponse> getProductReviews(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ReviewDto.ReviewResponse mapToResponse(Review review) {
        return ReviewDto.ReviewResponse.builder()
                .id(review.getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .customerId(review.getCustomer().getId())
                .customerName(review.getCustomer().getName())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
