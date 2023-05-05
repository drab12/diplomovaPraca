import React, { useState,useEffect } from 'react'
import Spojenie from '../spojenie/Spojenie';
import {useParams } from "react-router-dom"; 
import Pop from './Pop';
import Klucoveslova from './Klucoveslova';



export default function Zobrazformular (props){

    const [formData,setFormData]     = useState({komentare: [], interneLinky: [], externeLinky:[], prilohy:[], udalosti:[], klucoveSlova:[]});
    const [vymazData, setVymazData]  = useState({komentare: [], interneLinky: [], externeLinky:[], prilohy:[], udalosti:[]})
    const [kategorie, setKategorie]  = useState([])
    const parametre                  = useParams()
       


    useEffect(()=>{

        Spojenie.getKategorie().then( res =>{
            setKategorie(res.data);
        }); 
    
        if(props.update){
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
            });
        }
        else{
            Spojenie.getKategoriaById(parametre.id).then( res => {
                let hodnoty = [];
                for(let i =0; i< res.data.atributy.length; i++){
                    if(res.data.atributy[i].typ=== "date"  ){
                        hodnoty.push({hodnota: '',atributId:res.data.atributy[i].id})
                    }
                    if(res.data.atributy[i].typ=== "dateinterval"  ){
                        hodnoty.push({hodnota: '',atributId:res.data.atributy[i].id })
                        hodnoty.push({hodnota: '',atributId:res.data.atributy[i].id})
                    }
                    hodnoty.push({hodnota: '',atributId:res.data.atributy[i].id})
                }
                props.posliData("hodnoty",hodnoty) 
                setFormData( stareData => {
                return { ...stareData,hodnoty: hodnoty, kategoria: {id: res.data.id}}})
                     
            });
        }
    },[]) 

    function getZaznamyKategoria(idKategorie,index){
        Spojenie.getZaznamKategoria(idKategorie).then( res =>{
            let interne = formData.interneLinky
            interne[index].zaznamy = res.data
            setFormData(stare => { return {...stare, interneLinky:interne}})
        });
    }

    function pridajSlovaKzaznamu(slova){
        setFormData(stare => { return {...stare, klucoveSlova:slova}})
        props.posliData("klucove",slova,"klucoveSlova")
    }

    function vymazPridaj(index,pole,nazov,id){
        pole = pole.filter((item, i) => i !== index);
        setFormData(stare => { return {...stare, [nazov]:pole}})   
    }

    function vymazUpdate(index,pole,nazov,id){ 
        pole = pole.filter((item, i) => i !== index);  
        if(id !== undefined){
            let vymazane =[]   
            if(nazov === "komentare"){
                vymazane = vymazData.komentare;
                vymazane.push(id)
            }
            if(nazov === "externeLinky"){
                vymazane = vymazData.externeLinky;
                vymazane.push(id)
            }
            if(nazov === "interneLinky"){
                vymazane = vymazData.interneLinky;
                vymazane.push(id)
            }
            if(nazov === "prilohy"){
                vymazane = vymazData.prilohy;
                vymazane.push(id)
            }
            setVymazData(stare => { return {...stare, [nazov]:vymazane}})
            setFormData(stare => { return {...stare, [nazov]:pole}})
            props.posliData("vymazane", vymazData)
            props.posliData("vymazform",pole, nazov) 
        }
        else{
            setFormData(stare => { return {...stare, [nazov]:pole}}) 
            props.posliData("vymazform",pole, nazov) 
        }             
    }

    function pridajDoKalendara(pridaj,index){
        let kalendar = formData.udalosti
        let j = 0
        let k=-1;
        let r =-1;
        if(kalendar.length > 0){
            j = kalendar.length;
        }
        if(pridaj=== true){
            for(let i=0; i< props.vybranaKategoria.atributy.length;i++){
                    r = r+1;
                    k= k+1
                    if(k+1!== formData.hodnoty.length){
                        if(props.vybranaKategoria.atributy[i].typ === "date" && parseInt(index)===(k+1) && formData.hodnoty[k+1].hodnota=== "Áno" ){  
                            kalendar.push({title: formData.hodnoty[0].hodnota + " " + props.vybranaKategoria.atributy[i].nazov, start: '', end: '', ind: index })
                            kalendar[j].start= formData.hodnoty[k].hodnota
                            kalendar[j].end= formData.hodnoty[k].hodnota
                        }
                        if(props.vybranaKategoria.atributy[i].typ === "date"){
                            r=r+1;
                            k=k+1
                        }
                     }              
                     if(r+2 < formData.hodnoty.length ){
                        if(props.vybranaKategoria.atributy[i].typ === "dateinterval" && parseInt(index)===(r+2) && formData.hodnoty[r+2].hodnota=== "Áno" ){  
                            kalendar.push({title: formData.hodnoty[0].hodnota + " " + props.vybranaKategoria.atributy[i].nazov, start: '', end: '', ind: index })
                            kalendar[j].start= formData.hodnoty[r].hodnota
                            kalendar[j].end= formData.hodnoty[r+1].hodnota
                        }
                        if(props.vybranaKategoria.atributy[i].typ === "dateinterval"){
                            k=k+2
                            r=r+2
                        }
                     }
            }             
        }
        else{
            if(props.update){
                
                let udalost = kalendar.find((item, i) => item.ind === index)
                if(udalost.id!== undefined){
                    let zmaz = vymazData.udalosti
                    zmaz.push(udalost.id)
                    setVymazData(stare => { return {...stare, udalosti:zmaz}})
                    props.posliData("vymazane",vymazData)
                }
                
            }
            kalendar = kalendar.filter((item, i) => item.ind !== index);
            }
        return kalendar     
    }

    function handleChange(event){
        let meno = event.target.name
        let hodnota = event.target.value
        let typ = event.target.type
      
      
                if(meno ==="prilohy"){
                    let prilohy = []
                    for( let i=0; i<event.target.files.length; i++){
                        prilohy.push (event.target.files[i])
                    }
                   
                   props.posliData("subor",prilohy)    
                }
                else{
                    if(meno.includes("link" ) || meno.includes("komm" )){ 
                            let index = meno.substring(6,meno.length);
                            let linky = formData
                            if(meno.includes("linkIK")){
                                linky.interneLinky[index].idKategorie = hodnota;
                                if(hodnota !=''){
                                    getZaznamyKategoria(hodnota,index)
                                }
                                else{
                                    linky.interneLinky[index].zaznamy=[]  
                                    linky.interneLinky[index].idCiela=[]
                                }
                            }
                            if(meno.includes("linkIZ" ))
                                linky.interneLinky[index].idCiela = hodnota;   
                            if(meno.includes("kommII" ))
                                linky.interneLinky[index].komentar = hodnota;
                            if(meno.includes("kommmm" ))
                                linky.komentare[index].obsah = hodnota;
                            if(meno.includes("linkEE" ))
                                linky.externeLinky[index].url = hodnota;
                            if(meno.includes("kommEE" ))
                                linky.externeLinky[index].komentar = hodnota;
            
                            setFormData(linky)
                            setFormData( stareData => {return { ...stareData }}) 
                           
                        }
                        else{
                            let index = parseInt(event.target.id)
                            let hod = formData.hodnoty
                            let kalendar = formData.udalosti
                            hod[index].hodnota = hodnota

                            if(typ ==="date" && meno === "date"){
                                if(formData.hodnoty[index +1].hodnota==="Áno"){
                                    const id = kalendar.findIndex(prvok => parseInt(prvok.ind) === index+1);
                                    kalendar[id].start = hodnota
                                    kalendar[id].end   = hodnota
                                }
                            }
                            if(typ==="date" && meno === "dateinterval"){
                               
                                if(formData.hodnoty[index +1].hodnota==="Áno"){
                                    const id = kalendar.findIndex(prvok => parseInt(prvok.ind) === index+1);
                                    kalendar[id].end   = hodnota
                                }
                                if(formData.hodnoty.length > index+2){
                                    if(formData.hodnoty[index +2].hodnota==="Áno"){
                                        const id = kalendar.findIndex(prvok => parseInt(prvok.ind) === index+2);
                                        kalendar[id].start = hodnota
                                    }
                                }
                            }
                            if(typ === "checkbox"){
                               if(event.target.checked){
                                hod[index].hodnota ="Áno"
                               } 
                               else {
                                hod[index].hodnota ="Nie"
                               }                   
                            }
                            if(meno === "pridaj do kalendára"){
                                kalendar = pridajDoKalendara(event.target.checked,index)
                                setFormData( stareData => {
                                    return { ...stareData,hodnoty: hod, udalosti: kalendar }})
                                props.posliData("form",formData)  
                                props.posliData("vymazform",kalendar,"udalosti") 
                                
                            }
                            else{
                                setFormData( stareData => {
                                return { ...stareData,hodnoty: hod, udalosti: kalendar }})
                                props.posliData("form",formData) 
                            }
                           
                        }                   
                    }
          }
    function renderAtribut(id,name,nazov,typ,placeholder,data,value,select,selectValue ,selectZobraz){
        if(data!== undefined){
            if(typ ==="checkbox"){
                return <>
                            <label> {nazov} </label>
                            <input  id={id} 
                                    name= {name} 
                                    type= {typ} 
                                    checked = {value === "Áno" ? true: false} 
                                    value = {value} onChange={handleChange} 
                                    style={{marginLeft:"10px",transform: "scale(1.5)"}} />      
                        </>
            }
            if(typ==="text" || typ==="number" || typ === "date" || typ=== "dateinterval"){
                return  <> 
                            <label> {nazov}: </label>
                            <input  id = {id} className="form-control"
                                    type= {typ}  
                                    placeholder= {placeholder} 
                                    name= {name}
                                    value={value} onChange={handleChange}/>
                        </>
            }
            if(typ === "textarea"){
                return <>
                            <label> {nazov}: </label>
                            <textarea   id = {id} className="form-control" 
                                        placeholder= {placeholder} 
                                        name= {name} 
                                        value={value} onChange={handleChange}/>  
                            </>
            }
            if( typ === "select"){
                return <>
                            <label> {nazov} </label>
                            <select id = {id} className="form-control"
                                    name = {name}  
                                    value={value} onChange={handleChange}>
                                    <option value=""></option>
                                    {select?.map((prvok, index) =>
                                        <option key={index} 
                                                value={selectValue === "hodnota" ? prvok.hodnota : prvok.id}>
                                            {selectZobraz === "hodnota" ? prvok.hodnota : prvok.nazov}
                                        </option>
                                    )};              
                            </select>   
                        </>                                    
            }
        }         
    }
            
    function tlacidloZmaz(index,pole,nazov,id){
        return <>
                    <button className="btn btn-danger" type = "button" 
                            onClick= {() => 
                                {props.update === true? vymazUpdate(index,pole,nazov,id)
                                :vymazPridaj(index,pole,nazov,id) }}> 
                    Zmaž
                    </button>                    
               </>
    }

    function externeLinky(){     
        let i =-1;
        return formData.externeLinky.map( (prvok,index) =>{
            i= i+1;        
            return <div key = {index} className = "form-group"> 
                        {renderAtribut(index,`linkEE${i}`,"Link:","text","url",formData.externeLinky,formData.externeLinky[i].url)}
                        {renderAtribut(index,`kommEE${i}`,"Komentár:","text","komentár",formData.externeLinky,formData.externeLinky[i].komentar)}
                        {tlacidloZmaz(index,formData.externeLinky,"externeLinky",prvok.id)}                           
                   </div>
       })
    }

    function interneLinky(){
        let i =-1;
        return formData.interneLinky.map( (prvok,index) =>{
            i= i+1;      
            return  <div key = {index} className = "form-group"> 
                            {renderAtribut(index,`linkIK${i}`,"Odkaz na záznam:","select","",formData.interneLinky,formData.interneLinky[i].idKategorie,kategorie,"id","nazov")}    
                            
                            <select id = {index} className="form-control" 
                                    name = {`linkIZ${i}`} 
                                    value={formData.interneLinky[i].idCiela} onChange={handleChange}>     
                                         <option value=""></option>

                                        {formData.interneLinky[i].zaznamy?.map((prvok, index) =>
                                            <option key={index} 
                                                    value={prvok.id}>
                                            {prvok.hodnoty[0].hodnota}
                                            </option>
                                        )};              
                            </select> 
                            {renderAtribut(index,`kommII${i}`,"Komentár:","text","komentár",formData.interneLinky,formData.interneLinky[i].komentar)}
                            {tlacidloZmaz(index,formData.interneLinky,"interneLinky",prvok.id)}                      
                    </div>                
       })
    }

    function komentare(){
        let i =-1;
        return formData.komentare.map( (prvok,index) =>{
            i= i+1;        
            return <div key = {index} className = "form-group">            
                {renderAtribut(index,`kommmm${i}`,"Komentár:","textarea","komentár",formData.komentare,formData.komentare[i].obsah)}  
                {tlacidloZmaz(index,formData.komentare,"komentare",prvok.id)}                        
                   </div>
        })
    }
    function prilohy(){
        let i =-1;
        return formData.prilohy.map( (prvok,index) =>{
            i= i+1;        
            return <div key = {index} className = "row" style={{marginBottom:"5px"}}> 
                        <label> súbor : </label>
                        <p> {formData.prilohy[i].nazov}</p>
                        {tlacidloZmaz(index,formData.prilohy,"prilohy",prvok.id)}     
                                           
                   </div>
        })
    }
    function zobrazVybraneKlucoveSlova(){
        if(formData.klucoveSlova!== undefined){
            let i =-1;
            return formData.klucoveSlova.map( (prvok,index) =>{
                i= i+1;        
                return <div key = {index} className = "form-group"style={{marginBottom:"2px",marginLeft:"10px"}} > 
                            <li key={index}> {formData.klucoveSlova[i].nazovKlucovehoSlova}</li>                           
                        </div>
            })
        }
    }
    function zobrazAtributy(vybranaKategoria){ 
        if(vybranaKategoria !== undefined && vybranaKategoria.atributy !== undefined && formData.hodnoty!== undefined){
            let i =-1;  
            return vybranaKategoria.atributy.map( (atribut,index) =>{
                i= i+1;     
                if(atribut != undefined &&  atribut.typ!=="date" && atribut.typ!=="dateinterval"){  
                    return  <div key = {index} className = "form-group">
                            {renderAtribut(i,`atrbut${i}`,atribut.nazov,atribut.typ,atribut.nazov,
                            formData.hodnoty,formData.hodnoty[i].hodnota,atribut.enumerate,"hodnota","hodnota")}       
                            </div>
                }
                else{
                    if(atribut.typ==="date"){
                        i= i+1;
                        return <div key = {index} className = "form-group"> 
                                    {renderAtribut(i-1,"date",atribut.nazov,atribut.typ,atribut.nazov,formData.hodnoty,formData.hodnoty[i-1].hodnota)}
                                    {renderAtribut(i,"pridaj do kalendára","Pridaj do kalendára","checkbox",atribut.nazov,formData.hodnoty,formData.hodnoty[i].hodnota)}
                                </div>
                        }
                        else{
                            if(atribut.typ==="dateinterval"){
                                i= i+2;
                                return <div key = {index} className = "form-group"> 
                                            <label>{atribut.nazov}: </label>
                                            <br></br>
                                            {renderAtribut(i-2,"dateinterval","Začiatok","date",atribut.nazov,formData.hodnoty,formData.hodnoty[i-2].hodnota)}
                                            {renderAtribut(i-1,"dateinterval","Koniec","date",atribut.nazov,formData.hodnoty,formData.hodnoty[i-1].hodnota)}
                                            {renderAtribut(i,"pridaj do kalendára","Pridaj do kalendára","checkbox",atribut.nazov,formData.hodnoty,formData.hodnoty[i].hodnota)}             
                                       </div>
                            }
                        }  
                    }   
            })
        }   
    }

    function zobrazKategorie(update){
        return (Object.keys(formData)).map( (kat,index) =>{   
             if (kat === "externeLinky"){
                  return externeLinky()
             }
             if(kat === "prilohy"){
                 return  <div key = {index}> 
                 <div  className = "form-group">
                      <input type = "file" name= {kat} className="form-uncontrol" 
                         onChange={handleChange} multiple/>
                      </div>
                      {update=== true? prilohy():""}
                      </div >
              }
              if(kat === "klucoveSlova"){ 
                 return <div key = {index}>  Klucove slova {zobrazVybraneKlucoveSlova()} </div>;
              }
              if(kat === "interneLinky"){
                 return interneLinky();
              }
              if(kat === "komentare"){
                 return komentare();
              }                                
         })                                              
     }



