const methodMap = [
    [
        'requestFullscreen',
        'exitFullscreen',
        'fullscreenElement',
        'fullscreenEnabled',
        'fullscreenchange',
        'fullscreenerror',
    ],
    // New WebKit
    [
        'webkitRequestFullscreen',
        'webkitExitFullscreen',
        'webkitFullscreenElement',
        'webkitFullscreenEnabled',
        'webkitfullscreenchange',
        'webkitfullscreenerror',
    ],
    // Old WebKit
    [
        'webkitRequestFullScreen',
        'webkitCancelFullScreen',
        'webkitCurrentFullScreenElement',
        'webkitCancelFullScreen',
        'webkitfullscreenchange',
        'webkitfullscreenerror',
    ],
    [
        'mozRequestFullScreen',
        'mozCancelFullScreen',
        'mozFullScreenElement',
        'mozFullScreenEnabled',
        'mozfullscreenchange',
        'mozfullscreenerror',
    ],
    [
        'msRequestFullscreen',
        'msExitFullscreen',
        'msFullscreenElement',
        'msFullscreenEnabled',
        'MSFullscreenChange',
        'MSFullscreenError',
    ],
];

let returnPromise;

var FullScreenMode = {
    F11Enter:0b0001,
    ButtonEnter:0b0010,
    EscExit:0b0100,
    ButtonExit:0b1000
}

var CurrentMode = {
    Enter:0,
    Exit:0,
}

// function changeCurrentModeEnter(enterMode){
//     CurrentMode.Enter = enterMode;
// }
//
// function changeCurrentModeExit(exitMode){
//     CurrentMode.Exit = exitMode;
// }

function isExitModeExist(){
    return CurrentMode;
}

const nativeAPI = (() => {
    if (typeof document === 'undefined') {
        return false;
    }

    const unprefixedMethods = methodMap[0];
    const returnValue = {};

    for (const methodList of methodMap) {
        const exitFullscreenMethod = methodList[1];
        if (exitFullscreenMethod in document) {
            for (const [index, method] of methodList.entries()) {
                returnValue[unprefixedMethods[index]] = method;
            }

            return returnValue;
        }
    }

    return false;
})();

const eventNameMap = {
    change: nativeAPI.fullscreenchange,
    error: nativeAPI.fullscreenerror,
};

let screenfull = {
    request(element = document.documentElement, options, EnterMode,rejectCallback) {
        // changeCurrentModeEnter(EnterMode);
        return new Promise((resolve, reject) => {
            const onFullScreenEntered = () => {
                screenfull.off('change', onFullScreenEntered);
                resolve();
            };

            screenfull.on('change', onFullScreenEntered);
            rejectCallback();

            // switch (EnterMode) {
            //     case FullScreenMode.ButtonEnter:
            //         returnPromise = element[nativeAPI.requestFullscreen](options);
            //         if (returnPromise instanceof Promise) {
            //             returnPromise.then(onFullScreenEntered).catch((reject)=>{
            //                 if(typeof(rejectCallback) === 'function'){
            //                     // onFullScreenEntered()
            //                     // changeerrorIsFullScreen(true)
            //                     // // changeerrorIsFullScreen(true)
            //                     // // changeerrorIsFullScreenMode("notDisplay")
            //                     // rejectCallback(reject);
            //                 }
            //             });
            //         }
            //         break;
            //     case FullScreenMode.F11Enter:
            //         rejectCallback();
            //         break;
            // }
        });
    },
    exit(rejectCallback,ExitMode) {
        // changeCurrentModeExit(ExitMode);
        return new Promise((resolve, reject) => {
            console.log("screenExitFull:",ExitMode);
            if (ExitMode !== FullScreenMode.EscExit && ExitMode !== FullScreenMode.ButtonExit) {
                resolve();
                return;
            }

            const onFullScreenExit = () => {
                screenfull.off('change', onFullScreenExit);
                resolve();
            };

            screenfull.on('change', onFullScreenExit);

            rejectCallback();

            // switch (ExitMode) {
            //     case FullScreenMode.ButtonExit:
            //         if(CurrentMode.Enter === FullScreenMode.F11Enter){
            //             rejectCallback();
            //             return;
            //         }
            //         returnPromise = document[nativeAPI.exitFullscreen]();
            //         console.log("isPromise",returnPromise instanceof Promise);
            //
            //         if (returnPromise instanceof Promise) {
            //             returnPromise.then(onFullScreenExit).catch((reject)=>{
            //                 if(typeof(rejectCallback) === 'function'){
            //                     // onFullScreenExit()
            //                     // changeerrorIsFullScreen(false);
            //                     // changeerrorIsFullScreenMode("");
            //                     // rejectCallback(reject);
            //                 }
            //             });
            //         }
            //         break;
            //     case FullScreenMode.EscExit:
            //         rejectCallback();
            //         break
            // };
            // changeCurrentMode(0,0);
        });
    },
    toggle(element, options) {
        return screenfull.isFullscreen ? screenfull.exit() : screenfull.request(element, options);
    },
    onchange(callback) {
        screenfull.on('change', callback);
    },
    onerror(callback) {
        screenfull.on('error', callback);
    },
    on(event, callback) {
        const eventName = eventNameMap[event];
        if (eventName) {
            document.addEventListener(eventName, callback, false);
        }
    },
    off(event, callback) {
        const eventName = eventNameMap[event];
        if (eventName) {
            document.removeEventListener(eventName, callback, false);
        }
    },
    raw: nativeAPI,
    changeCurrentModeEnter(enterMode){
        Object.assign(CurrentMode,{'Enter': enterMode})
    },
    changeCurrentModeExit(exitMode){
        Object.assign(CurrentMode,{'Exit': exitMode})
    },
    changeCurrentMode(enterMode,exitMode){
        Object.assign(CurrentMode,{'Enter':enterMode,'Exit': exitMode})
    },
    getCurrentMode(){
      return CurrentMode;
    },
};

Object.defineProperties(screenfull, {
    isFullscreen: {
        get: () => Boolean(document[nativeAPI.fullscreenElement]),
    },
    element: {
        enumerable: true,
        get: () => document[nativeAPI.fullscreenElement],
    },
    isEnabled: {
        enumerable: true,
        get: () => Boolean(document[nativeAPI.fullscreenEnabled]),
    },
    isExitModeExist: {
        get: () => isExitModeExist(),
    },
    // changeCurrentModeEnter: {
    //     get: (enter) => changeCurrentModeEnter(enter),
    // },
    // changeCurrentModeExit: {
    //     get: (exit) => changeCurrentModeExit(exit),
    // }

});

if (!nativeAPI) {
    screenfull = { isEnabled: false };
}

export default screenfull;
