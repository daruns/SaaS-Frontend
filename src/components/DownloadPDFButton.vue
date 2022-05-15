<template>
  <q-btn :loading="loading" @click="submit" class="col" color="primary" label="Download As PDF" no-caps />
</template>
<script>
export default {
  components : {
  },
  props: ['body'],
  data()  {
    return {
      loading: false,
      payload: {},
      // dumpPayload: {
      //   outputType: 'save',
      //   returnJsPDFDocObject: true,
      //   fileName: "Payslip.pdf",
      //   orientationLandscape: false,
      //   compress: true,
      //   logo: {
      //     src: `${process.env.OC_BACKEND_API}readAsStream/?key=${this.user?.brand?.logo}`,
      //     type: null, //optional, when src= data:uri (nodejs case)
      //     width: 26.66, //aspect ratio = width/height
      //     height: 26.66,
      //     margin: {
      //         top: 0, //negative or positive num, from the current position
      //         left: 0 //negative or positive num, from the current position
      //     }
      //   },
      //   business: {
      //     name: `${this.user?.brand?.name}`,
      //     address: `${this.user?.brand?.address}`,
      //     phone: `${this.user?.brand?.phoneNumber}`,
      //     email: `${this.user?.brand?.email}`,
      //     email_1: "",
      //     website: `${this.user?.brand?.website}`,
      //   },
      //   contact: {
      //     label: "Payslip issued for:",
      //     name: `${this.currentPayslip?.employee?.name}`,
      //     address: `${this.currentPayslip?.employee?.user?.email}`,
      //     phone: `${this.currentPayslip?.employee?.user?.phoneNumber}`,
      //     email: `${this.currentPayslip?.employee?.user?.email}`,
      //   },
      //   invoice: {
      //     label: "Invoice #: ",
      //     num: 0,
      //     invDate: "Payment Date: 01/01/2021 18:12",
      //     invGenDate: "Invoice Date: 02/02/2021 10:17",
      //     headerBorder: false,
      //     tableBodyBorder: false,
      //     header: [
      //       {
      //         title: "Earnings",
      //         style: {width: 80},
      //       },{
      //         title: "amount",
      //         style: {width: 30},
      //       }
      //     ],
      //     table: Array.from([{name: "Basic Salary", amount: this.currentPayslip?.basicSalary}].concat(this.currentPayslip?.payslipEarnings), (item, index)=>([
      //       `${item?.name}`,
      //       `${item?.amount}`,
      //     ])),
      //     invTotalLabel: "Net Salary:",
      //     invTotal: `${this.netSalary}`,
      //     invCurrency: "ALL",
      //     row1: {
      //       col1: 'Total Earnings:',
      //       col2: `${this.earningTotal}`,
      //       col3: '%',
      //       style: {
      //         fontFamily: 'serif',
      //         fontSize: 10 //optional, default 12
      //       }
      //     },
      //     row2: {
      //       col1: 'Total Deductions:',
      //       col2: `${this.deductionTotal}`,
      //       col3: 'ALL',
      //       style: {
      //         fontSize: 10 //optional, default 12
      //       }
      //     },
      //     invDescLabel: "",
      //     invDesc: "",
      //   },
      //   footer: {
      //     text: "",
      //   },
      //   pageEnable: true,
      //   pageLabel: "page ",
      // }
    }
  },
  methods: {
    downloadPdf() {
      try {
        this.jsPDFInvoiceTemplate = window.jsPDFInvoiceTemplate;
        const {jsPDF ,OutputType} = window.jsPDFInvoiceTemplate;
        this.payload.outputType = 'save'
  
        console.log("---- pfCreated: ", jsPDF)
        var omwmw = this.jsPDFInvoiceTemplateCstm(this.payload,jsPDF)
        console.log("---- omwmw: ", omwmw)
      } catch(err) {
        console.log("Something went wrong while creating the pdf!. ",err)
      }
    },
    jsPDFInvoiceTemplateCstm(props,JsPdfobj) {
      const param = {
        outputType: props.outputType || "save",
        returnJsPDFDocObject: props.returnJsPDFDocObject || false,
        fileName: props.fileName || "",
        orientationLandscape: props.orientationLandscape || false,
        compress: props.compress || false,
        logo: {
          src: props.logo?.src || "",
          type: props.logo?.type || "",
          width: props.logo?.width || "",
          height: props.logo?.height || "",
          margin: {
            top: props.logo?.margin?.top || 0,
            left: props.logo?.margin?.left || 0,
          },
        },
        business: {
          name: props.business?.name || "",
          address: props.business?.address || "",
          phone: props.business?.phone || "",
          email: props.business?.email || "",
          email_1: props.business?.email_1 || "",
          website: props.business?.website || "",
        },
        contact: {
          label: props.contact?.label || "",
          name: props.contact?.name || "",
          address: props.contact?.address || "",
          phone: props.contact?.phone || "",
          email: props.contact?.email || "",
          otherInfo: props.contact?.otherInfo || "",
        },
        invoice: {
          label: props.invoice?.label || "",
          invTotalLabel: props.invoice?.invTotalLabel || "",
          invSubTotalLabel: props.invoice?.invSubTotalLabel || "",
          num: props.invoice?.num || "",
          invDate: props.invoice?.invDate || "",
          invGenDate: props.invoice?.invGenDate || "",
          headerBorder: props.invoice?.headerBorder || false,
          tableBodyBorder: props.invoice?.tableBodyBorder || false,
          header: props.invoice?.header || [],
          table: props.invoice?.table || [],
          invTotal: props.invoice?.invTotal || "",
          invSubTotal: props.invoice?.invSubTotal || "",
          invCurrency: props.invoice?.invCurrency || "",
          invCurrencyLetter: props.invoice?.invCurrencyLetter || "",
          invDescLabel: props.invoice?.invDescLabel || "",
          invDesc: props.invoice?.invDesc || "",
          row1: {
            col1: props.invoice?.row1?.col1 || "",
            col2: props.invoice?.row1?.col2 || "",
            col3: props.invoice?.row1?.col3 || "",
            style: {
              fontSize: props.invoice?.row1?.style?.fontSize || 12,
            },
          },
          row2: {
            col1: props.invoice?.row2?.col1 || "",
            col2: props.invoice?.row2?.col2 || "",
            col3: props.invoice?.row2?.col3 || "",
            style: {
              fontSize: props.invoice?.row2?.style?.fontSize || 12,
            },
          },
        },
        footer: {
          text: props.footer?.text || "",
        },
        pageEnable: props.pageEnable || false,
        pageLabel: props.pageLabel || "Page",
      };

      const splitTextAndGetHeight = (text, size) => {
        var lines = doc.splitTextToSize(text, size);
        return {
          text: lines,
          height: doc.getTextDimensions(lines).h,
        };
      };
      if (param.invoice.table && param.invoice.table.length) {
        if (param.invoice.table[0].length != param.invoice.header.length)
          throw Error("Length of header and table column must be equal.");
      }

      const options = {
        orientation: param.orientationLandscape ? "landscape" : "portrait",
        compress: param.compress
      };

      var doc = new JsPdfobj(options.orientation,'mm','a4');

      var docWidth = doc.internal.pageSize.width;
      var docHeight = doc.internal.pageSize.height;

      var colorBlack = "#000000";
      var colorGray = "#444444";
      //starting at 15mm
      var currentHeight = 15;
      //var startPointRectPanel1 = currentHeight + 6;

      var pdfConfig = {
        headerTextSize: 18,
        labelTextSize: 12,
        fieldTextSize: 10,
        lineHeight: 6,
        subLineHeight: 4,
      };
      doc.addFileToVFS('Gilroy-Regular_0.ttf')
      doc.setFont('Gilroy-Regular_0');
      doc.setFontSize(pdfConfig.headerTextSize);
      doc.setTextColor(colorBlack);
      doc.text(docWidth - 10, currentHeight, param.invoice?.label + param.invoice?.num, "right");
      doc.setFontSize(pdfConfig.fieldTextSize);
      doc.setTextColor(colorGray);
      currentHeight += pdfConfig.subLineHeight;
      currentHeight += pdfConfig.subLineHeight;
      doc.text(docWidth - 10, currentHeight, param.invoice.invDate, "right");
      if (param.invoice?.invGenDate !== '') {
        currentHeight += pdfConfig.subLineHeight;
        doc.text(docWidth - 10, currentHeight, param.invoice.invGenDate, "right");
      }


      if (param.logo.src) {
        currentHeight -= pdfConfig.subLineHeight;
        currentHeight -= pdfConfig.subLineHeight;
        var imageHeader = '';
        if(typeof window === "undefined"){
          imageHeader = param.logo.src;
        } else {
          imageHeader = new Image;
          imageHeader.src = param.logo.src;
        }
        //doc.text(htmlDoc.sessionDateText, docWidth - (doc.getTextWidth(htmlDoc.sessionDateText) + 10), currentHeight);
        if (param.logo.type) {
          doc.addImage(
            imageHeader,
            param.logo.type,
            10 + param.logo.margin.left,
            currentHeight - 5 + param.logo.margin.top,
            param.logo.width,
            param.logo.height
          );
        } else {
          doc.addImage(
            imageHeader,
            10 + param.logo.margin.left,
            currentHeight - 5 + param.logo.margin.top,
            param.logo.width,
            param.logo.height
          );
        }
        currentHeight += param.logo.height;
      }

      currentHeight += pdfConfig.subLineHeight;

      //line breaker after logo & business info
      if (false && param.invoice.header.length) {
        currentHeight += pdfConfig.subLineHeight;
        doc.line(10, currentHeight, docWidth - 10, currentHeight);
      }
      // business part
      doc.text(10, currentHeight, param.business.name);
      doc.setFontSize(pdfConfig.fieldTextSize);

      currentHeight += pdfConfig.subLineHeight;
      currentHeight += pdfConfig.subLineHeight;
      doc.text(10, currentHeight, param.business.address);
      currentHeight += pdfConfig.subLineHeight;
      doc.text(10, currentHeight, param.business.phone);
      doc.setFontSize(pdfConfig.fieldTextSize);
      // doc.setTextColor(colorGray);
      currentHeight += pdfConfig.subLineHeight;
      doc.text(10, currentHeight, param.business.email);

      currentHeight += pdfConfig.subLineHeight;
      doc.text(10, currentHeight, param.business.website);
      
      doc.text(docWidth - 10, currentHeight, 'Currency:  ' + param.invoice?.invCurrency, 'right');
      currentHeight += pdfConfig.subLineHeight;

      currentHeight += pdfConfig.subLineHeight;
      currentHeight += pdfConfig.subLineHeight;
      //Contact part
      doc.setTextColor(colorBlack);
      doc.setFontSize(pdfConfig.headerTextSize - 5);
      currentHeight += pdfConfig.lineHeight;
      if (param.contact.label) {
        doc.text(10, currentHeight, param.contact.label);
        currentHeight += pdfConfig.lineHeight;
      }

      doc.setFontSize(pdfConfig.headerTextSize - 5);
      if (param.contact.name) doc.text(10, currentHeight, param.contact.name);

      if (param.contact.name)
        currentHeight += pdfConfig.subLineHeight;

      doc.setTextColor(colorGray);
      doc.setFontSize(pdfConfig.fieldTextSize - 2);

      if (param.contact.address) {
        doc.text(10, currentHeight, param.contact.address);
        currentHeight += pdfConfig.subLineHeight;
      }

      if (param.contact.phone) {
        doc.text(10, currentHeight, param.contact.phone);
        currentHeight += pdfConfig.subLineHeight;
      }

      if (param.contact.email) {
        doc.text(10, currentHeight, param.contact.email);
        currentHeight += pdfConfig.subLineHeight;
      }

      if (param.contact.otherInfo)
        doc.text(10, currentHeight, param.contact.otherInfo);
      else currentHeight -= pdfConfig.subLineHeight;
      //end contact part
      currentHeight += pdfConfig.subLineHeight;
      currentHeight += pdfConfig.subLineHeight;

      //TABLE PART
      //var tdWidth = 31.66;
      //10 margin left - 10 margin right
      var tdWidth = (doc.getPageWidth() - 20) / param.invoice.header.length;

      //#region TD WIDTH
        if (param.invoice.header.length > 2) { //add style for 2 or more columns
          const customColumnNo = param.invoice.header.map(x => x?.style?.width || 0).filter(x => x > 0);
          let customWidthOfAllColumns = customColumnNo.reduce((a, b) => a + b, 0);
          tdWidth = (doc.getPageWidth() - 20 - customWidthOfAllColumns) / (param.invoice.header.length - customColumnNo.length);
        }
      //#endregion

      //#region TABLE HEADER BORDER
      var addTableHeaderBorder = () => {
        currentHeight += 2;
        const lineHeight = 10;
        let startWidth = 0;
        for (let i = 0; i < param.invoice.header.length; i++) {
          const currentTdWidth = param.invoice.header[i]?.style?.width || tdWidth;
          if (i === 0) doc.rect(10, currentHeight, currentTdWidth, lineHeight);
          else {
            const previousTdWidth = param.invoice.header[i - 1]?.style?.width || tdWidth;
            const widthToUse = currentTdWidth == previousTdWidth ? currentTdWidth : previousTdWidth;
            startWidth += widthToUse;
            doc.rect(startWidth + 10, currentHeight, currentTdWidth, lineHeight);
          }
        }
        currentHeight -= 2;
      };
      //#endregion

      //#region TABLE BODY BORDER
      var addTableBodyBorder = (lineHeight) => {
        let startWidth = 0;
        for (let i = 0; i < param.invoice.header.length; i++) {
          const currentTdWidth = param.invoice.header[i]?.style?.width || tdWidth;
          if (i === 0) doc.rect(10, currentHeight, currentTdWidth, lineHeight);
          else {
            const previousTdWidth = param.invoice.header[i - 1]?.style?.width || tdWidth;
            const widthToUse = currentTdWidth == previousTdWidth ? currentTdWidth : previousTdWidth;
            startWidth += widthToUse;
            doc.rect(startWidth + 10, currentHeight, currentTdWidth, lineHeight);
          }
        }
      };
      //#endregion

      //#region TABLE HEADER
      var addTableHeader = () => {
        if (param.invoice.headerBorder) addTableHeaderBorder();

        doc.line(10, currentHeight, docWidth - 10, currentHeight);
        currentHeight += pdfConfig.subLineHeight;
        doc.setTextColor(colorBlack);
        doc.setFontSize(pdfConfig.fieldTextSize);
        //border color
        doc.setDrawColor(colorGray);
        currentHeight += 1;

        let startWidth = 0;
        param.invoice.header.forEach(function (row, index) {
          if (index == 0) doc.text(row.title, 11, currentHeight);
          else {
            const currentTdWidth = row?.style?.width || tdWidth;
            const previousTdWidth = param.invoice.header[index - 1]?.style?.width || tdWidth;
            const widthToUse = currentTdWidth == previousTdWidth ? currentTdWidth : previousTdWidth;
            startWidth += widthToUse;
            doc.text(row.title, startWidth + 11, currentHeight);
          }
        });

        currentHeight += pdfConfig.subLineHeight - 1;
        doc.line(10, currentHeight, docWidth - 10, currentHeight);
        doc.setTextColor(colorGray);
      };
      //#endregion

      addTableHeader();

      //#region TABLE BODY
      var tableBodyLength = param.invoice.table.length;
      param.invoice.table.forEach(function (row, index) {
        doc.line(10, currentHeight, docWidth - 10, currentHeight);

        //get nax height for the current row
        var getRowsHeight = function () {
          let rowsHeight = [];
          row.forEach(function (rr, index) {
            const widthToUse = param.invoice.header[index]?.style?.width || tdWidth;

            let item = splitTextAndGetHeight(rr.toString(), widthToUse - 1); //minus 1, to fix the padding issue between borders
            rowsHeight.push(item.height);
          });

          return rowsHeight;
        };
        
        var maxHeight = Math.max(...getRowsHeight());

        //body borders
        if (param.invoice.tableBodyBorder) addTableBodyBorder(maxHeight + 1);
        currentHeight += 5;
        let startWidth = 0;
        row.forEach(function (rr, index) {
          const widthToUse = param.invoice.header[index]?.style?.width || tdWidth;
          let item = splitTextAndGetHeight(rr.toString(), widthToUse - 1); //minus 1, to fix the padding issue between borders

          if (index == 0) doc.text(item.text, 11, currentHeight + 4);
          else {
            const currentTdWidth = rr?.style?.width || tdWidth;
            const previousTdWidth = param.invoice.header[index - 1]?.style?.width || tdWidth;
            const widthToUse = currentTdWidth == previousTdWidth ? currentTdWidth : previousTdWidth;
            startWidth += widthToUse;
            doc.text(item.text, 11 + startWidth, currentHeight + 4);
          }
        });

        currentHeight += maxHeight;

        //td border height
        currentHeight += 5;

        //pre-increase currentHeight to check the height based on next row
        if (index + 1 < tableBodyLength) currentHeight += maxHeight;

        if (
          param.orientationLandscape &&
          (currentHeight > 185 ||
            (currentHeight > 178 && doc.getNumberOfPages() > 1))
        ) {
          doc.addPage();
          currentHeight = 10;
          if (index + 1 < tableBodyLength) addTableHeader();
        }

        if (
          !param.orientationLandscape &&
          (currentHeight > 265 ||
            (currentHeight > 255 && doc.getNumberOfPages() > 1))
        ) {
          doc.addPage();
          currentHeight = 10;
          if (index + 1 < tableBodyLength) addTableHeader();
          //else
          //currentHeight += pdfConfig.subLineHeight + 2 + pdfConfig.subLineHeight - 1; //same as in addtableHeader
        }

        //reset the height that was increased to check the next row
        if (index + 1 < tableBodyLength && currentHeight > 30)
          // check if new page
          currentHeight -= maxHeight;
      });
      //doc.line(10, currentHeight, docWidth - 10, currentHeight); //if we want to show the last table line 
      //#endregion

      var invDescSize = splitTextAndGetHeight(
        param.invoice.invDesc,
        docWidth / 2
      ).height;

      //#region PAGE BREAKER
      var checkAndAddPageLandscape = function () {
        if (!param.orientationLandscape && currentHeight + invDescSize > 270) {
          doc.addPage();
          currentHeight = 10;
        }
      }

      var checkAndAddPageNotLandscape = function (heightLimit = 173) {
        if (param.orientationLandscape && currentHeight + invDescSize > heightLimit) {
          doc.addPage();
          currentHeight = 10;
        }
      }
      //#endregion

      checkAndAddPageNotLandscape();
      checkAndAddPageLandscape();

      doc.setTextColor(colorBlack);
      doc.setFontSize(pdfConfig.labelTextSize - 4);
      currentHeight += pdfConfig.lineHeight;

      //#region Line breaker before invoce total
      if (
        param.invoice.header.length &&
        (param.invoice.invSubTotal ||
          param.invoice.invSubTotalLabel ||
          param.invoice.invCurrency)
      ) {
        currentHeight += pdfConfig.lineHeight;
        currentHeight += pdfConfig.lineHeight;
        currentHeight += pdfConfig.lineHeight;
        currentHeight += pdfConfig.lineHeight;
      }
      //#endregion
      doc.setFontSize(param.invoice.row1.style.fontSize);

      doc.text(docWidth / 1.5, currentHeight, param.invoice.invSubTotalLabel);
      doc.text(docWidth - 25, currentHeight, param.invoice.invSubTotal, "right");
      doc.text(docWidth - 10, currentHeight, param.invoice.invCurrency, "right");

      currentHeight += pdfConfig.lineHeight -4;
      doc.line(docWidth / 1.5, currentHeight, docWidth - 10, currentHeight);
      //#region row1
 
      if (
        param.invoice.row1 &&
        (param.invoice.row1.col1 ||
          param.invoice.row1.col2 ||
          param.invoice.row1.col3)
      ) {
        currentHeight += pdfConfig.lineHeight;

        doc.text(docWidth / 1.5, currentHeight, param.invoice.row1.col1);
        doc.text(docWidth - 25, currentHeight, param.invoice.row1.col2, "right");
        doc.text(docWidth - 10, currentHeight, param.invoice.row1.col3, "right");
      }
      //#endregion
      currentHeight += pdfConfig.lineHeight -4;
      doc.line(docWidth / 1.5, currentHeight, docWidth - 10, currentHeight);

      //#region row2
      if (
        param.invoice.row2 &&
        (param.invoice.row2.col1 ||
          param.invoice.row2.col2 ||
          param.invoice.row2.col3)
      ) {
        currentHeight += pdfConfig.lineHeight;
        doc.setFontSize(param.invoice.row2.style.fontSize);

        doc.text(docWidth / 1.5, currentHeight, param.invoice.row2.col1);
        doc.text(docWidth - 25, currentHeight, param.invoice.row2.col2, "right");
        doc.text(docWidth - 10, currentHeight, param.invoice.row2.col3, "right");
      }
      //#endregion
      currentHeight += pdfConfig.lineHeight -4;
      doc.line(docWidth / 1.5, currentHeight, docWidth - 10, currentHeight);

      //#region Line breaker before invoce total
      if (
        param.invoice.header.length &&
        (param.invoice.invTotal ||
          param.invoice.invTotalLabel ||
          param.invoice.invCurrency)
      ) {
        currentHeight += pdfConfig.lineHeight;
      }
      //#endregion

      doc.text(docWidth / 1.5, currentHeight, param.invoice.invTotalLabel);
      doc.text(docWidth - 25, currentHeight, param.invoice.invTotal, "right");
      doc.text(docWidth - 10, currentHeight, param.invoice.invCurrency, "right");


      checkAndAddPageNotLandscape();
      checkAndAddPageLandscape();

      doc.setTextColor(colorBlack);
      currentHeight += pdfConfig.subLineHeight;
      currentHeight += pdfConfig.subLineHeight;
      //   currentHeight += pdfConfig.subLineHeight;
      doc.setFontSize(pdfConfig.labelTextSize);

      //#region Add num of pages at the bottom
      if (doc.getNumberOfPages() > 1) {
        for (let i = 1; i <= doc.getNumberOfPages(); i++) {
          doc.setFontSize(pdfConfig.fieldTextSize - 2);
          doc.setTextColor(colorGray);

          if (param.pageEnable) {
            doc.text(docWidth / 2, docHeight - 10, param.footer.text, "center");
            doc.setPage(i);
            doc.text(
              param.pageLabel + " " + i + " / " + doc.getNumberOfPages(),
              docWidth - 20,
              doc.internal.pageSize.height - 6
            );
          }

          checkAndAddPageNotLandscape(183);
          checkAndAddPageLandscape();
        }
      }
      //#endregion

      //#region INVOICE DESCRIPTION
      var addInvoiceDesc = () => {
        doc.setFontSize(pdfConfig.labelTextSize);
        doc.setTextColor(colorBlack);

        doc.text(param.invoice.invDescLabel, 10, currentHeight);
        currentHeight += pdfConfig.subLineHeight;
        doc.setTextColor(colorGray);
        doc.setFontSize(pdfConfig.fieldTextSize - 1);

        var lines = doc.splitTextToSize(param.invoice.invDesc, docWidth / 2);
        //text in left half
        doc.text(lines, 10, currentHeight);
        currentHeight +=
          doc.getTextDimensions(lines).h > 5
            ? doc.getTextDimensions(lines).h + 6
            : pdfConfig.lineHeight;

        return currentHeight;
      };
      addInvoiceDesc();
      //#endregion

      //#region Add num of first page at the bottom
      if (doc.getNumberOfPages() === 1 && param.pageEnable) {
        doc.setFontSize(pdfConfig.fieldTextSize - 2);
        doc.setTextColor(colorGray);
        doc.text(docWidth / 2, docHeight - 10, param.footer.text, "center");
        doc.text(
          param.pageLabel + "1 / 1",
          docWidth - 20,
          doc.internal.pageSize.height - 6
        );
      }
      //#endregion

      let returnObj = {
        pagesNumber: doc.getNumberOfPages(),
      };

      if (param.returnJsPDFDocObject) {
        returnObj = {
          ...returnObj,
          jsPDFDocObject: doc,
        };
      }

      if (param.outputType === "save") doc.save(param.fileName);
      else if (param.outputType === "blob") {
        const blobOutput = doc.output("blob");
        returnObj = {
          ...returnObj,
          blob: blobOutput,
        };
      } else if (param.outputType === "datauristring") {
        returnObj = {
          ...returnObj,
          dataUriString: doc.output("datauristring", {
            filename: param.fileName,
          }),
        };
      } else if (param.outputType === "arraybuffer") {
        returnObj = {
          ...returnObj,
          arrayBuffer: doc.output("arraybuffer"),
        };
      } else
        doc.output(param.outputType, {
          filename: param.fileName,
        });

      return returnObj;
    },
    submit() {
      this.loading = true
      try{
        this.downloadPdf()
      }catch(e) {
        console.log(e)
      }
      this.loading = false
    }
  },
  mounted() {
    this.payload = this.body
  }
}
</script>