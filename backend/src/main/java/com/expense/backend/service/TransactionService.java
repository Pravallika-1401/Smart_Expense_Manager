package com.expense.backend.service;

import com.expense.backend.dto.*;
import com.expense.backend.entity.*;
import com.expense.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepo;
    private final UserRepository userRepo;
    private final CategoryRepository categoryRepo;

    private User getUser(String email) {
        return userRepo.findByEmail(email).orElseThrow();
    }

    private TransactionResponse toResponse(Transaction t) {
        return TransactionResponse.builder()
                .id(t.getId())
                .categoryName(t.getCategory().getName())
                .amount(t.getAmount())
                .type(t.getType().name())
                .date(t.getDate())
                .description(t.getDescription())
                .build();
    }

    public TransactionResponse add(TransactionRequest req, String email) {
        User user = getUser(email);
        Category category = categoryRepo.findById(req.getCategoryId())
                .orElseThrow(() ->
                    new RuntimeException("Category not found"));
        Transaction t = Transaction.builder()
                .user(user)
                .category(category)
                .amount(req.getAmount())
                .type(Transaction.TransactionType.valueOf(req.getType()))
                .date(req.getDate())
                .description(req.getDescription())
                .build();
        return toResponse(transactionRepo.save(t));
    }

    public List<TransactionResponse> getAll(String email) {
        return transactionRepo
                .findByUserIdOrderByDateDesc(getUser(email).getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<TransactionResponse> filter(
            String email, LocalDate start, LocalDate end) {
        return transactionRepo
                .findByUserIdAndDateBetweenOrderByDateDesc(
                    getUser(email).getId(), start, end)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public void delete(Long id, String email) {
        Transaction t = transactionRepo.findById(id).orElseThrow();
        if (!t.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }
        transactionRepo.delete(t);
    }
}