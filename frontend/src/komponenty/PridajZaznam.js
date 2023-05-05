import React, { useState,useEffect } from 'react'
import Spojenie from '../spojenie/Spojenie';
import {useParams } from "react-router-dom"; 
import Zobrazformular from './Zobrazformular';


export default function PridajZaznam (){
    const [formData,setFormData]                  = useState({externeLinky: [],
        prilohy: [],
        interneLinky: [],
        komentare: [],
        klucoveSlova:[],
        udalosti:[]});
    const parametre                               = useParams()
    const [subor,setSubor]                        = useState([])
    const [vybranaKategoria, setVybranaKategoria] = useState({})
    const [odporucane,setOdporucane]              = useState([])
    
    
    useEffect(()=>{
        Spojenie.getKategoriaById(parametre.id).then( res => {
            setVybranaKategoria(res.data);
            setFormData( stareData => {
                return { ...stareData,kategoria: {id: res.data.id}}})
          
        });
           
    },[])
       
    function ulozZaznam (e){
        e.preventDefault();
        let form = new FormData  
        for(let j=0; j< subor.length; j++){
            form.append("file", subor[j])
        }
        Spojenie.vytvorZaznam(formData).then( res =>{
            if(subor.length>0){
                form.append("id",res.data.id )
                Spojenie.vytvorSubor(form).then( r =>{
                    window.location.href= "/"
                });
            }
            else{
                window.location.href= "/"
            }
        });    
    }

    function vytiahniData(nazov,data){

            if(nazov== "form"){
                setFormData(data)
                Spojenie.getOdporucane(formData).then( res =>{
                    setOdporucane(res.data);
                });                   
            }
            if(nazov==="subor"){
                setSubor(data)
            }
            if(nazov==="klucove"){
                setFormData(stare => { return {...stare, klucoveSlova:data}})
            }
            if(nazov==="hodnoty"){
                setFormData(stare => { return {...stare, hodnoty:data}})
            }  
    }
   
        return(
            <div >
                <br></br>           
                <Zobrazformular 
                    vybranaKategoria = {vybranaKategoria} update={false} posliData={vytiahniData}
                    odporucaneSlova = {odporucane} ulozZaznam={ulozZaznam} />                                                               
            </div>
        )
    
    

}




 