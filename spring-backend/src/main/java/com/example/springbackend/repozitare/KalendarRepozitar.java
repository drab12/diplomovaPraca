package com.example.springbackend.repozitare;

import com.example.springbackend.entity.PodujatieKalendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KalendarRepozitar extends JpaRepository<PodujatieKalendar,Long> {
}
