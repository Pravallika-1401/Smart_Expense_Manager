package com.expense.backend.controller;

import com.expense.backend.dto.*;
import com.expense.backend.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService service;

    @PostMapping
    public ResponseEntity<TransactionResponse> add(
            @RequestBody TransactionRequest req,
            Authentication auth) {
        return ResponseEntity.ok(
            service.add(req, auth.getName()));
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getAll(
            Authentication auth) {
        return ResponseEntity.ok(
            service.getAll(auth.getName()));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<TransactionResponse>> filter(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate start,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate end,
            Authentication auth) {
        return ResponseEntity.ok(
            service.filter(auth.getName(), start, end));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            Authentication auth) {
        service.delete(id, auth.getName());
        return ResponseEntity.noContent().build();
    }
}