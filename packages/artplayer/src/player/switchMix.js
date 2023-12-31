import { def } from '../utils';

export default function switchMix(art) {
    function switchUrl(url, currentTime) {
        return new Promise((resolve, reject) => {
            if (url === art.url) return;
            const { playing, aspectRatio, playbackRate } = art;
            art.pause();
            art.url = url;
            art.notice.show = '';

            art.on('video:error', reject);
            art.on('video:durationchange', async () =>{
                art.emit('autoPlaybackToggle');
            });
            art.on('video:canplay', async () => {
                if(currentTime !== 0){
                    art.playbackRate = playbackRate;
                    art.aspectRatio = aspectRatio;
                    art.currentTime = currentTime;
                    if (playing) {
                        await art.play();
                    }

                    art.notice.show = '';

                    resolve();
                }
            });
        });
    }

    def(art, 'switchQuality', {
        value: (url) => {
            return switchUrl(url, art.currentTime);
        },
    });

    def(art, 'switchUrl', {
        value: (url) => {
            return switchUrl(url, 0);
        },
    });

    def(art, 'switch', {
        set: art.switchUrl,
    });
}
