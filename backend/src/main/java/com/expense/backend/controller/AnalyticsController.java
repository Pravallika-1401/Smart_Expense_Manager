package com.expense.backend.controller;

import com.expense.backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService service;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard(
            Authentication auth) {
        return ResponseEntity.ok(
            service.getDashboard(auth.getName()));
    }

    @GetMapping("/categories")
    public ResponseEntity<Map<String, BigDecimal>> categories(
            Authentication auth) {
        return ResponseEntity.ok(
            service.getCategoryAnalytics(auth.getName()));
    }

    @GetMapping("/monthly")
    public ResponseEntity<List<Map<String, Object>>> monthly(
            @RequestParam(defaultValue = "2025") int year,
            Authentication auth) {
        return ResponseEntity.ok(
            service.getMonthlyAnalytics(auth.getName(), year));
    }
}