export default function version(option) {
    const player = window.player.name?window.player.name:'EAPlayer';
    const version = window.player.version?window.player.version:'2.0.0';
    return {
        ...option,
        // html: `<a href="https://artplayer.org" target="_blank">ArtPlayer ${process.env.APP_VER}</a>`,
        html: '<a href="https://artplayer.org" target="_blank">'+player+' '+version+'</a>',
        click: (contextmenu)=>{
            window.open('https://artplayer.org');
            contextmenu.show = false;
        }
    };
}
