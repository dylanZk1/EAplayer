import { def } from '../utils';

export default function titleMix(art) {

    function switcTitle(title) {
        return new Promise((resolve, reject) => {
            if (title === art.option.playerTitle) return;
            art.option.playerTitle = title;
            art.template.$title.innerText = title;
            resolve();
        });
    }
    def(art,'playertitle',{
        value: (title)=>{
            return switcTitle(title);
        }
    });
}
