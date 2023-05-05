import React, { useState,useEffect } from 'react'
import Spojenie from '../spojenie/Spojenie';
import pencil from '../obrazky/pencil.png';
import trash from '../obrazky/trash3.png';
import Pop from './Pop';

export default function UpdateKlucoveSlova(){
const [klucoveSlova,setKlucoveSlova]  = useState([]);
const [noveSlovo,setNoveSlovo]        = useState({})
const [upravKlucove, setUpravKlucove] = useState([])
const [noveSlova , setNoveSlova]              = useState({vid:[], pocet:0, vymaz:[],nazvy:[]});
const [klucoveList,setKlucoveList]    = useState([])
let pocet =-1;

useEffect(()=>{
    Spojenie.getKlucoveSlova().then( res =>{
        setKlucoveSlova(res.data);
    });

    Spojenie.getKlucoveSlovaList().then( res =>{
        let pole ={pol:[], nazvy:[]}
        for(let i=0; i< res.data.length; i++){
            pole.pol.push(false)
            pole.nazvy.push("")
        }
        setNoveSlova(stare => { return{...stare,vid: pole.pol, pocet:res.data.length, nazvy:pole.nazvy}})  
        setKlucoveList(res.data);
    });
    
},[])

function ulozZaznam (e){
    e.preventDefault();
    if(upravKlucove.length>0){
        Spojenie.updateKlucove(upravKlucove).then( res=>{

        })
    }
    if(noveSlova.vymaz.length>0){
        Spojenie.vymazKlucove(noveSlova.vymaz).then(res =>{

        })
    }  
    window.location.href= "/"
}

function pridajKlucoveSlovo(e){
    e.preventDefault(); 
    Spojenie.pridajKlucoveSlovo(noveSlovo).then( res =>{
        setKlucoveSlova(res.data);
        Spojenie.getKlucoveSlovaList().then( r =>{
            setKlucoveList(r.data);
        });  
    
    });
   
    let pole = noveSlova
    for(let i=0; i< noveSlova.vymaz.length +1;i++){
        pole.vid.push(false)
    }
    pole.nazvy.push(noveSlovo.nazovKlucovehoSlova)
    pole.pocet++;
    pole.vymaz = []
    setNoveSlova(pole)  
}

function zmeneneData(){
    if(noveSlova.vymaz.length >0 || upravKlucove.length>0){
        return <h1 className='chyba'> Dáta je potrebné uložiť</h1>
    }
}

function handleChange(event){
        let meno = event.target.name
        let hodnota = event.target.value
        let index = event.target.id

        if(meno.includes("slovo")){
            let pole = upravKlucove
            let rodic = meno.substring(parseInt(meno.indexOf('s')) +5 ,meno.length);
            let idecko = meno.substring(0,meno.indexOf('s'))
            let slovo = {id: index, nazovKlucovehoSlova:hodnota,idRodica: rodic}
            const id = upravKlucove.findIndex(prvok => prvok.id === slovo.id);
            if (id > -1) {
                pole[id].nazovKlucovehoSlova = hodnota
            }
            else{
                pole.push(slovo)
            
            }
            let nazov = noveSlova.nazvy
            nazov[idecko]= hodnota
            setUpravKlucove(pole)
            setNoveSlova(stare => { return{...stare,nazvy:nazov}})

        }
        else{
            if(meno=="nazovKlucovehoSlova" || meno =="idRodica"){
                setNoveSlovo( stareData => {
                return { ...stareData,[meno]: hodnota  }})
            }
        }
}


function vnorSa(slovo,idHladaneho,pole,zmaz,zmazane){
    if(slovo.deti.length > 0 ){
        prehladajStromKlucovychSlov(slovo.deti,idHladaneho,pole,zmaz,zmazane)      
    }
}

function prehladajStromKlucovychSlov(klucove,idHladaneho,pole,zmaz,zmazane){
    if(klucoveSlova !== undefined){
        for(let i=0; i<klucove.length; i++){

            if(zmaz){
                if(klucove[i].id === idHladaneho){
                    klucove[i].deti = pole
                    break
                }
            }
            else{
                if(klucove[i].id === idHladaneho  || klucove[i].idRodica ===idHladaneho){
                    zmazane.push(klucove[i].id)
                    setNoveSlova(stare => { return{...stare,vymaz:zmazane}})
                }
            } 
                 
            if(klucove[i].deti.length > 0){   
                let rodic = idHladaneho; 
                if(zmaz){
                    vnorSa(klucove[i],idHladaneho,pole,true,zmazane)
                }
                else{
                    if(klucove[i].idRodica !== null && klucove[i].idRodica === idHladaneho){       
                        rodic = klucove[i].id
                    }
                    vnorSa(klucove[i],rodic,pole,false,zmazane)
                }
            } 
        }
    }
}


function vymaz(index,pole,id,pocet){
    let zmaz = noveSlova.vymaz;
    let rodic = pole[0].idRodica
   
    pole = pole.filter((item, i) => i !== index);
    
    if(rodic!== null){
       prehladajStromKlucovychSlov(klucoveSlova,id,pole,false,zmaz)
       prehladajStromKlucovychSlov(klucoveSlova,rodic,pole,true,zmaz)
       vymaz("XXX",klucoveSlova,id,pocet)    
    }
    else{
       prehladajStromKlucovychSlov(klucoveSlova,id,pole,false,zmaz)
       let nazov = noveSlova.nazvy
       let pom = noveSlova.vid    
       let uprav = upravKlucove 
       if(noveSlova.vid.length + noveSlova.vymaz.length !== noveSlova.pocet+1){  
            let cyklus = (noveSlova.vid.length +noveSlova.vymaz.length) - noveSlova.pocet
            pocet = pocet + (cyklus-1);
            for(let j=cyklus; j>0 ;j--){
                nazov = nazov.filter((item, i) => i !== pocet);
                pom = pom.filter((item, i) => i !== pocet);
                pocet = pocet-1
                uprav = uprav.filter((item,i) => parseInt(item.id) !==noveSlova.vymaz[j-1])
            }
       }
       else{
            nazov = nazov.filter((item, i) => i !== pocet);
            pom = pom.filter((item, i) => i !== pocet);
            uprav = uprav.filter((item,i) => parseInt(item.id) !==noveSlova.vymaz[noveSlova.vymaz.length-1])
       }
        setNoveSlova(stare => { return{...stare,vid: pom, nazvy: nazov}})
        setKlucoveSlova(pole)
        setUpravKlucove(uprav)   
    }
}

function uprav(child,idecko){
    return <input id = {child.id}   placeholder= {child.nazovKlucovehoSlova} name= {`${idecko}slovo${child.idRodica}`}className="form-control" 
    value = {noveSlova.nazvy[idecko]} onChange={handleChange}  style= {{width: '200px', marginRight:'5px', marginLeft:'5px'}}/>
}


function rekurzivneZobrazSlovo(slovo,cislo,ind,rodic){
    pocet = pocet+1; 
    let idecko = pocet
    let rodic2 = rodic.deti
    if(rodic.deti === undefined){
        rodic2 = rodic
    }
    if( noveSlova.nazvy[idecko] == "" && noveSlova.vid[idecko] == false){
        noveSlova.nazvy[idecko]  = slovo.nazovKlucovehoSlova
    }
    return <div key ={ind} >
        <p  className="" style={{marginBottom: '0px',fontSize: '20px',marginLeft: `${cislo}px`, marginBottom: '0px',fontWeight: 'bold' }}> 
            {slovo.nazovKlucovehoSlova} 
            {noveSlova.vid[idecko] ===false? 
        
                        <button className="btn btn-info upravTlacidlo" type = "button"      
                                onClick= {() => { 
                                        let pole = noveSlova.vid;
                                        pole[idecko] = true;
                                        setNoveSlova( stare => { return{...stare,vid: pole}}) }} >
                                <img className= "obrazok" src={pencil}  /> 
                        </button> 
            : uprav(slovo,idecko)}

            <button className="btn btn-danger upravTlacidlo"
                    type = "button"  
                    onClick= {() => vymaz(ind,rodic2,slovo.id,idecko)}> 
                    <img className= "obrazok" src={trash}   />
            </button> 
        </p>      
                {slovo.deti?.map((dieta,index) =>  rekurzivneZobrazSlovo(dieta,cislo+ 15,index, slovo) )}         
            </div> 
}



function zobraz(){
    return  klucoveSlova.map( (slovo,index) =>
        <div key = {index}>     
          {rekurzivneZobrazSlovo(slovo,0,index, klucoveSlova )}                   
        </div>
        )     
    }

 

    function zobrazKlucoveSlova(){
       return <div>     
                      { zobraz()}
                        <div className = "form-group"> 
                            <label> Nové slovo: </label>
                               <input   placeholder= "nazov" name = "nazovKlucovehoSlova" className="form-control" 
                                value= {noveSlovo.nazov} onChange={handleChange}/>
                            <label> Rodič </label>
                                <select  name = "idRodica" className="form-control" 
                                        value={noveSlovo.idRodica} onChange={handleChange} >
                                        <option value=""></option>    
                                        {klucoveList.map((prvok, index) =>
                                        <option key={index} value={prvok.id}>{prvok.nazovKlucovehoSlova}</option>
                                        )};              
                                </select>         
                            <button className="btn btn-primary" type = "button" onClick= {pridajKlucoveSlovo}> Pridaj</button> 
                        </div>                      
              </div>
    }





return(
    
<div>   
    <br></br>  
       <div className = "container">
            <div className = "row">
                <div className = "card col-md-6 offset-md-3 offset-md-3">
                   <h3 className="text-center"> Uprav Kľúčové slová </h3>
                    <div className = "card-body">
                        <form>                         
                            {zobrazKlucoveSlova()}
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