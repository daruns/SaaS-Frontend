<template>
  <q-page class="q-py-none q-my-none">
    <div class="full-width flex justify-between items-center header-height-standard q-px-md" style="border-bottom: 1px solid lightgrey;">
      <div class="text-h4">Attendances</div>
      <div class="flex items-center">
      </div>
    </div>
    <div v-if="!canActivate('subject_hrm','read')">
      <Forbidden />
    </div>
    <q-scroll-area v-else style="max-height:auto !important;min-height:auto !important;height: calc(100vh - 131px);" class="q-px-md">
      <tbl :currentUser="user"/>
      <q-dialog seamless position="right" v-model="dialogue">
        <modal @closeDialogue="dialogue = false" :type="tab" actionType="Add" :id="{}" />
      </q-dialog>
    </q-scroll-area>
  </q-page>
</template>
<script>
import table from '../components/AttendanceTable.vue';
import { ref } from 'vue';
import { mapState,mapActions } from 'vuex';
import Forbidden from 'src/components/globalComponents/Forbidden.vue';
export default {
    components: {
    tbl: table,
    Forbidden
},
    computed: {
    ...mapState('example', ['user'])
    },
    data() {
      return {
                canActivate: this.$canActivate,
        dialogue: false
      }
    },
    methods: {
      ...mapActions('example', ['getUser']),
    },
    setup() {
      return {
        tab: ref('leaveType'),
      }
    },
    async mounted() {
      await this.getUser()
    },
}
</script>

<style scoped>

</style>