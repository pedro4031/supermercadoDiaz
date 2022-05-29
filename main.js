//++++++++++++++++++++++++
//--DECLARACION DE CLASE--
//++++++++++++++++++++++++
class producto {
  constructor(categoriaf, nombref, preciof, stockf) {
    this.categoria = categoriaf;
    this.nombre = nombref;
    this.precio = preciof;
    this.stock = stockf;
  }
}
//++++++++++++++++++++++++++++++++++++++++++++++++
//--DECLARACION DE ARRAY CONTENEDOR DE PRODUCTOS--
//++++++++++++++++++++++++++++++++++++++++++++++++

let almacen;

fetch("productos.json")
  .then((prods) => prods.json())
  .then((eoo) => {
    almacen = JSON.parse(localStorage.getItem("almacen")) || eoo;
    localStorage.setItem("almacen", JSON.stringify(almacen));
  })
  .catch((error) => console.log(error));

//++++++++++++++++++++++++
//--VARIABLES CONSTANTES--
//++++++++++++++++++++++++

const DateTime = luxon.DateTime;

const Contraseña = 1234;

const inicio = document.querySelector("#inicio");
const subTitulo = document.querySelector("#sub-title");
const interaccion = document.querySelector("#interaccion");
const infoProds = document.querySelector("#info-prods");
const eventos = document.querySelector("#eventos");

const carrito = document.querySelector("#carrito");
const carritoItems = document.querySelector("#carritoListaItems");
const comprador = document.querySelector(".comprarCarrito");

//--FUNCIONES--

//++++++++++++++++++++++++++++++
//--Funciones de administrador--
//++++++++++++++++++++++++++++++

function info(obj) {
  let tabla = document.querySelector("#tabla");
  if (tabla.className == "tablaFormato lleno") {
    let masProductos = document.createElement("tr");
    masProductos.innerHTML = `
<td>${obj.categoria}</td>
<td>${obj.nombre}</td>
<td>${obj.precio}</td>
<td>${obj.stock}</td>
`;
    tabla.appendChild(masProductos);
  } else {
    infoProds.className = "row d-flex justify-content-center my-3";
    tabla.className = "tablaFormato lleno";
    tabla.innerHTML = `
  <tr>
    <th>Categoria</th>
    <th>Nombre</th>
    <th>Precio</th>
    <th>Stock</th>
  </tr>
  <tr>
    <td>${obj.categoria}</td>
    <td>${obj.nombre}</td>
    <td>${obj.precio}</td>
    <td>${obj.stock}</td>
  </tr>
`;
  }
}

function stockear(obj) {
  interaccion.innerHTML = `<div class="d-flex justify-content-center mb-3">¿Cuantas unidades se agregaron/retiraron del almacen?:(stock actual ${obj.stock}) <input type="text" id="stockProd" class="mx-2 "> <button id="btnf2" type="button" class="btn btn-warning">Calcular</button></div>`;

  const stockProd = document.querySelector("#stockProd");
  const botonf2 = document.querySelector("#btnf2");

  botonf2.onclick = () => {
    obj.stock = obj.stock + parseInt(stockProd.value);
    infoProds.innerHTML = `<table id="tabla" class="tablaFormato">
    <tr>
<th>Producto</th>
<th>cant. que se agregó/retiró</th>
<th>Stock actual</th>
    </tr>
    <tr>
    <td>${obj.nombre}</td>
    <td>${stockProd.value}</td>
    <td>${obj.stock}</td>
    </tr>
    
    
    </table>`;

    interaccion.innerHTML = `
<div class="d-flex justify-content-center mb-3">
<button id="btnR" type="button" class="btn btn-warning">Buscar otro producto</button>
</div>
`;
    localStorage.setItem("almacen", JSON.stringify(almacen));
    let btnR = document.querySelector("#btnR");
    btnR.onclick = () => {
      buscarobject("stock");
    };
  };
}

