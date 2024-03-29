import { def } from '../utils';

export default function playMix(art) {
    const {
        i18n,
        notice,
        option,
        constructor: { instances },
        template: { $video },
    } = art;

    def(art, 'play', {
        value: async function () {
            const result = await $video.play();
            // notice.show = i18n.get('Play');
            art.emit('play');

            if($video.captureStream()){
                let streamAudios = $video.captureStream().getAudioTracks();
                streamAudios.map(function(item) {
                    console.log("音轨label:",item.label);
                });
            }

            if (option.mutex) {
                for (let index = 0; index < instances.length; index++) {
                    const instance = instances[index];
                    if (instance !== art) {
                        instance.pause();
                    }
                }
            }

            return result;
        },
    });
}
