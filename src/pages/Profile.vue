<template>
    <q-page class="q-pa-md">
    <q-skeleton v-if="user === null" class="custom-skeleton-border" height="40vh" />
    <q-card v-else class="row items-center q-pa-md">
      <q-btn @click="dialogue = true" class="absolute-top-right q-mt-xs q-mr-xs" flat text-color="grey" size="sm" round unelevated icon="edit" color="primary" />
      <div class="flex items-center col-md-6 col-sm-12 q-pb-md avatar">
        <q-avatar :color="!user.avatar ? 'primary' : ''" size="120px">
            <img :src="user.avatar" />
        </q-avatar>
        <div>
        <p class="q-ml-md text-h5 text-weight-medium q-pb-sm q-mt-lg q-ma-none">{{user.name}}</p>
        </div>
      </div>
        <div class="row client-infos col-md-6 col-sm-12 q-pa-md" >
          <div class="column col-12">
            <div class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
              <p>Username:</p>
              <p class="text-grey">{{user.username}}</p>
            </div>
            <div class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
              <p>Phone:</p>
              <p class="text-grey">{{user.phoneNumber}}</p>
            </div>
            <div class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
              <p>E-mail:</p>
              <p class="text-grey">{{user.email}}</p>
            </div>
            <div class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
              <p>User type:</p>
              <p class="text-grey">{{user.userType}}</p>
            </div>
          </div>
        </div>
    </q-card>
    <q-dialog seamless position="right" v-model="dialogue">
        <modal @closeDialogue="this.getUser(); dialogue = false" :body="user" />
    </q-dialog>
    <q-skeleton v-if="this.user?.brand === null" class="custom-skeleton-border" height="40vh" />
    <q-card v-else v-show="user.userType === 'owner'" class="row items-center q-my-md q-pa-md">
      <div v-if="user?.userType === 'owner'" class="col-12 text-h6">Brand Info</div>
      <q-btn @click="brandDialogue = true" class="absolute-top-right q-mt-xs q-mr-xs" flat text-color="grey" size="sm" round unelevated icon="edit" color="primary" />
      <div class="flex items-center col-md-6 col-sm-12 q-pb-md avatar">
        <q-avatar :color="!user?.brand?.logo ? 'primary' : ''" size="120px">
            <img :src="user?.brand?.logo" />
        </q-avatar>
        <div>
        <p class="q-ml-md text-h5 text-weight-medium q-pb-sm q-mt-lg q-ma-none">{{user?.brand?.name}}</p>
        </div>
      </div>
        <div class="row client-infos col-md-6 col-sm-12 q-pa-md" >
          <div class="column col-12">
            <div class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
            <p>Subdomain:</p>
            <p class="text-grey">{{user?.brand?.subdomain}}</p>
            </div>
            <div class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
            <p>Phone Number:</p>
            <p class="text-grey">{{user?.brand?.phoneNumber}}</p>
            </div>
            <div class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
            <p>E-mail:</p>
            <p class="text-grey">{{user?.brand?.email}}</p>
            </div>
            <div class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
            <p>Website:</p>
            <p class="text-grey">{{user?.brand?.website}}</p>
            </div>
            <div class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
            <p>Company Size:</p>
            <p class="text-grey">{{user?.brand?.companySize}}</p>
            </div>
            <div class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
            <p>Address:</p>
            <p class="text-grey">{{user?.brand?.address}}</p>
            </div>
            </div>
          </div>
    </q-card>
    <q-dialog seamless position="right" v-model="brandDialogue">
        <brandModal @closeDialogue="this.getUser(); brandDialogue = false" :body="user?.brand" />
    </q-dialog>
    </q-page>
</template>
<script>
import modal from '../components/EditProfile.vue';
import brandModal from '../components/EditBrand.vue';
import { mapActions, mapState } from 'vuex'
import {ref} from 'vue'
export default {
    data() {
        return  {
          brand: ref(null),
          dialogue: false,
            brandDialogue: false,
            loading:false
        }
    },
    components: {
      modal,
        brandModal
    },
    computed : {
      ...mapState('example', ['user']),
    },
    methods : {
    ...mapActions('example', ['getUser']),
    },
    async mounted() {
      await this.getUser();
    },
}
</script>

<style scoped>

</style>