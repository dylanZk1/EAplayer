import { mergeDeep } from '../utils';
import zhCn from './zh-cn.json';
import zhTw from './zh-tw.json';
import pl from './pl.json';
import cs from './cs.json';
import es from './es.json';
import fa from './fa.json';
import fr from './fr.json';
import id from './id.json';
import ru from './ru.json';

export default class I18n {
    constructor(art) {
        this.art = art;

        this.languages = {
            'zh-cn': zhCn, //中文简体
            'zh-tw': zhTw, //中文繁体
            pl: pl, //波兰语
            cs: cs, //捷克语
            es: es, //西语
            fa: fa, //波斯语
            fr: fr, //法语
            id: id, //印尼语
            ru: ru, //俄语
        };

        this.update(art.option.i18n);
    }

    init() {
        const lang = this.art.option.lang.toLowerCase();
        this.language = this.languages[lang] || {};
    }

    get(key) {
        return this.language[key] || key;
    }

    update(value) {
        this.languages = mergeDeep(this.languages, value);
        this.init();
    }
}
