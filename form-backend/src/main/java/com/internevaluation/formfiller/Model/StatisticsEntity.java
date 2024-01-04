package com.internevaluation.formfiller.Model;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class StatisticsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private long noUsers;
    private long noFiles;
    private long noApproved;
    private long noPending;
    private long noRejected;

    // Constructors
    public StatisticsEntity() {
        // Default constructor
    }

    public StatisticsEntity(long noUsers, long noFiles, long noApproved, long noPending, long noRejected) {
        this.noUsers = noUsers;
        this.noFiles = noFiles;
        this.noApproved = noApproved;
        this.noPending = noPending;
        this.noRejected = noRejected;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public long getNoUsers() {
        return noUsers;
    }

    public void setNoUsers(long noUsers) {
        this.noUsers = noUsers;
    }

    public long getNoFiles() {
        return noFiles;
    }

    public void setNoFiles(long noFiles) {
        this.noFiles = noFiles;
    }

    public long getNoApproved() {
        return noApproved;
    }

    public void setNoApproved(long noApproved) {
        this.noApproved = noApproved;
    }

    public long getNoPending() {
        return noPending;
    }

    public void setNoPending(long noPending) {
        this.noPending = noPending;
    }

    public long getNoRejected() {
        return noRejected;
    }

    public void setNoRejected(long noRejected) {
        this.noRejected = noRejected;
    }
// Getters and setters
    // ...
}
