<template>
  <div>
    <div class="content-root">
      <div class="content">
        <div class="head-text">
          <h1>添加CDN域名</h1>
          <h2>请按照提示填写配置, 配置完成后大概需要10-20分钟生效</h2>
        </div>
        <div class="content-body">
          <div class="config" v-show="configShow">

            <a-textarea
                v-model:value="domainList"
                placeholder="在此输入要添加的域名, 逗号隔开, 只写根域名, 默认会加泛域名到CDN"
                :auto-size="{ minRows: 2, maxRows: 5 }"
            />
            <div style="margin: 24px 0" />
            <a-textarea
                v-model:value="domainTips"
                placeholder="域名备注, 会写在DNSpod备注上，方便查"
                auto-size
            />
            <div style="margin: 24px 0" />
            <a-radio-group v-model:value="merchant" button-style="solid">
              <a-radio-button value="lubei">撸呗视频</a-radio-button>
              <a-radio-button value="huaban">花瓣直播</a-radio-button>
              <a-radio-button value="91lu">91撸视频</a-radio-button>
            </a-radio-group>
            <div style="margin: 24px 0" />
            <a-radio-group v-model:value="account" button-style="solid">
              <a-radio-button value="xyaccount">xyaccount</a-radio-button>
              <a-radio-button value="miliaccount">miliaccount</a-radio-button>
              <a-radio-button value="qzh7537">qzh7537</a-radio-button>
              <a-radio-button value="beiyong889900">beiyong889900</a-radio-button>
              <a-radio-button value="luzhuanyong001">luzhuanyong001</a-radio-button>
            </a-radio-group>
            <div style="margin: 24px 0" />
            <a-select
                v-model:value="optimization"
                mode="multiple"
                style="width: 100%"
                placeholder="域名配置项"
                :options="optimizationOptions"
                @change="test"
            >
            </a-select>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { notification } from 'ant-design-vue';
import { Modal } from 'ant-design-vue';
import axios from 'axios';

const domainList = ref<string>('');
const domainTips = ref<string>('');
const merchant = ref<string>('lubei');
const account = ref<string>('miliaccount');
const optimization = ref([])
const optimizationOptions = [
      {value: '支持HTTPS'},
      {value: '根目录缓存一小时'},
      {value: 'GZIP压缩'},
      {value: 'HTML压缩'},
      {value: 'JS压缩'},
      {value: 'CSS压缩'}
    ];

const configShow = ref(1)
const loadingShow = ref(0)
export default defineComponent({
  setup() {
    return {
      domainList,
      domainTips,
      merchant,
      account,
      optimization,
      optimizationOptions,
      configShow,
      loadingShow
    };
  },
  methods: {
    makeAction () {
      var optData = [optimization.value.toString()]
      var data = {'parms': {
          'domain': domainList.value,
          'merchant': merchant.value,
          'domainTips': domainTips.value,
          'account': account.value,
          'optimization': optData
        }
      }
      this.sendPost(data)
    },
    sendPost (data) {
      try {
        configShow.value = 0
        loadingShow.value = 1
        notification['info']({message: '提示', description: '后端正在配置, 预计需要1分钟, 请不要走开',});
        axios.post('http://autoapi.zlyc.net/makeCDN', data, {timeout:300000}).then(function(res){
          if (res.data['code'] === 0){
            notification['success']({message: '配置成功提示', description: '配置成功, 预计需要10-20分钟生效',});
          } else {
            console.log(res.data)
            Modal.error({title: 'CDN域名配置异常',content: res.data['msg'],});
          }
          configShow.value = 1
          loadingShow.value = 0
        },function(){
          notification['error']({message: 'API请求失败', description: 'API请求失败，请检查API程序状态和日志',});
          configShow.value = 1
          loadingShow.value = 0
        });
      } catch (e){
        notification['error']({message: '未知异常', description: e,});
      }
    },
    test (data) {
      console.log(data)
    }
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
  background: -webkit-gradient(linear,left top,right top,color-stop(0,#882e27),color-stop(50%,#6d869a),to(#231641)) #44287d;
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
  top: 535px;
  left: 50%;
  width: 700px;
  /*height: 60%;*/
  margin: 0;
  padding: 20px 20px;
  min-height: 69%;
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