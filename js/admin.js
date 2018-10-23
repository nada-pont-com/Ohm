$(document).ready(function(){
    var caminho="../../";

    //Cerifica se a sessao do adm logado esta ativa ou não
    verificaUsuario = function(){
    	$.ajax({
            type:"POST",
            data:"p=2",
            url:caminho+"ValidaSessao",
            success:function(usuario){
                if (usuario!="") {
                    usuarioLogado = new Object();
                    usuarioLogado.login = usuario.login;
                    usuarioLogado.email = usuario.email;
                    usuarioLogado.nascimento = usuario.nascimento;
                    usuarioLogado.nome = usuario.nome;
                    carregarInicio();
                }else{
                    sair();
                }
            }
        });
    }

    //Chama o verificaUsuario para verificar se a sessão do usuario esta ativa.
    verificaUsuario();

    //Carrega os dados das paginas que o adm esta
    carregarDados = function(data,pagename,extra){
        if(pagename =="dadosPessoaisAdministrador"){
            exibirDados();
        }else if(pagename=="main" && data!="" && extra=="0"){
            carregaDenuncia(data);
            buscarUsuario(data);
        }else if (pagename=="main" && data!="" && extra=="1") {
            carregaDenuncia(data);
        }else if (pagename=="main" && data!="" && extra=="2"){
            buscarUsuario(data);
        }else if(pagename=="rankingAdministrador"){
            BuscaDadosRank(data);
        }else if (pagename=="alterarDadosAdministrador"){
			carregaAlterar();
		}
    }

    //Carrega e inicia as variaves necesarias para o 'carregaPagina'.
    carregarInicio = function() {
        var data = "0";
        var extra = "0";
        var pagename = window.location.search.substring(1);
        if(pagename=="") {
            pagename = "main";
        }
        carregarPagina(data,pagename,extra);
    }

    //Carrega a pagina que o adm esta;
    carregarPagina = function(data,pagename,extra){
        switch (pagename) {
            case "dados":
                pagename="dadosPessoaisAdministrador";
                break;
            case "rank":
                pagename="rankingAdministrador";
                break;
            case "cadas":
                pagename="cadastroAdministrador";
                break;
            case "altera":
                pagename="alterarDadosAdministrador"
                break;
        }
        $("#content").load(pagename+".html", function(response, status, info){
            if (status=="error") {
                var msg = "Houve um erro ao encontrar a página: "+info.status + " - "+info.statusText;
                $("#content").html(msg);
            }else{
               carregarDados(data,pagename,extra);
            }
        });
    }

    //Redireciona o adm para o cadastro ou para o alterar dados.
    link_mainAdm = function(identificador){
        if (identificador==0) {
            location.href="?cadas";
        }else if(identificador==1){
            location.href="?altera";
        }
    }

    //Valida se os dados foram devidamente enseridos no cadastro do novo adm
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

    //Chama a servlet 'CadastroUsuario' para cadastrar um administrador
    cadastrar = function(){
    $.ajax({
            type:"POST",
            data:$("#cadastro").serialize(),
            url: caminho+"CadastroUsuario",
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

    //Valida a data inserida no compo nascimento do cadastro e do alterar dados.
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
            retorno =  true;
        }
        return retorno;
    }
    
    //Exibe os dados pessoais do administrador na página dadosPessoias do adm
    exibirDados = function(){
		var dadosPessoais = "";
        dadosPessoais = gerarDados(usuarioLogado); 
        $("#dados_pessoais").html(dadosPessoais);
	};
    
    //Gera uma tabela para ser exibida no exibir dados na página dadosPessoias do adm
	gerarDados = function(dadosPessoais){
		var dados = "<table><tbody>";
            dados += "<tr>" +
                    "<td>Nome: " +
                    "</td><td>"+ dadosPessoais.nome + "</td>" +
                    "</tr><tr>"+
                    "<td>Login: " +
                    "</td><td>"+ dadosPessoais.login + "</td>" +
                    "</tr><tr>"+
                    "<td>Email: " +
                    "</td><td>"+ dadosPessoais.email + "</td>" +
                    "</tr><tr>"+
                    "<td>Nascimento: " +
                    "</td><td>"+ dadosPessoais.nascimento + "</td>" +
                    "</tr>" +
                    "<tr>"+
                    "<td colspan='2'>" + 
                    "<input class='dadosPBtn' type='button' value='Alterar Dados' onclick='link_mainAdm(1)'>" +
                    "</td>" +
                    "</tr>"+
                    "</tbody></table>";
		return dados;
    };
    
    //Encerra a sessão do usuario e sai da pagina, mandando-o para a pagina inicial do site.
    sair = function(){
        $.ajax({
    		type: "POST",
    		url: caminho + "Sair",
    		success: function(){
                window.location.href = caminho+"index.html";
    		},
    		error:function(){
                window.location.href = caminho+"index.html";
    		}
    	});
    }

    //Busca todos os usuarios (Adms e jogadores) registrados no banco de dados e mostra a tabela criada no 'geraTabelaBuscaUsuario'.
    buscarUsuario = function(data) {
        var busca = $("#busca").val();
        if(busca==undefined){
            busca="";
        }
        $.ajax({
            type: "POST",
            data: "busca="+busca,
            url: caminho + "BuscaUsuarios",
            success:function(usuarios){
                var tabela = gerarTabelaBuscaUsuario(usuarios,data);
                $("#visualizarBusca").html(tabela);
            },
            error:function(){

            }
        });
    }
    //Gera uma tabela que sera exibida na pagina inicial do adm com todos os usurios rebebidos de 'buscarUsuario'
    gerarTabelaBuscaUsuario = function(usuarios,data){
        var html =  "<table>"+
                    "<thead>"+
                    "<tr>"+
                    "<th>Login</th>"+
                    "<th>Ações</th>"+
                    "</tr>"+
                    "</thead>"+
                    "<tbody>";
        if(usuarios != undefined && usuarios.length > 0){
            var i = 0;
            var cont = parseFloat(data);
            var validador = usuarios.length;
            i = 5*cont;
            if(validador<=i){
                html = gerarTabelaBuscaUsuario(usuarios,(cont-1).toString());
                return html;
            }else if(cont<0){
                html = gerarTabelaBuscaUsuario(usuarios,(cont+1).toString());
                return html;
            }
            for (i; i < usuarios.length; i++) {
                html += "<tr>"+
                "<td>"+usuarios[i].login+"</td>"+
                "<td>"+
                "<a class=\"linkA visualizar\" onclick=visualizar(\""+usuarios[i].login+"\")>Visualizar</a>"+
                "</td>"+
                "</tr>";
                if(i==5*(cont+1)-1){
                    break;
                }
            }
        }else{
            html += "<td colspan=\"2\">Nem um usuario encontrado!</td>";
        }
        html+="</tbody>"+
        "</table>";
        html+="<div class='imgs_tabela'><img src='../../css/imagens/seta_i.png' class='img_tabela' alt='Voltar ranking' title='Voltar ranking' onclick='carregarDados(\""+(cont-1)+"\",\"main\",\"2\")'>"+
            "<img src='../../css/imagens/seta.png' class='img_tabela' alt='Avançar ranking' title='Avançar ranking' onclick='carregarDados(\""+(cont+1)+"\",\"main\",\"2\")'></div>";
            
        return html;
    }

    //Busca todos os jogadores já com o ranking gerado lá na servlet Rank e depois da tabela ser gerada pelo 'geraTabekaRank' ele a mostra.
    BuscaDadosRank = function(data){
    	$.ajax({
    		type: "POST",
    		url: caminho + "Rank",
    		success: function(clientes){
                var tabela = gerarTabelaRank(clientes,data);
                $("#ranking_adm").html(tabela);
    		},
    		error:function(){
    			
    		}
    		
    	});
    }

    //gera uma tabela do ranking dos jogadores para ser mostrada no 'BuscaDadosRank'.
    gerarTabelaRank = function(clientes,data){
        
        var html ="<table><thead><tr><th>Ranking</th><th>Nome</th><th>Pontos</th><th>Ação</th></tr></thead><tbody>";
        var i = 0;
        var cont = parseFloat(data)
        var validador = clientes.length;
        if(data!="0"){
            i = 50*cont;
        }
        if(validador<i) {
            html = gerarTabelaRank(clientes,(cont-1).toString())
            return html;
        }else if(cont<0) {
            html = gerarTabelaRank(clientes,"0");
            return html;
        }
        for (i; i < clientes.length; i++) {
            html+="<tr>"+
            "<td>"+clientes[i].posicao+"</td>"+
            "<td>"+clientes[i].login+"</td>"+
            "<td>"+clientes[i].maiorPontuacao+"</td>"+
            "<td><a class='denuncia' onclick=denunciar(\""+clientes[i].login+"\")>Denunciar</a>"+
            "<a class='visualizar' onclick=visualizar(\""+clientes[i].login+"\")>Visualizar</a></td>"+
            "</tr>";
            if(i==50*(cont+1)-1){
                break;
            }
        }
        html+="</tbody></table>";
        html+="<div class='imgs_tabela'><img src='../../css/imagens/seta_i.png' class='img_tabela' alt='Voltar ranking' title='Voltar ranking' onclick='carregarPagina("+(cont-1)+",\"rank\")'>"+
        "<img src='../../css/imagens/seta.png' class='img_tabela' alt='Avançar ranking' title='Avançar ranking' onclick='carregarDados(\""+(cont+1)+"\",\"rank\")'></div>";
        
        return html;
    }

    //Serve para denunciar um jogador e para mostrar o modal que permite o adm denunciar e dizer qual o motivo da denuncia.
    denunciar =  function(login){
        var denuncia = $("#denuncia").val();
        if(denuncia=="" || denuncia==undefined){
            var html= "Denuncia: <input type=\"text\" name=\"denuncia\" id=\"denuncia\">";
            var cfg = {
                modal:true,
                title:"",
                width: 350,
                heigth: 500,
                buttons:{
                    "Denunciar": function(){
                        denuncia = $("#denuncia").val();
                        if(denuncia!=""){
                            denunciar(login);
                            $(this).dialog("close");
                        }else{
                            $(this).dialog("close");
                            html = "Denuncia: <input type=\"text\" name=\"denuncia\" id=\"denuncia\">";
                            html = "Denuncia não pode ficar vazia <br>"+html;
                            $("#msg").html(html);
                            $("#msg").dialog(cfg);
                        }
                    },
                    "Cancelar":function(){
                        $(this).dialog("close");
                    }
                    
                }
            }
            $("#msg").html(html);
            $("#msg").dialog(cfg);
        }else{
            $.ajax({
                type: "POST",
                data: "login="+usuarioLogado.login+"&denuncia="+denuncia+"&loginD="+login,
                url: caminho + "CriarDenuncia",
                success:function(denuncia){
                    $("#denuncia").val("");
                    var cfg = {
                        modal:true,
                        title:"",
                        width: 350,
                        heigth: 500,
                        buttons:{
                            "OK":function(){
                                $(this).dialog("close");
                            }
                        }
                    }
                },
                error:function(info){
    
                }
            });
        }
    }

    //Busca as denuncais existentes no banco de dados e as mostras na página inicial do amd.
    carregaDenuncia = function(data) {
        $.ajax({
            type: "POST",
            url: caminho + "VisualizarDenuncia",
            success:function(denuncias){
                var tabela = gerarTabelaDenuncias(denuncias,data);
                $("#denuncias").html(tabela);
            }
        });
    }

    //Gera uma tabela de denuncias recebidas do 'carregaDenuncia' e envia de volta a tabela criada.
    gerarTabelaDenuncias = function(denuncias,data){
        var html = "<table>"+
        "<thead>"+
            "<tr>"+
                "<th>Login</th>"+
                "<th>Denúncia</th>"+
                "<th colspan=\"2\">Ações</th>"+
            "</tr>"+
        "</thead>"+
        "<tbody>";
        var denuncias2 = denuncias[1];
        var logins = denuncias[0];
        if((denuncias != undefined && denuncias.length > 0)&& (denuncias2 != undefined && denuncias2.length > 0) && (logins != undefined && logins.length > 0)){
            var i = 0;
            var cont = parseFloat(data);
            var validador = denuncias[1].length;
            i = 5*cont;
            if(validador<=i){
                html = gerarTabelaDenuncias(denuncias,(cont-1).toString());
                return html;
            }else if(cont<0){
                html = gerarTabelaBuscaUsuario(denuncias,(cont+1).toString());
                return html;
            }

            for(i;i<denuncias[1].length;i++){
                html += "<tr>"+
                "<td>"+logins[i].login+"</td>"+
                "<td>"+denuncias2[i].denuncia+"</td>"+
                "<td>"+
                "<a class=\"linkA denuncia\" onclick=deletarConta(\"" + denuncias2[i].clientesId + "\")>Deletar Conta</a>"+
                "</td>"+
                "<td>"+
                "<a class=\"linkA denuncia\" onclick=removerDenuncia(\""+ denuncias2[i].id + "\")>Remover Denuncia</a>"+
                "</td>"+
                "</tr>";
            }
        }else{
            html+= "<tr><td colspan=\"3\">Nenhuma Denuncia encontrada!</tr>";
        }
        html += "</tbody>"+
        "</table>";
        html+="<div class='imgs_tabela'><img src='../../css/imagens/seta_i.png' class='img_tabela' alt='Voltar ranking' title='Voltar ranking' onclick='carregarDados(\""+(cont-1)+"\",\"main\",\"1\")'>"+
              "<img src='../../css/imagens/seta.png' class='img_tabela' alt='Avançar ranking' title='Avançar ranking' onclick='carregarDados(\""+(cont+1)+"\",\"main\",\"1\")'></div>";
        return html;
    }
    
    //Deleta a conta do jogador denunciado.
	deletarConta = function(login){
		$.ajax({
			type: "POST",
			url: caminho + "RemoverConta",
			data: "login=" + login,
			success: function(msg){
                var cfg = {
                    title:"mensagem",
                    modal:true,
                    width: 350,
                    heigth:500,
                    buttons: {
                        "OK" : function(){
                            $(this).dialog("close");
                            carregarDados("0","main","0");
                        }
                    },close:function(){
                        carregarDados("0","main","0");
                    }
                };
                $("#msg").html(msg.msg);
                $("#msg").dialog(cfg);
				
			},
			error: function(info){
				alert("Ocorreu um erro ao deletar a conta: " + info.status + " - " + info.statusText);
			}
		});
	};
    
    //Remove uma denuncia.
	removerDenuncia = function(id){
		$.ajax({
			type: "POST",
			url: caminho + "RemoverDenuncia",
			data: "id=" + id,
			success: function(msg){
				var cfg = {
                    title:"mensagem",
                    modal:true,
                    width: 350,
                    heigth:500,
                    buttons: {
                        "OK" : function(){
                            $(this).dialog("close");
                            carregarDados("0","main","1");
                        }
                    },close:function(){
                        carregarDados("0","main","1");
                    }
                };
                $("#msg").html(msg.msg);
                $("#msg").dialog(cfg);
			},
			error: function(info){
				alert("Ocorreu um erro ao remover a denuncia: " + info.status + " - " + info.statusText);
			}
		});
    };

    //Valida e altera os dados do adm.
    alterar = function(){
        if((document.getElementById("nome").value == "") || (document.getElementById("login").value == "") || (document.getElementById("email").value == "") || (document.getElementById("senha").value == "") || (document.getElementById("conSe").value == "")||(document.getElementById("nascimento").value=="")){
            var cfg = {
                title:"mensagem",
                modal:true,
					width: 350,
					heigth:500,
					buttons: {
						"OK" : function(){
							$(this).dialog("close");
						}
					}
			};
			$("#msg").dialog(cfg);
			$("#msg").html("Todos os campos devem ser preenchidos!");
			document.getElementById("nome").focus();
		}else if(document.getElementById("senha").value != document.getElementById("conSe").value){
            var cfg = {
					title:"mensagem",
					modal:true,
					width: 350,
					heigth:500,
					buttons: {
						"OK" : function(){
							$(this).dialog("close");
						}
					}
                };
			$("#msg").dialog(cfg);
			$("#msg").html("A senha escrita no campo 'Senha' deve ser igual a escrita no campo 'Confirmar Senha'!");
			document.getElementById("senha").value="";
			document.getElementById("conSe").value="";
			document.getElementById("senha").focus();
		}else if(nascimento()){
            document.getElementById("nascimento").focus();
	    }else{	
            $.ajax({
                type: "POST",
                url: caminho + "AlterarDados",
                data:$("#alterar").serialize() , 
                success: function(msg){
                    var cfg = {
                            title:"mensagem",
                            modal:true,
                            width: 350,
                            heigth:400,
                            buttons: {
                                "OK" : function(){
                                    $(this).dialog("close");
                                    verificaUsuario();
                                }
                            },
                            close: function(){
                                verificaUsuario();
                            }
                        };
                        $("#msg").html(msg.msg);
                        $("#msg").dialog(cfg);
                },
                error: function(info){
                    alert("Ocorreu um erro ao modificar a conta: " + info.status + " - " + info.statusText);
                }
            });
            
        }
    };
    
    //carrega os dados do adm e o mostra nos campos respequitivos na pegina da alterar dados.
    carregaAlterar = function() {
        $("#nome").val(usuarioLogado.nome);
        $("#login").val(usuarioLogado.login);
        $("#email").val(usuarioLogado.email);
        $("#nascimento").val(usuarioLogado.nascimento);
    };
    
    //Mostra em um modal os dados de um adm ou jogador que foi escolhido pelo adm ao clicar em visualizar.
    visualizar = function(login){
        $.ajax({
            type:"POST",
            url: caminho + "BuscaUsuario",
            data:"login="+login,
            success: function(dados){
                var cfg = {
                    modal:true,
                    width:360,
                    heigth:500,
                    buttons:{
                        "ok": function(){
                            $(this).dialog("close");
                        }
                    }
                };
                
               var html = gerarVisualizar(dados);
               $("#visualizar").html(html);
               $("#visualizar").dialog(cfg)
            }
        });
    };
    
    //Gera um tabela com os dados recebidos do 'visualizar'. Enviar a tabela para ser mostrada.
    gerarVisualizar = function(dados){
        var usuarioDados = dados[0];
        var clienteDados = "";
        if (dados[1]) {
            clienteDados = dados[1];
        }

        var html = "<h2>Dados Pessoais do "+usuarioDados.login+"<h2>";
        html +="<table>"+
            "<tbody>"+
                "<tr>"+
                    "<td>Login:</td>"+
                    "<td>"+usuarioDados.login+"</td>"+
                "</tr><tr>"+
                    "<td>Nome:</td>"+
                    "<td>"+usuarioDados.login+"</td>"+
                "</tr>";
        if (clienteDados=="") {
                html += "<tr>"+
                        "<td>Email:</td>"+
                        "<td>"+usuarioDados.email+"</td>"+
                    "</tr><tr>"+
                        "<td>Nascimento:</td>"+
                        "<td>"+usuarioDados.nascimento+"</td>"+
                    "</tr>";
        }else{
            html+="<tr>"+
                "<td>Tempo de Jogo:</td>"+
                "<td>"+converteTempo(clienteDados.tempo)+"</td>"+
            "</tr>"+
            "<tr>"+
                "<td>Fase:</td>"+
                "<td>"+clienteDados.fase+"</td>"+
            "</tr>"+
            "<tr>"+
                "<td>Dinheiro Geral:</td>"+
                "<td>"+clienteDados.dinheiroGeral+"</td>"+
            "</tr>"+
            "<tr>"+
                "<td>Dinheiro Atual:</td>"+
                "<td>"+clienteDados.dinheiro+"</td>"+
            "</tr>"+
            "<tr>"+
                "<td>Franklin Geral:</td>"+
                "<td>"+clienteDados.franklinGeral+"</td>"+
            "</tr>"+
            "<tr>"+
                "<td>Franklin Atual:</td>"+
                "<td>"+clienteDados.franklin+"</td>"+
            "</tr>";
        }
        html+="</tbody>"+
            "</table>";
        
        return html;
    };

    //Converte o tempo recebido no banco de dados para uma String "dia/mes/ano hora:min:seg".
    converteTempo = function(tempo){
        var seg,mim,hora,mes,ano,dia;
        var dataTempo = tempo.split(" ");
        
        var data = dataTempo[0].split("-");
        
        ano = parseFloat(data[0])-2000;
        mes = parseFloat(data[1]-1);
        dia = parseFloat(data[2]-1);

        var Tempo = dataTempo[1].split(":");
        hora = parseFloat(Tempo[0]);
        mim = parseFloat(Tempo[1]);
        seg = parseFloat(Tempo[2]);

        tempo = dia+"/"+mes+"/"+ano+" "+hora+":"+mim+":"+seg;
        
        return tempo;
    };

});