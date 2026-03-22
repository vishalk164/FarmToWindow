package com.farmtowindow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SupplierDto {
    private Long id;
    private String name;
    private String contactNumber;
    private String vehicleDetails;
    private Long farmerId;
    private LocalDateTime createdAt;
}
