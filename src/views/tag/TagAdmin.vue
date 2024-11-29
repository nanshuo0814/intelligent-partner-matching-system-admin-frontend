<template>
    <div class="box-card">
        <!-- 搜索区域 -->
        <el-form :inline="true" :model="searchForm" :rules="searchFormRules" class="demo-form-inline"
            ref="searchFormRef">
            <el-form-item label="ID：" prop="id">
                <el-input clearable v-model="searchForm.id" placeholder="请输入ID"></el-input>
            </el-form-item>
            <el-form-item label="标签名：" prop="tagName">
                <el-input clearable v-model="searchForm.tagName" placeholder="请输入标签名"></el-input>
            </el-form-item>
            <el-form-item label="分类名：" prop="category">
                <el-input clearable v-model="searchForm.category" placeholder="请输入分类名"></el-input>
            </el-form-item>
            <el-form-item label="创建人ID：" prop="createBy">
                <el-input clearable v-model="searchForm.createBy" placeholder="请输入创建人ID"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchTags">搜索</el-button>
                <el-button type="info" @click="resetForm">重置</el-button>
                <el-button type="success" @click="addTag">添加标签</el-button>
            </el-form-item>
        </el-form>

        <!-- 标签数据表格 -->
        <el-table :data="tagList" style="width: 100%">
            <el-table-column prop="id" label="ID" sortable width="170"></el-table-column>
            <el-table-column label="标签名" width="150">
                <template #default="scope">
                    <el-tag type="success">{{ scope.row.tagName }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="标签分类" width="150">
                <template #default="scope">
                    <el-tag effect="dark" type="primary">{{ scope.row.category }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createBy" label="创建人" width="180"></el-table-column>
            <el-table-column prop="updateBy" label="更新人" width="180"></el-table-column>
            <el-table-column prop="createTime" sortable label="创建时间" width="170"></el-table-column>
            <el-table-column prop="updateTime" sortable label="更新时间" width="170"></el-table-column>
            <el-table-column fixed="right" label="操作" min-width="100">
                <template #default="scope">
                    <el-button type="success" plain size="small" @click="handleEdit(scope.$index, scope.row)">
                        修改标签
                    </el-button>
                    <el-button style="margin-left: 0px;" size="small" type="danger" plain
                        @click="handleDelete(scope.$index, scope.row)">
                        删除标签
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
                <el-form-item label="标签名：" prop="tagName">
                    <el-input v-model="editForm.tagName" placeholder="请输入标签名"></el-input>
                </el-form-item>
                <el-form-item label="标签分类" prop="category">
                    <el-input v-model="editForm.category" placeholder="请输入标签分类">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">修改</el-button>
            </span>
        </el-dialog>
        <!-- 删除确认对话框 -->
        <el-dialog title="确认删除" :visible.sync="deleteDialogVisible" :before-close="handleDeleteDialogClose">
            <div>是否确定删除名字为（{{ deleteTag.tagName }}）的标签？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmDelete">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="addDialogTitle" :visible.sync="addTagDialogVisible" width="80%">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
                <el-form-item label="标签分类：" prop="category">
                    <el-select v-model="addForm.category" default-first-option clearable filterable allow-create
                        placeholder="请选择或输入标签分类" @change="handleCategoryChange">
                        <el-option v-for="item in categoryList" :key="item" :label="item" :value="item">
                            {{ item }}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标签名：" prop="tagName">
                    <el-input v-model="addForm.tagName" placeholder="请输入标签名"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addTagDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitAdd">添加</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { addTagInfo, deleteTagInfo, getAllCategory, getTagList, updateTagInfo } from '@/api/tag';
import { deleteTeamInfo, getTeamList, updateTeamInfo } from '@/api/team';
import { Message } from 'element-ui';

export default {
    data() {
        var validateId = (rule, value, callback) => {
            if (!value) {
                callback();
            } else if (!/^\d+$/.test(value)) {
                callback(new Error("输入的必须为数字"));
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
            categoryList: [], // 存储所有分类
            // 添加用户弹窗是否可见
            addTagDialogVisible: false,
            addDialogTitle: '添加用户表单',
            // 添加用户表单数据
            addForm: {
                category: '',
                tagName: '',    
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
            deleteTag: {
                id: "",
                tagName: ""
            },
            // 编辑弹窗是否可见
            editDialogVisible: false,
            // 编辑弹窗标题
            editDialogTitle: '编辑标签信息',
            // 编辑表单数据
            editForm: {
                id: "",
                tagName: "",
                category: ""
            },
            isPasswordRequired: false,
            // 编辑表单校验规则（可根据需要完善）
            editFormRules: {
                tagName: [],
            },
            // 搜索表单数据
            searchForm: {
                id: null,
                tagName: "",
                category: "",
                createBy: null
            },
            // 搜索表单校验规则
            searchFormRules: {
                id: [
                    { validator: validateId, trigger: "blur" }
                ],
                tagName: [],
                category: [],
                createBy: [
                    { validator: validateCreatorId, trigger: "blur" }
                ]
            },
            // 标签列表数据
            tagList: [],
            // 分页数据
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0
            }
        };
    },
    created() {
        this.searchTags();
    },
    methods: {
        handleCategoryChange(value) { this.addForm.category = value; },
        fetchCategories() { 
            getAllCategory().then(res => {
                this.categoryList = res.data;
            }).catch(err => {
                Message.error("获取所有标签分类失败: ", res.message);
                console.log('获取所有标签分类失败', err);
            })
        },  
        addTag() {
            this.addTagDialogVisible = true;
            this.fetchCategories();
            // 可在此处对添加表单数据进行一些初始化操作，比如清空之前可能残留的数据
            // this.$refs.addFormRef.resetFields();
            this.addForm.tagName = "";
            this.addForm.category = "";
        },
        submitAdd() {
            this.$refs.addFormRef.validate((valid) => {
                if (valid) {
                    // 这里调用添加用户信息的接口，假设接口为addTagInfo（需要根据实际后端接口来实现）
                    addTagInfo(this.addForm).then(response => {
                        if (response.code === 20000) {
                            this.addTagDialogVisible = false;
                            this.$refs.addFormRef.resetFields();
                            this.searchTags();
                            Message.success('添加成功');
                        } else {
                            Message.error('标签添加失败：' + response.message);
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
            this.editForm = { ...row }; // 将当前行数据赋值给编辑表单
        },
        // 提交编辑
        submitEdit() {
            this.$refs.editFormRef.validate((valid) => {
                if (valid) {
                    // 这里调用修改标签信息的接口，假设接口为updateUserInfo
                    updateTagInfo(this.editForm).then(response => {
                        if (response.code === 20000) {
                            this.editDialogVisible = false;
                            this.$refs.editFormRef.resetFields();
                            this.searchTags();
                            Message.success('修改成功');
                        } else {
                            Message.error('标签信息修改失败：' + response.message);
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
            this.deleteTag = {
                id: row.id,
                tagName: row.tagName
            };
        },
        confirmDelete() {
            const { id } = this.currentDeleteRow;
            deleteTagInfo({ id }).then(res => {
                if (res.code === 20000) {
                    this.searchTags();
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
        // 搜索标签方法
        searchTags() {
            getTagList(
                {
                    id: this.searchForm.id,
                    tagName: this.searchForm.tagName,
                    category: this.searchForm.category,
                    current: this.pagination.current,
                    pageSize: this.pagination.pageSize,
                    createBy: this.searchForm.createBy
                }).then(response => {
                    if (response.code === 20000) {
                        // 将接口返回的标签数据赋值给tagList用于表格展示
                        this.tagList = response.data.records;
                        // 更新分页数据
                        this.pagination.total = parseInt(response.data.total);
                        this.pagination.current = parseInt(response.data.current);
                        this.pagination.pageSize = parseInt(response.data.size);
                        Message.success('查询成功');
                    } else {
                        Message.error('标签信息查询失败：' + response.message);
                    }
                }).catch((error) => {
                    Message.error('查询失败');
                    console.error('查询失败:', error);
                })
        },
        // 处理每页显示数量改变
        handleSizeChange(val) {
            this.pagination.pageSize = val;
            this.searchTags();
        },
        // 处理当前页码改变
        handleCurrentChange(val) {
            this.pagination.current = val;
            this.searchTags();
        },
        // 重置表单方法
        resetForm() {
            this.$refs.searchFormRef.resetFields();
            this.searchForm.status = null;
            // 重置后重新搜索，显示所有数据（可根据实际需求调整）
            this.searchTags();
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