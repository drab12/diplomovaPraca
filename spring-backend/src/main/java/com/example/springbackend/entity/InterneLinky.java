package com.example.springbackend.entity;

import javax.persistence.*;

@Entity
@Table(name = "internelinky")
public class InterneLinky {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "idCiela")
    private Long idCiela;

    @Column(name = "idKategorie")
    private Long idKategorie;

    @Column(name = "komentar")
    private String komentar;

    public InterneLinky(){

    }
    public InterneLinky(Long idCiela, Long idKategorie, String komentar) {
        this.idCiela = idCiela;
        this.idKategorie = idKategorie;
        this.komentar = komentar;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdCiela() {
        return idCiela;
    }

    public void setIdCiela(Long idCiela) {
        this.idCiela = idCiela;
    }

    public Long getIdKategorie() {
        return idKategorie;
    }
    public void setIdKategorie(Long idKategorie) {
        this.idKategorie = idKategorie;
    }

    public String getKomentar() {
        return komentar;
    }

    public void setKomentar(String komentar) {
        this.komentar = komentar;
    }
}
