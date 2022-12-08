import {
  ISlideContext,
  IPublicSlide,
  SlideModule,
  VueInstance,
  IAssetsStorageAbility,
  IAssetDownload
} from "@comeen/comeen-play-sdk-js";

import { nextTick } from 'vue';

export default class PDFSlideModule extends SlideModule {
  constructor(context: ISlideContext) {
    super(context);
  }

  async onReady() {
    await this.context.assetsStorage().then(async (ability: IAssetsStorageAbility) => {
      await ability.getOrDownload(this.context.slide.data.url, { callback: (assetDownload: IAssetDownload) => {
          assetDownload.onProgress.subscribe((progress, ev) => {
            ev.unsub();
          });
          assetDownload.onCompleted.subscribe((asset, ev) => {
            ev.unsub();
          });
        }, noRetry: false });
      });

    return true;
  };

  setup(props: Record<string, any>, vue: VueInstance, context: ISlideContext) {
    const { h, reactive, ref } = vue;

    const slide = reactive(props.slide) as IPublicSlide;
    this.context = reactive(props.slide.context);

    const url = ref(slide.data.url);

    this.context.onPrepare(() => {
      return new Promise(async (resolve, reject) => {
        await this.context.assetsStorage().then(async (ability: IAssetsStorageAbility) => {
          url.value = await ability.getOrDownload(slide.data.url).then((asset) => {
            return asset.displayableUrl();
          })
        });
        resolve()
      })
    });

    this.context.onReplay(async () => {
    });

    this.context.onPlay(async () => {
    });

    this.context.onPause(async () => {
    });
    this.context.onResume(async () => {
    });

    this.context.onEnded(() => {
      return this.context.assetsStorage().then(async (ability: IAssetsStorageAbility) => {
        ability.revokeURL(url.value)
      })
    });

    return () => h("div", {
      class: "container"
    }, [
      h("div", {}, [
        h("div", {
          class: "slide-content center vertical-center-wrapper flex-column"
        }, [
          h("div", {
            class: "image-container bg-contain bg-no-repeat bg-center",
            style: [
              { backgroundImage: "url(" + url.value + ")" },
              {width: '100%'}, {height: '100%'},
              {position: 'absolute'},
              {top: 0},
              {left: 0},
            ]
          }),
          h("div", {
            style: [
              {width: '100%'}, {height: '100%'},
              {position: 'absolute'},
              {textOverflow: 100},
              {overflow: 100},
            ]
          }),
        ]),
      ]),
    ])
  }
}
