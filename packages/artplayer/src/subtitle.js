import {
    setStyle,
    setStyles,
    srtToVtt,
    vttToBlob,
    getExt,
    assToVtt,
    escape,
    remove,
    append,
    createElement,
} from './utils';
import Component from './utils/component';
import validator from 'option-validator';
import scheme from './scheme';

let customSubtitle = ['ass','lrc'];
export default class Subtitle extends Component {
    constructor(art) {
        super(art);
        this.name = 'subtitle';
        this.eventDestroy = () => null;
        this.init(art.option.subtitle);
        art.on('subtitleSwitch1',(switchChange,currentSubtitle,subtitleExt)=>{
            if(!switchChange){
                art.subtitle.url = 'http://127.0.0.1:15647/tmp/tmp.srt';
                art.option.subtitle.url = 'http://127.0.0.1:15647/tmp/tmp.srt';
                art.option.url = 'http://127.0.0.1:15647/tmp/tmp.srt';
                art.option.subtitle.type = 'srt';
                art.subtitle.type = 'srt';
            }else{
                console.log('vdgs',currentSubtitle,subtitleExt);
                art.subtitle.url = currentSubtitle?currentSubtitle:'http://127.0.0.1:15647/tmp/tmp.srt';
                art.option.subtitle.url =  currentSubtitle?currentSubtitle:'http://127.0.0.1:15647/tmp/tmp.srt';
                art.option.url = currentSubtitle?currentSubtitle:'http://127.0.0.1:15647/tmp/tmp.srt';
                art.option.subtitle.type = subtitleExt?subtitleExt:'srt';
                art.subtitle.type = subtitleExt?subtitleExt:'srt';
            }
        });

        let lastState = false;
        art.on('video:timeupdate', () => {
            if (!this.url) return;
                const state = this.art.template.$video.webkitDisplayingFullscreen;
                if (typeof state !== 'boolean') return;
                if (state !== lastState) {
                    lastState = state;
                    this.createTrack(state ? 'subtitles' : 'metadata', this.art.option.url);
                }
        });
    }

    get url() {
        return this.art.template.$track.src;
    }

    set url(url) {
        this.switch(url);
    }

    get textTrack() {
        return this.art.template.$video.textTracks[0];
    }

    get activeCue() {
        return this.textTrack.activeCues[0];
    }

    style(key, value) {
        const { $subtitle } = this.art.template;
            if (typeof key === 'object') {
                return setStyles($subtitle, key);
            }
            return setStyle($subtitle, key, value);
    }

    update() {
        const { $subtitle } = this.art.template;
        $subtitle.innerHTML = '';
            if (this.activeCue) {
                if (this.art.option.subtitle.escape) {
                    $subtitle.innerHTML = this.activeCue.text
                        .split(/\r?\n/)
                        .map((item) => `<p>${escape(item)}</p>`)
                        .join('');
                } else {
                    $subtitle.innerHTML = this.activeCue.text;
                }
                this.art.emit('subtitleUpdate', this.activeCue.text);
            }
    }

    async switch(url, newOption = {}) {
        const { i18n, notice, option } = this.art;
        const subtitleOption = { ...option.subtitle, ...newOption, url };
        const subUrl = await this.init(subtitleOption);
        if (newOption.name) {
            notice.show = `${i18n.get('Switch Subtitle')}: ${newOption.name}`;
        }
        return subUrl;
    }

    createTrack(kind, url) {
        const { template, proxy } = this.art;
        const { $video, $track, $Subtitle} = template;

        this.eventDestroy();
        if(customSubtitle.includes(this.art.option.subtitle.type) || customSubtitle.includes(this.art.subtitle.type)){
            this.art.emit('assChange',this.art.option.subtitle.type);
            return;
        }
        try{
            remove($track);
        }catch (e){
            console.log('removeTrackErr',e);
        }
        const $newTrack = createElement('track');
        $newTrack.default = true;
        $newTrack.kind = kind;
        $newTrack.src = url;
        $newTrack.track.mode = (navigator.userAgent.indexOf('Firefox')>-1)?'disabled':'hidden';
        if(this.art.option.subtitle.type === 'srt' || this.art.option.subtitle.type === 'vtt' || this.art.subtitle.type === 'srt'|| this.art.subtitle.type === 'vtt'){
            append($video, $newTrack);
            template.$track = $newTrack;
            this.eventDestroy = proxy(this.textTrack, 'cuechange', () => this.update());
        }
        try{
            $Subtitle.removeAttribute('style');
            this.style(this.art.option.subtitle.style);
        }catch (e){
            console.log(e);
        }

    }

    async init(subtitleOption) {

        const {
            notice,
            template: { $subtitle },
        } = this.art;

        validator(subtitleOption, scheme.subtitle);
        if (!subtitleOption.url) return;
        $subtitle.removeAttribute('style');
        this.style(this.art.option.subtitle.style);

        return fetch(subtitleOption.url)
            .then((response) => response.arrayBuffer())
            .then((buffer) => {
                const decoder = new TextDecoder(subtitleOption.encoding);
                const text = decoder.decode(buffer);
                this.art.emit('subtitleLoad', subtitleOption.url);
                switch ((this.art.option.subtitle.type || this.art.subtitle.type) || getExt(subtitleOption.url)) {
                    case 'srt': {
                        const vtt = srtToVtt(text);
                        const vttNew = subtitleOption.onVttLoad(vtt);
                        return vttToBlob(vttNew);
                    }
                    case 'ass':{
                        return 'xxx';
                    }
                    // case 'lrc':{
                    //     return 'xxx';
                    //     // const vtt = assToVtt(text);
                    //     // const vttNew = subtitleOption.onVttLoad(vtt);
                    //     // return vttToBlob(vttNew);
                    // }
                    case 'vtt': {
                        const vttNew = subtitleOption.onVttLoad(text);
                        return vttToBlob(vttNew);
                    }
                    default:
                        return subtitleOption.url;
                }
            })
            .then((subUrl) => {
                $subtitle.innerHTML = '';
                if ((this.art.option.subtitle.url === subUrl) || (this.art.subtitle.url === subUrl)) return subUrl;
                URL.revokeObjectURL(this.url);
                try{
                    this.createTrack('metadata', (this.art.option.subtitle.type === 'srt' ||this.art.option.subtitle.type === 'vtt')?subUrl:this.art.option.subtitle.url);
                }catch (e){
                    console.log('createTrackErr',e);
                }
                this.art.emit('subtitleSwitch', this.art.option.subtitle.url);
                return this.art.option.subtitle.url;
            })
            .catch((err) => {
                $subtitle.innerHTML = '';
                this.eventDestroy();
                notice.show = err;
                throw err;
            });
    }
}
