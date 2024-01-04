package com.internevaluation.formfiller.Respository;

import com.internevaluation.formfiller.Model.ArtefactFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtefactRepository extends JpaRepository<ArtefactFile, Long> {
}
