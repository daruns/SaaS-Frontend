<template>
  <div>
    <q-table
      :rows="inventoryItems"
      :columns="columns"
      row-key="id"
      :loading="loading"
      flat
      class="bg-secondary q-pt-md"
    >
      <template v-slot:body="props">
        <q-tr :class="props.rowIndex%2 !== 0 && 'bg-white'" :props="props">
          <q-td key="name" :props="props">
            <p style="font-size: 15px;margin:0 !important;">{{props.row.name}}</p>
          </q-td>
          <q-td key="description" v-html="props.row.description" :props="props">
          </q-td>
          <q-td key="unitPrice" :props="props">
              {{ props.row.unitPrice }}
          </q-td>
          <q-td key="qty" :props="props">
              {{ props.row.qty }}
          </q-td>
          <q-td key="purchasedAt" :props="props">
              {{ dateConversion(props.row.purchasedAt) }}
          </q-td>
          <q-td key="expireDate" :props="props">
              {{ dateConversion(props.row.expireDate) }}
          </q-td>
          <q-td key="supplier" :props="props">
              {{ props.row.supplier }}
          </q-td>
         <q-td key="actions" :props="props">
          <q-btn dense round flat icon="more_vert">
            <q-menu
              transition-show="scale"
              transition-hide="scale"
              
            >
              <q-list style="min-width: 75px">
                <q-item  @click="delItem(props.row.id)" style="padding 0 !important" clickable v-close-popup>
                  <q-item-section class="flex flex-center"><q-icon name="delete" color="negative" size="xs"></q-icon></q-item-section>
                </q-item>
                <q-separator />
                <q-item @click="edit(props.row)" clickable v-close-popup>
                 <q-item-section  class="flex flex-center"><q-icon name="edit" color="warning" size="xs"></q-icon></q-item-section>
                </q-item>
              </q-list>
            </q-menu>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog seamless position="right" v-model="prompt" persistent>
        <modal @closeDialogue="prompt = false" :action="action" :body="body" />
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { date } from 'quasar'
import modal from './AddEditItem.vue'
export default {
  data() {
    return {
    prompt: false,
    loading: false,
    action: '',
    body: {},
    columns : [
    { name: 'name', align: 'left', label: 'Name', field: 'name'},
    { name: 'description', align: 'left', label: 'Description', field: 'description'},
    { name: 'unitPrice', label: 'Unit price', align: 'left', field: 'unitPrice' },
    { name: 'qty', align: 'left', label: 'Quantity', field: 'qty'},
    { name: 'purchasedAt', align: 'left', label: 'Purchased at', field: 'purchasedAt'},
    { name: 'expireDate', align: 'left', label: 'Expire date', field: 'expireDate'},
    { name: 'supplier', align: 'left', label: 'Supplier', field: 'supplier'},
    { name: 'actions', align: 'left', label: 'Actions', field: 'actions'}
  ]
   }
  },
  components: {
      modal
  },
  computed : {
      ...mapState('accountingStore', ['inventoryItems'])
  },
  methods: {
      ...mapActions('accountingStore', ['getInventoryItems','delItem']),
      rowColor(props) {
        if(props.rowIndex%2 !== 0)
        return 'background: #fff;'
      },
     dateConversion(dt) {
      let dtObj = new Date(dt);
      dtObj.setHours(dtObj.getHours() - 3)
       return date.formatDate(dtObj, 'YYYY-MM-DD HH:mm');
    },
    edit(payload) {
        this.body = payload;
        this.action = 'Edit'; 
        this.prompt = true;
    }
  },
async mounted() {
     await this.getInventoryItems()
  }
}
</script>
