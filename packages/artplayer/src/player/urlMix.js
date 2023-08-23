import { def, getExt, sleep } from '../utils';
import fetchAPI from '../utils/fetch';

export default function urlMix(art) {
    const {
        option,
        template: { $video },
    } = art;

    def(art, 'url', {
        get() {
            return $video.src;
        },
        async set(newUrl) {
            if (newUrl) {
                art.option.initurl = newUrl;
                console.log("newUrl");
                const oldUrl = art.url;
                const typeName = option.type || getExt(newUrl);
                const typeCallback = option.customType[typeName];

                if (typeName && typeCallback) {
                    console.log("typeName && typeCallback");
                    await sleep();
                    art.loading.show = true;
                    typeCallback.call(art, $video, newUrl, art);
                } else {
                    console.log("!typeName && typeCallback");
                    URL.revokeObjectURL(oldUrl);
                    await sleep();
                    art.loading.show = true;
                    if(newUrl.startsWith('file://')){
                        $video.src = newUrl;
                        // await fetchAPI(newUrl,(blob)=>{
                        //     $video.src = URL.createObjectURL(blob);
                        // },(err)=>{
                        //     console.log(err);
                        //     $video.src = newUrl;
                        // });
                    }else{
                        $video.src = newUrl;
                    }
                }

                if (oldUrl !== art.url) {
                    console.log("oldUrl !== art.url");
                    art.option.url = newUrl;
                    if (art.isReady && oldUrl) {
                        art.on('video:canplay', () => {
                            console.log('reStart',newUrl);
                            art.emit('restart', newUrl);
                        });
                    }
                }
            } else {
                console.log("!newurl");
                await sleep();
                art.loading.show = true;
            }
        },
    });
}
