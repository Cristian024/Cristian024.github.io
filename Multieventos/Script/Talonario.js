var merca = []
var desc = []
var precios = []
var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
var fechas = []
var tal = []

function pdf() {
    const element = document.getElementById("Talonario");

    var opt = {
        margin: 1,
        filename: 'myfile.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
}

function ingresartalonario() {
    document.getElementById("seleccion").setAttribute("style", "display:none;")
    document.getElementById("Talonario").setAttribute("style", "")
    precios.length = 0;

    var size
    db.collection("Talonario").get().then(snap => {
        size = snap.size
    });
    setTimeout(function () {
        document.getElementById("fact").innerHTML = (size + 1)
    }, 1500);

    document.getElementById("fechfact").disabled = false;
    document.getElementById("fechven").disabled = false;
    document.getElementById("nombre").disabled = false;
    document.getElementById("cedula").disabled = false;
    document.getElementById("telefono").disabled = false;
    document.getElementById("direccion").disabled = false;
    for (i = 1; i <= 20; i++) {
        document.getElementById(i).disabled = false;
        document.getElementById("canti" + i).disabled = false;
    }
}
function historialtalonario() {
    document.getElementById("seleccion").setAttribute("style", "display:none;")
    document.getElementById("Historial").setAttribute("style", "")
    document.getElementById("contenedor").innerHTML = "";
    document.getElementById("content").value = "";
    document.getElementById("filt").value = ""
}

function cancelartal() {
    document.getElementById("Talonario").setAttribute("style", "display:none;")
    document.getElementById("seleccion").setAttribute("style", "")
    document.getElementById("fechfact").value = ""
    document.getElementById("fechven").value = ""
    document.getElementById("fact").textContent = ""
    document.getElementById("nombre").value = ""
    document.getElementById("cedula").value = ""
    document.getElementById("telefono").value = ""
    document.getElementById("direccion").value = ""

    desc.length = 0;
    precios.length = 0;
    for (i = 1; i <= 20; i++) {
        document.getElementById(i).value = ""
        document.getElementById("canti" + i).value = ""
        document.getElementById("prec" + i).value = ""
    }
}

function cargartal() {
    db.collection("Inventariotemp").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            if (doc.data().cantidad != 0) {
                merca.push(doc.data().nombre)
            }
        })
    });

    console.log(merca)

    var tabla = document.getElementById("cargo")
    for (i = 1; i <= 20; i++) {
        var column = document.createElement("tr")

        var cant = document.createElement("td")
        var input = document.createElement("input")
        input.setAttribute("type", "number")
        input.setAttribute("min", "1")
        input.setAttribute("id", "canti" + i)
        input.setAttribute("onchange", "actualizarcanti(this)")
        cant.appendChild(input)
        cant.setAttribute("class", "cant")

        var desc = document.createElement("td")
        var input = document.createElement("select")
        input.setAttribute("id", i)
        input.setAttribute("onchange", "cargarprec(this)")
        desc.appendChild(input)
        desc.setAttribute("class", "desc")

        var valp = document.createElement("td")
        valp.setAttribute("class", "valp")
        var prec = document.createElement("input")
        prec.setAttribute("id", "prec" + i);
        prec.setAttribute("onchange", "valoral(this)")
        prec.disabled = true
        valp.appendChild(prec)


        column.appendChild(cant)
        column.appendChild(desc)
        column.appendChild(valp)
        tabla.appendChild(column)
    }
    setTimeout(function () {
        for (i = 1; i <= 20; i++) {
            var select = document.getElementById(i)
            var option = document.createElement("option")
            option.innerHTML = ""
            select.appendChild(option)
            for (o = 1; o <= merca.length; o++) {
                var option = document.createElement("option")
                option.setAttribute("value", merca[o - 1])
                option.innerHTML = merca[o - 1]
                select.appendChild(option)
            }
        }
    }, 1500);

    for (i = 0; i < 12; i++) {
        var mesdiv = document.createElement("div");
        mesdiv.setAttribute("id", "mes" + (i + 1))
        mesdiv.setAttribute("class", "activo")
        mesdiv.setAttribute("value", "no")
        var mescont = document.createElement("div")
        mescont.innerHTML = meses[i]
        mescont.setAttribute("id", (i + 1))
        mescont.setAttribute("onclick", "expa(this)")
        mescont.setAttribute("class", "mes")
        var ind = document.createElement("div")
        var lugar = document.createElement("p")
        lugar.innerHTML = "Dirección"
        var fechfact = document.createElement("p")
        fechfact.innerHTML = "Fecha de facturación"
        var fechfin = document.createElement("p")
        fechfin.innerHTML = "Fecha de finalización"
        ind.appendChild(lugar)
        ind.appendChild(fechfact)
        ind.appendChild(fechfin)
        mesdiv.appendChild(mescont)
        mesdiv.appendChild(ind)
        document.getElementById("Historial").appendChild(mesdiv)
    }

    setTimeout(function () {
        db.collection("Talonario").get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                var fecha = doc.data().fechfact
                const d = new Date(fecha);
                let mes = d.getMonth();
                mes = mes + 1
                var cont = document.createElement("div")
                cont.setAttribute("onclick", "visor(this)")
                cont.setAttribute("id", doc.id)
                var lugar = document.createElement("p")
                lugar.innerHTML = doc.data().dire
                var fechfact = document.createElement("p")
                fechfact.innerHTML = doc.data().fechfact
                var fechven = document.createElement("p")
                fechven.innerHTML = doc.data().fechven
                cont.appendChild(lugar)
                cont.appendChild(fechfact)
                cont.appendChild(fechven)
                document.getElementById("mes" + mes).appendChild(cont)
            })
        });
    }, 1000);
}



