import { settings } from './settings';

export const DEFAULT_COLOR = '#249cea';
export const DEFAULT_VIDEO_BG = require('./assets/videos/background.webm');

export let color = localStorage.getItem('color') || DEFAULT_COLOR;
export let videoBackground = getVideoBackground();

export function hook(element, rules) {
    const style = element.style;

    for (const rule of rules) {
        style[rule] = color;
    }
}
document.documentElement.style.setProperty('--primary-color', color)

export function updateColor(hex) {
    color = hex;
    localStorage.setItem('color', color);
    document.documentElement.style.setProperty('--primary-color', color)
}

export function updateVideoBG(videoBg) {
    videoBackground = videoBg;
    localStorage.setItem('videoBackground', videoBg);
    if (window.greeter_comm) {
        greeter_comm.broadcast({
            type: "change-video-background",
            path: videoBg,
        })
    }
}

export async function videoBackgrounds() {
    const folder = greeter_config.branding.background_videos_dir;
    if (!folder) {
        return [DEFAULT_VIDEO_BG];
    }

    const recDirList = async (dir) => {
        let result = [];
        let dirlist = [];
        await new Promise((resolve) => {
            let dirl = theme_utils.dirlist(dir, false, (files) => {
                dirlist = files;
                resolve();
            })
            if (Array.isArray(dirl)) {
                dirlist = dirl;
                resolve();
            }
        })

        for (const file of dirlist) {
            if (!file.includes('.')) {
                result = [...result, ...(await recDirList(file))];
            } else if (file.endsWith('.webm')) {
                result.push(file);
            }
        }
        return result;
    };

    let result = await recDirList(folder);

    return [DEFAULT_VIDEO_BG, ...result];
}

function getVideoBackground() {
    if(settings.randomizeVideoBG) {
        const videoBgs = videoBackgrounds();
        return videoBgs[Math.floor(Math.random() * videoBgs.length)];
    }

    return localStorage.getItem('videoBackground') || DEFAULT_VIDEO_BG;
}