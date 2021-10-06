<template>
  <div>
    <div class="content-root">
      <div class="content">
        <div class="head-text">
          <h1>申请HTTPS证书</h1>
          <h2>如果某个域名曾经申请过证书并且到期时间大于3天, 就会直接显示该证书而不会重新申请</h2>
          <h2>LetsEncrypt 限制每3小时只能申请10次证书, 但你可以一次申请N条域名, 证书文件存在API服务器</h2>
        </div>
        <div class="content-body">
          <div class="config" v-show="configShow">
            <a-textarea
                v-model:value="domainList"
                placeholder="在此输入要申请的域名, 逗号隔开, 只写根域名, 证书同时支持泛域名"
                :auto-size="{ minRows: 2, maxRows: 5 }"
            />
            <div style="margin: 100px 0" />
            <a-popconfirm placement="top" ok-text="是" cancel-text="否" @confirm="makeAction">
              <template #title>
                <p>确认填写无误？</p>
                <p>劝你再检查一下</p>
              </template>
              <a-button type="primary">确认配置</a-button>
            </a-popconfirm>
          </div>
          <div class="loading" v-show="loadingShow">
            <div style="margin: 20px 0" />
            <a-spin />
            <div style="margin: 20px 0" />
            配置中...
          </div>
          <div class="resoult" v-show="resoultShow">
            <a-table :columns="resoultColumns" :data-source="certList" :scroll="{ y: 395 }" :pagination="false"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import VueClipboard from 'vue-clipboard2'
import { notification } from 'ant-design-vue';
import { Modal } from 'ant-design-vue';
import axios from 'axios';

const domainList = ref<string>('');
const configShow = ref(1)
const loadingShow = ref(0)
const resoultShow = ref(0)

const resoultColumns = [
  {title: '域名', key: 'domain', dataIndex: 'domain', width: '20%'},
  {title: '证书到期时间', key: 'expire', dataIndex: 'expire', width: '20%'},
  {title: '公钥内容', key: 'crt', dataIndex: 'crt', ellipsis: true, width: '30%'},
  {title: '私钥内容', key: 'key', dataIndex: 'key', ellipsis: true, width: '30%'}
]
const certList = ref([])
export default defineComponent({
  setup() {
    return {
      domainList,
      configShow,
      loadingShow,
      resoultShow,
      resoultColumns,
      certList
    };
  },
  methods: {
    makeAction () {
      var data = {'parms': {
          'domainList': domainList.value
        }
      }
      this.sendPost(data)
    },
    sendPost (data) {
      try {
        configShow.value = 0
        loadingShow.value = 1
        resoultShow.value = 0
        notification['info']({message: '提示', description: '正在申请, 预计需要1分钟, 请不要走开',});
        axios.post('http://autoapi.zlyc.net/getSSL', data, {timeout:300000}).then(function(res){
          if (res.data['code'] === 0){
            notification['success']({message: '申请成功', description: '请复制证书内容粘贴到服务器使用',});
            var dataList = []
            for (var i=0; i<res.data['data'].length; i++){
              dataList.push({'domain': res.data['data'][i]['domain'], 'expire': res.data['data'][i]['expire'], 'crt': res.data['data'][i]['crt'], 'key': res.data['data'][i]['key']})
            }
            certList.value = dataList
            configShow.value = 0
            loadingShow.value = 0
            resoultShow.value = 1
          } else {
            console.log(res.data)
            Modal.error({title: 'CDN域名配置异常',content: res.data['msg'],});
            configShow.value = 1
            loadingShow.value = 0
            loadingShow.value = 0
          }
        },function(){
          notification['error']({message: 'API请求失败', description: '请检查API程序状态和日志',});
          configShow.value = 1
          loadingShow.value = 0
          loadingShow.value = 0
        });
      } catch (e){
        notification['error']({message: '未知异常', description: e,});
      }
    },
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
  background: linear-gradient(90deg,#0d6d16,#3061c8 50%,#e8a307) #a64f08;
}
.head-text
{
  position: relative;
  top: 15px;
  padding: 12px;
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
  margin-bottom: 28px;
  margin-top: 10px;
}
.head-text h2
{
  color: #fff;
  max-width: 980px;
  margin: auto auto 28px;
  font-size: 22px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 5px;
}
.content-body
{
  position: relative;
  margin-right: auto;
  margin-left: auto;
  top: 5px;
  min-height: 500px;
  overflow: scroll;
  width: 888px;
  padding: 20px 20px;
  background: white;
  box-shadow: 0 2px 10px 0 rgba(0,0,0,.1);
  flex-wrap: wrap;
}

.lodding-div img
{
  padding-bottom: 20px;
}
.lodding-div h5
{
  display: block;
  margin: 0;
  padding: 0;
  height: 20px;
  width: 100%;
  line-height: 5px;
  color: #8f8f8f;
}
ul
{
  position: relative;
  margin: auto auto;
  padding: 0 0;
  text-align: left;
  height: 100%;
  width: 100%;
  list-style-type: none;
  border-right: 2px solid #f6f6f8;
}
.website-list li
{
  position: relative;
  width: 100%;
  height: 75px;
  border-bottom: 2px solid #f6f6f8;
}
.website-list li img
{
  position: relative;
  display: block;
  margin: auto auto;
  top: 12px;
  height: 70%;
  width: 90%;
}
li:hover
{
  cursor: pointer;
}
input
{
  outline-style: none ;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 10px 14px;
  width: 200px;
  font-size: 14px;
  font-weight: 700;
  font-family: Microsoft YaHei;
}
</style>