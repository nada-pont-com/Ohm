var cliente;
var caminho = "../../";
var game;
var maquinas = [];
var producao = 0;
var validaCarregamentoM = false;
var baterias = [];
var pesquisas = [];
var numeroMaquinas = 0;
dadosJogo = function(){
    $.ajax({
        type:"POST",
        data: "login="+usuarioLogado.login,
        url: caminho+"BuscaUsuario",
        success: function(dados){
            if(dados[1]!=undefined){
                cliente = dados[1];
                console.log(cliente);
                buscaMaquinas();
            }else{
                alert("Erro ao carregar o jogo");
            }
        },
        error:function(info){
            alert("Erro ao carregar o jogo");
        }
    });
}

buscaMaquinas = function(){
    $.ajax({
        type: "POST",
        data: cliente,
        url: caminho+"BuscaMaquinas",
        success:function(dados){
            if(dados.msg==undefined){
                var maquinasL = dados[1];
                var maquinasDados = dados[0];
                let cont = 0;
                console.log(dados);
                for (let i = 0; i < dados[1].length; i++) {
                    console.log(maquinasDados[i]);
                    if(maquinasDados[i]!=undefined){

                        if(maquinasL[i].id==maquinasDados[i].maquinas_id){
                            var maquinas2 = new Object;
                            maquinas2 = maquinasL[i];
                            maquinas2.clientes_id = maquinasDados[i].clientes_id;
                            maquinas2.multiplicador = maquinasDados[i].multiplicador;
                            maquinas2.quantidade = maquinasDados[i].quantidade;
                            let valor = maquinasL[i].valor;
                            for(let i2 = 0;i2<maquinasDados[i].quantidade;i2++){
                                valor = valor+(valor*0.5);
                            }
                            maquinas2.valor = valor;
                            maquinas[i] = maquinas2;
                            numeroMaquinas++;
                        }
                    }
                }
                console.log(maquinas);
                buscaBaterias();
            }else{
                alert(dados.msg);
            }
        },
        error:function(info){
            alert("Erro ao carregar o jogo");
        }
    });
}

buscaBaterias = function(){
	$.ajax({
		type:"POST",
		data: cliente,
		url:caminho+"BuscaBaterias",
		success: function(dados){
			console.log(dados);
			if(dados.msg==undefined){
                var bateriasL = dados[1];
				var bateriasDados = dados[0];
                for (let i = 0; i < dados[1].length; i++) {
                    if(bateriasDados[i]!=undefined){
                        if(bateriasL[i].id==bateriasDados[i].bateriasId){
                            var baterias2 = new Object;
                            baterias2 = bateriasL[i];
                            baterias2.clientes_id = bateriasDados[i].clientesId;
                            baterias2.quantidade = bateriasDados[i].quantidade;
                            let valor = bateriasL[i].valor;
                            console.log(bateriasDados[i]);
                            if(bateriasDados[i].quantidade!=undefined){
                                for(let i2 = 0;i2 < bateriasDados[i].quantidade;i2++){
                                    valor = valor+(valor*0.5);
                                }
                            }
                            baterias2.valor = valor;
                            baterias[i] = baterias2;
                        }
                    }
                }
                console.log(baterias);
                buscaPesquisas();
            }else{
                alert(dados.msg);
            }
		},
		error:function(info){
			alert("Erro ao carregar o jogo");
		}
	});
}

