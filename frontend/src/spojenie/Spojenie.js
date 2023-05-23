import axios from 'axios';
import prihlasToken from './prihlasToken';
const url = "http://localhost:8072/api/";
 class Spojenie {


    // ZAZNAMY

    getZaznamy(){
        return axios.get(url + "zaznamy",{ headers: prihlasToken() });
    }
    getZaznamById(zaznamId){
        return axios.get(url + "zaznamy/" + zaznamId, { headers: prihlasToken()});
    }
    vytvorZaznam(zaznam){
        return axios.post(url + "zaznamy", zaznam, { headers: prihlasToken() });
    }
    updateZaznam(zaznam, zaznamId){
        return axios.put(url + 'zaznamy/' + zaznamId, zaznam, { headers: prihlasToken() });
    }
    vymazZaznam(zaznamId){
        return axios.delete(url + 'zaznamy/' + zaznamId, { headers: prihlasToken() });
    }
    odkazyNa(zaznamId){
        return axios.get(url + "zaznamy/odkazyna/" + zaznamId,{ headers: prihlasToken() });
    }
    odkazyOd(zaznamId){
        return axios.get(url + "zaznamy/odkazyod/" + zaznamId,{ headers: prihlasToken() });
    }
    getZaznamKategoria(katId){
        return axios.get( url + "zaznamy/kategoria/" + katId,{ headers: prihlasToken() });
    }
    getZaznamHladane(hladany){
        return axios.get(url + "zaznamy/hladane/"  +hladany,{ headers: prihlasToken() });
    }
    getZaznamHladanePoznamky(hladany){
        return axios.get( url + "zaznamy/hladane/poznamky/"  +hladany,{ headers: prihlasToken() });
    }
    getZaznamyHladaneCNF(hladany){
        return axios.get(url + "zaznamy/hladane/cnf/"  +hladany,{ headers: prihlasToken() });
    }
    vytvorSubor(zaznam){
        return axios.post( url + "subor",zaznam,{ headers: prihlasToken() })
    }



// KLUCOVE SLOVA
    
    getKlucoveSlova(){
       return axios.get( url + "klucove",{ headers: prihlasToken() });
    }
    getKlucoveSlovaList(){
        return axios.get( url + "klucove/list",{ headers: prihlasToken() });
    }
    pridajKlucoveSlovo(slovo){
       return axios.post( url + "klucove",slovo,{ headers: prihlasToken() });
    }
    updateKlucove(klucoveId){
        return axios.put( url + "klucove/" ,klucoveId,{ headers: prihlasToken() });
    }
    vymazKlucove(klucoveId){
        return axios.delete(url + "klucove/" + klucoveId, { headers: prihlasToken() });
    }
    getOdporucane(zaznam){
        return axios.post( url + "klucove/odporucane",zaznam,{ headers: prihlasToken() });
    }


// KATEGORIE

    getKategorie(){
      return  axios.get( url + "kategorie",{ headers: prihlasToken() });
    }
    getKategoriaById(katId){
        return axios.get( url + "kategorie/" +katId, { headers: prihlasToken() });
    }
    vytvorKategoriu(kategoria){
        return axios.post(url + "kategorie", kategoria,{ headers: prihlasToken() });
    }
    updateKategoria(kategoria,kategoriaId){
        return axios.put(url + "kategorie/" + kategoriaId,kategoria,{ headers: prihlasToken() });
    }
    vymazKategorie(kategoriaId){
        return axios.delete(url + "kategoria/" + kategoriaId,{ headers: prihlasToken() });
    } 
    
    
//  ATRIBUT

    pridajAtribut(kategoriaId,pocet){
        return axios.put(url + "pridajatributy/" + kategoriaId,pocet,{ headers: prihlasToken() });
    }
    vymazAtribut(atributId){
        return axios.delete( url +"vymazatributy/" + atributId,{ headers: prihlasToken() });
    }

//  KALENDAR

    getKalendar(){
        return  axios.get(url + "kalendar",{ headers: prihlasToken() });
    }
    vymazKalendar(eventId){
        return axios.delete(url + "kalendar/" + eventId,{ headers: prihlasToken() });
    }
    
    getNastavenia(id){
        return  axios.get(url + "odporucane/" + id,{ headers: prihlasToken() });
    }
    updateNastavenia(nastavenia,id){
        return  axios.put(url + "odporucane/" + id,nastavenia,{ headers: prihlasToken() });
    }


    nastavHeslo(heslo){
        return axios.put(url + "noveheslo",heslo, { headers: prihlasToken() })
    }




    vymazKomentar(komentId){
        return axios.delete(url + "komentar/" + komentId,{ headers: prihlasToken() });
    }
    vymazInterny(internyId){
        return axios.delete(url + "interny/" + internyId,{ headers: prihlasToken() });
    }
    vymazExterny(externyId){
        return axios.delete(url + "externy/" + externyId,{ headers: prihlasToken() });
    }
    vymazPrilohu(prilohaId){
        return axios.delete(url + "priloha/" + prilohaId,{ headers: prihlasToken() });
    }

}

export default new Spojenie()