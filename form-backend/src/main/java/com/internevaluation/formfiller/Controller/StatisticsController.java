package com.internevaluation.formfiller.Controller;

import com.internevaluation.formfiller.Model.StatisticsEntity;
import com.internevaluation.formfiller.Service.StatisticsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/statistics")
public class StatisticsController {

    private final StatisticsService statisticsService;

    private static final Logger logError = LoggerFactory.getLogger(AuthenticationController.class);


    @Autowired
    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }


    @PostMapping("/updateCounts")
    public ResponseEntity<StatisticsEntity> updateCounts() {
        try {
            StatisticsEntity updatedEntity = statisticsService.updateCounts();
            return ResponseEntity.ok(updatedEntity);
        } catch (Exception e) {
            logError.error("An unexpected error occurred during counts update", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}
