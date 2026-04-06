package com.expense.backend.service;

import com.expense.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final TransactionRepository transactionRepo;
    private final UserRepository userRepo;

    private Long getUserId(String email) {
        return userRepo.findByEmail(email).orElseThrow().getId();
    }

    public Map<String, Object> getDashboard(String email) {
        Long uid = getUserId(email);
        BigDecimal income = transactionRepo.getTotalIncome(uid);
        BigDecimal expense = transactionRepo.getTotalExpense(uid);
        BigDecimal balance = income.subtract(expense);
        Map<String, Object> data = new HashMap<>();
        data.put("totalIncome", income);
        data.put("totalExpense", expense);
        data.put("balance", balance);
        return data;
    }

    public Map<String, BigDecimal> getCategoryAnalytics(String email) {
        Long uid = getUserId(email);
        List<Object[]> rows = transactionRepo.getCategoryTotals(uid);
        Map<String, BigDecimal> result = new LinkedHashMap<>();
        for (Object[] row : rows) {
            result.put((String) row[0], (BigDecimal) row[1]);
        }
        return result;
    }

    public List<Map<String, Object>> getMonthlyAnalytics(
            String email, int year) {
        Long uid = getUserId(email);
        List<Object[]> rows =
            transactionRepo.getMonthlyAnalytics(uid, year);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> m = new HashMap<>();
            m.put("month", row[0]);
            m.put("year", row[1]);
            m.put("type", row[2].toString());
            m.put("total", row[3]);
            result.add(m);
        }
        return result;
    }
}