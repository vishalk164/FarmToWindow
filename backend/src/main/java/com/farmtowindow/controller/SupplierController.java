package com.farmtowindow.controller;

import com.farmtowindow.dto.SupplierDto;
import com.farmtowindow.security.CustomUserDetails;
import com.farmtowindow.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @PreAuthorize("hasAuthority('FARMER')")
    @PostMapping
    public ResponseEntity<SupplierDto> addSupplier(
            @RequestBody SupplierDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(supplierService.addSupplier(dto, userDetails.getId()));
    }

    @PreAuthorize("hasAuthority('FARMER')")
    @GetMapping
    public ResponseEntity<List<SupplierDto>> getMySuppliers(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(supplierService.getSuppliersByFarmer(userDetails.getId()));
    }

    @PreAuthorize("hasAuthority('FARMER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        supplierService.deleteSupplier(id, userDetails.getId());
        return ResponseEntity.noContent().build();
    }
}
