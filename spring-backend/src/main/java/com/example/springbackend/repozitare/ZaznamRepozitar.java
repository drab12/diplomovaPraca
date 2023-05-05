package com.example.springbackend.repozitare;

import com.example.springbackend.entity.Priloha;
import com.example.springbackend.entity.Zaznam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ZaznamRepozitar extends JpaRepository<Zaznam, Long>{


    @Query(value = "SELECT * FROM zaznamy z join internelinky i on  z.id=i.id_ciela where i.pociatocne_id =?1", nativeQuery = true)
    List<Zaznam> getOdkazyNa(Long id);

    @Query(value = "SELECT * FROM zaznamy z join internelinky i on  z.id=i.pociatocne_id where i.id_ciela =?1", nativeQuery = true)
    List<Zaznam> getOdkazyOd(Long id);

    @Query(value = "SELECT * FROM zaznamy z where z.id_kategorie =?1", nativeQuery = true)
    List<Zaznam> getZaznamKategoria(Long id);

    @Query(value = "SELECT z.id,z.id_kategorie FROM zaznamy z join hodnoty h on  z.id=h.zaznam_id where h.hodnota LIKE %?1% group by z.id", nativeQuery = true)
    List<Zaznam> getHladaneZaznamy(String hladane);

    @Query(value = "SELECT z.id,z.id_kategorie FROM zaznamy z join komentare k on  z.id=k.zaznam_id where k.obsah LIKE %?1% group by z.id", nativeQuery = true)
    List<Zaznam> getHladaneZaznamyPoznamky(String hladane);

}