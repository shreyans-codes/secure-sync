package com.internevaluation.formfiller.Respository;

import com.internevaluation.formfiller.Model.StatisticsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatisticsRepository extends JpaRepository<StatisticsEntity, Long> {
    // You can add custom query methods if needed
}

