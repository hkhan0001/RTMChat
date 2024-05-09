let handleMemberJoined = async (MemberId) => {
    addMember(MemberId);

    let members = await channel.getMembers();
    updateMemberTotal(members);

    let {name} = await rtmClient.getUserAttributesByKeys(MemberId,['name']);
    addBotMessage(`${name} has joined the room.`);
}

let addMember = async (MemberId) => {
    let {name} = await rtmClient.getUserAttributesByKeys(MemberId,['name'])

    let membersWrapper = document.getElementById('member__list')
    let memberItem = `
    <div class="member__wrapper" id="member__${MemberId}__wrapper">
        <span class="green__icon"></span>
        <p class="member_name">${name}</p>
    </div>`;

    membersWrapper.insertAdjacentHTML('beforeend',memberItem);
}

let updateMemberTotal = async(members) => {
    let total = document.getElementById('members__count')
    total.innerText = members.length;
}

let handleMemberLeft = async (MemberId) => {
    removeMember(MemberId);

    let members = await channel.getMembers();
    updateMemberTotal(members);
}

let removeMember = async (MemberId) => {
    let membersWrapper = document.getElementById(`member__${MemberId}__wrapper`);
    let name = membersWrapper.getElementsByClassName('member_name')[0].textContent;
    membersWrapper.remove();

    addBotMessage(`${name} has left.`);
}

let getMembers = async () => {
    let members = await channel.getMembers()
    updateMemberTotal(members);

    for(let i = 0; i < members.length; i++)
    {
        addMember(members[i]);
    }
}

let handleMessage = async(messageData, MemberId) =>
{
    console.log('Message received');
    let data = JSON.parse(messageData.text);
    
    if(data.type === 'chat')
    {
        addMessage(data.displayName, data.message);    
    }
}

let sendMessage = async(e) =>
{
    e.preventDefault()

    let message = e.target.message.value;
    channel.sendMessage({text:JSON.stringify(
        {'type':'chat',
        'message':message, 
        'displayName':displayName})})

    addMessage(displayName,message);

    e.target.reset();
}

let addMessage = (name,message) => {
    let messagesWrapper = document.getElementById('messages')

    let newMessage = `<div class="message__wrapper">
                        <div class="message__body">
                            <strong class="message__author">${name}</strong>
                            <p class="message__text">${message}</p>
                        </div>
                    </div>`;

    messagesWrapper.insertAdjacentHTML('beforeend',newMessage);
    let lastMessage = document.querySelector('#messages .message__wrapper:last-child');
    
    if(lastMessage)
    {
        lastMessage.scrollIntoView();
    }
}

let addBotMessage = (botMessage) => {
    let messagesWrapper = document.getElementById('messages')

    let newMessage = `<div class="message__wrapper">
                        <div class="message__body__bot">
                            <strong class="message__author__bot">Chat Bot</strong>
                            <p class="message__text__bot">${botMessage}</p>
                        </div>
                    </div>`;

    messagesWrapper.insertAdjacentHTML('beforeend',newMessage);
    let lastMessage = document.querySelector('#messages .message__wrapper:last-child');
    
    if(lastMessage)
    {
        lastMessage.scrollIntoView();
    }
}

let leaveChannel = async() =>
    {
        await channel.leave();
        await rtmClient.logout();
    }

window.addEventListener('beforeunload', leaveChannel);
let messageForm = document.getElementById('message__form');
messageForm.addEventListener('submit', sendMessage);