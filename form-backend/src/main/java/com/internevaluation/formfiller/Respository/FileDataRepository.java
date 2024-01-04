package com.internevaluation.formfiller.Respository;

import com.dropbox.core.v2.files.FileStatus;
import com.internevaluation.formfiller.Model.FileData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

public interface FileDataRepository extends JpaRepository<FileData,Long> {

    @Query("SELECT f FROM FileData f WHERE f.isVerified = false")
    List<FileData> findByIsVerifiedFalse();

    List<FileData> findByUserUserId(String userId);

    @Query("SELECT COUNT(f) FROM FileData f where f.isExists=true")
    long countExistingFiles();

    @Query("SELECT f FROM FileData f WHERE f.status = :status AND f.isExists = true")
    List<FileData> findByStatus(@Param("status") String status);


    @Query("SELECT COUNT(f) FROM FileData f WHERE f.status = 'Approved' AND f.isExists = true")
    long countByStatusApproved();

    @Query("SELECT COUNT(f) FROM FileData f WHERE f.status = 'Pending' AND f.isExists = true")
    long countByStatusPending();

    @Query("SELECT COUNT(f) FROM FileData f WHERE f.status = 'Rejected' AND f.isExists = true")
    long countByStatusRejected();



    List<FileData> findByStatusAndCreationDate(String status, LocalDateTime creationDate);

    List<FileData> findByStatusAndRejectionDate(String status, LocalDateTime rejectionDate);

}