function cargarprec(x) {
    var value = x.id;
    var option = document.getElementById(value).value;
    if (option == "") {
        for (i = 1; i <= 20; i++) {
            if (document.getElementById("prec" + i).value != "") {
                total = total + parseInt(document.getElementById("prec" + i).value)
            }
        }
        document.getElementById("prec" + value).value = ""
        document.getElementById("prec" + value).disabled = true;
        document.getElementById("canti" + value).value = ""
        precios[value - 1] = "";
        var total = 0;
        for (i = 1; i <= 20; i++) {
            if (document.getElementById("prec" + i).value != "") {
                total = total + parseInt(document.getElementById("prec" + i).value)
            }
        }
        document.getElementById("total").innerHTML = Intl.NumberFormat().format(total);
    } else {
        for (i = 1; i <= 20; i++) {
            if (document.getElementById(i).value != "") {
                var mod = i - 1;
                var docRef = db.collection("Inventario").doc(option);
                docRef.get().then((doc) => {
                    precios[mod] = doc.data().descripcion;
                })
            } else {
                precios[i - 1] = "";
            }
        }
        var cantidad = document.getElementById("canti" + value).value;
        if (cantidad == "") {
            document.getElementById("canti" + value).value = 1;
        }

        setTimeout(function () {
            var cantidad = document.getElementById("canti" + value).value;
            var descripcion = precios[value - 1]
            document.getElementById("prec" + value).value = (descripcion * cantidad);
            document.getElementById("prec" + value).disabled = false
        }, 500);

        setTimeout(function () {
            var total = 0;
            for (i = 1; i <= 20; i++) {
                if (document.getElementById("prec" + i).value != "") {
                    total = total + parseInt(document.getElementById("prec" + i).value)
                }
            }
            document.getElementById("total").innerHTML = Intl.NumberFormat().format(total);
        }, 700);
    }


    console.log(precios)
}
var veri = null
function actualizarcanti(x) {
    var id = x.id;
    const value = id.replace(/[^0-9]+/g, "");
    var cantidad = document.getElementById("canti" + value).value;
    var option = document.getElementById(value).value;
    if (option != "") {
        var descripcion = precios[value - 1]
        document.getElementById("prec" + value).value = (descripcion * cantidad);

    }
    setTimeout(function () {
        var total = 0;
        for (i = 1; i <= 20; i++) {
            if (document.getElementById("prec" + i).value != "") {
                total = total + parseInt(document.getElementById("prec" + i).value)
            }
        }
        document.getElementById("total").innerHTML = Intl.NumberFormat().format(total);
    }, 500);

    var docRef = db.collection("Inventariotemp").doc(option);
    var cantidadtemp = 0;
    docRef.get().then((doc) => {
        cantidadtemp = parseInt(doc.data().cantidad);
    })

    setTimeout(function () {
        if (x.value > cantidadtemp) {
            document.getElementById(value).setAttribute("style", "border: red solid; color: red")
            document.getElementById(id).setAttribute("style", "border: red solid; color: red")
            document.getElementById("prec" + value).setAttribute("style", "border: red solid; color: red")
            veri = false
        } else {
            document.getElementById(value).setAttribute("style", "")
            document.getElementById(id).setAttribute("style", "")
            document.getElementById("prec" + value).setAttribute("style", "")
            veri = true;
        }
    }, 500);
}

