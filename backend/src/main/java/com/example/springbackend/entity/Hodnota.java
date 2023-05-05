package com.example.springbackend.entity;

import javax.persistence.*;

@Entity
@Table(name = "hodnoty")
public class Hodnota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "hodnota")
    private String hodnota;
    @Column(name = "atribut_id")
    private Long atributId;

    public Hodnota(){}

    public Hodnota(String hodnota, Long atributId) {
        this.hodnota = hodnota;
        this.atributId = atributId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getHodnota() {
        return hodnota;
    }

    public void setHodnota(String hodnota) {
        this.hodnota = hodnota;
    }

    public Long getAtributId() {
        return atributId;
    }

    public void setAtributId(Long atributId) {
        this.atributId = atributId;
    }
}

