import Component from '../utils/component';
import { addClass } from '../utils';
import titleMix from './titleMix';

export default class Title extends Component {
    constructor(art) {
        super(art);
        this.name = 'header';
        const {
            proxy,
            template: { $title,$header, $video},
        } = this.art;

        // let activeTime = Date.now();

        proxy($header, 'click',(e)=>{
            if(e.target === $header){
                e.preventDefault();
                $video.click();
            }
        });

        proxy($title, 'click', (e) => {
            console.log(e);
            console.log("titleClick");
        });

        proxy($title,'contextmenu',(e)=>{
            e.preventDefault();
        })

        addClass($header, 'art-header');
        addClass($title,'art-title');

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
