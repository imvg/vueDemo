<template>
  <div>
    <div class="content-root">
      <div class="content">
        <div class="head-text">
          <h1>落地页CDN域名列表</h1>
          <h2>NICE正常状态, EXPIRED已做跳转或者不再使用的域名, FAILED无法使用的异常域名</h2>
        </div>
        <div class="content-body">
          <a-table :columns="columns"
                   :data-source="domainList"
                   rowKey="domain"
                   :pagination="false"
                   :scroll="{ y: 620 }"
                   :loading="loading">
            <template #customDomain>
              <span>
                <smile-outlined />
                域名列表
              </span>
            </template>

            <template #domain="{ text: domain }">
              <a :href="domain" target="_blank">{{ domain }}</a>
            </template>

            <template #status="{ text: status }">
              <span>
                <a-tag :key="status" :color="status === 'Nice' ? 'green' : status === 'Failed' ? 'brown' : status === 'Expired' ? 'yellow' : status">
                  {{ status.toUpperCase() }}
                </a-tag>
              </span>
            </template>

            <template #belong="{ text: belong }">
              <span>
                <a-tag :key="belong" :color="belong === belong ? 'blue' : belong">
                  {{ belong }}
                </a-tag>
              </span>
            </template>

            <template #agent="{ text: agent }">
              <span>
                <a-tag :key="agent" :color="agent === agent ? 'pink' : agent">
                  {{ agent }}
                </a-tag>
              </span>
            </template>

            <template #account="{ text: account }">
              <span>
                <a-tag :key="account" :color="account === account ? 'purple' : account">
                  {{ account }}
                </a-tag>
              </span>
            </template>

            <template #customTips>
              <span>
                <div style="float: left; padding: 5px;">
                  <smile-outlined />
                  备注
                </div>

                <div style="float: right; margin: 0; padding-left: 10px;">
                <a-button type="primary" @click="showModal">设置跳转</a-button>
                <a-modal
                    title="设置301跳转"
                    v-model:visible="dumpVisible"
                    :confirm-loading="dumpConfirmLoading"
                    @ok="dumpRequest"
                >
                  <p>选择要跳转的域名，再填写跳转的目的域名即可</p>
                  <a-select
                      v-model:value="dumpDomain"
                      mode="tags"
                      style="width: 100%"
                      placeholder="选择要跳转的域名"
                      :options="domainList"
                      @change="selectDumpDomain"
                  >
                  </a-select>
                  <div style="margin: 24px 0" />
                  <a-input v-model:value="dumpTo" placeholder="填写跳转的目的域名"/>
                  <template #footer>
                    <a-button key="back" :disabled="lockCancel" @click="dumpCacel">取消</a-button>
                    <a-button key="submit" type="primary" :loading="dumpConfirmLoading" @click="dumpRequest">提交</a-button>
                  </template>
                </a-modal>
              </div>
              </span>
            </template>

          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue';
import { ref, defineComponent } from 'vue';
import {Modal, notification} from "ant-design-vue";
import axios from "axios";

const domainList = ref([]);
const columns = [
  {key: 'domain', dataIndex: 'domain', width: "30%", slots: { title: 'customDomain', customRender: 'domain' }},
  {title: '状态', key: 'status', dataIndex: 'status', slots: { customRender: 'status' }, width: "10%", filters: [
      {text: 'Nice', value: 'Nice',},
      {text: 'Failed',value: 'Failed'},
      {text: 'Expired',value: 'Expired'},
    ],
    filterMultiple: false,
    onFilter: (value: string, record: TableDataType) => record.status.indexOf(value) === 0,
    sorter: (a: TableDataType, b: TableDataType) => a.status.length - b.status.length,
    sortDirections: ['descend', 'ascend'],
  },
  {title: '所属商户', key: 'belong', dataIndex: 'belong', slots: { customRender: 'belong' }, width: "13%", filters: [
      {text: '撸呗视频', value: '撸呗视频',}
    ],
    filterMultiple: false,
    onFilter: (value: string, record: TableDataType) => record.belong.indexOf(value) === 0,
    sorter: (a: TableDataType, b: TableDataType) => a.belong.length - b.belong.length,
    sortDirections: ['descend', 'ascend']},
  {title: '所属代理', key: 'agent', dataIndex: 'agent', slots: { customRender: 'agent' }, width: "12%"},
  {title: '云账户', key: 'account', dataIndex: 'account', slots: { customRender: 'account' }, width: "15%", filters: [
      {text: 'xyaccount', value: 'xyaccount'},
      {text: 'miliaccount', value: 'miliaccount'},
      {text: 'qzh7537', value: 'qzh7537'},
      {text: 'beiyong889900', value: 'beiyong889900'},
    ],
    filterMultiple: false,
    onFilter: (value: string, record: TableDataType) => record.account.indexOf(value) === 0,
    sorter: (a: TableDataType, b: TableDataType) => a.account.length - b.account.length,
    sortDirections: ['descend', 'ascend']},
  {key: 'tips', dataIndex: 'tips', width: "20%", slots: { title: 'customTips', customRender: 'tips' }},
]
const loading = ref<boolean>(true)

