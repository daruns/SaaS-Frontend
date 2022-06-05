<template>
    <q-page  v-if="!canActivate('subject_finance','read')">
      <Forbidden />
    </q-page>
    <q-page v-else-if="!isLoaded" class="flex flex-center">
      <q-spinner  color="primary" size="md" />
    </q-page>

    <q-page v-else class="q-py-none q-my-none">
      <div class="full-width flex justify-between items-center q-px-md header-height-standard" style="border-bottom: 1px solid lightgrey;">
        <div class="text-h4">Expenses</div>
      </div>
      <breadcrumps class="q-pa-md full-width" :map="crumps" />

      <q-scroll-area class="q-px-md" style="height: calc(100vh - 93px)">
        <q-card class="q-pa-xl">
          <!-- <div class="column">
            <p>:</p>
            <p class="text-bold"></p>
          </div> -->
          <!-- <q-btn label="Upload files" icon="backup" color="grey" no-caps push flat unelevated class="absolute-bottom-right q-mr-sm q-mb-sm">
            <q-popup-proxy>
              <q-banner>
                <q-file clearable label="File" outlined v-model="file">
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
                <q-btn v-close-popup label="Upload" @click="addExpFile(); file = null" :disable="!file" flat color="primary" class="q-mt-sm" size="md" />
              </q-banner>
            </q-popup-proxy>
          </q-btn> -->
        <div class="row justify-between">
          <div class="column">
            <q-avatar square size="100px" font-size="52px">
              <img v-if="user.brand.logo" :src="user.brand.logo" />
              <img v-else src="~/assets/one_logo_neat.png" />
            </q-avatar>
            <!-- <div class="column col-lg-6 col-md-6 col-xs-12 col-sm-12 items-end q-mt-md">
              <p class="text-h6">{{oneExpense.expenseNumber}}</p>
              <p class="text-subtitle2">Expense Date: {{dateConversion(oneExpense.date)}}</p>
              <p class="text-subtitle2">Due Date: {{dateConversion(oneExpense.dueDate)}}</p>
            </div> -->
            <div class="column">
              <p class="text-h6">{{user.brand.name}}</p>
              <p class="text-subtitle2 text-grey">Email: {{user.brand.email}}</p>
              <p class="text-subtitle2 text-grey">Address: {{user.brand.address}}</p>
              <p class="text-subtitle2 text-grey">PhoneNumber: {{user.brand.phoneNumber}}</p>
              <p class="text-subtitle2 text-grey">Website: {{user.brand.website}}</p>
            </div>
          </div>
          <div class="column col-lg-6 col-md-6 col-xs-12 col-sm-12 items-end q-mt-md">
            <p><DownloadPDFButton :body="getJSPDFProps()" /></p>
            <p class="text-h6">{{oneExpense.expenseNumber}}</p>
            <p class="text-subtitle2">Expense Date: {{dateConversion(oneExpense.date)}}</p>
            <p class="text-subtitle2">Due Date: {{dateConversion(oneExpense.dueDate)}}</p>
          </div>
        </div>
        <div class="row col-12 justify-between q-mt-sm">
          <div class="column">
            <p class="text-h6" style="border-bottom: 1px solid rgb(221, 221, 221);">Supplier</p>
            <p>Name: {{oneExpense.supplierName}}</p>
            <p>Email: {{oneExpense.supplierEmail}}</p>
            <p>Phone Number: {{oneExpense.supplierPhoneNumbers}}</p>
          </div>
          <div class="column">
            <p class="text-subtitle2">Currency Code: {{oneExpense.currencyCode}}/{{oneExpense.exchangeRate}}</p>
            <p class="text-subtitle2">Billing Address: {{oneExpense.billingAddress}}</p>
            <p class="text-subtitle2">Bank Fee: {{oneExpense.bankFee}}</p>
            <p class="text-subtitle2">Payment Method: {{oneExpense.paymentMethodName}}</p>
            <p class="text-subtitle2">{{oneExpense.category}}</p>
            <p class="text-subtitle2">Tax Type: {{oneExpense.taxName}}</p>
          </div>
        </div>
        <div class="q-mt-xl">
          <q-markup-table flat bordered>
            <thead>
              <tr>
                <th class="text-left">#</th>
                <th class="text-left">Item</th>
                <th class="text-left">Description</th>
                <th class="text-left">Unit price</th>
                <th class="text-left">Quantity</th>
                <th class="text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr :style="rowColor(i)" v-for="(expense, i) in oneExpense.expenseItems" :key="i">
                <td  class="text-left">{{i+1}}</td>
                <td class="text-left">{{expense.name}}</td>
                <td class="text-left">{{expense.description}}</td>
                <td class="text-left">{{expense.unitPrice}}</td>
                <td class="text-left">{{expense.qty}}</td>
                <td class="text-left">{{expense.qty * expense.unitPrice}}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
          <div class="row q-mt-xl">
            <div class="col-9"></div>
            <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 column q-gutter-sm">   
            <q-input
              mask="#"
              fill-mask="0"
              reverse-fill-mask
              model-value="Number"
              readonly
               v-model="stotal" label="Subtotal"/>  
            <q-input
              mask="#"
              fill-mask="0"
              reverse-fill-mask
              model-value="Number"
              readonly
              :rules="[ val => Number(val) <= 100 || 'Not more than 100!']"
               v-model="taxRate" label="Tax Ratio%"/>
            <q-input
              mask="#"
              fill-mask="0"
              reverse-fill-mask
              readonly
              model-value="Number"
              v-model="discount" label="Discount%" />
            <q-input readonly v-model="total" label="Grand total" type="number" />
            </div>
         </div>
        <q-separator class="q-mt-lg" />
         <div class="text-grey q-pa-none">
           <p class="q-mt-md" v-html="oneExpense.description"></p>
         </div>
       <!-- <p v-show="images.length !== 0" class="text-h6 text-grey q-mt-lg">Uploaded images:</p>
        <p v-show="images.length === 0" class="q-mt-lg">No images has been uploaded.</p>
        <div v-show="images.length !== 0"  class="row">
          <div v-for="(file, i) in images" :key="file.id" >
            <div class="flex column flex-center q-pr-md q-pt-md">
          <q-avatar square size="100px">
            <q-badge style="background: transparent !important;" transparent floating>
              <q-btn @click="fileId = file.id, confirm = true" round size="7.5px" icon="delete" color="negative" class="absolute-top-right"/>
            </q-badge>
            <img :src="file.url" />
          </q-avatar>
          <p class="text-center text-caption text-black" style="max-width: 100px;">{{file.name}}</p>
           <a :href="file.url" target="_blank">
             <q-btn round icon="download" flat color="primary"/>
           </a>
          </div>
        </div>
        </div> -->
       </q-card>

       <p v-show="images.length !== 0" class="text-h6 text-grey q-mt-lg">Uploaded images</p>
        <q-card class="q-pa-md q-mt-md">
        <p v-show="images.length === 0" class="text-subtitle1 text-grey-5">No images has been uploaded.</p>
        <div v-show="images.length !== 0"  class="row q-pb-xl">
          <div v-for="(file) in images" :key="file.id" >
            <div class="flex column flex-center q-pr-md q-pt-md">
          <q-avatar square size="100px">
            <q-badge  v-if="canActivate('subject_finance','delete')" style="background: transparent !important;" transparent floating>
              <q-btn @click="fileId = file.id, confirm = true" round size="7.5px" icon="delete" color="negative" class="absolute-top-right"/>
            </q-badge>
            <img :src="file.url" />
          </q-avatar>
          <p class="text-center text-caption text-black" style="max-width: 100px;">{{file.name}}</p>
            <a :href="file.url" target="_blank">
            <q-btn class="text-primary bg-blue-1" unelevated label="Download" no-caps/>
           </a>
          </div>
        </div>
        </div>
          <q-btn  v-if="canActivate('subject_finance','create')" label="Upload images" icon="backup" color="grey" no-caps push flat unelevated class="absolute-bottom-right q-mr-sm q-mb-sm">
            <q-popup-proxy>
              <q-banner>
                <q-file :filter="checkType" @rejected="onRejectedImage" clearable label="Image" outlined v-model="image">
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
                <q-btn v-close-popup label="Upload" @click="addExpFile('image'); image = null" :disable="!image" no-caps flat color="primary" class="q-mt-sm" size="md" />
              </q-banner>
            </q-popup-proxy>
          </q-btn>
        </q-card>
       <p v-show="files.length !== 0" class="text-h6 text-grey q-mt-lg">Uploaded files</p>
        <q-card class="q-pa-md q-mt-md">
        <p v-show="files.length === 0" class="text-subtitle1 text-grey-5">No files has been uploaded.</p>
        <div v-show="files.length !== 0" class="row q-pb-xl">
          <div v-for="(file) in files" :key="file.id">
          <div  class="flex column flex-center q-pr-md q-pt-md">
          <q-avatar square size="100px"> 
           <q-badge style="background: transparent !important;" transparent floating>
              <q-btn  v-if="canActivate('subject_finance','delete')"  @click="fileId = file.id, confirm = true" round size="7.5px" icon="delete" color="negative" class="absolute-top-right"/>
            </q-badge>
            <q-icon  color="grey" name="attach_file" />
          </q-avatar>
          <p class="text-center text-caption text-black" style="max-width: 100px;">{{file.name}}</p>
           <a :href="file.url" target="_blank">
             <q-btn class="text-primary bg-blue-1" unelevated label="Download" no-caps/>
           </a>
          </div>
          </div>
        </div>
          <q-btn  v-if="canActivate('subject_finance','create')" label="Upload files" icon="backup" color="grey" no-caps push flat unelevated class="absolute-bottom-right q-mr-sm q-mb-sm">
            <q-popup-proxy>
              <q-banner>
                <q-file :filter="checkFileType" @rejected="onRejectedFile" clearable label="File" outlined v-model="file">
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
                <q-btn v-close-popup label="Upload" @click="addExpFile('file'); file = null" no-caps :disable="!file" flat color="primary" class="q-mt-sm" size="md" />
              </q-banner>
            </q-popup-proxy>
          </q-btn>
        </q-card>
    </q-scroll-area>
      <q-dialog v-model="confirm" persistent>
        <q-card style="width:300px;">
          <q-card-section>
            <div class="text-h6">Are you sure?</div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="negative" v-close-popup />
            <q-btn flat label="Delete" @click="deleteExpenseFile" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import axios from 'axios'
