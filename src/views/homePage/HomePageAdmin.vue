<template>
    <div class="box-card">
        <div style="color: orange;margin-bottom: 10px;">温馨提示：公告只展示最新 1 条，轮播图只展示最新更新的 5 张</div>
        <!-- 公告展示 -->
        <div>
            <el-card class="content-card">
                <h3><span style="color: blue">公告内容：<br/></span>{{ notice }}</h3> <!-- 显示公告内容 -->
            </el-card>
        </div>

        <!-- 轮播图展示 -->
        <el-carousel v-if="carouselImages.length > 0" :interval="5000" arrow="always">
            <el-carousel-item v-for="(image, index) in carouselImages" :key="index">
                <img :src="image" alt="轮播图" />
            </el-carousel-item>
        </el-carousel>

        <!-- 搜索区域 -->
        <el-form :inline="true" :model="searchForm" :rules="searchFormRules" class="demo-form-inline"
            ref="searchFormRef">
            <el-form-item label="ID：" prop="id">
                <el-input clearable v-model="searchForm.id" placeholder="请输入ID"></el-input>
            </el-form-item>
            <el-form-item label="内容：" prop="content">
                <el-input clearable v-model="searchForm.content" placeholder="请输入公告内容"></el-input>
            </el-form-item>
            <el-form-item label="类型：" prop="type">
                <el-select clearable v-model="searchForm.type" placeholder="请选择类型">
                    <el-option label="公告" value="0"></el-option>
                    <el-option label="轮播图" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="创建人ID：" prop="createBy">
                <el-input clearable v-model="searchForm.createBy" placeholder="请输入创建人ID"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchTags">搜索</el-button>
                <el-button type="info" @click="resetForm">重置</el-button>
                <el-button type="success" @click="addContent">添加首页内容</el-button>
                <el-button type="danger" @click="batchDelete" :disabled="selectedRows.length === 0">批量删除</el-button>
            </el-form-item>
        </el-form>

        <!-- 内容数据表格 -->
        <el-table :data="homePageContent" style="width: 100%" ref="tableRef" v-loading="tableLoading"
            @selection-change="handleSelectionChange">
            <!-- 选择框列 -->
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" width="170"></el-table-column>

            <el-table-column prop="content" label="内容" width="350">
                <template slot-scope="scope">
                    <!-- 如果是轮播图 -->
                    <el-image v-if="scope.row.type === 1" :preview-src-list="[scope.row.content]"
                        :src="scope.row.content" alt="轮播图" style="width: 100px; height: auto;" />

                    <!-- 如果是公告 -->
                    <span v-else>{{ scope.row.content }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="type" label="类型" width="80">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.type === 0">公告</el-tag>
                    <el-tag v-else>轮播图</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createBy" label="创建人" width="170"></el-table-column>
            <el-table-column prop="updateBy" label="更新人" width="170"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="170"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="170"></el-table-column>
            <el-table-column fixed="right" label="操作" min-width="100">
                <template #default="scope">
                    <el-button type="success" plain size="small"
                        @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button style="margin-left: 0px;" size="small" type="danger" plain
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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

                <el-form-item label="内容：" prop="content">
                    <!-- 如果是轮播图，展示图片 -->
                    <div v-if="editForm.type === 1">
                        <el-upload class="upload-demo" drag :action="uploadAvatarAction" :headers="uploadHeaders"
                            :data="uploadData" :with-credentials="true" :on-success="handleUploadSuccessEdit"
                            :before-upload="beforeUpload" :show-file-list="false">
                            <el-image :src="editForm.content" alt="轮播图" class="upload-image" />
                            <div class="el-upload__text">拖动图片到此区域，或点击上传</div>
                        </el-upload>
                    </div>

                    <!-- 如果是公告，展示输入框 -->
                    <el-input type="textarea" :rows="5" v-if="editForm.type === 0" v-model="editForm.content"
                        placeholder="输入内容"></el-input>
                </el-form-item>

                <el-form-item label="类型：" prop="type">
                    <el-radio-group v-model="editForm.type">
                        <el-radio :label="0">公告</el-radio>
                        <el-radio :label="1">轮播图</el-radio>
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
            <div>是否确定删除id为（{{ deleteReport.id }}）的内容？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmDelete">确定</el-button>
            </span>
        </el-dialog>
        <!-- 添加弹窗 -->
        <el-dialog :title="addDialogTitle" :visible.sync="addTagDialogVisible" width="80%">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
                <el-form-item label="类型：" prop="type">
                    <el-radio-group v-model="addForm.type">
                        <el-radio :label="0">公告</el-radio>
                        <el-radio :label="1">轮播图</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="内容：" prop="content">
                    <!-- 如果是轮播图，展示图片 -->
                    <div v-if="addForm.type === 1">
                        <el-upload class="upload-demo" drag :action="uploadAvatarAction" :headers="uploadHeaders"
                            :data="uploadData" :with-credentials="true" :on-success="handleUploadSuccessAdd"
                            :before-upload="beforeUpload" :show-file-list="false">
                            <el-image :src="addForm.content" alt="轮播图" class="upload-image" />
                            <div class="el-upload__text">拖动图片到此区域，或点击上传</div>
                        </el-upload>
                    </div>

                    <!-- 如果是公告，展示输入框 -->
                    <el-input v-if="addForm.type === 0" v-model="addForm.content" placeholder="输入内容"></el-input>
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
import { addHomePageContentInfo, deleteBatchHomePageContent, deleteHomePageContent, displayContentInfo, getHomePageContent, updateHomePageContent } from '@/api/homePage';
import { Message } from 'element-ui';
const baseApi = process.env.VUE_APP_BASE_API
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
        return {
            selectedRows: [], // 存储选中的行数据
            tableLoading: false, // 表格加载状态
            // 添加用户弹窗是否可见
            addTagDialogVisible: false,
            addDialogTitle: '添加首页展示内容',
            addForm: {
                content: "",
                type: ""
            },
            addFormRules: {
            },
            uploadHeaders: {},
            uploadData: {
                type: 'home_page_cover'
            },
            uploadAvatarAction: `${baseApi}/api/file/upload`,
            // 编辑表单校验规则（可根据需要完善）
            editFormRules: {
            },
            // 搜索表单校验规则
            searchFormRules: {
                id: [
                    { validator: validateId, trigger: "blur" }
                ],
                type: [
                    { validator: validateId, trigger: "blur" }
                ],
                createBy: [
                    { validator: validateCreatorId, trigger: "blur" }
                ]
            },
            // 搜索表单数据
            searchForm: {
                id: null,
                type: null,
                content: "",
            },
            // 编辑表单数据
            editForm: {
                id: "",
                content: "",
                type: "",
            },
            // 搜索结果
            homePageContent: [],
            // 分页数据
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0
            },
            // 删除确认弹窗
            deleteDialogVisible: false,
            deleteReport: { id: "" },
            // 编辑弹窗
            editDialogVisible: false,
            editDialogTitle: '编辑首页内容',
            carouselImages: [], // 用于存储轮播图的图片链接
            notice: "",
        };
    },
    created() {
        this.searchTags();
    },
    watch: {
        // 监听选中的行变化
        selectedRows(newSelection) {
            // 根据需要进行其他处理
        }
    },
    methods: {
        // 获取选中的行
        handleSelectionChange(val) {
            this.selectedRows = val;
        },

        // 批量删除
        batchDelete() {
            if (this.selectedRows.length === 0) {
                this.$message.warning('请先选择要删除的内容');
                return;
            }

            // 弹出确认框
            this.$confirm('确定要删除选中的内容吗？', '提示', {
                type: 'warning'
            }).then(() => {
                // 构建删除的 ID 数组
                const idsToDelete = this.selectedRows.map(item => item.id);

                // 调用批量删除 API
                this.tableLoading = true;
                deleteBatchHomePageContent({ ids: idsToDelete })
                    .then(response => {
                        if (response.code === 20000) {
                            this.$message.success('批量删除成功');
                            this.searchTags();  // 重新加载数据
                        } else {
                            this.$message.error('批量删除失败');
                        }
                    })
                    .catch(error => {
                        this.$message.error('批量删除失败');
                        console.error(error);
                    })
                    .finally(() => {
                        this.tableLoading = false;
                    });
            }).catch(() => {
                this.$message.info('取消删除');
            });
        },
        submitAdd() {
            this.$refs.addFormRef.validate((valid) => {
                if (valid) {
                    // 这里调用添加用户信息的接口，假设接口为addTagInfo（需要根据实际后端接口来实现）
                    addHomePageContentInfo(this.addForm).then(response => {
                        if (response.code === 20000) {
                            this.addTagDialogVisible = false;
                            this.$refs.addFormRef.resetFields();
                            this.searchTags();
                            Message.success('添加成功');
                        } else {
                            Message.error('添加失败：' + response.message);
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
        addContent() {
            this.addTagDialogVisible = true;
            this.addForm.content = "";
            this.addForm.type = 0;
        },
        getContentInfo() {
            displayContentInfo().then(response => {
                if (response.code === 20000) {
                    // 根据类型提取轮播图数据
                    this.carouselImages = response.data.carousel;
                    this.notice = response.data.notice;
                    // Message.success('查询成功');
                } else {
                    Message.error('查询失败');
                }
            }).catch(err => {
                console.log(err);
                Message.error('获取内容错误', err);
          })  
        },
        beforeUpload(file) {
            // 这里可以进行一些前置校验，比如限制文件类型、大小等
            // const isJPEG = file.type === 'image/jpeg'
            // const isPNG = file.type === 'image/png'
            // const isGIF = file.type === 'image/gif'
            // if (!isJPEG && !isPNG && !isGIF) {
            //   this.$message.error('请上传JPEG、PNG或GIF格式的图片')
            //   return false
            // }
            const isLargerThan1M = file.size > 2 * 1024 * 1024
            if (isLargerThan1M) {
                this.$message.error('图片大小不能超过2M')
                return false
            }
            return true
        },
        handleUploadSuccessEdit(response, file, fileList) {
            // 轮播图上传成功后的回调
            this.editForm.content = response.data;
            Message.success('上传成功')
        },
        handleUploadSuccessAdd(response, file, fileList) {
            // 轮播图上传成功后的回调
            this.addForm.content = response.data;
            Message.success('上传成功')
        },
        handleDeleteDialogClose(done) {
            // 可以在这里进行一些清理操作，如果有需要的话
            done();
        },
        // 获取首页内容
        searchTags() {
            getHomePageContent({
                id: this.searchForm.id,
                type: this.searchForm.type,
                content: this.searchForm.content,
                current: this.pagination.current,
                pageSize: this.pagination.pageSize,
                createBy: this.searchForm.createBy
            }).then(response => {
                if (response.code === 20000) {
                    this.homePageContent = response.data.records;
                    this.pagination.total = parseInt(response.data.total);
                    this.pagination.current = parseInt(response.data.current);
                    this.pagination.pageSize = parseInt(response.data.size);

                    // 根据类型提取轮播图数据
                    // this.carouselImages = this.homePageContent.filter(item => item.type === 1).map(item => item.content);
                    this.getContentInfo();
                    Message.success('查询成功');
                } else {
                    Message.error('查询失败');
                }
            }).catch(error => {
                Message.error('查询失败');
                console.error('查询失败:', error);
            });
        },

        // 处理编辑操作
        handleEdit(index, row) {
            this.editDialogVisible = true;
            this.editForm = { ...row };
        },

        // 提交编辑
        submitEdit() {
            this.$refs.editFormRef.validate((valid) => {
                if (valid) {
                    updateHomePageContent(this.editForm).then(response => {
                        if (response.code === 20000) {
                            this.editDialogVisible = false;
                            this.searchTags();
                            Message.success('修改成功');
                        } else {
                            Message.error('修改失败');
                        }
                    }).catch(error => {
                        Message.error('修改失败');
                        console.error(error);
                    });
                }
            });
        },

        // 处理删除操作
        handleDelete(index, row) {
            this.deleteDialogVisible = true;
            this.deleteReport = { id: row.id };
        },

        // 确认删除
        confirmDelete() {
            deleteHomePageContent({ id: this.deleteReport.id }).then(response => {
                if (response.code === 20000) {
                    this.searchTags();
                    Message.success('删除成功');
                } else {
                    Message.error('删除失败');
                }
            }).catch(error => {
                Message.error('删除失败');
                console.error('删除失败:', error);
            });

            this.deleteDialogVisible = false;
        },

        // 分页处理
        handleSizeChange(val) {
            this.pagination.pageSize = val;
            this.searchTags();
        },

        handleCurrentChange(val) {
            this.pagination.current = val;
            this.searchTags();
        },

        // 重置表单
        resetForm() {
            this.$refs.searchFormRef.resetFields();
            this.searchTags();
        }
    }
};
</script>

<style scoped>
.box-card {
    margin: 20px;
}

.content-card {
    margin-bottom: 10px;
}

.el-carousel img {
    width: 100%;
    height: auto;
}
.demo-form-inline{
    margin-top: 20px;
}
</style>
