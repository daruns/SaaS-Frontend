<template>
<q-layout style="width: 550px !important;">
     <q-card style="max-width: 550px; min-height:100vh;" flat square>
     <q-toolbar class="bg-grey-3" style="position:sticky !important; top:0;z-index:15;">
            <q-toolbar-title>
                {{action  + ' '}} Board
            </q-toolbar-title>
            <q-btn icon="close" flat round dense v-close-popup />
    </q-toolbar>
    <q-card-section class="q-gutter-md scroll">
          <q-input ref="nameRef" :rules="[val => (val && val.length !== 0) || 'This field is required']" outlined v-model="board.name" label="Name" />
       <q-input
        label="Board color"
        readonly
        outlined
        v-model="board.color"
        ref="colorRef"
        :rules="[val => (val && val.length !== 0) || 'This field is required']"
      >
            <q-popup-proxy class="pop" cover transition-show="scale" transition-hide="scale">
                              <div class="column qu-gutter-sm">
                <div class="flex items-center justify-start">
                 <q-radio size="sm" v-model="board.color" val="#308be5" />
                 <i class="fas fa-square q-pr-sm" style="font-size: 25px;color:#308be5;"></i>
                </div>
                 <div  class="flex items-center justify-start">
                 <q-radio size="sm" v-model="board.color" val="#1d1d1d" />
                 <i class="fas fa-square" style="font-size: 25px;color:#1d1d1d;"></i>
                </div>
                <div  class="flex items-center justify-start">
                 <q-radio size="sm" v-model="board.color" val="#82b865" />
                 <i class="fas fa-square" style="font-size: 25px;color:#82b865;"></i>
                </div>
                <div  class="flex items-center justify-start">
                 <q-radio size="sm" v-model="board.color" val="#cc444b" />
                 <i class="fas fa-square" style="font-size: 25px;color:#cc444b;"></i>
                </div>
                <div  class="flex items-center justify-start">
                 <q-radio size="sm" v-model="board.color" val="#ffae30" />
                 <i class="fas fa-square" style="font-size: 25px;color:#ffae30;"></i>
                </div>
                </div>
            </q-popup-proxy>
        <!-- <template v-slot:append>
          <q-icon name="colorize" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-color v-model="board.color"></q-color>
            </q-popup-proxy>
          </q-icon>
        </template> -->
        <template v-slot:append>
            <i class="fas fa-square" :style="`color: ${board.color}`" style="font-size: 25px;"></i>
        </template>
      </q-input>
    </q-card-section>
    </q-card>
          <q-toolbar class="bg-grey-3" style="position:sticky !important; bottom:0;z-index:5;">
            <q-btn :loading="loading" @click="submit" label="Submit" no-caps type="reset" color="primary" unelevated class="full-width" />
    </q-toolbar>
</q-layout>
</template>
<script>
import { mapActions } from 'vuex'
export default {
    props: ['body','action'],
    data() {
        return {
            id: null,
            loading: false,
            board : {
                name: '',
                color: '#308be5',
                position: 0
            }
        }
    },
    methods: {
        ...mapActions('projectStore',['addBoard', 'editBoard']),
       async submit() {
            this.$refs.nameRef.validate();
            this.$refs.colorRef.validate();
            if(
            this.$refs.nameRef.hasError ||
            this.$refs.colorRef.hasError
            )
            return
            this.loading = true;
            this.board.position = Number(this.board.position)
            if(this.action === 'Add') {
               await this.addBoard(this.board);
            }else if(this.action === 'Edit'){
              await this.editBoard({...this.board, id:this.id})
            }
            this.loading = false
            this.$emit('closeDialogue');
        }
    },
    mounted() {
        if(this.action === 'Edit') {
            this.board.name = this.body.name
            this.board.color = this.body.boardAttribute.color
            this.id = this.body.id
        }
    }
}
</script>
<style lang="sass" scoped>
.my-picker
  width: 250px
</style>