const dumpVisible = ref<boolean>(false);
const dumpConfirmLoading = ref<boolean>(false);
const dumpDomain = ref([])
const dumpTo = ref<string>('')
const lockCancel = ref<boolean>(false)

export default defineComponent({
  setup() {
    return {
      domainList,
      columns,
      loading,
      dumpVisible,
      dumpConfirmLoading,
      dumpDomain,
      dumpTo,
      lockCancel
    };
  },
  components: {
    SmileOutlined,
    DownOutlined,
  },
  methods: {
    showModal () {
      dumpVisible.value = true
    },
    dumpCacel () {
      dumpVisible.value = false;
      dumpConfirmLoading.value = false;
    },
    dumpRequest () {
      var dumpDomains = []
      for (var i=0; i<dumpDomain.value.length; i++){
        for (var a=0; a<domainList.value.length; a++){
          if (domainList.value[a]['domain'] === dumpDomain.value[i]){
            dumpDomains.push({'domain': dumpDomain.value[i], 'merchant': domainList.value[a]['belong']})
          }
        }
      }
      var postData = {'parms': {'domainList': dumpDomains, 'dumpTo': dumpTo.value.toString()}}
      console.log(postData)
      this.ajaxDump(postData)
    },
    selectDumpDomain (domain) {
      console.log(`选择了 ${domain}`)
    },
    ajaxDump (data) {
      try {
        lockCancel.value = true
        dumpConfirmLoading.value = true;
        axios.post('http://127.0.0.1:8899/setDump', data, {timeout:300000}).then(function(res){
          if (res.data['code'] === 0){
            notification['success']({message: '设置成功', description: '请手动验证是否可用',});
            dumpVisible.value = false;
            dumpConfirmLoading.value = false;
            lockCancel.value = false
          } else {
            console.log(res.data)
            Modal.error({title: '跳转设定异常',content: res.data['msg'],});
            dumpVisible.value = false;
            dumpConfirmLoading.value = false;
            lockCancel.value = false
          }
        },function(){
          notification['error']({message: 'API请求失败', description: '请检查API程序状态和日志',});
          dumpVisible.value = false;
          dumpConfirmLoading.value = false;
          lockCancel.value = false
        });
      } catch (e){
        notification['error']({message: '未知异常', description: e,});
        dumpVisible.value = false;
        dumpConfirmLoading.value = false;
        lockCancel.value = false
      }
    },
    getDomainList () {
      try {
        axios.post('http://autoapi.zlyc.net/getDomainList', '', {timeout:300000}).then(function(res){
          if (res.data['code'] === 0){
            var domains = []
            for (var i=0; i<res.data['data'].length; i++){
              domains.push({
                domain: res.data['data'][i]['domain'],
                status: 'Nice',
                belong: '撸呗视频',
                agent: 'mili',
                account: 'xyaccount',
                tips: res.data['data'][i]['tips'],
                value: res.data['data'][i]['domain']})
            }
            domainList.value = domains
            loading.value = false
          } else {
            console.log(res.data)
            Modal.error({title: '获取失败',content: res.data['msg'],});
            loading.value = false
          }
        },function(){
          notification['error']({message: 'API请求失败', description: '请检查API程序状态和日志',});
          loading.value = false
        });
      } catch (e){
        notification['error']({message: '未知异常', description: e,});
        loading.value = false
      }
    }
  },
  mounted() {
    this.getDomainList()
  }
});
</script>

<style scoped>
.content-root
{
}
.content
{
  width: 100vw;
  height: 240px;
  background: -webkit-gradient(linear,left top,right top,color-stop(0,#627694),color-stop(50%,#6d869a),to(#576f54)) #8577a0;
}
.head-text
{
  padding: 28px;
  color: white;
}
.head-text h1
{
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  color: #fff;
  max-width: 1100px;
  font-size: 42px;
  letter-spacing: 0;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 46px;
}
.head-text h2
{
  color: #fff;
  max-width: 980px;
  margin: auto auto 28px;
  font-size: 22px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 32px;
}
.content-body
{
  position: absolute;
  top: 545px;
  left: 50%;
  width: 1150px;
  height: 73%;
  margin: 0;
  padding: 0 10px;
  /*min-height: 69%;*/
  overflow: scroll;
  background: white;
  transform: translate(-50%, -50%);
}

.tools-item h3 {
  font-size: 20px;
  font-weight: 600;
  line-height: 30px;
  letter-spacing: 0;
  color: #383e45;
  margin-bottom: 9px;
}

.tools-item svg {
  width: 50px;
  height: 50px;
}

</style>