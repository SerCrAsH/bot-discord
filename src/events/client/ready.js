
export default client => {
    console.log(`Bot iniciado como ${client.user.tag}`.green);

    if (client?.application?.commands) {
        client.application.commands.set(client.slashArray);
        console.log(`(/) ${client.slashCommands.size} slashCommands published!`.green);
    }
}