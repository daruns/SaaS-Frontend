<template>
<q-layout style="width: 550px !important;">
     <q-card style="max-width: 550px; min-height:100vh; min-height:100vh;" flat square>
     <q-toolbar class="bg-grey-3 header-height-standard" style="position:sticky !important; top:0;z-index:15;">
            <q-toolbar-title>
                {{action  + ' '}} Payment Method
            </q-toolbar-title>
            <q-btn icon="close" flat round dense v-close-popup />
    </q-toolbar>
    <q-card-section class="q-gutter-md scroll">
          <q-input :rules="[val => (val && val.length !== 0) || 'This field is required']" ref="nameRef" outlined v-model="paymentMethod.name" label="Name" />
            <q-editor             
      v-model="paymentMethod.description" :dense="true" :toolbar="[
      [
          {
            label: $q.lang.editor.align,
            icon: $q.iconSet.editor.align,
            fixedLabel: true,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify']
          },
        ],
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['token', 'hr', 'link', 'custom_btn'],
        ['print', 'fullscreen'],
        [
          {
            label: $q.lang.editor.formatting,
            icon: $q.iconSet.editor.formatting,
            list: 'no-icons',
            options: [
              'p',
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
              'code'
            ]
          },
          {
            label: $q.lang.editor.fontSize,
            icon: $q.iconSet.editor.fontSize,
            fixedLabel: true,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'size-1',
              'size-2',
              'size-3',
              'size-4',
              'size-5',
              'size-6',
              'size-7'
            ]
          },
          {
            label: $q.lang.editor.defaultFont,
            icon: $q.iconSet.editor.font,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'default_font',
              'arial',
              'arial_black',
              'comic_sans',
              'courier_new',
              'impact',
              'lucida_grande',
              'times_new_roman',
              'verdana'
            ]
          },
          'removeFormat'
        ],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

        ['undo', 'redo'],
      ]"
      :fonts="{
        arial: 'Arial',
        arial_black: 'Arial Black',
        comic_sans: 'Comic Sans MS',
        courier_new: 'Courier New',
        impact: 'Impact',
        lucida_grande: 'Lucida Grande',
        times_new_roman: 'Times New Roman',
        verdana: 'Verdana'
      }"
    />
            <div>
            <div class="q-ma-none absolute q-ml-sm text-grey-7" style="z-index:10;font-size:12px;line-height:20px;font-weight:400;">Due date</div>
            <Datepicker v-model="paymentMethod.expireDate" showNowButton></Datepicker>
            </div>
          <q-input :rules="[val => (val && val.length !== 0) || 'This field is required']" ref="pinRef" outlined v-model="paymentMethod.pin" label="PIN" />
          <q-input :rules="[val => (val && val.length !== 0) || 'This field is required']" ref="cvsRef" outlined v-model="paymentMethod.cvs" label="CVV" />         
    </q-card-section>
    </q-card>
          <q-toolbar class="bg-grey-3" style="position:sticky !important; bottom:0;z-index:5;">
            <q-btn :loading="loading" @click="submit" label="Submit" no-caps type="reset" color="primary" unelevated class="full-width" />
    </q-toolbar>
</q-layout>
</template>
<script>
import { mapActions } from 'vuex'
import { date } from 'quasar';
import Datepicker from 'vue3-date-time-picker';
import 'vue3-date-time-picker/dist/main.css'
export default {
  components: {
    Datepicker
  },
    props: ['body','action'],
    data() {
        return {
            loading: false,
            id: null,
            paymentMethod : {
                name: '',
                description: 'Description',
                expireDate: '',
                pin:'',
                cvs:''
            }
        }
    },
    methods: {
        ...mapActions('financeStore',['addPaymentMethod', 'updatePaymentMethod']),

       async submit() {
           this.$refs.nameRef.validate();
           this.$refs.pinRef.validate();
           this.$refs.cvsRef.validate();
           if(
               this.$refs.nameRef.hasError ||
               this.$refs.pinRef.hasError ||
               this.$refs.cvsRef.hasError
           )
           return

            this.paymentMethod.expireDate = date.formatDate(new Date(this.paymentMethod.expireDate), 'YYYY-MM-DD HH:mm');
            this.loading = true
            if(this.action === 'Add') {
               await this.addPaymentMethod({...this.paymentMethod})
            }else if(this.action === 'Edit'){
              await this.updatePaymentMethod({...this.paymentMethod, id: this.body.id});
            }
            this.loading = false
            this.$emit('closeDialogue')
        }
    },
    mounted() {
        if(this.action === 'Edit') {
                this.id = this.body.id,
                this.paymentMethod.name = this.body.name,
                this.paymentMethod.description = this.body.description;
                let edt = new Date(this.body.expireDate)
                edt.setHours(edt.getHours() - 3);
                this.paymentMethod.expireDate = date.formatDate(edt, 'YYYY-MM-DD HH:mm');
                this.paymentMethod.cvs = this.body.cvs
                this.paymentMethod.pin  = this.body.pin
                return
        }
        this.paymentMethod.expireDate = date.formatDate(new Date, 'YYYY-MM-DD HH:mm');
    }
}
</script>