<template>
  <q-page class="q-py-none q-my-none">
    <div class="full-width flex justify-between items-center header-height-standard q-px-md" style="border-bottom: 1px solid lightgrey;">
      <div class="text-h4">Departments</div>
      <div class="flex items-center">
        <q-btn @click="dialogue = true" color="primary" :label="'Add '+tab[0].toUpperCase()+tab.substr(1, tab.length)" unelevated rounded no-caps />
      </div>
    </div>
    <q-scroll-area style="max-height:auto !important;min-height:auto !important;height: calc(100vh - 131px);" class="q-px-md">
      <tbl />
      <q-dialog seamless position="right" v-model="dialogue">
        <modal @closeDialogue="dialogue = false" :type="tab" actionType="Add" :id="{}" />
      </q-dialog>
    </q-scroll-area>
  </q-page>
</template>
<script>
import table from '../components/DepartmentTable.vue';
import { ref } from 'vue';
import AddEditDepartment from '../components/AddEditDepartment.vue'
export default {
    components: {
        tbl: table,
        modal: AddEditDepartment
    },
    data() {
      return {
        dialogue: false
      }
    },
    setup() {
        return {
        tab: ref('department'),
        }
    }
}
</script>

<style scoped>

</style>