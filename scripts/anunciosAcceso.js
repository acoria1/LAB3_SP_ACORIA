
function cargarSpinner (container, image){
    const $spinnerContainer = document.querySelector(container);

    const spinner  = document.createElement('img');
    spinner.setAttribute("src", image);
    spinner.setAttribute("alt", "...loading");

    $spinnerContainer.appendChild(spinner);    
}

function  eliminarSpinner(container){
    const $spinnerContainer = document.querySelector(container);
    while($spinnerContainer.hasChildNodes()){
        $spinnerContainer.removeChild($spinnerContainer.firstChild);
    }    
}

async function getAnuncios (url, spinnerContainer, spinnerImageUrl){

    try {
        cargarSpinner(spinnerContainer, spinnerImageUrl);       
        const res = await axios.get(url);
        return res.data;
    } catch (err) {
        console.error(err.response);
    } finally {
        eliminarSpinner(spinnerContainer);
    }
}


const getAnunciosAjax = (url, spinnerContainer, spinnerImageUrl)=>{

    // utiliza callbacks.
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = ()=>{

        if (xhr.readyState == 4){
            //terminó la respuesta y completa
            if (xhr.status >= 200 && xhr.status < 300){

                const data = JSON.parse(xhr.responseText);

                console.log(data);

            } else {
                
                console.error(xhr.status, xhr.statusText);

            }

            eliminarSpinner(spinnerContainer);

        } else {
            //todavía no terminó la respuesta
            cargarSpinner(spinnerContainer, spinnerImageUrl);       
            
        }
    };

    xhr.open("GET",url);

    xhr.send();

}


/**
 * 
 * @param {*} url url del server
 * @param {*} spinnerContainer donde se debe cargar el spinner
 * @param {*} spinnerImageUrl url de la imagen del spinner
 * @param {*} tipo Alquiler, Venta, u otro que trae todos
 * @returns 
 */
async function getAnunciosPorTipo(url, spinnerContainer, spinnerImageUrl, tipo){

    try {
        cargarSpinner(spinnerContainer, spinnerImageUrl);       
        const res = await axios.get(url);

        anuncios = res.data;

        if(tipo == 'Alquiler' || tipo == 'Venta'){
            //devolver solo alquileres o ventas
            return anuncios.filter((anuncio) => {
                return anuncio.transaccion == tipo;
            });
        } else {
            //devolver todos
            return anuncios;
        }

    } catch (err) {
        console.error(err.response);
    } finally {
        eliminarSpinner(spinnerContainer);
    }
}

// GET UNO SOLO 

async function getAnuncio (url, id, spinnerContainer, spinnerImageUrl){
        try {
            cargarSpinner(spinnerContainer, spinnerImageUrl);       
            const res = await axios.get(url + "/" + id);
            return res.data;
        } catch (err) {
            console.error(err.response);
        } finally {
            eliminarSpinner(spinnerContainer);
        }
}

//POSTS

async function postAnuncio (url, anuncio, spinnerContainer, spinnerImageUrl){

    try {
        cargarSpinner(spinnerContainer, spinnerImageUrl);       
        const res = await axios.post(url, anuncio);
        return res.data;
    } catch (err) {
        console.error(err.response);
    } finally {
        eliminarSpinner(spinnerContainer);
    }
}

const postAnuncioAjax =  (url, anuncio, spinnerContainer, spinnerImageUrl ) => {

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = ()=>{
        if (xhr.readyState == 4){
            //terminó la respuesta y completa
            if (xhr.status >= 200 && xhr.status < 300){
                const data = JSON.parse(xhr.responseText);

                console.log(data);

            } else {                
                console.error(xhr.status, xhr.statusText);
            }
            eliminarSpinner(spinnerContainer);
        } else {
            //todavía no terminó la respuesta
            cargarSpinner(spinnerContainer, spinnerImageUrl);
        }
    };

    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(anuncio));
}

// DELETES

async function deleteAnuncio (url, id, spinnerContainer, spinnerImageUrl) {
    try {
        cargarSpinner(spinnerContainer, spinnerImageUrl);       
        const res = await axios.delete(url + "/" + id);
        console.log("success");
        return res.data;
    } catch (err) {
        console.error(err.response);
    } finally {
        eliminarSpinner(spinnerContainer);
    }
}

//PUTS


async function updateAnuncio (url, anuncio, spinnerContainer, spinnerImageUrl){

    try {
        cargarSpinner(spinnerContainer, spinnerImageUrl);       
        const res = await axios.put(url + "/" + anuncio.id, anuncio);
        return res.data; 
    } catch (err) {
        console.error(err.response);
    } finally {
        eliminarSpinner(spinnerContainer);
    }
}

const updateAnuncioAjax = (url, anuncio, spinnerContainer, spinnerImageUrl) => {

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = ()=>{
        if (xhr.readyState == 4){
            //terminó la respuesta y completa
            if (xhr.status >= 200 && xhr.status < 300){
                const data = JSON.parse(xhr.responseText);

                console.log(data);

            } else {                
                console.error(xhr.status, xhr.statusText);
            }
            eliminarSpinner(spinnerContainer);
        } else {
            //todavía no terminó la respuesta
            cargarSpinner(spinnerContainer, spinnerImageUrl);
        }
    };

    xhr.open("PUT", url + "/" + anuncio.id);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(anuncio));
}

export {getAnuncios, getAnuncio,postAnuncio, deleteAnuncio, updateAnuncio, getAnunciosPorTipo, getAnunciosAjax,
    postAnuncioAjax, updateAnuncioAjax, cargarSpinner, eliminarSpinner};