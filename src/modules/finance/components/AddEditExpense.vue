<template>
  <q-layout style="width: 80vw !important;">
    <q-card class="bg-secondary" style="max-width: 80vw; min-height:100vh;" flat square>
      <q-toolbar class="bg-grey-3 header-height-standard" style="position:sticky !important; top:0;z-index:15;">
        <q-toolbar-title>
            {{action  + ' '}} Expense
        </q-toolbar-title>
        <q-btn icon="close" flat round dense v-close-popup />
      </q-toolbar>
      <q-card-section class="row q-pa-md">
        <div :class="action === 'Add' ? 'col-xl-8 col-lg-8 col-md-8 col-sm-8 col-xs-12 q-pa-sm row' : 'col-12 row q-pa-sm'">
          <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm">
            <q-select
              style="min-width: 10rem !important;"
              outlined
              v-model="invoice.category"
              :options="categoriesOptiopns"
              :loading="categoryLoading"
              bg-color="white"
              label="Category"
              ref="categRef"
              :rules="[val => (val) || 'This field is required']"
              bottom-slots
            >
              <template v-slot:hint>
                <q-btn size="sm" dense no-caps flat color="primary" label="Add Cattegory" @click="categoryDialogue = true" />
              </template>
            </q-select>
          </div>
          <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm">
            <q-select
              bg-color="white"
              outlined
              clearable
              v-model="supplier" 
              :options="options"
              label="Choose supplier"
              :loading="supplierLoading"
              bottom-slots
            >
              <template v-slot:hint>
                <q-btn size="sm" dense no-caps flat color="primary" label="Add Supplier" @click="supplierDialogue = true" />
              </template>
            </q-select>
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
            <div class="q-ma-none absolute q-ml-sm text-grey-7" style="z-index:10;font-size:12px;line-height:20px;font-weight:400;">Expense date</div>
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
              outlined v-model="paymentMethod"
              :options="paymentOptions"
              clearable
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
              :disable="invoice.status === 'Paid'"
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
              ref="currencyCodeRef"
              @update:model-value="updateCurrencyCode"
              :rules="[val => (val && val.length > 0) || 'This field is required']"
              :options="currencyOptions"
              label="Currency code"
            />
          </div>
          <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm">
            <q-input
              bg-color="white"
              mask="#"
              :disable="invoice.currencyCode === defaultCurrency"
              fill-mask="0"
              reverse-fill-mask
              model-value="Number"
              outlined v-model="invoice.exchangeRate"
              label="Exchange rate"
            />
          </div>
          <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm">
            <q-input
              bg-color="white"
              mask="#"
              fill-mask="0"
              reverse-fill-mask
              model-value="Number"
              outlined
              v-model="bankFee"
              label="Bank Fee"
            />
          </div>
        </div>
        <div v-show="action === 'Add'" class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-12 q-pa-md">
          <q-uploader
            max-files="1"
            max-file-size="1048576"
            class="col-12 fit"
            max-total-size="1048576"
            label="Attachment"
            @removed="files => {saveFiles(files)}"
            hide-upload-btn
            v-show="action === 'Add'"
            @added="files => {saveFiles(files)}"
            :multiple="false"
          />
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
                    mask="#"
                    fill-mask="0"
                    reverse-fill-mask
                    model-value="Number"
                    bg-color="white"
                    @input.capture="evaluate(i)" outlined v-model="invoice.items[i].unitPrice"
                  />
                </td>
                <td style="width: 5rem !important;">
                  <q-input
                    style="width: 5rem !important;"
                    bg-color="white"
                    mask="#"
                    fill-mask="0"
                    reverse-fill-mask
                    model-value="Number"
                    @input.capture="evaluate(i)"   outlined v-model="invoice.items[i].qty"
                  />
                    <!-- :readonly="invoice.items[i].category !== 'inventoryItem' || invoice.items[i].category !== ''" -->
                </td>
                <td style="width: 7rem !important;"> 
                  <q-input style="width: 7rem !important;" bg-color="white" readonly outlined v-model="invoice.items[i].amount" type="number" />
                </td>
                <td style="width: 2rem !important;">
                  <q-btn no-caps icon="add" flat color="primary" @click="addItemToInvoiceTable(i)" />
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
                mask="#"
                type="number"
                model-value="Number"
                fill-mask="0"
                reverse-fill-mask
                readonly
                v-model="subtotal"
                label="Subtotal"/>   
              <q-input
                mask="#"
                model-value="Number"
                fill-mask="0"
                reverse-fill-mask
                @input.capture="updateValues"
                v-model="invoice.taxRate"
                label="Tax Rate%"/>
              <q-input
                mask="#"
                model-value="Number"
                fill-mask="0"
                reverse-fill-mask
                label="Discount%"
                @input.capture="updateValues" v-model="invoice.discount"
              />
              <q-input
                mask="#"
                type="number"
                model-value="Number"
                fill-mask="0"
                reverse-fill-mask
                readonly
                v-model="total"
                label="Grand total"
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
      <q-btn :loading="loading" @click="submit" label="Submit" no-caps type="reset" color="primary" unelevated class="full-width" v-close-popup="close" />
    </q-toolbar>
    <q-dialog seamless position="right" v-model="supplierDialogue" persistent>
      <supplierModal @closeDialogue="supplierDialogue = false; mountSuppliers()" @updateForInvoice="mountSuppliers()" actionType="Add" />
    </q-dialog>
    <q-dialog seamless position="right" v-model="taxDialogue" persistent>
      <taxModal @closeDialogue="taxDialogue = false; mountTaxes()" @updateForInvoice="mountTaxes()" actionType="Add" />
    </q-dialog>
    <q-dialog seamless position="right" v-model="categoryDialogue" persistent>
      <categoryModal @closeDialogue="categoryDialogue = false; mountCategories()" @updateForInvoice="mountCategories()" actionType="Add" />
    </q-dialog>
    <!-- <q-dialog seamless position="right" v-model="selectItemDialogue" persistent>
      <selectItemModal @closeDialogue="selectItemDialogue = false; mountJoinedItems()" @updateForInvoice="mountJoinedItems()" actionType="Add" />
    </q-dialog> -->
    <q-dialog seamless position="right" v-model="paymentDialogue" persistent>
      <paymentTypeModal @closeDialogue="paymentDialogue = false; mountPaymentTypes()" @updateForInvoice="mountPaymentTypes()" action="Add" />
    </q-dialog>
  </q-layout>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import supplierModal from './AddEditSupplier.vue'
