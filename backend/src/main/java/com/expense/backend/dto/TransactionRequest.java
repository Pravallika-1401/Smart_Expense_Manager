package com.expense.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Data;

@Data
public class TransactionRequest {
    private Long categoryId;
    private BigDecimal amount;
    private String type;
    private LocalDate date;
    private String description;
}