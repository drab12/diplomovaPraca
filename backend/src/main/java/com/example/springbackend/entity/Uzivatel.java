package com.example.springbackend.entity;

import javax.persistence.*;

@Table(name ="uzivatelia")
@Entity
public class Uzivatel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", unique = true,nullable = false)
    private String username;

    @Column(name = "password", unique = true,nullable = false)
    private String password;


    public Uzivatel(){}

    public Uzivatel(String username, String password ){
        this.username = username;
        this.password = password;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String meno) {
        this.username = meno;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String heslo) {
        this.password = heslo;
    }

}
