package com.example.springbackend.algoritmus;

import com.example.springbackend.entity.KlucoveSlovo;

public class KeyWordRecommendation implements Comparable<KeyWordRecommendation>{

    private KlucoveSlovo keyword;
    private Double value;

    KeyWordRecommendation(KlucoveSlovo keyword, Double value){
        this.keyword = keyword;
        this.value = value;
    }
    @Override
    public int compareTo(KeyWordRecommendation o) {
        return -Double.compare(value,o.value);
    }

    @Override
    public boolean equals(Object other){
        return ((KeyWordRecommendation)other).value == value;
    }

    public KlucoveSlovo getKeyword() {
        return keyword;
    }

    public Double getValue() {
        return value;
    }
}
