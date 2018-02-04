$(document).ready(function() {

  var dificultad;
  var personaje;

  /**
  * Mostrar lista de dificultades
  */
  $("#jugar").on("click", function() {
    $("#dificultad").fadeToggle();
  });

  /**
  * Recoger el nombre de usuario pasado como parametro en la url,
  * buscar en el webstorage y mostrarlo junto a su avatar
  */
  var url = getParameterByName("nombre");
  cargarUsuario(url);

  /**
  * Mostrar lista de dificultades
  */
  $("#dificultad").find("a").on("click", function() {
    dificultad = $(this).text();
    $("#personajes").show();
  });

  /**
  * lista de personajes
  */
  $(".personajes").on("click", function() {
    $(".personajes").removeClass("personajes-selected");
    $(this).addClass("personajes-selected");
    personaje = $(this).attr("alt");

    /**
    * metodo que genera el juego que para optimizar está en el documento juego.js
    */
    juego(dificultad, personaje);
  });
});

/**
* metodo que busca el usuario en webstorage y lo muestra en el html
*/
function cargarUsuario(url) {
  var valoresNombre = localStorage.getItem("name");
  var valores = valoresNombre.split(",");
  var valoresAvatar = localStorage.getItem("avatares");
  var valores2 = valoresAvatar.split(",");
  var parametro = url;

  for (var contador = 0; contador < valores.length; contador++)
  {
     if(valores[contador] == parametro)
     {
       var nick = valores[contador]
       $("span").text(nick);
       var imagenAvatar = $("<img src='../Imagenes/" + valores2[contador] + ".png' class='avatar img-circle'/>");
       $(".user").append(imagenAvatar);
     }
  }
}

/**
*metodo que recoge el parametro de la url
*/
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
