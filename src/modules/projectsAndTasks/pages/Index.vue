<template>
    <q-page class="q-pa-md">
     <div class="flex justify-between items-center">
       <div>
        <p class="text-h4">Projects</p>
        <breadcrmps :map="crumps" />
        </div>
        <q-btn @click="dialogue = true" color="primary" label="Create Record"  unelevated rounded no-caps />
        </div>
    <projects />
    <q-dialog seamless position="right" v-model="dialogue">
        <modal @closeDialogue="dialogue = false" actionType="Add"  />
    </q-dialog>
    </q-page>
</template>
<script>
import breadcrmps from '../../../components/globalComponents/BreadCrumps.vue';
import Projects from '../components/ProjectGrid.vue';
import modal from '../components/AddEditProject.vue'
export default {
components : {
    breadcrmps,
    Projects,
    modal
},
data() {
  return {
      dialogue: false,
  }
},
  setup () {
    return {
      crumps: [
        {id:1,name:'OneConnect',icon: 'home',path: '/'},
        {id:2,name:'Projects',icon: 'work',path: '/users'}
        ],
    }
  }
}
</script>
