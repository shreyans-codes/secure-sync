package com.internevaluation.formfiller.Model;

import java.util.List;

public class EmailRequestDTO {
    private List<String> recipientEmails;
    private Long fileId;

    public Long getFileId() {
        return fileId;
    }

    public List<String> getRecipientEmails() {
        return recipientEmails;
    }
    public void setRecipientEmails(List<String> recipientEmails) {
        this.recipientEmails = recipientEmails;
    }

}
