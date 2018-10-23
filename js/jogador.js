$(document).ready(function(){
    
    var caminho = "../../";
    
    var usuarioLogado;
    
    //Cerifica se a sessao do adm logado esta ativa ou não
    verificaUsuario = function(){
    	$.ajax({
            type:"POST",
            data:"p=1",
            url: caminho+"ValidaSessao",
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
            },
            error: function(info){
                sair();
            }
        });
    }

    //Chama o verificaUsuario para verificar se a sessão do usuario esta ativa.
    verificaUsuario();
    
    //Carrega e inicia as variaves necesarias para o 'carregaPagina'.
    carregarInicio = function(){
        var pagename = "";
        var url = window.location.search.substring(1);
        var data = "";
        if(url=="") {
            pagename = "main";
        }else{
            var splitted = url.split("=");
            pagename = splitted[0];
            if (splitted[1]) {
                data = splitted[1];
            }
        }
        carregarPagina(data,pagename);
     

    }

    //Carrega os dados das paginas que o jogador esta
    carregarDados = function(data,pagename){
        if (data!="" && pagename=="main") {
            location.href="#"+data;
        }else if(data!="" && pagename=="rankingJogador"){
            compartilharRank();
            BuscaDadosRank(data);
        }else if(data=="" && pagename=="dadosPessoaisJogador"){
            exibirDados();
        }else if (pagename=="alterarDadosJogador"){
			carregaAlterar();
		}
    }

    //Carrega a pagina que o adm esta;
    carregarPagina = function(data,pagename){
        switch (pagename) {
            case "dados":
                pagename="dadosPessoaisJogador";
                break;
            case "rank":
                pagename="rankingJogador";
                if(data=="")
                	data="0";
                break;
            case "altera":
                pagename="alterarDadosJogador"
                break;
        }
        $("#content").load(pagename+".html", function(response, status, info){
            if (status=="error") {
                var msg = "Houve um erro ao encontrar a página: "+info.status + " - "+info.statusText;
                $("#content").html(msg);
            }else{
                carregarDados(data,pagename);
            }
        });
    }
    
    //Exibe os dados pessoais do administrador na página dadosPessoias do jogador.
    exibirDados = function(){
		var dadosPessoais = "";
		$.ajax({
			type: "POST",
			url: caminho + "CarregaDadosJogador",
			success: function(dados){
				dadosPessoais = gerarDados(dados,usuarioLogado); 
				$("#dados_pessoais").html(dadosPessoais);
			},
			error: function(info){
				alert("Ocorreu um erro ao consultar seus dados pessoais: " + info.status + " - " + info.statusText);
			}
		});
    };
    
    compartilharRank = function(){
        $.ajax({
			type: "POST",
			url: caminho + "CarregaDadosJogador",
			success: function(dados){
                var texto = "Fiz%20"+dados[0].maiorPontuacao+"%20pontos%20no%20Ohm!%20Jogue%20em:"; //(texto do tweet, separe cada palavra com “%20” para funcionar, e repare em vermelho na variável pontos, que deve ser trocada pela variável onde você possui os pontos do jogador logado)
                var link = "http://35.232.177.172/ohm/"; //(link para o site online, troque tutorials pelo nome indicado pelo orientador)
                var conta = "OhmJogo"; //(opcional, para colocar uma conta de twitter vinculada com o jogo)
                var tags = "ohm,ClickerGame"; //(opcional, para colocar hashtags, sem espaço e separadas por vírgulas)
        
                document.getElementById("twitterlink").setAttribute('href', 'https://twitter.com/intent/tweet?text='+texto+'&via='+conta+'&url='+link+'&hashtags='+tags);
			},
			error: function(info){
				alert("Ocorreu um erro ao carregar o botão de compartilhamento: " + info.status + " - " + info.statusText);
			}
		});
    }
    
    //Gera uma tabela para ser exibida no exibir dados na página dadosPessoias do jogador.
	gerarDados = function(dadosPessoais,usuario){
        var dados = "<table><tbody>";
		if (dadosPessoais != undefined && dadosPessoais.length > 0){
			dados +=  "<tr>" +
            "<td>Login: " +
            "</td><td>"+ usuario.login +"</td>" +
            "</tr><tr>"+
			"<td>Nome: " +
            "</td><td>"+ usuario.nome +"</td>" +
            "</tr><tr>"+
			"<td>Pps: " +
            "</td><td>"+ "0" +"</td>" +
            "</tr><tr>"+
			"<td>Tempo de jogo: " +
            "</td><td>"+ converteTempo(dadosPessoais[0].tempo) +"</td>" +
            "</tr><tr>"+
			"<td>Fase: " +
            "</td><td>"+ dadosPessoais[0].fase +"</td>" +
            "</tr><tr>"+
			"<td>Dinheiro geral: " +
            "</td><td>"+ dadosPessoais[0].dinheiroGeral +"</td>" +
            "</tr><tr>"+
			"<td>Dinheiro atual: " +
            "</td><td>"+ dadosPessoais[0].dinheiro +"</td>" +
            "</tr><tr>"+
			"<td>Franklin geral" +
            "</td><td>"+ dadosPessoais[0].franklinGeral +"</td>" +
            "</tr><tr>"+
			"<td>Franklin atual" +
            "</td><td>"+ dadosPessoais[0].franklin +"</td>" +
            "</tr><tr>"+
            "<td>Ranking: " +
            "</td><td>"+ dadosPessoais[0].posicao + "<td>" +
            "</tr><tr>"+
            "<td>"+"<a class=\"linkButton\" href=\"?altera\">Alterar Dados</a></td>"+
            "</tr>";

		}else if(dadosPessoais == ""){
			dados += "<tr><td>Nenhum dado encontrado!</td></tr>";
		}		
		
		dados += "</tbody></table>";
		
		return dados;
		
	};
    
    //Busca todos os jogadores já com o ranking gerado lá na servlet Rank e depois da tabela ser gerada pelo 'geraTabekaRank' ele a mostra.
    BuscaDadosRank = function(data){
    	$.ajax({
    		type: "POST",
    		url: caminho + "Rank",
    		success: function(clientes){
                var tabela = gerarTabelaRank(clientes,data);
                $("#ranking_jog").html(tabela);
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
            html = gerarTabelaRank(clientes,(cont-1));
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
            "<td><a class='denuncia' onclick=Denunciar(\""+clientes[i].login+"\")>Denunciar</a></td>"+
            "</tr>";
            if(i==50*(cont+1)-1){
                break;
            }
        }
        html+="</tbody></table>";
        html+="<div class='imgs_tabela'><img src='../../css/imagens/seta_i.png' class='img_tabela' alt='Voltar ranking' title='Voltar ranking' onclick='carregarPagina("+(cont-1)+",\"rank\")'>"+
        "<img src='../../css/imagens/seta.png' class='img_tabela' alt='Avançar ranking' title='Avançar ranking' onclick='carregarPagina("+(cont+1)+",\"rank\")'></div>";
        
        return html;
    }

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
    }

    //Serve para denunciar um jogador e para mostrar o modal que permite o usuario denunciar e dizer qual o motivo da denuncia.
    Denunciar =  function(login){
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
                            Denunciar(login);
                            $(this).dialog("close");
                        }else{
                            $(this).dialog("close");
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
                },
                error:function(info){
    
                }
            });
        }
    }

    //Valida e altera os dados do jogador.
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
                            }
                        }
                    };
                    $("#msg").dialog(cfg);
                    $("#msg").html(msg.msg);
				},
				error: function(info){
					alert("Ocorreu um erro ao modificar a conta: " + info.status + " - " + info.statusText);
				}
			});

			
	    }
    }

    //Valida a data inserida no compo nascimento do alterar dados.
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
    
    //carrega os dados do jogador e o mostra nos campos respequitivos na página da alterar dados.
	carregaAlterar = function() {
		$("#nome").val(usuarioLogado.nome);
		$("#login").val(usuarioLogado.login);
		$("#email").val(usuarioLogado.email);
		$("#nascimento").val(usuarioLogado.nascimento);
	}
});