function buscarobject(camino) {
  interaccion.innerHTML = `<div class="d-flex justify-content-center"><p>ingresar nombre de producto:</p> <input type="text" id="nombreProd" class="mx-2 "> <button id="btnf" type="button" class="btn btn-warning">Buscar</button></div>`;

  infoProds.innerHTML = `<table id="tabla" class=""></table>`;

  const nombreProd = document.querySelector("#nombreProd");
  const botonf = document.querySelector("#btnf");

  botonf.onclick = () => {
    let buscar = nombreProd.value.toLowerCase();
    nombreProd.value = "";
    let objeto = almacen.find((obj) => obj.nombre === buscar);
    if (objeto != undefined) {
      if (camino == "info") {
        info(objeto);
      } else if (camino == "stock") {
        stockear(objeto);
      }
    } else
      Toastify({
        text: "Producto no encontrado",
        duration: 2000,
        gravity: "top",
        position: "center",

        style: {
          background:
            "linear-gradient(to right, rgb(216, 52, 27),rgb(249, 109, 109))",
        },
      }).showToast();
  };
}

function agregar() {
  interaccion.innerHTML = `<div class="row d-flex align-content-center mb-3" id="datos">
  <div class="col-5 d-flex justify-content-end mb-2">
    <p>Ingresar categoria del producto:</p>
    <input type="text" id="categoriaf" class="ms-3" />
  </div>
  <div class="col-5 d-flex justify-content-end mb-2">
    <p>Ingresar nombre del producto:</p>
    <input type="text" id="nombref" class="ms-3" />
  </div>
  <div class="col-5 d-flex justify-content-end">
    <p>Ingresar precio del producto:</p>
    <input type="text" id="preciof" class="ms-3" />
  </div>
  <div class="col-5 d-flex justify-content-end">
    <p>Ingresar stock del producto:</p>
    <input type="text" id="stockf" class="ms-3" />
  </div>
  <div class="d-flex justify-content-center"
    ><button
      id="btnf2"
      type="button"
      class="btn btn-warning mt-3 col-1"
      >Agregar</button
    ></div>
  </div>`;
  infoProds.innerHTML = ``;

  const categoriaf = document.querySelector("#categoriaf");
  const nombref = document.querySelector("#nombref");
  const preciof = document.querySelector("#preciof");
  const stockf = document.querySelector("#stockf");
  const btnf2 = document.querySelector("#btnf2");

  btnf2.onclick = () => {
    const nuevoproducto = new producto(
      categoriaf.value,
      nombref.value,
      parseInt(preciof.value),
      parseInt(stockf.value)
    );
    almacen.push(nuevoproducto);
    localStorage.setItem("almacen", JSON.stringify(almacen));
    infoProds.innerHTML = `Se agrego el producto "${nombref.value.toLowerCase()}" a la categoria "${categoriaf.value.toLowerCase()}" al precio de $${
      preciof.value
    } con un stock de ${stockf.value} unidades.`;
    categoriaf.value = "";
    nombref.value = "";
    preciof.value = "";
    stockf.value = "";
  };
}

function sacar() {
  interaccion.innerHTML = `<div class="row d-flex align-content-center " id="datos2"><div class="col-12 d-flex justify-content-center" >¿Que producto desea eliminar del almacen?: <input type="text" id="eliminarProd" class="mx-2 "> <button id="btnf3" type="button" class="btn btn-warning">Eliminar</button></div></div>`;
  infoProds.innerHTML = ``;
  const eliminarProd = document.querySelector("#eliminarProd");
  const btnf3 = document.querySelector("#btnf3");

  btnf3.onclick = () => {
    let objeto = almacen.find(
      (obj) => obj.nombre === eliminarProd.value.toLowerCase()
    );
    if (objeto != undefined) {
      let rango = almacen.indexOf(objeto);
      almacen.splice(rango, 1);

      infoProds.innerText = `el producto "${eliminarProd.value.toLowerCase()}" a sido eliminado del almacen.`;
      localStorage.setItem("almacen", JSON.stringify(almacen));
    } else
      Toastify({
        text: "Producto no encontrado",
        duration: 2000,
        gravity: "top",
        position: "center",
        style: {
          background:
            "linear-gradient(to right, rgb(216, 52, 27),rgb(249, 109, 109))",
        },
      }).showToast();
  };
}
//++++++++++++++++++++++++
//--Funciones de cliente--
//++++++++++++++++++++++++

