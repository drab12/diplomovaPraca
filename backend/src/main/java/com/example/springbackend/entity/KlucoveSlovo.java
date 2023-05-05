package com.example.springbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "klucove_slova")
public class KlucoveSlovo {

    public KlucoveSlovo(){

    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nazov")
    private String nazovKlucovehoSlova;

    @Column(name = "idRodica")
    private Long idRodica;

    @ManyToMany( cascade = CascadeType.MERGE,mappedBy = "klucoveSlova")
    @JsonIgnore
    private List<Zaznam> zaznamy;

    public KlucoveSlovo(String nazovKlucovehoSlova, Long idRodica) {
        this.nazovKlucovehoSlova = nazovKlucovehoSlova;
        this.idRodica = idRodica;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }



    public Long getIdRodica() {
        return idRodica;
    }

    public void setIdRodica(Long idRodica) {
        this.idRodica = idRodica;
    }

    public String getNazovKlucovehoSlova() {
        return nazovKlucovehoSlova;
    }

    public void setNazovKlucovehoSlova(String nazovKlucovehoSlova) {
        this.nazovKlucovehoSlova = nazovKlucovehoSlova;
    }

    public List<Zaznam> getZaznamy() {
        return zaznamy;
    }

    public void setZaznamy(List<Zaznam> zaznamy) {
        this.zaznamy = zaznamy;
    }

}
