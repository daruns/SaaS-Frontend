<template>
  <q-layout style="width: 80vw !important;">
    <q-card class="bg-secondary" style="max-width: 80vw; min-height:100vh;" flat square>
      <q-toolbar class="bg-grey-3 header-height-standard" style="position:sticky !important; top:0;z-index:15;">
        <q-toolbar-title>
            {{action  + ' '}} Invoice
        </q-toolbar-title>
        <q-btn icon="close" flat round dense v-close-popup />
      </q-toolbar>
      <q-card-section class="row q-pa-md">
        <div class="col-12 row q-pa-sm">
          <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm">
            <q-select
              ref="clientRef"
              :rules="[val => (val !== null) || 'This field is required']"
              bg-color="white"
              outlined
              clearable
              v-model="client" 
              :options="clientOptions"
              use-input
              label="Choose Client"
              input-debounce="10"
              @filter="filterClients"
              :loading="clientsLoading"
              bottom-slots
            >
              <template v-slot:hint>
                <q-btn size="sm" dense no-caps flat color="primary" label="Add Client" @click="clientDialogue = true" />
              </template>
              <template v-slot:option="scope">
                <q-item @click="retrievClientContacts(scope.opt.id,false)" v-bind="scope.itemProps">
                    <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>       
                    </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm">
            <q-select
              ref="clientCRef"
              :rules="[val => (val !== null) || 'This field is required']"
              bg-color="white"
              outlined
              clearable
              :disable="clientContactsOptions.length === 0"
              v-model="clientContacts"
              :options="clientContactsOptions"
              label="Client Contact"
              use-input
              input-debounce="10"
              @filter="filterClients"
              :loading="clientsLoading"
              bottom-slots
            >
              <template v-slot:hint>
                <q-btn size="sm" :disable="!client" :ripple="false" dense no-caps flat color="primary" label="Add Contact Person" @click="clientContactDialogue = true" />
              </template>
              <template v-slot:option="scope">
                <q-item @click="clientEmail(scope.opt.id)" v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>       
                    </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm">
            <q-input
              ref="cEmailRef"
              bg-color="white"
              outlined
              :disable="disableContactEmail"
              v-model="clientEMAIL"
              label="Contact E-mail"
            />
          </div>
          <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm">
            <q-input
              ref="billingRef"
              bg-color="white"
              outlined
              v-model="invoice.billingAddress"
              label="Billing address"
            />
          </div>
          <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm">
            <div class="q-ma-none absolute q-ml-sm text-grey-7" style="z-index:10;font-size:12px;line-height:20px;font-weight:400;">Invoice date</div>
            <Datepicker autoApply v-model="invoice.date" showNowButton></Datepicker>
          </div>
          <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm">
            <div class="q-ma-none absolute q-ml-sm text-grey-7" style="z-index:10;font-size:12px;line-height:20px;font-weight:400;">Due date</div>
            <Datepicker autoApply v-model="invoice.dueDate" showNowButton></Datepicker>
          </div>
          <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm">
            <q-select
              bg-color="white"
              outlined
              v-model="tax"
              :options="taxOptions"
              :loading="taxLoading"
              clearable
              label="Choose Tax"
              @update:model-value="updateTaxRateValue"
              bottom-slots
            >
              <template v-slot:hint>
                <q-btn size="sm" dense no-caps flat color="primary" label="Add Tax" @click="taxDialogue = true" />
              </template>
            </q-select>
          </div>
          <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm">
            <q-select
              ref="paymentRef"
              bg-color="white"
              outlined
              v-model="invoice.paymentMethodId"
              :options="paymentOptions"
              :loading="paymentLoading"
              label="Choose Payment Method"
              bottom-slots
            >
              <template v-slot:hint>
                <q-btn size="sm" dense no-caps flat color="primary" label="Add Payment Type" @click="paymentDialogue = true" />
              </template>
            </q-select>
          </div>
          <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm">
            <q-select
              ref="statusRef"
              :rules="[val => (val && val.length > 0) || 'This field is required']"
              bg-color="white"
              outlined v-model="invoice.status"
              :options="['Paid','Not paid', 'Sent']"
              label="Status"
            />
          </div>
          <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm">
            <q-select
              bg-color="white"
              outlined
              v-model="invoice.currencyCode"
              option-value="value"
              option-label="label"
              :options="currencyOptions"
              label="Currency code"
              ref="currencyCodeRef"
              :rules="[val => (val && val.length > 0) || 'This field is required']"
              @update:model-value="updateCurrencyCode"
            />
          </div>
          <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm">
            <q-input
              bg-color="white"
              :disable="invoice.currencyCode === defaultCurrency"
              mask="#.##"
              fill-mask="0"
              reverse-fill-mask
              outlined
              v-model="invoice.exchangeRate"
              label="Exchange rate"
            />
          </div>
          <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm">
            <q-input
              bg-color="white"
              mask="#.##"
              fill-mask="0"
              reverse-fill-mask
              outlined
              v-model="bankFee"
              label="Bank Fee"
            />
          </div>

        </div>
        <div class="col-12 q-pa-sm">
          <q-markup-table flat bordered class="q-mt-xl">
            <thead>
              <tr>
                <th class="text-left">#</th>
                <th class="text-left">Item</th>
                <th class="text-left">Description</th>
                <th class="text-left">Unit price</th>
                <th class="text-left">Quantity</th>
                <th class="text-left">Amount</th>
                <th>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(items, i) in invoice.items" :key="i">
                <td>{{i+1}}</td>
                <td>
                  <q-select
                    use-input
                    input-debounce="0"
                    style="min-width: 10rem !important;"
                    outlined
                    v-model="invoice.items[i].label"
                    :options="itemOptions"
                    :loading="joinedItemsLoading"
                    bg-color="white"
                    hide-selected
                    fill-input
                    label="Item"
                    @filter="(inputValue, doneFn, abortFn) => filterItems(inputValue,i,doneFn, abortFn)"
                    @update:model-value="val => updateItem(val,i)"
                  >
                    <!-- bottom-slots -->
                  <!-- <template v-slot:hint>
                    <q-btn size="sm" dense no-caps flat color="primary" label="Add Item" @click="selectItemDialogue = true" />
                  </template> -->
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label v-html="scope.opt.label" />
                      </q-item-section>
                      <q-item-section side>
                        <q-badge dense v-html="scope.opt.category" />
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
                    bg-color="white"
                    @input.capture="() => evaluate(i)" outlined
                    v-model="invoice.items[i].unitPrice"
                  />
                </td>
                <td style="width: 5rem !important;">
                  <q-input
                    style="width: 5rem !important;"
                    bg-color="white"
                    @input.capture="evaluate(i)"
                    outlined
                    v-model="invoice.items[i].qty"
                  />
                </td>
                <td style="width: 7rem !important;"> 
                  <q-input
                    mask="#.##"
                    fill-mask="0"
                    reverse-fill-mask
                    style="width: 7rem !important;"
                    bg-color="white"
                    readonly
                    outlined
                    v-model="invoice.items[i].amount"
                  />
                </td>
                <td style="width: 2rem !important;">
                  <q-btn no-caps icon="add" flat color="primary" @click="addItemToInvoiceTable()" />
                  <q-btn flat icon="delete" size="md" color="negative" v-if="i !== 0" @click="invoice.items.splice(i, 1); findTotal()"/>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>

        <div class="q-pa-sm col-12">
          <div class="row bg-white q-pa-lg" style="border-radius: 4px;">
            <div class="col-9"></div>
            <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12 q-pb-md column q-gutter-sm">  
              <q-input
                label="Subtotal"
                fill-mask="0.00"
                readonly
                v-model="subtotal"
              />   
              <q-input
                label="Tax Rate%"
                mask="##.##"
                fill-mask="0"
                @input.capture="updateValues"
                v-model="invoice.taxRate"
              />
              <q-input
                label="Discount%"
                mask="##.##"
                fill-mask="0"
                @input.capture="updateValues"
                v-model="invoice.discount"
              />
              <q-input
                label="Grand total"
                fill-mask="0.00"
                readonly
                v-model="total"
              />
            </div>
          </div>
        </div>
        <div class="q-pa-sm col-12">
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
    <q-dialog seamless position="right" v-model="clientDialogue" persistent>
        <modal @closeDialogue="clientDialogue = false" @updateForInvoice="mountClients()" actionType="Add" type="client" />
    </q-dialog>
    <q-dialog seamless position="right" v-model="clientContactDialogue" persistent>
      <modalc @closeDialogue="clientContactDialogue = false" @updateForInvoice="updateContacts" actionType="Add" :clId="Number(client.id)" />
    </q-dialog>
    <q-dialog seamless position="right" v-model="taxDialogue" persistent>
      <taxModal @closeDialogue="taxDialogue = false; mountTaxes()" @updateForInvoice="mountTaxes()" actionType="Add" />
    </q-dialog>
    <q-dialog seamless position="right" v-model="paymentDialogue" persistent>
      <paymentTypeModal @closeDialogue="paymentDialogue = false; mountPaymentTypes()" @updateForInvoice="mountPaymentTypes()" action="Add" />
    </q-dialog>
  </q-layout>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { ref } from "vue";
