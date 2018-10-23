/*
<------------Data de criação: 29/05/2018

<------------Início do JavaScript voltado ao login
*/

$(document).ready(function(){

  //Muda o estado do display de none para block nas divs do login e cadastro, sendo que se uma esta block a outra esta none e vise-versa.
  Mudarestado = function(id){
    var display = document.getElementById(id);
    if(display!=null){
      display = display.style.display;
      if(display==""){
        if(id=="loginD"){
          document.getElementById("cadastroD").style.display="";
        }else{
          document.getElementById("loginD").style.display="";
        }
        document.getElementById(id).style.display = "block";
      }else{
        document.getElementById(id).style.display="";
      }
    }
  }

  //Valida os campos do login para ver se foram devidamente preenchidos e chama o "login".
  validarLogin = function(){

    if((document.getElementById("loginL").value == "") || (document.getElementById("senhaL").value == "")){
      var cfg = {
          title:"mensagem",
          modal:true,
          width: 350,
          heigth:400,
          buttons: {
              "OK" : function(){
                  $(this).dialog("close");
              }
          }
      };
      $("#msg").dialog(cfg);
      $("#msg").html("Todos os campos devem ser preenchidos!");
      document.getElementById("loginL").focus();
    }else{
      login();
    }
  }

  //Valida os campos do cadastro para ver se foram devidamente preenchidos e chama o "cadastro".
  validarCadastro = function(){

    if((document.getElementById("nome").value == "") || (document.getElementById("loginC").value == "") || (document.getElementById("email").value == "") || (document.getElementById("senhaC").value == "") || (document.getElementById("conSe").value == "")||(document.getElementById("nascimento").value=="")){

      var cfg = {
          title:"mensagem",
          modal:true,
          width: 350,
          heigth:500,
          buttons: {
              "OK" : function(){
                  $(this).dialog("close");
          document.getElementById("nome").focus();
              }
          }
      };
      $("#msg").html("Todos os campos devem ser preenchidos!");
      $("#msg").dialog(cfg);

    }else if(document.getElementById("senhaC").value != document.getElementById("conSe").value){
      var cfg = {
          title:"mensagem",
          modal:true,
          width: 350,
          heigth:500,
          buttons: {
              "OK" : function(){
                  $(this).dialog("close");
          document.getElementById("senhaC").focus();
              }
          }
      };
      $("#msg").dialog(cfg);
      $("#msg").html("A senha escrita no campo 'Senha' deve ser igual a escrita no campo 'Confirmar Senha'!");
    }else if(nascimento()){
      document.getElementById("nascimento").focus();
    }else{
      cadastrar();
    }

  }

  //Cadastra um novo jogador no site.
  cadastrar = function(){
    $.ajax({
      type:"POST",
      data:$("#cadastro").serialize(),
      url:"CadastroUsuario",
      success:function(msg){
        var cfg = {
          title:"mensagem",
          modal:true,
          width: 350,
          heigth:400,
          buttons: {
            "OK" : function(){
              $(this).dialog("close");
            }
          }
        };
        $("#msg").html(msg.msg);
      $("#msg").dialog(cfg);
      }
      });
  }

  //Faz login do usuario e manda para a página respequitiva dele.
  login = function(){
    $.ajax({
      type:"POST",
      url:"Entrar",
      data:$("#login").serialize(),
      success: function(msg){
        if(msg.msg!=null){

          var cfg = {
            title:"mensagem",
            modal:true,
            width: 350,
            heigth:400,
            buttons: {
              "OK" : function(){
                $(this).dialog("close");
              }
            }
          };
          $("#msg").dialog(cfg);
          $("#msg").html(msg.msg);
        }else{
          window.location.href = msg.url;
        }
      }
    });
  }

  //Valida a data inserida no compo nascimento do cadastro.
  nascimento = function(){
    var dataN = document.getElementById("nascimento").value;
    var procuraCaracter = /[^\d]/;     //Expressão regular para procurar caracter não-numérico.
    var eliminaEspaco = /^\s+|\s+$/g;  //Expressão regular para retirar espaços em branco.
    var msg = "";
    var retorno = false;
    try{
      data2 = dataN.split("/");
      if(data2.length != 3){
        msg = "Data fora do padrão dd/mm/aaaa!";
        retorno =  true;
      }
      var dia = parseInt(data2[0],10);
      var mes = parseInt(data2[1],10)-1;
      var ano = parseInt(data2[2],10);
      var date = new Date(ano,mes,dia);
      var date2 = new Date();
      if(!retorno){
        if((procuraCaracter.test(data2[0]))||(procuraCaracter.test(data2[0]))||(procuraCaracter.test(data2[0]))){
          msg = "Data fora do padrão dd/mm/aaaa!";
          retorno = true;
        }else if((date.getDate()!=dia)||(date.getFullYear()!=ano)||(date.getMonth()!=mes)){
          msg = "Data invalida";
          retorno = true;
        }else if(date2.getFullYear()<=ano){
          if(date2.getFullYear()==ano && date2.getMonth()<mes){
            msg = "Data Invalida";
            retorno = true;
          }else if(date2.getFullYear()==ano && date2.getDate()<dia){
            msg = "Data invalida";
            retorno = true;
          }else{
            return false;
          }
        }else{
          return false;
        }
      }
    }catch(erro){
      console.error(erro);
      retorno =  true;
    }
    var cfg = {
      title:"Mensagem",
      modal: true,
      heigth: 400,
      width: 350,
      buttons: {
        "OK" : function(){
          $(this).dialog("close");
        }
      }
    };
    $("#msg").html(msg);
    $("#msg").dialog(cfg);
    return retorno;
  }

  //Mostra um modal que serve para inserir o email para receber a nova senha.
  esqueci = function(){
    var cfg = {
        title:"mensagem",
        modal:true,
        width: 400,
        heigth: 600,
        buttons: {
            "Fechar" : function(){
                $(this).dialog("close");
            }
        }
    };
    $("#esqueci_senha").dialog(cfg);

  }

  //Pega o email e envia para o servidor e manda uma resposta para o usuario se o email foi ou não enviado.
  esqueciSenha = function(){
    
    $.ajax({
      type: "POST",
      url: "EsqueciSenha",
      data: "email="+$("#email_esq").val(),
      success: function (msg) {
        var cfg = {
          title:"mensagem",
          modal:true,
          width: 400,
          heigth: 600,
          buttons: {
              "Fechar" : function(){
                  $(this).dialog("close");
              }
          }
      };
      $("#msg").dialog(cfg);
      $("#email_esq").val("");
      },
      error: function (info) {
        alert("Erro ao enviar e-mail: "+ info.status + " - " + info.statusText);		   
      }
    });
  }
});

