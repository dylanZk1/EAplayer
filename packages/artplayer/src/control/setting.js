import { append, debounce, tooltip } from '../utils';

export default function setting(option) {
    return (art) => ({
        ...option,
        tooltip: art.i18n.get('Show Setting'),
        mounted: ($control) => {
            let i = 0;
            const { proxy, icons, i18n, template: { $player }} = art;

            append($control, icons.setting);

            proxy($control,'click',()=>{
                art.setting.toggle();
                art.setting.updateStyle();
                proxy(art.setting.$parent,'mouseleave',(e)=>{
                    if(e.offsetY > 0){
                        art.setting.changeState(false);
                        art.setting.updateStyle();
                    }
                });
                proxy(art.setting.$parent,'mousemove',(e)=>{
                    const currentOffsetY = art.setting.$parent.clientHeight + 46 + 30 - (document.documentElement.offsetHeight - e.clientY);
                    if(currentOffsetY <= 2){
                        art.setting.changeState(false);
                        art.setting.updateStyle();
                    }
                });
            });

            proxy($control,'mouseleave',(e)=>{
                console.log(document.documentElement.offsetHeight - e.clientY);
            })

            proxy($player,'mouseleave',()=>{
                art.setting.changeState(false);
                art.setting.updateStyle();
            })

            art.on('setting', (value) => {
                tooltip($control, i18n.get(value ? 'Hide Setting' : 'Show Setting'));
            });
        },
    });
}
