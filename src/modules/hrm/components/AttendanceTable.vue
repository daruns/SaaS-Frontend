<template>
  <div class="q-py-sm">
      <q-btn class="q-pa-xl" v-if="attendances && attendances?.reverse()[0]?.checkedIn" label="Check-In" color="primary" @click="autoCloseDialogue()" />
      <q-btn class="q-pa-xl" v-else label="Check-Out" color="red" @click="autoCloseDialogue()" />
    <q-table
      :rows="attendances"
      :columns="columns"
      row-key="id"
      :loading="loading"
      flat
      class="bg-secondary q-py-md"
    >
      <template v-slot:body="props">
        <q-tr :class="props.rowIndex%2 !== 0 && 'bg-white'" :props="props">
          <q-td :class="'text-white items-center justify-center ' + (props.row.checkedIn ? 'bg-primary' : 'bg-red' )" key="checkedIn" :props="props">
            <p style="font-size: 20px;">{{props.row.checkedIn ? 'In' : 'Out'}}</p>
          </q-td>
          <q-td class="items-center justify-start" key="checkBy" :props="props">
            <p style="font-size: 20px;">{{props.row.createdBy}}</p>
          </q-td>
          <q-td class="items-center justify-start" key="date" :props="props">
            <p style="font-size: 20px;">{{(props.row?.createdAt?.split('T')[0])}}</p>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  computed: {
    ...mapState('hrmStore', ['attendances']),
  },

  data() {
    return {
      id: null,
      loading: false,
      columns : [
        { name: 'checkedIn', label: 'Check In/Out', align: 'left', field: 'checkedIn' },
        { name: 'checkBy', label: 'Checked By', align: 'center', field: 'checkBy'},
        { name: 'date', label: 'Date', align: 'right', field: 'date'}
      ]
    }
  },
  methods: {
    ...mapActions('hrmStore',['createAttendance', 'getAttendances']),
    async autoCloseDialogue () {
        await this.createAttendance()
        this.getAttendances()
    },
     rowColor(props) {
        if(props.rowIndex%2 !== 0 || props.rowIndex !== 0  )
        return 'background: #fff;'
      }
  },
 async mounted() {
   this.loading = true
   await this.getAttendances();
   this.loading=false
  }
}
</script>