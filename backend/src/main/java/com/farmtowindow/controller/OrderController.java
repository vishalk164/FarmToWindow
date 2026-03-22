package com.farmtowindow.controller;

import com.farmtowindow.dto.OrderDto.OrderRequest;
import com.farmtowindow.dto.OrderDto.OrderResponse;
import com.farmtowindow.entity.OrderStatus;
import com.farmtowindow.security.CustomUserDetails;
import com.farmtowindow.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PreAuthorize("hasAuthority('CUSTOMER')")
    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(
            @RequestBody OrderRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(orderService.placeOrder(request, userDetails.getId()));
    }

    @PreAuthorize("hasAuthority('CUSTOMER')")
    @GetMapping("/my")
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(orderService.getOrdersForCustomer(userDetails.getId()));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'FARMER')")
    @GetMapping("/all")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'FARMER')")
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    @PreAuthorize("hasAuthority('FARMER')")
    @PutMapping("/{id}/supplier/{supplierId}")
    public ResponseEntity<OrderResponse> assignSupplier(
            @PathVariable Long id,
            @PathVariable Long supplierId) {
        return ResponseEntity.ok(orderService.assignSupplier(id, supplierId));
    }
}
