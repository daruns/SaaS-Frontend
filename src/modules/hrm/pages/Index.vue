<template>
  <q-page class="q-py-none q-my-none">
    <div class="full-width flex justify-between items-center header-height-standard q-px-md" style="border-bottom: 1px solid lightgrey;">
      <div class="text-h4">Employees</div>
      <div class="flex items-center">
        <!-- <div class="flex flex-center bg-secondary q-mr-sm">
          <q-btn class="q-mr-xs" @click="table=true" outline style="color: goldenrod;" :color="table ? 'primary' : 'grey'" icon="view_headline" />
          <q-btn @click="table=false" outline style="color: goldenrod;" :color="!table ? 'primary' : 'grey'" icon="apps" />
        </div> -->
        <q-btn v-if="canActivate('subject_hrm','create')" @click="dialogue = true" color="primary" :label="'Add '+tab[0].toUpperCase()+tab.substr(1, tab.length)" unelevated rounded no-caps />
      </div>
    </div>
    <div v-if="!canActivate('subject_hrm','read') || (user?.myEmployeeProfile && !user?.myEmployeeProfile.hrMember)">
      <Forbidden />
    </div>
    <q-scroll-area v-else style="max-height:auto !important;min-height:auto !important;height: calc(100vh - 131px);" class="q-px-md">
      <grid v-show="!table" />
      <!-- <tbl v-show="table" /> -->
      <q-dialog seamless position="right" v-model="dialogue">
        <modal @closeDialogue="dialogue = false" actionType="Add" :id="{}" />
      </q-dialog>
    </q-scroll-area>
  </q-page>
</template>
<script>
// import table from '../components/EmployeeTable.vue';
import { ref } from 'vue';
import grid from '../components/EmployeeGrid.vue'
import AddEditEmployee from '../components/AddEditEmployee.vue'
import Forbidden from 'src/components/globalComponents/Forbidden.vue';

export default {
    components: {
    // tbl: table,
    grid,
    modal: AddEditEmployee,
    Forbidden
},
    data() {
      return {
        canActivate: this.$canActivate,
        table: false,
        dialogue: false
      }
    },
    setup() {
      return {
      tab: ref('employee'),
    }
  }
}
</script>

<style scoped>

</style>