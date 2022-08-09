var adicional = [];
var adicionaltemp = [];
var inventarioarray = [];
var encarg = []

function enviar() {

    if (document.getElementById("nombre").value != "" && document.getElementById("cantidadprod").value != "" && document.getElementById("descripcion").value != "" && document.getElementById("precun").value != "") {
        var img = document.getElementById("imgprod").value;
        var descr = parseInt(document.getElementById("descripcion").value);
        var nombre = document.getElementById("nombre").value;
        var canti = parseInt(document.getElementById("cantidadprod").value);
        var precun = parseInt(document.getElementById("precun").value)

        db.collection("Inventario").doc(nombre).set({
            nombre: nombre,
            cantidad: canti,
            descripcion: descr,
            imagen: img,
            preciounidad: precun,
            adicional: adicional,
        })
            .then((docRef) => {
                alert("Registro exitoso");
                window.location.reload()
            })
            .catch((error) => {
                alert("Error en el registro")
            });

        db.collection("Inventariotemp").doc(nombre).set({
            nombre: nombre,
            cantidad: canti,
            descripcion: descr,
            imagen: img,
            adicional: adicionaltemp,
        })

        document.getElementById("imgprod").value = "";
        document.getElementById("descripcion").value = "";
        document.getElementById("nombre").value = "";
        document.getElementById("cantidadprod").value = "";
        document.getElementById("addi").remove();

        var addicelds = document.createElement("div");
        addicelds.setAttribute("style", "width: 100%;")
        addicelds.setAttribute("id", "addi")
        addicelds.setAttribute("class", "fields")
        document.getElementById("addicelds").appendChild(addicelds);

    } else {
        alert("Por favor complete todos los campos");
    }

}

function inventario() {
    window.location = "index.html"
}

function talonario() {
    window.location = "Talonario.html"
}

function cargapag() {
    db.collection("Inventariotemp").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            var elem = new Object;
            var lista = document.getElementById("inven");

            var lista2 = document.createElement("div");
            lista2.setAttribute("id", doc.id);
            lista2.setAttribute("onclick", "visor(this)");
            lista2.setAttribute("class", "card");

            var img = document.createElement("img");
            img.setAttribute("class", "material-symbols-outlined");
            img.setAttribute("src", doc.data().imagen)
            elem.logo = doc.data().imagen;

            var producto = document.createElement("h1");
            producto.innerHTML = doc.data().nombre;
            elem.prod = doc.data().nombre;

            var cantidad = document.createElement("h2");
            cantidad.innerHTML = "Unidades disponibles: " + doc.data().cantidad;
            elem.cant = doc.data().cantidad;
            elem.id = doc.id;

            inventarioarray.push(elem);
            if (localStorage.getItem("inventario") == null) {
                localStorage.setItem("inventario", JSON.stringify(inventarioarray));
            } else {
                localStorage.setItem("inventario", JSON.stringify(inventarioarray));
            }


            lista2.appendChild(img);
            lista2.appendChild(producto);
            lista2.appendChild(cantidad)
            lista.appendChild(lista2);

            console.log(doc.id, " => ", doc.data())
        })
    });

    
}

