import Component from '../utils/component';
import { addClass, removeClass } from '../utils';
import titleMix from './titleMix';

export default class Title extends Component {
    constructor(art) {
        super(art);
        this.name = 'title';
        titleMix(art);
        const {
            proxy,
            constructor,
            template: { $player},
        } = art;

        let activeTime = Date.now();

        proxy($player, ['click', 'mousemove', 'touchstart', 'touchmove'], () => {
            this.show = true;
            removeClass($player, 'art-hide-cursor');
            addClass($player, 'art-hover');
            activeTime = Date.now();
        });

        art.on('video:timeupdate', () => {
            if (!art.isInput && art.playing && this.show && Date.now() - activeTime >= constructor.CONTROL_HIDE_TIME) {
                this.show = false;
                addClass($player, 'art-hide-cursor');
                removeClass($player, 'art-hover');
            }
        });
    }
}
