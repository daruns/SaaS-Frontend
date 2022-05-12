<template>
    <q-page v-if="isLoaded" class="flex flex-center">
      <q-spinner color="primary" size="md" />
    </q-page>
    <q-page v-else class="q-py-none q-my-none">
    <div class="full-width flex justify-between items-center q-px-md header-height-standard" style="border-bottom: 1px solid lightgrey;">
      <div class="text-h4">Payslip</div>
    </div>
    <div class="q-px-md">
    <q-card class="q-pa-lg">
        <div class="row justify-between">
        <div v-if="user" class="column col-lg-6 col-md-6 col-sm-12 col-xs-12 q-gutter-lg">
          <q-avatar square size="100px" font-size="52px">
            <img :src="user.brand?.logo" />
          </q-avatar>
          <div class="column">
            <p class="text-h6">{{user?.brand?.name}}</p>
            <p class="text-subtitle2">{{user?.brand?.email}}</p>
            <p class="text-subtitle2 text-grey">{{user?.brand?.phoneNumber}}</p>
            <p class="text-subtitle2 text-grey">{{user?.brand?.address}}</p>
          </div>
        </div>
        <div class="column col-lg-6 col-md-6 col-xs-12 col-sm-12 items-end">
          <p>
            <DownloadPDFButton :body="getJSPDFProps()" />
          </p>
          <p v-if="currentPayslip?.fromDate" class="text-subtitle2">Payslip Date: {{dateConversion(currentPayslip?.fromDate)}}</p>
        </div>
        </div>
        <div style="justify-content: start !important;" class="row q-mt-xl">
          <div class="column">
          <p>Payslip to:</p>
          <p class="text-bold">{{currentPayslip?.employee?.name}}</p>
          <p>{{currentPayslip?.employee?.email}}</p>

          </div>
        </div>
        <div class="q-mt-xl row ">
            <q-markup-table class="col-6" flat bordered>
                  <thead>
                    <tr>
                      <th class="text-left">Earnings</th>
                    </tr>
                  </thead>
            <tbody>
                <tr>
                  <td class="text-left">Basic Salary</td>
                  <td class="text-left">{{currentPayslip.basicSalary}}</td>
                </tr>
                <tr :style="rowColor(i)" v-for="(item, i) in currentPayslip.payslipEarnings" :key="i">
                  <td class="text-left">{{item?.name}}</td>
                  <td class="text-left">{{item?.amount}}</td>
                </tr>
            </tbody>
            </q-markup-table>
            <q-markup-table class="col-6" flat bordered>
                  <thead>
                    <tr>
                      <th class="text-left">Deductions</th>
                    </tr>
                  </thead>
            <tbody>
                <tr :style="rowColor(i)" v-for="(item, i) in currentPayslip.payslipDeductions" :key="i">
                  <td class="text-left">{{item.name}}</td>
                  <td class="text-left">{{item.amount}}</td>
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
              v-model="deductionTotal" label="Deductions Total"/>  
            <q-input
              mask="#"
              fill-mask="0"
              reverse-fill-mask
              model-value="Number"
              readonly
              v-model="earningTotal" label="Earnings Total"/>
            <q-input
              mask="#"
              fill-mask="0"
              reverse-fill-mask
              readonly
              model-value="Number"
              v-model="netSalary" label="Net Salary" />
            </div>
         </div>
    </q-card>
    </div>
    </q-page>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import DownloadPDFButton from 'src/components/DownloadPDFButton.vue';
