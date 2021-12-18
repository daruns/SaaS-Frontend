<template>
<q-layout style="width: 550px !important;">
     <q-card style="max-width: 550px; height: 100vh !important;" flat square>
     <q-toolbar class="bg-grey-3" style="position:sticky !important; top:0;z-index:15;">
            <q-toolbar-title>
                {{action  + ' '}} non-inventory item
            </q-toolbar-title>
            <q-btn icon="close" flat round dense v-close-popup />
    </q-toolbar>
    <q-card-section class="q-gutter-md scroll">
          <q-input :rules="[val => (val && val.length !== 0) || 'This field is required']" ref="nameRef" outlined v-model="nonInventoryItem.name" label="Name" />
              <q-editor             
      v-model="nonInventoryItem.description" :dense="$q.screen.lt.md" :toolbar="[
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
          <q-input :rules="[val => (val && val > 0) || 'This field is required']" ref="numRef" outlined v-model="nonInventoryItem.unitPrice" label="Unit price" type="number" />
          <q-input :rules="[val => (val && val.length !== 0) || 'This field is required']" ref="supRef" outlined v-model="nonInventoryItem.supplier" label="Supplier" />
         
    </q-card-section>
    </q-card>
          <q-toolbar class="bg-grey-3" style="position:sticky !important; bottom:0;z-index:5;">
            <q-btn :loading="loading" @click="submit" label="Submit" no-caps type="reset" color="primary" unelevated class="full-width" v-close-popup="close" />
    </q-toolbar>
</q-layout>
</template>
<script>
import { mapActions } from 'vuex'
import Datepicker from 'vue3-date-time-picker';
import 'vue3-date-time-picker/dist/main.css';
export default {
  components: {
    Datepicker
  },
    props: ['body','action', 'clientId'],
    data() {
        return {
            loading: false,
            id: null,
            close: false,
            nonInventoryItem : {
                name: '',
                description: 'Description',
                unitPrice: 0,
                supplier: '',
                status: '',
            }
        }
    },
    methods: {
        ...mapActions('accountingStore',['addNItem', 'editNItem']),
       async submit() {
           this.$refs.nameRef.validate();
           this.$refs.numRef.validate();
           this.$refs.supRef.validate();

           if(
               this.$refs.nameRef.hasError ||
               this.$refs.numRef.hasError ||
               this.$refs.supRef.hasError 
           )
           return
            this.loading = true
           this.nonInventoryItem.unitPrice = Number(this.nonInventoryItem.unitPrice);
            if(this.action === 'Add') {
               await this.addNItem({...this.nonInventoryItem})
            }else if(this.action === 'Edit'){
              await this.editNItem({...this.nonInventoryItem, id: this.id})
            }
            this.loading = false
            this.$emit('closeDialogue')
        }
    },
    mounted() {
        if(this.action === 'Edit') {
                this.id = this.body.id,
                this.nonInventoryItem.name = this.body.name,
                this.nonInventoryItem.description = this.body.description,
                this.nonInventoryItem.unitPrice = this.body.unitPrice;
                this.nonInventoryItem.supplier = this.body.supplier,
                this.nonInventoryItem.status = this.body.status;
        }
    }
}
</script>