package com.example.springbackend.entity;

import javax.persistence.*;

@Entity
@Table(name = "enum")
public class HodnotaAtributu {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "hodnota")
    private String hodnota;

    public HodnotaAtributu(){}

    public HodnotaAtributu(String hodnota) {
        this.hodnota = hodnota;
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
}
