package com.example.springbackend.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.springbackend.entity.Uzivatel;
import com.example.springbackend.repozitare.UzivatelRepozitar;
@Service
public class NacitajUzivatela implements UserDetailsService {
    @Autowired
    private UzivatelRepozitar repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException    {
        if(repository.count()==0){
            BCryptPasswordEncoder bb = new BCryptPasswordEncoder();
            Uzivatel prvy = new Uzivatel("user",bb.encode("user"));
            repository.save(prvy);
        }
        Uzivatel currentUzivatel = repository.findByUsername(username);
        UserDetails user = new org.springframework.security.core
                .userdetails.User(username, currentUzivatel.getPassword()
                , true, true, true, true,
                AuthorityUtils.createAuthorityList());        return user;    }
}