//Funciones carrito--

function CarritoCliente(estado) {
  let contCarrito;
  const nombreCliente = document
    .querySelector(".cliente-nombre")
    .innerText.replace(/[:.]/g, "");

  switch (estado) {
    case "nuevo":
      carritoItems.innerHTML = "";
      contCarrito =
        JSON.parse(localStorage.getItem(nombreCliente)) ||
        carritoItems.innerHTML;

      localStorage.setItem(nombreCliente, JSON.stringify(contCarrito));

      carritoItems.innerHTML = contCarrito;
      const listaItems = document.getElementsByClassName("item_carrito");
      document.querySelector(".cart-cantidad").innerText = listaItems.length;

      for (const item of listaItems) {
        item.querySelector(".remover").addEventListener("click", borrarItem);
        item.querySelector(".prod-cant").addEventListener("change", cantProds);
      }
      updateTotal();
      break;
    case "modificado":
      contCarrito = carritoItems.innerHTML;
      localStorage.setItem(nombreCliente, JSON.stringify(contCarrito));

      break;
    default:
      console.log("Error en cargar carrito. Recargar página...");
      break;
  }
}

function updateTotal() {
  const listaItems = document.getElementsByClassName("item_carrito");

  let total = 0;

  for (const item of listaItems) {
    let precio = parseFloat(
      item.querySelector(".item-precio").innerText.replace("$", "")
    );
    let cant = item.querySelector(".prod-cant").value;
    total += precio * cant;
  }

  document.querySelector("#carrito-total").innerText = total || 0;
  document.querySelector(".cart-cantidad").innerText = listaItems.length;
}

function borrarItem(e) {
  let btnBorrar = e.target;
  btnBorrar.parentElement.remove();
  updateTotal();
  CarritoCliente("modificado");
}

function cantProds(e) {
  let cantidad = e.target.value;
  if (isNaN(cantidad) || cantidad <= 0) {
    cantidad = 1;
  }
  updateTotal();
  e.target.setAttribute("value", e.target.value);
  CarritoCliente("modificado");
}

function agregado_carrito(prod_nombre, prod_precio) {
  let prod_caja = document.createElement("div");
  let lista_carrito = document.getElementsByClassName("item_carrito");

  for (let i = 0; i < lista_carrito.length; i++) {
    if (lista_carrito[i].getAttribute("id") == prod_nombre) {
      Toastify({
        text: "Producto ya en carrito",
        duration: 2000,
        gravity: "top",
        position: "center",
        style: {
          background:
            "linear-gradient(to right, rgb(216, 52, 27),rgb(249, 109, 109))",
        },
      }).showToast();
      return;
    }
  }

  prod_caja.className = "item_carrito";
  prod_caja.setAttribute("id", prod_nombre);
  prod_caja.innerHTML = `
 <span >${prod_nombre}</span>
 <span class="item-precio">$${prod_precio}</span>
 <input class="prod-cant" type="number" value="1">
 <button class="remover btn btn-danger">X</button>
`;

  carritoItems.append(prod_caja);

  prod_caja.querySelector(".remover").addEventListener("click", borrarItem);
  prod_caja.querySelector(".prod-cant").addEventListener("change", cantProds);

  updateTotal();
  CarritoCliente("modificado");
}

function agregado(e) {
  let boton = e.target;
  let cartItem = boton.parentElement;
  let prod_nombre = cartItem.querySelector(".card-title").innerText;
  let prod_precio = cartItem.querySelector(".precio-obj").innerText;

  agregado_carrito(prod_nombre, prod_precio);
}

function carritoF() {
  const agregarKarrito = document.getElementsByClassName("agregarCarrito");

  for (let i = 0; i < agregarKarrito.length; i++) {
    boton = agregarKarrito[i];
    boton.addEventListener("click", agregado);
  }
}

