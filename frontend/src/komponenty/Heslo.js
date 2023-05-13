import React, { useState} from 'react'
import Spojenie from '../spojenie/Spojenie'

export default function Heslo (){

    const [heslo, setHeslo] = useState({nove:'', opakovane:''})
    const [chyba, setChyba] = useState(false);

    function handleChange(event){
        let meno = event.target.name
        let hodnota = event.target.value
        setHeslo(stare => { return{...stare,[meno]:hodnota}})
    }
    function uloz (e){
        e.preventDefault();
        if(heslo.nove === heslo.opakovane){
            let form = new FormData  
            form.append("heslo", heslo.nove)
            Spojenie.nastavHeslo(form).then(res =>{
                window.location.href= "/"
            })
        }
        else{
            setChyba(true)
        }

    }
    

    function zmenHeslo(){
        return <div>
                <label> Nove heslo </label>
                <input className="form-control"
                            placeholder= "Zadajte nové heslo"
                            type = "password"
                            name= "nove"
                            value={heslo.nove} onChange={handleChange}
                               />
                 <label> Zopakované heslo </label>               
                <input className="form-control"
                               placeholder= "Opakujte heslo"
                               type = "password"
                               name= "opakovane"
                               value={heslo.opakovane} onChange={handleChange}
                               />
                               <br></br>
            <button className="btn btn-primary" type = "button" onClick= {uloz}> Ulož</button> 
        </div>
    }
    return (
        <div> 
           
           {sessionStorage.getItem('jwt')!=null ?                               
                <div className = "container">
                      <br></br>     
                    <div className = "row">
                        <div className = "card col-md-6 offset-md-3 offset-md-3">
                            <h3 className="text-center"> Zmena Hesla</h3>
                            <div className = "card-body">
                                {zmenHeslo()}
                                {chyba=== true?<div className='chyba'>Heslo nie je rovnaké</div>:""} 

                            </div>
                        </div>
                    </div>
                </div>
           : window.location.href="/" }
        </div>
    )

}