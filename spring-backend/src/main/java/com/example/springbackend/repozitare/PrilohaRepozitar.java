package com.example.springbackend.repozitare;

import com.example.springbackend.entity.Priloha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrilohaRepozitar extends JpaRepository<Priloha,Long> {
}
