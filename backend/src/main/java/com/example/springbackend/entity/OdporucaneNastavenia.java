package com.example.springbackend.entity;


import javax.persistence.*;

@Entity
@Table(name= "odporucane")
public class OdporucaneNastavenia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "kategoriaId")
    private Long kategoriaId;
    @Column(name = "atributId")
    private Long atributId;
    @Column(name = "pocetOdporucanych")
    private Long pocetOdporucanych;



    public OdporucaneNastavenia(Long kategoriId, Long atributId, Long pocetOdporucanych) {
        this.kategoriaId = kategoriaId;
        this.atributId = atributId;
        this.pocetOdporucanych = pocetOdporucanych;
    }

    public OdporucaneNastavenia(){}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getKategoriaId() {
        return kategoriaId;
    }

    public void setKategoriaId(Long kategoriaId) {
        this.kategoriaId = kategoriaId;
    }

    public Long getAtributId() {
        return atributId;
    }

    public void setAtributId(Long atributId) {
        this.atributId = atributId;
    }

    public Long getPocetOdporucanych() {
        return pocetOdporucanych;
    }

    public void setpocetOdporucanych(Long pocetOdporucanych) {
        this.pocetOdporucanych = pocetOdporucanych;
    }
}
