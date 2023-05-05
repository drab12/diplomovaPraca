import React, { useState, useEffect } from 'react'
import Spojenie from '../spojenie/Spojenie'

 export default function CnfVyhladavanie (props) {

    const [klucoveList,setKlucoveList]    = useState([])
    const [klauzuly,setKlauzuly]          = useState([])
    const [klucoveSlova,setKlucoveSlova]  = useState([]);

    useEffect(()=> {
        Spojenie.getKlucoveSlova().then( res =>{
            setKlucoveSlova(res.data);
            prehladajStromKlucovychSlov(res.data,"zaciatok",[],"zaciatok","zaciatok",[],0,res.data.length)  
        });

    },[]);

    function handleChange(event){
        let meno = event.target.name
        let hodnota = event.target.value  
        let idKlauzuly = meno.substring(5,meno.length);
        let pole = klauzuly
        let idLiteralu = event.target.id

        pole[idKlauzuly][idLiteralu].slovo = hodnota
        pole[idKlauzuly][idLiteralu].podslova = []
        prehladajStromKlucovychSlov(klucoveSlova,parseInt(hodnota),pole,idKlauzuly,idLiteralu)
        vytvorString()         
    }

    function vnorSa(slovo,idHladaneho,pole,idKlauzuly,idLiteralu,nastavList,uroven,velkost){
        if(slovo.deti.length > 0 ){
            prehladajStromKlucovychSlov(slovo.deti,idHladaneho,pole,idKlauzuly,idLiteralu,nastavList,uroven,velkost)      
        }
    }

    function prehladajStromKlucovychSlov(klucove,idHladaneho,pole,idKlauzuly,idLiteralu,nastavList,uroven,velkost){
        if(klucoveSlova !== undefined){
            for(let i=0; i<klucove.length; i++){
             
                if(klucove[i].id === idHladaneho  || klucove[i].idRodica ===idHladaneho){
                    pole[idKlauzuly][idLiteralu].podslova.push(klucove[i].id)
                    setKlauzuly(stare=>[...stare = pole]) 
                }
                
                if(idHladaneho=== "zaciatok"){
                    nastavList.push({id: klucove[i].id, nazovKlucovehoSlova: "-".repeat(1*uroven) + klucove[i].nazovKlucovehoSlova})
                    if(i === velkost-1 && klucove[i].idRodica=== null){
                        setKlucoveList(nastavList)
                   }
                }
                

                if(klucove[i].deti.length > 0){   
                    let parent = idHladaneho; 
                    if(klucove[i].idRodica !== null && klucove[i].idRodica === idHladaneho){       
                        parent = klucove[i].id
                    }
                    vnorSa(klucove[i],parent,pole,idKlauzuly,idLiteralu,nastavList,uroven+1,velkost)
                    
                } 
            }
        }
    }

    function tlacidloVymaz(literal,index,id){
        return  <button className="btn btn-danger upravTlacidlo"
                    type = "button"   
                    onClick= {() =>  {literal === true? vymazLiteral(klauzuly,index,id): vymazKlauzulu(klauzuly,index)} }>
                x
                </button>
    }

    function vymazLiteral(pole,index,id){
        pole[id] = pole[id].filter((item, i) => i !== index);
        if(pole[id].length===0){
            pole = pole.filter((item, i) => i !== id);
        }
        setKlauzuly(stare=>[...stare = pole]) 
        vytvorString()
    }

    function literal(id){
        return klauzuly[id].map( (slovo,index) => {
            let name = "";
            if(klauzuly[id][index].neg === true){
                name = "not"
            }
            else{
                name = ""; 
            }
            return  <div key ={index} className = "row" style = {{marginLeft:'15px'}}>
                        <button className="btn btn-primary" type = "button" 
                                onClick={()=>{
                                    let pole = klauzuly
                                    pole[id][index].neg = !pole[id][index].neg
                                    setKlauzuly(stare=>[...stare = pole])
                                    vytvorString()
                                }}>
                        {name}
                        </button>
                        <select id={index}  name = {`slovo${id}`} className="form-control selcnf"   
                                value = {klauzuly[id][index].slovo} onChange={handleChange}>
                                <option value=""></option>
                                {klucoveList.map((prvok, index) =>
                                        <option key={index} value={prvok.id}>{prvok.nazovKlucovehoSlova}</option>
                                )};              
                         </select> 
                        {tlacidloVymaz(true,index,id)}
                        {index !== klucoveList.length-1 ? "or" : ""} 
                    </div>    
        })
    }

    function vymazKlauzulu(pole,index){
        pole[index]= []
        pole = pole.filter((item, i) => i !== index);
        setKlauzuly(stare=>[...stare = pole])
        vytvorString() 
    }

    function klauzula(){
        return klauzuly.map((klauzul,index) => {
            return <div key = {index} className = "form-group">
                        <div className = "row divcnf" >      
                              {literal(index)}
                              <button className="btn btn-primary pridajcnf" 
                                      type = "button"
                                      
                                      onClick={() => {
                                                let pole = klauzuly
                                                pole[index].push({slovo: "", neg:false, podslova:[]})
                                                setKlauzuly(stare=>[...stare = pole])
                                      }}>  
                                Pridaj Literal
                              </button> 
                              {tlacidloVymaz(false,index,0)}

                        </div>  
                    </div>
        })
    }

    function vytvorString(){
        let query = "SELECT prva.zaznam_id FROM zaznamy_slova prva "
        let prvaWhere = " where"
        let ostatne = ""
        let podmienky =""
        let negacia = false
        let nenegovane = true;
        let negaciavKlauzule =0
        let prazdne = 0;
        for(let i=0; i< klauzuly.length; i++){
            prazdne = 0;
            negaciavKlauzule=0;
            if(i!==0){
                ostatne = " join (SELECT d.zaznam_id FROM zaznamy_slova d where "
                podmienky = ""

            }
            for(let j=0 ; j< klauzuly[i].length; j++){
             for(let k=0; k<klauzuly[i][j].podslova.length;k++){
                if(klauzuly[i][j].podslova[k] !== ""){
                    prazdne +=1
                    let id = klauzuly[i][j].podslova[k]
                    if(klauzuly[i][j].neg === false){
                        if(j===0 && k===0){
                           if(i===0){
                                prvaWhere = prvaWhere + " prva.kluc_id = " + id
                           }
                           else{
                            podmienky = podmienky + " d.kluc_id = " + id 
                           }
                        }
                        else{
                            if(i===0 ){
                                if(prazdne !==1){
                                    prvaWhere = prvaWhere + " or prva.kluc_id = " + id
                                }
                                else{
                                    prvaWhere = prvaWhere + " prva.kluc_id = " + id
                                }
                            }
                            else{
                                if(prazdne !==1){
                                    podmienky = podmienky + " or d.kluc_id = " + id 
                                }
                                else{
                                    podmienky = podmienky + " d.kluc_id = " + id 
                                }
                                
                            }
                        }
                    }
                    else{
                        negaciavKlauzule +=1;
                        negacia = true
                        if(j===0 && k===0){
                            if(i===0){
                                    prvaWhere = prvaWhere + "(not prva.kluc_id = " + id + 
                                    " and prva.zaznam_id not in( SELECT s.zaznam_id FROM zaznamy_slova s where s.kluc_id = " 
                                    + id + " ))"
                            }
                            else{
                                podmienky = podmienky + "(not d.kluc_id = " + id + 
                                " and d.zaznam_id not in( SELECT s.zaznam_id FROM zaznamy_slova s where s.kluc_id = " 
                                + id + " ))"
                            }
                        }
                        else{
                            if(i===0){
                                if(prazdne !==1){
                                    prvaWhere = prvaWhere + " or (not prva.kluc_id = " + id + 
                                    " and prva.zaznam_id not in( SELECT s.zaznam_id FROM zaznamy_slova s where s.kluc_id = " 
                                    + id + " ))"
                                }
                                else{
                                    prvaWhere = prvaWhere + " (not prva.kluc_id = " + id + 
                                    " and prva.zaznam_id not in( SELECT s.zaznam_id FROM zaznamy_slova s where s.kluc_id = " 
                                    + id + " ))"
                                }
                                
                            }
                            else{
                                if(prazdne !==1){
                                    podmienky = podmienky + " or (not d.kluc_id = " + id + 
                                " and d.zaznam_id not in( SELECT s.zaznam_id FROM zaznamy_slova s where s.kluc_id = " 
                                + id + " ))"
                                }
                                else{
                                    podmienky = podmienky + " (not d.kluc_id = " + id + 
                                " and d.zaznam_id not in( SELECT s.zaznam_id FROM zaznamy_slova s where s.kluc_id = " 
                                + id + " ))"
                                }
                               
                            }
                        }
                    }
                }
            }
        }
            if(i!==0 && podmienky !==""){
            query = query + ostatne + podmienky + ") as XXX" + i + " on prva.zaznam_id = XXX" + i + ".zaznam_id"
            }
            if(negaciavKlauzule===0){
                    nenegovane = false;
            }
        }

        if(prvaWhere!== " where"){
            query = query + prvaWhere;
        }
        query = query + " group by prva.zaznam_id";
        if(negacia && nenegovane){
            query = query + " union (SELECT za.id FROM zaznamy za left join zaznamy_slova x on   za.id = x.zaznam_id" + 
             
            " where x.zaznam_id is null group by za.id)" ;
        }
        props.hladaj(query)
    }

    return ( 
        <div>
            {klauzula()}
            <div className = "row divcnf" >
                <button className="btn btn-primary pridajcnf" 
                    type = "button" 
                    onClick={() => {
                        setKlauzuly(stare => [...stare,[{slovo: "", neg:false, podslova:[]}]])
                    }}>  
                 Pridaj Klauzulu
                </button>  
            </div>
        </div>


    )

 }