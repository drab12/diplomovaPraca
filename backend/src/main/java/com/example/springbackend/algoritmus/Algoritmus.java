package com.example.springbackend.algoritmus;

import com.example.springbackend.entity.Hodnota;
import com.example.springbackend.entity.KlucoveSlovo;
import com.example.springbackend.entity.Zaznam;

import java.util.*;

/**
 * Algoritmus ktory používa sumu prvých 100 záznamov je trénovacích zvyšných 20 je testovacích
 */

public class Algoritmus {
    Map<String, Map<KlucoveSlovo,List<Integer> > > keyWordFrequencies;
    int numberOfWordToRecomend = 10;
    List<Zaznam> zaznamy;
    Zaznam zaznam;
    List<KlucoveSlovo> odporucane;
    Long atributId;
    Set<String> ignoredWords = new HashSet(Arrays.asList(
            "ale", "alebo", "lebo", "aby", "keď", "keby","pretože", "keďže","kým", "pokým", "len","kde","buď",
            "kto","čiže", "keďže", "pri"));


    public Algoritmus (List<Zaznam> zaznamy, Zaznam zaznam, Long atributId, int numberOfWordToRecomend){
        this.zaznamy = zaznamy;
        this.zaznam = zaznam;
        this.keyWordFrequencies =  new HashMap<String, Map<KlucoveSlovo, List<Integer> > >();
        this.atributId = atributId;
        this.numberOfWordToRecomend = numberOfWordToRecomend;
    }

