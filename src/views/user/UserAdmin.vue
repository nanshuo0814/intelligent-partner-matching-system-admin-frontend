<template>
    <div class="box-card">
        <!-- 搜索区域 -->
        <el-form :inline="true" :model="searchForm" :rules="searchFormRules" class="demo-form-inline"
            ref="searchFormRef">
            <el-form-item label="ID：" prop="id">
                <el-input clearable v-model="searchForm.id" placeholder="请输入ID"></el-input>
            </el-form-item>
            <el-form-item label="账号：" prop="userAccount">
                <el-input clearable v-model="searchForm.userAccount" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item label="昵称：" prop="userName">
                <el-input clearable v-model="searchForm.userName" placeholder="请输入昵称"></el-input>
            </el-form-item>
            <el-form-item label="性别：" prop="userGender">
                <el-select clearable v-model="searchForm.userGender" placeholder="请选择性别">
                    <el-option label="男" value="1"></el-option>
                    <el-option label="女" value="0"></el-option>
                    <el-option label="未知" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="邮箱：" prop="userEmail">
                <el-input clearable v-model="searchForm.userEmail" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="手机号：" prop="userPhone">
                <el-input clearable v-model="searchForm.userPhone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="简介：" prop="userProfile">
                <el-input clearable v-model="searchForm.userProfile" placeholder="请输入简介"></el-input>
            </el-form-item>
            <el-form-item label="角色：" prop="userRole">
                <el-select clearable v-model="searchForm.userRole" placeholder="请选择角色">
                    <el-option label="管理员" value="admin"></el-option>
                    <el-option label="普通用户" value="user"></el-option>
                    <el-option label="封号" value="ban"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="创建人ID：" prop="createBy">
                <el-input clearable v-model="searchForm.createBy" placeholder="请输入创建人ID"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchUsers">搜索</el-button>
                <el-button type="info" @click="resetForm">重置</el-button>
                <el-button type="success" @click="addUser">添加用户</el-button>
            </el-form-item>
        </el-form>

        <!-- 用户数据表格 -->
        <el-table :data="userList" style="width: 100%" height="650">
            <el-table-column prop="id" label="ID" sortable width="170"></el-table-column>
            <el-table-column prop="userAccount" label="账号" width="120"></el-table-column>
            <el-table-column prop="userName" label="昵称" width="120"></el-table-column>
            <el-table-column prop="userAvatar" label="头像" width="60">
                <template slot-scope="scope">
                    <el-image :src="scope.row.userAvatar" style="width: 100%; height: 100%"
                        :preview-src-list="[scope.row.userAvatar]"></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="userGender" label="性别" width="50">
                <template slot-scope="scope">
                    {{ scope.row.userGender === 0 ? '女' : scope.row.userGender === 1 ? '男' : '未知' }}
                </template>
            </el-table-column>
            <!-- <el-table-column prop="userEmail" label="邮箱" width="160"></el-table-column> -->
            <el-table-column prop="userEmail" label="邮箱" width="160">
                <template slot-scope="scope">
                    {{ scope.row.userEmail === null || scope.row.userEmail === "" ? "暂无" : scope.row.userEmail }}
                </template>
            </el-table-column>
            <!-- <el-table-column prop="userPhone" label="手机号" width="110"></el-table-column> -->
            <el-table-column prop="userPhone" label="手机号" width="110">
                <template slot-scope="scope">
                    {{ scope.row.userPhone === null || scope.row.userPhone === "" ? "暂无" : scope.row.userPhone }}
                </template>
            </el-table-column>
            <!-- <el-table-column prop="userProfile" label="简介" width="200"></el-table-column> -->
            <el-table-column prop="userProfile" label="简介" width="200">
                <template slot-scope="scope">
                    {{ scope.row.userProfile === null || scope.row.userProfile === "" ? "暂无" : scope.row.userProfile }}
                </template>
            </el-table-column>
            <el-table-column prop="userRole" label="角色" width="60">
                <template slot-scope="scope">
                    {{ scope.row.userRole === "admin" ? "管理员" : scope.row.userRole === "user" ? "普通用户" : "封号" }}
                </template>
            </el-table-column>
            <el-table-column prop="createBy" label="创建人" width="80"></el-table-column>
            <el-table-column prop="updateBy" label="更新人" width="80"></el-table-column>
            <el-table-column prop="createTime" sortable label="创建时间" width="100"></el-table-column>
            <el-table-column prop="updateTime" sortable label="更新时间" width="100"></el-table-column>
            <el-table-column fixed="right" label="操作" min-width="100">
                <template #default="scope">
                    <el-button type="success" plain size="small" @click="handleEdit(scope.$index, scope.row)">
                        修改用户
                    </el-button>
                    <el-button style="margin-left: 0px;" size="small" type="primary" plain
                        @click="handleResetPwd(scope.$index, scope.row)">
                        重置密码
                    </el-button>
                    <el-button style="margin-left: 0px;" size="small" type="danger" plain
                        @click="handleDelete(scope.$index, scope.row)">
                        删除用户
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pagination.current" :page-sizes="[5, 10, 20, 50]" :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next" :total="pagination.total">
        </el-pagination>
        <!-- 编辑弹窗 -->
        <el-dialog :title="editDialogTitle" :visible.sync="editDialogVisible" width="50%">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
                <el-form-item label="ID：" prop="id">
                    <el-input v-model="editForm.id" placeholder="请输入ID" disabled></el-input>
                </el-form-item>
                <el-form-item label="账号：" prop="userAccount">
                    <el-input v-model="editForm.userAccount" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item label="昵称：" prop="userName">
                    <el-input v-model="editForm.userName" placeholder="请输入昵称"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="userGender">
                    <el-radio-group v-model="editForm.userGender">
                        <el-radio :label="0">女</el-radio>
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="2">未知</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="邮箱：" prop="userEmail">
                    <el-input v-model="editForm.userEmail" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" prop="userPhone">
                    <el-input v-model="editForm.userPhone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="简介：" prop="userProfile">
                    <el-input v-model="editForm.userProfile" placeholder="请输入简介"></el-input>
                </el-form-item>
                <el-form-item label="角色：" prop="userRole">
                    <el-select v-model="editForm.userRole" placeholder="请选择角色">
                        <el-option label="管理员" value="admin"></el-option>
                        <el-option label="普通用户" value="user"></el-option>
                        <el-option label="封号" value="ban"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">修改</el-button>
            </span>
        </el-dialog>
        <!-- 删除确认对话框 -->
        <el-dialog title="确认删除" :visible.sync="deleteDialogVisible" width="30%" :before-close="handleDeleteDialogClose">
            <div>是否确定删除该用户账号（{{ deleteUser.userAccount }}）？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmDelete">确定</el-button>
            </span>
        </el-dialog>
        <!-- 添加用户弹窗 -->
        <el-dialog :title="addDialogTitle" :visible.sync="addUserDialogVisible" width="50%">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
                <el-form-item label="账号：" prop="userAccount">
                    <el-input v-model="addForm.userAccount" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item label="昵称：" prop="userName">
                    <el-input v-model="addForm.userName" placeholder="请输入昵称"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="userGender">
                    <el-radio-group v-model="addForm.userGender">
                        <el-radio :label="0">女</el-radio>
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="2">未知</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="角色：" prop="userRole">
                    <el-select v-model="addForm.userRole" placeholder="请选择角色">
                        <el-option label="管理员" value="admin"></el-option>
                        <el-option label="普通用户" value="user"></el-option>
                        <el-option label="封号" value="ban"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addUserDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitAdd">添加</el-button>
            </span>
        </el-dialog>
        <!-- 重置密码弹窗 -->
        <el-dialog :title="resetPwdDialogTitle" :visible.sync="resetPwdDialogVisible" width="30%">
            <div>是否确定重置该用户账号（{{ resetPwdUser.userAccount }}）的密码？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetPwdDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmResetPwd">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { addUserInfo, deleteUser, resetUserPwd, searchUserInfo, updateUserInfo } from '@/api/user';
