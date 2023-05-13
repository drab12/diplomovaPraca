import { Dropdown } from 'bootstrap';
import React from 'react'

export default function Hlavicka(){
    

    function odhlas(){
        sessionStorage.removeItem("jwt");
        window.location.href= "/"
    }
    function heslo(){
        window.location.href= "/#/heslo"  
    }

        return (
            <div>
                <header>
                    <nav className="navbar  navbar-dark bg-dark">
                        <div>
                            <a href="/" className="navbar-brand">Domov</a>
                            
                        </div>
                        <div className="dropdown">
                            <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Odhlásenie
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <button className="dropdown-item" type = "button" onClick= {heslo}> Zmena hesla</button> 
                                <button className="dropdown-item" type = "button" onClick= {odhlas}> Odhlás</button> 
                            </div>
                        </div>
  
                      
                    
                    </nav>
                </header>
            </div>
        )
    
}

