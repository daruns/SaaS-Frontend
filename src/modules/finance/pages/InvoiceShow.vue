<template>
    <q-page v-if="!isLoaded" class="flex flex-center">
        <q-spinner  color="primary" size="md" />
    </q-page>
    <q-page v-else class="q-pa-xl">
          <q-card class="q-pa-xl">
        <div class="row justify-between">
        <div class="column col-lg-6 col-md-6 col-sm-12 col-xs-12 q-gutter-lg">
        <q-avatar size="100px" font-size="52px">
            <img src="~assets/one_logo_neat.png" />
        </q-avatar>
        <div class="column">
        <p class="text-h6">{{oneInvoice.client.name}}</p>
        <p class="text-subtitle2 text-grey">{{oneInvoice.client.businessType}}</p>
        <p class="text-subtitle2">{{oneInvoice.client.address}}</p>
        <p class="text-subtitle2">{{oneInvoice.client.email}}</p>
        </div>
        </div>
        <div class="column col-lg-6 col-md-6 col-xs-12 col-sm-12 items-end q-mt-xl">
        <p class="text-h6" style="padding-bottom:25px !important;">{{oneInvoice.invoiceNumber}}</p>
        <p class="text-subtitle2">Invoice Date: {{dateConversion(oneInvoice.date)}}</p>
        <p class="text-subtitle2">Due Date: {{dateConversion(oneInvoice.dueDate)}}</p>
        </div>
        </div>
        <div style="justify-content: start !important;" v-if="oneInvoice.clientContact" class="row q-mt-xl">
          <div class="column">
          <p>Quotation to:</p>
          <p class="text-bold">{{oneInvoice.clientContact.name}}</p>
          <p>{{oneInvoice.clientContact.email}}</p>
          <p>{{oneInvoice.clientContact.businessPhoneNumber1}}</p>
          <p>{{oneInvoice.clientContact.businessPhoneNumber2}}</p>


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
                <tr :style="rowColor(i)" v-for="(quote, i) in oneInvoice.invoiceItems" :key="i">
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
           <p class="q-mt-md" v-html="oneInvoice.description"></p>
         </div>
          </q-card>
    </q-page>
</template>
<script>
import { mapActions, mapState } from 'vuex'
export default {
    data() {
        return{
          isLoaded: false,
          taxRatio: 0,
          total: 0,
          discount: 0,
          stotal: 0
        }
    },
    computed : {
        ...mapState('financeStore',['oneInvoice'])
    },
    methods : {
        ...mapActions('financeStore',['getInvoice']),
        dateConversion(date) {
          console.log
            return ' '+date.split('T')[0]
        },
        rowColor(i) {
        if(i%2 === 0)
        return 'background: #f2f2f2 !important;'
      },
    },
    async mounted() {
        await this.getInvoice(this.$route.params.id);
        this.isLoaded = true;
        this.discount = Number(this.oneInvoice.discount)
        this.taxRatio = Number(this.oneInvoice.taxRate);
        this.stotal = Number(this.oneInvoice.subTotalAmount);
        this.discount = Number(this.oneInvoice.discount);
        this.total = Number(this.oneInvoice.totalAmount)

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