package com.example.springbackend.repozitare;

import com.example.springbackend.entity.Kategoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import javax.transaction.Transactional;

@Repository
public interface KategoriaRepozitar extends JpaRepository<Kategoria,Long> {

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM hodnoty h where h.atribut_id =?1", nativeQuery = true)
    void vymazHodnoty(Long id);
}
