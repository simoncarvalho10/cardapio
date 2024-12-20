/*const { GiConsoleController } = require("react-icons/gi")*/
const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartmodal = document.getElementById("cart-modal")
const cartitensContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const adressImput = document.getElementById("adress")
const adressWarn = document.getElementById("adress-warn")
const clientImput = document.getElementById("cliente")
const nameWarn = document.getElementById("name-warn")
const incrementButton = document.querySelectorAll('.increment-button')
const decrementButton = document.querySelectorAll('.decrement-button')
const cartButton = document.querySelectorAll('.add-to-cart-btn')
const cliente = document.getElementById("cliente")


function atualizarIndexSelect(selectId) {
    const selectElement = document.getElementById(selectId);
    const currentIndex = selectElement.selectedIndex;
    selectElement.classList.remove("border-red-500")
    if(currentIndex != 0){
       const currenteOptions = selectElement.options[currentIndex].text;
        return currenteOptions;
    } else {
        alertToastfy("Selecione uma opção válida!", "#ef4444", "center");
        selectElement.classList.add("border-red-500")
        throw new Error("Selecione uma opção válida!");
        //alertToastfy("Selecione uma opção válida!", "#ef4444", "center");
    }
    
}

 
const spanItem = document.getElementById("date-spam")


let cart = [];

// Adicionar evento de clique para os botões de decrementar
incrementButton.forEach((button) => {
    button.addEventListener('click', () => {
    const input = button.previousElementSibling; // Input está após o botão decrement
    let currentValue = parseInt(input.value) || 0;
    currentValue++;
    input.value = currentValue;
    });
});

// Adicionar evento de clique para os botões de decrementar
decrementButton.forEach((button) => {
    button.addEventListener('click', () => {
    const input = button.nextElementSibling; // Input está antes o botão decrement
    let currentValue = parseInt(input.value) || 0;
    
    if(currentValue > 0){
        currentValue--;
        input.value = currentValue;
    }
    });
});

cartBtn.addEventListener("click", function() { 
    if(cart.length > 0){
        cartmodal.style.display = "flex"  
    } else {
        alertToastfy("Não há nenhum item no carrinho!", "#ef4444", "center");
    }
})

cartmodal.addEventListener("click", function(event){
    if(event.target === cartmodal) {
        cartmodal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function() {
    cartmodal.style.display = "none"
})
    
document.addEventListener('click', (event) => {
    // Verifica se o botão clicado é o de confirmação
    
    if (event.target.closest('.qtdcontainer')) {

        let parentButton = event.target.closest('.add-to-cart-btn');
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        const container = event.target.closest('.qtdcontainer');
        const input = container.querySelector('.quantity-input');
        const inputValue = input.value;
        
        if (inputValue > 0){
            addToCart(name, price, inputValue)
        } else {
            alertToastfy("Quantidade não permitida!", "#ef4444", "center");
        }
    }

});    

function addToCart(name, price, qtdInputValues){

    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        existingItem.qtd = qtdInputValues
    } else {
        cart.push({
            name,
            price,
            qtd: qtdInputValues,
        })
    }

    alertToastfy("Item adicionado ao carrinho", "#22c55e", "center");
    
    uppdateCartModal();
}

function uppdateCartModal(){
    cartitensContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item =>{
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        
        
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.qtd}</p>
                    <p class="font-medium mt-2"> R$ ${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>
            <div class="border-b border-gray-500 mt-3 w-full"></div>
        
        `
        total += item.price * item.qtd;

        cartitensContainer.appendChild(cartItemElement)
    })  
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
    cartCounter.innerHTML = cart.length;
}

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")
        console.log(name); 
        removeItemCart(name)
    } 
});

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name)
    if(index !== -1){
        const item = cart[index];
        console.log(item);

        cart.splice(index, 1);

        alertToastfy("Item removido do carrinho!", "#22c55e", "center");

        uppdateCartModal();
    }
}

adressImput.addEventListener("input", function(event){

    let inputValue = event.target.value;   
    if(inputValue !== ""){
        adressImput.classList.remove("border-red-500")
        adressWarn.classList.add("hidden")
    } 
})

clientImput.addEventListener("input", function(event){

    let inputValue = event.target.value;   
    if(inputValue !== ""){
        clientImput.classList.remove("border-red-500")
        nameWarn.classList.add("hidden")
    } 
})

// Função para obter a localização
function validarLocalizacao() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const link = `https://www.google.com/maps?q=${latitude},${longitude}`;
                resolve(link); // Resolve a Promise com o link
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        reject("Permissão negada para acessar a localização.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        reject("Localização indisponível.");
                        break;
                    case error.TIMEOUT:
                        reject("O tempo para obter a localização expirou.");
                        break;
                    default:
                        reject("Erro desconhecido ao obter a localização.");
                        break;
                }
            }
        );
    });
}

async function obterLink() {
    try {
        const vLink = await validarLocalizacao(); // Aguarda o link da localização
        return vLink;
    } catch (error) {
        alert("Erro: " + error);
    }
};         

function chkDelivery(){
    const txtTpPedido = atualizarIndexSelect("tp_pedido");
    return txtTpPedido == "Delivery";
}

