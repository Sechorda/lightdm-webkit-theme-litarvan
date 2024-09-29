# Minimal LightDM WebKit2 Theme Fork

This is a minimal fork of Litarvan's LightDM WebKit2 theme, focusing solely on the login page and its functionality. This theme is used in [nody-greeter](https://github.com/JezerM/nody-greeter) and is deployed as a .tar.gz file that is unzipped to `/usr/share/web-greeter/themes/sechorda`.

## Demo

[Video Demo Placeholder]

## Installation

1. Run the build script to generate the .tar.gz file:
   ```
   ./build.sh
   ```
2. Create the theme directory (if it doesn't exist) and extract the contents of the .tar.gz file:
   ```
   # Create the theme directory if it doesn't exist
   sudo mkdir -p /usr/share/web-greeter/themes/sechorda
   
   # Extract the theme files into the directory
   sudo tar -xvf lightdm-webkit-theme-sechorda-1.0.0.tar.gz -C /usr/share/web-greeter/themes/sechorda
   ```
3. Configure your greeter to use this theme (see Configuration section).

## Configuration

### Setting up with LightDM

Inside `/etc/lightdm/lightdm.conf`, update the greeter-session globally:

```
sed -i 's/^greeter-session=.*/greeter-session=nody-greeter/' /etc/lightdm/lightdm.conf
```

### Configuring the theme

To configure nody-greeter to use this theme, update the theme setting in `/etc/usr/lightdm/web-greeter.yml`:

```
sed -i 's/^theme:.*/theme: sechorda/' /etc/usr/lightdm/web-greeter.yml
```

## Original Theme Information

This fork is based on Litarvan's LightDM WebKit2 theme. For more information about the original theme, including screenshots and additional features, please visit the [original repository](https://github.com/Litarvan/lightdm-webkit-theme-litarvan).

## License

This fork maintains the same license as the original theme. Please refer to the LICENSE file for more information.
