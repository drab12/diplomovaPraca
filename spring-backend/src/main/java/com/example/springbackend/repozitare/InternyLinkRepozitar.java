package com.example.springbackend.repozitare;

import com.example.springbackend.entity.InterneLinky;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InternyLinkRepozitar extends JpaRepository <InterneLinky,Long> {
}