function crearCarta(NumProd) {
  fetch("listaDescuentos.json")
    .then((desc) => desc.json())
    .then((descs) => {
      let descuentos = descs;

      let precioDesc = almacen[NumProd].precio;

      for (let cont = 0; cont < descuentos.length; cont++) {
        if (almacen[NumProd].nombre == descuentos[cont].nombre) {
          precioDesc = parseFloat(
            almacen[NumProd].precio -
              almacen[NumProd].precio * descuentos[cont].descuento
          );
        }
      }

      let carta = document.createElement("div");

      carta.className = "card m-2 p-0";

      carta.innerHTML = `
      <h5 class="card-header">${almacen[NumProd].categoria}</h5>
    <div class="card-body">
    <h5 class="card-title">${almacen[NumProd].nombre}</h5>
    <h6 class="card-subtitle text-muted mb-2">Stock:${almacen[NumProd].stock}</h6>
    <p class="card-text">Precio: $${almacen[NumProd].precio}</p>
    <p class="card-text">con descuento:$<span class="precio-obj">${precioDesc}</span></p>
   
    <button class="btn btn-info agregarCarrito">Agregar al carrito</button>
    </div>
    
    `;
      infoProds.appendChild(carta);
    })
    .catch((error) => console.log(error));
}

//--Funciones para seleccionar tarea a realizar--

function runAdmin() {
  inicio.innerHTML = `Desea: <select name="comando" id="select">
      <option value="nada" selected>N/A</option>
   <option value="usuarios" >Usuarios</option>
   <option value="informacion">información</option>
   <option value="stockear">stockear</option>
   <option value="agregar">agregar</option>
   <option value="eliminar">eliminar</option>
   </select> sobre un producto.`;
  interaccion.innerHTML = "";
  interaccion.className = "d-flex justify-content-center";
  const select = document.querySelector("#select");
  select.onchange = () => {
    switch (select.value) {
      case "informacion":
        buscarobject("info");
        break;
      case "stockear":
        buscarobject("stock");
        break;
      case "agregar":
        agregar();
        break;
      case "eliminar":
        sacar();
        break;
      case "usuarios":
        logearse();
        break;
      default:
        alert("Error. Reinicie sitio.");
        break;
    }
  };
}

