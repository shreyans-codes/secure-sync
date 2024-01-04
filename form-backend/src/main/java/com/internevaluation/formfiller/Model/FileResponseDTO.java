package com.internevaluation.formfiller.Model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class FileResponseDTO {

    private String userId;

    private FileData fileData;

    private Long fileId;

    private String fileName;

    private String status;

    private Boolean isVerified;

    private ArtefactFile artefact;
    private String remarks;


    public FileResponseDTO(Long fileId, String fileName, String status, Boolean isVerified, String userId, ArtefactFile artefact, String remarks) {
        this.fileId = fileId;
        this.fileName = fileName;
        this.status = status;
        this.isVerified = isVerified;
        this.userId = userId;
        this.artefact = artefact;
        this.remarks = remarks;
    }
}
