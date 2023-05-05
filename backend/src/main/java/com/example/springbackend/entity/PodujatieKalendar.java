package com.example.springbackend.entity;

import javax.persistence.*;

@Entity
@Table(name = "kalendar")
public class PodujatieKalendar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;
    @Column(name = "start")
    private String start;
    @Column(name = "end")
    private String end;

    @Column(name = "ind")
    private long ind;

    public PodujatieKalendar(){}

    public PodujatieKalendar(String title, String start, String end, long ind) {
        this.title = title;
        this.start = start;
        this.end = end;
        this.ind = ind;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getStart() {
        return start;
    }

    public void setStart(String start) {
        this.start = start;
    }

    public String getEnd() {
        return end;
    }

    public void setEnd(String end) {
        this.end = end;
    }

    public long getInd() {
        return ind;
    }

    public void setInd(long ind) {
        this.ind = ind;
    }
}
