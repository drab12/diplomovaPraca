package com.example.springbackend.algoritmus;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class JNLA {

    String slovo1;
    String slovo2;
    int velkostSlovo1;
    int velkostSlovo2;
    Set<Character> s1 ;
    Set<Character> s2 ;
    Set<Character> zjednotenie ;

    public JNLA(){

    }

    public void urobPole(){

        if(slovo1 != null && slovo2 != null ) {
             velkostSlovo1 = slovo1.length();
             velkostSlovo2 = slovo2.length();

            for (int i = 0; i < velkostSlovo1; i++) {
                zjednotenie.add(slovo1.charAt(i));
                s1.add(slovo1.charAt(i));
            }


            for (int i = 0; i < velkostSlovo2; i++) {
                s2.add(slovo2.charAt(i));
                zjednotenie.add(slovo2.charAt(i));
            }
        }

    }


    public double jacard(){
        Set<Character> prienik = new HashSet<>();
        prienik.addAll(s2);
        prienik.retainAll(s1);
        double vysl = 0;
        vysl = (double) prienik.size()/zjednotenie.size();
        return  vysl;
    }

    public double ngram(){
        List<String> prvy = new ArrayList<>();
        List<String> druhy = new ArrayList<>();

            prvy.add(" " + slovo1.charAt(0));
            for (int i = 0; i < velkostSlovo1 - 1; i++) {
                prvy.add("" + slovo1.charAt(i) + slovo1.charAt(i+1));
            }
            prvy.add(slovo1.charAt(velkostSlovo1-1) + " ");


            druhy.add(" " + slovo2.charAt(0));
            for (int i = 0; i < velkostSlovo2 - 1; i++) {
                druhy.add("" + slovo2.charAt(i) + slovo2.charAt(i+1));
            }
            druhy.add(slovo2.charAt(velkostSlovo2 -1) + " ");

        Set<String> zjednot = new HashSet<>(prvy);
        zjednot.addAll(druhy);
        Set<String> prien = new HashSet<>(prvy);
        prien.retainAll(druhy);
        double vysl =0;
        vysl = ( double) prien.size()/zjednot.size();
        return vysl;
    }

    public double vector(){
        double sum =0.0;
        List<Character> zjed = new ArrayList<>(zjednotenie);
        for(int i=0; i<zjed.size();i++){
            char aktualny = zjed.get(i);
            int pocet1=0;
            int pocet2=0;

            for(int j=0; j<velkostSlovo1;j++){
                if(aktualny == slovo1.charAt(j) ){
                    pocet1++;
                }
            }
            for(int k=0; k<velkostSlovo2;k++){
                if( aktualny == slovo2.charAt(k) ){
                    pocet2++;
                }
            }
            double prva =  (double) pocet1/velkostSlovo1;
            double druha = (double) pocet2/velkostSlovo2;
            sum= sum + Math.sqrt( (prva * druha) );
        }
        return sum;
    }

    public double dlzka(){
        int rozdiel = velkostSlovo1 - velkostSlovo2;
        double vysl =0;
        vysl = Math.exp( -Math.abs( (double) rozdiel/zjednotenie.size() ));
        return vysl;
    }

    public double jvn(String s1, String s2){
        this.slovo1 = s1;
        this.slovo2 = s2;
        urobPole();
        double j = jacard();
        double n = ngram();
        double v = vector();
        double vysl = (j+n+v)/3;
        return Math.round(vysl * 1000.0) / 1000.0;
    }

    public double jnla(String slovo1, String slovo2){
        s1 = new HashSet<>();
        s2 = new HashSet<>();
        zjednotenie = new HashSet<>();
        this.slovo1 = slovo1;
        this.slovo2 = slovo2;
        urobPole();
        double j = jacard();
        double n = ngram();
        double l = dlzka();
        double vysl = (j+n+l)/3;
        return Math.round(vysl * 1000.0) / 1000.0;
    }
}
