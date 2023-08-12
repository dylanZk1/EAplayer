import screenfull from '../libs/screenfull';
import { addClass, removeClass, def, get } from '../utils';

// eslint-disable-next-line no-unused-vars
var EnterMode = {
    mode:0
}

var ExitMode = {
    mode:0
}
function debounce(fn,duration=100){
    let timeID;
    return function(...args){
        clearTimeout(timeID);
        timeID = setTimeout(()=>{
            fn.apply(this,args)
        },duration);
    }
}
export default function fullscreenMix(art) {
    const {
        i18n,
        notice,
        template: { $video, $player },
    } = art;

    art.on('enterMode',(mode)=>{
        if(mode!==0){
            EnterMode.mode = mode
        }
    })

    art.on('exitMode',(mode)=>{
        if(mode!==0){
            ExitMode.mode = mode;
        }
    })

    const nativeScreenfull = (art) => {

        screenfull.on('change', () => {
            console.log("emitChange",screenfull.isFullscreen);
            console.log("ExitCode",ExitMode.mode)
            art.emit('fullscreen', (ExitMode.mode === 0));
        });
        def(art, 'fullscreen', {
            get() {
                return screenfull.isFullscreen ;
            },
            async set(value) {
                let emitE = (order,callback)=>{
                    EnterMode.mode = 0;
                    ExitMode.mode = 0;
                    art.emit(order,callback)
                };

                const newEmitE = debounce(emitE);
                console.log('Mode',EnterMode.mode,ExitMode.mode);

                if (EnterMode.mode !== 0 && ExitMode.mode === 0) {
                    console.log("screenFullAdjustY",value)
                    art.state = 'fullscreen';
                    addClass($player, 'art-fullscreen');
                    await screenfull.request($player,[],EnterMode.mode,(callback)=>{
                        console.log('complare',screenfull.isExitModeExist)
                        newEmitE("ElectronFull",callback);
                    });
                } else if(EnterMode.mode !== 0 && ExitMode.mode !== 0){
                    // screenfull.changeCurrentModeEnter(EnterMode.mode);
                    // screenfull.changeCurrentModeExit(ExitMode.mode);
                    console.log("screenFullAdjustN",value);
                    // art.emit("ElectronFull",false)
                    removeClass($player, 'art-fullscreen');
                    await screenfull.exit((reject)=>{
                        console.log('complare',screenfull.isExitModeExist);
                        art.emit('clearMode')
                        newEmitE("ElectronExitFull",reject);
                    },ExitMode.mode);
                }
                art.emit('resize');
            },
        });
    };

    const webkitScreenfull = (art) => {
        console.log("webkitFullChange")
        def(art, 'fullscreen', {
            get() {
                return $video.webkitDisplayingFullscreen;
            },
            set(value) {
                if (value) {
                    art.state = 'fullscreen';
                    $video.webkitEnterFullscreen();
                    art.emit('fullscreen', true);
                } else {
                    $video.webkitExitFullscreen();
                    art.emit('fullscreen', false);
                }
                art.emit('resize');
            },
        });
    };

    art.once('video:loadedmetadata', () => {
        if (screenfull.isEnabled) {
            nativeScreenfull(art);
        } else if (document.fullscreenEnabled || $video.webkitSupportsFullscreen) {
            webkitScreenfull(art);
        } else {
            def(art, 'fullscreen', {
                get() {
                    return false;
                },
                set() {
                    notice.show = i18n.get('Fullscreen Not Supported');
                },
            });
        }

        // Asynchronous setting
        def(art, 'fullscreen', get(art, 'fullscreen'));
    });
}
