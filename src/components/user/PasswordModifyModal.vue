<template>
    <el-dialog title="修改密码" :visible.sync="isVisible" width="400px" @close="handleClose">
        <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef">
            <el-form-item label="旧密码" prop="oldPassword">
                <el-input type="password" v-model="passwordForm.oldPassword" placeholder="请输入旧密码"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input type="password" v-model="passwordForm.newPassword" placeholder="请输入新密码"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPassword">
                <el-input type="password" v-model="passwordForm.checkPassword" placeholder="请确认新密码"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleConfirmModify">确认修改</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { logout, updateUserPwd } from '@/api/user';
import router from '@/router';
import { Message } from 'element-ui'
export default {
    data() {
        return {
            isVisible: false,
            passwordForm: {
                oldPassword: '',
                newPassword: '',
                checkPassword: ''
            },
            passwordRules: {
                oldPassword: [
                    { required: true, message: '请输入旧密码', trigger: 'blur' }
                ],
                newPassword: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 6, message: '新密码长度至少为6位', trigger: 'blur' }
                ],
                checkPassword: [
                    { required: true, message: '请确认新密码', trigger: 'blur' },
                    {
                        validator: this.validateConfirmPassword,
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    methods: {
        handleClose() {
            this.isVisible = false;
            this.resetForm();
        },
        handleCancel() {
            this.isVisible = false;
            this.resetForm();
        },
        handleConfirmModify() {
            this.$refs.passwordFormRef.validate((valid) => {
                if (valid) {
                    // 这里可以添加实际的修改密码逻辑，比如调用接口发送修改密码请求
                    // console.log('确认修改密码，可在此处添加修改密码的实际逻辑');
                    updateUserPwd({
                        oldPassword: this.passwordForm.oldPassword, newPassword: this.passwordForm.newPassword, checkPassword: this.passwordForm.checkPassword
                    }).then(res => {
                        if (res.code === 20000) {
                            Message.success(res.message);
                            // 重新登录
                            logout().then(res => {
                                if (res.code === 20000) {
                                    console.error('退出登录成功');
                                    Message.error(res.message);
                                    // this.isVisible = false;
                                    // this.resetForm();
                                    // 使用 setTimeout 函数来设置2秒（2000毫秒）后执行刷新页面的操作
                                    // todo 这里会报警告，但无伤大雅
                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 2000);
                                }
                            }).catch((err) => {
                                console.error('退出登录失败');
                                Message.error('退出登录失败', err);
                            }).finally(() => {
                                this.isVisible = false;
                                this.resetForm();
                            });
                        } else {
                            Message.warning(res.message)
                            this.isVisible = true;
                        }
                    }).catch((err) => {
                        console.error('密码修改失败')
                        Message.error('密码修改失败', err);
                    }).finally(() => {
                        this.isVisible = false;
                        this.resetForm();
                    })
                } else {
                    return false;
                }
            });
        },
        validateConfirmPassword(rule, value, callback) {
            if (value === this.passwordForm.newPassword) {
                callback();
            } else {
                callback(new Error('两次输入的新密码不一致'));
            }
        },
        resetForm() {
            this.$refs.passwordFormRef.resetFields();
        }
    }
};
</script>

<style scoped></style>