<template>
  <div>
    <el-card class="box-card">
      <el-form :model="userForm" label-width="100px">
        <el-form-item label="ID">
          <el-input v-model="userForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="userForm.userAccount" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="userForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="userForm.userGender">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">未知</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userForm.userEmail"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload class="avatar-uploader" :action="uploadAvatarAction" :show-file-list="false"
            :on-success="handleAvatarUploadSuccess" :before-upload="beforeAvatarUpload"
            :on-progress="handleAvatarUploadProgress" :headers="uploadHeaders" :with-credentials="true"
            :data="uploadData">
            <el-image v-if="userForm.userAvatar" :src="userForm.userAvatar" alt="用户头像" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="userForm.userProfile"></el-input>
        </el-form-item>
        <el-form-item v-if="userForm.userRole === 'user'" label="角色">
          <el-input placeholder="普通用户" disabled></el-input>
        </el-form-item>
        <el-form-item v-else-if="userForm.userRole === 'admin'&userForm.userEmail !== 'nanshuo.icu@qq.com'" label="角色">
          <el-input placeholder="管理员" disabled></el-input>
        </el-form-item>
        <el-form-item v-else label="角色">
          <el-input placeholder="超级管理员" disabled></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="userForm.createTime" disabled></el-input>
        </el-form-item>
        <el-form-item label="更新时间">
          <el-input v-model="userForm.updateTime" disabled></el-input>
        </el-form-item>
        <el-form-item label="创建者">
          <el-input v-model="userForm.createBy" disabled></el-input>
        </el-form-item>
        <el-form-item label="更新者">
          <el-input v-model="userForm.updateBy" disabled></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="saveUserInfo">保存修改</el-button>
      <!--      <el-button @click="updateUserPwd">修改密码</el-button>-->
    </el-card>
  </div>
</template>

<script>
import { getInfo, updateUserInfo } from '@/api/user'
import { Message } from 'element-ui'

const baseApi = process.env.VUE_APP_BASE_API
export default {
  name: 'UserInfo',
  data() {
    return {
      uploadAvatarAction: `${baseApi}/api/file/upload`,
      userForm: {
        id: '',
        userAccount: '',
        userName: '',
        userGender: '',
        userAvatar: '',
        userProfile: '',
        userEmail: '',
        userRole: '',
        createTime: '',
        updateTime: '',
        createBy: '',
        updateBy: ''
      },
      uploadHeaders: {},
      uploadData: {
        type: 'user_avatar'
      }
    }
  },
  methods: {
    saveUserInfo() {
      // 更新用户信息
      updateUserInfo(
        {
          id: this.userForm.id,
          userAccount: this.userForm.userAccount,
          userName: this.userForm.userName,
          userGender: this.userForm.userGender,
          userAvatar: this.userForm.userAvatar,
          userProfile: this.userForm.userProfile,
          userEmail: this.userForm.userEmail,
          userRole: this.userForm.userRole,
          createTime: this.userForm.createTime,
          updateTime: this.userForm.updateTime,
          createBy: this.userForm.createBy,
          updateBy: this.userForm.updateBy
        }).then(response => {
        // console.log(response)
        if (response.code === 20000) {
          Message.success('用户信息更新成功')
        } else {
          Message.error('用户信息更新失败' + response.code)
        }
      }).catch((error) => {
        Message.error('用户信息更新失败')
        console.error('用户信息更新失败:', error)
      })
    },
    handleAvatarUploadSuccess(response, file, fileList) {
      // 上传成功后，将返回的头像链接赋值给userForm.userAvatar
      this.userForm.userAvatar = response.data
      Message.success('头像上传成功')
    },
    beforeAvatarUpload(file) {
      // 这里可以进行一些前置校验，比如限制文件类型、大小等
      // const isJPEG = file.type === 'image/jpeg'
      // const isPNG = file.type === 'image/png'
      // const isGIF = file.type === 'image/gif'
      // if (!isJPEG && !isPNG && !isGIF) {
      //   this.$message.error('请上传JPEG、PNG或GIF格式的图片')
      //   return false
      // }
      const isLargerThan1M = file.size > 1024 * 1024
      if (isLargerThan1M) {
        this.$message.error('图片大小不能超过1M')
        return false
      }
      return true
    },
    handleAvatarUploadProgress(event, file, fileList) {
      // const progress = Math.round((event.loaded / event.total) * 100);
      // Message.info(`头像上传进度：${progress}%`);
    },
    fetchUserInfo() {
      getInfo().then(response => {
        this.userForm.id = response.data.id
        this.userForm.userAccount = response.data.userAccount
        this.userForm.userName = response.data.userName
        this.userForm.userAvatar = response.data.userAvatar
        this.userForm.userProfile = response.data.userProfile
        this.userForm.userEmail = response.data.userEmail
        this.userForm.userRole = response.data.userRole
        this.userForm.userGender = response.data.userGender
        this.userForm.createTime = response.data.createTime
        this.userForm.updateTime = response.data.updateTime
        this.userForm.createBy = response.data.createBy
        this.userForm.updateBy = response.data.updateBy

        // console.log('获取用户信息:', response.data)
        Message.success('获取用户信息成功')
      }).catch((error) => {
        Message.error('获取用户信息出错')
        console.error('获取用户信息出错:', error)
      })
    }
  },
  created() {
    // 调用获取用户信息的接口
    this.fetchUserInfo()
  }
}
</script>

<style scoped lang="scss">
//.box-card {
//  width: 50%;
//  margin: 20px auto;
//}
.avatar-uploader {
  position: relative;
  display: inline-block;
  width: 120px;
  height: 80px;
  // border: 1px solid #ccc;
  // border-radius: 50%;
  cursor: pointer;
}

.avatar {
  width: 100%;
  height: 100%;
  // border-radius: 50%;
}

.avatar-uploader-icon {
  position: absolute;
  top: 25px;
  left: 25px;
  font-size: 30px;
  color: #ccc;
}
</style>
