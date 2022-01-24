<template>
<q-layout style="width: 80vw !important;">
    <q-card class="bg-secondary" style="max-width: 80vw; min-height:100vh;" flat square>
     <q-toolbar class="bg-grey-3 header-height-standard" style="position:sticky !important; top:0;z-index:15;">
            <q-toolbar-title>
                {{action  + ' '}} Expense
            </q-toolbar-title>
            <q-btn icon="close" flat round dense v-close-popup />
    </q-toolbar>
    <q-card-section class="q-gutter-md">
        <div class="row">
          <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm">
                       <q-select
                         ref="supRef"
                         :rules="[val => (val !== null) || 'This field is required']"
                         bg-color="white"
                         outlined
                         v-model="supplier" 
                         :options="options"
                         label="Choose supplier"
                         :loading="isLoaded"
                       />
          </div>
          <!-- <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 column q-pa-sm">
         <q-select
           ref="clientCRef"
          :rules="[val => (val !== null) || 'This field is required']"
          bg-color="white" :disable="options0.length === 0" outlined v-model="clientContacts"  :options="options0" label="Client Contact" >
               <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                      <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>       
                      </q-item-section>
                  </q-item>
                  </template>
         </q-select>
          </div> -->
          <q-input 
          ref="billingRef"
          bg-color="white" class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm"   outlined v-model="invoice.billingAddress" label="Billing address" />
            <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm">
            <div class="q-ma-none absolute q-ml-sm text-grey-7" style="z-index:10;font-size:12px;line-height:20px;font-weight:400;">Expense date</div>
            <Datepicker v-model="invoice.date" showNowButton></Datepicker>
            </div>
            <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm">
            <div class="q-ma-none absolute q-ml-sm text-grey-7" style="z-index:10;font-size:12px;line-height:20px;font-weight:400;">Due date</div>
            <Datepicker v-model="invoice.dueDate" showNowButton></Datepicker>
            </div>
        <q-select
          ref="taxRef"
          :rules="[val => (val && val.length !== 0) || 'This field is required']"
          bg-color="white"  class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm"  outlined v-model="tax" :options="taxOptions" label="Choose Tax" />
        <q-select
          ref="paymentRef"
          :rules="[val => (val && val.length !== 0) || 'This field is required']"
          bg-color="white"  class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm"  outlined v-model="paymentMethod" :options="paymentOptions" label="Choose Payment Method" />
              <q-select
                      style="min-width: 10rem !important;"
                        outlined
                        v-model="invoice.category"
                        :options="options1"
                         :loading="isLoaded"
                         bg-color="white"
                         label="Category"
                         ref="categRef"
                         class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm"
                         :rules="[val => (val && val.length > 0) || 'This field is required']"
                    />
         <q-select
          ref="statusRef"
          :rules="[val => (val && val.length > 0) || 'This field is required']"
          bg-color="white"  class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm"  outlined v-model="invoice.status" :options="['Paid','Not paid', 'Sent']" label="Status" />
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
               <q-file
               class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm"
                v-model="file"
                outlined
                label="Attachment"
                clearable
                v-show="action === 'Add'"
            > 
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
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
                        v-model="invoice.items[i]"
                        :options="itemOptions"
                         :loading="isLoaded"
                         bg-color="white"
                         label="Item"
                    >
                        <template v-slot:option="scope">
                        <q-item @click="updateValues" v-bind="scope.itemProps">
                            <q-badge class="absolute-top-right q-mr-xs" style="font-size:10px;">{{scope.opt.category === 'serviceItem' ? 'service' : 'item'}}</q-badge>
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
                        @input.capture="evaluate(i)" outlined v-model="invoice.items[i].unitPrice"/>
                      </td>
                      <td style="width: 5rem !important;">
                        <q-input
                        style="width: 5rem !important;"
                        bg-color="white"
                        mask="#"
                        fill-mask="0"
                        reverse-fill-mask
                        model-value="Number"
                        :readonly="invoice.items[i].category !== 'inventoryItem'"
                        @input.capture="evaluate(i)"   outlined v-model="invoice.items[i].qty"/>
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
             <!-- <q-input
              mask="#"
              fill-mask="0"
              reverse-fill-mask
              model-value="Number"
              readonly
              @input.capture="updateValues"  v-model="subtotal" label="Subtotal"/>    -->
            <!-- <q-input
              mask="#"
              fill-mask="0"
              reverse-fill-mask
              model-value="Number"
              ref="taxRateRef"
              :rules="[ val => (Number(val) <= 100 && Number(val) > 0) || 'Not less than 1 & Not more than 100!']"
              @input.capture="updateValues"  v-model="invoice.exchangeRate" label="Tax Rate%"/> -->
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
      v-model="invoice.description" 
      :dense="true"
      :toolbar="[
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
    <!-- <q-dialog seamless position="right" v-model="prompt" persistent>
        <modal @closeDialogue="prompt = false" @updateForInvoice="updateClients" actionType="Add" type="client" />
    </q-dialog> -->
        <!-- <q-dialog seamless position="right" v-model="dialogue" persistent>
          <modalc @closeDialogue="dialogue = false" @updateForInvoice="updateContacts" actionType="Add" :clId="Number(client.id)" />
        </q-dialog> -->
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
      file: null,
      close: false,
      isLoaded: false,
      loading: false,
      prompt: false,
      dialogue: false,
      id: null,
      subtotal: 0,
      total: 0,
      options: [],
      options0: [],
      options1: [],
      taxOptions: [],
      paymentOptions: [],
      itemOptions: [],
      tax: null,
      paymentMethod: null,
      clientEMAIL: '',
      supplier: null,
      otherInfo: '',
      invoice : {
        supplierId: null,
        date: '',
        exchangeRate: null,
        discount: null,
        billingAddress: '',
        currencyCode: '',
        status: 'Sent',
        paymentMethodId: null,
        taxId: null,
        dueDate: '',
        category: null,
        description: 'Description',
        items:[]
      }
    }
  },
  computed : {
    ...mapState('financeStore', ['suppliers','joinedCategories', 'taxes','paymentMethods']),
    ...mapState('accountingStore', ['joinedItems'])
  },
  components: {
    modal,
    modalc,
    Datepicker
  },
  methods: {
    async findTotal() {
    this.total = 0;      
    for(let i = 0; i < this.invoice.items.length; i++) {  
      this.total += this.invoice.items[i].amount
    }
    if(this.tax) {
      this.total = this.total + (this.total * Number(this.tax.rate)) - ((this.invoice.discount/100)*this.total);
    }
    this.subtotal = this.total
  },
  async retrievSubCategs(id, isImmediate) {
    this.options0 = []
    this.clientContacts = []
    this.clientEMAIL = ''
  },
  async updateValues() {
    setTimeout(async () => {
      await this.findTotal();
    }, 100);
  },
  async evaluate(i) {
    setTimeout(() => {
      if(Number(this.invoice.items[i].qty) === 0 && this.invoice.items[i].category !== 'inventoryItem'){
        this.invoice.items[i].amount = Number(this.invoice.items[i].unitPrice) * 1;
      }else{
        this.invoice.items[i].amount = Number(this.invoice.items[i].unitPrice) * Number(this.invoice.items[i].qty);
      }
      this.updateValues();
    }, 100);
  },
  ...mapActions('financeStore',['addExpense', 'editExpense', 'deleteInvoice','getSuppliers','getJoinedCategories','getPaymentMethods','getTaxes']),
  ...mapActions('accountingStore',['getJoinedItems']),
  async submit() {
    this.$refs.supRef.validate();
    this.$refs.taxRef.validate();
    this.$refs.paymentRef.validate();
    this.$refs.categRef.validate();
    // this.$refs.invoiceDRef.validate();
    // this.$refs.invoiceDDRef.validate();
    this.$refs.statusRef.validate();
    this.$refs.currencyRef.validate();
    // this.$refs.exchangeRef.validate();
    // this.$refs.discountRef.validate();
    if (
      this.$refs.supRef.hasError ||
      this.$refs.taxRef.hasError ||
      this.$refs.billingRef.hasError ||
      this.$refs.paymentRef.hasError ||

      this.$refs.statusRef.hasError ||
      this.$refs.currencyRef.hasError ||
      this.$refs.categRef.hasError 
      // this.$refs.exchangeRef.hasError
      // this.$refs.discountRef.hasError 
    )
    return

    if (this.invoice.items[0].label === '') {
      alert('Please choose at least one item !');
      return
    }

    this.close = true
    this.invoice.discount = Number(this.invoice.discount) / 100
    this.invoice.supplierId = Number(this.supplier.id)
    this.invoice.taxId = Number(this.tax.id)
    this.invoice.paymentMethodId = Number(this.paymentMethod.id);
    for(let i = 0; i<this.invoice.items.length; i++) {
      // if(this.invoice.items[i].category === 'main') {
      this.invoice.items[i] = {
        itemId: this.invoice.items[i].itemId,
        name: this.invoice.items[i].label,
        qty: this.invoice.items[i].category === 'inventoryItem' ? Number(this.invoice.items[i].qty) : 1,
        unitPrice: Number(this.invoice.items[i].unitPrice),
        // category: this.invoice.category.category === 'main',
        description : this.invoice.items[i].description
      }
      //   }else {
      //     this.invoice.items[i] = {
      //     itemId: this.invoice.items[i].itemId,
      //     name: this.invoice.items[i].label,
      //     qty: Number(this.invoice.items[i].qty),
      //     unitPrice: Number(this.invoice.items[i].unitPrice),
      //     category: false,
      //     description : this.invoice.items[i].description,
      //   }
      // }
    }
    this.invoice.discount = Number(this.invoice.discount);
    this.invoice.exchangeRate = Number(this.invoice.exchangeRate);
    this.invoice.date = date.formatDate(new Date(this.invoice.date), 'YYYY-MM-DD HH:mm');
    this.invoice.dueDate = date.formatDate(new Date(this.invoice.dueDate), 'YYYY-MM-DD HH:mm');
    if(this.action === 'Edit'){
      await this.editExpense({invoice: {...this.invoice, id: this.body.id}, file: this.file })
    }else{
      await this.addExpense({invoice: this.invoice,file: this.file});
    }
    this.close = true
  },
  async delInvoice(id) {
    this.deleteInvoice(id);
  },
  updateOptions() {
    this.options1.length = 0;
    this.itemOptions.length = 0;
    this.options1 = [];
    this.itemOptions =[];
    this.taxOptions = []
    this.taxes = []
    this.paymentOptions = []
    this.paymentMethods = []
    this.options = []
    this.paymentMethods = []
    this.joinedCategories.forEach(e => {
      this.options1.push(e.name)
    })
    this.joinedItems.forEach(e => {
      this.itemOptions.push({label: e.name, itemId: e.id, category: e.category, description:e.description, qty: 0, unitPrice: 0, amount:0})
    })

    this.taxes.forEach(e => {
      this.taxOptions.push({label: e.name, id: e.id, rate: Number(e.rate)});
    })

    this.paymentMethods.forEach(e => {
      this.paymentOptions.push({label: e.name, id: e.id})
    })

    this.suppliers.forEach(e => {
      this.options.push({label: e.name, id: e.id})
    })
    this.invoice.items.push({label: '', itemId: null, category: '', qty: 1, unitPrice:0, amount: 0, description: ''});
  },
  updateClients() {
    this.options = [];
      this.suppliers.forEach(e => {
        this.options.push({label: e.name, id: e.id})
      })
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
    this.isLoaded = true
    await this.getJoinedCategories();
    await this.getPaymentMethods();
    await this.getTaxes();
    await this.getJoinedItems();
    await this.getSuppliers();
    this.updateOptions();
    if(this.action === 'Edit'){
      this.invoice.supplierId = this.body.supplier.id,
      this.invoice.date = this.dateConversion(this.body.date);
      this.invoice.dueDate = this.dateConversion(this.body.dueDate);
      this.invoice.billingAddress = this.body.billingAddress
      this.invoice.paymentMethod = this.body.paymentMethod
      this.invoice.category = this.body.category
      this.invoice.description = this.body.description
      this.invoice.currencyCode = this.body.currencyCode
      this.invoice.status = this.body.status
      this.invoice.exchangeRate = Number(this.body.exchangeRate) * 100
      this.invoice.discount = Number(this.body.discount) * 100
      this.supplier = {label: this.body.supplier.name, id: this.body.supplier.id}
      this.invoice.tax = this.body.tax.id
      this.invoice.paymentMethod = this.body.paymentMethod.id
      this.paymentMethod = {id:this.body.paymentMethod.id, label:this.body.paymentMethod.name}
      this.tax = {id:this.body.tax.id, label:this.body.tax.name, rate:this.body.tax.rate}
      await this.updateValues();

      for(let i = 0 ; i<this.body.expenseItems.length; i++){
        this.invoice.items[i].itemId = this.body.expenseItems[i].itemId,
        this.invoice.items[i].qty = Number(this.body.expenseItems[i].qty),
        this.invoice.items[i].category = this.body.expenseItems[i].category,
        this.invoice.items[i].label = this.body.expenseItems[i].name,
        this.invoice.items[i].unitPrice = Number(this.body.expenseItems[i].unitPrice),
        this.invoice.items[i].amount = this.invoice.items[i].qty * this.invoice.items[i].unitPrice
        this.invoice.items[i].description = this.body.expenseItems[i].description
        if(i+1 !== this.body.expenseItems.length)
        this.invoice.items.push({
          itemId: null,
          qty: null,
          category: '',
          label: '',
          unitPrice: null,
          amount: 0
        })
      }
    }else{
      this.invoice.date = date.formatDate(new Date, 'YYYY-MM-DD HH:mm');
      this.invoice.dueDate = date.formatDate(new Date, 'YYYY-MM-DD HH:mm');
    }
    this.isLoaded = false;
  }
}
</script>
