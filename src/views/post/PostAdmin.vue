<template>
    <div class="box-card">
        <!-- 搜索区域 -->
        <el-form :inline="true" :model="searchForm" :rules="searchFormRules" class="demo-form-inline"
            ref="searchFormRef">
            <el-form-item label="ID：" prop="id">
                <el-input clearable v-model="searchForm.id" placeholder="请输入ID"></el-input>
            </el-form-item>
            <el-form-item label="帖子标题：" prop="title">
                <el-input clearable v-model="searchForm.title" placeholder="请输入帖子标题"></el-input>
            </el-form-item>
            <el-form-item label="帖子状态：" prop="status">
                <el-select clearable v-model="searchForm.status" placeholder="请选择帖子状态">
                    <el-option label="审核中" value="0"></el-option>
                    <el-option label="审核通过" value="1"></el-option>
                    <el-option label="审核未通过" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="帖子内容：" prop="content">
                <el-input clearable v-model="searchForm.content" placeholder="请输入帖子内容"></el-input>
            </el-form-item>
            <el-form-item label="创建人ID：" prop="createBy">
                <el-input clearable v-model="searchForm.createBy" placeholder="请输入创建人ID"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchPosts">搜索</el-button>
                <el-button type="info" @click="resetForm">重置</el-button>
                <el-tooltip content="状态：审核中=>审核通过，审核通过<=>审核未通过" :disabled="selectedRows.length > 0">
                    <el-button type="danger" @click="batchShenHe" :disabled="selectedRows.length === 0">
                        批量审核
                    </el-button>
                </el-tooltip>
            </el-form-item>
        </el-form>

        <!-- 帖子数据表格 -->
        <el-table @selection-change="handleSelectionChange" :data="postList" style="width: 100%">
            <!-- 选择框列 -->
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" sortable width="170"></el-table-column>
            <el-table-column prop="title" label="帖子标题" width="150"></el-table-column>
            <el-table-column prop="coverImage" label="封面图片" width="78">
                <template slot-scope="scope">
                    <el-image :src="scope.row.coverImage" style="width: 100%; height: 100%"
                        :preview-src-list="[scope.row.coverImage]"></el-image>
                </template>
            </el-table-column>

            <el-table-column prop="content" label="帖子内容" width="300">
                <template slot-scope="scope">
                    {{ scope.row.content === null || scope.row.content === "" ? "暂无" : scope.row.content }}
                </template>
            </el-table-column>
            <el-table-column prop="status" label="帖子状态" width="110">
                <template slot-scope="scope">
                    <span v-if="scope.row.status === null || scope.row.type === ''">无</span>
                    <el-tag type="primary" v-else-if="scope.row.status === 0">审核中</el-tag>
                    <el-tag type="success" v-else-if="scope.row.status === 1">审核通过</el-tag>
                    <el-tag type="warning" v-else-if="scope.row.status === 2">审核未通过</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="praiseNum" sortable label="点赞数" width="90"></el-table-column>
            <el-table-column prop="collectNum" sortable label="收藏数" width="90"></el-table-column>
            <el-table-column prop="commentNum" sortable label="评论数" width="90"></el-table-column>
            <el-table-column prop="createBy" label="创建人" width="80"></el-table-column>
            <el-table-column prop="updateBy" label="更新人" width="80"></el-table-column>
            <el-table-column prop="createTime" sortable label="创建时间" width="100"></el-table-column>
            <el-table-column prop="updateTime" sortable label="更新时间" width="100"></el-table-column>
            <el-table-column fixed="right" label="操作" min-width="100">
                <template #default="scope">
                    <el-button type="success" plain size="small" @click="handleEdit(scope.$index, scope.row)">
                        修改帖子
                    </el-button>
                    <el-button style="margin-left: 0px;" size="small" type="danger" plain
                        @click="handleDelete(scope.$index, scope.row)">
                        删除帖子
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
                <el-form-item label="帖子标题：" prop="title">
                    <el-input v-model="editForm.title" placeholder="请输入帖子标题"></el-input>
                </el-form-item>
                <el-form-item label="帖子内容：" prop="content">
                    <el-input type="textarea" v-model="editForm.content" placeholder="请输入帖子内容" :rows="5">
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
            <div>是否确定删除标题为（{{ deletePost.title }}）的帖子？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmDelete">确定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import { deletePostInfo, getPostList, updatePostInfo, shenHeBatchPostStatus } from '@/api/post';
