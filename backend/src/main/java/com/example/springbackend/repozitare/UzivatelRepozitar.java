package com.example.springbackend.repozitare;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.springbackend.entity.Uzivatel;
@Repository
public interface UzivatelRepozitar extends JpaRepository<Uzivatel,Long> {

    Uzivatel findByUsername(String username);
}
