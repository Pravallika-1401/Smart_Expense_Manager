package com.expense.backend.repository;

import com.expense.backend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserIdOrderByDateDesc(Long userId);

    List<Transaction> findByUserIdAndDateBetweenOrderByDateDesc(
            Long userId, LocalDate start, LocalDate end);

    @Query("SELECT t.category.name, SUM(t.amount) FROM Transaction t " +
           "WHERE t.user.id = :uid AND t.type = 'EXPENSE' " +
           "GROUP BY t.category.name")
    List<Object[]> getCategoryTotals(@Param("uid") Long userId);

    @Query("SELECT MONTH(t.date), YEAR(t.date), t.type, SUM(t.amount) " +
           "FROM Transaction t WHERE t.user.id = :uid AND YEAR(t.date) = :year " +
           "GROUP BY MONTH(t.date), YEAR(t.date), t.type ORDER BY MONTH(t.date)")
    List<Object[]> getMonthlyAnalytics(@Param("uid") Long userId, @Param("year") int year);

    @Query("SELECT COALESCE(SUM(t.amount),0) FROM Transaction t " +
           "WHERE t.user.id = :uid AND t.type = 'INCOME'")
    java.math.BigDecimal getTotalIncome(@Param("uid") Long userId);

    @Query("SELECT COALESCE(SUM(t.amount),0) FROM Transaction t " +
           "WHERE t.user.id = :uid AND t.type = 'EXPENSE'")
    java.math.BigDecimal getTotalExpense(@Param("uid") Long userId);
}