function registrartal() {
    setTimeout(function () {
        var total = 0;
        for (i = 1; i <= 20; i++) {
            if (document.getElementById("prec" + i).value != "") {
                total = total + parseInt(document.getElementById("prec" + i).value)
            }
        }
        document.getElementById("total").innerHTML = Intl.NumberFormat().format(total);
    }, 500);

    desc.length = 0;
    for (i = 1; i <= 20; i++) {
        if (document.getElementById(i).value != "") {
            var prod = new Object
            prod.cant = document.getElementById("canti" + i).value
            prod.prod = document.getElementById(i).value
            prod.espa = i
            desc.push(prod)
        }
    }

    console.log(desc)

    let con = confirm("Desea continuar?")
    var fechfact = document.getElementById("fechfact").value
    var fechven = document.getElementById("fechven").value
    var fact = document.getElementById("fact").textContent
    var nombre = document.getElementById("nombre").value
    var cedula = document.getElementById("cedula").value
    var telef = document.getElementById("telefono").value
    var dire = document.getElementById("direccion").value
    if (con == true) {
        if (fechfact != "" && fechven != "" && fact != "" && nombre != "" && cedula != "" && telef != "" && dire != "" && desc.length != 0 && veri != false) {
            if (Date.parse(fechfact) <= Date.parse(fechven)) {


                db.collection("Talonario").doc("fact" + fact).set({
                    fechfact: fechfact,
                    fechven: fechven,
                    nombre: nombre,
                    cedula: cedula,
                    telef: telef,
                    dire: dire,
                    desc: desc,
                    fin: "No",
                })

                db.collection("Inventariotemp").get().then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        for (i = 0; i < desc.length; i++) {
                            if (doc.data().nombre == desc[i].prod) {
                                var nomdoc = doc.data().nombre
                                var adic = []
                                var adicmul = []
                                var canin = doc.data().cantidad
                                canin = canin - desc[i].cant

                                var docRef = db.collection("Inventario").doc(nomdoc);
                                docRef.get().then((doc) => {
                                    adicmul = doc.data().adicional;
                                })

                                setTimeout(function () {
                                    for (o = 0; o < adicmul.length; o++) {
                                        var ad = new Object;
                                        ad.nom = adicmul[o].nom
                                        ad.can = adicmul[o].can * canin
                                        adic.push(ad)
                                    }
                                    console.log(adicmul)
                                    db.collection("Inventariotemp").doc(doc.data().nombre).set({
                                        nombre: doc.data().nombre,
                                        descripcion: doc.data().descripcion,
                                        imagen: doc.data().imagen,
                                        cantidad: canin,
                                        adicional: adic
                                    })
                                    adic.length = 0;
                                    adicmul.length = 0;
                                }, 1000);


                            }
                        }
                    })
                });

                setTimeout(function () {
                    alert("Registro exitoso")
                    window.location.reload()
                }, 3000);

            } else {
                alert("La fecha de vencimiento es menor a la fecha de facturación")
            }

        } else {
            alert("Complete todos los campos")
        }
    }
}

