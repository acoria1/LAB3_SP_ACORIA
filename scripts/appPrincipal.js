import { crearAnuncio } from './anuncioDinamico.js';
import {getAnuncios, getAnuncio,postAnuncio, deleteAnuncio, updateAnuncio, getAnunciosPorTipo, getAnunciosAjax} from './anunciosAcceso.js';

const URL_ANUNCIOS = "http://localhost:3000/anuncios";
const URL_SPINNER_GIF = "./imagenes/spinning-wheel.gif";
const SPINNER_CONTAINER = ".spinner-container";

//Cargar anuncios

let anuncios = await getAnuncios(URL_ANUNCIOS, SPINNER_CONTAINER, URL_SPINNER_GIF);

const $main = document.querySelector(".main");

//Agregar una div por cada anuncio
anuncios.forEach(anuncio => {
    const $divAnuncio = crearAnuncio(anuncio);

    $main.appendChild($divAnuncio);

});


// Cuando se presiona el botón de ver vehiculo
window.addEventListener("click", (e) => {
    if (e.target.matches("button")) {
        
        let currentID = e.target.parentElement.id;

        console.log(e.target.parentElement);

        const anuncioSeleccionado = anuncios.find((anuncio) => anuncio.id == currentID);

        alert("El Vehiculo seleccionado tiene id:" + currentID);
    }
})