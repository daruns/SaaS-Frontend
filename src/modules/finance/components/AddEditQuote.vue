<template>
<q-layout style="width: 80vw !important;">
    <q-card class="bg-secondary" style="max-width: 80vw; min-height:100vh;" flat square>
     <q-toolbar class="bg-grey-3 header-height-standard" style="position:sticky !important; top:0;z-index:15;">
            <q-toolbar-title>
                {{action  + ' '}} Quote
            </q-toolbar-title>
            <q-btn icon="close" flat round dense v-close-popup />
    </q-toolbar>
    <q-card-section class="q-gutter-md">
        <div class="row">
          <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 column q-pa-sm">
                       <q-select
                         ref="clientRef"
                         :rules="[val => (val !== null) || 'This field is required']"
                         bg-color="white"
                         outlined
                         v-model="client" 
                         :options="options"
                         label="Choose client"
                         class="select"
                         :loading="isLoaded"
                          use-input
                          input-debounce="10"
                          @filter="filterClients"
                       >
                        <template v-slot:option="scope">
                        <q-item @click="retrievClientContacts(scope.opt.id,false)" v-bind="scope.itemProps">
                            <q-item-section>
                            <q-item-label>{{ scope.opt.label }}</q-item-label>       
                            </q-item-section>
                        </q-item>
                        </template>
                    </q-select>

          <div>
            <div class="q-pt-xs">
          <q-btn size="sm" no-caps flat color="primary" label="Add Client" @click="prompt = true" />
            </div>
          </div>
          </div>
          <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 column q-pa-sm">
         <q-select
           ref="clientCRef"
           class="select"
          :rules="[val => (val !== null) || 'This field is required']"
          bg-color="white" :disable="options0.length === 0" outlined v-model="clientContacts"  :options="options0" label="Client Contact" >
               <template v-slot:option="scope">
                  <q-item @click="clientEmail(scope.opt.id)" v-bind="scope.itemProps">
                      <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>       
                      </q-item-section>
                  </q-item>
                  </template>
         </q-select>
          <div>
            <div class="q-pt-xs">
          <q-btn :disable="!client" :ripple="false" size="sm" no-caps flat color="primary" label="Add Contact Person" @click="dialogue = true" />
            </div>
          </div>
          </div>
          <q-input 
          ref="cEmailRef"
          bg-color="white" class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm"  outlined v-model="clientEMAIL" label="Contact E-mail" />
          <q-input 
          ref="billingRef"
          bg-color="white" class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm"   outlined v-model="invoice.billingAddress" label="Billing address" />
          <q-input
          v-model="tax"
           bg-color="white" class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm"   outlined label="Tax" />
          <q-input 
           ref="paymentRef"
         :rules="[val => (val && val.length > 0) || 'This field is required']"
          bg-color="white" class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm" v-model="invoice.paymentMethod" outlined  label="Payment method" />
          <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm" >
            <div class="q-ma-none absolute q-ml-sm text-grey-7" style="z-index:10;font-size:12px;line-height:20px;font-weight:400;">Quote date</div>
            <Datepicker v-model="invoice.date" showNowButton></Datepicker>
            </div>
            <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm" >
            <div class="q-ma-none absolute q-ml-sm text-grey-7" style="z-index:10;font-size:12px;line-height:20px;font-weight:400;">Due date</div>
            <Datepicker v-model="invoice.dueDate" showNowButton></Datepicker>
            </div>
         <q-select
          ref="statusRef"
          :rules="[val => (val && val.length > 0) || 'This field is required']"
          bg-color="white"  class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm"  outlined v-model="invoice.status" :options="['Sent','Accepted', 'Rejected']" label="Status" />
          <q-input
           ref="currencyRef"
           :rules="[val => (val && val.length > 0) || 'This field is required']"
           bg-color="white" class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm" outlined v-model="invoice.currencyCode" label="Currency code" />
          <q-input
          bg-color="white"
             class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm" 
             mask="#"
              fill-mask="0"
              reverse-fill-mask
              model-value="Number"
           outlined v-model="invoice.exchangeRate" label="Exchange rate" />
        </div>
          <div>
            <div class="q-pa-sm">
                  <q-markup-table flat bordered class="q-mt-xl">
                  <thead>
                    <tr>
                      <th class="text-left">#</th>
                      <th class="text-left">Item</th>
                      <th class="text-left">Description</th>
                      <th class="text-left">Unit price</th>
                      <th class="text-left">Quantity</th>
                      <th class="text-left">Amount</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(items, i) in invoice.items" :key="i">
                      <td>{{i+1}}</td>
                      <td>
                      <q-select
                      style="min-width: 10rem !important;"
                        outlined
                        label="item"
                        v-model="invoice.items[i].label"
                        :options="options1"
                        :loading="isLoaded"
                        bg-color="white"
                        use-input
                        input-debounce="10"
                        @filter="filterItems"
                    >
                        <template v-slot:option="scope">
                        <q-item @keypress.enter="invoice.items[i].description = scope.opt.description" @click="invoice.items[i].description = scope.opt.description" v-bind="scope.itemProps">
                            <q-badge class="absolute-top-right q-ma-xs" style="font-size:10px;">{{scope.opt.category === 'serviceItem' ? 'service' : 'item'}}</q-badge>
                            <q-item-section>
                            <q-item-label>{{ scope.opt.label }}</q-item-label>       
                            </q-item-section>
                        </q-item>
                        </template>
                    </q-select>
                      </td>
                    <td style="min-width: 20rem !important;">
                      <q-input
                        bg-color="white"
                         outlined 
                         v-model="invoice.items[i].description"
                          />
                      </td>
                      <td style="width: 7rem !important;">
                      <q-input
                        style="width: 7rem !important;"
                        mask="#"
                        fill-mask="0"
                        reverse-fill-mask
                        model-value="Number"
                        bg-color="white"
                        @input.capture="evaluate(i)"  outlined v-model="invoice.items[i].unitPrice"/>
                      </td>
                      <td style="width: 5rem !important;">
                        <q-input
                        style="width: 5rem !important;"
                        bg-color="white"
                        mask="#"
                        fill-mask="0"
                        reverse-fill-mask
                        model-value="Number"
                        :readonly="invoice.items[i].label.category !== 'inventoryItem'"
                        @input.capture="evaluate(i)"  outlined v-model="invoice.items[i].qty"/>
                      </td>
                      <td style="width: 7rem !important;"> 
                          <q-input style="width: 7rem !important;" bg-color="white" readonly outlined v-model="invoice.items[i].amount" type="number" />
                      </td>
                      <td style="width: 2rem !important;">
                        <q-btn no-caps icon="add" flat color="primary" @click="updateOptions" />
                        <q-btn flat icon="delete" size="md" color="negative" v-if="i !== 0" @click="invoice.items.splice(i, 1); findTotal()"/></td>
                    </tr>
                  </tbody>
                </q-markup-table>
                </div>
          </div>

          <div class="row q-gutter-md">

     </div>
      <div class="q-pa-sm">
          <div class="row bg-white q-pa-lg" style="border-radius: 4px;">
            <div class="col-9"></div>
            <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12 q-pb-md column q-gutter-sm">  
             <q-input
              mask="#"
              fill-mask="0"
              reverse-fill-mask
              model-value="Number"
              readonly
              @input.capture="updateValues"  v-model="subtotal" label="Subtotal"/>   
            <q-input
              mask="#"
              fill-mask="0"
              reverse-fill-mask
              model-value="Number"
              @input.capture="updateValues"  v-model="invoice.taxRate" label="Tax Rate%"/>
            <q-input
              mask="#"
              fill-mask="0"
              reverse-fill-mask
              model-value="Number"
             @input.capture="updateValues" v-model="invoice.discount" label="Discount%" />
            <q-input readonly v-model="total" label="Grand total" type="number" />
            </div>
         </div>
      </div>
       <div class="q-pa-sm">
   <q-editor             
      v-model="invoice.description" :dense="$q.screen.lt.md" :toolbar="[
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
       </div>
    </q-card-section>
    </q-card>
          <q-toolbar style="position:sticky !important; bottom:0;z-index:5;" class="bg-grey-3">
            <q-btn :loading="loading" @click="submit" label="Submit" no-caps type="reset" color="primary" unelevated class="full-width" v-close-popup="close"  />
    </q-toolbar>
    <q-dialog seamless position="right" v-model="prompt" persistent>
        <modal @closeDialogue="prompt = false" @updateForInvoice="updateClients" actionType="Add" type="client" />
    </q-dialog>
        <q-dialog seamless position="right" v-model="dialogue" persistent>
          <modalc @closeDialogue="dialogue = false" @updateForInvoice="updateContacts" actionType="Add" :clId="Number(client.id)" />
        </q-dialog>