buscaPesquisas = function(){
    $.ajax({
        type:"POST",
        data: cliente,
        url: caminho+"BuscaPesquisas",
        success: function(dados){
            console.log(dados);
            if(dados.msg==undefined){
                var pesquisasL = dados[1];
                var pesquisasDados = dados[0];
                for (let i = 0; i < dados[1].length; i++) {
                    var pesquisas2 = new Object;
                    pesquisas2 = pesquisasDados[i];
                    pesquisas2.tempo = pesquisasL[i].tempo;
                    pesquisas2.clientes_id = pesquisasL[i].clientes_id;
                    pesquisas2.estado = pesquisasL[i].estado;
                    pesquisas[i] = pesquisas2;
                }
                jogo();
            }
        }
    });
}
dadosJogo();
jogo = function(){
   
    class inicio extends Phaser.Scene{
        constructor(){
            super({key:"inicio"});
        }

        create(){//fazer um validador para dizer qual cena inicial se deve carregar primeiro;
            this.scene.start("fases");
        }
    }

	var venderComprar, resetaJ, resetaF,pg, josh, bg, texto, txtContinuar, men,comprar,vender, comp, menuPesq, menuComp, confMenu ,menuComprar, conf, melho,seta,setaMenuComprar,setaComp, setaPes, setaConf, pesq,animsMenu = {0:"config",1:"compra",2:"pesquisa",3:"melhoria",4:"comprarMaquina",5:"venderMaquina", 6:"resetarF", 7:"resetarJ"};//variaveis para menu e a intro;
	var texto1,texto2; //texto para o proximaFasa
    var menuAD,menuCompAD,pesMenuAD,menuComprarVenderAD,confMenuAD; //serve para disser se o menu esta ativo ou não;
    var comprarMenu = [],sceneMaquinasMenu = [],txtQuantidadeMaquinas = [];
	class intro extends Phaser.Scene{
		constructor (){
			super({ key: 'intro' });	
		}
	
		preload(){
			//this.load.spritesheet('xiquita','../css/imagens/xiquita.png', { frameWidth: 32, frameHeight: 48 });
			this.load.image('fabrica','../../css/imagensJogo/fabricaIntro.png');
			this.load.image('personagem 0','../../css/imagens/personagem0.png');
			this.load.image('Josh','../../css/imagensJogo/JoshIntro.png');
			
		}
	
		create(){
			
			var referencia = 1;
			texto = this.add.text(572, 290, "Os sistemas da nave começam a falhar, \n na tela surgem centenas de avisos sobre um erro no motor espaço-temporal, \n  o buraco de minhoca por onde estava viajando torna-se instável, \n   e por fim a nave cái, num planeta desconhecido e cheio de vida... \n    A criatura observa que caiu numa construção abandonada, \n     e sua nave, cujo nome da IA é Xiquita, alerta-o sobre a presença de formas de vida."); 
			
			texto.setDisplayOrigin(texto.width/2, texto.height/2);
			
			txtContinuar = this.add.text(100,500,"Clique para continuar",{fill:"#fff"});
			txtContinuar.setDisplayOrigin(0,txtContinuar.height);
			
			txtContinuar.setInteractive();
			
			this.input.on("pointerdown", function (ev){
                if(referencia==1){
                    texto.setText("Uma forma de vida bípede surge a frente do alien, \n E então, ambos acabam tendo uma conversa calorosa, \n  A criatura dependeu da IA para comunicar-se, mas logo entendeu a linguagem humana..."); 
                    referencia++;
                }else if(referencia==2){
                    bg = this.add.image(0, 0, 'fabrica');
						bg.setOrigin(0,0);
						bg.setScale(2.5);
						pg = this.add.image(300, 500, 'personagem 0');
						pg.setScale(2.4);
						josh = this.add.image(350, 500, 'Josh');
						josh.setScale(0.6);
                        bg.setInteractive();
                        referencia++;
                }else if(referencia==3){
                    bg.destroy();
                    pg.destroy();
                    josh.destroy();
                    texto.setText("Não sei o que deseja aqui! \n - Diz o senhor que se apresentou como Josh - \n  Mas se deseja permanecer, irei ensinar-te a cuidar de uma empresa de energia! \n   - O alien torna a forma de um Humano, e consente com a informação - ...");
                    referencia++;
                }else if(referencia==4){
                    this.scene.start("tuturial");
                }
					
				txtContinuar.on("pointerdown", function (ev){	
					
					if((bg == undefined) && (pg == undefined) && (josh == undefined)){
						
						
						bg.on("pointerdown", function(ev){
							
							
							txtContinuar.on("pointerdown", function (ev){
								texto.destroy();
								txtContinuar.destroy();
								
								//
							}, this)
						}, this)
					}
					
					}, this) 
				}, this) 
			
		//	this.add.spritesheet();
			//this.add.image();
			//this.add.image();
		//	this.add.image();
		}
	
		
		
		update(){
			
		}
		
	}
	
    class menu extends Phaser.Scene{
		constructor (){
			super({ key: 'menu' });
		}
	
		preload(){
            this.load.image('menu','../../css/imagensJogo/menu.png');
            this.load.image('menuConfi','../../css/imagensJogo/menuConfi.png');
            this.load.image('menuComp','../../css/imagensJogo/menuComp.png');
            this.load.image('setaMenu','../../css/imagensJogo/setaMenu.png');
            this.load.image('menuConfi','../../css/imagensJogo/menuConfi.png');
            this.load.image('setaMenuComprar','../../css/imagensJogo/setaMenuCompra.png');
            this.load.image('menuComprar','../../css/imagensJogo/menuCompra.png');
            this.load.image('comprarMenu','../../css/imagensJogo/comprarMenu.png');         
            this.load.image('menuPesquisas','../../css/imagensJogo/menuPesquisas.png');         
            this.load.image('pesquisarMenu','../../css/imagensJogo/pesquisarMenu.png');         
            this.load.spritesheet('resetarJ','../../css/imagensJogo/resetarJ.png', {frameWidth:143, frameHeight:106});
            this.load.spritesheet('resetarF','../../css/imagensJogo/resetarF.png', {frameWidth:116, frameHeight:96});
            this.load.spritesheet('comprarMaquina','../../css/imagensJogo/comprarMaquinas.png',{ frameWidth: 61, frameHeight:  77});
            this.load.spritesheet('venderMaquina','../../css/imagensJogo/venderMaquinas.png',{ frameWidth: 100, frameHeight:  159});
			this.load.spritesheet('compra','../../css/imagensJogo/compra.png', { frameWidth: 46, frameHeight: 46 });
			this.load.spritesheet('config','../../css/imagensJogo/configuracao.png', { frameWidth: 82, frameHeight: 74 });
			this.load.spritesheet('pesquisa','../../css/imagensJogo/pesquisa.png', { frameWidth: 49, frameHeight: 77 });
			this.load.spritesheet('melhoria','../../css/imagensJogo/melhoria.png', { frameWidth: 70, frameHeight: 70 });
		
		}
		
		create(){
            setaMenuComprar = this.add.image(0,290,"setaMenuComprar").setDisplayOrigin(0,19);
            setaComp = this.add.image( 0, 290, 'setaMenu').setDisplayOrigin(0,19);
            setaPes = this.add.image( 0, 290, 'setaMenu').setDisplayOrigin(0,19);
            setaConf = this.add.image( 0, 290, 'setaMenu').setDisplayOrigin(0,19);
            seta = this.add.image( 0, 290, 'setaMenu').setDisplayOrigin(0,19);
            setaComp.setInteractive();
            setaPes.setInteractive();
            setaConf.setInteractive();
			men = this.add.image( -136, 0, 'menu');
			men.setOrigin(0,0);
			conf = this.add.sprite(-68.5, 100, 'config').setScale(1);
			comp = this.add.sprite(-68.5, 232, 'compra').setScale(1.5);
			pesq = this.add.sprite(-68.5, 367, 'pesquisa').setScale(1);
			melho = this.add.sprite(-68.5, 495, 'melhoria').setScale(1);
            menuComp = this.add.image(-136,0,"menuComp").setOrigin(0,0);
            confMenu = this.add.image(-136,0,"menuConfi").setOrigin(0,0);
            comprar = this.add.sprite(-68.5,158,"comprarMaquina").setScale(2);
            vender = this.add.sprite(-68.5,422,"venderMaquina");
            resetaF = this.add.sprite(-68.5, 232,"resetarF");
            resetaJ = this.add.sprite(-68.5, 100,"resetarJ");
            menuComprar = this.add.image(-136,0,"menuComprar").setOrigin(0,0);
            menuPesq = this.add.image(-136,0,"menuPesquisas").setOrigin(0,0);

            let y = 50,x = -68,y2 = 100;
            for(let i = 1;i <maquinas.length; i++){
                comprarMenu[i-1] = this.add.image(-132,y,"comprarMenu").setOrigin(0,0);
                y += 134;
                txtQuantidadeMaquinas[i-1] = this.add.text(x,y2+40,"Quantidade: "+maquinas[i].quantidade,{fontSize:"13px"});
                txtQuantidadeMaquinas[i-1].setDisplayOrigin(txtQuantidadeMaquinas[i-1].width/2,txtQuantidadeMaquinas[i-1].height/2);
                sceneMaquinasMenu[i-1] = this.add.sprite(x,y2,"maquina"+maquinas[i].id);
                sceneMaquinasMenu[i-1].setScale(1);
                sceneMaquinasMenu[i-1].setInteractive();
                y2 += 134;
            }

            let py = 50 , px = -68,py2 = 100;
            for(let i = 0;i <pesquisas.length; i++){
                pesquisarMenu[i] = this.add.image(-132,py,"comprarMenu").setOrigin(0,0);
                py += 134;
                scenePesquisasMenu[i] = this.add.sprite(px,py2,"maquinas"+(pesquisas[i].id)+3);
                scenePesquisasMenu[i].setScale(1);
                scenePesquisasMenu[i].setInteractive();
                py2 += 134;
            }
            var txtValor = this.add.text(0,0,"",{fill:"#000",backgroundColor:"#fff"});

			for (let i = 0; i < 8; i++) {
				let i2 = 1;
				if(i==0){
					i2 = 2;
                }
				this.anims.create({
					key: animsMenu[i],
					frames: this.anims.generateFrameNumbers(animsMenu[i], { start: 0, end: i2 }),
					frameRate: 10,
					repeat : -1
				});
            }
            setaMenuComprar.setInteractive();
            menuComp.setInteractive();
            confMenu.setInteractive();
            menuPesq.setInteractive();
            vender.setInteractive();
            comprar.setInteractive();
			seta.setInteractive();
			conf.setInteractive();
			comp.setInteractive();
			pesq.setInteractive();
			melho.setInteractive();
			resetaF.setInteractive();
			resetaJ.setInteractive();
			
			this.input.on("gameobjectdown", function(pointer,gameObject){
				//console.log(gameObject);
				switch (gameObject) {
					case conf:
					case setaConf:
						this.menu();
						this.menuConf();
					break;
                    case comp:
                    case setaComp:
                        this.menu();
                        this.menuComp();
					break;
                    case pesq:
                    case setaPes:
                    	this.menu();
                        this.menuPesq();
					break;
					case melho:
					console.log("melho");
					break;
					case seta:
                        this.menu();
                    break;
                    case vender:
                        this.menuComp();
                        this.menuComprarVender();
                        venderComprar = "vender";
                    break;
                    case comprar:
                        this.menuComp();
                        this.menuComprarVender();
                        venderComprar = "comprar";
                    break;
                    case setaMenuComprar:
                        this.menuComp();
                        this.menuComprarVender();
                    break;
				}
            }, this);
            
            this.input.on("gameobjectdown",function(pointer,gameObject){
                for(let i = 0;i < sceneMaquinasMenu.length;i++){
                    if(sceneMaquinasMenu[i]==gameObject){
                        var fase = new fases;
                        if(venderComprar=="comprar"){
                            fase.comprarMaquina(i+1);
                        }else if(venderComprar=="vender"){
                            
                            fase.venderMaquina(i+1);
                        }
                    }
                }
            },this);
            this.input.on("pointerover",function(pointer,gameObject){
                for(let i = 0;i < maquinas.length;i++){
                    if(sceneMaquinasMenu[i]==gameObject[0]){
                        txtValor.setPosition(pointer.position.x,pointer.position.y);
                        let valor = maquinas[i+1].valor;
                        if(venderComprar == "vender"){
                            if(maquinas[i+1].quantidade != 0){
                                valor = (valor*100)/150;
                                valor  = parseInt(valor - (valor*0.25));
                            }else{
                                valor = "Não é posivel vender";
                            }
                        }
                        if(parseInt(valor)==NaN){
                            txtValor.setText("Valor: "+parseInt(valor));
                        }else{
                            txtValor.setText("Valor: "+valor);
                        }

                        //console.log(this.input.activePointer);
                    }
                }
            },this);
            this.input.on('pointerout', function () {
                txtValor.setText("");
            });
			console.log(comp);
			conf.anims.play('config', true);
			 
			comp.anims.play('compra', true);
			 
			pesq.anims.play('pesquisa', true);
			 
            melho.anims.play('melhoria', true);

            vender.anims.play("venderMaquina",true);

            comprar.anims.play("comprarMaquina",true);
            
            resetaF.anims.play("resetarF",true);
            
            resetaJ.anims.play("resetarJ",true);

            /* var fase  = new fases;
            fase.comprarMaquina(10); */
		}
		
		update(){
		
        }
        
        menu(){
            if(menuAD)
                menuAD = false; //quando o menu tá desativado
            else // Quando o valor vem true signigica que o menu está ativado, e quando vir false o menu esta dessativado;
                menuAD = true; //quando o menu tá ativado
                console.log(menuAD);
            var intervalo = setInterval(function(){
                if(menuAD){
                    if(men.x<0){
                        men.x++;
                        seta.x++;
                        conf.x++;
                        melho.x++;
                        pesq.x++;
                        comp.x++;
                    }else{
                        clearInterval(intervalo);
                    }
                }else{
                    if(men.x>-136){
                        men.x--;
                        seta.x--;
                        conf.x--;
                        melho.x--;
                        pesq.x--;
                        comp.x--;
                    }else{
                        clearInterval(intervalo);
                    }
                }
            },1,this);
        }

        menuComp(){
            if(menuCompAD){
                menuCompAD = false;//quando o menu tá desativo
            }else{ // Quando o valor vem true signigica que o menu está ativado, e quando vir false o menu esta dessativado;
                menuCompAD = true;//quando o menu tá ativado
            }
            var intervalo = setInterval(function(){
                if(menuCompAD){
                    if(menuComp.x<0){
                        menuComp.x++;
                        setaComp.x++;
                        comprar.x++;
                        vender.x++;
                    }else{
                        clearInterval(intervalo);
                    }
                }else{
                    if(menuComp.x>-136){
                        menuComp.x--;
                        setaComp.x--;
                        comprar.x--;
                        vender.x--;
                    }else{
                        clearInterval(intervalo);
                    }
                }
            },1,this);
        }

        menuComprarVender(){
            if(menuComprarVenderAD){
                menuComprarVenderAD = false;//quando o menu tá desativo
            }else{ // Quando o valor vem true signigica que o menu está ativado, e quando vir false o menu esta dessativado;
                menuComprarVenderAD = true;//quando o menu tá ativado
            }
            var intervalo = setInterval(function(){
                if(menuComprarVenderAD){
                    if(menuComprar.x<0){
                        menuComprar.x++;
                        setaMenuComprar.x++;
                        for (let i = 1; i < numeroMaquinas; i++) {
                            comprarMenu[i-1].x++;
                            sceneMaquinasMenu[i-1].x++;
                            txtQuantidadeMaquinas[i-1].x++;
                        }
                    }else{
                        clearInterval(intervalo);
                    }
                }else{
                    if(menuComprar.x>-136){
                        menuComprar.x--;
                        setaMenuComprar.x--;
                        for (let i = 1; i < numeroMaquinas; i++) {
                            comprarMenu[i-1].x--;
                            sceneMaquinasMenu[i-1].x--;
                            txtQuantidadeMaquinas[i-1].x--;
                        }
                    }
                }
            },this);
        }
        
        menuPesq(){
        	 if(pesMenuAD){
             	pesMenuAD = false;
           }else{
             	pesMenuAD = true;
           }  
        	 var intervalo = setInterval(function(){
          		if(pesMenuAD){
                     if(menuPesq.x<0){
                     	menuPesq.x++;
                        setaPes.x++;
                     }else{
                         clearInterval(intervalo);
                     }
                 }else{
                     if(menuPesq.x>-136){
                     	menuPesq.x--;
                         setaPes.x--;
                     }else{
                         clearInterval(intervalo);
                     }
                 }
          	},1,this);     	 
        }
        
        menuConf(){
       	 if(confMenuAD){
       		confMenuAD = false;
            }else{
            	confMenuAD = true;
            }
       	 
       	 var intervalo = setInterval(function(){
         		if(confMenuAD){
                    if(confMenu.x<0){
                    	confMenu.x++;
                       setaConf.x++;
                       resetaF.x++;
                       resetaJ.x++;
                    }else{
                        clearInterval(intervalo);
                    }
                }else{
                    if(confMenu.x>-136){
                    	confMenu.x--;
                    	setaConf.x--;
                    	resetaF.x--;
                        resetaJ.x--;
                    }else{
                        clearInterval(intervalo);
                    }
                }
         	},1,this);
       	 
       }
        
	}


    class proximaCena extends Phaser.Scene{
        constructor(){
            super({key:"proximaCena"});
        }
        preload(){
            this.load.image("imgCena","../../css/imagens/faseCena"+cliente.fase+".png");
        }

        geraTextos(){
            switch(cliente.fase){
                case 1:
                    texto1 = "Mas conforme os anos passam um problema aflora\n no pulmão do velhinho,que parte da empresa.";
                    texto2 = "Os tempos tornam-se mais solitários com o desaparecimento do \"velho\",\n seu único amigo,os dias ficam cinzas e as coisas perdem cores, todo dia\n  ele mergulha-se no trabalho";
                    break;
                case 2:
                    texto1 = "Até que no fim da primeira fase a primeira parte de seu protocolo é iniciada,\n o sistema da nave apaga de sua memória coisas que afetem sua missão,\n  seu objetivo torna-se mais claro e a primeira fase termina interligando-se\n   com o início da segunda.";
                    texto2 = "A segunda fase inicia-se com uma consciência maior por parte do Alien,\n ele nota que apesar da ciência ser capaz de realizar milagres, ela não\n  é capaz de impedir o prelúdio humano,o protagonista percebe que não\n   pode continuar com a mesma ilusão e resolve mudá-la, e assim\n   marca o início de uma nova fase.";
                    break;
                case 3:
                    texto1="Sua nova forma elegeu-se dona da empresa e continua seu caminho solitário,\n ele desfaz-se das manivelas e permanece apenas com uma, para lembrar dos\n  velhos tempos, esta permanece no centro de sua mesa. Até que algum dia\n   enquanto trabalhava ele conhece uma bela secretária, uma ruiva que o\n    atrai, não por sua aparência, mas por seu intelecto e cultura, novamente\n     ele volta a criar vínculos humanos com desaprovação de sua inteligência\n      artificial, eles aproximam-se pelos dias, até o dia em que ele revela sua\n       aparência, a garota revela que o ama e ambos voltam a seus lares felizes,\n        no dia seguinte a garota não aparece no trabalho, um boato de que ela\n         foi encontrada morta em sua casa,dizem ter sido suicídio, novamente ele\n          volta a focar no trabalho para ocultar sua dor, que é moderadamente\n           apreciada por sua IA, esta fase então chega ao fim.";
                    texto2="E como em todo marco de uma nova fase ele adapta-se a consciência global\n e muda de forma, os pecados das memórias anteriores são exilados da\n  mente do extraterrestre, o visual clássico valoriza-se junto a arte do oculto,\n   livros e jornais popularizam-se pelos mundanos,mostrando as geniali-\n    dades da ciência e do obscuro escravos são tomados, vidas são ceifadas,\n     trabalhadores assalariados passam fome e a miséria é encontrada em\n      abundância. As máquinas começam a moldar os trabalhadores em\n       sua vida sofrida, mas os planos da inteligência artificial estão cada\n        vez mais próximos, o trabalho humano mostra-se extremamente útil,\n         e a vida passa tranquilamente para um empresário centenário.";
                    break;
                case 4:
                    texto1="Entretanto de coração fraco, de sua cabine destacada ele observa o\n sofrimento que seu egoísmo estava causando, ele volta a enxer-\n  gar os problemas e foca nos trabalhos e evoluções, porém o dia\n   de sua chega, e ele perde novamente suas memórias \"ruins\"\n    e a terceira fase acaba.";
                    texto2="A quarta fase inicia com o protagonista mudando sua forma, seu pensamento\n volta-se ao passado, o protagonista nota que a capacidade humana de adaptar-\n  -se é incrível, e permitiu um rápido avanço em direção aos seus objetivos\n   porém ela também pode virar um problema, revoluções emergem por todo o globo,\n    escravos, pobres, colônias e quaisqueres seres com alguma consciência\n     sentem-se indignados com sua situação de inferioridade, e idéias liberais\n      eclodem no planeta, vendo que esta situação impediria o avanço tecnológico\n       por algumas décadas, ele aprimora as máquinas antigas que funcionavam\n       através da água ou ar.";
                    break;
                case 5:
                    texto1="Neste período ele adota um Beagle Alemão, mas assim como a seus esquecidos amigos,\n a cadela de nome Kitty não aguenta o passar do tempo, e em uma noite tempestuosa,\n  ela morre devido a problemas renais, e esta é a primeira vez que o alien reseta parte\n   de sua memória por opção e então a fase acaba.";
                    texto2="Sua dor é apagada novamente e a ilusão é reformulada, um novo mundo aparece\n a sua frente conforme os séculos passam e o mundo muda. Uma mão negra\n  esmaga a Terra no ápice do egoísmo humano, dezenas de teorias espalham-\n   -se com a grande potência elétrica e energética, comandada pelo Alien, seus\n    cientistas analisam os átomos e descobrem ser possível utilizar suas energias\n     para o bem proveito, os pilares das grandes produções de eletricidade são\n      estabelecidos por ele e seus ajudantes, o que seria bom de certa forma, mas\n       a ganância humana fala mais alto e acabam roubando a fórmula da produção\n        de urânio.";
                    break;
                case 6:
                    texto1="Em questão de anos ele vê sua tecnologia sendo usada como arma de destruição\n em massa, e novamente o peso dos anos afeta seu corpo e mente, sua sala\n  pessoal torna-se mais bagunçada e até abandonada, a nave intervêm\n   novamente e modela suas memórias outra vez, e isto marca\n    o fim da quinta fase.";
                    texto2="Sua forma muda e ele nota a efemeridade das coisas, tudo não passa\n de um ciclo supostamente infinito que ninguém ousa impedir, mas\n  acima disto, a excitação pela proximidade com a energia que lhe\n   faltava era muito alta. Após tantos estilos de energia, o controle da\n    antimatéria finalmente estava perto, a energia,a eletricidade e a Terra\n     estavam em suas mãos, a natureza volta a ser cultuada e ele observa,\n      até com um pouco de orgulho, a evolução da humanidade sobre sua\n       influência, um aviso aparece em seu computador, a antimatéria havia sido\n        refinada com sucesso, agora ele pode consertar o motor de fusão temporal.";
                    break;
            }
        }
        create(){
            var texto = 1;
            var imagen;
            this.geraTextos();
            var txt = this.add.text(572 , 290,texto1, {fill:"#fff"});
            txt.setDisplayOrigin(txt.width/2,txt.height/2);
            var txtContinuar = this.add.text(100,500,"Clique para continuar",{fill:"#fff"});
            txtContinuar.setDisplayOrigin(0,txtContinuar.height);
            console.log(txtContinuar);

            this.input.on('pointerdown', function () {
                if(texto ==  1){
                        txt.destroy();
                        imagen = this.add.image(572,290,"imgCena");
                        console.log(imagen);
                        texto = 2;
                }else if(texto==2){
                    imagen.destroy();
                    txt = this.add.text(572,290,texto2, {fill:"#fff"});
                    txt.setDisplayOrigin(txt.width/2,txt.height/2);
                    texto=3
                }else if(texto==3){
                    txtContinuar.destroy();
                    txt.destroy();
                    this.scene.start("fases");
                }
            },this);
        }
        update(){
        }
    }

    //-------------------------variaveis da fases -----------------------------------------------------------------
    var armazenamento = 0;
    var frameWH = [{frameWidth: 46, frameHeight: 58},{frameWidth: 46, frameHeight: 58},{frameWidth: 740, frameHeight: 1148 }];
    var frameBateria = [{frameWidth: 1633, frameHeight: 814},{frameWidth: 690, frameHeight: 370}];
    var txt;
    var sceneMaquinas = [];
    var x,y,scale = {0:2,1:2,2:0.07};// cordenadas das maquinas e escala;
    var numeroFrame = {1:4,2:4,3:9};
    var casoEspecial = {0:-1,1:0};
    var setaMenu, menuMaquinas, menuMaquinaAD;
    
    //---------------------------------fases-----------------------------------------------------------------------
    class fases extends Phaser.Scene{
        constructor(){
            super({key:"fases"});
        }

        preload(){
        	this.load.image("recurso", "../../css/imagensJogo/recursos.png");
        	this.load.image("dinheiro", "../../css/imagensJogo/dinheiro.png");
        	this.load.image("energia", "../../css/imagensJogo/energia.png");
        	this.load.image("armazenamento", "../../css/imagensJogo/armazenamento.png");
        	this.load.image("fundo", "../../css/imagensJogo/fundoMaquina.png");
            this.load.image("fabrica1","../../css/imagensJogo/fabrica"+cliente.fase+".png");
			this.load.image("menuMaquinas","../../css/imagensJogo/menuMaquinas.png");
			this.load.image("setaMenuMaquinas","../../css/imagensJogo/setaMenuMaquinas.png");
			this.load.image("venderEnergia","../../css/imagensJogo/venderEnergia.png");
            //console.log(frameBateria);
            // Para carregar as baterias
            for (let i = 0; i < baterias.length; i++) {
				console.log("../../css/imagensJogo/bateria"+baterias[i].id+".png");
                this.load.spritesheet("bateria"+baterias[i].id,"../../css/imagensJogo/bateria"+baterias[i].id+".png",frameBateria[baterias[i].id-1]);
            }
            for (let i = 0; i < maquinas.length; i++) {
                this.load.spritesheet("maquina"+maquinas[i].id,"../../css/imagensJogo/maquina"+maquinas[i].id+".png",frameWH[((maquinas[i].id)-1)]);
            }
        }
        create(){
            console.log("ola");
			this.add.image(0,0,"fabrica1").setOrigin(0,0);
			menuMaquinas = this.add.image(1144,0,"menuMaquinas").setOrigin(0,0);//298
            setaMenu = this.add.image(1124,290,"setaMenuMaquinas").setDisplayOrigin(0,19);
            setaMenu.setInteractive();
            pesquisas[0].estado = "iniciado";
            this.pesquisas();
			this.scene.launch("menu");
            this.maquinaEspecial = this.add.sprite(100,100,"maquina1").setOrigin(0,0);
            x = 1214;
            y = 141;
            for (let i = 1; i < maquinas.length; i++) {
                sceneMaquinas[i-1] = this.add.sprite(x,y,"maquina"+maquinas[i].id);
                x += 146;
                if(x==1430){
                    x = 1284;
                    y += 165;
                }
                sceneMaquinas[i-1].setScale(scale[i]);
                sceneMaquinas[i-1].setInteractive();
            }
            this.armazenamentoBaterias();
            this.maquinaEspecial.setScale(2);
            this.maquinaEspecial.setInteractive();
            txt = this.add.text(16,16,"Dinheiro: "+cliente.dinheiro+"   Energia: " + cliente.energia+"  Armazenamento: "+armazenamento,{fontSize:"32px",fontFamily:"Arial",fill:"#000"});
            var txtDesc = this.add.text(0,0,"",{fill:"#000",backgroundColor:"#fff"}).setPadding(5);
            for (let i = 0; i < maquinas.length; i++) {
                let  i2 = 0;
                if(maquinas[i].id==1){
                    i2 = 1;
                }
                this.anims.create({
                    key: ("maquinaAnimi"+maquinas[i].id+""),
                    frames: this.anims.generateFrameNumbers(("maquina"+maquinas[i].id+""), { start: 0, end: numeroFrame[maquinas[i].id] }),
                    frameRate: 10 ,
                    repeat: casoEspecial[i2]
                });
                if(i!=0){
                    sceneMaquinas[i-1].anims.play("maquinaAnimi"+maquinas[i].id);
                }
            }
            
            var recursos = this.add.image(572,0,"recurso");

            
            recursos.setDisplayOrigin(recursos.width/2,0);
            
            this.add.image(450,0,"dinheiro").setOrigin(0,0);
            
            this.add.image(375,0,"energia").setOrigin(0,0);
            
            this.add.image(700,0,"armazenamento").setOrigin(0,0);
            
            this.add.image(572,290, "fundo").setOrigin(0,0);
            
            this.input.on("gameobjectdown",function(pointer,gameObject){
                switch(gameObject){
                    case this.maquinaEspecial:
                        cliente.energia++;
                        this.maquinaEspecial.anims.play("maquinaAnimi1",true);
                    break;
                    case setaMenu:
                        if (menuMaquinaAD)
                            menuMaquinaAD = false; 
                        else 
                            menuMaquinaAD = true;
                        var intervalo = setInterval(function(){
                            if(menuMaquinaAD){
                                if(menuMaquinas.x>846){
                                    menuMaquinas.x--;
                                    setaMenu.x--;
                                    for (let i = 1; i < numeroMaquinas; i++) {
                                        console.log(numeroMaquinas);
                                        sceneMaquinas[i-1].x--;
                                    }
                                }else{
                                    clearInterval(intervalo);
                                }
                            }else{
                                if(menuMaquinas.x<1144){
                                    menuMaquinas.x++;
                                    setaMenu.x++;
                                    for (let i = 1; i < numeroMaquinas; i++) {
                                        sceneMaquinas[i-1].x++;
                                    }
                                }else{
                                    clearInterval(intervalo);
                                }
                            }
                        },0,this);
                    break;
                    case pesq:
                       
                    break;
                    case teste:
                    this.converter();
                    break;
                }
            },this);
            this.input.on("pointerover",function(pointer,gameObject){
                for(let i = 0;i < maquinas.length;i++){
                    if(sceneMaquinas[i]==gameObject[0]){
                        txtDesc.setPosition(pointer.position.x,pointer.position.y);
                        if(i%2==1){
                            txtDesc.setDisplayOrigin(txtDesc.width,0);
                        }else{
                            txtDesc.setDisplayOrigin(0,0);
                        }
                        var textoSplit = maquinas[i].desc.split(" ");
                        var texto = [];
                        let cont = 0;
                        var text = "";
                        for (let i2 = 0; i2 < textoSplit.length; i2++) {
                            text += textoSplit[i2]+" ";
                            if(text.length>15){
                                texto[cont] = text;
                                cont++;
                                text = "";
                            }
                        }
                        txtDesc.setText(texto);
                        //console.log(this.input.activePointer);
                    }
                }
            },this);
            this.input.on('pointerout', function () {
                txtDesc.setText("");
            });
            let teste = this.add.image(125,170,"venderEnergia").setInteractive();

			this.maquinasAutomaticas();
        }
        update(){
            if(cliente.energia>armazenamento){
                cliente.energia = armazenamento;
                console.log(cliente.energia);
            }
            txt.setText("Dinheiro: "+cliente.dinheiro+"   Energia: " + cliente.energia+"  Armazenamento: "+armazenamento);
        }

        armazenamentoBaterias(){
            for(let i = 0;i<baterias.length;i++){
                if(baterias[i].quantidade!=undefined){
                    armazenamento += (baterias[i].quantidade)*(baterias[i].armazenamento);
                }
            }
        }

        maquinasAutomaticas(){
            var intervalo = setInterval(function(){
                var ppsTotal = 0;
                for (let i = 1; i < maquinas.length; i++) {
                    if(maquinas[i].quantidade!=undefined){
                        ppsTotal += (maquinas[i].pps)*(maquinas[i].quantidade);
                    }
                }
                cliente.energia += ppsTotal;
            },1000,this);
        }

        converter(){
            let energia = cliente.energia;
            for(let i = 0;i<energia;i++){
                let validador = 0;
                validador = cliente.energia-2;
                if(validador>=0){
                    cliente.energia-=2;
                    cliente.dinheiro+=1;
                }else{
                    break;
                }
            }
        }

        comprarMaquina(id){
            if (menuMaquinaAD)
                menuMaquinaAD = false; 
            else 
                menuMaquinaAD = true;
            for (let i = 0; i < 298; i++) {
                if(menuMaquinas.x<1144){
                    menuMaquinas.x++;
                    setaMenu.x++;
                    for (let i = 1; i < numeroMaquinas; i++) {
                        sceneMaquinas[i-1].x++;
                    }
                }
            }
            var validador = cliente.dinheiro-parseInt(maquinas[id].valor);
            let valor = maquinas[id].valor;
            if(validador>-1){
                cliente.dinheiro = validador;
                maquinas[id].valor = valor+(valor*0.5);
                if(maquinas[id].quantidade != undefined){
                    maquinas[id].quantidade++; 
                }else{
                    maquinas[id].quantidade = 1;
                }
                txtQuantidadeMaquinas[id-1].setText("Quantidade: "+maquinas[id].quantidade);
                
            }
        }

        
        venderMaquina(id){
            var validador = maquinas[id].quantidade;
            if(validador != 0){
                maquinas[id].quantidade--;
                var valor = maquinas[id].valor;
                valor = (valor*100)/150;
                maquinas[id].valor = valor;
                valor = valor - (valor*0.25);
                txtQuantidadeMaquinas[id-1].setText("Quantidade: "+maquinas[id].quantidade);
                cliente.dinheiro += parseInt(valor);
            }
        }
        
        tempo(tempo){
            var time = tempo.split(" ");
            let data;
            if(time[1]){
                data = time[0];
                tempo = time[1];
            }else{
                tempo = time[0];
            }
            tempo = tempo.split(":");
            if(data!=undefined){
                data = data.split("-");
                return data,tempo;
            }
            return tempo;
        }

        pesquisas(id){
            var temp = new Object;
            if(id==undefined){
                var tempo = [];
                for(let i = 0;i<pesquisas.length;i++){
                    var tempo2 = this.tempo(pesquisas[i].tempo);
                    temp.hora = tempo2[0];
                    temp.min = tempo2[1];
                    temp.seg = tempo2[2];
                    tempo[i] = temp;
                    if(pesquisas[i].estado=="iniciada"){
                        var intervalo = setInterval(function(){
                            tempo[i].seg--;
                            if(tempo[i].seg==-1){
                                tempo[i].seg = 59;
                                tempo[i].min--;
                            }
                            if(tempo[i].min==-1){
                                tempo[i].min = 59;
                                tempo[i].hora--;
                            }
                            if(tempo[i].hora == 0 && tempo[i].min == 0 && tempo[i].seg ==0){
                                pesquisas[i].estado = "finalizada";
                            }
                            pesquisas[i].tempo = tempo;
                            if(pesquisas[i].estado=="finalizada"){
                                clearInterval(intervalo);
                            }
                        },1000,this);
                    }
                }
            }else{
                var tempo2 = this.tempo(pesquisas[id].tempo);
                temp.hora = tempo2[0];
                temp.min = tempo2[1];
                temp.seg = tempo2[2];
                if(pesquisas[id].estado=="iniciada"){
                    var intervalo = setInterval(function(){
                        temp.seg--;
                        if(temp.seg==-1){
                            temp.seg = 59;
                            temp.min--;
                        }
                        if(temp.min==-1){
                            temp.min = 59;
                            temp.hora--;
                        }
                        if(temp.hora == 0 && temp.min == 0 && temp.seg ==0){
                            pesquisas[id].estado = "finalizada";
                        }
                        pesquisas[id].tempo = tempo;
                        if(pesquisas[id].estado=="finalizada"){
                            clearInterval(intervalo);
                        }
                    },1000,this);
                }
            }
        }

        pesquisar(id){
            if(pesquisas[id].estado=="n iniciada"){

                let validador = cliente.dinheiro-pesquisas[id].valor;
                
                if(validador>=0){
                    cliente.dinheiro =- pesquisas[id].valor;
                    pesquisas[id].estado="iniciada";
                    this.pesquisas(pesquisas[id].id);
                }
            }
        }
    }
    // ---------------- configuração do jogo ------------------------------------------------------------------
    var config = {
        type: Phaser.AUTO,
        width: 1144,//572 // 290
        height: 580,//ajeitar o css do jogo, de mim-height para height;
        parent :"jogo",
        scene: [inicio,intro,proximaCena,fases,menu]
    }

    game = new Phaser.Game(config);
}