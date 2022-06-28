
import { updateTable, addSelectColumnas} from './tablaDinamica.js';
import { sortObjects } from './funcionesAdicionales.js';
import {getAnuncios, getAnuncio,postAnuncio, deleteAnuncio, updateAnuncio, getAnunciosPorTipo, getAnunciosAjax, postAnuncioAjax, updateAnuncioAjax} from './anunciosAcceso.js';
import Anuncio_Auto from './anuncio.js';

const URL_ANUNCIOS = "http://localhost:3000/anuncios";
const URL_SPINNER_GIF = "./imagenes/spinning-wheel.gif";
const SPINNER_CONTAINER = ".table-container";


// Initialize Form
const $frmAnuncio = document.forms[0];
setFormAlta();

let anuncios = await getAnuncios(URL_ANUNCIOS, SPINNER_CONTAINER, URL_SPINNER_GIF);
const columnasOcultas = [];

//Create table
actualizarTablaAnuncios(anuncios,undefined,"sort-ascending");

//Add checkbox to filter columns
addSelectColumnas(document.querySelector('.table-selects'),anuncios);


$frmAnuncio.addEventListener("submit", (e) => {

    e.preventDefault();

    const anuncioDelForm = new Anuncio_Auto(
        $frmAnuncio.id.value, 
        $frmAnuncio.titulo.value,
        $frmAnuncio.transaccion.value,
        $frmAnuncio.descripcion.value,
        parseFloat($frmAnuncio.precio.value),
        parseInt($frmAnuncio.puertas.value),
        parseInt($frmAnuncio.kms.value),
        parseInt($frmAnuncio.potencia.value))

    if (anuncioDelForm.id === "") {

        //add
        //postAnuncio(URL_ANUNCIOS, anuncioDelForm, SPINNER_CONTAINER, URL_SPINNER_GIF);
        postAnuncioAjax(URL_ANUNCIOS, anuncioDelForm, SPINNER_CONTAINER, URL_SPINNER_GIF);


    } else {
        //update
        //updateAnuncio(URL_ANUNCIOS,anuncioDelForm,SPINNER_CONTAINER,URL_SPINNER_GIF);
        updateAnuncioAjax(URL_ANUNCIOS,anuncioDelForm,SPINNER_CONTAINER,URL_SPINNER_GIF);
        //
    }
})



window.addEventListener("click", async (e) => {
    if (e.target.matches("tr td")) {
        
        let currentID = e.target.parentElement.dataset.id;

        const anuncioSeleccionado = anuncios.find((anuncio) => anuncio.id == currentID);

        //load selected row into form
        loadForm(anuncioSeleccionado, $frmAnuncio);

        setFormModificar();

        //scroll to form
        document.getElementById('anuncios').scrollIntoView();

    } else if (e.target.matches("#btnCancelar")){

        setFormAlta();

    } else if(e.target.matches("#btnEliminar")){

        //handlerDelete(parseInt($frmAnuncio.id.value), anuncios, "anuncios");
        deleteAnuncio(URL_ANUNCIOS,$frmAnuncio.id.value,SPINNER_CONTAINER,URL_SPINNER_GIF);

    } else if (e.target.matches('.table-checkbox')){
        let columna = e.target.value;
        //FILTRAR COLUMNAS
        if(!e.target.checked){

            //QUITAR COLUMNA
            columnasOcultas.push(columna);
            anuncios = filtrarColumnasEnTable(anuncios,columnasOcultas);

            actualizarTablaAnuncios(anuncios);

        } else {

            //AGREGAR COLUMNA
            let index = columnasOcultas.indexOf(columna);
            columnasOcultas.splice(index, 1);
            anuncios = await getAnuncios(URL_ANUNCIOS, SPINNER_CONTAINER, URL_SPINNER_GIF);

            anuncios = filtrarColumnasEnTable(anuncios,columnasOcultas);

            actualizarTablaAnuncios(anuncios);

        }
    } else if (e.target.matches('#btnFiltrar')) {
        //
        let filtrarPor = document.getElementById("filtroTransacciones").value;

        //get por tipo
        anuncios = await getAnunciosPorTipo(URL_ANUNCIOS, SPINNER_CONTAINER, URL_SPINNER_GIF, filtrarPor);

        //volver a aplicar filtros de columnas
        anuncios = filtrarColumnasEnTable(anuncios,columnasOcultas);

        //actualizar tabla
        actualizarTablaAnuncios(anuncios);
        
        //Get textbox de promedio:
        txtPromedio = document.getElementById('txtPromedio');

        //calcular y mostrar promedio
        if(filtrarPor == 'Alquiler' || filtrarPor == 'Venta'){
            let avgPrecio = calcularPromedio(anuncios);
            txtPromedio.value = avgPrecio;
        } else {
            txtPromedio.value = "N/A";
        }        
    }
})

