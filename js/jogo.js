var cliente;
var caminho = "../../";
var game;
var maquinas = [];
var producao = 0;
var validaCarregamentoM = false;
var baterias = [];
var pesquisas = [];
var numeroMaquinas = 0;
var pause = false;
var retorno = [];

dadosJogo = function(){
    $.ajax({
        type:"POST",
        data: "login="+usuarioLogado.login,
        url: caminho+"BuscaUsuario",
        success: function(dados){
            if(dados[1]!=undefined){
                cliente = dados[1];
                console.log(cliente);
                jogo();
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
                for (let i = 0; i < dados[1].length; i++) {
                    if(maquinasDados[i]!=undefined){
                        if(maquinasL[i].id==maquinasDados[i].maquinas_id){
                            var maquinas2 = new Object;
                            maquinas2 = maquinasL[i];
                            maquinas2.clientes_id = maquinasDados[i].clientes_id;
                            maquinas2.multiplicador = maquinasDados[i].multiplicador;
                            maquinas2.quantidade = maquinasDados[i].quantidade;
                            maquinas2.valorOriginal = maquinasL[i].valor;
                            let valor = maquinasL[i].valor;
                            for(let i2 = 0;i2<maquinasDados[i].quantidade;i2++){
                                valor = valor+(valor*0.05);
                            }
                            let pps = maquinasL[i].pps
                            for(let i  = 1;i<maquinasDados[i].multiplicador;i++){
                                pps+= pps;
                            }
                            maquinas2.pps = pps;
                            maquinas2.valor = valor;
                            maquinas[i] = maquinas2;
                            numeroMaquinas++;
                        }
                    }
                }
                retornoSet(true,2);
                console.log(maquinas);
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
                            if(bateriasDados[i].quantidade!=undefined){
                                for(let i2 = 0;i2 < bateriasDados[i].quantidade;i2++){
                                    valor = valor+(valor*0.05);
                                }
                            }
                            baterias2.valor = valor;
                            baterias[i] = baterias2;
                        }
                    }
                }
                retornoSet(true,1);
                console.log(baterias);
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
                console.log(pesquisas);
                retornoSet(true,0);
            }else{
                alert(dados.msg);
            }
        },error:function(info){
            alert("Erro ao carregar o jogo");
        }
    });
}
dadosJogo();
jogo = function(){
   
    retornoGet = function(id){
        return retorno[id];
    }
    retornoSet = function(info, id){
        retorno[id] = info;
    }

    class inicio extends Phaser.Scene{
        constructor(){
            super({key:"inicio"});
        }
        preload(){
            this.load.image("load","../../css/imagensJogo/load.png");
            this.load.image("fundo","../../css/imagensJogo/fundo.png");
        }
        create(){//fazer um validador para dizer qual cena inicial se deve carregar primeiro;
        	
        	if((cliente.dinheiroGeral == 10) && (cliente.energia == 0) && (cliente.fase == 1)){
        		game.scene.start("tutorial");
        		
        	}
        		
            console.log("ola1");
            buscaMaquinas();
            buscaBaterias();
            buscaPesquisas();
            var progress = this.add.graphics();
            let load = this.add.image(420,268,"load").setOrigin(0,0);
            let txtLoad = this.add.text(477,200,"Carregando Dados",{fill:"#fff"});
            let value = 0;
            let intervalo = this.time.addEvent({ delay: 100, callback: function(){
                let txt = txtLoad.text.split("...");
                txtLoad.setText(txt[0]+".");
                progress.clear();
                progress.fillStyle(0xffffff, 1);
                progress.fillRect(422, 270, 20*value, 40);
                if(retornoGet(0)&&retornoGet(1)&&retornoGet(2)){
                    intervalo.remove(false);
                    txtLoad.destroy();
                    progress.destroy();
                    load.destroy();
                    game.scene.start("fases");
                    
                   
                }
                if(value==15){
                    value = 0;
                }
                value++;
            }, callbackScope: this, loop: true },this);
        }
    }

	var upgrade = {},intervaloPesqui = false,venderComprar,pausar, menuMel, setaMel, salvar, resetaJ, resetaF,pg, josh, bg, texto, txtContinuar, men,comprar,vender, comp, menuPesq, menuComp, confMenu ,menuComprar, conf, melho,seta,setaMenuComprar,setaComp, setaPes, setaConf, pesq,animsMenu = {0:"config",1:"compra",2:"pesquisa",3:"melhoria",4:"comprarMaquina",5:"venderMaquina",6:"resetarJ",7:"resetarF"}, animsI3 = {0:"pausar", 1:"salvar"};//variaveis para menu e a intro;
	var texto1,texto2; //texto para o proximaFasa
    var menuAD,menuCompAD,pesMenuAD,menuComprarVenderAD,confMenuAD, menuMelAD; //serve para disser se o menu esta ativo ou não;
    var melhorarMenu = [],comprarMenu = [],sceneMaquinasMenu = [],sceneBateriasMenu = [],txtQuantidadeMaquinas = [],scenePesquisasMenu = [],pesquisarMenu = [];
    var txtPesqValor;
    var identificador;//Variavel que identifica qual texto ira 
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
							}, this)
						}, this)
					}
					}, this) 
				}, this) 
		}
	
		
		
		update(){
			
		}
		
	}
	
    class menu extends Phaser.Scene{
		constructor (){
			super({ key: 'menu' });
		}
	
		preload(){
            let fundo = this.add.image(0,0,"fundo").setOrigin(0,0);
            var progress = this.add.graphics();
            let load = this.add.image(420,268,"load").setOrigin(0,0);
            let txtLoad = this.add.text(477,200,"Carregando Menu",{fill:"#fff"});
            this.load.on('progress', function (value) {
                let txt = txtLoad.text.split("...");
                txtLoad.setText(txt[0]+".");
                progress.clear();
                progress.fillStyle(0xffffff, 1);
                progress.fillRect(422, 270, 300*value, 40);
        
            });
            this.load.on('complete', function () {
                txtLoad.destroy();
                progress.destroy();
                load.destroy();
                fundo.destroy();
            });
            this.load.image('menu','../../css/imagensJogo/menu.png');
            this.load.image('menuConfi','../../css/imagensJogo/menuConfi.png');
            this.load.image('menuComp','../../css/imagensJogo/menuComp.png');
            this.load.image('setaMenu','../../css/imagensJogo/setaMenu.png');
            this.load.image('menuConfi','../../css/imagensJogo/menuConfi.png');
            this.load.image('setaMenuComprar','../../css/imagensJogo/setaMenuCompra.png');
            this.load.image('menuComprar','../../css/imagensJogo/menuCompra.png');
            this.load.image('menuMelhorias','../../css/imagensJogo/menuMelhorias.png');
            this.load.image('melhorarMenu','../../css/imagensJogo/melhorarMenu.png');
            this.load.image('comprarMenu','../../css/imagensJogo/comprarMenu.png');         
            this.load.image('menuPesquisas','../../css/imagensJogo/menuPesquisas.png');         
            this.load.image('pesquisarMenu','../../css/imagensJogo/pesquisarMenu.png');
            this.load.spritesheet('resetarJ','../../css/imagensJogo/resetarJ.png', {frameWidth:107, frameHeight:109});
            this.load.spritesheet('resetarF','../../css/imagensJogo/resetarF.png', {frameWidth:116, frameHeight:96});
            this.load.spritesheet('comprarMaquina','../../css/imagensJogo/comprarMaquinas.png',{ frameWidth: 61, frameHeight:  77});
            this.load.spritesheet('venderMaquina','../../css/imagensJogo/venderMaquinas.png',{ frameWidth: 100, frameHeight:  159});
			this.load.spritesheet('compra','../../css/imagensJogo/compra.png', { frameWidth: 46, frameHeight: 46 });
			this.load.spritesheet('config','../../css/imagensJogo/configuracao.png', { frameWidth: 82, frameHeight: 74 });
			this.load.spritesheet('pesquisa','../../css/imagensJogo/pesquisa.png', { frameWidth: 49, frameHeight: 77 });
			this.load.spritesheet('melhoria','../../css/imagensJogo/melhoria.png', { frameWidth: 70, frameHeight: 70 });
			this.load.spritesheet('pausar','../../css/imagensJogo/pausar.png',{frameWidth:73, frameHeight:106});
			this.load.spritesheet('salvar','../../css/imagensJogo/salvar.png',{frameWidth:124, frameHeight:103});
		
		}
		
		create(){
            setaMenuComprar = this.add.image(0,290,"setaMenuComprar").setDisplayOrigin(0,19);
            setaComp = this.add.image( 0, 290, 'setaMenu').setDisplayOrigin(0,19);
            setaPes = this.add.image( 0, 290, 'setaMenu').setDisplayOrigin(0,19);
            setaConf = this.add.image( 0, 290, 'setaMenu').setDisplayOrigin(0,19); 
            setaMel = this.add.image( 0, 290, 'setaMenu').setDisplayOrigin(0,19);
            seta = this.add.image( 0, 290, 'setaMenu').setDisplayOrigin(0,19);
            setaComp.setInteractive();
            setaPes.setInteractive();
            setaConf.setInteractive();
			men = this.add.image( -136, 0, 'menu').setInteractive();
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

            pausar = this.add.sprite(-68.5, 367,"pausar");
            salvar = this.add.sprite(-68.5, 495,"salvar");
            menuMel = this.add.image(-136,0,"menuMelhorias").setOrigin(0,0);      
            menuPesq = this.add.image(-136,0,"menuPesquisas").setOrigin(0,0);
      
            
            let py = 50 , px = -68,py2 = 100;
            for(let i = 0;i <pesquisas.length; i++){
                pesquisarMenu[i] = this.add.image(-132,py,"pesquisarMenu").setOrigin(0,0);
                py += 134;
                scenePesquisasMenu[i] = this.add.sprite(px,py2,"maquina"+((pesquisas[i].id)+2));
                scenePesquisasMenu[i].setScale(scaleMaquinas[(pesquisas[i].id)+2]);
                scenePesquisasMenu[i].setInteractive();
                py2 += 134;
            }
            let my = 50;
            for(let i = 1;i <maquinas.length; i++){
                melhorarMenu[i-1] = this.add.image(-132,my,"melhorarMenu").setOrigin(0,0);
                my += 134;
            }
            let y = 50,x = -68,y2 = 95;
            for(let i = 1;i <maquinas.length; i++){
                comprarMenu[i-1] = this.add.image(-132,y,"comprarMenu").setOrigin(0,0);
                y += 134;
                txtQuantidadeMaquinas[i-1] = this.add.text(x,y2+45,"Quantidade: "+maquinas[i].quantidade,{fontSize:"13px"});
                txtQuantidadeMaquinas[i-1].setDisplayOrigin(txtQuantidadeMaquinas[i-1].width/2,txtQuantidadeMaquinas[i-1].height/2);
                upgrade[i-1] = false;
                sceneMaquinasMenu[i-1] = this.add.sprite(x,y2,"maquina"+maquinas[i].id);
                sceneMaquinasMenu[i-1].setScale(scaleMaquinas[(maquinas[i].id)-1]);
                sceneMaquinasMenu[i-1].setInteractive();
                y2 += 134;
            }
            for(let i = 0;i<baterias.length;i++){
                let i2 = comprarMenu.length;
                comprarMenu[i+i2] = this.add.image(-132,y,"comprarMenu").setOrigin(0,0);
                y += 134;
                sceneBateriasMenu[i] = this.add.sprite(x,y2,"bateria"+baterias[i].id);
                sceneBateriasMenu[i].setScale(scaleBaterias[(baterias[i].id)-1]);
                sceneBateriasMenu[i].setInteractive();
                y2 += 134;
            }
            var txtValor = this.add.text(0,0,"",{fill:"#000",backgroundColor:"#fff"});
            txtPesqValor = this.add.text(0,0,"",{fill:"#000",backgroundColor:"#fff"});
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
			
			for (let i = 0; i < 2; i++) {
				let i3 = 1;
				if(i==0){
					i3 = 3;
                }
				this.anims.create({
					key: animsI3[i],
					frames: this.anims.generateFrameNumbers(animsI3[i], { start: 0, end: i3 }),
					frameRate: 10,
					repeat : -1
				});
            }
			
            setaMenuComprar.setInteractive();
            setaMel.setInteractive();
            menuComp.setInteractive();
            menuComprar.setInteractive();
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
			setaMel.setInteractive();
            pausar.setInteractive();
            salvar.setInteractive()
            menuMel.setInteractive();
            menuPesq.setInteractive();
			
			this.input.on("gameobjectdown", function(pointer,gameObject){
				//console.log(gameObject);
				switch (gameObject) {
					case conf:
					case setaConf:
						this.menu();
						this.menuConf();
					break;
					case pausar:
						if(pause){
							pause = false;
						}else{
							pause = true;
						}
					break;
					case resetaF:
						
					break;
					case resetaJ:
						this.resetarJogo();
					break;
                    case salvar:
                        salvarJogo();
					break;
                    case comp:
                    case setaComp:
                        this.menu();
                        this.menuComp();
					break;
                    case pesq:
                    case setaPes:
                        identificador = "pesquisasScene"
                    	this.menu();
                        this.menuPesq();
					break;
					case melho:
                    case setaMel:
                        identificador = "melhoriasScene"
						this.menu();
						this.menuMelho();
					break;
					case seta:
                        this.menu();
                    break;
                    case vender:
                        this.menuComp();
                        this.menuComprarVender();
                        identificador = "maquinasScene";
                        venderComprar = "vender";
                    break;
                    case comprar:
                        this.menuComp();
                        this.menuComprarVender();
                        identificador = "maquinasScene";
                        venderComprar = "comprar";
                    break;
                    case setaMenuComprar:
                        this.menuComp();
                        this.menuComprarVender();
                    break;
				}
            }, this);
            
            this.input.on("gameobjectdown",function(pointer,gameObject){
                var fase = new fases;
                if(identificador=="maquinasScene"){
                    for(let i = 0;i < sceneMaquinasMenu.length;i++){
                        if(sceneMaquinasMenu[i]==gameObject){
                            if(venderComprar=="comprar"){
                                fase.comprarMaquina(i+1);
                            }else if(venderComprar=="vender"){
                                
                                fase.venderMaquina(i+1);
                            }
                        }
                    }
                }else if(identificador=="pesquisasScene"){
                    for(let i = 0;i<pesquisas.length;i++){
                        if(scenePesquisasMenu[i]==gameObject){
                            fase.pesquisar(i);
                        }
                    }
                }else if(identificador=="melhoriasScene"){
                    for(let i = 0;i < sceneMaquinasMenu.length;i++){
                        if(sceneMaquinasMenu[i]==gameObject){
                            let valor = maquinas[i+1].valorOriginal*maquinas[i+1].pps*25;
                            let validador = cliente.dinheiro-valor;
                            if(validador>=0 && maquinas[i+1].quantidade!=0){
                                cliente.dinheiro += -valor;
                                maquinas[i+1].multiplicador++;
                                maquinas[i+1].pps += maquinas[i+1].pps;
                            }
                        }
                    }
                }
            },this);
            this.input.on("gameobjectover",function(pointer,gameObject){
                if(identificador=="maquinasScene"){
                    for(let i = 1;i < maquinas.length;i++){
                        if(sceneMaquinasMenu[i-1]==gameObject){
                            txtValor.setPosition(pointer.position.x,pointer.position.y);
                            let valor = maquinas[i].valor;
                            if(venderComprar == "vender"){
                                if(maquinas[i].quantidade != 0){
                                    valor = (valor*100)/105;
                                    valor  = parseInt(valor - (valor*0.25));
                                }else{
                                    valor = "Não é posivel vender";
                                }
                            }else{
                                valor  = parseInt(valor);
                            }
                            txtValor.setText("Valor: "+valor);
                        }
                    }
                }else if(identificador=="pesquisasScene"){
                    for(let i = 0;i<pesquisas.length;i++){
                        if(scenePesquisasMenu[i]==gameObject){
                            let validador = pesquisaValidador(i);
                            txtPesqValor.setPosition(pointer.position.x,pointer.position.y);
                            if(validador){

                                if(pesquisas[i].estado=="n iniciada"){

                                    txtPesqValor.setText("Valor: "+pesquisas[i].valor);
                                }else if(pesquisas[i].estado=="finalizada"){

                                    txtPesqValor.setText("Só é possivel pesquisar uma vez!");
                                }else if(pesquisas[i].estado=="iniciada"){
                                    var tempo = pesquisas[i].tempo;
                                    intervaloPesqui = false;
                                    let intervalo = game.scene.scenes[4].time.addEvent({ delay: 1, callback: function(){
                                        txtPesqValor.setText("Tempo: "+tempo.hora+":"+tempo.min+":"+tempo.seg);
                                        if(intervaloPesqui){
                                            intervalo.remove(false);
                                        }
                                    }, callbackScope: this, loop: true });;
                                }
                            }else{
                                txtPesqValor.setText("Ainda não é possivel pesquisar!");
                            }
                        }
                    }
                }else if(identificador=="melhoriasScene"){
                    for (let i = 0; i < sceneMaquinasMenu.length; i++) {
                        if(sceneMaquinasMenu[i]==gameObject){
                            txtValor.setPosition(pointer.position.x,pointer.position.y);
                            let valor = maquinas[i+1].valor*maquinas[i+1].pps*25;
                            txtValor.setText("Valor: "+valor);
                        }
                        
                    }
                }
            },this);
            this.input.on('pointerout', function () {
                txtValor.setText("");
                txtPesqValor.setText("");
                intervaloPesqui = true;
            });
			conf.anims.play('config', true);
			 
			comp.anims.play('compra', true);
			 
			pesq.anims.play('pesquisa', true);
			 
            melho.anims.play('melhoria', true);

            vender.anims.play("venderMaquina",true);

            comprar.anims.play("comprarMaquina",true);
            
            resetaF.anims.play("resetarF",true);
            
            resetaJ.anims.play("resetarJ",true);
            
            pausar.anims.play("pausar",true);
            
            salvar.anims.play("salvar",true);

            /* var fase  = new fases;
            fase.comprarMaquina(10); */
            this.melhorias();
		}
		
		update(){
		
        }
        
        menu(){
            if(menuAD)
                menuAD = false; //quando o menu tá desativado
            else // Quando o valor vem true signigica que o menu está ativado, e quando vir false o menu esta dessativado;
                menuAD = true; //quando o menu tá ativado
                var intervalo = game.scene.scenes[4].time.addEvent({ delay: 1, callback: function(){
                    if(menuAD){
                        if(men.x<0){
                            men.x+=4;
                            seta.x+=4;
                            conf.x+=4;
                            melho.x+=4;
                            pesq.x+=4;
                            comp.x+=4;
                        }else{
                            intervalo.remove(false);
                        }
                    }else{
                        if(men.x>-136){
                            men.x-=4;
                            seta.x-=4;
                            conf.x-=4;
                            melho.x-=4;
                            pesq.x-=4;
                            comp.x-=4;
                        }else{
                            intervalo.remove(false)
                        }
                    }
                }, callbackScope: this, loop: true });;
        }

        menuComp(){
            if(menuCompAD){
                menuCompAD = false;//quando o menu tá desativo
            }else{ // Quando o valor vem true signigica que o menu está ativado, e quando vir false o menu esta dessativado;
                menuCompAD = true;//quando o menu tá ativado
            }
            
            var intervalo = game.scene.scenes[4].time.addEvent({ delay: 1, callback: function(){
                if(menuCompAD){
                    if(menuComp.x<0){
                        menuComp.x+=4;
                        setaComp.x+=4;
                        comprar.x+=4;
                        vender.x+=4;
                    }else{
                        intervalo.remove(false);
                    }
                }else{
                    if(menuComp.x>-136){
                        menuComp.x-=4;
                        setaComp.x-=4;
                        comprar.x-=4;
                        vender.x-=4;
                    }else{
                        intervalo.remove(false);
                    }
                }
            }, callbackScope: this, loop: true });;
        }

        menuMelho(){
        	if(menuMelAD){
        		menuMelAD = false;//quando o menu tá desativo
            }else{ // Quando o valor vem true signigica que o menu está ativado, e quando vir false o menu esta dessativado;
            	menuMelAD = true;//quando o menu tá ativado
            }

            //configurar possições das melhorias ao abrir o menu;
            var intervalo = game.scene.scenes[4].time.addEvent({ delay: 1, callback: function(){
                if(menuMelAD){
                    if(menuMel.x<0){
                        menuMel.x+=4;
                        setaMel.x+=4;
                        for(let i = 1;i <maquinas.length; i++){
                            melhorarMenu[i-1].x+=4;
                            sceneMaquinasMenu[i-1].x+=4;
                        }
                    }else{
                        intervalo.remove(false);
                    }
                }else{
                    if(menuMel.x>-136){
                        menuMel.x-=4;
                        setaMel.x-=4;
                        for(let i = 1;i <maquinas.length; i++){
                            melhorarMenu[i-1].x-=4;
                            sceneMaquinasMenu[i-1].x-=4;
                        }
                    }else{
                        intervalo.remove(false);
                    }
                }
            }, callbackScope: this, loop: true });;
        }
        
        menuComprarVender(){
            if(menuComprarVenderAD){
                menuComprarVenderAD = false;//quando o menu tá desativo
            }else{ // Quando o valor vem true signigica que o menu está ativado, e quando vir false o menu esta dessativado;
                menuComprarVenderAD = true;//quando o menu tá ativado
            }
            var intervalo = game.scene.scenes[4].time.addEvent({ delay: 1, callback: function(){
                if(menuComprarVenderAD){
                    if(menuComprar.x<0){
                        menuComprar.x+=4;
                        setaMenuComprar.x+=4;
                        for (let i = 1; i < numeroMaquinas; i++) {
                            comprarMenu[i-1].x+=4;
                            sceneMaquinasMenu[i-1].x+=4;
                            txtQuantidadeMaquinas[i-1].x+=4;
                        }
                    }else{
                        intervalo.remove(false);
                    }
                }else{
                    if(menuComprar.x>-136){
                        menuComprar.x-=4;
                        setaMenuComprar.x-=4;
                        for (let i = 1; i < numeroMaquinas; i++) {
                            comprarMenu[i-1].x-=4;
                            sceneMaquinasMenu[i-1].x-=4;
                            txtQuantidadeMaquinas[i-1].x-=4;
                        }
                    }else{
                        intervalo.remove(false);
                    }
                }
            }, callbackScope: this, loop: true });;
        }
        
        menuPesq(){
        	if(pesMenuAD){
             	pesMenuAD = false;
            }else{
             	pesMenuAD = true;
            }  

            var intervalo = game.scene.scenes[4].time.addEvent({ delay: 1, callback: function(){
                if(pesMenuAD){
                    if(menuPesq.x<0){
                        menuPesq.x+=4;
                        setaPes.x+=4;
                        for (let i = 0; i < pesquisas.length; i++) {
                            pesquisarMenu[i].x+=4;
                            scenePesquisasMenu[i].x+=4;
                        }
                    }else{
                        intervalo.remove(false);
                    }
                }else{
                    if(menuPesq.x>-136){
                        menuPesq.x-=4;
                        setaPes.x-=4;
                        for (let i = 0; i < pesquisas.length; i++) {
                            pesquisarMenu[i].x-=4;
                            scenePesquisasMenu[i].x-=4;
                        }
                    }else{
                        intervalo.remove(false);
                    }
                }
            }, callbackScope: this, loop: true });
        }
        
        menuConf(){
       	 if(confMenuAD){
       		confMenuAD = false;
            }else{
            	confMenuAD = true;
            }
            var intervalo = game.scene.scenes[4].time.addEvent({ delay: 1, callback: function(){
                if(confMenuAD){
                    if(confMenu.x<0){
                    confMenu.x+=4;
                    setaConf.x+=4;
                    resetaF.x+=4;
                    resetaJ.x+=4;
                    salvar.x+=4;
                    pausar.x+=4;
                    }else{
                        intervalo.remove(false);
                    }
                }else{
                    if(confMenu.x>-136){
                        confMenu.x-=4;
                        setaConf.x-=4;
                        resetaF.x-=4;
                        resetaJ.x-=4;
                        salvar.x-=4;
                        pausar.x-=4;
                    }else{
                        intervalo.remove(false);
                    }
                }
            }, callbackScope: this, loop: true });
        }
        
        melhorias(){
            let intervalo = game.scene.scenes[4].time.addEvent({ delay: 10000, callback:function(){
                for (let i = 1; i < maquinas.length; i++) {
                    if(!(upgrade[i-1])){
                        let pps = maquinas[i].pps;
                        let valiador = maquinas[i].valor*pps*25;
                        if(cliente.dinheiroGeral>=valiador && maquinas[i].quantidade!=0){
                            upgrade[i-1] = true;
                        }
                    }
                }  
            }, callbackScope: this, loop: true });;
        }
        
        resetarJogo(){
            $.ajax({
                type:"POST",
                data: cliente,
                url: caminho+"ResetarJogo",
                success: function(dados){
                    window.location.href = "?jogo";
                },
                error:function(){

                }
            },this);
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
            let fundo = this.add.image(0,0,"fundo").setOrigin(0,0);
            var texto = 1;
            var imagen;
            this.geraTextos();
            var txt = this.add.text(572 , 290,texto1, {fill:"#fff"});
            txt.setDisplayOrigin(txt.width/2,txt.height/2);
            var txtContinuar = this.add.text(100,500,"Clique para continuar",{fill:"#fff"});
            txtContinuar.setDisplayOrigin(0,txtContinuar.height);
            this.input.on('pointerdown', function () {
                if(texto ==  1){
                    txt.destroy();
                    imagen = this.add.image(572,290,"imgCena");
                    texto = 2;
                }else if(texto==2){
                    imagen.destroy();
                    txt = this.add.text(572,290,texto2, {fill:"#fff"});
                    txt.setDisplayOrigin(txt.width/2,txt.height/2);
                    texto=3
                }else if(texto==3){
                    txtContinuar.destroy();
                    txt.destroy();
                    salvarJogo();
                    mudaFase();
                }
            },this);
        }
        update(){
        }
    }

    //-------------------------variaveis da fases -----------------------------------------------------------------
    var armazenamento = 0;
    var frameWH = [{frameWidth: 46,/* 0 */frameHeight: 58},{frameWidth: 46,/* 1 */frameHeight: 58},{frameWidth: 739,/* 2 */frameHeight: 1148 },{frameWidth: 1394,/* 3 */frameHeight: 952 },{frameWidth: 228,/* 4 */frameHeight: 414 },{frameWidth: 6, frameHeight: 6 },{frameWidth: 740, frameHeight: 1148 }];
    console.log(frameWH);
    var frameBateria = [{frameWidth: 46,/* 1 */frameHeight: 58},{frameWidth: 1289, frameHeight: 655},{frameWidth: 690, frameHeight: 370}];
    var txtDin,txtEner,txtArm;
    var sceneMaquinas = [], sceneBaterias = [];
    var x,y,scaleMaquinas = {0:2,1:2,2:0.07,3:0.07,4:0.08},scaleBaterias = {0:0.1,1:0.5};// cordenadas das maquinas e escala;
    var numeroFrame = {1:4,2:4,3:9,4:4};
    var casoEspecial = {0:-1,1:0};
    var setaMenu, menuMaquinas, menuMaquinaAD;
    
    //---------------------------------fases-----------------------------------------------------------------------
    class fases extends Phaser.Scene{
        constructor(){
            super({key:"fases"});
        }

        preload(){
            var progress = this.add.graphics();
            let load = this.add.image(420,268,"load").setOrigin(0,0);
            let txtLoad = this.add.text(477,200,"Carregando Fase",{fill:"#fff"});
            this.load.on('progress', function (value) {
                let txt = txtLoad.text.split("...");
                txtLoad.setText(txt[0]+".");
                progress.clear();
                progress.fillStyle(0xffffff, 1);
                progress.fillRect(422, 270, 300*value, 40);
        
            });
            
            this.load.on('complete', function () {
                txtLoad.destroy();
                progress.destroy();
                load.destroy();
            });
        	this.load.image("recurso", "../../css/imagensJogo/recursos.png");
        	this.load.image("dinheiro", "../../css/imagensJogo/dinheiro.png");
        	this.load.image("energia", "../../css/imagensJogo/energia.png");
        	this.load.image("armazenamento", "../../css/imagensJogo/armazenamento.png");
        	this.load.image("fundoMaquina", "../../css/imagensJogo/fundoMaquina.png");
            this.load.image("fabrica1","../../css/imagensJogo/fabrica"+cliente.fase+".png");
			this.load.image("menuMaquinas","../../css/imagensJogo/menuMaquinas.png");
			this.load.image("setaMenuMaquinas","../../css/imagensJogo/setaMenuMaquinas.png");
			this.load.image("venderEnergia","../../css/imagensJogo/venderEnergia.png");
            //console.log(frameBateria);
            // Para carregar as baterias
            for (let i = 0; i < baterias.length; i++) {
                this.load.spritesheet("bateria"+baterias[i].id,"../../css/imagensJogo/bateria"+baterias[i].id+".png",frameBateria[baterias[i].id-1]);
            }
            //var fase 2 maquinas inicio;
            for (let i = 0; i < pesquisas.length; i++) {
                this.load.spritesheet("maquina"+((pesquisas[i].id)+2),"../../css/imagensJogo/maquina"+((pesquisas[i].id)+2)+".png",frameWH[((((pesquisas[i].id)+2))-1)]);
            }
            for (let i = 0; i < maquinas.length; i++) {
                console.log(frameWH[((maquinas[i].id)-1)]);
                this.load.spritesheet("maquina"+maquinas[i].id,"../../css/imagensJogo/maquina"+maquinas[i].id+".png",frameWH[((maquinas[i].id)-1)]);
            }
        }
        create(){
            console.log("ola");
			this.scene.launch("menu");
			this.add.image(0,0,"fabrica1").setOrigin(0,0);
			menuMaquinas = this.add.image(1144,0,"menuMaquinas").setOrigin(0,0);//298
            setaMenu = this.add.image(1124,290,"setaMenuMaquinas").setDisplayOrigin(0,19);
            setaMenu.setInteractive();
            this.pesquisas();
			this.add.image(505,120, "fundoMaquina").setOrigin(0,0);
            this.maquinaEspecial = this.add.sprite(522,200,"maquina1").setOrigin(0,0);
            x = 1214;
            y = 141;
            for (let i = 1; i < maquinas.length; i++) {
                sceneMaquinas[i-1] = this.add.sprite(x,y,"maquina"+maquinas[i].id);
                x += 146;
                if(x==1430){
                    x = 1284;
                    y += 165;
                }
                console.log("i: " + (i-1) + "\n scala: "+scaleMaquinas[(maquinas[i].id)-1] )
                sceneMaquinas[i-1].setScale(scaleMaquinas[(maquinas[i].id)-1]);
                sceneMaquinas[i-1].setInteractive();
            }
            for (let i = 0; i < baterias.length; i++) {
                sceneBaterias[i] = this.add.sprite(x,y,"bateria"+baterias[i].id);
                x += 146;
                if(x==1430){
                    x = 1284;
                    y += 165;
                }
                sceneBaterias[i].setScale(scaleBaterias[i]);
                sceneBaterias[i].setInteractive();
            }
            this.armazenamentoBaterias();
            this.maquinaEspecial.setScale(2);
            this.maquinaEspecial.setInteractive();
            var recursos = this.add.image(572,0,"recurso");
            
            recursos.setDisplayOrigin(recursos.width/2,0);
            
            this.add.image(120,7,"dinheiro").setOrigin(0,0);
            
            this.add.image(300,7,"energia").setOrigin(0,0);
            
            this.add.image(700,7,"armazenamento").setOrigin(0,0);
            
            txtDin = this.add.text(120,5,cliente.dinheiro,{fontSize:"32px",fontFamily:"Arial",fill:"#000"});
            txtEner = this.add.text(300,5,cliente.energia,{fontSize:"32px",fontFamily:"Arial",fill:"#000"});
            txtArm = this.add.text(700,5,armazenamento,{fontSize:"32px",fontFamily:"Arial",fill:"#000"});
            
            
            var txtDesc = this.add.text(0,0,"",{fill:"#000",backgroundColor:"#fff"}).setPadding(5);
            for (let i = 0; i < maquinas.length; i++) {
                let  i2 = 0;
                if(i==0){
                    i2 = 1;
                }
                console.log(maquinas[i].id);
                this.anims.create({
                    key: ("maquinaAnimi"+maquinas[i].id+""),
                    frames: this.anims.generateFrameNumbers(("maquina"+maquinas[i].id+""), { start: 0, end: numeroFrame[maquinas[i].id] }),
                    frameRate: 10 ,
                    repeat: casoEspecial[i2]
                });
                console.log(sceneMaquinas[i-1]);
                if(i!=0){
                    sceneMaquinas[i-1].anims.play("maquinaAnimi"+maquinas[i].id);
                }
            }     
            this.input.on("gameobjectdown",function(pointer,gameObject){
                switch(gameObject){
                    case this.maquinaEspecial:
                        if(pause == false){
                        	cliente.energia+=10000;
                        	this.maquinaEspecial.anims.play("maquinaAnimi1",true);
                        }
                    break;
                    case setaMenu:
                        if (menuMaquinaAD)
                            menuMaquinaAD = false; 
                        else 
                            menuMaquinaAD = true;
                            
                            var intervalo = game.scene.scenes[0].time.addEvent({ delay: 1, callback: function(){
                                if(menuMaquinaAD){
                                    if(menuMaquinas.x>846){
                                        menuMaquinas.x-=2;
                                        setaMenu.x-=2;
                                        for (let i = 1; i < numeroMaquinas; i++) {
                                            sceneMaquinas[i-1].x-=2;
                                        }
                                        for(let i = 0;i< baterias.length;i++){
                                            sceneBaterias[i].x-=2
                                        }
                                    }else{
                                        intervalo.remove(false);
                                    }
                                }else{
                                    if(menuMaquinas.x<1144){
                                        menuMaquinas.x+=2;
                                        setaMenu.x+=2;
                                        for (let i = 1; i < numeroMaquinas; i++) {
                                            sceneMaquinas[i-1].x+=2;
                                        }
                                        for(let i = 0;i< baterias.length;i++){
                                            sceneBaterias[i].x+=2
                                        }
                                    }else{
                                        intervalo.remove(false);
                                    }
                                }
                            }, callbackScope: this, loop: true });
                    break;
                    case teste:
                    this.converter();
                    break;
                }
            },this);
            this.input.on("pointerover",function(pointer,gameObject){
                for(let i = 1;i < maquinas.length;i++){
                    if(sceneMaquinas[i-1]==gameObject[0]){
                        txtDesc.setPosition(pointer.position.x,pointer.position.y);
                        if(i%2==1){
                            txtDesc.setDisplayOrigin(0,0);
                        }else{
                            txtDesc.setDisplayOrigin(txtDesc.width,0);
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
            let teste = this.add.image(570,430,"venderEnergia").setInteractive();

            this.maquinasAutomaticas();


            let tempo = [];
            let temp = new Object;
            tempo = this.tempo(cliente.tempo);
            temp.dia = tempo.data[2];
            temp.mes = tempo.data[1];
            temp.ano = tempo.data[0];
            temp.seg = tempo.tempo[2];
            temp.min = tempo.tempo[1];
            temp.hora = tempo.tempo[0];
            cliente.tempo = temp;
            
            

            this.tempoJogo();

        }
// -------------------------------------------------- update --------------------------------------------------------
        update(){
            if(cliente.energia>armazenamento){
                cliente.energia = armazenamento;
            }
            txtDin.setText(cliente.dinheiro);
            txtEner.setText(cliente.energia);
            txtArm.setText(armazenamento);
            
        }

        tempoJogo(){
            let tempo = [];
            if(cliente.tempo.dia==undefined){
                let temp = new Object;
                tempo = this.tempo(cliente.tempo);
                temp.dia = parseInt(tempo.data[2]);
                temp.mes = parseInt(tempo.data[1]);
                temp.ano = parseInt(tempo.data[0]);
                temp.seg = parseInt(tempo.tempo[2]);
                temp.min = parseInt(tempo.tempo[1]);
                temp.hora = parseInt(tempo.tempo[0]);
                cliente.tempo = temp;
            }
            tempo = cliente.tempo;
            let intervalo = game.scene.scenes[3].time.addEvent({ delay: 1000, callback: function(){
                tempo.seg++;
                if(tempo.seg==60){
                    tempo.seg = 0;
                    tempo.min++;
                }
                if(tempo.min==60){
                    tempo.min = 0;
                    tempo.hora++;
                }
                if(tempo.hora==24){
                    tempo.hora = 0;
                    tempo.dia++;
                }
                if(tempo.mes == 12){
                    tempo.dia = 0;
                    tempo.mes++;
                }
                cliente.tempo = tempo;
                
            }, callbackScope: this, loop: true });;

        }

        armazenamentoBaterias(){
            for(let i = 0;i<baterias.length;i++){
                if(baterias[i].quantidade!=undefined){
                    armazenamento += (baterias[i].quantidade)*(baterias[i].armazenamento);
                }
            }
        }

        maquinasAutomaticas(){
            var intervalo = game.scene.scenes[3].time.addEvent({ delay: 1000, callback: function(){
                if(pause == false){
                    var ppsTotal = 0;
                    for (let i = 1; i < maquinas.length; i++) {
                        if(maquinas[i].quantidade!=undefined){
                            ppsTotal += (maquinas[i].pps)*(maquinas[i].quantidade);
                        }
                    }
                    cliente.energia += ppsTotal;
                }
            }, callbackScope: this, loop: true });;
        }

        converter(){
            let energia = cliente.energia;
            for(let i = 0;i<energia;i++){
                let validador = 0;
                validador = cliente.energia-2;
                if(validador>=0){
                    cliente.energia-=2;
                    cliente.dinheiro+=10000;
                    cliente.dinheiroGeral+=10000;
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
                maquinas[id].valor = valor+(valor*0.05);
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
                valor = (valor*100)/105;
                maquinas[id].valor = valor;
                valor = valor - (valor*0.25);
                txtQuantidadeMaquinas[id-1].setText("Quantidade: "+maquinas[id].quantidade);
                cliente.dinheiro += parseInt(valor);
            }
        }
        
        tempo(tempo){
            console.log(tempo);
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
                let temp = [];
                temp.data = data;
                temp.tempo = tempo;
                return temp;
            }
            return tempo;
        }

        pesquisas(id){
            var tempo = new Object;
            if(id==undefined){
                var intervalo = []
                for(let i = 0;i<pesquisas.length;i++){
                    var tempo2 = this.tempo(pesquisas[i].tempo);
                    tempo.hora = parseInt(tempo2[0]);
                    tempo.min  = parseInt(tempo2[1]);
                    tempo.seg  = parseInt(tempo2[2]);
                    if(pesquisas[i].estado=="iniciada"){
                        intervalo[i] = game.scene.scenes[3].time.addEvent({ delay: 1000, callback: function(){
                            tempo.seg--;
                            if(tempo.seg==-1){
                                tempo.seg = 59;
                                tempo.min--;
                            }
                            if(tempo.min==-1){
                                tempo.min = 59;
                                tempo.hora--;
                            }
                            if(tempo.hora == 0 && tempo.min == 0 && tempo.seg ==0){
                                pesquisas[i].estado = "finalizada";
                            }
                            pesquisas[i].tempo = tempo;
                            if(pesquisas[i].estado=="finalizada"){
                                intervalo[i].remove(false);
                                if(pesquisas[i].mudaFase!=0){
                                    cliente.fase++;
                                    game.scene.pause("fases");
                                    game.scene.pause("menu");
                                    game.scene.bringToTop("proximaCena");
                                    game.scene.start("proximaCena");
                                }
                            }
                        }, callbackScope: this, loop: true });;
                    }
                }
            }else{
                var tempo2 = this.tempo(pesquisas[id].tempo);
                tempo.hora = parseInt(tempo2[0]);
                tempo.min  = parseInt(tempo2[1]);
                tempo.seg  = parseInt(tempo2[2]);
                if(pesquisas[id].estado=="iniciada"){
                    let intervalo = game.scene.scenes[3].time.addEvent({ delay: 100, callback: function(){
                        tempo.seg--;
                        if(tempo.seg==-1){
                            tempo.seg = 59;
                            tempo.min--;
                        }
                        if(tempo.min==-1){
                            tempo.min = 59;
                            tempo.hora--;
                        }
                        if(tempo.hora == 0 && tempo.min == 0 && tempo.seg ==0){
                            pesquisas[id].estado = "finalizada";
                        }
                        pesquisas[id].tempo = tempo;
                        if(pesquisas[id].estado=="finalizada"){
                            intervalo.remove(false);
                            if(pesquisas[id].mudaFase!=0){
                                cliente.fase++;
                                game.scene.pause("fases");
                                game.scene.pause("menu");
                                game.scene.bringToTop("proximaCena");
                                game.scene.start("proximaCena");
                            }
                        }
                    }, callbackScope: this, loop: true });
                }
            }
        }

        pesquisar(id){
            if(pesquisas[id].estado=="n iniciada"){

                let validador = cliente.dinheiro-pesquisas[id].valor;
                if(validador>=0){
                    cliente.dinheiro -= pesquisas[id].valor;
                    pesquisas[id].estado="iniciada";
                    this.pesquisas(id);
                }
            }
        }
    }

    pesquisaValidador = function(id){
        let validador = pesquisas[id].valor*2.5;
        if(validador<=cliente.dinheiroGeral){
            return true;
        }
        return false;
    }
    
    salvarJogo = function(){
        let string = "";
        for (let i = 1; i < maquinas.length; i++) {
            if(string==""){
                string += "id"+i+"="+maquinas[i].id+"&multiplicador"+i+"="+maquinas[i].multiplicador+"&quantidade"+i+"="+maquinas[i].quantidade;
            }else{
                string += "&id"+i+"="+maquinas[i].id+"&multiplicador"+i+"="+maquinas[i].multiplicador+"&quantidade"+i+"="+maquinas[i].quantidade;
            }
        }
        $.ajax({
            type:"POST",
            data:string+"&identificador=maquinas&fase="+cliente.fase+"&clienteId="+cliente.id,
            url:caminho+"SalvarJogo",
            success:function(dados){
            }
        });
        string = "";
        for (let i = 0; i < baterias.length; i++) {
            if(string==""){
                string += "id"+i+"="+baterias[i].id+"&quantidade"+i+"="+baterias[i].quantidade;
            }else{
                string += "&id"+i+"="+baterias[i].id+"&quantidade"+i+"="+baterias[i].quantidade;
            }
        }
        console.log(string);
        $.ajax({
            type:"POST",
            data:string+"&identificador=baterias&fase="+cliente.fase+"&clienteId="+cliente.id,
            url:caminho+"SalvarJogo",
            success:function(dados){
            }
        });
        string = "";
        for (let i = 0; i < pesquisas.length; i++) {
            if(string==""){
                let tempo = pesquisas[i].tempo;
                string += "id"+i+"="+pesquisas[i].id+"&estado"+i+"="+pesquisas[i].estado+"&tempo"+i+"="+tempo.hora+":"+tempo.min+":"+tempo.seg;
            }else{
                string += "&id"+i+"="+pesquisas[i].id+"&estado"+i+"="+pesquisas[i].estado+"&tempo"+i+"="+tempo.hora+":"+tempo.min+":"+tempo.seg;
            }
        }
        $.ajax({
            type:"POST",
            data:string+"&identificador=pesquisas&fase="+cliente.fase+"&clienteId="+cliente.id,
            url:caminho+"SalvarJogo",
            success:function(dados){
            }
        });
        // ((dinheiroGeral*fase)+franklin_geral)-tempo(segundos)/1000
        let tempo = (((((((((cliente.tempo.ano-2000)*12)+cliente.tempo.mes-1)*30+(cliente.tempo.dia-1))*24)+(cliente.tempo.hora))*60)+(cliente.tempo.min))*60)+cliente.tempo.seg;
        console.log(tempo);
        var maiorPontuacao = ((cliente.dinheiroGeral*cliente.fase)+cliente.franklinGeral)-(tempo/1000);
        console.log(maiorPontuacao);

        string  = "clienteId="+cliente.id+"&fase="+cliente.fase+"&dinheiro="+cliente.dinheiro+"&franklin="+cliente.franklin+"&dinheiroGeral="+cliente.dinheiroGeral+"&energia="+cliente.energia+"&franklinGeral="+cliente.franklinGeral+"&maiorPontuacao="+parseInt(maiorPontuacao)+"&tempo="+cliente.tempo.ano+"-"+cliente.tempo.mes+"-"+cliente.tempo.dia+" "+cliente.tempo.hora+":"+cliente.tempo.min+":"+cliente.tempo.seg;
        $.ajax({
            type:"POST",
            data:string+"&identificador=cliente",
            url:caminho+"SalvarJogo",
            success:function(dados){
                console.log(dados);
            }
        });
    }

    var t = [], continuar, plano;
    
    class tutorial extends Phaser.Scene{
        constructor(){
            super({key:"tutorial"});
        }
        
        preload(){
        	this.load.image("fundot", "../../css/imagensJogo/fundoTutorial.png");
        }
        
        create(){
        
        	plano = this.add.image(500, 100,"fundot");
        	
        	continuar = this.add.text(925, 550,"Clique para continuar");
        	continuar.setColor("000000");
        	
	        	for(let c = 1; c <= 6; c++){
	        		
	        		if(c == 1){
	        			t[c] = this.add.text(220,480,"Seja bem vindo ao seu primeiro dia como empresário!\n Ensinar-te-ei a habilidade de manipular e gerir empresas de eletricidade!");
	        			
	        		}else if(c == 2){
						t[c] = this.add.text(250,480,"O menu do jogo pode ser acessado ao clicar na seta à esquerda\n Já a seta à direita permite a visualização das máquinas que possuí!\n  Vamos! Clique nelas para ver a mágica!");
						t[c].setAlpha(0);
					}else if(c == 3){
						t[c] = this.add.text(25,480,"No menu é possível visualizar 4 itens, eles são:\n Configurações: Permite que você reinicie o jogo ou a fase, além de pausar ou salvar o jogo.\n  Compras: Permite que você compre ou venda máquinas e baterias.\n   Pesquisas: Permite que você pesquise novas máquinas e baterias para que consiga progredir no jogo e no ranking!\n    Melhorias: Permite que você realize melhorias nas máquinas ou baterias que possuí.");
						t[c].setAlpha(0);
					}else if(c == 4){
						t[c] = this.add.text(55,480,"O menu fixo que você enxerga no topo da tela é o menu de recursos.\n É possível encontrar nele, respectivamente, as quantidades de dinheiro, energia e armazenamento de energia.");
						t[c].setAlpha(0);
					}else if(c == 5){
						t[c] = this.add.text(180,480,"E a máquina centralizada na tela é a sua manivela geradora de energia.\n Você utilizará ela durante toda sua tragetória, para girá-la, basta clicar nela!");
						t[c].setAlpha(0);
					}else if(c == 6){
						t[c] = this.add.text(180,480,"Após essas dicas básicas, desejo-te boa sorte neste ramo perigoso, e até a próxima!");
						t[c].setAlpha(0);
						continuar.setInteractive(); 
				  }
					
	        	t[c].setColor("#000000");
	        	 
	        	}
	        	
	        
	        	             	
	        	
	        	continuar.on("pointerdown", function (ev){	
	        		t[1].destroy();
	        		t[2].setAlpha(1);
	        		continuar.setInteractive();
	        		
	        		continuar.on("pointerdown", function (ev){	
	        			t[2].destroy();
		        		t[3].setAlpha(1);
		        		continuar.setInteractive();
		        		
		        		continuar.on("pointerdown", function (ev){	
		        			t[3].destroy();
			        		t[4].setAlpha(1);
			        		continuar.setInteractive();
			        		
			        		continuar.on("pointerdown", function (ev){	
			        			t[4].destroy();
				        		t[5].setAlpha(1);
				        		continuar.setInteractive();
				        		
				        		continuar.on("pointerdown", function (ev){	
				        			t[5].destroy();
				        			t[6].setAlpha(1);
				        			continuar.setInteractive();
					        		
				        			continuar.on("pointerdown", function (ev){	
					        			t[6].destroy();
					        			continuar.destroy();
						        		
									}, this);
								}, this);
							}, this);
						}, this);
					}, this);
				}, this);
        	
        	
        }
        
        update(){
        	
        }
        
    }
    
    // ---------------- configuração do jogo ------------------------------------------------------------------
    var config = {
        type: Phaser.AUTO,
        width: 1144,//572 // 290
        height: 580,//ajeitar o css do jogo, de mim-height para height;
        parent :"jogo",
        scene: [inicio,intro,proximaCena,fases,menu,tutorial]
    }

    game = new Phaser.Game(config);
    
    mudaFase = function(){
        game.destroy();
        document.getElementById("jogo").innerHTML="";
        game = new Phaser.Game(config);
    }
}