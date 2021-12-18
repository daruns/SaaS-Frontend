<template>
<q-layout style="width: 550px !important;">
     <q-card style="max-width: 550px; min-height:100vh;" flat square>
     <q-toolbar class="bg-grey-3" style="position:sticky !important; top:0;z-index:15;">
            <q-toolbar-title>
                {{action  + ' '}} inventory item
            </q-toolbar-title>
            <q-btn icon="close" flat round dense v-close-popup />
    </q-toolbar>
    <q-card-section class="q-gutter-md scroll">
          <q-input :rules="[val => (val && val.length !== 0) || 'This field is required']" ref="nameRef" outlined v-model="inventoryItem.name" label="Name" />
            <div>
            <div class="q-ma-none absolute q-ml-sm text-grey-7" style="z-index:10;font-size:12px;line-height:20px;font-weight:400;">Purchase date</div>
            <Datepicker v-model="inventoryItem.purchasedAt" showNowButton></Datepicker>
            </div>
            <div>
            <div class="q-ma-none absolute q-ml-sm text-grey-7" style="z-index:10;font-size:12px;line-height:20px;font-weight:400;">Expire date</div>
            <Datepicker class="q-mt-sm" v-model="inventoryItem.expireDate" showNowButton></Datepicker>
            </div>
               <q-editor             
      v-model="inventoryItem.description" :dense="$q.screen.lt.md" :toolbar="[
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
          <q-input :rules="[val => (val && val > 0) || 'This field is required']" ref="numRef" outlined v-model="inventoryItem.unitPrice" label="Unit price" type="number" />
          <q-input :rules="[val => (val && val > 0) || 'This field is required']" ref="qtyRef" outlined v-model="inventoryItem.qty" label="Quantity" type="number" />
          <q-input :rules="[val => (val && val.length !== 0) || 'This field is required']" ref="supRef" outlined v-model="inventoryItem.supplier" label="Supplier" />
    </q-card-section>
    </q-card>
          <q-toolbar class="bg-grey-3" style="position:sticky !important; bottom:0;z-index:5;">
            <q-btn :loading="loading" @click="submit" label="Submit" no-caps type="reset" color="primary" unelevated class="full-width" />
    </q-toolbar>
</q-layout>
</template>
<script>
import { mapActions } from 'vuex';
import { date } from 'quasar';
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
            inventoryItem : {
                name: '',
                description: 'Description',
                unitPrice: 0,
                expireDate: '',
                qty: 0,
                supplier: '',
                status: '',
                purchasedAt: ''
            }
        }
    },
    methods: {
        ...mapActions('accountingStore',['addItem', 'editItem']),

       async submit() {
           this.$refs.nameRef.validate();
           this.$refs.numRef.validate();
           this.$refs.qtyRef.validate();
           this.$refs.supRef.validate();
           if(
               this.$refs.nameRef.hasError ||
               this.$refs.numRef.hasError ||
               this.$refs.qtyRef.hasError ||
               this.$refs.supRef.hasError 
           )
           return
            this.loading = true;
              this.inventoryItem.purchasedAt = date.formatDate(new Date(this.inventoryItem.purchasedAt), 'YYYY-MM-DD HH:mm');
              this.inventoryItem.expireDate = date.formatDate(new Date(this.inventoryItem.expireDate), 'YYYY-MM-DD HH:mm');
              this.inventoryItem.unitPrice = Number(this.inventoryItem.unitPrice);
              this.inventoryItem.unitPrice = Number(this.inventoryItem.qty);
            if(this.action === 'Add') {
               await this.addItem({...this.inventoryItem})
            }else if(this.action === 'Edit'){
              await this.editItem({...this.inventoryItem, id: this.id})
            }
            this.loading = false
            this.$emit('closeDialogue')
        }
    },
    mounted() {
        if(this.action === 'Edit') {
                this.id = this.body.id,
                this.inventoryItem.name = this.body.name,
                this.inventoryItem.description = this.body.description,
                this.inventoryItem.unitPrice = this.body.unitPrice;
                let edt = new Date(this.body.expireDate)
                edt.setHours(edt.getHours() - 3);
                this.inventoryItem.expireDate = date.formatDate(edt, 'YYYY-MM-DD HH:mm');
                this.inventoryItem.qty = this.body.qty,
                this.inventoryItem.supplier = this.body.supplier,
                this.inventoryItem.status = this.body.status;
                let pdt = new Date(this.body.purchasedAt)
                pdt.setHours(pdt.getHours() - 3);
                this.inventoryItem.purchasedAt = date.formatDate(pdt, 'YYYY-MM-DD HH:mm');
        }else{
          this.inventoryItem.purchasedAt = date.formatDate(new Date, 'YYYY-MM-DD HH:mm');
          this.inventoryItem.expireDate = date.formatDate(new Date, 'YYYY-MM-DD HH:mm');
        }
    }
}
</script>