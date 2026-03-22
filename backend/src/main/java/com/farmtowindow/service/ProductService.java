package com.farmtowindow.service;

import com.farmtowindow.dto.ProductDto;
import com.farmtowindow.entity.Product;
import com.farmtowindow.entity.User;
import com.farmtowindow.repository.ProductRepository;
import com.farmtowindow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ProductDto addProduct(ProductDto dto, Long farmerId) {
        User farmer = userRepository.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .category(dto.getCategory())
                .quantity(dto.getQuantity())
                .imageUrl(dto.getImageUrl())
                .farmer(farmer)
                .build();

        Product savedProduct = productRepository.save(product);
        return mapToDto(savedProduct);
    }

    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ProductDto> getProductsByCategory(String category) {
        return productRepository.findByCategory(category).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ProductDto> getProductsByFarmer(Long farmerId) {
        return productRepository.findByFarmerId(farmerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToDto(product);
    }

    public ProductDto updateProduct(Long id, ProductDto dto, Long farmerId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getFarmer().getId().equals(farmerId)) {
            throw new RuntimeException("Unauthorized to update this product");
        }

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setCategory(dto.getCategory());
        product.setQuantity(dto.getQuantity());
        product.setUnit(dto.getUnit() != null ? dto.getUnit() : "kg");
        product.setImageUrl(dto.getImageUrl());

        return mapToDto(productRepository.save(product));
    }

    public void deleteProduct(Long id, Long farmerId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getFarmer().getId().equals(farmerId)) {
            throw new RuntimeException("Unauthorized to delete this product");
        }

        productRepository.delete(product);
    }

    private ProductDto mapToDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .category(product.getCategory())
                .quantity(product.getQuantity())
                .unit(product.getUnit())
                .imageUrl(product.getImageUrl())
                .farmerId(product.getFarmer().getId())
                .farmerName(product.getFarmer().getName())
                .createdAt(product.getCreatedAt())
                .build();
    }
}
