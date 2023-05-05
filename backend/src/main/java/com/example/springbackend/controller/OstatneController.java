package com.example.springbackend.controller;

import com.example.springbackend.DopytNebolNajdeny;
import com.example.springbackend.entity.*;
import com.example.springbackend.repozitare.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 100000)
@RestController
@RequestMapping("/api/")
public class OstatneController {

    @Autowired
    private KomentarRepozitar komentarRepozitar;
    @Autowired
    private ExternyLinkRepozitar externyLinkRepozitar;
    @Autowired
    private InternyLinkRepozitar internyLinkRepozitar;
    @Autowired
    private KalendarRepozitar kalendarRepozitar;
    @Autowired
    private PrilohaRepozitar prilohaRepozitar;

    @GetMapping("/kalendar")
    public List<PodujatieKalendar> getKalendar(){
        return kalendarRepozitar.findAll();
    }

    @DeleteMapping("/komentar/{id}")
    public ResponseEntity<Boolean> vymazKomentar(@PathVariable Long [] id){
        List<Komentar> komentare = new ArrayList<>();
        for(int i=0; i<id.length; i++) {
            long idcko = id[i];
            Komentar komentar = komentarRepozitar.findById(idcko)
                    .orElseThrow(() -> new DopytNebolNajdeny("Zaznam s id  neexistuje:" + idcko));
            komentare.add(komentar);
        }
        komentarRepozitar.deleteAllInBatch(() -> komentare.iterator());
        return ResponseEntity.ok(true);
    }
    @DeleteMapping("/interny/{id}")
    public ResponseEntity<Boolean> vymazInterny(@PathVariable Long [] id){
        for(int i=0; i<id.length; i++) {
            long idcko = id[i];
            InterneLinky interny = internyLinkRepozitar.findById(idcko)
                    .orElseThrow(() -> new DopytNebolNajdeny("Zaznam s id  neexistuje:" + idcko));
            internyLinkRepozitar.delete(interny);
        }
        return ResponseEntity.ok(true);
    }
    @DeleteMapping("/externy/{id}")
    public ResponseEntity<Boolean> vymazExterny(@PathVariable Long [] id){
        for(int i=0; i<id.length; i++) {
            long idcko = id[i];
            ExterneLinky externy = externyLinkRepozitar.findById(idcko)
                    .orElseThrow(() -> new DopytNebolNajdeny("Zaznam s id  neexistuje:" + idcko));
            externyLinkRepozitar.delete(externy);
        }
        return ResponseEntity.ok(true);
    }
    @DeleteMapping("/kalendar/{id}")
    public ResponseEntity<Boolean> vymazEvent(@PathVariable Long [] id){
        for(int i=0; i<id.length; i++) {
            long idcko = id[i];
            PodujatieKalendar podujatieKalendar = kalendarRepozitar.findById(idcko)
                    .orElseThrow(() -> new DopytNebolNajdeny("Zaznam s id  neexistuje:" + idcko));

            kalendarRepozitar.delete(podujatieKalendar);
        }
        return ResponseEntity.ok(true);
    }
    @DeleteMapping("/priloha/{id}")
    public ResponseEntity<Boolean> vymazPrilohu(@PathVariable Long [] id){
        for(int i=0; i<id.length; i++) {
            long idcko = id[i];
            Priloha priloha = prilohaRepozitar.findById(idcko)
                    .orElseThrow(() -> new DopytNebolNajdeny("Zaznam s id  neexistuje:" + idcko));
            prilohaRepozitar.delete(priloha);
        }
        return ResponseEntity.ok(true);
    }

}
