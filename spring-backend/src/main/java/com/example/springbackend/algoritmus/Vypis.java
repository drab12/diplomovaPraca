package com.example.springbackend.algoritmus;

import com.example.springbackend.entity.KlucoveSlovo;

import java.util.Map;

public class Vypis {

    public void vypisMapuKeyFrequencies(Map<String, Map<KlucoveSlovo, Integer>> keyWordFrequencies ){
        int pocet =0;
        for(Map.Entry<String,Map<KlucoveSlovo, Integer>> kw: keyWordFrequencies.entrySet()) {
            pocet++;
            System.out.println(pocet + " " + kw.getKey() +" " + kw.getValue() );
            System.out.println();
            Map<KlucoveSlovo, Integer> frequencies = keyWordFrequencies.get(kw.getKey());
            for (Map.Entry<KlucoveSlovo, Integer> kwf : frequencies.entrySet()) {
                System.out.println(kwf.getKey().getNazovKlucovehoSlova() + " " +kwf.getValue());
            }
            System.out.println();
        }
    }

    public void vypisRecomendation(Map<KlucoveSlovo, Double> recomendedKeyWords){
        int pocet =0;
        for(Map.Entry<KlucoveSlovo, Double> kw: recomendedKeyWords.entrySet()) {
            pocet++;
            System.out.println(pocet + " " + kw.getKey().getNazovKlucovehoSlova() + " " + kw.getValue());
            System.out.println();
        }
    }
}
