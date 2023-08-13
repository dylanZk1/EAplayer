import { secondToTime, isMobile, debounce} from '../utils';

export default function time(option) {
    return (art) => ({
        ...option,
        style: isMobile
            ? {
                  fontSize: '12px',
                  padding: '0 5px',
              }
            : {
                  cursor: 'auto',
                  padding: '0 10px',
              },
        mounted: ($control) => {
            async function getTime() {
                const newTime = `${secondToTime(art.currentTime)} / ${secondToTime(art.duration)}`;
                if (newTime !== $control.innerText) {
                    $control.innerText = newTime;
                    const timepercentage = (art.currentTime)/(art.duration);
                    let change = debounce(async (percentage) => {
                        await changeTaskProgress(percentage);
                    },500);
                    await change(timepercentage>=0.01?timepercentage:0.01);
                }
            }

            async function changeTaskProgress(percentage){
                art.emit('changeTaskProgress',percentage);
            }

            getTime();

            const events = ['video:loadedmetadata', 'video:timeupdate', 'video:progress'];
            for (let index = 0; index < events.length; index++) {
                art.on(events[index], getTime);
            }
        },
    });
}
