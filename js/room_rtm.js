let handleMemberJoined = async (MemberId) => {
    addMember(MemberId);
}

let addMember = async (MemberId) => {
    let membersWrapper = document.getElementById('member__list')
    let memberItem = `
    <div class="member__wrapper" id="member__${MemberId}__wrapper">
        <span class="green__icon"></span>
        <p class="member_name">${MemberId}</p>
    </div>`;

    membersWrapper.insertAdjacentHTML('beforeend',memberItem);
}

let handleMemberLeft = async (MemberId) => {
    removeMember(MemberId);
}

let removeMember = async (MemberId) => {
    let membersWrapper = document.getElementById(`member__${MemberId}__wrapper`);
    membersWrapper.remove();
}

let getMembers = async () => {
    let members = await channel.getMembers()

    for(let i = 0; members.length; i++)
    {
        addMember(members[i]);
    }
}

let leaveChannel = async() =>
    {
        await channel.leave();
        await rtmClient.logout();
    }

window.addEventListener('beforeunload', leaveChannel);