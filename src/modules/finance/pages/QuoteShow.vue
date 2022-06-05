<template>
    <q-page  v-if="!canActivate('subject_finance','read')">
      <Forbidden />
    </q-page>
    <q-page v-else-if="!isLoaded" class="flex flex-center">
      <q-spinner color="primary" size="md" />
    </q-page>
    <q-page v-else class="q-py-none q-my-none">
    <div class="full-width flex justify-between items-center q-px-md header-height-standard" style="border-bottom: 1px solid lightgrey;">
      <div class="text-h4">Quote</div>
    </div>
    <breadcrumps class="q-pa-md full-width" :map="crumps" />
    <div class="q-px-md">
    <q-card class="q-pa-lg">
        <div class="row justify-between">
        <div class="column col-lg-6 col-md-6 col-sm-12 col-xs-12 q-gutter-lg">
        <q-avatar size="100px" font-size="52px">
          <img v-if="user?.brand?.logo" :src="user?.brand?.logo" />
          <img v-else src="~/assets/one_logo_neat.png" />
        </q-avatar>
        <div class="column">
        <p class="text-h6">{{oneQuote.client.name}}</p>
        <p class="text-subtitle2 text-grey">{{oneQuote.client.businessType}}</p>
        <p class="text-subtitle2">{{oneQuote.client.address}}</p>
        <p class="text-subtitle2">{{oneQuote.client.email}}</p>
        </div>
        </div>
        <div class="column col-lg-6 col-md-6 col-xs-12 col-sm-12 items-end">
        <p><DownloadPDFButton :body="getJSPDFProps()" /></p>
        <p class="text-h6" style="padding-bottom:25px !important;">{{oneQuote.quoteNumber}}</p>
        <p class="text-subtitle2">Quote Date: {{dateConversion(oneQuote.date)}}</p>
        <p class="text-subtitle2">Due Date: {{dateConversion(oneQuote.dueDate)}}</p>
        </div>
        </div>
        <div style="justify-content: start !important;" v-if="oneQuote.clientContact" class="row q-mt-xl">
          <div class="column">
          <p>Quotation to:</p>
          <p class="text-bold">{{oneQuote.clientContact.name}}</p>
          <p>{{oneQuote.clientContact.email}}</p>
          <p>{{oneQuote.clientContact.businessPhoneNumber1}}</p>
          <p>{{oneQuote.clientContact.businessPhoneNumber2}}</p>


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
                <tr :style="rowColor(i)" v-for="(quote, i) in oneQuote.quoteItems" :key="i">
                    <td  class="text-left">{{i+1}}</td>
                      <td class="text-left">{{quote.name}}</td>
                      <td class="text-left">{{quote.description}}</td>
                      <td class="text-left">{{quote.unitPrice}}</td>
                      <td class="text-left">{{quote.qty}}</td>
                      <td class="text-left">{{quote.qty * quote.unitPrice}}</td>
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
               v-model="taxRatio" label="Tax Ratio%"/>
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
           <p class="q-mt-md" v-html="oneQuote.description"></p>
         </div>
    </q-card>
    </div>
    </q-page>
</template>
<script>
import breadcrumps from 'src/components/globalComponents/BreadCrumps.vue'
import DownloadPDFButton from 'src/components/DownloadPDFButton.vue';

import { mapActions, mapState } from 'vuex'
import Forbidden from 'src/components/globalComponents/Forbidden.vue';
export default {
    components: {
    breadcrumps,
    DownloadPDFButton,
    Forbidden
},
    data() {
      return{
        canActivate: this.$canActivate,
        isLoaded: false,
        taxRatio: 0,
        total: 0,
        discount: 0,
        stotal: 0,
        crumps: [
          {id:1,name:'OneConnect',icon: 'home',path: '/'},
          {id:2,name:'Quote',icon: 'receipt',path: '/finance/quote'}
        ],
      }
    },
    computed : {
        ...mapState('financeStore',['oneQuote']),
        ...mapState('example',['user'])
    },
    methods : {
        ...mapActions('financeStore',['getQuote']),
        ...mapActions('example',['getUser']),
        dateConversion(date) {
          console.log
            return ' '+date.split('T')[0]
        },
        rowColor(i) {
        if(i%2 === 0)
        return 'background: #f2f2f2 !important;'
      },
      getJSPDFProps() {
        return {
          outputType: 'save',
          returnJsPDFDocObject: true,
          fileName: "Invoice.pdf",
          orientationLandscape: false,
          compress: true,
          logo: {
            src: `${process.env.OC_BACKEND_API}readAsStream/?key=${this.user?.brand?.logo}`,
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
            label: "Invoice to",
            name: `${this?.oneQuote?.clientName}`,
            address: `${this?.oneQuote?.clientAddress}`,
            phone: `${this?.oneQuote?.clientPhoneNumbers}`,
            email: `${this?.oneQuote?.clientEmail}`,
          },
          invoice: {
            label: "",
            num: `${this.oneQuote?.quoteNumber}`,
            invDate: `Date: ${this.dateConversion(this.oneQuote.date)}`,
            invGenDate: `Due Date: ${this.dateConversion(this.oneQuote.dueDate)}`,
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
            table: Array.from(this.oneQuote?.quoteItems, (item, index)=>([
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
              col2: `${this.taxRatio}`,
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
            invDesc: this.oneQuote?.description,
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
        await this.getQuote(this.$route.params.id);
        this.isLoaded = true;
        this.discount = Number(this.oneQuote.discount)
        this.taxRatio = Number(this.oneQuote.taxRate);
        this.stotal = Number(this.oneQuote.subTotalAmount);
        this.discount = Number(this.oneQuote.discount);
        this.total = Number(this.oneQuote.totalAmount)

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