async function validaPedido(){
    const checkbox = document.getElementById('getLocation'); 
    const txtTpPedido = atualizarIndexSelect("tp_pedido");
    const txtTpPgto = atualizarIndexSelect("tp_pagamento");
    const isDelivery = chkDelivery(); 

    if (!checkbox.checked && isDelivery) {
        
        let resposta = confirm("Deseja enviar a localização para faclitar a entrega?");
    
        if (resposta) {
            
            const vLink = await obterLink();
            /*alert("Localização: " + vLink);
            alert("Cliente: " + cliente.value);
            alert("Endereço: " + adressImput.value);  
            alert("Tipo da entega: " + txtTpPedido);
            alert("Forma de pagamento: " + txtTpPgto);  */

            const vMsg2 = `*Cliente:* ${cliente.value}%0A*Endereço:* ${adressImput.value}%0A*Tipo da entrega:*+${txtTpPedido}%0A*Forma de pagamento:* ${txtTpPgto}%0A*Localização:* ${vLink}`
            return vMsg2;
            
                                    
        } else {

            /*alert("Cliente: " + cliente.value);
            alert("Endereço: " + adressImput.value);  
            alert("Tipo da entega: " + txtTpPedido);
            alert("Forma de pagamento: " + txtTpPgto);*/
            
            const vMsg2 = `*Cliente:* ${cliente.value}%0A*Endereço:* ${adressImput.value}%0A*Tipo da entrega:*+${txtTpPedido}%0A*Forma de pagamento:* ${txtTpPgto}`
            return vMsg2;
        }		
    
    } else if (checkbox.checked && isDelivery){

        const vLink = await obterLink();
   
        /*alert("Localização: " + vLink);
        alert("Cliente: " + cliente.value);
        alert("Endereço: " + adressImput.value);  
        alert("Tipo da entega: " + txtTpPedido);
        alert("Forma de pagamento: " + txtTpPgto);   */
        
        const vMsg2 = `*Cliente:* ${cliente.value}%0A*Endereço:* ${adressImput.value}%0A*Tipo da entrega:*+${txtTpPedido}%0A*Forma de pagamento:* ${txtTpPgto}%0A*Localização:* ${vLink}`
        return vMsg2;

    }   else {
            
        /*alert("Cliente: " + cliente.value);
        alert("Forma de pagamento: " + txtTpPgto); */

        const vMsg2 = `*Cliente:* ${cliente.value}%0A*Forma de pagamento:* ${txtTpPgto}`
        return vMsg2;
    }

}

function gerarNumeroSequencial() {
    // Obtém a data e hora atuais
    const agora = new Date();

    // Formata a data e hora como "HHMMSS" (hora, minuto e segundo)
    const dia = agora.getDate().toString().padStart(2, '0');
    //const ano = agora.getFullYear().toString().padStart(2, '0').slice(-2);
    const hora = agora.getHours().toString().padStart(2, '0');
    const minuto = agora.getMinutes().toString().padStart(2, '0');
    const segundo = agora.getSeconds().toString().padStart(2, '0');

    // Combina os valores para gerar um número de até 6 dígitos
    const numeroSequencial = `${dia}${hora}${minuto}${segundo}`;

    return parseInt(numeroSequencial, 10);
}


checkoutBtn.addEventListener("click", async function(){

    // Pega número do pedido
    const nPedido = gerarNumeroSequencial();


    const vPedido = await validaPedido();

    if(cart.length === 0) return;
    if(clientImput.value === ""){
        nameWarn.classList.remove("hidden")
        clientImput.classList.add("border-red-500")
        return;
    }

    if(adressImput.value === ""){
        adressWarn.classList.remove("hidden")
        adressImput.classList.add("border-red-500")
        return;
    }

    /*if (!isOpen){
        alertToastfy("No momento o restaurante está fechado!", "#ef4444", "center");
    }*/



    //ENVIAR O PEDIDO
    const cartItens = cart.map((item) => {
        return (
           //`*Item:*+${item.name}%0A*Quantidade:*+(${item.qtd})*2%0A*Preço:*+R$${item.price}%0A%0A`
           `*Item:* ${item.name}%0A*Quantidade:* ${item.qtd}%0A*Preço:* R$ ${item.price}%0A%0A`
         )
    }).join("")

    const message = cartItens
    const totalItens = cart.reduce((total, item) => total + (item.qtd * item.price), 0);
    const phone = "5562984917598"
    const separador = "--------------------------------------------------------------"

    //const vTexto = encodeURIComponent(`${message}+${vPedido}`)
    //alert(vTexto);

    window.open(`https://wa.me/${phone}?text=${separador}%0A*Nº do pedido:* ${nPedido}%0A${separador}%0A${vPedido}%0A%0A${separador}%0ADados do pedido:%0A${separador}%0A${message}${separador}%0A*Total:* R$${totalItens.toFixed(2)}%0A${separador}%0A`,"_blank")

    

    cart = [];
    uppdateCartModal();

})

// VERIFICAR SE O RESTAURANTE ESTÁ ABERTO

function checkRestaurantOpen (){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}


const isOpen = checkRestaurantOpen();

if (isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}

function alertToastfy(text, color, position){
    Toastify({
        text: text,
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: position, // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: color,
            //background: "#ef4444",
        },
        onClick: function(){} // Callback after click
      }).showToast();
    return;
}


// VERIFICAR SE O RESTAURANTE ESTÁ ABERTO





 



