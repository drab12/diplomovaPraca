package com.example.springbackend;

import com.example.springbackend.entity.KlucoveSlovo;

import java.util.ArrayList;
import java.util.List;

public class StromKlucovychSlov {

    private List<KlucoveSlovo> klucoveSlova;

    public StromKlucovychSlov (List<KlucoveSlovo> slova){
        this.klucoveSlova = slova;
    }

    public List<Vrchol> vytvorStrom(){
        List<Vrchol> zoznam = new ArrayList<>();
        List<Vrchol> vymaz = new ArrayList<>();
        for( KlucoveSlovo k: klucoveSlova){
            Vrchol vrchol = new Vrchol(k.getId(),k.getNazovKlucovehoSlova(),k.getIdRodica(), new ArrayList<>());
            zoznam.add(vrchol);
        }
        for( Vrchol i : zoznam){
            for( Vrchol j : zoznam){
                if(i.getId() != j.getId()){
                    if(j.getIdRodica() == i.getId()){
                        Vrchol dieta = new Vrchol(j.getId(),j.getNazovKlucovehoSlova(),j.getIdRodica(),j.getDeti());
                        i.pridaj(dieta);
                        vymaz.add(j);
                    }
                }
            }
        }
        for(Vrchol v: vymaz){
            if(zoznam.contains(v)){
                zoznam.remove(v);
            }
        }
        return zoznam;
    }
}
