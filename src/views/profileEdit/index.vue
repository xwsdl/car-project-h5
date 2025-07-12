<template>
  <div class="profile-edit">
    <van-nav-bar :title="$t('profile.editTitle')" left-arrow @click-left="onBack" />
    <div class="avatar-section">
      <van-uploader :after-read="onAvatarChange" :max-count="1">
        <img v-if="form.avatarUrl" :src="form.avatarUrl" class="avatar-img" />
        <div v-else class="avatar-placeholder">{{ $t('profile.uploadAvatar') }}</div>
      </van-uploader>
    </div>
    <van-form @submit="onSubmit">
      <van-field
        v-model="form.username"
        :label="$t('profile.username')"
        :placeholder="$t('profile.usernamePlaceholder')"
        required
        :rules="[{ required: true, message: $t('profile.usernameRequired') }]"
      />
      <van-field
        v-model="form.phone"
        :label="$t('profile.phone')"
        :placeholder="$t('profile.phonePlaceholder')"
        :rules="[
          {
            validator: phoneValidator,
            message: $t('profile.phoneInvalid')
          }
        ]"
      />
      <van-field :label="$t('profile.gender')">
        <template #input>
          <van-radio-group v-model="form.gender" direction="horizontal">
            <van-radio name="1">{{ $t('profile.male') }}</van-radio>
            <van-radio name="2">{{ $t('profile.female') }}</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <!-- 生日选择，集成通用日期选择弹窗组件 -->
      <van-field
        :label="$t('profile.birthday')"
        is-link
        readonly
        v-model="form.birthday"
        @click="openDatePicker"
      />
      <van-popup v-model:show="showDatePicker" round position="bottom" :style="{ height: '30%' }">
        <van-date-picker
          v-model="birthdayArray"
          title="选择日期"
          :min-date="minDate"
          :max-date="maxDate"
          :confirm-button-text="$t('common.confirm')"
          :cancel-button-text="$t('common.cancel')"
          :show-toolbar="true"
          @confirm="onBirthdayConfirm"
          @cancel="handleCancel"
        />
      </van-popup>

      <van-field
        v-model="form.email"
        :label="$t('profile.email')"
        :placeholder="$t('profile.emailPlaceholder')"
        :rules="[
          {
            validator: emailValidator,
            message: $t('profile.emailInvalid')
          }
        ]"
      />
      <div style="margin: 24px 0">
        <van-button round block type="primary" native-type="submit">
          {{ $t('common.save') }}
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
  import { ref, reactive, nextTick, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { showToast, showLoadingToast, closeToast } from 'vant'
  import { useAuthStore } from '@/stores/auth'
  import { updateUserInfo, getUserInfo } from '@/api/base/index.js'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const minDate = new Date(1970, 0, 1)
  const maxDate = new Date(2100, 5, 1)
  // 控制日期选择弹窗显示
  const showDatePicker = ref(false)
  // 生日选择器的绑定值，格式为['年','月','日']
  const birthdayArray = ref(['2000', '01', '01'])
  // 表单数据
  const form = reactive({
    avatarUrl: '',
    username: '',
    phone: '',
    gender: '',
    birthday: '', // '1990-01-01'
    email: '',
    avatarFile:""
  })

  const router = useRouter()
  const authStore = useAuthStore()

  // 回显用户信息
  onMounted(() => {
    const user = authStore.user
    form.avatarUrl = user.avatar || ''
    form.username = user.username || ''
    form.phone = user.phone || ''
    form.gender = user.gender ? String(user.gender) : ''
    form.birthday = user.birthday || ''
    form.email = user.email || ''
  })

  // 打开日期选择弹窗
  function openDatePicker() {
    if (form.birthday) {
      birthdayArray.value = form.birthday.split('-')
    } else {
      birthdayArray.value = ['2000', '01', '01']
    }
    showDatePicker.value = true
  }
  // 选择生日后回显到输入框
  function onBirthdayConfirm() {
    showDatePicker.value = false
    nextTick(() => {
      form.birthday = birthdayArray.value.join('-')
    })
  }
  const handleCancel = () => {
    showDatePicker.value = false
  }
  function onBack() {
    router.back()
  }
  function onAvatarChange(file) {
    console.log('头像文件信息:', file)
    // 设置预览图片
    form.avatarUrl = file.content || URL.createObjectURL(file.file)
    // 保存文件对象
    form.avatarFile = file.file
  }
  function phoneValidator(value) {
    if (!value) return true // 没填直接通过
    return /^1[3-9]\d{9}$/.test(value)
  }

  function emailValidator(value) {
    if (!value) return true // 没填直接通过
    return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)
  }

  // 保存用户信息
  async function onSubmit() {
    try {
      showLoadingToast({ message: t('common.saving'), forbidClick: true })
      
      // 创建 FormData 对象来处理文件上传
      const formData = new FormData()
      formData.append('id', authStore.user.id)
      formData.append('username', form.username)
      formData.append('phone', form.phone)
      formData.append('gender', Number(form.gender) || 0)
      formData.append('birthday', form.birthday)
      formData.append('email', form.email)
      formData.append('password', '')
      
      // 如果有头像文件，添加到 FormData
      if (form.avatarFile) {
        formData.append('avatarFile', form.avatarFile)
      }
      
      await updateUserInfo(formData)
      // 重新获取用户信息，保证头像等为服务器返回
      const latestUser = await getUserInfo(authStore.user.id)
      authStore.updateUser(latestUser)
      showToast(t('common.saveSuccess'))
      router.back()
    } catch (e) {
      showToast(t('common.saveFail') + (e?.message ? `: ${e.message}` : ''))
    } finally {
      closeToast()
    }
  }
</script>

<script>
  export default {
    name: 'ProfileEditView'
  }
</script>

<style lang="scss" scoped>
  .profile-edit {
    background: #f5f7fa;
    min-height: 100vh;
    .avatar-section {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 24px 0 12px 0;
      .avatar-img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        border: 1px solid #eee;
      }
      .avatar-placeholder {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: #e5e6eb;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #999;
        font-size: 14px;
      }
    }
  }
</style>
