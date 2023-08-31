import Component from '../utils/component';
import { addClass, removeClass } from '../utils';
import titleMix from './titleMix';

export default class Title extends Component {
    constructor(art) {
        super(art);
        this.name = 'title';
        const {
            proxy,
            constructor,
            template: { $player, $title,$header, $video},
        } = this.art;

        let activeTime = Date.now();

        proxy($header, 'click',(e)=>{
            console.log("isclickHeader",e.target !== $header);
            if(e.target === $header){
                e.preventDefault();
                $video.click();
            }
        })

        proxy($title, 'click', (e) => {
            // e.preventDefault();
            // this.show = true;
            console.log("titleClick");
            // removeClass($player, 'art-hide-cursor');
            // addClass($player, 'art-hover');
            // activeTime = Date.now();
        });

        // art.on('video:timeupdate', () => {
        //     if (!art.isInput && art.playing && this.show && Date.now() - activeTime >= constructor.CONTROL_HIDE_TIME) {
        //         this.show = false;
        //         addClass($player, 'art-hide-cursor');
        //         removeClass($player, 'art-hover');
        //     }
        // });

        this.init(art);
    }

    init(art){
        titleMix(art);
    }
}
