package com.farmtowindow.service;

import com.farmtowindow.dto.AdminStatsDto;
import com.farmtowindow.dto.UserProfileDto;
import com.farmtowindow.entity.Order;
import com.farmtowindow.entity.User;
import com.farmtowindow.repository.OrderRepository;
import com.farmtowindow.repository.ProductRepository;
import com.farmtowindow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public AdminStatsDto getDashboardStats() {
        List<User> users = userRepository.findAll();
        long totalFarmers = users.stream().filter(u -> u.getRole().name().equals("FARMER")).count();
        long totalCustomers = users.stream().filter(u -> u.getRole().name().equals("CUSTOMER")).count();
        
        List<Order> orders = orderRepository.findAll();
        BigDecimal totalRevenue = orders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return AdminStatsDto.builder()
                .totalUsers(users.size())
                .totalFarmers(totalFarmers)
                .totalCustomers(totalCustomers)
                .totalProducts(productRepository.count())
                .totalOrders(orders.size())
                .totalRevenue(totalRevenue)
                .build();
    }

    public List<UserProfileDto> getAllUsers() {
        return userRepository.findAll().stream().map(user -> UserProfileDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .phone(user.getPhone())
                .address(user.getAddress())
                .build()).collect(Collectors.toList());
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
}