</q-layout>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import modal from '../../crm/components/AddEditClient.vue'
import modalc from '../../crm/components/AddEditContact.vue'
import { date } from 'quasar';
import Datepicker from 'vue3-date-time-picker';
import 'vue3-date-time-picker/dist/main.css'
export default {
  props: ['action','body','invoiceType'],
    data() {
        return {
            close: false,
            isLoaded: false,
            loading: false,
            prompt: false,
            dialogue: false,
            id: null,
            subtotal: 0,
            total: 0,
            tax:'',
            options: [],
            clientContacts: null,
            clientOptions: [],
            itemOptions: [],
            clientContactsOptions: [],
            options0: [],
            options1: [],
            clientEMAIL: '',
            client: null,
            otherInfo: 'Description',
            invoice : {
                clientId: null,
                date: '',
                exchangeRate: null,
                taxRate: null,
                discount: null,
                billingAddress: '',
                clientContactId: null,
                currencyCode: '',
                status: 'Sent',
                paymentMethod: '',
                dueDate: '',
                description: '',
                items:[]
            },
            invoiceToAddEdit: {
                clientId: null,
                date: '',
                exchangeRate: null,
                taxRate: null,
                discount: null,
                billingAddress: '',
                clientContactId: null,
                currencyCode: '',
                status: 'Sent',
                paymentMethod: '',
                dueDate: '',
                description: '',
                items:[]
            }
        }
    },
    computed : {
      ...mapState('crmStore', ['allClients']),
      ...mapState('accountingStore', ['joinedItems'])
    },
    components: {
    modal,
    modalc,
    Datepicker
    },
    methods: {
     filterClients (val, update, abort) {
        update(() => {
          const needle = val.toLowerCase()
          this.options = this.clientOptions.filter(v => {if(v.label.toLowerCase().indexOf(needle) > -1){ return v }})
        })
      },
     filterItems (val, update, abort) {
        update(() => {
          const needle = val.toLowerCase()
          this.options1 = this.itemOptions.filter(v => {if(v.label.toLowerCase().indexOf(needle) > -1){ return v }})
        });
      },
     async findTotal() {
          this.total = 0;      
           for(let i = 0; i < this.invoice.items.length; i++) {  
              this.total += this.invoice.items[i].amount
           }
           this.subtotal = this.total
      },
    async retrievClientContacts(id, isImmediate) {
        this.options0 = []
        this.clientContacts = []
        this.clientEMAIL = ''
        for(let i = 0 ; i<this.allClients.length; i++){
          if(Number(this.allClients[i].id) === Number(id)){
          for(let j = 0 ; j<this.allClients[i].clientContacts.length; j++){
            this.options0.push({label: this.allClients[i].clientContacts[j].name, id:Number(this.allClients[i].clientContacts[j].id)});
            this.clientContactsOptions.push({label: this.allClients[i].clientContacts[j].name, id:Number(this.allClients[i].clientContacts[j].id)});
          }
          }
        }
        if(isImmediate){
        this.clientContacts = {label: this.options0[this.options0.length-1].label, id: this.options0[this.options0.length-1].id }
        await this.clientEmail(this.clientContacts.id);
        }
      },
      clientEmail(ccid) {
        setTimeout(() => {
        for(let i = 0; i<this.allClients.length; i++) {
          if(Number(this.client.id) === Number(this.allClients[i].id)){
            for(let j = 0; j<this.allClients[i].clientContacts.length; j++){
              if(Number(this.allClients[i].clientContacts[j].id) === Number(ccid)){
                this.clientEMAIL = this.allClients[i].clientContacts[j].email
              }
            }
          }
        }
        }, 200);
      },
     async updateValues() {
       setTimeout(async () => {
           await this.findTotal();
          let disCount = (Number(this.invoice.discount)/100) * this.total;
          let tax = (Number(this.invoice.taxRate)/100) * this.total;
          this.total = this.total + Number(tax);
          this.total = this.total - Number(disCount);
       }, 100);

      },
     async evaluate(i) {

        await  setTimeout(() => {
               if(
        this.invoice.taxRate > 100 
        || 
        this.invoice.discount > 100
        ){
          return
         }
       }, 100);

     setTimeout(() => {
            this.invoice.items[i].amount = Number(this.invoice.items[i].unitPrice) * Number(this.invoice.items[i].qty);
            this.updateValues();
        }, 100);
      },
        ...mapActions('financeStore',['addQuote', 'editQuote']),
        ...mapActions('accountingStore',['getJoinedItems']),
        ...mapActions('crmStore',['getClients']),
       async submit() {
         
            this.$refs.clientRef.validate();
            this.$refs.clientCRef.validate();
            this.$refs.cEmailRef.validate();
            this.$refs.billingRef.validate();
            this.$refs.paymentRef.validate();
            this.$refs.statusRef.validate();
            this.$refs.currencyRef.validate();
            if(
            this.$refs.clientRef.hasError ||
            this.$refs.clientCRef.hasError ||
            this.$refs.cEmailRef.hasError ||
            this.$refs.billingRef.hasError ||
            this.$refs.paymentRef.hasError ||
            this.$refs.statusRef.hasError ||
            this.$refs.currencyRef.hasError 
            )
            return

            if(this.invoice.items[0].label === '') {
              alert('Please choose at least one item !');
              return
            }

            this.close = true
            this.invoiceToAddEdit.discount = Number(this.invoice.discount) / 100
            this.invoiceToAddEdit.exchangeRate = Number(this.invoice.exchangeRate)
            this.invoiceToAddEdit.taxRate = Number(this.invoice.taxRate) / 100
            this.invoiceToAddEdit.clientId = Number(this.client.id)
            this.invoiceToAddEdit.currencyCode = this.invoice.currencyCode
            this.invoiceToAddEdit.billingAddress = this.invoice.billingAddress
            this.invoiceToAddEdit.status = this.invoice.status
            this.invoiceToAddEdit.paymentMethod = this.invoice.paymentMethod
            this.invoiceToAddEdit.description = this.invoice.description

           this.invoiceToAddEdit.clientContactId = Number(this.clientContacts.id)
            for(let i = 0; i<this.invoice.items.length; i++) {
                      this.invoiceToAddEdit.items[i] = {
                        itemId: this.invoice.items[i].label.itemId,
                        name: this.invoice.items[i].label.label,
                        qty: Number(this.invoice.items[i].qty),
                        unitPrice: Number(this.invoice.items[i].unitPrice),
                        category: this.invoice.items[i].label.category,
                        description : this.invoice.items[i].description
                      }
                // this.invoice.items[i] = {
                //     itemId: this.invoice.items[i].label.itemId,
                //     name: this.invoice.items[i].label.label,
                //     qty: Number(this.invoice.items[i].qty),
                //     unitPrice: Number(this.invoice.items[i].unitPrice),
                //     category: this.invoice.items[i].label.category,
                //     description : this.invoice.items[i].description
                //     }
                    
            }
            this.invoiceToAddEdit.taxRate = Number(this.invoice.taxRate);
            this.invoiceToAddEdit.date = date.formatDate(new Date(this.invoice.date), 'YYYY-MM-DD HH:mm');
            this.invoiceToAddEdit.dueDate = date.formatDate(new Date(this.invoice.dueDate), 'YYYY-MM-DD HH:mm');
                if(this.action === 'Edit'){
                  await this.editQuote({...this.invoiceToAddEdit, id: this.body.id})
                }else{
               await this.addQuote(this.invoiceToAddEdit)
                }
        },
        async delInvoice(id) {
          this.deleteInvoice(id);
        },
        updateOptions() {
        this.options1.length = 0;
        // for(let i  = 0; i<this.inventoryItems.length; i++) {
        //   this.options1.push({label: this.inventoryItems[i].name, itemId: this.inventoryItems[i].id, category: 'inventoryItem', description:this.inventoryItems[i].description, qty: 0, unitPrice: 0, amount:0});
        //   this.itemOptions.push({label: this.inventoryItems[i].name, itemId: this.inventoryItems[i].id, category: 'inventoryItem', description:this.inventoryItems[i].description, qty: 0, unitPrice: 0, amount:0});
        // }
        // for(let i  = 0; i<this.nonInventoryItems.length; i++) {
        //   this.options1.push({label: this.nonInventoryItems[i].name, itemId: this.nonInventoryItems[i].id, category: 'nonInventoryItem', description:this.nonInventoryItems[i].description, qty: 0, unitPrice: 0, amount:0});
        //   this.itemOptions.push({label: this.nonInventoryItems[i].name, itemId: this.nonInventoryItems[i].id, category: 'nonInventoryItem', description:this.nonInventoryItems[i].description, qty: 0, unitPrice: 0, amount:0});
        // }
        // for(let i  = 0; i<this.serviceItems.length; i++) {
        //   this.options1.push({label: this.serviceItems[i].name, itemId: this.serviceItems[i].id, category: 'serviceItem', description:this.serviceItems[i].description, qty: 0, unitPrice: 0, amount:0});
        //   this.itemOptions.push({label: this.serviceItems[i].name, itemId: this.serviceItems[i].id, category: 'serviceItem', description:this.serviceItems[i].description, qty: 0, unitPrice: 0, amount:0});
        // }
        this.options1 = [];
        this.itemOptions =[];

        for(let i  = 0; i<this.joinedItems.length; i++) {
            this.options1.push({label: this.joinedItems[i].name, itemId: this.joinedItems[i].id, category: this.joinedItems[i].category, description:this.joinedItems[i].description, qty: 0, unitPrice: 0, amount:0});
            this.itemOptions.push({label: this.joinedItems[i].name, itemId: this.joinedItems[i].id, category: this.joinedItems[i].category, description:this.joinedItems[i].description, qty: 0, unitPrice: 0, amount:0});
          }

        this.invoice.items.push({label: '', itemId: null, category: '', qty: 1, unitPrice:0, amount: 0, description: ''})
        },
     updateClients() {
       this.options = [];
          for(let i  = 0; i<this.allClients.length; i++) {
              this.options.push({label: this.allClients[i].name, id: this.allClients[i].id});
              this.clientOptions.push({label: this.allClients[i].name, id: this.allClients[i].id});
            }
        },
       async updateContacts(){
          await this.getClients();
          await this.retrievClientContacts(Number(this.client.id), true);
        },
     dateConversion(dt) {
        let dtObj = new Date(dt);
        dtObj.setHours(dtObj.getHours() - 3)
        return date.formatDate(dtObj, 'YYYY-MM-DD HH:mm');
    },
    },
   async mounted() {
      if(this.action === 'Add'){
       this.invoice.status = this.invoiceType
      }
      this.isLoaded = true
       await this.getJoinedItems();
       await this.getClients();
       this.updateOptions();
       this.updateClients();
        // for(let i  = 0; i<this.inventoryItems.length; i++) {
        //   this.options1.push({label: this.inventoryItems[i].name, itemId: this.inventoryItems[i].id, category: 'inventoryItem', description:this.inventoryItems[i].description, qty: 0, unitPrice: 0, amount:0})
        // }
        // for(let i  = 0; i<this.nonInventoryItems.length; i++) {
        //   this.options1.push({label: this.nonInventoryItems[i].name, itemId: this.nonInventoryItems[i].id, category: 'nonInventoryItem', description:this.nonInventoryItems[i].description, qty: 0, unitPrice: 0, amount:0})
        // }
        // for(let i  = 0; i<this.serviceItems.length; i++) {
        //   this.options1.push({label: this.serviceItems[i].name, itemId: this.serviceItems[i].id, category: 'serviceItem', description:this.serviceItems[i].description, qty: 0, unitPrice: 0, amount:0})
        // }
        // for(let i  = 0; i<this.allClients.length; i++) {
        //   this.options.push({label: this.allClients[i].name, id: this.allClients[i].id});
        //   this.clientOptions.push({label: this.allClients[i].name, id: this.allClients[i].id});
        // }
    if(this.action === 'Edit'){
     this.invoice.clientId = this.body.clientId,
     this.invoice.date = this.dateConversion(this.body.date);
     this.invoice.dueDate = this.dateConversion(this.body.dueDate);
     this.invoice.billingAddress = this.body.billingAddress
     this.invoice.paymentMethod = this.body.paymentMethod
     this.invoice.description = this.body.description
     this.invoice.currencyCode = this.body.currencyCode
     this.invoice.status = this.body.status
     this.invoice.taxRate = Number(this.body.taxRate) 
     this.invoice.exchangeRate = Number(this.body.exchangeRate) 
     this.invoice.discount = Number(this.body.discount)
     this.client = {label: this.body.client.name, id: this.body.client.id}
     await this.updateValues();
     await this.retrievClientContacts(Number(this.body.clientId), false);
      if(this.body.clientContact){
     this.clientContacts = {label: this.body.clientContact.name, id:this.body.clientContact.id}
          this.clientEMAIL = this.body.clientContact.email
      }

      for(let i = 0 ; i<this.body.invoiceItems.length; i++){ 
          if(i+1 !== this.body.invoiceItems.length)
           this.invoice.items.push({
                  itemId: null,
                  qty: null,
                  category: '',
                  label: {label: '', itemId: null, category: '', description: ''},
                  unitPrice: null,
                  amount: 0
          })
          this.invoice.items[i].label = {label: '', itemId: null, category: '', description: ''}
          this.invoice.items[i].label.itemId = this.body.invoiceItems[i].itemId,
          this.invoice.items[i].qty = Number(this.body.invoiceItems[i].qty),
          this.invoice.items[i].label.category = this.body.invoiceItems[i].category,
          this.invoice.items[i].label.label = this.body.invoiceItems[i].name,
          this.invoice.items[i].unitPrice = Number(this.body.invoiceItems[i].unitPrice),
          this.invoice.items[i].amount = this.invoice.items[i].qty * this.invoice.items[i].unitPrice
          this.invoice.items[i].description = this.body.invoiceItems[i].description

      }
     }else{
        this.invoice.date = date.formatDate(new Date, 'YYYY-MM-DD HH:mm');
        this.invoice.dueDate = date.formatDate(new Date, 'YYYY-MM-DD HH:mm');
     }
        this.isLoaded = false;
    }
}
</script>
