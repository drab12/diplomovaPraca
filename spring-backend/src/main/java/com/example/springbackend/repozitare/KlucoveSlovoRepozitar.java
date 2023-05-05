package com.example.springbackend.repozitare;

import com.example.springbackend.entity.KlucoveSlovo;
import com.example.springbackend.entity.Zaznam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface KlucoveSlovoRepozitar extends JpaRepository<KlucoveSlovo,Long> {

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM zaznamy_slova z where z.kluc_id =?1", nativeQuery = true)
    void vymazSlovo(Long id);

}
