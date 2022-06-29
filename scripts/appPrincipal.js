import { crearAnuncio } from './anuncioDinamico.js';
import {cargarSpinner, eliminarSpinner} from './anunciosAcceso.js';

const URL_ANUNCIOS = "http://localhost:3000/anuncios";
const URL_SPINNER_GIF = "./imagenes/spinning-wheel.gif";
const SPINNER_CONTAINER = ".spinner-container";


initialize(URL_ANUNCIOS);

function initialize (url){

    cargarSpinner(SPINNER_CONTAINER, URL_SPINNER_GIF);

    fetch(url)
    .then((res)=>{

        if(res.ok){
            //esto devuelve una promesa, por eso necesitamos otro bloque de then.
            return res.json();
        } else {
            return Promise.reject(res);
        }
    })
    .then((data)=>{
        const $main = document.querySelector(".main");

        data.forEach(anuncio => {
            const $divAnuncio = crearAnuncio(anuncio);
        
            $main.appendChild($divAnuncio);
        
        });

        console.log(data);
        return data;
    })
    .catch((err)=>{
        console.error(err.status, err.statusText);
    })
    .finally(()=>{
        eliminarSpinner(SPINNER_CONTAINER);
    });
}