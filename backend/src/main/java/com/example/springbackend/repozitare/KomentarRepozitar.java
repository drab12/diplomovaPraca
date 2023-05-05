package com.example.springbackend.repozitare;

import com.example.springbackend.entity.Komentar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KomentarRepozitar extends JpaRepository<Komentar, Long> {
}
