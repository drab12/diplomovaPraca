package com.example.springbackend.entity;

import javax.persistence.*;

@Entity
@Table(name = "externlink")
public class ExterneLinky {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "url")
    private String url;

    @Column(name = "komentar")
    private String komentar;


    public ExterneLinky(){

    }

    public ExterneLinky(String url, String komentar) {
        this.url = url;
        this.komentar = komentar;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getKomentar() {
        return komentar;
    }

    public void setKomentar(String komentar) {
        this.komentar = komentar;
    }
}
