import { includeFromEvent, includeFromEventGroup, isMobile } from '../utils';
import { DBCLICK_TIME } from 'artplayer';

export default function clickInit(art, events) {
    const {
        constructor,
        template: { $player, $video },
    } = art;

    // eslint-disable-next-line no-unused-vars
    let menuContext = false;

    art.on('contextMenuHover',(ismenu)=>{
        menuContext = ismenu;
    })

    events.proxy(document, ['click', 'contextmenu'], (event) => {
        if (includeFromEvent(event, $player) || (window.titleBar && includeFromEvent(event, window.titleBar))) {
            art.isInput = event.target.tagName.toUpperCase() === 'INPUT';
            art.isFocus = true;
            art.emit('focus', event);
        } else {
            art.isInput = false;
            art.isFocus = false;
            art.emit('blur', event);
        }
    });

    events.proxy($video, 'click', (event) => {
        const { MOBILE_CLICK_PLAY, MOBILE_DBCLICK_PLAY, DBCLICK_FULLSCREEN } = constructor;
        const click1 = debounce(()=>{
            art.emit('dblclick', event);
            if (isMobile) {
                if (!art.isLock && MOBILE_DBCLICK_PLAY) {
                    art.toggle();
                }
            } else {
                if (DBCLICK_FULLSCREEN) {
                    art.fullscreen = !art.fullscreen;
                }
            }
        },()=>{
            art.emit('click', event);
            if (isMobile) {
                if (!art.isLock && MOBILE_CLICK_PLAY) {
                    art.toggle();
                }
            } else {
                if(menuContext){
                    art.toggle();
                    menuContext = false;
                }

            }
        });
        click1();
    });

    function debounce(doubleclick, singleclick, delay = DBCLICK_TIME) {
        let timer = null
        return function () {
            // 如果timer有值代表前面已经点击了一次  那就返回
            if (timer) {
                console.log("没有执行")
                clearTimeout(timer)
                // 初始化 要不然永远会走这个if语句
                timer = null
                doubleclick();
                return
            }
            timer = setTimeout((...args) => {
                singleclick.apply(this, args);
                doubleclick();
                timer = null
            }, delay)
        }
    }
}
