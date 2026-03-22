package com.farmtowindow.service;

import com.farmtowindow.dto.SupplierDto;
import com.farmtowindow.entity.Supplier;
import com.farmtowindow.entity.User;
import com.farmtowindow.repository.SupplierRepository;
import com.farmtowindow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final UserRepository userRepository;

    public SupplierDto addSupplier(SupplierDto dto, Long farmerId) {
        User farmer = userRepository.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        Supplier supplier = Supplier.builder()
                .name(dto.getName())
                .contactNumber(dto.getContactNumber())
                .vehicleDetails(dto.getVehicleDetails())
                .farmer(farmer)
                .build();

        return mapToDto(supplierRepository.save(supplier));
    }

    public List<SupplierDto> getSuppliersByFarmer(Long farmerId) {
        return supplierRepository.findByFarmerId(farmerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public void deleteSupplier(Long id, Long farmerId) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        if (!supplier.getFarmer().getId().equals(farmerId)) {
            throw new RuntimeException("Unauthorized to delete this supplier");
        }

        supplierRepository.delete(supplier);
    }

    private SupplierDto mapToDto(Supplier supplier) {
        return SupplierDto.builder()
                .id(supplier.getId())
                .name(supplier.getName())
                .contactNumber(supplier.getContactNumber())
                .vehicleDetails(supplier.getVehicleDetails())
                .farmerId(supplier.getFarmer().getId())
                .createdAt(supplier.getCreatedAt())
                .build();
    }
}
