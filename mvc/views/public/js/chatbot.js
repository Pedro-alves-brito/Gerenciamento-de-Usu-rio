function sendMessage() {
    let input = document.getElementById('user-input');
    let message = input.value.trim();

    if (message !== "") {
  
        let messagesContainer = document.getElementById('chat-messages');
        let userMessage = document.createElement('div');
        userMessage.classList.add('message', 'user-message');
        userMessage.innerHTML = `<p>${message}</p>`;
        messagesContainer.appendChild(userMessage);


        input.value = "";

      
        setTimeout(() => {
            let botMessage = document.createElement('div');
            botMessage.classList.add('message', 'bot-message');
            botMessage.innerHTML = `<p>Você disse: ${message}</p>`;
            messagesContainer.appendChild(botMessage);

      
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);
    }
}