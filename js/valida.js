$(document).ready(function(){
    // Para controle da opção perecível. Controla se "Data de Validade" é obrigatória ou não
    var perecivel = false;  
    // Se URL contiver o caractere "?", Então é EDIÇÃO
    if (window.location.href.includes('?')){
        validaQtde(produto.uniMedida); // Chama validaQtde() para exibição do ADD-ON correto
        verificaPerec(produto.perecivel); // Chama verificaPerec() para validação da "Data de Validade"
    }
    // Ao mudar "Unidade de Medida" chama a função "validaQtde()"
    $('#uniMedida').change(function () { validaQtde($(this).val()); });
    // Valida campo "qtde" conforme valor do SELECT e exibe o ADDON correto
    function validaQtde(uniMedida){
        if(uniMedida === "Litro"){
            $("#qtde").attr("pattern", "^\\d+([.,]\\d{1,3})?$");
            $("#qtde").attr("title", "Valor deve ter no máximo 3 casas decimais");
            $("#lt").prop("hidden", false); // Exibe addon lt
            $("#kg").prop("hidden", true); // Esconde addon kg
            $("#un").prop("hidden", true); // Esconde addon un
        }
        else if(uniMedida === "Quilograma"){
            $("#qtde").attr("pattern", "^\\d+([.,]\\d{1,3})?$");
            $("#qtde").attr("title", "Valor deve ter no máximo 3 casas decimais");
            $("#lt").prop("hidden", true);
            $("#kg").prop("hidden", false);
            $("#un").prop("hidden", true);
        }
        else if(uniMedida === "Unidade"){
            $("#qtde").attr("pattern", "[0-9]+$");
            $("#qtde").attr("title", "Insira apenas números inteiros");
            $("#lt").prop("hidden", true);
            $("#kg").prop("hidden", true);
            $("#un").prop("hidden", false);
        }
    }
    // Máscara para "Quantidade" se "Unidade de Medida" for "Litro" ou "Quilograma"
    $("#qtde").blur(function(){
        if($("#uniMedida").val() === "Litro" || $("#uniMedida").val() === "Quilograma"){
            // Se "Quantidade" tive valor...
            if($("#qtde").val() !== ""){  
                var valor = $("#qtde").val();
                // Se "Quantidade" informada contiver ","
                if(valor.indexOf(",") !== -1){
                    var casas = valor.split(",");
                    // Se valor informado for "X,X"...
                    if(casas[1].length === 1){
                        valor = valor.concat("00"); // Acrescenta "00" no final do número
                        $("#qtde").prop("value", valor);
                    }
                    // Se valor informado for "X,XX"...
                    else if(casas[1].length === 2){
                        valor = valor.concat("0"); // Acrescenta "0" no final do número
                        $("#qtde").prop("value", valor);
                    }
                }
                // Se não tiver "," apenas acrescenta ",000" ao número informado
                else{
                    valor = valor.concat(",000");
                    $("#qtde").prop("value", valor);
                }
            }
        }
    });      
    // Função para aplicar maskMoney no campo "Preço"
    function aplicaMascara(){ 
        $("#preco").maskMoney({
            prefix:'R$ ',
            thousands: '.',
            decimal: ',',
        });
    }
    // Chama a função acima
    aplicaMascara();  
    // Verifica se produto é perecível  
    function verificaPerec(valor){
        // Define "Data de Validade" OBRIGATÓRIA se o produto for perecível
        if(valor === "SIM" || valor === "perec"){
            $("#dtVal").prop("required", true);
            perecivel = true;
        }
        // Define" Data de Validade" OPCIONAL se o produto NÃO for perecível
        else if(valor === "NÃO" || valor === "nPerec"){
            $("#dtVal").prop("required", false);
            perecivel = false;            
        }
    } 
    // Chama a função "verificaPerec()" ao mudar valor de "Perecível"
    $("#perec").click(function(){ verificaPerec("perec"); });  
    $("#nPerec").click(function(){ verificaPerec("nPerec"); });  
    // Ao mudar "Data de validade" ...
    $("#dtVal").change(function(){
        // Pega o valor dos inputs em variáveis
        var dataVal = formataDataEntrada($("#dtVal").val());
        var dataFab = formataDataEntrada($("#dtFab").val());
        // Chama Função pra validar datas
        verificaData(dataVal, dataFab, "dataVal");
    });
    // Ao mudar a data de fabricação ...
    $("#dtFab").change(function(){
        // Pega o valor dos inputs em variáveis
        var dataVal = formataDataEntrada($("#dtVal").val());
        var dataFab = formataDataEntrada($("#dtFab").val());
        // Chama Função pra validar datas
        verificaData(dataVal, dataFab, "dataFab");
    });
    // FUNÇÕES DE DATA
    // Retorna data no formato DD/MM/AAAA
    window.formataDataEntrada = function(data){
        if(data == "") return "";
        var arrData = data.split("-");  // Ex input "2018-07-22"
        var dataFormatada = arrData[2] + "/" + arrData[1] + "/" + arrData[0].substring(0); // Ex saida: "22/07/2018"
        return dataFormatada;
    };
    // Retorna data no formato AAAA-MM-DD
    window.formataDataSaida = function(data){
        if(data == "") return "";
        var arrData = data.split("/");
        var dataFormatada = arrData[2] + "-" + arrData[1] + "-" + arrData[0].substring(0);
        return dataFormatada;
    };
    // Realiza validações das datas de Validade e Fabricação 
    function verificaData(dataVal, dataFab, chamada){
        var hoje = new Date();
        // Validações para a "Data de Validade"
        if(chamada === "dataVal"){
            var dataVal = formataData(dataVal);
            // Se "Data de Fabricação" NÃO estiver em branco...
            if(dataFab !== ""){
                var dataFab = formataData(dataFab);
                // Se "Data de Validade" for anterior a "Data de Fabricação"...
                if(dataVal < dataFab){
                    alert("Data de Validade não pode ser anterior a Data de Fabricação");
                    $("#dtVal").prop("value", ""); // Limpa o campo "Data de Validade"
                }
            }
            // Se "Data de Validade" for anterior a Data atual E posterior ou igual a "Data de Fabricação"...
            if(dataVal < hoje.setDate(hoje.getDate() - 1) && dataVal >= dataFab){ 
                alert("Produto Vencido!");
                preventDefault(); // *** EXIBE ERRO NO CONSOLE MAS NÃO EXIBE "ALERT" DUAS VEZES
            }
        }
        // Validações para a "Data de Fabricação"
        else if(chamada === "dataFab"){
            var dataFab = formataData(dataFab);
            // Se "Data de Fabricação" for posterior a data atual...
            if(dataFab > hoje){
                alert("Informe uma data anterior");
                $("#dtFab").prop("value", ""); // Limpa o campo Data de Fabricação
            }
            // Se "Data de Validade" NÃO estiver em branco...
            else if(dataVal !== ""){
                var dataVal = formataData(dataVal);
                // Se "Data de Fabricação" for posterior a "Data de Validade"...
                if(dataFab > dataVal){
                    alert("Data de Fabricação não pode ser posterior a Data de Validade");
                    $("#dtFab").prop("value", ""); // Limpa o campo Data de Fabricação
                }
            }
        }
        // Formata data para comparações
        function formataData(data){
            var str = data.split("/");
            var data = new Date(str[2], str[1] - 1, str[0]);
            return data;
        }      
    };
});