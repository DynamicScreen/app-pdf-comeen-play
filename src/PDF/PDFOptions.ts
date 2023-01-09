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

    const legacyDefaultType = update.option("remoteFiles").modelValue ? "google" : "media"
    const filetype = ref(update.option("type").modelValue || legacyDefaultType);
    const account = ref(null)

    const updateMediaId = (value: number | number[]) => {
      value = Array.isArray(value) ? value : [value]
      if (filetype.value === "media") {
        update.option("media")["onUpdate:modelValue"](value)
        update.option("remoteFiles")["onUpdate:modelValue"](null);
        update.option("type")["onUpdate:modelValue"]("media");
        update.option("__accounts")["onUpdate:modelValue"]([]);
      } else {
        update.option("remoteFiles")["onUpdate:modelValue"](value);
        update.option("media")["onUpdate:modelValue"](null)
        update.option("type")["onUpdate:modelValue"](filetype.value);
        update.option("__accounts")["onUpdate:modelValue"]([account.value]);
      }
    }

    const modelValue = computed(() => {
      return update.option(fileType.value == "media" ? 'media' : 'remoteFiles').modelValue
    })

    let hybrid_options = computed(() => {
      let options: any = {
        type: 'pdfs',
        account_id: account.value,
        'onUpdate:account_id': (val) => account.value = val,
        filetype: fileType.value,
        'onUpdate:filetype': (value) => fileType.value = value,
        modelValue: modelValue.value,
        'onUpdate:modelValue': (value) => updateMediaId(value),
      }
      if (fileType.value == 'media') {
        options = { ...options, onSelectedMedias: (medias: Array<any>) => {
          context.updateAutoName(medias[0]?.filename)
        } }
      } else {
        options = {
          ...options,
          noAccountsSelect: true,
          onSelectedMedias: (medias: Array<any>) => {
            context.updateAutoName(medias[0]?.filename)
          }
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
