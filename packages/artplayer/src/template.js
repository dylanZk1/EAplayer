import { errorHandle, query, addClass, replaceElement, isMobile } from './utils';

export default class Template {
    constructor(art) {
        this.art = art;
        const { option, constructor } = art;

        if (option.container instanceof Element) {
            this.$container = option.container;
        } else {
            this.$container = query(option.container);
            errorHandle(this.$container, `No container element found by ${option.container}`);
        }

        const type = this.$container.tagName.toLowerCase();
        errorHandle(type === 'div', `Unsupported container element type, only support 'div' but got '${type}'`);

        errorHandle(
            constructor.instances.every((ins) => ins.template.$container !== this.$container),
            'Cannot mount multiple instances on the same dom element',
        );

        this.query = this.query.bind(this);
        this.$container.dataset.artId = art.id;
        this.$original = this.$container.cloneNode(true);

        this.init();
    }

    static get html() {
        return `
          <div class="art-video-player art-subtitle-show art-layer-show art-control-show art-mask-show" id='EAPlayer'>
            <video class="art-video" id='artplayerVideo' preload='auto'>
              <track default kind="metadata" src=""></track>
            </video>
            <div class="art-poster" data-html2canvas-ignore="true"></div>
            <div class='art-header' data-html2canvas-ignore="true">
                <div class='art-title'></div>
            </div>
            <div class="art-subtitle" id="art-subtitle"></div>
            <div class="art-danmuku" data-html2canvas-ignore="true"></div>
            <div class="art-layers" data-html2canvas-ignore="true"></div>
            <div class="art-mask" data-html2canvas-ignore="true">
              <div class="art-state"></div>
            </div>
            <div class="art-bottom" data-html2canvas-ignore="true">
              <div class="art-progress"></div>
              <div class="art-controls">
                <div class="art-controls-left"></div>
                <div class="art-controls-center"></div>
                <div class="art-controls-right"></div>
              </div>
            </div>
            <div class="art-loading" data-html2canvas-ignore="true"></div>
            <div class="art-notice" data-html2canvas-ignore="true">
              <div class="art-notice-inner"></div>
            </div>
            <div class="art-settings" data-html2canvas-ignore="true"></div>
            <div class="art-info" data-html2canvas-ignore="true">
              <div class="art-info-panel">
                <div class="art-info-item">
                  <div class="art-info-title">EAPlayer 版本：</div>
                  <div class="art-info-content">${process.env.APP_VER}</div>
                </div>
                <div class="art-info-item">
                  <div class="art-info-title">视频路径：</div>
                  <div class="art-info-content" data-video="src"></div>
                </div>
                <div class="art-info-item">
                  <div class="art-info-title">音量：</div>
                  <div class="art-info-content" data-video="volume"></div>
                </div>
                <div class="art-info-item">
                  <div class="art-info-title">当前时刻：</div>
                  <div class="art-info-content" data-video="currentTime"></div>
                </div>
                <div class="art-info-item">
                  <div class="art-info-title">时长：</div>
                  <div class="art-info-content" data-video="duration"></div>
                </div>
                <div class="art-info-item">
                  <div class="art-info-title">分辨率：</div>
                  <div class="art-info-content">
                    <span data-video="videoWidth"></span> x <span data-video="videoHeight"></span>
                  </div>
                </div>
              </div>
              <div class="art-info-close">[x]</div>
            </div>
            <div class="art-contextmenus" data-html2canvas-ignore="true"></div>
          </div>
        `;
    }

    query(className) {
        return query(className, this.$container);
    }

    init() {
        const { option,i18n } = this.art;

        if (!option.useSSR) {
            this.$container.innerHTML = Template.html;
        }

        this.$player = this.query('.art-video-player');
        this.$header = this.query('.art-header');
        this.$title = this.query('.art-title');
        this.$video = this.query('.art-video');
        this.$track = this.query('track');
        this.$poster = this.query('.art-poster');
        this.$subtitle = this.query('.art-subtitle');
        this.$danmuku = this.query('.art-danmuku');
        this.$bottom = this.query('.art-bottom');
        this.$progress = this.query('.art-progress');
        this.$controls = this.query('.art-controls');
        this.$controlsLeft = this.query('.art-controls-left');
        this.$controlsCenter = this.query('.art-controls-center');
        this.$controlsRight = this.query('.art-controls-right');
        this.$layer = this.query('.art-layers');
        this.$loading = this.query('.art-loading');
        this.$notice = this.query('.art-notice');
        this.$noticeInner = this.query('.art-notice-inner');
        this.$mask = this.query('.art-mask');
        this.$state = this.query('.art-state');
        this.$setting = this.query('.art-settings');
        this.$info = this.query('.art-info');
        this.$infoPanel = this.query('.art-info-panel');
        this.$infoClose = this.query('.art-info-close');
        this.$contextmenu = this.query('.art-contextmenus');

        if (option.backdrop) {
            addClass(this.$player, 'art-backdrop');
        }

        if (isMobile) {
            addClass(this.$player, 'art-mobile');
        }
    }

    destroy(removeHtml) {
        if (removeHtml) {
            replaceElement(this.$original, this.$container);
        } else {
            addClass(this.$player, 'art-destroy');
        }
    }
}
