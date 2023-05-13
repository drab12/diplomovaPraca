import React, { useState } from 'react'
import ListZaznam from './ListZaznam';

export default function Prihlasovanie (){

    const [user, setUser] = useState({username:'', password:''})
    const [prihlaseny, setPrihlaseny] = useState(false);
    const [chyba, setChyba] = useState(false);

    function handleChange(event){
        let meno = event.target.name
        let hodnota = event.target.value
        setUser(stare => { return{...stare,[meno]:hodnota}})
    }

    function prihlas(){
        fetch('http://localhost:8072/' + 'login', {    
            method: 'POST',    
            body: JSON.stringify(user)})  
            .then(res => {    
               
                const jwtToken = res.headers.get('Authorization');    
                if (jwtToken !== null) { 
                    sessionStorage.setItem("jwt", jwtToken); 
                    setPrihlaseny(true);    
                } 
                else{
                    setChyba(true)
                }
            })  
            .catch(err => {
                console.error(err)
                
            }) 
    }

    function prihlasenie(){
        return <div>
                <label> Meno </label>
                <input className="form-control"
                               placeholder= "Zadajte meno užívateľa" 
                               name= "username"
                               value={user.username} onChange={handleChange}
                               />
                 <label> Heslo </label>               
                <input className="form-control"
                               placeholder= "Zadajte heslo"
                               type = "password"
                               name= "password"
                               value={user.password} onChange={handleChange}
                               />
                               <br></br>
            <button className="btn btn-primary" type = "button" onClick= {prihlas}> login</button> 
        </div>
    }

    return (
        <div> 
           
           {sessionStorage.getItem('jwt')!=null ? <ListZaznam/> :                               
                <div className = "container">
                      <br></br>     
                    <div className = "row">
                        <div className = "card col-md-6 offset-md-3 offset-md-3">
                            <h3 className="text-center"> Prihlásenie</h3>
                            <div className = "card-body">
                                {prihlasenie()}
                                {chyba=== true?<div className='chyba'>Zlé meno alebo heslo</div>:""} 

                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )

}