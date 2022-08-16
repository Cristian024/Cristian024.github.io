var coloresfon = ["#39396a", "white", "#161616"]
var coloreslet = ["white", "black", "white"]

function cargareven(){
    db.collection("Talonario").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            if(doc.data().fin== "No"){
                var num = Math.random() * (0 - 2) + 0;
                num = parseInt(num);
                alert(num)
                var cont = document.createElement("div")
                cont.setAttribute("style", "background-color: " + coloresfon[num])
                var lugar = document.createElement("h1")
                lugar.innerHTML = doc.data().dire
                lugar.setAttribute("style", "color: " + coloreslet[num])
                var nombre = document.createElement("h2")
                nombre.innerHTML = doc.data().nombre
                nombre.setAttribute("style", "color: " + coloreslet[num])
                var fecha = document.createElement("h3")
                fecha.innerHTML = doc.data().fechven
                fecha.setAttribute("style", "color: " + coloreslet[num])
                cont.appendChild(lugar)
                cont.appendChild(nombre)
                cont.appendChild(fecha)
                document.getElementById("contenedor").appendChild(cont)
            }
        })
    });
}