import { Message } from 'element-ui';

export default {
    data() {
        var validateId = (rule, value, callback) => {
            if (!value) {
                callback();
            } else if (!/^\d+$/.test(value)) {
                callback(new Error("ID必须为数字"));
            } else {
                callback();
            }
        };
        var validateCreatorId = (rule, value, callback) => {
            if (!value) {
                callback();
            } else if (!/^\d+$/.test(value)) {
                callback(new Error("创建人ID必须为数字"));
            } else {
                callback();
            }
        };
        var validatePhone = (rule, value, callback) => {
            if (!value) {
                callback();
            } else if (!/^1[3-9]\d{9}$/.test(value)) {
                callback(new Error("请输入正确的手机号"));
            } else {
                callback();
            }
        };
        var validateEmail = (rule, value, callback) => {
            if (!value) {
                callback();
            } else if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.
                test(value)) {
                callback(new Error("请输入正确的邮箱地址"));
            } else {
                callback();
            }
        };

        return {
            resetPwdDialogTitle: '用户密码重置',
            resetPwdDialogVisible: false,
            // 存储当前要重置密码的用户信息（可根据实际需求调整存储内容）
            resetPwdUser: {
                id: "",
                userAccount: ""
            },
            // 添加用户弹窗是否可见
            addUserDialogVisible: false,
            addDialogTitle: '添加用户表单',
            // 添加用户表单数据
            addForm: {
                userAccount: "",
                userName: "",
                userGender: null,
                userRole: ""
            },
            // 添加用户表单校验规则（可根据需要完善）
            addFormRules: {
                userAccount: [],
                userName: [],
                userGender: [],
                userEmail: [
                    { validator: validateEmail, trigger: "blur" }
                ],
                userPhone: [
                    { validator: validatePhone, trigger: "blur" }
                ],
                userProfile: [],
                userRole: []
            },
            // 删除确认对话框是否可见
            deleteDialogVisible: false,
            deleteUser: {
                id: "",
                userAccount: ""
            },
            // 编辑弹窗是否可见
            editDialogVisible: false,
            // 编辑弹窗标题
            editDialogTitle: '编辑用户信息',
            // 编辑表单数据
            editForm: {
                id: "",
                userAccount: "",
                userName: "",
                userGender: null,
                userEmail: "",
                userPhone: "",
                userProfile: "",
                userRole: ""
            },
            // 编辑表单校验规则（可根据需要完善）
            editFormRules: {
                userAccount: [],
                userName: [],
                userGender: [],
                userEmail: [
                    { validator: validateEmail, trigger: "blur" }
                ],
                userPhone: [
                    { validator: validatePhone, trigger: "blur" }
                ],
                userProfile: [],
                userRole: []
            },
            // 搜索表单数据
            searchForm: {
                id: null,
                userAccount: "",
                userName: "",
                userGender: null,
                userEmail: "",
                userPhone: "",
                userProfile: "",
                userRole: "",
                createBy: null
            },
            // 搜索表单校验规则
            searchFormRules: {
                id: [
                    { validator: validateId, trigger: "blur" }
                ],
                userAccount: [],
                userName: [],
                userGender: [],
                userEmail: [
                    { validator: validateEmail, trigger: "blur" }
                ],
                userPhone: [
                    { validator: validatePhone, trigger: "blur" }
                ],
                userProfile: [],
                userRole: [],
                createBy: [
                    { validator: validateCreatorId, trigger: "blur" }
                ]
            },
            // 用户列表数据
            userList: [],
            // 分页数据
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0
            }
        };
    },
    created() {
        this.searchUsers();
    },
    methods: {
        confirmResetPwd() {
            const { id } = this.resetPwdUser;
            // 调用重置密码接口
            resetUserPwd({ id }).then(res => {
                if (res.code === 20000) {
                    this.resetPwdDialogVisible = false;
                    this.searchUsers();
                    Message.success('密码重置成功');
                } else {
                    Message.error('密码重置失败：' + res.message);
                }
            }).catch((err) => {
                Message.error('密码重置失败');
                console.error('密码重置失败', err);
            });
        },
        handleResetPwd(index, row) {
            this.resetPwdDialogVisible = true;
            // 存储当前要重置密码的用户信息
            this.resetPwdUser = {
                id: row.id,
                userAccount: row.userAccount
            };
        },
        addUser() {
            this.addUserDialogVisible = true;
            // 可在此处对添加表单数据进行一些初始化操作，比如清空之前可能残留的数据
            // this.$refs.addFormRef.resetFields();
            this.addForm.userAccount = "";
            this.addForm.userName = "";
            this.addForm.userGender = null;
            this.addForm.userEmail = "";
            this.addForm.userPhone = "";
            this.addForm.userProfile = "";
            this.addForm.userRole = "";
        },
        submitAdd() {
            this.$refs.addFormRef.validate((valid) => {
                if (valid) {
                    // 这里调用添加用户信息的接口，假设接口为addUserInfo（需要根据实际后端接口来实现）
                    addUserInfo(this.addForm).then(response => {
                        if (response.code === 20000) {
                            this.addUserDialogVisible = false;
                            this.$refs.addFormRef.resetFields();
                            this.searchUsers();
                            Message.success('添加成功');
                        } else {
                            Message.error('用户添加失败：' + response.message);
                        }
                    }).catch((error) => {
                        Message.error('添加失败');
                        console.error('添加失败:', error);
                    });
                } else {
                    return false;
                }
            });
        },
        // 处理编辑按钮点击事件
        handleEdit(index, row) {
            this.editDialogVisible = true;
            // 将当前行数据赋值给编辑表单
            this.editForm = {
                id: row.id,
                userAccount: row.userAccount,
                userName: row.userName,
                userGender: row.userGender,
                userEmail: row.userEmail,
                userPhone: row.userPhone,
                userProfile: row.userProfile,
                userRole: row.userRole
            };
        },
        // 提交编辑
        submitEdit() {
            this.$refs.editFormRef.validate((valid) => {
                if (valid) {
                    // 这里调用修改用户信息的接口，假设接口为updateUserInfo
                    updateUserInfo(this.editForm).then(response => {
                        if (response.code === 20000) {
                            this.editDialogVisible = false;
                            this.$refs.editFormRef.resetFields();
                            this.searchUsers();
                            Message.success('修改成功');
                        } else {
                            Message.error('用户信息修改失败：' + response.message);
                        }
                    }).catch((error) => {
                        Message.error('修改失败');
                        console.error('修改失败:', error);
                    });
                } else {
                    return false;
                }
            });
        },
        handleDelete(index, row) {
            this.deleteDialogVisible = true;
            // 可以在这里存储当前要删除的行数据，方便后续确定删除时使用，比如：
            this.currentDeleteRow = row;
            this.deleteUser = {
                id: row.id,
                userAccount: row.userAccount
            };
        },
        confirmDelete() {
            const { id } = this.currentDeleteRow;
            deleteUser({ id }).then(res => {
                if (res.code === 20000) {
                    this.searchUsers();
                    Message.success('删除成功');
                } else {
                    Message.error('删除失败：' + res.message);
                }
            }).catch((err) => {
                Message.error('删除失败');
                console.error('删除失败', err);
            });
            this.deleteDialogVisible = false;
        },
        handleDeleteDialogClose(done) {
            // 可以在这里进行一些清理操作，如果有需要的话
            done();
        },
        // 搜索用户方法
        searchUsers() {
            searchUserInfo(
                {
                    id: this.searchForm.id,
                    userAccount: this.searchForm.userAccount,
                    userName: this.searchForm.userName,
                    userGender: this.searchForm.userGender,
                    userProfile: this.searchForm.userProfile,
                    userEmail: this.searchForm.userEmail,
                    current: this.pagination.current,
                    pageSize: this.pagination.pageSize,
                    userRole: this.searchForm.userRole,
                    createBy: this.searchForm.createBy
                }).then(response => {
                    if (response.code === 20000) {
                        // 将接口返回的用户数据赋值给userList用于表格展示
                        this.userList = response.data.records;
                        // 更新分页数据
                        this.pagination.total = parseInt(response.data.total);
                        this.pagination.current = parseInt(response.data.current);
                        this.pagination.pageSize = parseInt(response.data.size);
                        Message.success('查询成功');
                    } else {
                        Message.error('用户信息查询失败：' + response.message);
                    }
                }).catch((error) => {
                    Message.error('查询失败');
                    console.error('查询失败:', error);
                })
        },
        // 处理每页显示数量改变
        handleSizeChange(val) {
            this.pagination.pageSize = val;
            this.searchUsers();
        },
        // 处理当前页码改变
        handleCurrentChange(val) {
            this.pagination.current = val;
            this.searchUsers();
        },
        // 重置表单方法
        resetForm() {
            this.$refs.searchFormRef.resetFields();
            // 手动将用户角色和用户性别字段重置为空
            this.searchForm.userRole = "";
            this.searchForm.userGender = null;
            // 重置后重新搜索，显示所有数据（可根据实际需求调整）
            this.searchUsers();
        }
    }
};
</script>

<style lang="scss">
.box-card {
    margin: 20px;
}

.demo-form-inline {
    margin-bottom: 10px;
}
</style>