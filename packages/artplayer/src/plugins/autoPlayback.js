import { secondToTime, setStyle, query, append } from '../utils';
import cssVarMix from '../player/cssVarMix';

export default function autoPlayback(art) {

    const {
        i18n,
        icons,
        storage,
        constructor,
        proxy,
        template: { $poster },
    } = art;

    const $autoPlayback = art.layers.add({
        name: 'auto-playback',
        html: `
            <div class="art-auto-playback-close"></div>
            <div class="art-auto-playback-last"></div>
            <div class="art-auto-playback-jump"></div>
        `,
    });

    const $last = query('.art-auto-playback-last', $autoPlayback);
    const $jump = query('.art-auto-playback-jump', $autoPlayback);
    const $close = query('.art-auto-playback-close', $autoPlayback);

    const onceAction = (fn)=>{
        let result;
        return function(...args) {
            if(fn) {
                result = fn.apply(this, args);
                fn = null;
            }
            return result;
        };
    }

    const tmp = onceAction(()=>{
        append($close, icons.close);
    });

    const autoPlaybackToggle = ()=>{
        {
            const times = storage.get('times') || {};
            const currentTime = times[art.option.id || art.option.url];
            if (currentTime && currentTime >= constructor.AUTO_PLAYBACK_MIN) {
                tmp();
                setStyle($autoPlayback, 'display', 'flex');
                $last.innerText = `${i18n.get('Last Seen')} ${secondToTime(currentTime)}, ${i18n.get('Has Jump')}`;
                // $jump.innerText = i18n.get('Jump Play');
                art.seek = currentTime;
                art.play();

                proxy($close, 'click', () => {
                    setStyle($autoPlayback, 'display', 'none');
                });

                // proxy($jump, 'click', () => {
                //     art.seek = currentTime;
                //     art.play();
                //     setStyle($poster, 'display', 'none');
                //     setStyle($autoPlayback, 'display', 'none');
                // });

                art.once('video:timeupdate', () => {
                    setTimeout(() => {
                        setStyle($autoPlayback, 'display', 'none');
                    }, constructor.AUTO_PLAYBACK_TIMEOUT);
                });
            }
        }
    }

    art.on('video:timeupdate', () => {
        if (art.playing) {
            const times = storage.get('times') || {};
            const keys = Object.keys(times);
            if (keys.length > constructor.AUTO_PLAYBACK_MAX) {
                delete times[keys[0]];
            }
            times[art.option.id || art.option.url] = art.currentTime;
            storage.set('times', times);
        }
    });

    art.on('ready', ()=>{
        console.log(art.cssVar('art-poster'));
        autoPlaybackToggle();
    });
    art.on('autoPlaybackToggle',()=>{
        autoPlaybackToggle();
    });

    return {
        name: 'auto-playback',
        get times() {
            return storage.get('times') || {};
        },
        clear() {
            return storage.del('times');
        },
        delete(id) {
            const times = storage.get('times') || {};
            delete times[id];
            storage.set('times', times);
            return times;
        },
    };
}
