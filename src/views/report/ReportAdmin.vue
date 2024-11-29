<template>
    <div class="box-card">
        <!-- 搜索区域 -->
        <el-form :inline="true" :model="searchForm" :rules="searchFormRules" class="demo-form-inline"
            ref="searchFormRef">
            <el-form-item label="ID：" prop="id">
                <el-input clearable v-model="searchForm.id" placeholder="请输入ID"></el-input>
            </el-form-item>
            <el-form-item label="被举报或反馈的ID：" prop="reportId">
                <el-input clearable v-model="searchForm.reportId" placeholder="请输入被举报或反馈的ID"></el-input>
            </el-form-item>
            <el-form-item label="备注：" prop="content">
                <el-input clearable v-model="searchForm.content" placeholder="请输入备注"></el-input>
            </el-form-item>
            <el-form-item label="类型：" prop="type">
                <el-select clearable v-model="searchForm.type" placeholder="请选择类型">
                    <el-option label="用户" value="0"></el-option>
                    <el-option label="帖子文章" value="1"></el-option>
                    <el-option label="帖子评论" value="2"></el-option>
                    <el-option label="聊天" value="3"></el-option>
                    <el-option label="队伍" value="4"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态：" prop="status">
                <el-select clearable v-model="searchForm.status" placeholder="请选择状态：">
                    <el-option label="未处理" value="0"></el-option>
                    <el-option label="已处理" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="创建人ID：" prop="createBy">
                <el-input clearable v-model="searchForm.createBy" placeholder="请输入创建人ID"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchTags">搜索</el-button>
                <el-button type="info" @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 数据表格 -->
        <el-table :data="reportList" style="width: 100%">
            <el-table-column prop="id" label="ID" sortable width="170"></el-table-column>
            <el-table-column prop="content" label="备注" width="250"></el-table-column>
            <el-table-column label="类型" width="150">
                <template #default="scope">
                    <el-tag v-if="scope.row.type === 0" type="primary">用户</el-tag>
                    <el-tag v-if="scope.row.type === 1" type="success">帖子文章</el-tag>
                    <el-tag v-if="scope.row.type === 2" type="success">帖子评论</el-tag>
                    <el-tag v-if="scope.row.type === 3" type="success">聊天</el-tag>
                    <el-tag v-if="scope.row.type === 4" type="success">队伍</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="状态" width="150">
                <template #default="scope">
                    <el-tag v-if="scope.row.status === 0" type="primary">未处理</el-tag>
                    <el-tag v-if="scope.row.status === 1" type="success">已处理</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="reportId" label="被举报的Id" width="170"></el-table-column>
            <el-table-column prop="createBy" label="创建人" width="180"></el-table-column>
            <el-table-column prop="updateBy" label="更新人" width="180"></el-table-column>
            <el-table-column prop="createTime" sortable label="创建时间" width="170"></el-table-column>
            <el-table-column prop="updateTime" sortable label="更新时间" width="170"></el-table-column>
            <el-table-column fixed="right" label="操作" min-width="100">
                <template #default="scope">
                    <el-button type="success" plain size="small" @click="handleEdit(scope.$index, scope.row)">
                        修改
                    </el-button>
                    <!-- <el-button
            style="margin-left: 0px"
            size="small"
            type="primary"
            plain
            @click="handleUpdateStatus(scope.$index, scope.row)"
          >
            处理
          </el-button> -->
                    <el-button style="margin-left: 0px" size="small" type="primary" plain
                        @click="handleUpdateStatus(scope.$index, scope.row)">
                        处理
                    </el-button>
                    <el-button style="margin-left: 0px" size="small" type="danger" plain
                        @click="handleDelete(scope.$index, scope.row)">
                        删除
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
        <el-dialog :title="editDialogTitle" :visible.sync="editDialogVisible" width="90%">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
                <el-form-item label="ID：" prop="id">
                    <el-input v-model="editForm.id" placeholder="请输入ID" disabled></el-input>
                </el-form-item>
                <el-form-item label="被举报的Id" prop="reportId">
                    <el-input v-model="editForm.reportId" placeholder="请输入类型对应的ID"></el-input>
                </el-form-item>
                <el-form-item label="备注：" prop="content">
                    <el-input v-model="editForm.content" placeholder="请输入备注"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-radio-group v-model="editForm.type">
                        <el-radio :label="0">用户</el-radio>
                        <el-radio :label="1">帖子文章</el-radio>
                        <el-radio :label="2">帖子评论</el-radio>
                        <el-radio :label="3">聊天</el-radio>
                        <el-radio :label="4">队伍</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="editForm.status">
                        <el-radio :label="0">未处理</el-radio>
                        <el-radio :label="1">已处理</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">修改</el-button>
            </span>
        </el-dialog>
        <!-- 删除确认对话框 -->
        <el-dialog title="确认删除" :visible.sync="deleteDialogVisible" :before-close="handleDeleteDialogClose">
            <div>
                是否确定删除id为（{{
                deleteReport.id
                }}）的举报反馈？<span style="color: red"> 请谨慎操作！！！</span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmDelete">确定</el-button>
            </span>
        </el-dialog>
        <!-- 确认处理状态更新对话框 -->
        <el-dialog title="确认处理" :visible.sync="updateStatusDialogVisible" :before-close="handleUpdateStatusDialogClose">
            <div>
                是否更新确定处理（{{ updateStatusReport.id }}）的举报反馈的结果？
            </div>
            <div>
                当前为
                <span style="color: orange; font-weight: 700">{{
                    updateStatusReport.status === 0 ? "未处理" : "已处理"
                    }}</span>
                状态，确定处理后将更新为
                <span style="color: red; font-weight: 700">{{
                    updateStatusReport.status === 0 ? "已处理" : "未处理"
                    }}</span>
                状态？
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateStatusDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmUpdateStatus">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    deleteReportInfo,
    getReportList,
    updateReportInfo
} from "@/api/report";
import { Message } from "element-ui";

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
            } else if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
                callback(new Error("请输入正确的邮箱地址"));
            } else {
                callback();
            }
        };

        return {
            categoryList: [], // 存储所有分类
            // 删除确认对话框是否可见
            deleteDialogVisible: false,
            updateStatusDialogVisible: false,
            deleteReport: {
                id: "",
            },
            updateStatusReport: {
                id: "",
                status: "",
            },
            // 编辑弹窗是否可见
            editDialogVisible: false,
            // 编辑弹窗标题
            editDialogTitle: "编辑举报反馈信息",
            // 编辑表单数据
            editForm: {
                id: "",
                content: "",
                status: "",
                type: "",
                reportId: "",
            },
            isPasswordRequired: false,
            // 编辑表单校验规则（可根据需要完善）
            editFormRules: {},
            // 搜索表单数据
            searchForm: {
                id: null,
                status: null,
                type: "",
                content: "",
                reportId: "",
                createBy: null,
            },
            // 搜索表单校验规则
            searchFormRules: {
                id: [{ validator: validateId, trigger: "blur" }],
                createBy: [{ validator: validateCreatorId, trigger: "blur" }],
            },
            // 举报反馈列表数据
            reportList: [],
            // 分页数据
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
            },
        };
    },
    created() {
        this.searchTags();
    },
    methods: {
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
                    // 这里调用修改举报反馈信息的接口，假设接口为updateUserInfo
                    updateReportInfo(this.editForm)
                        .then((response) => {
                            if (response.code === 20000) {
                                this.editDialogVisible = false;
                                this.$refs.editFormRef.resetFields();
                                this.searchTags();
                                Message.success("修改成功");
                            } else {
                                Message.error("队伍修改失败：" + response.message);
                            }
                        })
                        .catch((error) => {
                            Message.error("修改失败");
                            console.error("修改失败:", error);
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
            this.deleteReport = {
                id: row.id,
            };
        },
        handleUpdateStatus(index, row) {
            this.updateStatusDialogVisible = true;
            this.currentUpdateStatusRow = row;
            this.updateStatusReport = {
                id: row.id,
                status: row.status,
                type: row.type,
                reportId: row.reportId, 
            };
        },

        confirmDelete() {
            const { id } = this.currentDeleteRow;
            deleteReportInfo({ id })
                .then((res) => {
                    if (res.code === 20000) {
                        this.searchTags();
                        Message.success("删除成功");
                    } else {
                        Message.error("删除失败：" + res.message);
                    }
                })
                .catch((err) => {
                    Message.error("删除失败");
                    console.error("删除失败", err);
                });
            this.deleteDialogVisible = false;
        },
        confirmUpdateStatus() {
            const { id, status, content,type,reportId } = this.currentUpdateStatusRow;
            const trueStatus = status === 0 ? 1 : 0;
            updateReportInfo({ id, status: trueStatus, content,type,reportId })
                .then((res) => {
                    if (res.code === 20000) {
                        this.searchTags();
                        Message.success("更新处理状态成功");
                    } else {
                        Message.error("更新处理状态失败：" + res.message);
                    }
                })
                .catch((err) => {
                    Message.error("更新失败");
                    console.error("更新失败", err);
                });
            this.updateStatusDialogVisible = false;
        },
        handleDeleteDialogClose(done) {
            // 可以在这里进行一些清理操作，如果有需要的话
            done();
        },
        handleUpdateStatusDialogClose(done) {
            // 可以在这里进行一些清理操作，如果有需要的话
            done();
        },
        // 搜索举报反馈方法
        searchTags() {
            getReportList({
                id: this.searchForm.id,
                reportId: this.searchForm.reportId,
                content: this.searchForm.content,
                status: this.searchForm.status,
                type: this.searchForm.type,
                current: this.pagination.current,
                pageSize: this.pagination.pageSize,
                createBy: this.searchForm.createBy,
            })
                .then((response) => {
                    if (response.code === 20000) {
                        // 将接口返回的举报反馈数据赋值给reportList用于表格展示
                        this.reportList = response.data.records;
                        // 更新分页数据
                        this.pagination.total = parseInt(response.data.total);
                        this.pagination.current = parseInt(response.data.current);
                        this.pagination.pageSize = parseInt(response.data.size);
                        Message.success("查询成功");
                    } else {
                        Message.error("举报反馈信息查询失败：" + response.message);
                    }
                })
                .catch((error) => {
                    Message.error("查询失败");
                    console.error("查询失败:", error);
                });
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
        },
    },
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
