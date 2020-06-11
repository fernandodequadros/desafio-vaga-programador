// Para usar funções definidas no arquivo "valida.js"
$.getScript("js/valida.js");

$(document).ready(function(){
    var ind = -1; // Índice do item selecionado na lista
    var dataValidade; 
    var dataFabricacao;
    var tbProdutos = localStorage.getItem("tbProdutos"); // Recupera os dados armazenados no LS(LocalStorage)
    tbProdutos = JSON.parse(tbProdutos); // Converte string para objeto

    // Se não houver dados armazenados...
    if(tbProdutos === null || tbProdutos.length === 0){ 
        tbProdutos = []; // ... inicia-se um vetor vazio
        $("#divPopularLS").show(); // Exibe o botão de Adicionar itens à tabela
    }
    else
        $("#divPopularLS").hide(); // Esconde o botão de Adicionar itens à tabela
    // Chama função para listar itens do LS        
    Listar();
    // Botão "Cancelar" direciona para a página de listagem
    $("#btnCancelar").click (function(){ $(location).attr('href', "listagem.html"); });
    // Adiciona um novo produto à tabela
    function Adicionar(){
        var perecivel  = ($("#perec").is(":checked"))? "SIM" : "NÃO"; // Verifica se o produto é perecível
        // Converte valores em javascript para uma String JSON
        var produto = JSON.stringify({
            nomeItem: $("#nomeItem").val(),
            uniMedida: $("#uniMedida").val(),
            qtde: $("#qtde").val(),
            preco: $("#preco").val(),
            perecivel: perecivel,
            dtValidade: dataValidade,
            dtFabricacao: dataFabricacao
        });
        // Adiciona os valores ao final do array
        tbProdutos.push(produto);
        // Armazena o novo item no LocalStorage
        localStorage.setItem("tbProdutos", JSON.stringify(tbProdutos));
    }
    // Adiciona produto editado à tabela
    function Editar(){  
        var perecivel  = ($("#perec").is(":checked"))? "SIM" : "NÃO"; // Verifica se o produto é perecível
        tbProdutos[ind] = JSON.stringify({
            nomeItem: $("#nomeItem").val(),
            uniMedida: $("#uniMedida").val(),
            qtde: $("#qtde").val(),
            preco: $("#preco").val(),
            perecivel: perecivel,
            dtValidade: dataValidade,
            dtFabricacao: dataFabricacao
        });
        // Armazena o item editado no LS
        localStorage.setItem("tbProdutos", JSON.stringify(tbProdutos));
    }
    // Exclui produto da tabela
    function Excluir(){
        // Remove 1 item do array no índice "ind" 
        tbProdutos.splice(ind, 1);
        // Armazena o novo array no LocalStorage
        localStorage.setItem("tbProdutos", JSON.stringify(tbProdutos));
        alert("Item excluido com sucesso!");
        // NÃO TRATA ERROS 
    }
    // Exibe itens na tabela
    function Listar(){
        $("#tbLista").html("");
        $("#tbLista").html(
                "<thead>" +
                "   <tr>" +
                "   <th class='centralizar'><a href='cadastro.html'> <button type='button' class='btn btn-primary'>Adicionar</button></a></th>" +
                "   <th class='centralizar'>Nome do Item</th>" +
                "   <th class='centralizar'>Unidade de Medida</th>" +
                "   <th class='centralizar'>Quantidade</th>" +
                "   <th class='centralizar'>Preço</th>" +
                "   <th class='centralizar'>Produto Perecível</th>" +
                "   <th class='centralizar'>Data de Validade</th>" +
                "   <th class='centralizar'>Data de Fabricação</th>" +
                "   </tr>" +
                "</thead>" +
                "<tbody>" +
                "</tbody>"
        );
        for(var i in tbProdutos){
            var produto = JSON.parse(tbProdutos[i]);
            $("#tbLista tbody").append("<tr>");
            $("#tbLista tbody").append("<td class='centralizar'> <a href='#'> <img src='img/lapis.png' alt='"+i+"'class='btnEditar'/> </a>" + 
                                                                "<a href='#'> <img src='img/lixeira.png' alt='"+i+"'class='btnExcluir'/> </a> </td>");
            $("#tbLista tbody").append("<td class='centralizar'>" + produto.nomeItem + "</td>");
            $("#tbLista tbody").append("<td class='centralizar'>" + produto.uniMedida + "</td>");
            $("#tbLista tbody").append("<td class='centralizar'>" + produto.qtde + "</td>");
            $("#tbLista tbody").append("<td class='centralizar'>" + produto.preco + "</td>");
            $("#tbLista tbody").append("<td class='centralizar'>" + produto.perecivel + "</td>");
            $("#tbLista tbody").append("<td class='centralizar'>" + produto.dtValidade + "</td>");
            $("#tbLista tbody").append("<td class='centralizar'>" + produto.dtFabricacao + "</td>");
            $("#tbLista tbody").append("</tr>");
        }
    }
    // Recebe os dados vindos do form
    $("#frmCadastro").on("submit", function(){
        // Pega propriedade "nome" do botão "Salvar"
        ind =  $("#btnSalvar").prop(name);
        // Formata datas antes de armazenar
        dataValidade = formataDataEntrada($("#dtVal").val());
        dataFabricacao = formataDataEntrada($("#dtFab").val());
        // Se for ADIÇÃO, chama função "Adicionar()"
        if (ind === "add") Adicionar();
        // Senão, chama função "Editar()"
        else Editar();
    });
    // Botão Lápis da tabela
    $("#tbLista").on("click", ".btnEditar", function(){
        // Pega o índice do produto a ser editado
        ind = parseInt($(this).attr("alt"));
        // Converte para objeto JS
        var produto = JSON.parse(tbProdutos[ind]);
        // Obtem data de Validade e Fabricação removendo as "" E formata data para yyyy-MM-dd 
		produto.dtValidade = formataDataSaida(JSON.stringify(produto.dtValidade).replace(/"/g, ""));
        produto.dtFabricacao = formataDataSaida(JSON.stringify(produto.dtFabricacao).replace(/"/g, ""));
        // Direciona para a página 'cadastro.html' passando os dados do objeto e o índice pela URL 
        $(location).attr('href', "cadastro.html?nomeItem="+produto.nomeItem+"&uniMedida="+produto.uniMedida+
                                    "&qtde="+produto.qtde+"&preco="+produto.preco+"&perecivel="+produto.perecivel+"&dtVal="+
                                    produto.dtValidade+"&dtFab="+produto.dtFabricacao+"&ind="+ind);
    });
    // Botão "Excluir" da tabela
    $("#tbLista").on("click", ".btnExcluir", function(){
        // Pega o índice do produto a ser excluído
        ind = parseInt($(this).attr("alt"));
        // "msgExcluir" é o id onde a caixa de confirmação foi criada no html
        $("#msgExcluir").dialog({
            resizable: false,
            // Modal desativa os demais itens da tela, impossibilitando interação com eles,
            // forçando usuário a responder a pergunta da caixa de confirmação 
            modal: true,      
            // Botões
            buttons:{
                "Sim": function(){
                    $(this).dialog("close");
                    Excluir();
                    Listar();
                },
                "Não": function(){
                    $(this).dialog("close");
                }
            }
        });
    });
    // Adiciona itens à tabela
    $("#btnPopularLS").click(function(){
        tbProdutos = [ 
            "{\"nomeItem\":\"Livro A Grande Cavalgada\",\"uniMedida\":\"Unidade\",\"qtde\":\"32\",\"preco\":\"R$ 21,90\",\"perecivel\":\"NÃO\",\"dtValidade\":\"\",\"dtFabricacao\":\"01/11/1987\"}",
            "{\"nomeItem\":\"Perfume Jequiti Mano Lima\",\"uniMedida\":\"Unidade\",\"qtde\":\"50\",\"preco\":\"R$ 49,90\",\"perecivel\":\"SIM\",\"dtValidade\":\"20/09/2025\",\"dtFabricacao\":\"01/04/2019\"}",
            "{\"nomeItem\":\"Erva Mate Bagual dos Pampas\",\"uniMedida\":\"Quilograma\",\"qtde\":\"36,000\",\"preco\":\"R$ 11,90\",\"perecivel\":\"SIM\",\"dtValidade\":\"05/06/2022\",\"dtFabricacao\":\"05/06/2020\"}",
            "{\"nomeItem\":\"Cachaca Pinga Ni Min\",\"uniMedida\":\"Litro\",\"qtde\":\"51,000\",\"preco\":\"R$ 7,00\",\"perecivel\":\"NÃO\",\"dtValidade\":\"\",\"dtFabricacao\":\"28/02/2019\"}",
            "{\"nomeItem\":\"Leite de Burra\",\"uniMedida\":\"Litro\",\"qtde\":\"71,000\",\"preco\":\"R$ 14,00\",\"perecivel\":\"SIM\",\"dtValidade\":\"31/12/2020\",\"dtFabricacao\":\"31/05/2020\"}",
            "{\"nomeItem\":\"Queijo Texugo\",\"uniMedida\":\"Quilograma\",\"qtde\":\"19,000\",\"preco\":\"R$ 22,00\",\"perecivel\":\"SIM\",\"dtValidade\":\"19/09/2020\",\"dtFabricacao\":\"19/05/2020\"}",
            "{\"nomeItem\":\"Cepo de Madeira\",\"uniMedida\":\"Unidade\",\"qtde\":\"9\",\"preco\":\"R$ 20,00\",\"perecivel\":\"NÃO\",\"dtValidade\":\"\",\"dtFabricacao\":\"20/07/2019\"}",
            "{\"nomeItem\":\"Churrasqueira de Controle Remoto\",\"uniMedida\":\"Unidade\",\"qtde\":\"6\",\"preco\":\"R$ 2.500,00\",\"perecivel\":\"NÃO\",\"dtValidade\":\"\",\"dtFabricacao\":\"05/01/2015\"}",
            "{\"nomeItem\":\"Cafe Quero Cafe\",\"uniMedida\":\"Quilograma\",\"qtde\":\"22\",\"preco\":\"R$ 8,90\",\"perecivel\":\"SIM\",\"dtValidade\":\"25/12/2020\",\"dtFabricacao\":\"13/05/2020\"}",
            "{\"nomeItem\":\"Cajuzinho Mermao\",\"uniMedida\":\"Unidade\",\"qtde\":\"49\",\"preco\":\"R$ 9,99\",\"perecivel\":\"SIM\",\"dtValidade\":\"04/06/2022\",\"dtFabricacao\":\"04/06/2020\"}",
        ];
        localStorage.setItem("tbProdutos", JSON.stringify(tbProdutos));
        alert("Itens incluídos com sucesso!");      
    });
});