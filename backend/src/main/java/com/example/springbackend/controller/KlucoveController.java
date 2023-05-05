package com.example.springbackend.controller;

import com.example.springbackend.algoritmus.Algoritmus;
import com.example.springbackend.DopytNebolNajdeny;
import com.example.springbackend.StromKlucovychSlov;
import com.example.springbackend.Vrchol;
import com.example.springbackend.entity.*;
import com.example.springbackend.repozitare.KlucoveSlovoRepozitar;
import com.example.springbackend.repozitare.OdporucaneRepozitar;
import com.example.springbackend.repozitare.ZaznamRepozitar;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 100000)
@RestController
@RequestMapping("/api/")
public class KlucoveController {

    @Autowired
    private KlucoveSlovoRepozitar klucoveSlovoRepozitar;
    @Autowired
    private ZaznamRepozitar zaznamRepozitar;
    @Autowired
    private OdporucaneRepozitar odporucaneRepozitar;


    @GetMapping("/klucove")
    public List<Vrchol> getKlucoveSlova(){
        StromKlucovychSlov strom = new StromKlucovychSlov(klucoveSlovoRepozitar.findAll(Sort.by(Sort.Direction.ASC, "nazovKlucovehoSlova")));
        return strom.vytvorStrom();
    }

    @GetMapping("/klucove/list")
    public List<KlucoveSlovo> getListKlucoveSlova(){
        return klucoveSlovoRepozitar.findAll(Sort.by(Sort.Direction.ASC, "nazovKlucovehoSlova"));
    }

    @PostMapping("/klucove")
    public List<Vrchol> vytvorKlucoveSlovo(@RequestBody KlucoveSlovo klucoveSlovo) {
        klucoveSlovoRepozitar.save(klucoveSlovo);
        return getKlucoveSlova();
    }
    @PutMapping("/klucove")
    public ResponseEntity<Boolean> updateKlucoveSlova( @RequestBody KlucoveSlovo [] klucoveSlova){
        for(int i=0; i<klucoveSlova.length; i++) {
            long idcko = klucoveSlova[i].getId();
            KlucoveSlovo klucoveSlovo = klucoveSlovoRepozitar.findById(idcko)
                    .orElseThrow(() -> new DopytNebolNajdeny("Klucove slovo s id  neexistuje:" + idcko));
            klucoveSlovo.setNazovKlucovehoSlova(klucoveSlova[i].getNazovKlucovehoSlova());
            klucoveSlovoRepozitar.save(klucoveSlovo);
        }
        return ResponseEntity.ok(true);
    }
    @DeleteMapping("/klucove/{id}")
    public ResponseEntity<Boolean> vymazKlucoveSlova(@PathVariable Long [] id){
        for(int i=0; i<id.length; i++) {
            long idcko = id[i];
            klucoveSlovoRepozitar.vymazSlovo(idcko);
            KlucoveSlovo klucoveSlovo = klucoveSlovoRepozitar.findById(idcko)
                    .orElseThrow(() -> new DopytNebolNajdeny("Klucove slovo s id  neexistuje:" + idcko));

            klucoveSlovoRepozitar.delete(klucoveSlovo);
        }
        return ResponseEntity.ok(true);
    }

    @PostMapping("/klucove/odporucane")
    public List<KlucoveSlovo> getOdporucane(@RequestBody Zaznam zaznam){

       // System.out.println("Zaznam s nazvom " + zaznam.getHodnoty().get(0).getHodnota());
        OdporucaneNastavenia o = getOdporucaneNastavenia((long)1);
        long atributId = o.getAtributId();
        long kategoriaId = o.getKategoriaId();
        long pocetOdporuanych = o.getPocetOdporucanych();
        List<Zaznam> zaznamy;
        List<KlucoveSlovo> list = new ArrayList<>();
        if(zaznam.getHodnoty() != null) {
            if (kategoriaId != -1) {
                zaznamy = zaznamRepozitar.getZaznamKategoria(kategoriaId);
            } else {
                zaznamy = zaznamRepozitar.findAll();
            }
            Algoritmus odporucaj = new Algoritmus(zaznamy, zaznam, atributId,(int)pocetOdporuanych);
            list = odporucaj.run();
            return list;
        }
        else{
            return list;
        }
    }
    @GetMapping("/odporucane/{id}")
    public OdporucaneNastavenia getOdporucaneNastavenia(@PathVariable Long id) {
        OdporucaneNastavenia nastavenia = odporucaneRepozitar.findById(id)
                .orElseThrow(() -> new DopytNebolNajdeny("Kategoria s id  neexistuje:" + id));
        return nastavenia;
    }

    @PutMapping("/odporucane/{id}")
    public ResponseEntity<OdporucaneNastavenia> nastavOdporucane(@PathVariable Long id, @RequestBody OdporucaneNastavenia nastav){
       OdporucaneNastavenia odporucane = odporucaneRepozitar.findById(id)
                .orElseThrow(() -> new DopytNebolNajdeny("Zaznam s id  neexistuje:" + id));
        odporucane.setAtributId(nastav.getAtributId());
        odporucane.setKategoriaId(nastav.getKategoriaId());
        odporucane.setpocetOdporucanych(nastav.getPocetOdporucanych());
        odporucaneRepozitar.save(odporucane);
        return ResponseEntity.ok(odporucane);
    }



}