function valoral(x) {
    var id = x.id;
    const value = id.replace(/[^0-9]+/g, "");
    var cantidad = document.getElementById("canti" + value).value;
    precios[value - 1] = x.value;
    document.getElementById(id).value = (precios[value - 1] * cantidad)

    setTimeout(function () {
        var total = 0;
        for (i = 1; i <= 20; i++) {
            if (document.getElementById("prec" + i).value != "") {
                total = total + parseInt(document.getElementById("prec" + i).value)
            }
        }
        document.getElementById("total").innerHTML = Intl.NumberFormat().format(total);
    }, 500);
}

function expa(x) {
    var id = x.id
    document.getElementById("mes" + id).setAttribute("style", "cursor: auto; box-shadow: 0px 0px 2vh #39396a; background-color: #39396a; letter-spacing: 2vh; height:auto")
    document.getElementById("mes" + id).setAttribute("class", "desact")
    document.getElementById(id).setAttribute("onclick", "peque(this)")
    for (i = 1; i <= 12; i++) {
        if (document.getElementById("mes" + i).id != ("mes" + id)) {
            document.getElementById("mes" + i).setAttribute("style", "")
            document.getElementById("mes" + i).setAttribute("class", "activo")
            document.getElementById(i).setAttribute("onclick", "expa(this)")
        }
    }
}
function peque(x) {
    var id = x.id
    document.getElementById("mes" + id).setAttribute("style", "")
    document.getElementById("mes" + id).setAttribute("class", "activo")
    document.getElementById("mes" + id).setAttribute("onclick", "expa(this)")
}
function visor(x) {
    var id = x.id
    var docRef = db.collection("Talonario").doc(id);
    var fecha;
    docRef.get().then((doc) => {
        fecha = doc.data().fechfact
    })
    const d = new Date(fecha);
    let mes = d.getMonth();
    mes = mes + 1
    for (i = 1; i <= 12; i++) {
        document.getElementById("mes" + i).setAttribute("style", "")
        document.getElementById("mes" + i).setAttribute("class", "activo")
        document.getElementById(i).setAttribute("onclick", "expa(this)")
    }
    document.getElementById("Historial").setAttribute("style", "display:none;")
    document.getElementById("Talonario").setAttribute("style", "")
    precios.length = 0;

    document.getElementById("fechfact").disabled = true;
    document.getElementById("fechven").disabled = true;
    document.getElementById("nombre").disabled = true;
    document.getElementById("cedula").disabled = true;
    document.getElementById("telefono").disabled = true;
    document.getElementById("direccion").disabled = true;
    for (i = 1; i <= 20; i++) {
        document.getElementById(i).disabled = true;
        document.getElementById("canti" + i).disabled = true;
    }

    const value = id.replace(/[^0-9]+/g, "");
    document.getElementById("fact").innerHTML = value;
    var docRef = db.collection("Talonario").doc(id);
    docRef.get().then((doc) => {
        document.getElementById("fechfact").value = doc.data().fechfact
        document.getElementById("fechven").value = doc.data().fechven
        document.getElementById("nombre").value = doc.data().nombre
        document.getElementById("cedula").value = doc.data().cedula
        document.getElementById("telefono").value = doc.data().telef
        document.getElementById("direccion").value = doc.data().dire
        tal = doc.data().desc
    })
    setTimeout(function () {
        for (i = 0; i < tal.length; i++) {
            console.log(tal)
            var espa = tal[i].espa;
            document.getElementById(espa).value = tal[i].prod
            document.getElementById("canti" + espa).value = tal[i].cant
            var prod = tal[i].prod
            var docRef = db.collection("Inventario").doc(prod);
            docRef.get().then((doc) => {
                var ae = new Object
                ae.precio = doc.data().descripcion
                precios.push(ae)
            })
        }
        console.log(precios)
    }, 1500);
    setTimeout(function () {
        var o = 0;
        for (i = 1; i <= 20; i++) {
            if (document.getElementById(i).value != "") {
                var can = parseInt(document.getElementById("canti" + i).value)
                document.getElementById("prec" + i).value = (precios[o].precio) * can
                o++;
            }
        }
        var suma = 0;
        for (i = 1; i <= 20; i++) {
            if (document.getElementById(i).value != "") {
                suma = suma + parseInt(document.getElementById("prec" + i).value)
            }
        }
        document.getElementById("total").innerHTML = Intl.NumberFormat().format(suma);
    }, 2000);

}

