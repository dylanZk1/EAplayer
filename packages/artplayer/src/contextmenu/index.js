import { setStyles, includeFromEvent, isMobile } from '../utils';
import Component from '../utils/component';
import playbackRate from './playbackRate';
import aspectRatio from './aspectRatio';
import flip from './flip';
import info from './info';
import version from './version';
import close from './close';

export default class Contextmenu extends Component {
    constructor(art) {
        super(art);

        this.name = 'contextmenu';
        this.$parent = art.template.$contextmenu;
        this.menuList = [];
        this.customMenuList = [];

        if (!isMobile) {
            this.init();
        }
    }

    init() {
        const {
            option,
            proxy,
            template: { $player, $contextmenu },
        } = this.art;

        if (option.playbackRate) {
            this.menuList.push(playbackRate({
                name: 'playbackRate',
                index: 10,
            }));
            // this.add(
            //     playbackRate({
            //         name: 'playbackRate',
            //         index: 10,
            //     }),
            // );
        }

        if (option.aspectRatio) {
            this.menuList.push(aspectRatio({
                name: 'aspectRatio',
                index: 20,
            }));
            // this.add(
            //     aspectRatio({
            //         name: 'aspectRatio',
            //         index: 20,
            //     }),
            // );
        }

        if (option.flip) {
            this.menuList.push(flip({
                name: 'flip',
                index: 30,
            }));
            // this.add(
            //     flip({
            //         name: 'flip',
            //         index: 30,
            //     }),
            // );
        }

        this.menuList.push(info({
            name: 'info',
            index: 40,
        }));
        // this.add(
        //     info({
        //         name: 'info',
        //         index: 40,
        //     }),
        // );

        this.menuList.push(version({
            name: 'version',
            index: 50,
        }));
        // this.add(
        //     version({
        //         name: 'version',
        //         index: 50,
        //     }),
        // );

        this.menuList.push(close({
            name: 'close',
            index: 60,
        }));
        // this.add(
        //     close({
        //         name: 'close',
        //         index: 60,
        //     }),
        // );

        for (let index = 0; index < option.contextmenu.length; index++) {
            this.menuList.push(option.contextmenu[index]);
            // this.add(option.contextmenu[index]);
        }

        this.addList(this.menuList);

        proxy($player, 'contextmenu', (event) => {
            console.log("context",$contextmenu);
            event.preventDefault();

            if (!this.art.constructor.CONTEXTMENU) return;

            this.show = true;

            const mouseX = event.clientX;
            const mouseY = event.clientY;
            const { height: cHeight, width: cWidth, left: cLeft, top: cTop } = $player.getBoundingClientRect();
            const { height: mHeight, width: mWidth } = $contextmenu.getBoundingClientRect();
            let menuLeft = mouseX - cLeft;
            let menuTop = mouseY - cTop;

            if (mouseX + mWidth > cLeft + cWidth) {
                menuLeft = cWidth - mWidth;
            }

            if (mouseY + mHeight > cTop + cHeight) {
                menuTop = cHeight - mHeight;
            }

            setStyles($contextmenu, {
                top: `${menuTop}px`,
                left: `${menuLeft}px`,
            });
        });

        proxy($player, 'click', (event) => {
            if (!includeFromEvent(event, $contextmenu)) {
                this.art.emit('contextMenuHover',this.show)
                this.show = false;
            }
        });

        this.art.on('blur', () => {
            this.show = false;
        });
    }
}