import modal from '../../crm/components/AddEditClient.vue'
import modalc from '../../crm/components/AddEditContact.vue'
import taxModal from './AddEditTax.vue'
import paymentTypeModal from './AddEditPaymentMethod.vue'
import { date } from 'quasar';
import Datepicker from 'vue3-date-time-picker';
import 'vue3-date-time-picker/dist/main.css'
const emptyInvoiceItem = {
  itemId: null,
  qty: 1,
  category: null,
  label: '',
  unitPrice: 0,
  amount: 0
}
const DefCur = 'USD'
export default {
  props: ['action','body','invoiceType'],
  data() {
    return {
      defaultCurrency: DefCur,
      scndEmpty: emptyInvoiceItem,
      joinedItemsLoading: false,
      taxLoading: false,
      clientsLoading: false,
      taxesLoading: false,
      currencyCodesLoading: false,
      loading: false,
      paymentLoading: false,
      close: false,
      disableContactEmail: false,
      isLoaded: false,
      taxDialogue: false,
      bankFee: null,
      paymentDialogue: false,
      currencyCode: null,
      currencyOptions:
      [
        DefCur
        ,
        "IQD"
      ],
      taxOptions: [],
      clientDialogue: false,
      clientContactDialogue: false,
      id: null,
      subtotal: 0,
      total: 0,
      tax: null,
      clientContacts: null,
      clientOptions: [],
      itemOptions: [],
      paymentMethod: null,
      paymentOptions: [],
      clientContactsOptions: [],
      options: [],
      options1: [],
      clientEMAIL: '',
      client: null,
      invoice : {
        currencyCode: DefCur,
        paymentMethodId: null,
        taxId: null,
        bankFee: null,
        description: 'Description',
        clientId: null,
        date: '',
        exchangeRate: null,
        taxRate: null,
        discount: null,
        billingAddress: '',
        clientContactId: null,
        status: 'Sent',
        dueDate: '',
        items:[]
      },
    }
  },
  computed : {
    ...mapState('crmStore', ['allClients']),
    ...mapState('accountingStore', ['joinedItems']),
    ...mapState('financeStore', ['joinedCategories', 'taxes', 'paymentMethods', 'currencyCodes']), 
  },
  components: {
    modal,
    modalc,
    taxModal,
    paymentTypeModal,
    Datepicker
  },
  methods: {
    updateCurrencyCode(val) {
      if (val === this.defaultCurrency) {
        this.invoice.exchangeRate = 0
      }
    },
    updateTaxRateValue(e) {
      this.invoice.taxRate = e?.rate
      this.updateValues()
    },
    addItemToInvoiceTable() {
      this.scndEmpty.itemId = null,
      this.scndEmpty.qty = 1,
      this.scndEmpty.category = null,
      this.scndEmpty.label = '',
      this.scndEmpty.unitPrice = 0,
      this.scndEmpty.amount = 0
      this.invoice.items.push({...this.scndEmpty});
      this.scndEmpty = emptyInvoiceItem
    },
    updateItem(value,ind) {
      const prevObj = value
      console.log("updateitems: ------ ",value)
      if (typeof prevObj === 'object') {
        this.invoice.items[ind] = prevObj
      }
      this.updateOptions()
      this.evaluate(ind)
    },
    filterItems(val,ind,done,abort) {
      this.updateOptions()
      let fnd = this.itemOptions.filter(tr => {return tr.label.indexOf(val) > -1})
      done(e => {
        if (fnd.length > 0) this.itemOptions = fnd
        this.invoice.items[ind].label = val
      })
    },
    filterClients (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.options = this.clientOptions.filter(v => {if(v.label.toLowerCase().indexOf(needle) > -1){ return v }})
      })
    },
    // filterItems (val, update, abort) {
    //   update(() => {
    //     const needle = val.toLowerCase()
    //     this.options1 = this.itemOptions.filter(v => {if(v.label.toLowerCase().indexOf(needle) > -1){ return v }})
    //   });
    // },
    async findTotal() {
      this.total = 0;      
      for(let i = 0; i < this.invoice.items.length; i++) {  
        this.total += Number(this.invoice.items[i].amount)
      }
      this.subtotal = Number(this.total.toFixed(2))
    },
    async retrievClientContacts(id, isImmediate) {
      this.clientContactsOptions = []
      this.clientContacts = []
      this.clientEMAIL = ''
      for(let i = 0 ; i<this.allClients.length; i++){
        if(Number(this.allClients[i].id) === Number(id)){
          for(let j = 0 ; j<this.allClients[i].clientContacts.length; j++){
            this.clientContactsOptions.push({label: this.allClients[i].clientContacts[j].name, id:Number(this.allClients[i].clientContacts[j].id)});
          }
        }
      }
      if(isImmediate){
        this.clientContacts = {label: this.clientContactsOptions[this.clientContactsOptions.length-1].label, id: this.clientContactsOptions[this.clientContactsOptions.length-1].id }
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
                this.disableContactEmail = true
              }
            }
          }
        }
      }, 200);
    },
    async updateValues() {
      setTimeout(async () => {
        await this.findTotal();
        let disCount = (Number(this.invoice.discount)/100) * Number(this.total);
        let tax = (Number(this.invoice.taxRate)/100) * Number(this.total);
        this.total = this.total + Number(tax);
        this.total = this.total - Number(disCount);
        this.total = Number(this.total.toFixed(2))
      }, 100);
    },
    async evaluate(i) {
      setTimeout(async () => {
        if(Number(this.invoice.items[i].qty) === 0 && this.invoice.items[i].category !== 'inventoryItem'){
          this.invoice.items[i].amount = Number(this.invoice.items[i].unitPrice)?.toFixed(2) * 1;
        }else{
          this.invoice.items[i].amount = Number(this.invoice.items[i].unitPrice)?.toFixed(2) * Number(this.invoice.items[i].qty);
        }
        this.invoice.items[i].unitPrice = Number(this.invoice.items[i].unitPrice) || 0
        this.invoice.items[i].qty = Number(this.invoice.items[i].qty) || 1
        this.invoice.items[i].amount = Number(this.invoice.items[i].amount)?.toFixed(2) || 0
      }, 100);
      this.updateValues();
    },
    ...mapActions('financeStore',['getTaxes', 'addInvoice', 'editInvoice', 'deleteInvoice', 'getCurrencyCodes','getPaymentMethods']),
    ...mapActions('accountingStore',['getJoinedItems']),
    ...mapActions('crmStore',['getClients']),
    async submit() {
      this.$refs.clientRef.validate();
      this.$refs.paymentRef.validate();
      this.$refs.statusRef.validate();
      this.$refs.currencyCodeRef.validate();
      if (
        this.$refs.clientRef.hasError
        ||
        this.$refs.paymentRef.hasError
        ||
        this.$refs.statusRef.hasError
        ||
        this.$refs.currencyCodeRef.hasError 
      ) return
      if(this.invoice.items[0].label === '') {
        alert('Please choose at least one item !');
        return
      }
      this.loading = true
      this.invoice.discount = Number(this.invoice.discount) / 100
      this.invoice.taxRate = Number(this.invoice.taxRate) / 100
      this.invoice.bankFee = Number(this.bankFee)
      this.invoice.taxId = this.tax ? Number(this.tax?.id) : null
      this.invoice.paymentMethodId = this.paymentMethod ? Number(this.paymentMethod?.id) : null
      this.invoice.date = date.formatDate(new Date(this.invoice.date), 'YYYY-MM-DD HH:mm');
      this.invoice.dueDate = date.formatDate(new Date(this.invoice.dueDate), 'YYYY-MM-DD HH:mm');
      this.invoice.exchangeRate = Number(this.invoice.exchangeRate)
      this.invoice.clientId = Number(this.client.id)
      this.invoice.currencyCode = this.invoice.currencyCode
      this.invoice.billingAddress = this.invoice.billingAddress
      this.invoice.status = this.invoice.status
      this.invoice.description = this.invoice.description
      this.invoice.clientContactId = this.clientContacts? Number(this.clientContacts.id) : null
      for (let i = 0; i<this.invoice.items.length; i++) {
        this.invoice.items[i] = {
          itemId: this.invoice.items[i].itemId,
          name: (this.action === 'Edit') ? this.invoice.items[i].label?.label : this.invoice.items[i].label,
          category: this.invoice.items[i].category,
          qty: Number(this.invoice.items[i].qty) || 1,
          unitPrice: Number(this.invoice.items[i].unitPrice),
          description : this.invoice.items[i].description
        }
      }
      try {
        let response;
        if (this.action === 'Edit') {
          response = await this.editInvoice({...this.invoice, id: this.body.id})
        } else {
          response = await this.addInvoice(this.invoice)
        }
        this.$q.notify({
          type: 'positive',
          message: 'Invoice created',
          color: 'positive',
          position: 'top',
          timeout: '500'
        })
      } catch(er) {
        this.$q.notify({
          type: 'negative',
          message: 'something went wrong' + er,
          color: 'negative',
          position: 'top',
          timeout: '1000'
        })
      }

      this.loading = false
      this.$emit('closeDialogue')
    },
    async delInvoice(id) {
      this.deleteInvoice(id);
    },
    updateOptions() {
      this.itemOptions.length = 0;
      this.options = []
      this.itemOptions =[];
      this.taxOptions = []
      this.paymentOptions = []
      if (this.currencyCodes?.currencyCodes) this.currencyOptions = []
      this.clientOptions = []
      this.clientContactsOptions = []

      this.joinedItems.forEach(e => {
        this.itemOptions.push({label: e.name, itemId: e.id, category: e.category, description:e.description, qty: e.qty, unitPrice: e.unitPrice})
      })

      this.taxes.forEach(e => {
        this.taxOptions.push({label: e.name, id: e.id, rate: Number(e.rate).toFixed(2)});
      })
      this.paymentMethods.forEach(e => {
        this.paymentOptions.push({label: e.name, id: e.id})
      })
      if (!this.paymentOptions.length > 0) {
        this.paymentOptions.push({label: '', id: 0})
      }

      this.currencyCodes?.currencyCodes?.forEach((name,index) => {
        this.currencyOptions.push(name)
      })

      this.allClients.forEach(e => {
        this.clientOptions.push({label: e.name, id: e.id});
      })
    },
    mountSuppliers() {
      this.supplierLoading = true
      this.options = []
      let self = this
      this.getSuppliers().then(() => {
        self.supplierLoading = false
        self.updateOptions();
      });
    },
    mountTaxes() {
      this.taxLoading = true
      this.taxOptions = []
      let self = this
      this.getTaxes().then(() => {
        self.taxLoading = false
        self.updateOptions();
      });
    },
    mountPaymentTypes() {
      this.paymentLoading = true
      this.paymentOptions = []
      let self = this
      this.getPaymentMethods().then(() => {
        self.paymentLoading = false
        self.updateOptions();
      });
    },
    mountClients() {
      this.clientsLoading = true
      this.clientOptions = []
      let self = this
      this.getClients().then(() => {
        self.clientsLoading = false
        self.updateOptions();
      });
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
    this.invoice.items.push({...this.scndEmpty});
    this.isLoaded = true
    this.clientsLoading = true
    this.currencyCodesLoading = true
    this.paymentLoading = true
    this.taxLoading = true
    this.joinedItemsLoading = true
    this.taxesLoading = true
    this.isLoaded = true
    let self = this

    this.getClients().then(() => {
      self.clientsLoading = false
      self.updateOptions()
    });

    this.getCurrencyCodes().then(() => {
      self.currencyCodesLoading = false  
      self.updateOptions();
    })

    this.getTaxes().then(() => {
      self.updateOptions();
      self.taxLoading = false
    });

    this.getJoinedItems().then(() => {
      this.joinedItemsLoading = false
      this.updateOptions()
    });

    this.getPaymentMethods().then(() => {
      self.paymentLoading = false
      self.updateOptions();
    });

    this.getTaxes().then(() => {
      this.taxesLoading = false
      self.updateOptions();
    });
    if (this.action === 'Edit') {
      this.invoice.clientId = this.body.clientId,
      this.invoice.billingAddress = this.body.billingAddress
      this.invoice.taxId = {id: this.body.taxId}
      this.invoice.description = this.body.description
      this.invoice.currencyCode = this.body.currencyCode
      this.invoice.status = this.body.status
      this.client = {label: this.body.client?.name, id: this.body?.client.id}
      this.bankFee = Number(this.body.bankFee)
      this.invoice.taxRate = Number(this.body.taxRate) 
      this.invoice.exchangeRate = Number(this.body.exchangeRate) 
      this.invoice.discount = Number(this.body.discount)
      this.invoice.date = this.dateConversion(this.body.date);
      this.invoice.paymentMethodId = this.body.paymentMethodId
      await this.updateValues();
      await this.retrievClientContacts(Number(this.body.clientId), false);
      if(this.body.clientContact){
        this.clientContacts = {label: this.body.clientContact.name, id:this.body.clientContact.id}
        this.clientEMAIL = this.body.clientContact.email
      }
      for (let i = 0 ; i<this.body.invoiceItems.length; i++) { 
        if (i+1 !== this.body.invoiceItems.length) {
          this.invoice.items.push({
            itemId: null,
            qty: null,
            category: null,
            label: {label: '', itemId: null, category: null, description: ''},
            unitPrice: null,
            amount: 0
          })
        }

        this.invoice.items[i].label = {label: '', itemId: null, category: null, description: ''}
        this.invoice.items[i].label.itemId = this.body.invoiceItems[i].itemId,
        this.invoice.items[i].qty = Number(this.body.invoiceItems[i].qty),
        this.invoice.items[i].label.category = this.body.invoiceItems[i].category,
        this.invoice.items[i].label.label = this.body.invoiceItems[i].name,
        this.invoice.items[i].unitPrice = Number(this.body.invoiceItems[i].unitPrice),
        this.invoice.items[i].amount = Number(this.invoice.items[i].qty * this.invoice.items[i].unitPrice).toFixed(2)
        this.invoice.items[i].description = this.body.invoiceItems[i].description
      }
      this.invoice.date = date.formatDate(new Date(this.body.date), 'YYYY-MM-DD HH:mm');
      this.invoice.dueDate = date.formatDate(new Date(this.body.dueDate), 'YYYY-MM-DD HH:mm');
      await this.updateValues();
    } else {
      this.invoice.date = date.formatDate(new Date, 'YYYY-MM-DD HH:mm');
      this.invoice.dueDate = date.formatDate(new Date, 'YYYY-MM-DD HH:mm');
    }
    this.isLoaded = false;
  }
}
</script>
