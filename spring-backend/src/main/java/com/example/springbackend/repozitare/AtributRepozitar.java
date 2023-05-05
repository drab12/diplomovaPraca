package com.example.springbackend.repozitare;

import com.example.springbackend.entity.Atribut;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AtributRepozitar extends JpaRepository<Atribut,Long> {
}
