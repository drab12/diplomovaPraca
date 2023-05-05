import axios from 'axios';

const url = "http://localhost:8072/api/";

 class Spojenie {


    // ZAZNAMY

    getZaznamy(){
        return axios.get(url + "zaznamy");
    }
    getZaznamById(zaznamId){
        return axios.get(url + "zaznamy/" + zaznamId);
    }
    vytvorZaznam(zaznam){
        return axios.post(url + "zaznamy", zaznam);
    }
    updateZaznam(zaznam, zaznamId){
        return axios.put(url + 'zaznamy/' + zaznamId, zaznam);
    }
    vymazZaznam(zaznamId){
        return axios.delete(url + 'zaznamy/' + zaznamId);
    }
    odkazyNa(zaznamId){
        return axios.get(url + "zaznamy/odkazyna/" + zaznamId);
    }
    odkazyOd(zaznamId){
        return axios.get(url + "zaznamy/odkazyod/" + zaznamId);
    }
    getZaznamKategoria(katId){
        return axios.get( url + "zaznamy/kategoria/" + katId);
    }
    getZaznamHladane(hladany){
        return axios.get(url + "zaznamy/hladane/"  +hladany);
    }
    getZaznamHladanePoznamky(hladany){
        return axios.get( url + "zaznamy/hladane/poznamky/"  +hladany);
    }
    getZaznamyHladaneCNF(hladany){
        return axios.get(url + "zaznamy/hladane/cnf/"  +hladany);
    }
    vytvorSubor(zaznam){
        return axios.post( url + "subor",zaznam)
    }



// KLUCOVE SLOVA
    
    getKlucoveSlova(){
       return axios.get( url + "klucove");
    }
    getKlucoveSlovaList(){
        return axios.get( url + "klucove/list");
    }
    pridajKlucoveSlovo(slovo){
       return axios.post( url + "klucove",slovo);
    }
    updateKlucove(klucoveId){
        return axios.put( url + "klucove/" ,klucoveId);
    }
    vymazKlucove(klucoveId){
        return axios.delete(url + "klucove/" + klucoveId);
    }
    getOdporucane(zaznam){
        return axios.post( url + "klucove/odporucane",zaznam);
    }


// KATEGORIE

    getKategorie(){
      return  axios.get( url + "kategorie");
    }
    getKategoriaById(katId){
        return axios.get( url + "kategorie/" +katId);
    }
    vytvorKategoriu(kategoria){
        return axios.post(url + "kategorie", kategoria);
    }
    updateKategoria(kategoria,kategoriaId){
        return axios.put(url + "kategorie/" + kategoriaId,kategoria);
    }
    vymazKategorie(kategoriaId){
        return axios.delete(url + "kategoria/" + kategoriaId);
    } 
    
    
//  ATRIBUT

    pridajAtribut(kategoriaId,pocet){
        return axios.put(url + "pridajatributy/" + kategoriaId,pocet);
    }
    vymazAtribut(atributId){
        return axios.delete( url +"vymazatributy/" + atributId);
    }

//  KALENDAR

    getKalendar(){
        return  axios.get(url + "kalendar");
    }
    vymazKalendar(eventId){
        return axios.delete(url + "kalendar/" + eventId);
    }
    
    getNastavenia(id){
        return  axios.get(url + "odporucane/" + id);
    }
    updateNastavenia(nastavenia,id){
        return  axios.put(url + "odporucane/" + id,nastavenia);
    }




    vymazKomentar(komentId){
        return axios.delete(url + "komentar/" + komentId);
    }
    vymazInterny(internyId){
        return axios.delete(url + "interny/" + internyId);
    }
    vymazExterny(externyId){
        return axios.delete(url + "externy/" + externyId);
    }
    vymazPrilohu(prilohaId){
        return axios.delete(url + "priloha/" + prilohaId);
    }

}

export default new Spojenie()