let local = localStorage.getItem('settings');

if (local === 'undefined') {
    local = null;
}

export let settings = (local ? JSON.parse(local) : null) || {
    disableZoom: false,
    clock12: false,
    disablePowerTexts: false,
    hideUsername: false,

    user: lightdm.users[0],
    desktop: lightdm.sessions[0]
};

if (!settings.user) {
    settings.user = lightdm.users.find(u => !!u);
}
if (!settings.desktop) {
    settings.desktop = lightdm.sessions.find(s => !!s);
}

// Handle display name change
lightdm.users.forEach(u => settings.user.username === u.username && (settings.user = u));
lightdm.sessions.forEach(s => settings.desktop.username === s.key && (settings.desktop = s));

save();

export function save(s) {
    localStorage.setItem('settings', JSON.stringify(s ? settings = s : settings));
}

console.log(' --> Loaded settings :');
console.log(settings);