import taxModal from './AddEditTax.vue'
import categoryModal from './AddEditCategories.vue'
import paymentTypeModal from './AddEditPaymentMethod.vue'
import selectItemModal from 'src/modules/accounting/components/SelectNewItemCategory.vue'
import { date } from 'quasar';
import Datepicker from 'vue3-date-time-picker';
import 'vue3-date-time-picker/dist/main.css'
const emptyInvoiceItem = {
  itemId: null,
  qty: 0,
  category: false,
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
      file: null,
      close: false,
      isLoaded: false,
      supplierDialogue: false,
      taxDialogue: false,
      categoryDialogue: false,
      selectItemDialogue: false,
      bankFee: null,
      paymentDialogue: false,
      categoryLoading: false,
      supplierLoading: false,
      joinedItemsLoading: false,
      currencyCodesLoading: false,
      taxLoading: false,
      paymentLoading: false,
      loading: false,
      id: null,
      subtotal: 0,
      total: 0,
      options: [],
      options0: [],
      categoriesOptiopns: [],
      currencyOptions:
       [
         DefCur,
         "IQD"
      ],
      taxOptions: [],
      paymentOptions: [],
      itemOptions: [],
      tax: null,
      paymentMethod: null,
      clientEMAIL: '',
      supplier: null,
      invoice : {
        supplierId: null,
        date: '',
        exchangeRate: null,
        discount: null,
        billingAddress: '',
        currencyCode: DefCur,
        status: 'Sent',
        paymentMethodId: null,
        taxId: null,
        taxRate: null,
        dueDate: '',
        bankFee: null,
        category: null,
        description: 'Description',
        items:[]
      }
    }
  },
  computed : {
    ...mapState('financeStore', ['suppliers','joinedCategories', 'taxes', 'paymentMethods', 'currencyCodes']),
    ...mapState('accountingStore', ['joinedItems'])
  },
  components: {
    supplierModal,
    taxModal,
    selectItemModal,
    paymentTypeModal,
    Datepicker,
    categoryModal,
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
    addItemToInvoiceTable(ind) {
      this.scndEmpty.itemId = null,
      this.scndEmpty.qty = 0,
      this.scndEmpty.category = false,
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
    saveFiles(files) {
      this.file = files[0]
    },
    async findTotal() {
      this.total = 0;      
      for(let i = 0; i < this.invoice.items.length; i++) {  
        this.total += this.invoice.items[i].amount
      }
      this.subtotal = parseFloat(this.total).toFixed(2);
      this.total = parseFloat(this.total + (this.total * Number(this.invoice.taxRate/100)) - ((this.invoice.discount/100)*this.total)).toFixed(2);
    },
    async updateValues() {
      setTimeout(async () => {
        await this.findTotal();
      }, 100);
    },
    evaluate(i) {
      setTimeout(async () => {
      if(Number(this.invoice.items[i].qty) === 0 && this.invoice.items[i].category !== 'inventoryItem'){
        this.invoice.items[i].amount = Number(this.invoice.items[i].unitPrice) * 1;
      }else{
        this.invoice.items[i].amount = Number(this.invoice.items[i].unitPrice) * Number(this.invoice.items[i].qty);
      }
      }, 100);
      this.updateValues();
    },
    ...mapActions('financeStore',['addExpense', 'editExpense', 'deleteInvoice','getSuppliers','getJoinedCategories','getPaymentMethods','getTaxes', 'getCurrencyCodes']),
    ...mapActions('accountingStore',['getJoinedItems']),
    async submit() {
      this.$refs.categRef.validate();
      this.$refs.currencyCodeRef.validate();
      this.$refs.statusRef.validate();
      // this.$refs.invoiceDRef.validate();
      // this.$refs.invoiceDDRef.validate();
      // this.$refs.exchangeRef.validate();
      // this.$refs.discountRef.validate();
      console.log(this.invoice.currencyCode)
      if (
        this.$refs.statusRef.hasError
        ||
        this.$refs.currencyCodeRef.hasError
        ||
        this.$refs.categRef.hasError 
        // this.$refs.exchangeRef.hasError
        // this.$refs.discountRef.hasError 
      ) return;

      if (this.invoice.items[0].label === '') {
        alert('Please choose at least one item !');
        return
      }
      this.loading = true
      this.invoice.discount = Number(this.invoice.discount) / 100
      this.invoice.taxRate = Number(this.invoice.taxRate) / 100
      this.invoice.bankFee = Number(this.bankFee)
      this.invoice.supplierId = this.supplier ? Number(this.supplier?.id) : null
      this.invoice.taxId = this.tax ? Number(this.tax?.id) : null
      this.invoice.paymentMethodId = this.paymentMethod ? Number(this.paymentMethod?.id) : null
      this.invoice.category = this.body.category
      this.invoice.discount = Number(this.invoice.discount);
      this.invoice.exchangeRate = Number(this.invoice.exchangeRate);
      this.invoice.date = date.formatDate(new Date(this.invoice.date), 'YYYY-MM-DD HH:mm');
      this.invoice.dueDate = date.formatDate(new Date(this.invoice.dueDate), 'YYYY-MM-DD HH:mm');
      for(let i = 0; i<this.invoice.items.length; i++) {
        this.invoice.items[i] = {
          itemId: this.invoice.items[i].itemId,
          name: this.invoice.items[i].label,
          qty: Number(this.invoice.items[i].qty) || 1,
          unitPrice: Number(this.invoice.items[i].unitPrice) || 1,
          description : this.invoice.items[i].description
        }
      }
      if(this.action === 'Edit') {
        try {
          await this.editExpense({invoice: {...this.invoice, id: this.body.id}, file: this.file })
          this.close = true
        } catch(er) {
          this.$q.notify({
            type: 'negative',
            message: 'something went wrong',
            color: 'negative',
            position: 'top',
            timeout: '500'
          })
        }
      }else{
        try {
          await this.addExpense({invoice: this.invoice,file: this.file});
          this.close = true
        } catch(er) {
          this.$q.notify({
            type: 'negative',
            message: 'something went wrong',
            color: 'negative',
            position: 'top',
            timeout: '500'
          })
        }
      }
      this.$emit('closeDialogue')
      this.loading = false
    },
    async delInvoice(id) {
      this.deleteInvoice(id);
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
    mountCategories() {
      this.categoryLoading = true
      this.categoriesOptiopns = [];
      let self = this
      this.getJoinedCategories().then(() => {
        self.categoryLoading = false
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
    selectItemModal() {
      this.joinedItemsLoading = true
      this.itemOptions = []
      let self = this
      this.getJoinedItems().then(() => {
        self.joinedItemsLoading = false
        self.updateOptions();
      });
    },
    updateOptions() {
      this.categoriesOptiopns.length = 0;
      this.itemOptions.length = 0;
      this.categoriesOptiopns = [];
      this.options = []
      this.itemOptions =[];
      this.taxOptions = []
      this.paymentOptions = []
      this.currencyOptions = []

      this.joinedCategories.forEach(e => {
        this.categoriesOptiopns.push({label: e.name, id: e.id})
      })

      this.joinedItems.forEach(e => {
        this.itemOptions.push({label: e.name, itemId: e.id, category: e.category, description:e.description, qty: e.qty, unitPrice: e.unitPrice})
      })

      this.taxes.forEach(e => {
        this.taxOptions.push({label: e.name, id: e.id, rate: parseFloat(e.rate).toFixed(2)});
      })

      this.paymentMethods.forEach(e => {
        this.paymentOptions.push({label: e.name, id: e.id})
      })

      this.suppliers.forEach(e => {
        this.options.push({label: e.name, id: e.id})
      })

      this.currencyCodes?.currencyCodes?.forEach((name,index) => {
        this.currencyOptions.push(name)
      })
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
    this.currencyCodesLoading = true
    this.categoryLoading = true
    this.paymentLoading = true
    this.taxLoading = true
    this.joinedItemsLoading = true
    this.supplierLoading = true
    let self = this

    this.getCurrencyCodes().then(() => {
      self.currencyCodesLoading = false
      self.updateOptions();
    })

    this.getJoinedCategories().then(() => {
      self.categoryLoading = false
      self.updateOptions();
    });

    this.getPaymentMethods().then(() => {
      self.paymentLoading = false
      self.updateOptions();
    });

    this.getTaxes().then(() => {
      self.taxLoading = false
      self.updateOptions();
    });

    this.getJoinedItems().then(() => {
      self.joinedItemsLoading = false
      self.updateOptions();
    });

    this.getSuppliers().then(() => {
      self.supplierLoading = false
      self.updateOptions();
    });
    console.log('body: ',this.body)
    if(this.action === 'Edit'){
      this.invoice.supplierId = this.body.supplier ? this.body.supplier.id : null;
      this.invoice.date = this.dateConversion(this.body.date);
      this.invoice.dueDate = this.dateConversion(this.body.dueDate);
      this.invoice.billingAddress = this.body.billingAddress
      this.invoice.paymentMethod = this.body.paymentMethod
      this.invoice.category = this.body.category
      this.bankFee = Number(this.body.bankFee)
      this.invoice.description = this.body.description
      this.invoice.currencyCode = this.body.currencyCode
      this.invoice.status = this.body.status
      this.invoice.exchangeRate = Number(this.body.exchangeRate)
      this.invoice.discount = Number(this.body.discount)
      this.invoice.taxRate = Number(this.body.taxRate)
      this.supplier = {label: this.body.supplier?.name, id: this.body.supplier?.id}
      this.invoice.taxId = this.body.tax?.id
      this.invoice.paymentMethodId = this.body.paymentMethod?.id
      this.paymentMethod = {id:this.body.paymentMethod?.id, label:this.body.paymentMethod?.name}
      this.tax = {id:this.body.tax?.id, label:this.body.tax?.name, rate:this.body.tax?.rate}
      await this.updateValues();

      for(let i = 0 ; i<this.body.expenseItems.length; i++){
        if (i+1 !== this.body.expenseItems.length) {
          this.invoice.items.push({
            itemId: null,
            qty: null,
            category: null,
            label: {label: '', itemId: null, category: null, description: ''},
            unitPrice: null,
            amount: 0,
            description: ''
          })
        }
        this.invoice.items[i].itemId = this.body.expenseItems[i].itemId,
        this.invoice.items[i].qty = Number(this.body.expenseItems[i].qty),
        this.invoice.items[i].category = this.body.expenseItems[i].category,
        this.invoice.items[i].label = this.body.expenseItems[i].name,
        this.invoice.items[i].unitPrice = Number(this.body.expenseItems[i].unitPrice),
        this.invoice.items[i].amount = Number(this.invoice.items[i].qty * this.invoice.items[i].unitPrice).toFixed(2)
        this.invoice.items[i].description = this.body.expenseItems[i].description
      }
      await this.updateValues();
    }else{
      this.invoice.date = date.formatDate(new Date, 'YYYY-MM-DD HH:mm');
      this.invoice.dueDate = date.formatDate(new Date, 'YYYY-MM-DD HH:mm');
    }
    this.isLoaded = false;
  }
}
</script>