function runCliente(nombre) {
  subTitulo.innerHTML = `<p class="d-flex justify-content-center">Bienvenido/a  <span class="cliente-nombre">: ${nombre}.</span></p>`;
  inicio.innerHTML = `
  <input id="buscador" placeholder="Buscar producto..." type="text" class="col-4">
  <button class="btn btn-info ms-2" id="atras">Atras</button>
  <a id="carrito-iconos" class="text-decoration-none ms-2" ><i class="fa-solid fa-cart-shopping fa-xl cartIcon"></i><span class="cart-cantidad">0</span></a>
  `;

  interaccion.innerHTML = `
  

  <div class="filtros row ">
  <p class="d-flex justify-content-center mb-1">Filtros:</p>
  <div class="col-4">
    <div class="form-label"
      >Precio minimo: <span id="valorMin"></span
    ></div>
    <input
      type="range"
      class="form-range"
      value="0"
      min="0"
      max="9950"
      step="50"
      id="precioMin"
    />
  </div>
  <div class="col-4">
    <div class="form-label"
      >Precio maximo: <span id="valorMax"></span
    ></div>
    <input
      type="range"
      class="form-range"
      value="10000"
      min="50"
      max="10000"
      step="50"
      id="precioMax"
    />
  </div>
  <div class="col-3"
    ><div>
      Categorias:
      <select name="" id="categorias">
        <option value="todo">Todos</option>
        <option value="consumible">Consumibles</option>
        <option value="juguete">Juguetes</option>
        <option value="electrodomestico">Electrodomesticos</option>
        <option value="otros">Otros</option>
      </select>
    </div></div
  >
</div>

  `;

  const atras = document.querySelector("#atras");
  const carritoIconos = document.querySelector("#carrito-iconos");

  const rango1 = document.querySelector("#precioMax");
  const valorMax = document.querySelector("#valorMax");

  const rango2 = document.querySelector("#precioMin");
  const valorMin = document.querySelector("#valorMin");

  const categorias = document.querySelector("#categorias");

  valorMax.innerHTML = rango1.value;
  valorMin.innerHTML = rango2.value;

  function cargarCarrito() {
    setTimeout(() => {
      carritoF();
      comprador.onclick = () => comprarCarrito();
      CarritoCliente("nuevo");
    }, 50);
  }

  function mostrarProds() {
    infoProds.innerHTML = "";
    infoProds.className = "row d-flex justify-content-center mb-5";
    for (let i = 0; i < almacen.length; i++) {
      if (almacen[i].precio <= rango1.value) {
        if (almacen[i].precio >= rango2.value) {
          switch (categorias.value) {
            case "todo":
              crearCarta(i);
              break;
            case "consumible":
              almacen[i].categoria == "consumible" && crearCarta(i);
              break;
            case "juguete":
              almacen[i].categoria == "juguete" && crearCarta(i);
              break;
            case "electrodomestico":
              almacen[i].categoria == "electrodomestico" && crearCarta(i);
              break;
            case "otros":
              almacen[i].categoria != "electrodomestico" &&
                almacen[i].categoria != "juguete" &&
                almacen[i].categoria != "consumible" &&
                crearCarta(i);
              break;
            default:
              console.log("ERROR");
              break;
          }
        }
      }
    }
    buscador.addEventListener("keyup", (e) => {
      if (e.target.matches("#buscador")) {
        document.querySelectorAll(".card").forEach((productox) => {
          productox
            .querySelector(".card-title")
            .textContent.toLowerCase()
            .includes(e.target.value.toLowerCase())
            ? productox.classList.remove("ocultar")
            : productox.classList.add("ocultar");
        });
      }
    });
  }

  function comprarCarrito(e) {
    const listaItems = document.getElementsByClassName("item_carrito");

    if (listaItems.length <= 0) {
      Toastify({
        text: "Carrito vacio.",
        duration: 2500,
        gravity: "top",
        position: "center",
        style: {
          background: "orange",
        },
      }).showToast();
      return;
    }

    for (const item of listaItems) {
      let nombreItem = item.getAttribute("id");
      let cantItem = item.querySelector(".prod-cant").value;
      for (const prod of almacen) {
        if (prod.nombre == nombreItem) {
          let stock = parseInt(prod.stock - cantItem);
          if (stock < 0) {
            Toastify({
              text: "Un producto no tiene stock suficiente.",
              duration: 2000,
              gravity: "top",
              position: "center",
              style: {
                background:
                  "linear-gradient(to right, rgb(216, 52, 27),rgb(249, 109, 109))",
              },
            }).showToast();
            return;
          }
        }
      }
    }

    for (const item of listaItems) {
      let nombreItem = item.getAttribute("id");
      let cantItem = item.querySelector(".prod-cant").value;
      for (const prod of almacen) {
        if (prod.nombre == nombreItem) {
          prod.stock -= cantItem;
        }
      }
    }
    localStorage.setItem("almacen", JSON.stringify(almacen));
    carritoItems.innerHTML = "";
    mostrarProds();
    CarritoCliente("modificado");
    updateTotal();
    Toastify({
      text: "Gracias por su compra.",
      duration: 3000,
      gravity: "top",
      position: "center",
      style: { background: "rgb(112, 255, 56)" },
    }).showToast();
    cargarCarrito();
  }

  mostrarProds();
  cargarCarrito();

  rango1.oninput = () => {
    let datoPrecio1 = rango1.value;
    valorMax.innerText = datoPrecio1;
    mostrarProds();
    cargarCarrito();
  };
  rango2.oninput = () => {
    let datoPrecio2 = rango2.value;
    valorMin.innerText = datoPrecio2;
    mostrarProds();
    cargarCarrito();
  };

  categorias.onchange = () => {
    mostrarProds();
    cargarCarrito();
  };

  atras.onclick = () => {
    carrito.className = "ocultar-carrito";
    logearse();
  };

  carritoIconos.onclick = () => {
    carrito.classList.contains("ocultar-carrito")
      ? (carrito.className = "mostrar-carrito")
      : (carrito.className = "ocultar-carrito");
  };
}

