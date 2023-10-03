import { queryAll, isMobile } from './utils';
import Component from './utils/component';

export default class Info extends Component {
    constructor(art) {
        super(art);
        this.name = 'info';

        if (!isMobile) {
            this.init();
        }
    }

    init() {
        const {
            proxy,
            constructor,
            template: { $infoPanel, $infoClose, $video },
        } = this.art;

        proxy($infoClose, 'click', () => {
            this.show = false;
        });

        let timer = null;
        const $types = queryAll('[data-video]', $infoPanel) || [];
        this.art.on('destroy', () => clearTimeout(timer));

        function VideoinfoHandler(property){
            if(property === 'src' && window.urlcode.urldecode){
                return window.urlcode.urldecode($video['src']);
            }
            return $video[property];
        }

        function loop() {
            for (let index = 0; index < $types.length; index++) {
                const item = $types[index];
                const value = VideoinfoHandler(item.dataset.video);
                const innerText = typeof value === 'number' ? value.toFixed(2) : value;
                if (item.innerText !== innerText) {
                    item.innerText = innerText;
                }
            }
            timer = setTimeout(loop, constructor.INFO_LOOP_TIME);
        }

        loop();
    }
}