function calcularPromedio(anuncios) {
    return anuncios.reduce((avg, anuncio, _, { length }) => {
        return avg + anuncio.precio / length;
      }, 0);
}


/**
 * 
 * @param {*} nuevoTexto Modifies Form Header
 */
function modificarHeader (nuevoTexto){

    const el = document.querySelector(".form-container h2");
    el.textContent = nuevoTexto;

}


/**
 * 
 * @param {*} instance to load form with
 * @param {*} $form form to be loadad with data
 * NOTE: instance keys and form elements must have matching names.
 */
function loadForm(instance, $form) {

    const elements = $form.elements;

    for (const key in instance) {
        elements[key].value = instance[key];
    }
}


/**
 * 
 * @param {array} anuncios 
 * @param {array} sortStates
 * @returns 
 */
function actualizarTablaAnuncios(anuncios, sortStates, defaultSortState = "sort-ascending"){

    // remove table rows
    const $container = document.querySelector(".table-container");
    while ($container.children.length > 0) {
        $container.removeChild($container.firstElementChild);
    }

    const $tablaAnuncios = updateTable(".table-container", anuncios);

    if(anuncios.length === 0){

        handlerTablaVacia();

    } else {
        //Bootstrap classes
        $tablaAnuncios.classList.add("table");
        $tablaAnuncios.classList.add("table-striped");
        $tablaAnuncios.classList.add("table-hover");
        $tablaAnuncios.classList.add("table-bordered");
        $tablaAnuncios.classList.add("table-responsive");
    }

    if (sortStates === undefined){
        sortStates = [];
        let length = $tablaAnuncios.querySelectorAll("th").length;
        for (let index = 0; index < length; index++) {
            sortStates.push(defaultSortState);            
        }
    } 

    addSortableColumns($tablaAnuncios, anuncios, sortStates);


    return $tablaAnuncios;
}


/**
 * 
 * @param {*} anuncios 
 * @param {*} columnasOcultas todas las columnas a ocultar
 * @param {*} sortStates estados de sorting de cada columna
 * @param {*} defaultSortState sort-ascending descending
 * @returns 
 */
function filtrarColumnasEnTable(anuncios, columnasOcultas, sortStates = undefined, defaultSortState = "sort-ascending"){

    const anunciosFiltrados = anuncios.map((anuncio) => {
        return {...anuncio}
    });

    anunciosFiltrados.forEach(anuncio => {
        columnasOcultas.forEach(nombreColumna => {
            delete anuncio[nombreColumna];            
        });
    });

    return anunciosFiltrados;
 }


/**
 * Function will add sort function to each header cell on click event.
 * Note that column innerHTML value should match key of objects to be sorted. i.e. "email"
 * @param {DOM Table} $table 
 * @param {Array} anuncios employees array
 */
function addSortableColumns($table, anuncios, sortStates){
    document.querySelectorAll(".table-container table th").forEach(headerCell => {
        headerCell.addEventListener("click", () => {
            
            //sort objects by column name, ascending or descending will depend on the class the table header has
            sortObjects(
                anuncios,
                headerCell.innerHTML, 
                (headerCell.classList.contains("sort-ascending"))
            );

            // switch ascending-descending state of the table header          
            switchElementSortState(headerCell,"sort-ascending","sort-descending");

            const states = [];

            headerCell.parentNode.querySelectorAll("th").forEach(th => {
                states.push(th.className);
            });        

            actualizarTablaAnuncios(anuncios, states, "sort-ascending"); 
            
        })
    })

    initializeSortStates(sortStates);
    
}


function switchElementSortState($el, state1, state2){
    if($el.classList.contains(state1) || $el.classList.contains(state2)){
        $el.classList.toggle(state1);
        $el.classList.toggle(state2);
    } 
}


function initializeSortStates (states){
    const headers = document.querySelectorAll(".table-container table th");
    //
    for (let i = 0; i < headers.length; i++) {
        headers[i].classList.add(states[i]);
    }
    //
}

function handlerTablaVacia(){
    const $tableSection = document.querySelector(".table-container");
    const $h3 = document.createElement("h3");
    const $h3Text = document.createTextNode("Tabla vacia");
    $h3.appendChild($h3Text);

    $tableSection.appendChild($h3);
}


/**
 * Deshabilita botones de alta y habilita botones para modificar/eliminar
 */
function setFormModificar(){
    modificarHeader("Editar Anuncio");

    document.getElementById('btnAlta').disabled = true;
    document.getElementById('btnModificar').disabled = false;
    document.getElementById('btnEliminar').disabled = false;
}


/**
 * Deshabilita botones para modificar/eliminar y habilita botones de alta
 */
function setFormAlta(){
    modificarHeader("Alta Anuncio");

    document.getElementById('btnAlta').disabled = false;
    document.getElementById('btnModificar').disabled = true;
    document.getElementById('btnEliminar').disabled = true;

    $frmAnuncio.reset();
}






