<template>
      <q-card style="width:25rem !important;min-width:300px !important">
        <q-card-section>
          <div class="text-h6 q-pb-sm">{{task.name}}</div>
          <p class="text-caption q-mb-none">Start date: {{dateConversion(task.plannedStartDate)}}</p>
          <p class="text-caption">Deadline: {{dateConversion(task.plannedEndDate)}}</p>
        </q-card-section>
        <q-card-section style="word-break: break-all;" v-html="task.description" class="q-pt-none">
        </q-card-section>
        <q-card-section class="q-pt-none flex column">
             <p class="text-caption text-grey-7 q-ma-none" v-show="task.memberUsers.length !== 0">Assigned users:</p>
             <div class="flex">
             <div  v-for="(member,i) in task.memberUsers" :key="member.id">
               <q-chip>
                    <q-avatar>
                      <img src="~/assets/one_logo_neat.png">
                    </q-avatar>
                    {{member.name}}
                  </q-chip>
              </div>
             </div>
              <p class="text-caption text-grey-7" v-show="task.memberUsers.length === 0">No one has been assigned to this task!</p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="negative" flat label="Close" v-close-popup />
        </q-card-actions>
        <q-chip :class="priority(task.priority)" class="absolute-top-right q-mr-sm q-mt-sm" no-caps :color="priority(task.priority)">{{task.priority}}</q-chip>
      </q-card>
</template>
<script>
import { date } from 'quasar';
export default {
    props: ['task'],
    methods: {
    dateConversion(dt) {
      let dtObj = new Date(dt);
      dtObj.setHours(dtObj.getHours() - 3)
       return date.formatDate(dtObj, 'YYYY-MM-DD HH:mm');
    },
    priority(priority) {
      switch(priority){

      case 'High':
      return 'text-positive bg-green-1'

      case 'Medium':
      return 'text-warning bg-yellow-2'

      case 'Low':
      return 'text-negative bg-red-1'
      }
    }
    }
}
</script>
<style scoped>
div.q-avatar div.q-avatar__content img {
    border: none !important;
}
</style>