function visor(ae) {
    var id = ae.id;

    document.getElementById("visor").setAttribute("style", "opacity: 0%; transition: 0.5s")
    setTimeout(function () {
        document.getElementById("visor").setAttribute("style", "opacity: 100%; transition: 0.5s")
    }, 200);

    var docRef = db.collection("Inventario").doc(id);

    document.getElementById("visorlista").innerHTML = "";
    docRef.get().then((doc) => {
        var title = document.createElement("h2")
        title.setAttribute("style", "display:flex; align-items: center; justify-content: center; background-color: #39396a; color: white; height: 5vh")
        title.innerHTML = "Inventario Total";
        document.getElementById("visorlista").appendChild(title)

        var adicionalcont = document.createElement("div")
        adicional = doc.data().adicional;

        var nombre = document.createElement("h1");
        nombre.innerHTML = doc.data().nombre;
        adicionalcont.appendChild(nombre)

        var cantidad = document.createElement("h2");
        cantidad.innerHTML = "Unidades: " + doc.data().cantidad;
        adicionalcont.appendChild(cantidad)

        var precio = document.createElement("h3");
        precio.innerHTML = "P/U: " + doc.data().descripcion + "$";
        adicionalcont.appendChild(precio)

        var cansuma = doc.data().cantidad

        for (i = 0; i < adicional.length; i++) {


            var adicion = document.createElement("div")
            adicion.setAttribute("style", "display: flex; width:100%; text-align: left; color: white")

            var nombre = document.createElement("p");
            nombre.setAttribute("style", "width: 70%")
            nombre.innerHTML = adicional[i].nom;

            var cantidad = document.createElement("p");
            cantidad.setAttribute("style", "width: 30%")
            cantidad.innerHTML = (adicional[i].can * cansuma);

            adicion.appendChild(nombre)
            adicion.appendChild(cantidad)
            adicionalcont.appendChild(adicion)
        }
        var boton = document.createElement("button");
        boton.innerHTML = "Editar";
        boton.setAttribute("id", id);
        boton.setAttribute("onclick", "editar(this)");
        adicionalcont.appendChild(boton);

        document.getElementById("visorlista").appendChild(adicionalcont)

    })

    var docRef = db.collection("Inventariotemp").doc(id);
    document.getElementById("invtemp").innerHTML = "";
    docRef.get().then((doc) => {
        var title = document.createElement("h2")
        title.setAttribute("style", "display:flex; align-items: center; justify-content: center; background-color: #39396a; color: white; height: 5vh")
        title.innerHTML = "Inventario Actual";
        document.getElementById("invtemp").appendChild(title)

        var adicionalcont = document.createElement("div")
        adicional = doc.data().adicional;

        var nombre = document.createElement("h1");
        nombre.innerHTML = doc.data().nombre;
        adicionalcont.appendChild(nombre)

        var cantidad = document.createElement("h2");
        cantidad.innerHTML = "Unidades disponibles: " + doc.data().cantidad;
        adicionalcont.appendChild(cantidad)

        var cansuma = doc.data().cantidad

        for (i = 0; i < adicional.length; i++) {

            var adicion = document.createElement("div")
            adicion.setAttribute("style", "display: flex; width:100%; text-align: left; color: white")

            var nombre = document.createElement("p");
            nombre.setAttribute("style", "width: 70%")
            nombre.innerHTML = adicional[i].nom;

            var cantidad = document.createElement("p");
            cantidad.setAttribute("style", "width: 30%")
            cantidad.innerHTML = (adicional[i].can);

            adicion.appendChild(nombre)
            adicion.appendChild(cantidad)
            adicionalcont.appendChild(adicion)
        }

        document.getElementById("invtemp").appendChild(adicionalcont)

    })

}

function salirvisor() {
    document.getElementById("visor").setAttribute("style", "opacity: 0%; transition: 0.5s")
    setTimeout(function () {
        document.getElementById("visor").setAttribute("style", "display: none;")
    }, 500);
}

function cancelaredit() {
    document.getElementById("editor").setAttribute("style", "opacity: 0%; transition: 0.5s")
    setTimeout(function () {
        document.getElementById("editor").setAttribute("style", "display: none;")
    }, 500);
}

