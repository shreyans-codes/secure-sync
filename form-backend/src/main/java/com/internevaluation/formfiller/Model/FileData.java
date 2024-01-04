package com.internevaluation.formfiller.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;


@Entity
@Table(name = "FILE_DATA")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FileData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fileId;

    private String fileName;
    private String fileType;
    private String filePath;

    @Builder.Default
    private boolean hasArtefact = false;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "artefactId")
    private ArtefactFile artefact;

    @Builder.Default
    private String status = "Pending";

    @Builder.Default
    private Boolean isVerified = false;

    @Builder.Default
    private Boolean isExists = true;

    @Builder.Default
    private String remarks = null;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime creationDate;

    @Builder.Default
    private LocalDateTime rejectionDate = null;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;


}
