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
    const currenteOptions = selectElement.options[currentIndex].text;
    return currenteOptions;
}
 
const spanItem = document.getElementById("date-spam")


let cart = [];

// Adicionar evento de clique para os botões de decrementar
incrementButton.forEach((button) => {
    button.addEventListener('click', () => {
    const input = button.nextElementSibling; // Input está após o botão decrement
    let currentValue = parseInt(input.value) || 0;
    currentValue++;
    input.value = currentValue;
    });
});

// Adicionar evento de clique para os botões de decrementar
decrementButton.forEach((button) => {
    button.addEventListener('click', () => {
    const input = button.previousElementSibling; // Input está antes o botão decrement
    let currentValue = parseInt(input.value) || 0;
    
    if(currentValue > 1){
        currentValue--;
        input.value = currentValue;
    }
    });
});

cartBtn.addEventListener("click", function() {
   cartmodal.style.display = "flex" 
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

            Toastify({
                text: "Quantidade não permitida!",
                duration: 3000,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "center", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "#ef4444",
                },
                onClick: function(){} // Callback after click
              }).showToast();

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

    Toastify({
        text: "Item adicionado ao carrinho!",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#22c55e",
        },
        onClick: function(){} // Callback after click
      }).showToast();
    
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

        Toastify({
            text: "Item removido do carrinho!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#22c55e",
            },
            onClick: function(){} // Callback after click
          }).showToast();

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

checkoutBtn.addEventListener("click", async function(){

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

        Toastify({
            text: "No momento o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
            onClick: function(){} // Callback after click
          }).showToast();
        return;
    }*/



    //ENVIAR O PEDIDO
    const cartItens = cart.map((item) => {
        return (
           //`*Item:*+${item.name}%0A*Quantidade:*+(${item.qtd})*2%0A*Preço:*+R$${item.price}%0A%0A`
           `*Item:* ${item.name}%0A*Quantidade:* ${item.qtd}%0A*Preço:* R$${item.price}%0A%0A`
         )
    }).join("")

    const message = cartItens
    const phone = "5562984917598"

    //const vTexto = encodeURIComponent(`${message}+${vPedido}`)
    //alert(vTexto);

    window.open(`https://wa.me/${phone}?text=${message}${vPedido}`,"_blank")
    //alert(`https://wa.me/${phone}?text=${message}%0A%0A ${vPedido}`);

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

// VERIFICAR SE O RESTAURANTE ESTÁ ABERTO





 