function editar(ae) {
    var id = ae.id;

    document.getElementById("visor").setAttribute("style", "opacity: 0%; transition: 0.5s")
    setTimeout(function () {
        document.getElementById("visor").setAttribute("style", "display: none;")
    }, 500);

    document.getElementById("editor").setAttribute("style", "opacity: 0%; transition: 0.5s")
    setTimeout(function () {
        document.getElementById("editor").setAttribute("style", "opacity: 100%; transition: 0.5s")
    }, 200);

    var cansuma;
    var docRef = db.collection("Inventario").doc(id);

    var veradi = !!document.getElementById("addi")
    if (veradi == true) {
        document.getElementById("addi").remove()
    }
    var adidiv = document.createElement("div")
    adidiv.setAttribute("id", "addi")
    document.getElementById("addicelds").appendChild(adidiv)

    var botcan = document.createElement("button");
    botcan.innerHTML = "Cancelar"
    botcan.setAttribute("onclick", "cancelaredit()")

    var boteditar = document.createElement("button")
    boteditar.innerHTML = "Enviar"
    boteditar.setAttribute("id", id)
    boteditar.setAttribute("onclick", "enviaredit(this)")

    document.getElementById("buttons").innerHTML = ""
    document.getElementById("buttons").appendChild(botcan)
    document.getElementById("buttons").appendChild(boteditar)

    docRef.get().then((doc) => {
        document.getElementById("imagenproducto").setAttribute("src", doc.data().imagen);
        document.getElementById("idimagen").setAttribute("value", doc.data().imagen);
        document.getElementById("nomprodedit").setAttribute("value", doc.data().nombre);
        document.getElementById("cantidadprod").setAttribute("value", doc.data().cantidad);
        document.getElementById("desprodedit").setAttribute("value", doc.data().descripcion);
        adicional = doc.data().adicional
        cansuma = doc.data().cantidad

        console.log(adicional)

        for (i = 0; i < adicional.length; i++) {
            var nombreadicional = adicional[i].nom
            var cantiadicional = adicional[i].can

            var cont = document.createElement("div");
            cont.setAttribute("id", "adicional" + (i + 1))
            cont.setAttribute("value", (i + 1))
            cont.setAttribute("style", "display: flex; justify-content: space-between; width: 100%");
            cont.setAttribute("class", "adicion");

            var nom = document.createElement("p");
            nom.setAttribute("style", "width: 60%");
            nom.innerHTML = nombreadicional;

            var can = document.createElement("p");
            can.setAttribute("style", "width: 30%");
            can.innerHTML = (cantiadicional * cansuma);

            var trash = document.createElement("span");
            trash.setAttribute("style", "width: 10%; cursor: pointer; color: white");
            trash.setAttribute("class", "material-symbols-outlined");
            trash.setAttribute("id", (i + 1))
            trash.setAttribute("onclick", "borraradic(this)");
            trash.innerHTML = "delete";


            cont.appendChild(nom);
            cont.appendChild(can);
            cont.appendChild(trash)
            document.getElementById("addi").appendChild(cont);
        }
    })

    var docRef = db.collection("Inventariotemp").doc(id);

    docRef.get().then((doc) => {
        adicionaltemp = doc.data().adicional
        cansuma = doc.data().cantidad

        console.log(adicional)


    })
}

function adic() {
    var cont = document.createElement("div");
    cont.setAttribute("style", "display: flex; justify-content: space-between; width: 100%");
    cont.setAttribute("class", "adicion")
    cont.setAttribute("id", "contenedoradi")

    var nom = document.createElement("input");
    nom.required = true;
    nom.setAttribute("id", "nomadi");
    nom.setAttribute("type", "text");
    nom.setAttribute("placeholder", "Nombre");
    nom.setAttribute("style", "width: 50%");

    var can = document.createElement("input");
    can.required = true;
    can.setAttribute("id", "canadi");
    can.setAttribute("type", "number");
    can.setAttribute("placeholder", "Cantidad");
    can.setAttribute("style", "width: 30%");

    var bot = document.createElement("input");
    bot.setAttribute("type", "button")
    bot.setAttribute("onclick", "envad()");
    bot.setAttribute("value", "Guardar")
    bot.setAttribute("style", "width: 10%")

    cont.appendChild(nom);
    cont.appendChild(can);
    cont.appendChild(bot);
    document.getElementById("addi").appendChild(cont);




    var tam = parseInt(document.getElementById("cont").offsetHeight);
    tam = tam + 50;
    document.getElementById("cont").setAttribute("style", "height: " + tam + "px")
    document.getElementById("registraradicional").disabled = true;
    document.getElementById("registraradicional").setAttribute("style", "cursor: no-drop")
    document.getElementById("butanadir").disabled = true;
    document.getElementById("butanadir").setAttribute("style", "display: none")
}