export default {
  components: {
    DownloadPDFButton
  },
  data() {
    return{
      jsPDFInvoiceTemplate: null,
      isLoaded: false,
      netSalary: 0,
      pdfTableArr: [],
      earningTotal: 0,
      deductionTotal: 0,
    }
  },
  computed : {
      ...mapState('payrollStore',['currentPayslip']),
      ...mapState('example',['user'])
  },
  methods : {
    ...mapActions('payrollStore',['getOnePayslip']),
    ...mapActions('example', ['getUser']),
    downloadFile(blob, fileName) {
      const link = document.createElement('a');
      // create a blobURI pointing to our Blob
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      // some browser needs the anchor to be in the doc
      document.body.append(link);
      link.click();
      link.remove();
      // in case the Blob uses a lot of memory
      setTimeout(() => URL.revokeObjectURL(link.href), 7000);
    },
    dateConversion(date) {
      console.log(date)
      return ' '+date?.split('T')[0]
    },
    finalArrayForTablePdf(earnings,deductions) {
      let finres = []
      let biggerLengthArr = {name: '', val: []}
      let smallerLengthArr = {name: '', val: []}
      if (earnings.length >= deductions.length) {
        biggerLengthArr.val = earnings
        biggerLengthArr.name = 'earnings'
        smallerLengthArr.name = 'deductions'
        smallerLengthArr.val = deductions
      } else {
        biggerLengthArr.val = deductions
        biggerLengthArr.name = 'deductions'
        smallerLengthArr.name = 'earnings'
        smallerLengthArr.val = earnings
      }

      for (let ind in biggerLengthArr.val) {
        if (biggerLengthArr.name === 'deductions') {
          finres.push([smallerLengthArr.val[ind] ? smallerLengthArr.val[ind].name : '', smallerLengthArr.val[ind] ? smallerLengthArr.val[ind].amount : '', biggerLengthArr.val[ind].name,biggerLengthArr.val[ind].amount])
        } else {
          finres.push([biggerLengthArr.val[ind].name, biggerLengthArr.val[ind].amount, smallerLengthArr.val[ind] ? smallerLengthArr.val[ind].name : '',smallerLengthArr.val[ind] ? smallerLengthArr.val[ind].amount : ''])
        }
      }
      return finres
    },
    getJSPDFProps() {
      return {
        outputType: 'save',
        returnJsPDFDocObject: true,
        fileName: "Payslip.pdf",
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
          email_1: "",
          website: `${this.user?.brand?.website}`,
        },
        contact: {
          label: "Payslip issued for:",
          name: `${this.currentPayslip?.employee?.name}`,
          address: `${this.currentPayslip?.employee?.user?.email}`,
          phone: `${this.currentPayslip?.employee?.user?.phoneNumber}`,
          email: `${this.currentPayslip?.employee?.user?.email}`,
        },
        invoice: {
          label: "Invoice #: ",
          num: 0,
          invDate: "Payment Date: 01/01/2021 18:12",
          invGenDate: "Invoice Date: 02/02/2021 10:17",
          headerBorder: false,
          tableBodyBorder: false,
          header: [
            {
              title: "Earnings",
              style: {width: 70},
            },{
              title: "amount",
              style: {width: 20},
            },
            {
              title: "Deductions",
              style: {width: 70},
            },{
              title: "amount",
              style: {width: 20},
            }
          ],
          table: this.pdfTableArr,
          invSubTotalLabel: "Basic Salary:",
          invSubTotal: `${this.currentPayslip?.basicSalary}`,
          invTotalLabel: "Net Salary:",
          invTotal: `${this.netSalary}`,
          invCurrency: "USD",
          row1: {
            col1: 'Total Earnings:',
            col2: `${this.earningTotal}`,
            col3: 'USD',
            style: {
              fontFamily: 'serif',
              fontSize: 10 //optional, default 12
            }
          },
          row2: {
            col1: 'Total Deductions:',
            col2: `${this.deductionTotal}`,
            col3: 'USD',
            style: {
              fontSize: 10 //optional, default 12
            }
          },
          invDescLabel: "",
          invDesc: "",
        },
        footer: {
          text: "",
        },
        pageEnable: true,
        pageLabel: "page ",
      }
    },
    rowColor(i) {
      if(i%2 === 0)
      return 'background: #f2f2f2 !important;'
    },
  },
  async mounted() {
    this.isLoaded = true;
    await this.getUser();
    await this.getOnePayslip(this.$route.params.id);
    this.netSalary = Number(this.currentPayslip.netSalary)
    
    for (let item of this.currentPayslip.payslipDeductions) { this.earningTotal += Number(item.amount)}
    for (let item of this.currentPayslip.payslipDeductions) { this.deductionTotal += Number(item.amount)}

    let earningsss = [{name: "Basic Salary", amount: this.currentPayslip?.basicSalary}].concat(this.currentPayslip?.payslipEarnings)
    let deductionsss = this.currentPayslip?.payslipDeductions
    this.pdfTableArr = this.finalArrayForTablePdf(earningsss,deductionsss)
    this.isLoaded = false;
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