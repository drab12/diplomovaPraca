import React, { useState, useEffect } from 'react'
import Spojenie from '../spojenie/Spojenie'
import { useParams, Link } from 'react-router-dom'


export default function DetailZaznam(){
    const [zaznam, setZaznam]     = useState({})
    const [odkazyNa, setOdkazyNa] = useState([])
    const [odkazyOd, setOdkazyOd] = useState([])
    const parametre               = useParams()

    useEffect(()=>{
        Spojenie.getZaznamById(parametre.id).then( res => {
            setZaznam (res.data);      
        });
        Spojenie.odkazyNa(parametre.id).then( res => {
            setOdkazyNa(res.data)
        })
        Spojenie.odkazyOd(parametre.id).then( res => {
            setOdkazyOd(res.data)          
        })
        
    },[parametre.id]);

    function zobrazAtribut(index,id,atribut){
        return <div key = {index}>  
                     {atribut.typ === "dateinterval" && zaznam.hodnoty[id].hodnota !==''? 
                        <div className = "row">
                            <p className='atribut' style={{display:"inline-block"}}>{atribut.nazov}</p> <br></br> 
                        </div> : ""}  

                    {zaznam.hodnoty[id].hodnota ==='' ? <></> :
                        <div  className = "row">  
                            <p className='atribut' style={{display:"inline-block"}}> {atribut.typ === "dateinterval" ? "Začiatok": atribut.nazov}
                             </p>

                              <p style={{display: "inline-block", maxWidth: "100%"}}>  :{ zaznam.hodnoty[id].hodnota } </p>
                        </div> }
                    {atribut.typ === "dateinterval" && zaznam.hodnoty[id+1].hodnota !=='' ?
                        <div  className = "row"> 

                            <p  className='atribut'  style={{display: "inline-block", maxWidth: "100%"}}>   :{ zaznam.hodnoty[id+1].hodnota }</p>
                        </div> : <></>}
               </div>
    }
    
    function zobraz(){
        let j= -1
        return (Object.keys(zaznam)).map( (kat,index) =>{       
            j = j+1;
            if(kat === "kategoria"){
                let i =-1; 
                return Object.values(zaznam)[j].atributy.map( (atribut, index) => {
                        i= i+1;
                        if(atribut.typ === "date"){
                            i=i+1
                            return zobrazAtribut(index,i-1,atribut)
                        }
                        else {
                            if(atribut.typ === "dateinterval"){
                                i=i+2
                                return zobrazAtribut(index,i-2,atribut)
                            }
                            else{
                               return zobrazAtribut(index,i,atribut)
                            }
                        }        
                 })        
            }
            else{
                if(kat === "klucoveSlova" && Object.values(zaznam)[j].length >0){
                    return Object.values(zaznam)[j].map( (prvok, index) => {
                            return <div key = {index}>
                                        {index === 0 ? <div className = "row" > Klučové slová  </div>: <></>}
                                        <div>          
                                            <li>{prvok.nazovKlucovehoSlova} </li>
                                        </div>   
                                    </div>
                    })
                }          
                if(kat === "externeLinky" && Object.values(zaznam)[j].length >0) {
                    return Object.values(zaznam)[j].map( (prvok, index) => {
                        return <div key = {index}>
                                    <div className = "row"> Link :        
                                        <a  href = {prvok.url }> {prvok.komentar} </a> 
                                    </div> 
                               </div>
                    })
                }
                if(kat === "prilohy" && Object.values(zaznam)[j].length >0){
                    return Object.values(zaznam)[j].map( (prvok, index) => {
                        return <div key = {index}>
                                    <div  className = "row"> Súbor:        
                                        <a href={`http://localhost:8072/api/zaznamy/subor/${prvok.id}`} >   {prvok.nazov} </a>
                                    </div>  
                               </div>
                    })
                }
                if(kat === "komentare" && Object.values(zaznam)[j].length >0){
                    return Object.values(zaznam)[j].map( (prvok, index) => {
                        return <div key = {index}>
                                    <div  className = "row"> Komentár:          
                                        {prvok.obsah} 
                                    </div>       
                               </div>
                    })
                }
            }   
        })              
    }

    function odkazy(odkazy,nadpis,classs){
       let komentar = ""
       return  <div className = {classs}>
                    <table className = "table table-striped table-bordered">
                        <thead><tr><th> {nadpis}</th></tr></thead>
                        <tbody> 
                          { odkazy.map( (zaz,index) => {
                                let prvyAtribut ="";
                                let druhyAtribut = "";
                                if(zaz.hodnoty.length>1){
                                    prvyAtribut = zaz.hodnoty[0].hodnota
                                    druhyAtribut = zaz.hodnoty[1].hodnota
                                }
                                else{
                                    if(zaz.hodnoty.length==1){
                                        prvyAtribut = zaz.hodnoty[0].hodnota
                                    }
                                }
                           
                                komentar = ""
                                if(zaznam !== undefined &&  zaznam.interneLinky!= undefined && zaznam.interneLinky.length>index && zaznam.interneLinky[index].idCiela === zaz.id){
                                    if(zaznam.interneLinky[index].komentar !==""){
                                    komentar = "(" + zaznam.interneLinky[index].komentar + ")"
                                    }
                                }
                                else{
                                    for(let i =0; i< zaz.interneLinky.length;i++){
                                        if(zaz.interneLinky[i].idCiela === zaznam.id){
                                            if(zaz.interneLinky[i].komentar !==""){
                                                komentar=  "(" + zaz.interneLinky[i].komentar + ")"
                                            }
                                            break
                                        }   
                                    }
                                }
                                return <tr key={index}>
                                          <td> 
                                             <a  href = {`/#/detail/${zaz.id}`}>{prvyAtribut}{` ` }{druhyAtribut} 
                                               {` `}{komentar}      <br></br> {zaz.kategoria.nazov}
                                             </a> 
                                               
                                          </td>
                                       </tr>
                                })  
                            }                             
                        </tbody>
                    </table>
               </div>
    }

    return(
            <div>   
                {odkazy(odkazyOd,"Odkazy od","odkazyOd")}
                {odkazy(odkazyNa,"Odkazy na","odkazyNa")}
                <div className = "card col-md-6 offset-md-3">
                    <h2 className = "text-center"> Detail Záznamu</h2>
                    <div className = "card-body">   
                        {zobraz()}
                        <br></br>
                        <div className= "row">  
                            <Link  style={{marginLeft: "0px"}} to={`/updateZaznam/${zaznam.id}`} className="btn btn-info">Uprav</Link>
                        </div>
                       
                    </div>

                </div>
            </div>
        )
    
}


