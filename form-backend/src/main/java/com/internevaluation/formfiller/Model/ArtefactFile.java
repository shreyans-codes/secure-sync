package com.internevaluation.formfiller.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArtefactFile {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long artefactId;
    private String artefactPath;
}