function envad() {
    if (document.getElementById("nomadi").value != "" && document.getElementById("canadi").value != "") {
        var cansuma = parseInt(document.getElementById("cantidadprod").value);
        var nombreadicional = document.getElementById("nomadi").value;
        var cantiadicional = parseInt(document.getElementById("canadi").value);

        var adi = new Object;
        adi.nom = nombreadicional;
        adi.can = cantiadicional;

        adicional.push(adi);

        var aditemp = new Object;
        aditemp.nom = nombreadicional;
        aditemp.can = cantiadicional*cansuma;

        adicionaltemp.push(aditemp);


        var cont = document.createElement("div");
        cont.setAttribute("id", "adicional" + adicional.length)
        cont.setAttribute("value", adicional.length)
        cont.setAttribute("style", "display: flex; justify-content: space-between; width: 100%");
        cont.setAttribute("class", "adicion");

        var nom = document.createElement("p");
        nom.setAttribute("style", "width: 60%");
        nom.innerHTML = nombreadicional;

        var can = document.createElement("p");
        can.setAttribute("style", "width: 30%");
        can.innerHTML = (cantiadicional * cansuma);

        var trash = document.createElement("span");
        trash.setAttribute("style", "width: 10%; cursor: pointer; color: white");
        trash.setAttribute("class", "material-symbols-outlined");
        trash.setAttribute("id", adicional.length)
        trash.setAttribute("onclick", "borraradic(this)");
        trash.innerHTML = "delete";


        cont.appendChild(nom);
        cont.appendChild(can);
        cont.appendChild(trash)
        document.getElementById("addi").appendChild(cont);

        document.getElementById("contenedoradi").remove();

        document.getElementById("registraradicional").disabled = false;
        document.getElementById("registraradicional").setAttribute("style", "cursor: pointer")
        document.getElementById("butanadir").disabled = false;
        document.getElementById("butanadir").setAttribute("style", "display: initial; font-size: 35px; color: white; cursor: pointer;")
    } else {
        alert("Rellene todos los espacios");
    }
}

function borraradic(ae) {
    var id = ae.id
    document.getElementById("adicional" + id).remove()

    var idnew = (id - 1)
    adicional.splice(idnew, 1);
    console.log(adicional)

    document.getElementById("addi").remove();
    var addi = document.createElement("div")
    addi.setAttribute("class", "fields")
    addi.setAttribute("id", "addi")
    addi.setAttribute("style", "width: 100%;")
    document.getElementById("addicelds").appendChild(addi)

    var cansuma = parseInt(document.getElementById("cantidadprod").value);

    for (i = 0; i < adicional.length; i++) {
        var nombreadicional = adicional[i].nom
        var cantiadicional = adicional[i].can

        var cont = document.createElement("div");
        cont.setAttribute("id", "adicional" + (i + 1))
        cont.setAttribute("value", (i + 1))
        cont.setAttribute("style", "display: flex; justify-content: space-between; width: 100%");
        cont.setAttribute("class", "adicion");

        var nom = document.createElement("p");
        nom.setAttribute("style", "width: 60%");
        nom.innerHTML = nombreadicional;

        var can = document.createElement("p");
        can.setAttribute("style", "width: 30%");
        can.innerHTML = (cantiadicional * cansuma);

        var trash = document.createElement("span");
        trash.setAttribute("style", "width: 10%; cursor: pointer; color: white");
        trash.setAttribute("class", "material-symbols-outlined");
        trash.setAttribute("id", (i + 1))
        trash.setAttribute("onclick", "borraradic(this)");
        trash.innerHTML = "delete";


        cont.appendChild(nom);
        cont.appendChild(can);
        cont.appendChild(trash)
        document.getElementById("addi").appendChild(cont);
    }
}

function enviaredit(ae) {
    var id = ae.id;

    var img = document.getElementById("idimagen").value;
    var descr = document.getElementById("desprodedit").value;
    var nombre = document.getElementById("nomprodedit").value;
    var canti = parseInt(document.getElementById("cantidadprod").value);

    if (img != "" && descr != "" && nombre != "" && canti != "") {
        db.collection("Inventario").doc(id).set({
            nombre: nombre,
            cantidad: canti,
            descripcion: descr,
            imagen: img,
            adicional: adicional,
        })
            .then((docRef) => {
                alert("Registro exitoso");
            })
            .catch((error) => {
                alert("Error en el registro")
            });

        db.collection("Inventariotemp").doc(id).set({
            nombre: nombre,
            cantidad: canti,
            descripcion: descr,
            imagen: img,
            adicional: adicionaltemp,
        })
        document.getElementById("editor").setAttribute("style", "opacity: 0%; transition: 0.5s")
        setTimeout(function () {
            document.getElementById("editor").setAttribute("style", "display: none;")
        }, 500);
    } else {
        alert("Complete todos los campos")
    }

}