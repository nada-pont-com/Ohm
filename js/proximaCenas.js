var cliente;
var caminho = "../../";
var game;
var maquinas = [];
var producao = 0;
var validaCarregamentoM = false;

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
        url: caminho+"Maquinas",
        success:function(dados){
            if(dados.msg==undefined){
                var maquinasL = dados[1];
                var maquinasDados = dados[0];
                for (let i = 0; i < dados[1].length; i++) {
                    if(maquinasL[i].id==maquinasDados[i].maquinas_id){
                        var maquinas2 = new Object;
                        maquinas2 = maquinasL[i];
                        maquinas2.clientes_id = maquinasDados[i].clientes_id;
                        maquinas2.multiplicador = maquinasDados[i].multiplicador;
                        maquinas2.quantidade = maquinasDados[i].quantidade;
                        maquinas[i] = maquinas2;
                    }
                }
                console.log(maquinas);
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
dadosJogo();
jogo = function(){
    var texto1,texto2;
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

    var config = {
        type: Phaser.AUTO,
        width: 1144,//572 // 290
        height: 580,//ajeitar o css do jogo, de mim-height para height;
        parent :"jogo",
        scene: [proximaCena,fases]
    }

    game = new Phaser.Game(config);

    var config = {
        type: Phaser.AUTO,
        width: 1144,//572 // 290
        height: 580,//ajeitar o css do jogo, de mim-height para height;
        parent :"jogo",
        scene: [proximaCena,fases]
    }

    game = new Phaser.Game(config);
}