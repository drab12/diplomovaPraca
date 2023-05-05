package com.example.springbackend.entity;

import javax.persistence.*;

@Entity
@Table(name= "komentare")
public class Komentar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "obsah")
    private String obsah;


    public Komentar(){}

    public Komentar(String obsah) {
        this.obsah = obsah;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getObsah() {
        return obsah;
    }

    public void setObsah(String obsah) {
        this.obsah = obsah;
    }
}
