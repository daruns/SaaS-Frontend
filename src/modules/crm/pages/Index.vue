<template>
  <q-page class="q-py-none q-my-none">
    <div class="full-width flex justify-between items-center header-height-standard q-px-md" style="border-bottom: 1px solid lightgrey;">
      <div class="text-h4">CRM</div>
      <div class="flex items-center">
        <div class="flex flex-center bg-secondary q-mr-sm">
          <q-btn class="q-mr-xs" @click="table=true" outline style="color: goldenrod;" :color="table ? 'primary' : 'grey'" icon="view_headline" />
          <q-btn @click="table=false" outline style="color: goldenrod;" :color="!table ? 'primary' : 'grey'" icon="apps" />
        </div>
        <q-btn @click="dialogue = true" color="primary" :label="'Add '+tab[0].toUpperCase()+tab.substr(1, tab.length)" unelevated rounded no-caps />
      </div>
    </div>
    <breadcrmps class="q-pa-md full-width" :map="crumps" />
    <q-scroll-area style="max-height:auto !important;min-height:auto !important;height: calc(100vh - 131px);" class="q-px-md">
        <div class="q-pr-md q-pl-md">
          <q-tabs
          bordered
          v-model="tab"
          dense
          class="text-grey q-mt-md bg-white rounded-borders bordered"
          active-color="primary"
          indicator-color="primary"
          no-caps
          align="justify"
        >
          <q-tab name="client" label="Clients" />
          <q-tab name="lead" label="Leads" />
          <q-tab name="blacklist" label="Black list" />
        </q-tabs>
      </div>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel class="bg-secondary" name="client">
            <grid type="client" v-show="!table" />
            <tbl v-show="table" type="client" />
        </q-tab-panel>

        <q-tab-panel name="lead">
          <grid type="lead" v-show="!table" />
          <tbl v-show="table" type="lead" />
        </q-tab-panel>

        <q-tab-panel name="blacklist">
          <grid type="blacklist" v-show="!table" />
          <tbl v-show="table" type="blacklist"/>
        </q-tab-panel>
      </q-tab-panels>
      <q-dialog seamless position="right" v-model="dialogue">
        <modal @closeDialogue="dialogue = false" :type="tab" actionType="Add" :id="{}" />
      </q-dialog>
    </q-scroll-area>
  </q-page>
</template>
<script>
import breadcrumps from '../../../components/globalComponents/BreadCrumps.vue';
import table from '../components/ClientTable.vue';
import { ref } from 'vue';
import grid from '../components/ClientGrid.vue'
import AddEditClient from '../components/AddEditClient.vue'
export default {
    components: {
        breadcrmps: breadcrumps,
        tbl: table,
        grid,
        modal: AddEditClient
    },
    data() {
        return {
            table: false,
            crumps: [
                {id:1,name:'OneConnect',icon: 'home',path: '/'},
                {id:2,name:'CRM',icon: 'groups',path: '/crm'}
                ],
                dialogue: false
        }
    },
    setup() {
        return {
        tab: ref('client'),
        }
    }
}
</script>

<style scoped>

</style>