import BreadCrumpsVue from 'src/components/globalComponents/BreadCrumps.vue';
import DownloadPDFButton from 'src/components/DownloadPDFButton.vue';
import Forbidden from 'src/components/globalComponents/Forbidden.vue';
export default {
  components: {
    BreadCrumpsVue,
    DownloadPDFButton,
    Forbidden
},
  data() {
    return{
      crumps: [],
      files: [],
                  canActivate: this.$canActivate,

      file: null,
      image: null,
      images: [],
      confirm: false,
      fileId: null,
      isLoaded: false,
      taxRate: 0,
      total: 0,
      discount: 0,
      stotal: 0
    }
  },
  computed : {
    ...mapState('example',['user']),
    ...mapState('financeStore',['oneExpense',])
  },
  methods : {
    ...mapActions('financeStore',['getExpense','addExpenseFile']),
    ...mapActions('example',['getUser']),
    async deleteExpenseFile() {
      let response = await axios.post(process.env.OC_BACKEND_API + 'expenses/removeFile',
      {id: this.oneExpense.id, attachId:this.fileId}, 
      {headers: {Authorization: localStorage.getItem('accessToken')}});
      await this.getExpense(this.$route.params.id);
      this.fileAndImages();
    },
    dateConversion(date) {
      return ' '+date.split('T')[0]
    },
    rowColor(i) {
      if(i%2 === 0)
      return 'background: #f2f2f2 !important;'
    },
    checkType (files) {
      return files.filter(file => file.type.includes('image'))
    },
    checkFileType (files) {
      return files.filter(file => !file.type.includes('image'))
    },
    onRejectedImage() {
      this.$q.notify({
        type: 'negative',
        message: 'Only images are allowed!'
      })
    },
    onRejectedFile() {
      this.$q.notify({
        type: 'negative',
        message: 'Only files are allowed!'
      })
    },
    async addExpFile(type) {
      let data = new FormData();
      data.append('id', this.oneExpense.id);

      if(type === 'file')
      data.append('files', this.file);
      else
      data.append('files', this.image);

      await this.addExpenseFile(data);
      await this.getExpense(this.$route.params.id);
      this.fileAndImages();
    },
    fileAndImages() {
      this.files = [];
      this.images = [];
      for (let i = 0; i<this.oneExpense.attachments.length; i++) {
        if (this.oneExpense.attachments[i].contentType.includes('image'))
          this.images.push(this.oneExpense.attachments[i]);
        else
          this.files.push(this.oneExpense.attachments[i]);
      }
    },
    getJSPDFProps() {
      return {
        outputType: 'save',
        returnJsPDFDocObject: true,
        fileName: "Expense.pdf",
        orientationLandscape: false,
        compress: true,
        logo: {
          src: `${process.env.OC_BACKEND_API}readAsStream/?key=${this.user?.brand?.logo}`,
          type: null, //optional, when src= data:uri (nodejs case)
          width: 26.66, //aspect ratio = width/height
          height: 26.66,
          margin: {
              top: 0, //negative or positive num, from the current position
              left: 0 //negative or positive num, from the current position
          }
        },
        business: {
          name: `${this.user?.brand?.name}`,
          address: `${this.user?.brand?.address}`,
          phone: `${this.user?.brand?.phoneNumber}`,
          email: `${this.user?.brand?.email}`,
          website: `${this.user?.brand?.website}`,
        },
        contact: {
          label: "Expense issued for:",
          name: this?.oneExpense?.supplierName,
          address: this?.oneExpense?.supplierAddress,
          phone: this?.oneExpense?.supplierPhoneNumbers,
          email: this?.oneExpense?.supplierEmail,
        },
        invoice: {
          label: "#",
          num: `${this.oneExpense.expenseNumber}`,
          invDate: `Expense Date: ${this.dateConversion(this.oneExpense.date)}`,
          invGenDate: `Due Date: ${this.dateConversion(this.oneExpense.dueDate)}`,
          headerBorder: false,
          tableBodyBorder: false,
          header: [
            {
              title: "#",
              style: {width: 10},
            }, {
              title: "Name",
              style: {width: 30},
            }, {
              title: "Description",
              style: {width: 80},
            },
            { title: "Unit Price" },
            { title: "Quantity" },
            { title: "Total Amount" },
          ],
          table: Array.from(this.oneExpense?.expenseItems, (item, index)=>([
            `${index + 1}`,
            `${item.name}`,
            `${item.description}`,
            `${item.unitPrice}`,
            `${item.qty}`,
            `${item.qty * item.unitPrice}`,
          ])),
          invSubTotalLabel: "Sub Total:",
          invSubTotal: `${this.stotal}`,
          invTotalLabel: "Total:",
          invTotal: `${this.total}`,
          invCurrency: "USD",
          row1: {
            col1: 'Tax:',
            col2: `${this.taxRate}`,
            col3: '%',
            style: {
              fontFamily: 'serif',
              fontSize: 10 //optional, default 12
            }
          },
          row2: {
            col1: 'Discount:',
            col2: `${this.discount}`,
            col3: '%',
            style: {
              fontSize: 10 //optional, default 12
            }
          },
          invDescLabel: "Note",
          invDesc: this.oneExpense?.description,
        },
        footer: {
          text: "",
        },
        pageEnable: true,
        pageLabel: "page ",
      }
    },
  },
  async mounted() {
    await this.getUser()
    if (!this.canActivate('subject_finance','read')) return
    await this.getExpense(this.$route.params.id);
    this.discount = Number(this.oneExpense.discount) * 100;
    this.taxRate = Number(this.oneExpense.taxRate) * 100;
    this.stotal = Number(this.oneExpense.subTotalAmount);
    this.total = Number(this.oneExpense.totalAmount);
    this.fileAndImages();
    this.isLoaded = true;
  }
}
</script>
<style scoped>
p {
  padding: 0 !important;
}

div.q-avatar div.q-avatar__content img {
    border: none !important;
}
</style>