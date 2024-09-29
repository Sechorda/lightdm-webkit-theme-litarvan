export default function(el, custom) {
    // Removed the translation check, assuming italics are always enabled
    const classes = el.classList;
    if (classes.contains('italic')) {
        return;
    }

    classes.add('italic');
    if (custom) {
        classes.add('custom-italic');
    }
}