<template>
<q-layout style="width: 550px !important;">
     <q-card style="max-width: 550px; min-height:100vh;" flat square>
     <q-toolbar class="bg-grey-3" style="position:sticky !important; top:0;z-index:15;">
            <q-toolbar-title>
                {{actionType  + ' '}}Tax
            </q-toolbar-title>
            <q-btn icon="close" flat round dense v-close-popup />
    </q-toolbar>
    <q-card-section class="q-gutter-md scroll">
         <q-input
            ref="nameRef"
            outlined
            v-model="tax.name"
            label="Name"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please write the name']"
            />
               <q-editor             
      v-model="tax.description" :dense="$q.screen.lt.md" :toolbar="[
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
         <q-input
            ref="typeRef"
            outlined
            v-model="tax.type"
            label="Type"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please write the type']"
            />
        <q-input
           ref="rateRef"
          :rules="[ val => (Number(val) <= 100 && Number(val) > 0) || 'Not less than 1']"
           bg-color="white"
           class="col-lg-3 col-md-4 col-sm-6 col-xs-12" 
           mask="#"
           fill-mask="0"
           reverse-fill-mask
           model-value="Number"
           outlined v-model="tax.rate" 
           label="Rate%" 
           />

    </q-card-section>
    </q-card>
          <div class="absolute-bottom q-pa-sm" style="z-index:5;">
            <q-btn :loading="loading" @click="submit" label="Submit" no-caps type="reset" color="primary" unelevated class="full-width" />
          </div>
</q-layout>
</template>
<script>
import axios from 'axios';
export default {
    props: ['actionType', 'body'],
   data()  { 
   return {
     tax: {
         name: '',
         description: 'Description',
         rate: null,
         type: ''
     },
     loading: false,
    }
  },
  methods : {
    async submit() {
            this.$refs.nameRef.validate();
            this.$refs.typeRef.validate();
            this.$refs.rateRef.validate();
            if(
            this.$refs.nameRef.hasError ||
            this.$refs.typeRef.hasError ||
            this.$refs.rateRef.hasError
            )
            return
     this.loading = true
     if(this.actionType === 'Add') {
        await this.create()
      }else{
        await this.update()
      }
      this.loading = false
      this.$emit('closeDialogue')

    },
    async create() {
      let tax = this.tax
      tax.rate = Number(tax.rate) / 100
      let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/taxes/create', 
      tax, 
      {headers: {Authorization: localStorage.getItem('accessToken')}})
      this.loading = false
          this.$q.notify({
              type: 'positive',
              message: 'Tax created',
              color: 'positive',
              position: 'top',
              timeout: '500'
            })
    },
      async update() {
      let tax = this.tax
      tax.rate = Number(tax.rate) / 100;
      tax.rate = Number(tax.rate)
      let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/taxes/update', 
      {...tax, id: Number(this.body.id)}, 
      {headers: {Authorization: localStorage.getItem('accessToken')}})
      this.loading = false
                this.$q.notify({
              type: 'positive',
              message: 'Tax updated',
              color: 'positive',
              position: 'top',
              timeout: '500'
            })
    }
  },
 async mounted() {
   if(this.actionType === 'Edit'){
    this.tax.name = this.body.name
    this.tax.description = this.body.description  
    this.tax.type = this.body.type
    this.tax.rate = Number(this.body.rate)*100
     }
  }

}
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>