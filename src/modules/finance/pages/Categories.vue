<template>
  <q-page class="q-py-none q-my-none">
    <div class="full-width flex justify-between items-center q-px-md header-height-standard" style="border-bottom: 1px solid lightgrey;">
      <div class="text-h4">Category</div>
      <div class="flex items-center">
        <q-btn @click="action = 'Add';prompt = true" color="primary" label="Create Record" unelevated rounded no-caps />
      </div>
    </div>
    <breadcrumps class="q-pa-md full-width" :map="crumps" />
    <div class="q-px-md full-width justify-stretch column inline" style="max-height:auto !important;min-height:auto !important;height: calc(100vh - 131px);">
      <q-scroll-area
        class="col-12 items-start flex column"
      >
        <q-table
          :rows="categories"
          :columns="columns"
          row-key="id"
          :loading="loading"
          flat
          class="bg-secondary q-pt-md"
        >
          <template v-slot:body="props">
            <q-tr :class="props.rowIndex%2 !== 0 && 'bg-white'" :props="props">
              <q-td auto-width>
                <q-btn
                  size="sm"
                  color="primary"
                  round
                  dense
                  @click="e => {
                    expandChildSubCat = false;
                    sub = null
                    childSub = null
                    if (props.expand && expandSubId === props.row.id) {
                      props.expand = false
                      expandSubId = null
                    } else {
                      expandSubId = props.row.id
                      props.expand = true
                    }
                  }"
                  :icon="props.expand && expandSubId === props.row.id ? 'remove' : 'add'"
                />
              </q-td>
              <q-td key="name" :props="props">
                <p style="font-size: 15px;margin:0 !important;">{{props.row.name}}</p>
              </q-td>
              <q-td key="description" v-html="props.row.description" :props="props">
              </q-td>
              <q-td key="actions" :props="props">
                <q-btn dense round flat icon="more_vert">
                  <q-menu
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-list style="min-width: 75px">
                      <q-item  @click="deleteCategory({id: props.row.id})" style="padding 0 !important" clickable v-close-popup>
                        <q-item-section class="flex flex-center"><q-icon name="delete" color="negative" size="xs"></q-icon></q-item-section>
                      </q-item>
                      <q-separator />
                      <q-item @click="edit(props.row)" clickable v-close-popup>
                      <q-item-section  class="flex flex-center"><q-icon name="edit" color="warning" size="xs"></q-icon></q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-td>
            </q-tr>
              <q-tr v-show="props.expand && expandSubId === props.row.id" :props="props">
              <q-td colspan="100%">
                <div class="flex">
                <p class="text-h6 col">Sub categories</p>
                <!-- <q-btn color="primary" icon="add" no-caps flat> -->
                <!-- </q-btn> -->
                </div>
                <div class="q-py-sm col">
                  <q-input dense filled v-model="sub">
                    <template v-slot:append>
                      <q-btn size="sm" no-caps :disable="sub === ''" flat @click="addSubCateg(props.row.id,props.rowIndex)" class="bg-primary" color="white" v-close-popup >
                        <q-spinner-tail v-if="subLoading && subLoading[0] === true && subLoading[1] === props.rowIndex" color="white"/>
                        <div v-else >Add</div>
                      </q-btn>
                    </template>
                  </q-input>
                </div>
                <div v-if="props.row.expenseSubCategories.length === 0">No sub-categories found.</div>

                <div v-for="(expenseSubCategory, index) in props.row.expenseSubCategories" :key="index" class="flex row col-12 items-center q-py-sm">

                  <div class="col-12 flex row">
                    <div class="items-start col-12 flex row">
                        <q-input
                          :readonly="editingSubCat !== index"
                          v-model="expenseSubCategory.name"
                          :dense="true"
                          outlined
                          class="col-12"
                          :placeholder="expenseSubCategory.name"
                        >
                          <template v-slot:before>                        
                            <q-btn
                              dense
                              size="sm"
                              color="primary"
                              round
                              @click="e => {
                                if (expandChildSubCat && expandChildSubCat[0] && expandChildSubCat[1] === index) {
                                  expandChildSubCat = false
                                } else {
                                  expandChildSubCat = [true, index]
                                }
                              }"
                              class="q-mr-sm"
                              :icon="expandChildSubCat && expandChildSubCat[0] && expandChildSubCat[1] === index ? 'remove' : 'add'"
                            />
                          </template>
                          <template v-slot:append>
                            <q-spinner-tail v-if="i === index"/>
                            <q-btn
                              dense
                              v-show="editingSubCat === index"
                              v-else
                              :disable="subs === expenseSubCategory.name || subs === null"
                              no-caps
                              flat
                              @click="subs = expenseSubCategory.name;editSubCateg(expenseSubCategory.id, props.row.id); i = index;editingSubCat = null"
                              class="bg-green"
                              color="white"
                              icon="check"
                            />
                          </template>
                          <template v-slot:after>
                            <q-btn
                              dense
                              no-caps
                              flat
                              @click="editingSubCat = index;"
                              color="amber"
                              icon="edit"
                            />
                            <q-spinner-tail v-if="loadingDeleteSubCat === expenseSubCategory.id"/>
                            <q-btn
                              v-else
                              no-caps
                              flat
                              dense
                              icon="delete"
                              @click="deleteSubCateg(expenseSubCategory.id)"
                              color="negative"
                            />
                          </template>
                        </q-input>
                    </div>


                    <!-- Child Sub Category -->

                    <div v-if="expandChildSubCat && expandChildSubCat[0] === true && expandChildSubCat[1] === index" class="q-pa-md q-pl-xl col-12 row flex">
                      <p class="text-h4 col">Childs of Sub category</p>
                        <!-- <q-btn color="primary" icon="add" no-caps flat> -->
                        <!-- </q-btn> -->
                      <div class="q-py-sm col-12">
                        <q-input dense filled v-model="childSub">
                          <template v-slot:append>
                            <q-btn size="sm" no-caps :disable="childSub === ''" flat @click="addChildSubCateg(props.row.expenseSubCategories[index].id,props.row.expenseSubCategories[index].id)" class="bg-primary" color="white" v-close-popup >
                              <q-spinner-tail v-if="childSubLoading && childSubLoading[0] === true && childSubLoading[1] === props.row.expenseSubCategories[index].id" color="white"/>
                              <div v-else >Add</div>
                            </q-btn>
                          </template>
                        </q-input>
                      </div>

                      <div class="col-12" v-if="props.row.expenseSubCategories[index].expenseChildSubCategories.length === 0">No child-sub-categories found.</div>

                      <div v-for="(expenseChildSubCategory, index1) in props.row.expenseSubCategories[index].expenseChildSubCategories" :key="index1" class="flex row col-12 items-center q-py-sm">
                        <div class="items-start col-12 flex row">
                          <q-input
                            :readonly="editingChildSubCat !== index1"
                            v-model="expenseChildSubCategory.name"
                            :dense="true"
                            outlined
                            class="col-12"
                            :placeholder="expenseChildSubCategory.name"
                          >
                            <template v-slot:before>
                              <q-icon
                                name="fiber_manual_record"
                                class="q-mr-sm"
                              />
                            </template>
                            <template v-slot:append>
                              <q-spinner-tail v-if="iChild === index1"/>
                              <q-btn
                                dense
                                v-show="editingChildSubCat === index1"
                                v-else
                                :disable="childSubs === expenseChildSubCategory.name || childSubs === null"
                                no-caps
                                flat
                                @click="childSubs = expenseChildSubCategory.name;editChildSubCateg(expenseChildSubCategory.id); iChild = index1; editingChildSubCat = null"
                                class="bg-green"
                                color="white"
                                icon="check"
                              />
                            </template>
                            <template v-slot:after>
                              <q-btn
                                dense
                                no-caps
                                flat
                                @click="editingChildSubCat = index1"
                                color="amber"
                                icon="edit"
                              />
                              <q-spinner-tail v-if="loadingDeleteChildSubCat === expenseChildSubCategory.id"/>
                              <q-btn
                                v-else
                                no-caps
                                flat
                                dense
                                icon="delete"
                                @click="deleteChildSubCat(expenseChildSubCategory.id)"
                                color="negative"
                              />
                            </template>
                          </q-input>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-scroll-area>
    </div>
    <q-dialog seamless position="right" v-model="prompt" persistent>
        <modal @closeDialogue="prompt = false; getCategories();" :actionType="action" :body="body" />
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import modal from '../components/AddEditCategories.vue'
import breadcrumps from '../../../components/globalComponents/BreadCrumps.vue';
export default {
  data() {
    return {
      editingChildSubCat: null,
      editingSubCat: null,
      loadingDeleteChildSubCat: null,
      loadingDeleteSubCat: null,
      expandSubId: null,
      expandChildSubId: null,
      prompt: false,
      loading: false,
      expandChildSubCat: false,
      subLoading: false,
      childSubLoading: false,
      subs: '',
      childSubs: '',
      sub: '',
      childSub: '',
      i: null,
      iChild: null,
      action: '',
      body: {},
      crumps: [
        {id:1,name:'OneConnect',icon: 'home',path: '/'},
        {id:2,name:'Category',icon: 'category',path: '/finance/categories'}
      ],
      columns : [
        { name: '#', align: 'center', label: '#', field: '#'},
        { name: 'name', align: 'left', label: 'Name', field: 'name'},
        { name: 'description', align: 'left', label: 'Description', field: 'description'},
        { name: 'actions', align: 'left', label: 'Actions', field: 'actions'}
      ]
    }
  },
  components: {
    breadcrumps,
    modal
  },
  computed : {
      ...mapState('financeStore', ['categories'])
  },
  methods: {
      ...mapActions('financeStore', ['getCategories','addChildSubCategory','addSubCategory','deleteChildSubCategory','deleteSubCategory' , 'editChildSubCategory', 'editSubCategory','deleteCategory']),
      rowColor(props) {
        if(props.rowIndex%2 !== 0)
        return 'background: #fff;'
      },
     async editSubCateg(id, expenseCategoryId) { 
      await this.editSubCategory({id:id, expenseCategoryId: expenseCategoryId, name: this.subs});
         this.i = null
      },
     async editChildSubCateg(id) { 
      await this.editChildSubCategory({id:id, name: this.childSubs});
         this.iChild = null
      },
     async addSubCateg(expenseCategoryId,indx) { 
       this.subLoading = [true,indx];
        await this.addSubCategory({expenseCategoryId: expenseCategoryId, name: this.sub});
        this.sub=null
        this.subLoading = false;
      },
     async addChildSubCateg(expenseSubCategoryId,indx) { 
       this.childSubLoading = [true,indx];
        await this.addChildSubCategory({expenseSubCategoryId: expenseSubCategoryId, name: this.childSub});
        this.childSub = null
        this.childSubLoading = false;
      },
    edit(payload) {
        this.body = payload;
        this.action = 'Edit'; 
        this.prompt = true;
    },
    async deleteChildSubCat(id) {
      this.loadingDeleteChildSubCat = id
      await this.deleteChildSubCategory({id: Number(id)})
      this.loadingDeleteChildSubCat = null
    },
    async deleteSubCateg(id) {
      this.loadingDeleteSubCat = id
      await this.deleteSubCategory({id: Number(id)})
      this.loadingDeleteSubCat = null
    }
  },
  async mounted() {
    await this.getCategories();
  }
}
</script>
