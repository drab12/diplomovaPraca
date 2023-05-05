import React, { useState,useEffect} from 'react'
import Spojenie from '../spojenie/Spojenie';
import {useParams} from "react-router-dom"; 
import Zobrazformular from './Zobrazformular';

export default function UpdateZaznam() {
    const [formData,setFormData]              = useState({})
    const parametre                           = useParams();
    const [subor,setSubor]                    = useState([]);
    const [kopia,setKopia]                    = useState([])
    const [vymazData, setVymazData]           = useState({komentare: [], interneLinky: [], externeLinky:[], prilohy:[], udalosti:[]})
    
    useEffect(() => {
        Spojenie.getZaznamById(parametre.id).then( res =>{
            let linky = res.data.interneLinky
            for(let i=0; i<linky.length;i++){
                if(linky[i].idKategorie !== null){
                    Spojenie.getZaznamKategoria(linky[i].idKategorie).then( resp => {       
                        linky[i].zaznamy =resp.data
                    }); 
                }
            }      
            res.data.interneLinky = linky 
            setFormData(res.data)  
            setKopia(JSON.parse(JSON.stringify(res.data)))   
        });
           
    },[]);        
        
    function updateZaznam (e){
            e.preventDefault();
            vymazZdatabazy()
            
            let form = new FormData
            for(let j=0; j< subor.length; j++){
                form.append("file", subor[j])
            }
            Spojenie.updateZaznam(formData, formData.id).then( res =>{
                if(subor.length>0){
                    form.append("id", formData.id)
                    Spojenie.vytvorSubor(form).then( res =>{
                        window.location.href= "/#/detail/" + formData.id 
                    });
                }
                else{
                    window.location.href= "/#/detail/" + formData.id    
                }
            });
    }

    function vymazZdatabazy(){
       if(vymazData.komentare.length>0){
            Spojenie.vymazKomentar(vymazData.komentare)
        }
        if(vymazData.interneLinky.length>0){
            Spojenie.vymazInterny(vymazData.interneLinky)
        }
        if(vymazData.externeLinky.length>0){
            Spojenie.vymazExterny(vymazData.externeLinky)
        }
        if(vymazData.prilohy.length>0){
            Spojenie.vymazPrilohu(vymazData.prilohy)
        }
        if(vymazData.udalosti.length>0){
            Spojenie.vymazKalendar(vymazData.udalosti)
        }
    }

    function zmeneneData(){
        return <h1 className='chyba'>Dáta je potrebné uložiť</h1>
    }

    function zistiZmenene(){
        if(kopia.hodnoty !== undefined){

            if(kopia.klucoveSlova.length !== formData.klucoveSlova.length || kopia.komentare.length !== formData.komentare.length 
                || kopia.externeLinky.length !== formData.externeLinky.length || kopia.interneLinky.length !== formData.interneLinky.length
                || kopia.prilohy.length !== formData.prilohy.length || kopia.udalosti.length !== formData.udalosti.length){
                    return zmeneneData()
            }
            else{
                for(let i=0; i<kopia.hodnoty.length;i++){
                    if(kopia.hodnoty[i].hodnota !== formData.hodnoty[i].hodnota){
                        return zmeneneData() 
                    }
                }
                for(let i=0; i<kopia.klucoveSlova.length;i++){
                    if(kopia.klucoveSlova[i].id !== formData.klucoveSlova[i].id){
                        return zmeneneData() 
                    }
                }
                for(let i=0; i<kopia.komentare.length;i++){
                    if(kopia.komentare[i].obsah !== formData.komentare[i].obsah||
                        kopia.komentare[i].id !== formData.komentare[i].id ){
                        return zmeneneData()  
                    }
                }
                for(let i=0; i<kopia.externeLinky.length;i++){
                    if(kopia.externeLinky[i].url !== formData.externeLinky[i].url 
                       ||kopia.externeLinky[i].komentar !== formData.externeLinky[i].komentar
                       ||kopia.externeLinky[i].id !== formData.externeLinky[i].id ){
                        return zmeneneData() 
                    }
                }
                for(let i=0; i<kopia.interneLinky.length;i++){
                    if(kopia.interneLinky[i].idCiela !== formData.interneLinky[i].idCiela 
                       ||kopia.interneLinky[i].idKategorie !== formData.interneLinky[i].idKategorie
                       ||kopia.interneLinky[i].komentar !== formData.interneLinky[i].komentar
                       ||kopia.interneLinky[i].id !== formData.interneLinky[i].id){
                        return zmeneneData()  
                    }
                }
                if(subor.length>0){
                    return zmeneneData()
                }
            }         
        }   
    }
  

    function vytiahniData(nazov,data, nazovAtributu){

            if(nazov== "form"){
                setFormData(data)
            }  
            if(nazov =="subor"){
                setSubor(data)
            }
            if(nazov==="klucove"){
                setFormData(stare => { return {...stare, klucoveSlova:data}})
            }
            if(nazov== "vymazane"){
                console.log(data)
                setVymazData(data)
            } 
            if(nazov === "vymazform"){
                setFormData(stare => { return {...stare, [nazovAtributu]:data}})
            } 

    }
        return(
            <div>                             
                <br></br>
                <Zobrazformular vybranaKategoria = {formData.kategoria} update={true} posliData={vytiahniData}
                                ulozZaznam={updateZaznam} zistiZmenene={zistiZmenene}/>

                                    
                          
               
           </div>
        )
}