//--Funcion de verificar datos de usuario--

function verificar(user, comprobar) {
  if (user == "administrador") {
    comprobar == Contraseña
      ? runAdmin()
      : (contraseña.className = "incorrecto mx-2");
  } else if (user == "cliente") {
    let nombreCliente = document.querySelector("#nombre");
    comprobar.length >= 3
      ? runCliente(comprobar)
      : (nombreCliente.className = "incorrecto mx-2");
  }
}

//--Funcion Logearse en la pagina--

function logearse() {
  subTitulo.innerHTML = `Bienvenida/o a supermercados Diaz%. Ingresar como:`;
  inicio.innerHTML = `<div class="form-check me-3">
<input
  id="cliente"
  name="usuario"
  type="radio"
  class="form-check-input"
/>
<label class="form-check-label" for="cliente">Cliente</label>
</div>
<div class="form-check">
<input
  id="administrador"
  name="usuario"
  type="radio"
  class="form-check-input"
/>
<label class="form-check-label" for="administrador"
  >Administrador</label
>
</div>`;
  interaccion.innerHTML = "";
  infoProds.innerHTML = "";
  const cliente = document.querySelector("#cliente");
  const administrador = document.querySelector("#administrador");

  administrador.onclick = () => {
    subTitulo.innerHTML = `--Bienvenido administrador--`;
    interaccion.innerHTML = `<p>Ingresar contraseña (1234):</p>  <input type="password" id="contraseña" class="mx-2">  <button id="btn" type="button" class="btn btn-warning">Ingresar</button>`;
    const boton = document.querySelector("#btn");
    let contraseña = document.querySelector("#contraseña");

    boton.onclick = () => {
      verificar("administrador", contraseña.value);
    };
    contraseña.onchange = () => {
      verificar("administrador", contraseña.value);
    };
  };

  cliente.onclick = () => {
    subTitulo.innerHTML = `Logearse con su cuenta/nombre.`;
    interaccion.innerHTML = `<p>Ingresar nombre:</p> <input type="text" id="nombre" class="mx-2 "> <button id="btn" type="button" class="btn btn-info">Ingresar</button>`;
    const boton = document.querySelector("#btn");
    let nombreCliente = document.querySelector("#nombre");

    boton.onclick = () => {
      verificar("cliente", nombreCliente.value);
    };
    nombreCliente.onchange = () => {
      verificar("cliente", nombreCliente.value);
    };
  };
}

//--Funcion de tabla descuentos--

function tablaDescuentos() {
  let listaDesc = document.querySelector("#listaDescuentos");
  fetch("listaDescuentos.json")
    .then((descuentos) => descuentos.json())
    .then((mostrarDescuento) => {
      for (let cont = 0; cont < mostrarDescuento.length; cont++) {
        let itemDesc = document.createElement("li");
        itemDesc.innerText = `El producto "${
          mostrarDescuento[cont].nombre
        }" tiene un descuento de ${parseInt(
          mostrarDescuento[cont].descuento * 100
        )}%`;
        listaDesc.appendChild(itemDesc);
      }
    })
    .catch((error) => {
      console.log(error);

      let itemDesc = document.createElement("li");
      itemDesc.innerText = `No hay descuentos por ahora`;
      listaDesc.appendChild(itemDesc);
    });
}

//--Funcion de footer--

function tiempo() {
  const evento = DateTime.local(2022, 12, 31, 23, 59);
  setInterval(() => {
    let tiempo = DateTime.now();
    let horas = tiempo.hour;
    let diferencia = evento.minus({
      months: tiempo.month,
      days: tiempo.day,
      hours: tiempo.hour,
      minutes: tiempo.minute,
      seconds: tiempo.second,
    });
    eventos.innerText = `Faltan ${diferencia.month} meses, ${diferencia.day} dias, ${diferencia.hour} horas, ${diferencia.minute} minutos y ${diferencia.second} segundos para nuestro aniversario, no te lo pierdas. Muchos descuentos y ofertas en todo el dia. `;
  }, 1000);
}

logearse();
tablaDescuentos();
tiempo();
