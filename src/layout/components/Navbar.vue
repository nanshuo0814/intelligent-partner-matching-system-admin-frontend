<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- 用户名显示在头像左侧 -->
          <span class="user-name">{{ name }}</span>

          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/info/user">
            <el-dropdown-item>
              个人主页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="showPasswordModifyModal">
            修改密码
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="showLogoutConfirm">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 修改密码弹窗 -->
    <PasswordModifyModal ref="passwordModifyModal" />

    <!-- 退出登录确认弹窗 -->
    <el-dialog title="确认退出登录" :visible.sync="logoutConfirmVisible" width="400px" @close="handleDialogClose">
      <span>Are you sure ？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="logoutConfirmVisible = false">取消</el-button>
        <el-button type="primary" @click="logout">确认退出</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import PasswordModifyModal from '@/components/user/PasswordModifyModal';

export default {
  components: {
    Breadcrumb,
    Hamburger,
    PasswordModifyModal
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  data() {
    return {
      logoutConfirmVisible: false,  // 控制退出登录确认弹窗显示/隐藏
    };
  },
  methods: {
    // 显示修改密码弹窗
    showPasswordModifyModal() {
      this.$refs.passwordModifyModal.isVisible = true;
    },

    // 切换侧边栏
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },

    // 显示退出登录确认弹窗
    showLogoutConfirm() {
      this.logoutConfirmVisible = true;
    },

    // 退出登录
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      this.logoutConfirmVisible = false;  // 退出后关闭弹窗
    },

    // 关闭弹窗时的处理
    handleDialogClose() {
      this.logoutConfirmVisible = false;
    }
  }
}
</script>


<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .avatar-container {
      margin-right: 30px;
      display: flex;
      align-items: center;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;

        .user-name {
          margin-right: 10px;
          font-size: 14px;
          color: #333;
          font-weight: 500;
          cursor: pointer;
        }

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 20px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>


