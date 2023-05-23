import React, { useState,useEffect } from 'react'
import Spojenie from '../spojenie/Spojenie';
import {useParams} from "react-router-dom"; 
import pencil from '../obrazky/pencil.png';
import trash from '../obrazky/trash3.png';
import Pop from './Pop';

export default function PridajKategoria(){
    const[kategoria,setKategoria]     = useState({})
    const[novyAtribut,setNovyAtribut] = useState({nazov:"",typ:"text", enumerate:[]})
    const parametre                   = useParams();
    const[povodneAtributy , setAtributy]     = useState({viditelne:[], zmazane:[], pridane:0, nazvy:[]});


    useEffect(()=>{  
        Spojenie.getKategoriaById(parametre.id).then( res => {
            let pole =[]
            for(let i=0; i< res.data.atributy.length; i++){
                pole.push(false) 
            }  
            setAtributy(stare => { return{...stare,viditelne: pole,nazvy: JSON.parse(JSON.stringify(res.data))}})
            setKategoria (res.data);
        });
        
    },[])

    function ulozZaznam (e){
        e.preventDefault();
        Spojenie.updateKategoria(kategoria,kategoria.id).then( res =>{
            if(povodneAtributy.pridane>0){
                let form = new FormData  
                form.append("pocet", povodneAtributy.pridane)
                Spojenie.pridajAtribut(kategoria.id,form).then(res =>{

                })
            }
            if(povodneAtributy.zmazane.length>0){
                Spojenie.vymazAtribut(povodneAtributy.zmazane).then(res =>{

                })
            }
           window.location.href= "/"
        })    
    }

    function zmeneneData(){
        return <h1 className='chyba'> Dáta je potrebné uložiť </h1>
    }

    function zistiZmenene(){
        if(povodneAtributy.nazvy.nazov!== undefined){
            if(povodneAtributy.nazvy.nazov !== kategoria.nazov ||
                povodneAtributy.nazvy.nazovHtml !== kategoria.nazovHtml
                || povodneAtributy.pridane>  0 || povodneAtributy.zmazane.length > 0){
                return zmeneneData()
            }

            for(let i=0; i< povodneAtributy.nazvy.atributy.length;i++){
                if(povodneAtributy.nazvy.atributy[i].nazov !== kategoria.atributy[i].nazov
                    ||povodneAtributy.nazvy.atributy[i].typ !== kategoria.atributy[i].typ){
                    return zmeneneData()
                }
                if(povodneAtributy.nazvy.atributy[i].typ === "select"){
                    
                    if(povodneAtributy.nazvy.atributy[i].enumerate.length !== kategoria.atributy[i].enumerate.length ){
                        return zmeneneData()
                    }
                    else{
                        for(let j=0; j< povodneAtributy.nazvy.atributy[i].enumerate.length;j++){
                            if(povodneAtributy.nazvy.atributy[i].enumerate[j].hodnota !== kategoria.atributy[i].enumerate[j].hodnota){
                                return zmeneneData()
                            }
                        }
                    }
                }
            }
            
        }
    }

    function handleChange(event){
        let id = event.target.id
        let hodnota = event.target.value
        let meno = event.target.name
       
        if(meno ==="atribut"){
            let atribut = kategoria.atributy
            atribut[id].nazov =hodnota
            setKategoria( stareData => {
            return { ...stareData,atributy: atribut}})
        }
        else{
            if(meno ==="nazov" || meno==="typ"){
                setNovyAtribut(stareData => {
                return { ...stareData,[meno]: hodnota}})
            }
            else{
                if(meno ==="selectNovy"){
                    let atributselectuNovy = novyAtribut.enumerate
                    atributselectuNovy[id].hodnota =hodnota
                    setNovyAtribut(stareData => {
                    return { ...stareData,enumerate: atributselectuNovy}})
                }
                else{
                    if(meno.includes("selectPridaj")){
                        let index = meno.substring(12,meno.length);
                        let atributselectu = kategoria.atributy
                        atributselectu[index].enumerate[id].hodnota =hodnota
                        setKategoria( stareData => {
                        return { ...stareData,atributy: atributselectu }})
                    }
                    else{
                        if(meno === "kategoria"){
                            setKategoria( stareData => { return { ...stareData, nazov: hodnota}})
                        }
                        else{
                            setKategoria( stareData => { return { ...stareData, nazovHtml: hodnota}})
                        }
                    }
                }
                }
            }
        
        
          
    }

    function vymazAtribut(index,pole,id){
        let pom = povodneAtributy
        if(id !== undefined){
            pom.zmazane.push(id)
        }
        else{   
            pom.pridane--;
        }
        
        pole = pole.filter((item, i) => i !== index);
        pom.viditelne = pom.viditelne.filter((item, i) => i !== index);
        pom.nazvy.atributy = pom.nazvy.atributy.filter((item, i) => i !== index);
        setAtributy(pom)
        setKategoria( stareData => {
        return { ...stareData,atributy : pole}})
    }

   

    function uprav(atribut,id){
       return <input id = {id} className="form-control upravKategoriaInput"
                               placeholder= {atribut.nazov} 
                               name= "atribut"
                               value={kategoria.atributy[id].nazov} onChange={handleChange}
                               />

                             
    }

    function zobrazKategorie(){
        if(povodneAtributy.nazvy.atributy!== undefined)   
            return  povodneAtributy.nazvy.atributy.map( (atribut,index) => {
                return <div key = {index}>     
                            <p className="row" style={{marginBottom: '0px',fontSize: '20px'}}> 
                                {atribut.nazov} {' '}{"(" + atribut.typ + ")"}
                                {povodneAtributy.viditelne[index] ===false? 
                                        <button className="btn btn-info upravTlacidlo" type = "button" 
                                                
                                                onClick= {() => { 
                                                    let pole = povodneAtributy.viditelne;
                                                    pole[index] = true;
                                                    setAtributy( stare => { return{...stare,viditelne: pole}}) }} > 
                                        <img className='obrazok' src={pencil}   />
                                        </button> 
                                : uprav(atribut,index)}
                            
                        
                                <button className="btn btn-danger upravTlacidlo"
                                        type = "button" 
                                        
                                        onClick= {() => vymazAtribut(index,kategoria.atributy,atribut.id)}> 
                                <img className='obrazok' src={trash}  />
                                </button>    
                            </p> 
                            {(atribut.typ=== "select" && povodneAtributy.viditelne[index] ===true ) ?  select(atribut,index,`selectPridaj${index}`) : <></>  }               
                       </div>
            })
    }


    function select(atr,id,nazov){
        let atribut = '';
        if(id === -1){
            atribut = atr
        }
        else{
            atribut = kategoria.atributy[id]
        }
        return <div >
                    <button className="btn btn-primary" 
                            type = "button" 
                            style={{margin:'10px 0px'}}
                            onClick= {() => {
                                if(id ===-1){
                                    let pole = novyAtribut.enumerate;
                                    pole.push({hodnota:''});
                                    setNovyAtribut(stare => { return {...stare, enumerate:pole}})
                                }
                                else{
                                    let pole = kategoria.atributy;
                                    pole[id].enumerate.push({hodnota:''});
                                    setKategoria( stare => {return { ...stare,atributy: pole}})
                                }   
                            }}> 
                    Pridaj option selectu
                    </button>

                    <br></br>
                    {atribut.enumerate.map((prvok,index) => { 
                        let pole =[]
                        if(id ===-1){
                            pole = novyAtribut.enumerate
                        }
                        else{
                            pole = kategoria.atributy
                        }
                        return <div key ={index} className="row" >
                                    <input id ={index} className="form-control upravKategoriaInput"
                                           placeholder= "atribút selectu" 
                                           name= {nazov}
                                           value={atribut.enumerate[index].hodnota} onChange={handleChange}
                                           />
                               
                                    <button className="btn btn-danger upravTlacidlo"
                                            type = "button" 
                                            onClick= {() => vymazSelect(index,pole,id)}> 
                                    x
                                    </button> 
                               </div>
                        })
                    }
               </div>
    }

    function vymazSelect(index,pole,id){
        if(id !== -1){
            pole[id].enumerate = pole[id].enumerate.filter((item, i) => i !== index);
            if(pole[id].enumerate.length===0){
                if(id === -1){
                    vymazAtribut(id,pole,undefined)
                }
                else{
                    vymazAtribut(id,pole,pole[id].id)
                }
            }
            else{
            setKategoria( stare => {return { ...stare,atributy : pole}})
            }
        }
        else{
            pole= pole.filter((item, i) => i !== index); 
            setNovyAtribut(stare => { return {...stare, enumerate:pole}})
        }

    }
    
    function pridajAtribut(){
        return <div className = "form-group" style={{marginTop: '30px'}}> 
                    <label>Názov atribútu</label>
                    <input className="form-control upravKategoriaInput"
                               placeholder= "novy atribút" 
                               name= "nazov"
                               value={novyAtribut.nazov} onChange={handleChange}
                              />
                    <label> Typ atribútu </label>
                    <select  name = "typ" className="form-control" 
                                        value={novyAtribut.typ} onChange={handleChange} >
                                        <option value="text"> text</option>  
                                        <option value="textarea"> text</option>    
                                        <option value="select">select</option>  
                                        <option value="checkbox">checkbox</option>  
                                        <option value="date">date</option> 
                                        <option value="dateinterval">dateinterval</option> 
                                        <option value="number">number</option>       
                    </select> 

                    {novyAtribut.typ=== "select" ?  select(novyAtribut,-1,"selectNovy") : "" }

                    <button className="btn btn-primary" 
                            type = "button" 
                            style={{marginTop:'10px'}}
                            onClick= {() => { 
                                let pole = kategoria.atributy;
                                let pom = novyAtribut
                                let viditelne = povodneAtributy
                                viditelne.pridane++;
                                viditelne.viditelne.push(false)

                                pole.push(pom)
                                viditelne.nazvy.atributy.push({nazov:pom.nazov, typ:pom.typ, enumerate: pom.enumerate})
                                setKategoria(stare => { return {...stare, atributy:pole}})
                                setNovyAtribut({nazov:'',typ:'text', enumerate:['']})
                                setAtributy(viditelne) }}> 
                                
                    Pridaj
                    </button> 
               </div>
    }

    function nazovKategorie(){
        if(kategoria.atributy !== undefined)
        return <div >     
                            <p className="row" style={{marginBottom: '0px',fontSize: '20px'}}> 
                                Názov
                                <input id = "0" className="form-control upravKategoriaInput"
                               placeholder= {kategoria.nazov} 
                               name= "kategoria"
                               value={kategoria.nazov} onChange={handleChange}
                               />
                               </p> 
                               <p className="row" style={{marginBottom: '0px',fontSize: '20px'}}> 
                              NázovHtml
                                <input id = "1" className="form-control upravKategoriaInput"
                               placeholder= {kategoria.nazovHtml} 
                               name= "kategoriaHtml"
                               value={kategoria.nazovHtml} onChange={handleChange}
                               />
                                </p> 
                                </div>
    }

    return(
    
    <div>  
         {console.log(kategoria)}
        <br></br>      
           <div className = "container">
                <div className = "row">
                    <div className = "card col-md-6 offset-md-3 offset-md-3">
                       <h3 className="text-center"> Uprav kategóriu </h3>
                        <div className = "card-body">
                            <form> 
                              {nazovKategorie()} 
                              <div  className="row" style={{marginBottom: '10px',fontSize: '20px', fontWeight: 'bold' }}> 
                                Atributy       
                              </div>
                              {zobrazKategorie()}
                              {pridajAtribut()}
                              {zistiZmenene()}
                              <Pop ulozZaznam={ulozZaznam}/> 
                            </form>
                        </div>
                    </div>
                </div>
           </div>
    </div>
    )    


}