package com.example.springbackend.algoritmus;

import com.example.springbackend.entity.Hodnota;
import com.example.springbackend.entity.KlucoveSlovo;
import com.example.springbackend.entity.Zaznam;

import java.util.*;

/**
 * Algoritmus ktory používa sumu prvých 100 záznamov je trénovacích zvyšných 20 je testovacích
 */

public class Algoritmus {
    Map<String, Map<KlucoveSlovo,Integer>> keyWordFrequencies;
    int numberOfWordToRecomend = 10;
    List<Zaznam> zaznamy;
    Zaznam zaznam;
    List<KlucoveSlovo> odporucane;
    Long atributId;

    public Algoritmus (List<Zaznam> zaznamy, Zaznam zaznam, Long atributId, int numberOfWordToRecomend){
        this.zaznamy = zaznamy;
        this.zaznam = zaznam;
        this.keyWordFrequencies =  new HashMap<String, Map<KlucoveSlovo, Integer> >();
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
                        if (word.length() > 2) {

                            if (keyWordFrequencies.containsKey(word)) {
                                Map<KlucoveSlovo, Integer> frequencies = keyWordFrequencies.get(word);
                                for (KlucoveSlovo k : z.getKlucoveSlova()) {
                                    String keyword = k.getNazovKlucovehoSlova();
                                    if (frequencies.containsKey(k)) {
                                        frequencies.put(k, frequencies.get(k) + 1);
                                    } else if (keyword.length() > 0) {
                                        frequencies.put(k, 1);
                                    }
                                }
                            } else {
                                Map<KlucoveSlovo, Integer> frequencies = new HashMap<>();
                                keyWordFrequencies.put(word, frequencies);
                                for (KlucoveSlovo k : z.getKlucoveSlova()) {
                                    String keyword = k.getNazovKlucovehoSlova();
                                    if (keyword.length() > 0) {
                                        frequencies.put(k, 1);
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
                    if(word.length() >2){
                    if (keyWordFrequencies.containsKey(word)) {
                        Map<KlucoveSlovo, Integer> frequencies = keyWordFrequencies.get(word);
                        for (Map.Entry<KlucoveSlovo, Integer> kwf : frequencies.entrySet()) {
                            KlucoveSlovo trainedKeyWord = kwf.getKey();
                            if (recomendedKeyWords.containsKey(trainedKeyWord)) {
                                double previousKeywordRecommendationValue = recomendedKeyWords.get(trainedKeyWord);
                                recomendedKeyWords.put(trainedKeyWord, kwf.getValue() + previousKeywordRecommendationValue);
                            } else {
                                recomendedKeyWords.put(trainedKeyWord, (double) kwf.getValue());
                            }
                        }
                    }
                    else{
                        double similarity = 0;
                        double maxSimilarity = 0;
                        String slovo = "";
                        JNVA2 pod = new JNVA2();
                        for (Map.Entry<String, Map<KlucoveSlovo, Integer>> kw : keyWordFrequencies.entrySet()) {
                            similarity = pod.jnla(word, kw.getKey());
                            if (similarity > 0.67) {
                                if (similarity > maxSimilarity) {
                                    maxSimilarity = similarity;
                                    slovo = kw.getKey();
                                }
                            }
                        }
                        if (maxSimilarity > 0.67) {
                            Map<KlucoveSlovo, Integer> frequencies = keyWordFrequencies.get(slovo);
                            for (Map.Entry<KlucoveSlovo, Integer> kwf : frequencies.entrySet()) {
                                KlucoveSlovo trainedKeyWord = kwf.getKey();
                                if (recomendedKeyWords.containsKey(trainedKeyWord)) {
                                    double previousKeywordRecommendationValue = recomendedKeyWords.get(trainedKeyWord);
                                    recomendedKeyWords.put(trainedKeyWord, kwf.getValue() + previousKeywordRecommendationValue);
                                } else {
                                    recomendedKeyWords.put(trainedKeyWord, (double) kwf.getValue());
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