return(
    <div>
        {console.log(formData)}
            <Klucoveslova slova={pridajSlovaKzaznamu} update={props.update} slovaZaznamu={formData.klucoveSlova} odp ={props.odporucaneSlova}/>      
            <div className = "container">
                    <div className = "row">
                        <div className = "card col-md-6 offset-md-3 offset-md-3">
                           <h3 className="text-center"> {props.update? "Uprav" :"Pridaj"} {props.vybranaKategoria!== undefined? 
                                                                                            props.vybranaKategoria.nazov:""} </h3>
                            <div className = "card-body">
                                <form>                 
                                    {zobrazAtributy(props.vybranaKategoria)}
                                    {zobrazKategorie(props.update)}

                                    <button type = "button" className="btn btn-primary"  
                                            onClick={() => {
                                                let pom = formData.externeLinky
                                                pom.push({url:'',komentar: ''})
                                                setFormData(stare => { return {...stare, externeLinky:pom}})
                                                props.posliData("form", formData)
                                            }} 
                                            style={{float: "right"}} >  
                                    Pridaj ExternýLink
                                    </button>
                                    <br></br>
                                    <br></br>
                                    <button type = "button" className="btn btn-primary"  
                                            onClick={() => {
                                                let pom = formData.interneLinky
                                                pom.push({idCiela: '',idKategorie: '', zaznamy: [], komentar: ''})
                                                setFormData(stare => { return {...stare, interneLinky:pom}})
                                                props.posliData("form", formData)
                                            }} 
                                            style={{float: "right"}} >  
                                    Pridaj InternýLink
                                    </button>
                                    <br></br>
                                    <br></br>
                                    <button type = "button" className="btn btn-primary"  
                                            onClick={() => {
                                                let pom = formData.komentare
                                                pom.push({obsah: ''})
                                                setFormData(stare => { return {...stare, komentare:pom}})
                                                props.posliData("form", formData)
                                            }} 
                                            style={{float: "right"}} >  
                                    Pridaj Komentár
                                    </button>
                                    <br></br>
                                    <br></br>
                                    {props.update === true ? 
                                        <>
                                            {props.zistiZmenene()} 
                                        </> :""  }   
                                    <Pop ulozZaznam={props.ulozZaznam}/>     
                                </form>     
                            </div>
                        </div>
                    </div>

               </div>                      
    </div>
)
}