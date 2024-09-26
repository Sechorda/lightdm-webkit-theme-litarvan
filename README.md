# Litarvan's LightDM WebKit2 theme (Login-only version)

This is a stripped-down version of the Litarvan LightDM WebKit2 theme, focusing solely on the login functionality.

## Features

- Clean and minimalistic login interface
- User selection
- Session (desktop environment) selection
- Power options (shutdown, restart, suspend, hibernate)
- Multi-language support
- Customizable avatar and background

## Installation

### Arch Linux

```
pacman -S --needed lightdm-webkit2-greeter lightdm-webkit-theme-litarvan
```

* If not already done, edit `/etc/lightdm/lightdm.conf` and set `greeter-session=lightdm-webkit2-greeter`.
* Then edit `/etc/lightdm/lightdm-webkit2-greeter.conf` and set `theme` or `webkit-theme` to `litarvan`.

### Manual Installation

* Install lightdm-webkit2-greeter using your dependency manager if not already done
* Download and unzip the theme files in `/usr/share/lightdm-webkit/themes/litarvan/`
* Edit `/etc/lightdm/lightdm-webkit2-greeter.conf` and set `theme` to `litarvan`.

## Customization

- Backgrounds can be added in `/usr/share/backgrounds`
- Customize the OS logo by replacing `/usr/share/lightdm-webkit/themes/litarvan/img/os.png`

## Building

```
$ ./build.sh
```

This will generate a lightdm-webkit-theme-litarvan.tar.gz file in the current folder.

## Screenshot

![Login screenshot](https://litarvan.github.io/lightdm-webkit-theme-litarvan/login_view.png)

## Credits

Based on the original work by Litarvan (https://github.com/Litarvan/lightdm-webkit-theme-litarvan)
