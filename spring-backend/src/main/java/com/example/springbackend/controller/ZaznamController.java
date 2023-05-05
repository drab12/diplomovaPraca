package com.example.springbackend.controller;

import com.example.springbackend.DopytNebolNajdeny;
import com.example.springbackend.entity.*;
import com.example.springbackend.repozitare.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.IOException;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import com.example.springbackend.entity.Zaznam;
import com.example.springbackend.entity.Priloha;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 100000)
@RestController
@RequestMapping("/api/")
public class ZaznamController {

    @PersistenceContext
    private EntityManager entityManager;
    @Autowired
    private ZaznamRepozitar zaznamRepozitar;
    @Autowired
    private KategoriaRepozitar kategoriaRepozitar;
    @Autowired
    private AtributRepozitar atributRepozitar;
    @Autowired
    private PrilohaRepozitar prilohaRepozitar;

    @GetMapping("/zaznamy")
    public List<Zaznam> getZaznamy(){
        return zaznamRepozitar.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    @GetMapping("/zaznamy/{id}")
    public ResponseEntity<Zaznam> getZaznamById(@PathVariable Long id) {
        Zaznam zaznam = zaznamRepozitar.findById(id)
                .orElseThrow(() -> new DopytNebolNajdeny("Zaznam s id  neexistuje:" + id));
        return ResponseEntity.ok(zaznam);
    }
    @PostMapping("/zaznamy")
    public Zaznam vytvorZaznam(@RequestBody Zaznam zaznam) {
        return zaznamRepozitar.save(zaznam);
    }

    @PutMapping("/zaznamy/{id}")
    public ResponseEntity<Zaznam> updateZaznam(@PathVariable Long id, @RequestBody Zaznam updateZaznam){
        Zaznam zaznam = zaznamRepozitar.findById(id)
                .orElseThrow(() -> new DopytNebolNajdeny("Zaznam s id  neexistuje:" + id));
        zaznam.setHodnoty(updateZaznam.getHodnoty());
        zaznam.setKlucoveSlova(updateZaznam.getKlucoveSlova());
        zaznam.setExterneLinky(updateZaznam.getExterneLinky());
        zaznam.setInterneLinky(updateZaznam.getInterneLinky());
        zaznam.setKomentare(updateZaznam.getKomentare());
        zaznam.setPrilohy(updateZaznam.getPrilohy());
        zaznam.setUdalosti(updateZaznam.getUdalosti());
        zaznamRepozitar.save(zaznam);
        return ResponseEntity.ok(zaznam);
    }
    @DeleteMapping("/zaznamy/{id}")
    public ResponseEntity<Boolean> vymazZaznam(@PathVariable Long id){
        Zaznam zaznam = zaznamRepozitar.findById(id)
                .orElseThrow(() -> new DopytNebolNajdeny("Zaznam s id  neexistuje:" + id));

        zaznamRepozitar.delete(zaznam);
        return ResponseEntity.ok(true);
    }
    @GetMapping("/zaznamy/odkazyna/{id}")
    public List<Zaznam> getOdkazyNa( @PathVariable Long id){
        return zaznamRepozitar.getOdkazyNa(id);
    }

    @GetMapping("/zaznamy/odkazyod/{id}")
    public List<Zaznam> getOdkazyOd( @PathVariable Long id){
        return zaznamRepozitar.getOdkazyOd(id);
    }

    @GetMapping("/zaznamy/kategoria/{id}")
    public List<Zaznam> getZaznamKategoria(@PathVariable Long id){
        return zaznamRepozitar.getZaznamKategoria(id);
    }

    @GetMapping("/zaznamy/hladane/{vyraz}")
    public List<Zaznam> getZaznamHladane(@PathVariable String vyraz  ){
        return zaznamRepozitar.getHladaneZaznamy(vyraz);
    }

    @GetMapping("/zaznamy/hladane/poznamky/{vyraz}")
    public List<Zaznam> getZaznamHladanePoznamky(@PathVariable String vyraz  ){
        return zaznamRepozitar.getHladaneZaznamyPoznamky(vyraz);
    }

    @GetMapping("/zaznamy/hladane/cnf/{vyraz}")
    public List<Zaznam> getZaznamyHladaneCNF(@PathVariable String vyraz  ){
        //System.out.println(vyraz);
        List<Zaznam> vrat = new ArrayList<>();
        List<Object> obj = (List<Object>) entityManager.createNativeQuery(vyraz).getResultList();
        for(int i=0; i < obj.size();i++){
            BigInteger cislo = (BigInteger) obj.get(i);
            long id = cislo.longValueExact();
            Zaznam zaznam = zaznamRepozitar.findById(id)
                    .orElseThrow(() -> new DopytNebolNajdeny("Zaznam s id  neexistuje:" + id));
            vrat.add(zaznam);
        }
        return vrat;
    }
    @GetMapping("/zaznamy/subor/{id}")
    public ResponseEntity<Resource> stiahniSubor( @PathVariable Long id){
        Priloha priloha = prilohaRepozitar.findById(id)
                .orElseThrow(() -> new DopytNebolNajdeny("Priloha s id  neexistuje:" + id));
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(priloha.getTyp()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + priloha.getNazov() + "\"")
                .body(new ByteArrayResource(priloha.getData()));
    }
    @PostMapping("/subor" )
    public ResponseEntity<Zaznam>  vytvorSubor( @RequestParam("file") MultipartFile[] subor, @RequestParam("id") Long id) throws IOException {
        Zaznam zaznam = zaznamRepozitar.findById(id)
                .orElseThrow(() -> new DopytNebolNajdeny("Zaznam s id  neexistuje:" + id));
        List<Priloha> pa = zaznam.getPrilohy();
        for(int i=0; i< subor.length;i++) {
            Priloha p = new Priloha();
            p.setNazov(subor[i].getOriginalFilename());
            p.setData(subor[i].getBytes());
            p.setTyp(subor[i].getContentType());
            p.setVelkost(subor[i].getSize());
            pa.add(p);
        }
        zaznam.setPrilohy(pa);
        zaznamRepozitar.save(zaznam);
        return ResponseEntity.ok(zaznam);
    }
    @DeleteMapping("/kategoria/{id}")
    public ResponseEntity<Boolean> vymazKategoriu(@PathVariable Long [] id){
        for(int i=0; i<id.length; i++) {
            long idcko = id[i];
            List <Zaznam> vymazane =  zaznamRepozitar.getZaznamKategoria(idcko);
            for(int j=0; j< vymazane.size();j++){
                vymazZaznam(vymazane.get(j).getId());
            }
            Kategoria kategoria = kategoriaRepozitar.findById(idcko)
                    .orElseThrow(() -> new DopytNebolNajdeny("Kategoria s id  neexistuje:" + idcko));
            kategoriaRepozitar.delete(kategoria);
        }
        return ResponseEntity.ok(true);
    }
    @PutMapping("/pridajatributy/{id}")
    public ResponseEntity<Boolean> pridajAtributy( @RequestParam("pocet") int pocet,@PathVariable Long id){
        List<Zaznam> zaznamy = zaznamRepozitar.getZaznamKategoria(id);
        Kategoria kat = kategoriaRepozitar.findById(id)
                .orElseThrow(() -> new DopytNebolNajdeny("Kategoria s id  neexistuje:" + id));
        List<Atribut> atributy = kat.getAtributy();
        List<Hodnota> pridane = new ArrayList<>();
        int idcko = atributy.size() - pocet;
        for(int i=0; i< pocet;i++){
            pridane.add(new Hodnota("",atributy.get(idcko).getId()));
            if(atributy.get(idcko).getTyp().equals("date")){
                pridane.add(new Hodnota("",atributy.get(idcko).getId()));
            }
            if(atributy.get(idcko).getTyp().equals("dateinterval")){
                pridane.add(new Hodnota("",atributy.get(idcko).getId()));
                pridane.add(new Hodnota("",atributy.get(idcko).getId()));
            }
            idcko++;
        }
        for(Zaznam z: zaznamy) {
            List<Hodnota> h = z.getHodnoty();
            h.addAll(pridane);
            z.setHodnoty(h);
            zaznamRepozitar.save(z);
        }
         return ResponseEntity.ok(true);
    }
    @DeleteMapping("/vymazatributy/{id}")
    public ResponseEntity<Boolean> vymazAtributy(@PathVariable Long [] id){
        for(int i=0; i<id.length; i++) {
            long idcko = id[i];
            kategoriaRepozitar.vymazHodnoty(idcko);
            Atribut atribut = atributRepozitar.findById(idcko)
                    .orElseThrow(() -> new DopytNebolNajdeny("Atribut s id  neexistuje:" + idcko));
            atributRepozitar.delete(atribut);
        }
        return ResponseEntity.ok(true);
    }
}
