package com.example.springbackend.entity;

import org.springframework.web.multipart.MultipartFile;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "zaznamy")
public class Zaznam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;



    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "zaznam_id",referencedColumnName = "id")
    private List<PodujatieKalendar> udalosti;


    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "id_kategorie")
    private Kategoria kategoria;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "zaznam_id",referencedColumnName = "id")
    private List<ExterneLinky> externeLinky;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "zaznam_id",referencedColumnName = "id")
    private List<Priloha> prilohy;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "pociatocne_id",referencedColumnName = "id")
    private List<InterneLinky> interneLinky;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "zaznam_id",referencedColumnName = "id")
    private List<Komentar> komentare;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "zaznam_id",referencedColumnName = "id")
    private List<Hodnota> hodnoty;

    @ManyToMany(cascade = CascadeType.MERGE)
    @JoinTable( name= "zaznamy_slova",
            joinColumns = {@JoinColumn(name = "zaznam_id")},
            inverseJoinColumns = {@JoinColumn(name = "kluc_id")})
    private List<KlucoveSlovo> klucoveSlova;

    public Zaznam() {

    }

    public Zaznam(Kategoria kategoria,List<PodujatieKalendar> udalosti, List<ExterneLinky> externeLinky, List<Priloha> prilohy, List<InterneLinky> interneLinky,
                  List<Komentar> komentare, List<KlucoveSlovo> klucoveSlova, List<Hodnota> hodnoty) {

        this.kategoria = kategoria;
        this.hodnoty = hodnoty;
        this.externeLinky = externeLinky;
        this.prilohy = prilohy;
        this.interneLinky = interneLinky;
        this.komentare = komentare;
        this.klucoveSlova = klucoveSlova;
        this.udalosti = udalosti;
    }


    public long getId() {
        return id;
    }
    public void setId(long id) {
        this.id = id;
    }

    public Kategoria getKategoria() {
        return kategoria;
    }

    public void setKategoria(Kategoria kategoria) {
        this.kategoria = kategoria;
    }

    public List<ExterneLinky> getExterneLinky() {
        return externeLinky;
    }

    public void setExterneLinky(List<ExterneLinky> externeLinky) {
        this.externeLinky = externeLinky;
    }

    public List<Priloha> getPrilohy() {
        return prilohy;
    }

    public void setPrilohy(List<Priloha> prilohy) {
        this.prilohy = prilohy;
    }

    public List<InterneLinky> getInterneLinky() {
        return interneLinky;
    }

    public void setInterneLinky(List<InterneLinky> interneLinky) {
        this.interneLinky = interneLinky;
    }

    public List<Komentar> getKomentare() {
        return komentare;
    }

    public void setKomentare(List<Komentar> komentare) {
        this.komentare = komentare;
    }

    public List<KlucoveSlovo> getKlucoveSlova() {
        return klucoveSlova;
    }

    public void setKlucoveSlova(List<KlucoveSlovo> klucoveSlova) {
        this.klucoveSlova = klucoveSlova;
    }


    public List<Hodnota> getHodnoty() {
        return hodnoty;
    }
    public void setHodnoty(List<Hodnota> hodnoty) {
        this.hodnoty = hodnoty;
    }

    public List<PodujatieKalendar> getUdalosti() {
        return udalosti;
    }

    public void setUdalosti(List<PodujatieKalendar> udalosti) {
        this.udalosti = udalosti;
    }
}
