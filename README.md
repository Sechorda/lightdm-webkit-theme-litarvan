# Minimal LightDM WebKit2 Theme Fork

This is a minimal fork of Litarvan's LightDM WebKit2 theme, focusing solely on the login page and its functionality. This theme is used in nody-greeter and is deployed as a .tar.gz file that is unzipped to `/usr/share/web-greeter/themes/litarvan`.

## Overview

- This fork contains only the essential login page functionality, changing settings via the config files(hardcoded)
- It is designed to work with [nody-greeter](https://github.com/JezerM/nody-greeter).
- The theme is distributed as a .tar.gz file.
- Installation path: `/usr/share/web-greeter/themes/litarvan`

## Building

To generate the .tar.gz file:

```
./build.sh
```

This will create a .tar.gz file in the current directory.

## Installation

1. Run the build script to generate the .tar.gz file.
2. Extract the contents of the .tar.gz file to `/usr/share/web-greeter/themes/litarvan`.
3. Configure your greeter to use this theme (see Configuration section).

## Configuration

### Setting up with LightDM

Inside `/etc/lightdm/lightdm.conf`, below a Seat configuration, add:

```
greeter-session=nody-greeter
```

### Configuring the theme

To configure nody-greeter to use this theme, edit the `/etc/usr/lightdm/web-greeter.yml` file and modify the theme setting:

```yaml
theme: litarvan
```

## Customization

- Backgrounds can be added to `/usr/share/backgrounds`.
- The OS logo can be customized by replacing the file at `/usr/share/web-greeter/themes/litarvan/img/os.xxxxxxxx.png`.

## Original Theme Information

This fork is based on Litarvan's LightDM WebKit2 theme. For more information about the original theme, including screenshots and additional features, please visit the [original repository](https://github.com/Litarvan/lightdm-webkit-theme-litarvan).

## License

This fork maintains the same license as the original theme. Please refer to the LICENSE file for more information.
