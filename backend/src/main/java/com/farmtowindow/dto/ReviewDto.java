package com.farmtowindow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class ReviewDto {

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ReviewRequest {
        private Integer rating;
        private String comment;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ReviewResponse {
        private Long id;
        private Integer rating;
        private String comment;
        private Long customerId;
        private String customerName;
        private LocalDateTime createdAt;
    }
}
