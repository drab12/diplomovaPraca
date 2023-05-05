package com.example.springbackend;

import java.util.List;

public class Vrchol {

    private Long id;
    private String nazovKlucovehoSlova;
    private Long idRodica;
    private List<Vrchol> deti;
    private Boolean check;


    public Vrchol(Long id, String nazovKlucovehoSlova, Long idRodica, List<Vrchol> list){
        this.id = id;
        this.nazovKlucovehoSlova = nazovKlucovehoSlova;
        this.idRodica = idRodica;
        this.deti = list;
        this.check = false;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNazovKlucovehoSlova() {
        return nazovKlucovehoSlova;
    }

    public void setNazovKlucovehoSlova(String nazovKlucovehoSlova) {
        this.nazovKlucovehoSlova = nazovKlucovehoSlova;
    }

    public Long getIdRodica() {
        return idRodica;
    }

    public void setIdRodica(Long idRodica) {
        this.idRodica = idRodica;
    }

    public List<Vrchol> getDeti() {
        return deti;
    }

    public void setDeti(List<Vrchol> deti) {
        this.deti = deti;
    }

    public Boolean getCheck() {
        return check;
    }

    public void setCheck(Boolean check) {
        this.check = check;
    }

    public void pridaj(Vrchol a){
        deti.add(a);
    }
}
