
const MODULE_ID = 'dragonbane-hide-death-rolls';

const CONFIG_OPT_VISIBILITY = 'deathRollVisibility';

Hooks.once('ready', () => {
    game.settings.register(MODULE_ID, CONFIG_OPT_VISIBILITY, {
        name: game.i18n.localize("DB-HDR.settings.visibility.name"),
        scope: "world",
        config: true,
        default: "public",
        type: new foundry.data.fields.StringField({
            choices: {
                "public": game.i18n.localize("DB-HDR.settings.visibility.option.public"),
                "private": game.i18n.localize("DB-HDR.settings.visibility.option.private"),
                "blind": game.i18n.localize("DB-HDR.settings.visibility.option.blind")
            }
        }),
    });
});

Hooks.on("preCreateChatMessage", cfg => {
    const isDeathRoll = cfg?.system?.attribute === 'con' && !cfg?.system?.canPush;
    if (!isDeathRoll) {
        return;
    }
    const actor = game.actors.get(cfg.speaker.actor);
    cfg.updateSource({
        "whisper": recipients(actor)
    });
});


function recipients(actor) {
    switch(game.settings.get(MODULE_ID, CONFIG_OPT_VISIBILITY)) {
        case "private":
            const owners = Object.keys(actor.ownership).filter(o => o !== 'default');
            return [ ...ChatMessage.getWhisperRecipients("GM").map(u => u.id), ...owners ];
        case "blind":
            return ChatMessage.getWhisperRecipients("GM");
        default:
            return [];
    }
}
