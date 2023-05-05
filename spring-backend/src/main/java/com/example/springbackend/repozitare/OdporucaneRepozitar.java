package com.example.springbackend.repozitare;

import com.example.springbackend.entity.OdporucaneNastavenia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OdporucaneRepozitar extends JpaRepository <OdporucaneNastavenia,Long> {
}
