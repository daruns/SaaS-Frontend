<template>
<q-layout style="width: 550px !important;">
     <q-card style="max-width: 550px; min-height:100vh;" flat square>
     <q-toolbar class="bg-grey-3 header-height-standard" style="position:sticky !important; top:0;z-index:15;">
            <q-toolbar-title>
                {{actionType  + ' '}}Tax
            </q-toolbar-title>
            <q-btn icon="close" flat round dense v-close-popup />
    </q-toolbar>
    <q-card-section class="q-gutter-md scroll">
         <q-input
            ref="nameRef"
            outlined
            v-model="expenseCategory.name"
            label="Name"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please write the name']"
            />
<q-editor             
      v-model="expenseCategory.description" :dense="$q.screen.lt.md" :toolbar="[
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
    </q-card-section>
    </q-card>
          <q-toolbar class="bg-grey-3" style="position:sticky !important; bottom:0;z-index:5;">
            <q-btn :loading="loading" @click="submit" label="Submit" no-caps type="reset" color="primary" unelevated class="full-width" />
    </q-toolbar>
</q-layout>
</template>
<script>
import axios from 'axios';
export default {
    props: ['actionType', 'body'],
   data()  { 
   return {
     expenseCategory: {
         name: '',
         description: 'Description'
     },
     loading: false,
    }
  },
  methods : {
    async submit() {
            this.$refs.nameRef.validate();
            if(
            this.$refs.nameRef.hasError 
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
      let response = await axios.post(process.env.OC_BACKEND_API + 'expenseCategories/create', 
      this.expenseCategory, 
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
      let response = await axios.post(process.env.OC_BACKEND_API + 'expenseCategories/update', 
      {...this.expenseCategory, id:this.body.id },  
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
    this.expenseCategory.name = this.body.name
    this.expenseCategory.description = this.body.description  
     }
  }

}
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>