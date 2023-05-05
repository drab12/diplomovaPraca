package com.example.springbackend.controller;

import com.example.springbackend.DopytNebolNajdeny;
import com.example.springbackend.entity.Kategoria;
import com.example.springbackend.entity.Zaznam;
import com.example.springbackend.repozitare.KategoriaRepozitar;
import com.example.springbackend.repozitare.ZaznamRepozitar;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 100000)
@RestController
@RequestMapping("/api/")
public class KategoriaController {

    @Autowired
    private KategoriaRepozitar kategoriaRepozitar;

    @GetMapping("/kategorie")
    public List<Kategoria> getKategorie(){
        return kategoriaRepozitar.findAll();
    }

    @GetMapping("/kategorie/{id}")
    public ResponseEntity<Kategoria> getKategoriaById(@PathVariable Long id) {
        Kategoria kategoria = kategoriaRepozitar.findById(id)
                .orElseThrow(() -> new DopytNebolNajdeny("Kategoria s id  neexistuje:" + id));
        return ResponseEntity.ok(kategoria);
    }

    @PostMapping("/kategorie")
    public List<Kategoria> vytvorKategoriu(@RequestBody Kategoria kategoria) {
        kategoriaRepozitar.save(kategoria);
        return getKategorie();
    }

    @PutMapping("/kategorie/{id}")
    public ResponseEntity<Kategoria> updateKategoria(@PathVariable Long id, @RequestBody Kategoria updateKategoria ){
        Kategoria kategoria = kategoriaRepozitar.findById(id)
                .orElseThrow(() -> new DopytNebolNajdeny("Kategoria s id  neexistuje:" + id));
        kategoria.setNazov(updateKategoria.getNazov());
        kategoria.setNazovHtml(updateKategoria.getNazovHtml());
        kategoria.setAtributy(updateKategoria.getAtributy());
        kategoriaRepozitar.save(kategoria);
        return ResponseEntity.ok(kategoria);
    }


}
