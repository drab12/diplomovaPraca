package com.example.springbackend.entity;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name="kategorie")
public class Kategoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "nazov")
    private String nazov;
    @Column(name = "nazovhtml")
    private String nazovHtml;

    @OneToMany(mappedBy="kategoria")
    private List<Zaznam> zaznamy;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "kategoria_id",referencedColumnName = "id")
    private List<Atribut> atributy;

    public Kategoria(){}

    public Kategoria(String nazov, String nazovHtml, List<Atribut> atributy) {
        this.nazov = nazov;
        this.nazovHtml = nazovHtml;
        this.atributy = atributy;
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

    public String getNazovHtml() {
        return nazovHtml;
    }

    public void setNazovHtml(String nazovHtml) {
        this.nazovHtml = nazovHtml;
    }

    public List<Atribut> getAtributy() {
        return atributy;
    }

    public void setAtributy(List<Atribut> atributy) {
        this.atributy = atributy;
    }
}
