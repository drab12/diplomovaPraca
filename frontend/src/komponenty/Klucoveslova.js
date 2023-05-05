import React, { useState,useEffect } from 'react'
import Spojenie from '../spojenie/Spojenie';
import { Link} from "react-router-dom"; 

export default function KlucoveSlova (props){

    const [klucoveList,setKlucoveList]            = useState([])
    const [noveSlovo,setNoveSlovo]                = useState({})
    const [klucoveSlova,setKlucoveSlova]          = useState([])

    useEffect(()=>{
        Spojenie.getKlucoveSlova().then( res =>{
            setKlucoveSlova(res.data);
            prehladajStromKlucovychSlov(res.data,"zaciatok",false,[],[],[],0,res.data.length)
        });       
    },[]) 

    function pridajKlucoveSlovo(e){
        e.preventDefault(); 
        Spojenie.pridajKlucoveSlovo(noveSlovo).then( res =>{
            setKlucoveSlova(res.data);
            prehladajStromKlucovychSlov(res.data,"zaciatok",false,[],[],[],0,res.data.length)  
        });
        
    }

    function handleChange(event){
        let meno = event.target.name
        let hodnota = event.target.value
        if(meno.includes("slovo")){    
            prehladajStromKlucovychSlov(klucoveSlova,parseInt(event.target.id),event.target.checked,[],[])        
        }
        else{
              if(meno ==="nazovKlucovehoSlova" || meno ==="idRodica"){
                  setNoveSlovo( stareData => {
                  return { ...stareData,[meno]: hodnota  }})
              }
        }
    }

    function vnorSa(slovo,idHladaneho,check,pole,pom,nastvaList,uroven,velkost){
        if(slovo.deti.length > 0 ){
            prehladajStromKlucovychSlov(slovo.deti,idHladaneho,check,pole,pom,nastvaList,uroven,velkost)  
        }
    }  

    function prehladajStromKlucovychSlov(klucove,idHladaneho,check,pole,pom,nastavList,uroven,velkost){     
        return klucove.map( (slovo,index) =>{

            if(props.update === true && props.slovaZaznamu!== undefined){
                for(let i=0; i<props.slovaZaznamu.length; i++){
                    if(slovo.id === props.slovaZaznamu[i].id){
                        slovo.check = true                     
                    }
                } 
            }

           if(slovo.id === idHladaneho){
                slovo.check = check   
           }   
           if(slovo.check && pom.includes(slovo.id) === false ){
               pole.push({id: slovo.id, nazovKlucovehoSlova: slovo.nazovKlucovehoSlova, idRodica: slovo.idRodica})
               pom.push(slovo.id)
            }
              
           if(slovo.check === false &&  pom.includes(slovo.id) === true){
               pole = pole.filter( item => item.id !== slovo.id)
           }

           if(idHladaneho!=="zac"){
            props.slova(pole)
           }
           if(idHladaneho=== "zaciatok"){
            nastavList.push({id: slovo.id, nazovKlucovehoSlova: "-".repeat(5*uroven) + slovo.nazovKlucovehoSlova})
            if(index === velkost-1 && slovo.idRodica=== null){
                setKlucoveList(nastavList)
           }
        }
                    
           if(slovo.deti.length>0){             
                vnorSa(klucove[index],idHladaneho,check,pole,pom,nastavList,uroven+1,velkost)
           }
       })      
    }





    function zobraz(){
        return  klucoveSlova.map( (slovo,index) =>
                    <div key = {index}> 
                       {rekurzivneZobrazSlova(slovo,0,index,)} 
                    </div>
            )     
        }

    function rekurzivneZobrazSlova(slovo,cislo,index){
        return <div key ={index} style={{whiteSpace:'nowrap', width:'300px'}} >
                    <input  type="checkbox" id={slovo.id} 
                        name={`slovo${slovo.id}`} 
                        value = {slovo.nazovKlucovehoSlova} 
                        onChange={handleChange} 
                        style={{marginLeft: `${cislo}px`}} 
                        checked={slovo.check} /> 
                    {slovo.nazovKlucovehoSlova} 
                    {slovo.deti?.map((dieta,index) =>  rekurzivneZobrazSlova(dieta,cislo+ 15,index) )}         
                </div> 
}

    
        function zobrazKlucoveSlova(){
    
           return <div className = "klucove">
                     <div className = "card col-md-12 offset-md-3 offset-md-3" style={{width:'400px', overflowX:'scroll'}}>
                                <h3 className="text-center">Kľúčové Slová </h3>                
                        <div className = "card-body">           
                            {zobraz()}
                            <div className = "form-group"> 
                                   <label> Nové slovo: </label>
                                   <input placeholder= "nazov" className="form-control" 
                                          name = "nazovKlucovehoSlova" 
                                          value= {noveSlovo.nazov} onChange={handleChange}/>
    
                                   <label> Rodič </label>
                                   <select  name = "idRodica" className="form-control"
                                            style = {{width: '200px' ,}} 
                                            value={noveSlovo.idRodica} onChange={handleChange}>
                                                <option value=""></option>  
                                                {klucoveList.map((prvok, index) =>
                                                    <option key={index} 
                                                            value={prvok.id}>
                                                    {prvok.nazovKlucovehoSlova}
                                                    </option>
                                                )};              
                                    </select>  
    
                                    <button className="btn btn-primary" type = "button" 
                                            onClick= {pridajKlucoveSlovo}> 
                                    Pridaj
                                    </button> 
    
                                    <Link className="btn btn-success"  to ="/updateklucove"> Uprav</Link>       
                            </div>     
                        </div>
                     </div>
                  </div>
        }
        function zobrazOdporucaneSlova(){
            return <div className = "odporucane">
                      <div className = "card col-md-12 offset-md-3 offset-md-3">
                                 <h3 className="text-center">Odporúčané Slová </h3> 
                               
                         <div className = "card-body">           
                            {
                          props.odp.map( (slovo,index) =>{
                            return <div key = {index}> 
                                        <input type="checkbox" 
                                               id={slovo.id} 
                                               name={`slovo${slovo.id}`} 
                                               value = {slovo.nazovKlucovehoSlova} onChange={handleChange} 
                                               checked={slovo.check}/> 
                                        {slovo.nazovKlucovehoSlova}
                                    </div>
                                }) }
     
                         </div>
                      </div>
                   </div>
         }



 return(
    <div>
        {props.slovaZaznamu !== undefined && props.slovaZaznamu.length >0? prehladajStromKlucovychSlov(klucoveSlova,"zac",false,[],[]): ""}
        {props.update === false? zobrazOdporucaneSlova():"" }
        {zobrazKlucoveSlova()}
    
    </div>

 )   
}