function busqueda() {
    var busc = document.getElementById("content").value
    var filt = document.getElementById("filt").value
    document.getElementById("cancelar").setAttribute("style", "")
    if (busc != "" && filt != "") {
        for (i = 1; i <= 12; i++) {
            document.getElementById("mes" + i).setAttribute("style", "display:none;")
        }
        document.getElementById("contenedor").innerHTML = ""
        db.collection("Talonario").get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                switch (filt) {
                    case "dire":
                        if (doc.data().dire == busc) {
                            var cont = document.createElement("div")
                            cont.setAttribute("onclick", "visor(this)")
                            cont.setAttribute("id", doc.id)
                            var lugar = document.createElement("p")
                            lugar.innerHTML = doc.data().dire
                            var fechfact = document.createElement("p")
                            fechfact.innerHTML = doc.data().fechfact
                            var fechven = document.createElement("p")
                            fechven.innerHTML = doc.data().fechven
                            cont.appendChild(lugar)
                            cont.appendChild(fechfact)
                            cont.appendChild(fechven)
                            document.getElementById("contenedor").appendChild(cont)
                        }
                        break;
                    case "nombre":
                        if (doc.data().nombre == busc) {
                            var cont = document.createElement("div")
                            cont.setAttribute("onclick", "visor(this)")
                            cont.setAttribute("id", doc.id)
                            var lugar = document.createElement("p")
                            lugar.innerHTML = doc.data().nombre
                            var fechfact = document.createElement("p")
                            fechfact.innerHTML = doc.data().fechfact
                            var fechven = document.createElement("p")
                            fechven.innerHTML = doc.data().fechven
                            cont.appendChild(lugar)
                            cont.appendChild(fechfact)
                            cont.appendChild(fechven)
                            document.getElementById("contenedor").appendChild(cont)
                        }
                        break;
                    case "numord":
                        var id = doc.id;
                        const value = id.replace(/[^0-9]+/g, "");
                        if (value == parseInt(busc)) {
                            var cont = document.createElement("div")
                            cont.setAttribute("onclick", "visor(this)")
                            cont.setAttribute("id", doc.id)
                            var lugar = document.createElement("p")
                            lugar.innerHTML = doc.id;
                            var fechfact = document.createElement("p")
                            fechfact.innerHTML = doc.data().fechfact
                            var fechven = document.createElement("p")
                            fechven.innerHTML = doc.data().fechven
                            cont.appendChild(lugar)
                            cont.appendChild(fechfact)
                            cont.appendChild(fechven)
                            document.getElementById("contenedor").appendChild(cont)
                        }
                        break;
                }
            })
        });
    } else {
        alert("Complete el campo de busqueda")
    }

}

function cancelar() {
    document.getElementById("cancelar").setAttribute("style", "display: none;")
    document.getElementById("contenedor").innerHTML = ""
    document.getElementById("content").value = ""
    document.getElementById("filt").value = ""
    for (i = 1; i <= 12; i++) {
        document.getElementById("mes" + i).setAttribute("style", "")
        document.getElementById("mes" + i).setAttribute("class", "activo")
    }
}