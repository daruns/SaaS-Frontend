<template>
  <q-page>
    <div class="full-width flex justify-between items-center q-px-md  header-height-standard" style="border-bottom: 1px solid lightgrey;">
      <div class="text-h4">Projects</div>
      <div class="flex items-center">
        <q-btn @click="dialogue = true" color="primary" label="Create Record"  unelevated rounded no-caps />
      </div>
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
        {id:2,name:'Projects',icon: 'work',path: '/projects'}
        ],
    }
  }
}
</script>
