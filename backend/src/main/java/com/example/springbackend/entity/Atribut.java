package com.example.springbackend.entity;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "atributy")
public class Atribut {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nazov")
    private String nazov;

    @Column(name = "typ")
    private String typ;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "atribut_id",referencedColumnName = "id")
    private List<HodnotaAtributu> enumerate;


    public Atribut(){}

    public Atribut(String nazov, String typ, List<HodnotaAtributu> enumerate) {
        this.nazov = nazov;
        this.typ = typ;
        this.enumerate = enumerate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    public List<HodnotaAtributu> getEnumerate() {
        return enumerate;
    }

    public void setEnumerate(List<HodnotaAtributu> enumerate) {
        this.enumerate = enumerate;
    }
}
