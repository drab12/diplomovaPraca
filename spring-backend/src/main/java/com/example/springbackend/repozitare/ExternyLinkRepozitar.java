package com.example.springbackend.repozitare;

import com.example.springbackend.entity.ExterneLinky;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExternyLinkRepozitar extends JpaRepository<ExterneLinky,Long> {
}
