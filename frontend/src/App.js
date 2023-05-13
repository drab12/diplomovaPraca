import './App.css';
import {HashRouter, Route, Routes} from 'react-router-dom'
import ListZaznam from './komponenty/ListZaznam';
import Hlavicka from './komponenty/Hlavicka';
import Paticka from './komponenty/Paticka';
import PridajZaznam from './komponenty/PridajZaznam';
import UpdateZaznam from './komponenty/UpdateZaznam';
import DetailZaznam from './komponenty/DetailZaznam';
import UpdateKlucoveSlova from './komponenty/UpdateKlucoveSlova';
import PridajKategoria from './komponenty/PridajKategoria';
import UpravKategoria from './komponenty/UpravKategoria';
import Prihlasovanie from './komponenty/Prihlasovanie';
import Heslo from './komponenty/Heslo';

function App() {
  return (
    <div>
        <HashRouter>
        <Hlavicka />
                <div className="container rout">
              
                
                    <Routes> 
                          <Route path = "/" exact element = {<Prihlasovanie />}/>
                          <Route path = "/zaznamy" element = {<ListZaznam />}/>
                          <Route path = "/pridajZaznam/:id" element = {<PridajZaznam/>}/>
                          <Route path = "/updateZaznam/:id" element = {<UpdateZaznam/>}/>
                          <Route path = "/detail/:id" element = {<DetailZaznam/>}/>
                          <Route path = "/updateklucove" element = {<UpdateKlucoveSlova/>}/>
                          <Route path = "/pridajkategoriu" element = {<PridajKategoria/>}/>
                          <Route path = "/upravkategoriu/:id" element = {<UpravKategoria/>}/>
                          <Route path = "/heslo" element = {<Heslo/>}/>
                          
                        
                    </Routes>
                   
              
                </div>
                <Paticka/>
        </HashRouter>
        </div>
  );
}

export default App;
