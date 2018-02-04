var avatar;
var valorNombre;
var contrasenia;
$(document).ready(function() {

  /**
  * ocultar login y registro al cargar la página
  */
  ocultarCampos();

  var menuOpciones = $("#menu").find("p");

  /**
  * boton inicio de sesion
  */
  $(menuOpciones).first().on("click", function() {
    $("#login").show();
    $("#registro").hide();
    $("#menu").hide();
  });

  /**
  * boton registro
  */
  $(menuOpciones).first().next().on("click", function() {
    $("#registro").show();
    $("#login").hide();
    $("#menu").hide();
  });

  /**
  * boton cancel en registro y login
  */
  $(".cancel").on("click", function() {
    $("#menu").show();
    ocultarCampos();
  });
  /**
  * boton reset en registro y login
  */
  $(".reset").on("click", function() {
    $(".form-group").find("input").val("");
  })

  /**
  * boton de enviar inicio de sesion
  */
  $("#enviarLogin").on("click", function() {
    var comprobar = enviarLogin();
    if (comprobar == true)
    {
      $(".form-horizontal").submit();
    }
    else {
      toastr.error('Usuario y/o contraseña incorrectos');
    }
  });

  /**
  * boton de enviar registro
  */
  $("#enviarRegistro").on("click", function() {
    var comprobar2 = enviarRegistro();
    if (comprobar2 == true)
    {
      $(".form-horizontal").submit();
    }
    else {
      toastr.error('Rellene todos los campos correctamente');
    }
  });

  /**
  * select avatar en registro
  */
  $(".avatar").on("click", function() {
    $(".avatar").removeClass("avatar-selected");
    $(this).addClass("avatar-selected");
    avatar = $(this).attr("alt");
  });
});

function ocultarCampos() {
  $("#login").hide();
  $("#registro").hide();
}

function enviarLogin() {
  var valoresNombre = localStorage.getItem("name");
  var valores = valoresNombre.split(",");
  var valoresPassword = localStorage.getItem("contrasenias");
  var valores2 = valoresPassword.split(",");

  var nombreUser = $("#user").val();
  nombreUser = nombreUser.trim();
  var contraseniaUser = $("#password").val();

  if (validarRequeridos(nombreUser) == true)
  {
    if (validarRequeridos(contraseniaUser) == true)
    {
      for (var contador = 0; contador < valores.length; contador++)
      {
         if((valores[contador] == nombreUser) && (valores2[contador] == contraseniaUser))
         {
            return true;
         }
      }
    }
    else {
      return false;
    }
  }
  else {
    return false;
  }
}

function enviarRegistro() {
  valorNombre = $("#usuario").val();
  valorNombre = valorNombre.trim();
  contrasenia = $("#password2").val();
  var email = $("#email").val();
  var contrasenia2 = $("#password3").val();

  if (validarRequeridos(valorNombre) == true)
  {
    if (validarRequeridos(contrasenia) == true)
    {
      if (validarRequeridos(email) == true)
      {
        if ((validarRequeridos(contrasenia2) == true) && (contrasenia2 == contrasenia))
        {
          if ((localStorage["name"] != undefined) && (localStorage["avatares"] != undefined) && (localStorage["contrasenias"] != undefined))
          {
            localStorage["name"] += valorNombre + ",";
            localStorage["avatares"] += avatar + ",";
            localStorage["contrasenias"] += contrasenia + ",";
          }
          else {
            localStorage.setItem("name", valorNombre + ",");
            localStorage.setItem("avatares", avatar + ",");
            localStorage.setItem("contrasenias", contrasenia + ",");
          }
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }
  else {
    return false;
  }
}

function validarRequeridos(valor)
{
  if (valor == null || valor.length == 0)
  {
    return false;
  }
  else {
    return true;
  }
}
