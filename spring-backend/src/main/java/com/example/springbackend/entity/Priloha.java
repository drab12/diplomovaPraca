package com.example.springbackend.entity;

import javax.persistence.*;
@Entity
@Table( name = "prilohy")
public class Priloha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "nazov")
    private String nazov;

    @Column(name = "typ")
    private String typ;

    @Column(name = "velkost")
    private long velkost;

    @Lob
    private byte[] data;

    public Priloha(){

    }

    public Priloha(String nazov, String typ, long velkost, byte[] data) {
        this.nazov = nazov;
        this.typ = typ;
        this.velkost = velkost;
        this.data = data;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getNazov() {
        return nazov;
    }

    public void setNazov(String nazov) {
        this.nazov = nazov;
    }

    public String getTyp() {
        return typ;
    }

    public void setTyp(String typ) {
        this.typ = typ;
    }

    public long getVelkost() {
        return velkost;
    }

    public void setVelkost(long velkost) {
        this.velkost = velkost;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }
}
