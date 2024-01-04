package com.internevaluation.formfiller.Model;


public class StatisticsDTO {

    private long noUsers;
    private long noFiles;
    private long noApproved;
    private long noPending;
    private long noRejected;

    // Constructors, getters, and setters...

    public StatisticsDTO() {
        // Default constructor
    }

    public StatisticsDTO(long noUsers, long noFiles, long noApproved, long noPending, long noRejected) {
        this.noUsers = noUsers;
        this.noFiles = noFiles;
        this.noApproved = noApproved;
        this.noPending = noPending;
        this.noRejected = noRejected;
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
}

