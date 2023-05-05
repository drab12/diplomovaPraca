import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"; 
import Spojenie from '../spojenie/Spojenie'
import Kalendar from './Kalendar'
import CnfVyhladavanie from './CnfVyhladavanie';


 export default function ListZaznam () {
    const[zaznamy, setZaznamy]                            = useState([])
    const[nastavenia,setNastavenia]                       = useState({kategoriaHtml: '', vybranaKategoria:'', kalendar: false})
    const[kategorie, setKategorie]                        = useState([])
    const[fulltextoveVyhladavanie, setFulltext]           = useState("");
    const[hladajvKomentaroch, setHladajvKomentaroch]      = useState("");
    const [nastaveniaOdporucanychSlov,setNastaveniaOdporucanychSlov]        = useState()
    const [odporucaneAtributy,setOdporucaneAtributy]        = useState([])

    useEffect(()=> {
        Spojenie.getZaznamy().then(res => {
            setZaznamy(res.data);
        });
        Spojenie.getKategorie().then(res => {
            setKategorie(res.data);
        });
        Spojenie.getNastavenia(1).then(res => {
            setNastaveniaOdporucanychSlov(res.data);
            if(res.data.kategoriaId !=-1){
                getAtributyKategorie(res.data.kategoriaId)
            }
        });

    },[]);

  
    function vymazZaznam(id){
        Spojenie.vymazZaznam(id).then( res => {
            setZaznamy(stareZaznamy => {return stareZaznamy.filter(z => z.id !== id)});
        });
    }

    function nastavKategoriu(kategoria,vybrana){ 
            setNastavenia({kategoriaHtml: kategoria, vybranaKategoria: vybrana, kalendar: false})
    }
    function zobrazKalendar(){
        setNastavenia(stare => ({...stare, kalendar: true   }))
    }

    function vyhladaj(hladaj,id){
        if(hladaj === ''){
            Spojenie.getZaznamy().then(res => {
                setZaznamy(res.data);
            }); 
        }
        else{ 
            if(id ==='fulltext'){
                Spojenie.getZaznamHladane(hladaj).then(res => {
                    setZaznamy(res.data);
                });
            }
            else{
                Spojenie.getZaznamHladanePoznamky(hladaj).then(res => {
                    setZaznamy(res.data);
                });
            }
        }
    }

    function nastaveniaOdporucaneSlova(){
        if(nastaveniaOdporucanychSlov!== undefined){
            return  <div className='nastaveniaOdporucane'>
                        <label>Nastavenie odporučania</label>
                        <select className="form-control" 
                                name = "odporucane" 
                                style={{width:'200px'}}
                                value={nastaveniaOdporucanychSlov.kategoriaId} onChange={handleChange}>       
                                <option value="-1"> Všetky kategorie</option>
                
                                    {kategorie.map((prvok, index) =>
                                        <option key={index} value={prvok.id}>
                                            {prvok.nazov}
                                        </option>
                                    )};              
                        </select> 
                        <select className="form-control" 
                                name = "atributy" 
                                style={{width:'200px'}}
                                value={nastaveniaOdporucanychSlov.atributId} onChange={handleChange}>       
                                <option value="-1"> Všetky atributy</option>
                
                                    {odporucaneAtributy.map((prvok, index) =>
                                        <option key={index} value={prvok.id}>
                                            {prvok.nazov}
                                        </option>
                                    )};              
                        </select> 
                        <label> Počet odporúčaných slov: </label>
                            <input   className="form-control"
                                    type= "number" 
                                    placeholder= "5" 
                                    name= "pocetOdporucanych"
                                    value={nastaveniaOdporucanychSlov.pocetOdporucanych} onChange={handleChange}/>
                    </div> 
        }               
    }
    function getAtributyKategorie(idKategorie){
        Spojenie.getKategoriaById(idKategorie).then( res =>{
            setOdporucaneAtributy(res.data.atributy)
        });
    }


    function nastavOdporucanie(kategoriaId,atributId,pocet){
        Spojenie.updateNastavenia({kategoriaId: kategoriaId, atributId:atributId, pocetOdporucanych: parseInt(pocet)},1)
    }

    function handleChange(event){
        let meno = event.target.name
        let hodnota = event.target.value

        if(meno === "odporucane"){
            if(hodnota!=-1){
               getAtributyKategorie(hodnota)
            }
            else{
                setOdporucaneAtributy([])
            }
            nastavOdporucanie(hodnota,-1,nastaveniaOdporucanychSlov.pocetOdporucanych)
            setNastaveniaOdporucanychSlov( stareData => {
                return { ...stareData,kategoriaId:hodnota, atributId:-1}
                })
            
        }
        else{
            if(meno === "atributy"){
                setNastaveniaOdporucanychSlov( stareData => {
                return { ...stareData,atributId: hodnota,}
                })
                nastavOdporucanie(nastaveniaOdporucanychSlov.kategoriaId,hodnota,nastaveniaOdporucanychSlov.pocetOdporucanych)
            } 
            else{
                if(meno === "pocetOdporucanych"){
                    setNastaveniaOdporucanychSlov( stareData => {
                        return { ...stareData,pocetOdporucanych: hodnota,}
                        })
                        nastavOdporucanie(nastaveniaOdporucanychSlov.kategoriaId,nastaveniaOdporucanychSlov.atributId,hodnota)
                } 
                else{       
                    if(meno ==="fulltext"){
                        setFulltext(hodnota)
                    }
                    else{
                        setHladajvKomentaroch(hodnota)
                    }
                        vyhladaj(hodnota,event.target.id)  
                }
            }
        }
    }

    function zobrazZaznam(zaz){ 
           
        return  <tr key = {zaz.id}>  
                    {nastavenia.kategoriaHtml ==="" ? <td> { zaz.kategoria.nazov} </td>:  <></> }
                    {zaz.hodnoty.length <1 ? <td className='menoCell'> </td>: <td className='menoCell'> {zaz.hodnoty[0].hodnota }</td>}
                    {zaz.hodnoty.length <2 ? <td className='menoCell'></td>: <td className='menoCell'> {zaz.hodnoty[1].hodnota }</td>}
                    <td>
                         <Link  to={`/updateZaznam/${zaz.id}`} className="btn btn-info">Uprav </Link>
                         <button className="btn btn-danger" style={{marginLeft: "10px"}} onClick={ () => vymazZaznam(zaz.id)} >Zmaž </button>
                         <Link style={{marginLeft: "10px"}} to={`/detail/${zaz.id}`} className="btn btn-info">Ukáž </Link>
                    </td>    
                </tr>
    }

    function zobrazKategorie(){
      return  <div className="kategorie"> 
                        
                       {kategorie.map((kat,index) => {
                            return  <div key={index}>
                                         <button  className="btn btn-primary" 
                                                  style={{marginBottom: "1px", width: "100px"}}
                                                  onClick={() => nastavKategoriu(kat.nazovHtml,kat)}>
                                          {kat.nazovHtml}
                                         </button>
                                         <br></br>
                                    </div>
                         })
                        }
                        <div>
                              <button  className="btn btn-primary" 
                                       style={{marginBottom: "1px", width: "100px"}}
                                       onClick={() => zobrazKalendar()}>
                                Kalendár
                              </button>
                              <br></br>
                        </div>
                </div>
    }

    function hladajCNF(query){
        Spojenie.getZaznamyHladaneCNF(query).then(res => {
            setZaznamy(res.data);
        });
    }
 
    return (           
            <div>
                 <h2 className="text-center">{nastavenia.kategoriaHtml ==="" ? "Záznamy": nastavenia.kategoriaHtml} </h2>
                 <div className = "row">
                    {nastavenia.kategoriaHtml ==="" ? <></>: <Link className="btn btn-info" style={{marginBottom:'5px'}} to= {`/pridajZaznam/${nastavenia.vybranaKategoria.id}`} > Pridaj</Link>}
                 </div> 
                
                 <Link className="btn btn-info"  to ="/pridajkategoriu" style={{float:'right'}}> Pridaj kategóriu</Link>
                 {nastaveniaOdporucaneSlova()}  
                    
                 <div>
                    <input id ='fulltext'placeholder= "fulltext" name= "fulltext" value = {fulltextoveVyhladavanie} onChange={handleChange}/>    
                 </div>

                 <div>
                    <input id ='vyhladajKomentar'placeholder= "Komentáre" name= "hladajKomentar" value = {hladajvKomentaroch} onChange={handleChange}/>
                 </div>
                

                <CnfVyhladavanie hladaj={hladajCNF}/>
                 <br></br>
                 <br></br>
                 <br></br>
                 <br></br>
                 <br></br>
                 {zobrazKategorie()}

                 {nastavenia.kalendar === false?
                    <div className = "row">
                        <table className = "table table-striped table-bordered xyz" >
                            <thead>
                                <tr>
                                   { nastavenia.kategoriaHtml ==="" ? <th> Kategória</th>: <></>}
                                   { nastavenia.vybranaKategoria ==="" || nastavenia.vybranaKategoria.atributy.length < 1 ?  <th> Názov</th> :<th>{nastavenia.vybranaKategoria.atributy[0].nazov}</th>}
                                   { nastavenia.vybranaKategoria ==="" || nastavenia.vybranaKategoria.atributy.length < 2 ? <th> Autor</th> :<th>{nastavenia.vybranaKategoria.atributy[1].nazov}</th>}
                                    <th> Akcie</th>
                                </tr>
                            </thead>
                            <tbody>                         
                            {
                               zaznamy.map(zaz => {
                                       if (zaz.kategoria.id === nastavenia.vybranaKategoria.id) 
                                        return zobrazZaznam(zaz)
                                    else if(nastavenia.vybranaKategoria === "")
                                        return zobrazZaznam(zaz)
        
                               })
                            }
                            </tbody>
                        </table> 
                    </div>
                    :<Kalendar />
                }
            </div>
        )
}
