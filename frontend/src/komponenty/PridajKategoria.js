import React, { useState,useEffect } from 'react'
import Spojenie from '../spojenie/Spojenie';
import { Link} from "react-router-dom"; 
import pencil from '../obrazky/pencil.png';
import trash from '../obrazky/trash3.png';
import Pop from './Pop';

export default function PridajKategoria(){
    const [kategorie, setKategorie]         = useState([])
    const [novaKategoria, setNovaKategoria] = useState("")
    const [vymazane, setVymazane]           = useState([])
    let dobry = false


    useEffect(()=>{
        Spojenie.getKategorie().then( res =>{
            setKategorie(res.data);
        }); 

    },[])

    function ulozZaznam (e){
        e.preventDefault();
        if(vymazane.length >0){
            Spojenie.vymazKategorie(vymazane).then(res =>{
                window.location.href= "/"
            });
        }
        else{
            window.location.href= "/"
        }
        
    }
    
    function zmeneneData(){
        if(vymazane.length >0){
            return <h1 className='chyba'> Dáta je potrebné uložiť</h1>
        }
    }

    function handleChange(event){
        setNovaKategoria(event.target.value)      
    }

    function chyba(text){
        return <p className="chyba"> {text}</p>
    }


    function dobryJSON(){
        let okej = true;
        try{  
            let jsonData = JSON.parse(novaKategoria)
            
            if(Object.keys(jsonData).length===3){
                if(Object.keys(jsonData)[0] !=="nazov"){
                    okej = false;
                   return chyba("Prvý atribut sa musi volať nazov")
                   
                }
                if(Object.keys(jsonData)[1] !=="nazovHtml"){
                    okej = false;
                    return chyba("Druhý atribut sa musi volať nazovHtml")
                }
                if(Object.keys(jsonData)[2] !=="atributy"){
                    okej = false;
                    return chyba("Tretí atribut sa musi volať atributy")
                }
                else{
                  let pole = Object.values(jsonData)[2]
                  for(let i=0; i< pole.length;i++) {
                        if(Object.keys(pole[i]).length <2 || Object.keys(pole[i]).length>3){
                            okej = false;
                            return chyba(" Pre atribút musite mať minimálne 2 atribúty s názvami nazov,typ a tretí volitelný s názvom enumerate")
                        }
                        else{
                            if(Object.keys(pole[i])[0] !=="nazov"){
                                okej = false;
                                return chyba("Prvý atribut v atribúte sa musi volať nazov")
                            }
                            if(Object.keys(pole[i])[1] !=="typ"){
                                okej = false;
                                return chyba("Druhý atribut v atribúte sa musi volať typ")
                            }
                            else{
                                let typAtributu = Object.values(pole[i])[1]
                                if(typAtributu !== "text" && typAtributu !== "textarea" && typAtributu !== "select"
                                     && typAtributu !== "number" && typAtributu !== "date" && typAtributu !== "dateinterval" 
                                     && typAtributu !== "checkbox" ){
                                        okej = false;
                                        return chyba("Typ atribútu môže byť len jeden s [text, textarea, number, select, checkbox, date, dateinterval]")
                                }
                            }
                           
                        }
                     } 
                 }
            }
            else{
                okej = false;
                return chyba("Musite mať 3 atribúty s názvom nazov,nazovHtml,atributy")
            }

            if(okej){
               dobry = true
            }         
        }
        catch {
            okej = false
            dobry = false
            return chyba("JSON nie je v správnom formáte")
        }

    }

    function vymaz(index,pole,id){
        let zmaz =vymazane
        zmaz.push(id)
        pole = pole.filter((item, i) => i !== index);
        setKategorie(pole) 
        setVymazane(zmaz) 
    }


    function zobrazKategorie(){
           
        return  kategorie.map( (kat,index) => {
            return <div key = {index}>     
                        <p className="row" style={{marginBottom: '0px',fontSize: '20px'}}> 
                            {kat.nazov} 
                            <Link className="btn btn-info upravTlacidlo"  to ={`/upravkategoriu/${kat.id}`}> 
                                <img className= "obrazok" src={pencil} />
                            </Link>
                            <button className="btn btn-danger upravTlacidlo"
                                    type = "button"  
                                    onClick= {() => vymaz(index,kategorie,kat.id)}> 
                                    <img className= "obrazok" src={trash}  />
                            </button>  
                        </p>               
                   </div>
    })     
                         
               
     }

     function pridaj(e){
        e.preventDefault();
        if(dobry){
            let jsonData = JSON.parse(novaKategoria)
            Spojenie.vytvorKategoriu(jsonData).then( res =>{
                setKategorie(res.data);  
            });      
        }     
     }


    function pridajKategoriu(){
        return <div className = "form-group" style={{marginTop: '30px'}}> 
        <p> {`{"nazov":  "Moja kategoria", "nazovHtml": "Moja", "atributy": [{"nazov": "prvy", "typ": "text" } ,{"nazov": "druhy", "typ": "text"}] }`}</p>
                    <textarea  placeholder= "nova kategria" 
                               name= "kategoria"
                               className="form-control" 
                               value={novaKategoria} 
                               onChange={handleChange} />

                    <button className="btn btn-primary" 
                            type = "button" 
                            onClick= {pridaj}> 
                     Pridaj
                    </button> 
        </div>
    }  

    return(
    
        <div>
           <br></br>      
           <div className = "container">
                <div className = "row">
                    <div className = "card col-md-6 offset-md-3 offset-md-3">
                       <h3 className="text-center"> Pridaj kategóriu </h3>
                        <div className = "card-body">
                            <form>  
                                {zobrazKategorie()}
                                {pridajKategoriu()}
                                {dobryJSON()}
                                {zmeneneData()}
                                <Pop ulozZaznam={ulozZaznam}/> 
                            </form>
                        </div>
                    </div>
                </div>
    
           </div>
    </div>
    )    
}