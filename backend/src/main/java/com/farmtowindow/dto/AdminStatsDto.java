package com.farmtowindow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminStatsDto {
    private long totalUsers;
    private long totalFarmers;
    private long totalCustomers;
    private long totalOrders;
    private BigDecimal totalRevenue;
    private long totalProducts;
}