import { updateUserInfo } from '@/api/user';
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
            selectedRows: [], // 存储选中的行数据
            // 删除确认对话框是否可见
            deleteDialogVisible: false,
            deletePost: {
                id: "",
                title: ""
            },
            // 编辑弹窗是否可见
            editDialogVisible: false,
            // 编辑弹窗标题
            editDialogTitle: '编辑帖子信息',
            // 编辑表单数据
            editForm: {
                id: "",
                userAccount: "",
                title: "",
                
                coverImage: "",
                content: "",
            },
            // 编辑表单校验规则（可根据需要完善）
            editFormRules: {
                userAccount: [],
                title: [],
           
                coverImage: [],
                content: [],
            },
            // 搜索表单数据
            searchForm: {
                id: null,
                status: null,
                userAccount: "",
                title: "",
                content: "",
                createBy: null
            },
            // 搜索表单校验规则
            searchFormRules: {
                id: [
                    { validator: validateId, trigger: "blur" }
                ],
                userAccount: [],
                title: [],
             
                content: [],
                createBy: [
                    { validator: validateCreatorId, trigger: "blur" }
                ]
            },
            // 帖子列表数据
            postList: [],
            // 分页数据
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0
            }
        };
    },
    created() {
        this.searchPosts();
    },
    watch: {
        // 监听选中的行变化
        selectedRows(newSelection) {
            // 根据需要进行其他处理
        }
    },
    methods: {
        // 处理编辑按钮点击事件
        handleEdit(index, row) {
            this.editDialogVisible = true;
            // 将当前行数据赋值给编辑表单
            this.editForm = {
                id: row.id,
                title: row.title,
                content: row.content,
            };
        },
        // 提交编辑
        submitEdit() {
            this.$refs.editFormRef.validate((valid) => {
                if (valid) {
                    // 这里调用修改帖子信息的接口，假设接口为updateUserInfo
                    updatePostInfo(this.editForm).then(response => {
                        if (response.code === 20000) {
                            this.editDialogVisible = false;
                            this.$refs.editFormRef.resetFields();
                            this.searchPosts();
                            Message.success('修改成功');
                        } else {
                            Message.error('帖子信息修改失败：' + response.message);
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
            this.deletePost = {
                id: row.id,
                title: row.title
            };
        },
        confirmDelete() {
            const { id } = this.currentDeleteRow;
            deletePostInfo({ id }).then(res => {
                if (res.code === 20000) {
                    this.searchPosts();
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
        // 搜索帖子方法
        searchPosts() {
            getPostList(
                {
                    id: this.searchForm.id,
                    title: this.searchForm.title,
                    content: this.searchForm.content,
                    status: this.searchForm.status,
                    current: this.pagination.current,
                    pageSize: this.pagination.pageSize,
                    createBy: this.searchForm.createBy
                }).then(response => {
                    if (response.code === 20000) {
                        // 将接口返回的帖子数据赋值给postList用于表格展示
                        this.postList = response.data.records;
                        // 更新分页数据
                        this.pagination.total = parseInt(response.data.total);
                        this.pagination.current = parseInt(response.data.current);
                        this.pagination.pageSize = parseInt(response.data.size);
                        Message.success('查询成功');
                    } else {
                        Message.error('帖子信息查询失败：' + response.message);
                    }
                }).catch((error) => {
                    Message.error('查询失败');
                    console.error('查询失败:', error);
                })
        },
        // 处理每页显示数量改变
        handleSizeChange(val) {
            this.pagination.pageSize = val;
            this.searchPosts();
        },
        // 处理当前页码改变
        handleCurrentChange(val) {
            this.pagination.current = val;
            this.searchPosts();
        },
        // 重置表单方法
        resetForm() {
            this.$refs.searchFormRef.resetFields();
          
            // 重置后重新搜索，显示所有数据（可根据实际需求调整）
            this.searchPosts();
        },
        // 获取选中的行
        handleSelectionChange(val) {
            this.selectedRows = val;
        },
        // 批量审核
        batchShenHe() {
            if (this.selectedRows.length === 0) {
                this.$message.warning('请先选择要审核的内容');
                return;
            }

            // 弹出确认框
            this.$confirm('确定要审核选中的内容吗？', '提示', {
                type: 'warning'
            }).then(() => {
                // 构建删除的 ID 数组
                const idsList = this.selectedRows.map(item => item.id);

                // 调用批量删除 API
                this.tableLoading = true;
                shenHeBatchPostStatus({ ids: idsList })
                    .then(response => {
                        if (response.code === 20000) {
                            this.$message.success('批量审核成功');
                            this.searchPosts();  // 重新加载数据
                        } else {
                            this.$message.error('批量审核失败');
                        }
                    })
                    .catch(error => {
                        this.$message.error('批量审核失败');
                        console.error(error);
                    })
                    .finally(() => {
                        this.tableLoading = false;
                    });
            }).catch(() => {
                this.$message.info('取消审核');
            });
        },
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