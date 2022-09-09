import {
  ISlideOptionsContext,
  SlideOptionsModule, VueInstance
} from "@comeen/comeen-play-sdk-js";

export default class PDFOptionsModule extends SlideOptionsModule {
  constructor(context: ISlideOptionsContext) {
    super(context);
  }

  async onReady() {
    return true;
  };

  setup(props: Record<string, any>, vue: VueInstance, context: ISlideOptionsContext) {
    //@ts-ignore
    const { h, ref, computed, toRef } = vue;

    const update = context.update;

    const { Field, TextInput, Toggle, HybridPicker } = this.context.components

    const fileType = ref("media")

    if (props.modelValue?.remoteFiles) {
      fileType.value = 'google'
    }

    let hybrid_options = computed(() => {
      let options: any = { type: 'pdfs', filetype: fileType.value, 'onUpdate:filetype': (value) => fileType.value = value }
      if (fileType.value == 'media') {
        options = { ...options, ...update.option('media') }
      } else {
        options = {
          ...options,
          ...update.option('remoteFiles'),
          noAccountsSelect: true
        }
      }
      return options;
    })

    return () =>
      h("div", {}, [
        h(Field, { label: this.t('modules.pdf.options.picker.label') }, [
          h(HybridPicker, hybrid_options.value)
        ]),
      ]
    )
  }
}