    /**
     * Táto metóda parsuje konkrétny nadpis na slová a následne každému slovu pridá kľúčové slová spolu s frekvenciou
     * naplna premennu keyWordFrequencies
     */
    public void parseLine(){
        for(Zaznam z: zaznamy) {
            for (Hodnota atribut : z.getHodnoty()) {

                if (atribut.getAtributId() != null && (atributId == -1 || atribut.getAtributId() == atributId)) {

                    String slova[] = atribut.getHodnota().split(" ");
                    for (String word : slova) {
                        if (word.length() > 2 && !ignoredWords.contains(word)) {

                            if (keyWordFrequencies.containsKey(word)) {
                                int maxVyskyt = 0;
                                Map<KlucoveSlovo, List<Integer>> frequencies = keyWordFrequencies.get(word);
                                for(Map.Entry<KlucoveSlovo,List<Integer>> kwf: frequencies.entrySet()) {
                                    boolean najdene = false;
                                    for (int i = 0; i < z.getKlucoveSlova().size(); i++) {
                                        KlucoveSlovo keyword = z.getKlucoveSlova().get(i);
                                        if(kwf.getKey().getId() == keyword.getId()){
                                            najdene = true;
                                            int previousfrekvencies = kwf.getValue().get(0);
                                            kwf.getValue().set(0,previousfrekvencies+1);
                                            frequencies.put(keyword, kwf.getValue());
                                            int vyskyt = kwf.getValue().get(0) + kwf.getValue().get(1);
                                            if(maxVyskyt < vyskyt ){
                                                maxVyskyt= vyskyt;
                                            }
                                            break;
                                        }
                                        if(i == z.getKlucoveSlova().size()-1 && !najdene){
                                            int previousfrekvencies = kwf.getValue().get(1);
                                            kwf.getValue().set(1,previousfrekvencies+1);
                                            frequencies.put(kwf.getKey(), kwf.getValue());
                                            int vyskyt = kwf.getValue().get(0) + kwf.getValue().get(1);
                                            if(maxVyskyt < vyskyt ){
                                                maxVyskyt= vyskyt;
                                            }
                                        }

                                    }
                                }
                                for (int i = 0; i < z.getKlucoveSlova().size(); i++) {
                                    KlucoveSlovo keyword = z.getKlucoveSlova().get(i);
                                    if (!frequencies.containsKey(keyword)) {
                                        if (keyword.getNazovKlucovehoSlova().length() > 0) {
                                            List<Integer> newlist = new ArrayList<>();
                                            newlist.add(1);
                                            newlist.add(maxVyskyt-1);
                                            frequencies.put(keyword, newlist);
                                        }
                                    }
                                }
                            } else {
                                Map<KlucoveSlovo, List<Integer>> frequencies = new HashMap<>();
                                keyWordFrequencies.put(word, frequencies);
                                for (KlucoveSlovo k : z.getKlucoveSlova()) {
                                    String keyword = k.getNazovKlucovehoSlova();
                                    if (keyword.length() > 0) {
                                        List<Integer> newlist = new ArrayList<>();
                                        newlist.add(1);
                                        newlist.add(0);
                                        frequencies.put(k, newlist);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }


    /**
     * V tejto metode parsujeme názov na slová
     * Potom kontroluje či sa slovo nachádza už v keyWordFrequencies Ak áno tak ho pridá
     * do zoznamu odporúčaných slov kde mu zvyšuje frekvenciu

     */
    void test(){
           /* Vypis vypis = new Vypis();
            vypis.vypisMapuKeyFrequencies(keyWordFrequencies);*/
            Map<KlucoveSlovo,Double> recomendedKeyWords = new HashMap<>();
            int score = 0;
            for(Hodnota atribut: zaznam.getHodnoty()){
                String slova [] = atribut.getHodnota().split(" ");
                for(String word: slova) {
                    if(word.length() >2 && !ignoredWords.contains(word)){
                    if (keyWordFrequencies.containsKey(word)) {
                        Map<KlucoveSlovo, List<Integer>> frequencies = keyWordFrequencies.get(word);
                        for (Map.Entry<KlucoveSlovo, List<Integer>> kwf : frequencies.entrySet()) {
                            KlucoveSlovo trainedKeyWord = kwf.getKey();
                            double pocetVyskytovSlova = kwf.getValue().get(0)+ kwf.getValue().get(1);
                            double propability = (double) kwf.getValue().get(0) / pocetVyskytovSlova;
                            if (recomendedKeyWords.containsKey(trainedKeyWord)) {
                                double previousKeywordRecommendationValue = recomendedKeyWords.get(trainedKeyWord);
                                recomendedKeyWords.put(trainedKeyWord, propability + previousKeywordRecommendationValue);
                            } else {
                                recomendedKeyWords.put(trainedKeyWord, propability);
                            }
                        }
                    }
                    else{
                        double similarity = 0;
                        double maxSimilarity = 0;
                        String slovo = "";
                        JNLA pod = new JNLA();
                        for (Map.Entry<String, Map<KlucoveSlovo, List<Integer>>> kw : keyWordFrequencies.entrySet()) {
                            similarity = pod.jnla(word, kw.getKey());
                            if (similarity > 0.67) {
                                if (similarity > maxSimilarity) {
                                    maxSimilarity = similarity;
                                    slovo = kw.getKey();
                                }
                            }
                        }
                        if (maxSimilarity > 0.67) {
                            Map<KlucoveSlovo, List<Integer>> frequencies = keyWordFrequencies.get(slovo);
                            for (Map.Entry<KlucoveSlovo, List<Integer>> kwf : frequencies.entrySet()) {
                                KlucoveSlovo trainedKeyWord = kwf.getKey();
                                double pocetVyskytovSlova = kwf.getValue().get(0)+ kwf.getValue().get(1);
                                double propability = (double) kwf.getValue().get(0) / pocetVyskytovSlova;
                                if (recomendedKeyWords.containsKey(trainedKeyWord)) {
                                    double previousKeywordRecommendationValue = recomendedKeyWords.get(trainedKeyWord);
                                    recomendedKeyWords.put(trainedKeyWord, propability + previousKeywordRecommendationValue);
                                } else {
                                    recomendedKeyWords.put(trainedKeyWord, propability);
                                }
                            }
                        }
                    }
                    }

                }
            }
            PriorityQueue<KeyWordRecommendation> keyWordRecommendations = converMaptoPriorityQueue(recomendedKeyWords);
            odporucane = new ArrayList<>();
            for(int k=0; k<numberOfWordToRecomend;k++){
                if(keyWordRecommendations.isEmpty()){
                    break;
                }
                else{
                    KeyWordRecommendation oneRecommendation =  keyWordRecommendations.poll();
                    odporucane.add(oneRecommendation.getKeyword());
                  /*  for(int j = 0; j < zaznam.getKlucoveSlova().size(); j++) {
                        if (zaznam.getKlucoveSlova().get(j).getId() ==  oneRecommendation.getKeyword().getId()){
                            score++;
                            break;
                        }
                      }*/
                }
            }
            /*  System.out.println();
              System.out.println("----------------------- " + score);
              vypis.vypisRecomendation(recomendedKeyWords);*/

    }
    public List<KlucoveSlovo> run(){
        parseLine();
        test();
        return odporucane;
    }

    public PriorityQueue<KeyWordRecommendation> converMaptoPriorityQueue(Map<KlucoveSlovo,Double> recomendedKeyWords ){
        PriorityQueue<KeyWordRecommendation> queue = new PriorityQueue<KeyWordRecommendation>();
        for(Map.Entry<KlucoveSlovo,Double> kwf: recomendedKeyWords.entrySet()){
            queue.add(new KeyWordRecommendation(kwf.getKey(),kwf.getValue()));
        }
        return queue;
    }
}