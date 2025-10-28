// IT岗位求职记录系统 - JavaScript核心功能实现

// DOM元素引用
const addJobTab = document.getElementById('add-job-tab');
const jobListTab = document.getElementById('job-list-tab');
const addJobSection = document.getElementById('add-job-section');
const jobListSection = document.getElementById('job-list-section');
const addJobForm = document.getElementById('add-job-form');
const editJobForm = document.getElementById('edit-job-form');
const jobTableBody = document.getElementById('job-table-body');
const totalJobsElement = document.getElementById('total-jobs');
const searchInput = document.getElementById('search-input');
const filterExperience = document.getElementById('filter-experience');
const filterEducation = document.getElementById('filter-education');
const resetFilterBtn = document.getElementById('reset-filter-btn');
const exportCsvBtn = document.getElementById('export-csv-btn');
const clearAllBtn = document.getElementById('clear-all-btn');

// 模态框元素
const editModal = document.getElementById('edit-modal');
const deleteModal = document.getElementById('delete-modal');
const detailModal = document.getElementById('detail-modal');
const closeEditModal = document.getElementById('close-edit-modal');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const closeDetailModal = document.getElementById('close-detail-modal');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const jobDetailContent = document.getElementById('job-detail-content');

// 通知元素
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');
const closeNotification = document.getElementById('close-notification');

// 当前操作的岗位ID
let currentJobId = null;

// 初始化数据存储
function initializeStorage() {
  if (!localStorage.getItem('jobRecords')) {
    localStorage.setItem('jobRecords', JSON.stringify([]));
  }
}

// 获取所有岗位记录
function getAllJobs() {
  return JSON.parse(localStorage.getItem('jobRecords') || '[]');
}

// 保存岗位记录
function saveJobs(jobs) {
  localStorage.setItem('jobRecords', JSON.stringify(jobs));
}

// 生成唯一ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 格式化日期
function formatDate(date) {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// 显示通知
function showNotification(message, isError = false) {
  notificationMessage.textContent = message;
  
  // 设置通知样式
  if (isError) {
    notification.classList.remove('bg-green-50', 'border-green-200', 'text-green-800');
    notification.classList.add('bg-red-50', 'border-red-200', 'text-red-800');
  } else {
    notification.classList.remove('bg-red-50', 'border-red-200', 'text-red-800');
    notification.classList.add('bg-green-50', 'border-green-200', 'text-green-800');
  }
  
  // 显示通知
  notification.classList.remove('translate-x-full', 'opacity-0');
  notification.classList.add('translate-x-0', 'opacity-100');
  
  // 3秒后自动隐藏
  setTimeout(hideNotification, 3000);
}

// 隐藏通知
function hideNotification() {
  notification.classList.remove('translate-x-0', 'opacity-100');
  notification.classList.add('translate-x-full', 'opacity-0');
}

// 切换标签页
function setupTabNavigation() {
  addJobTab.addEventListener('click', () => {
    // 激活添加岗位标签
    addJobTab.classList.add('text-primary', 'border-b-2', 'border-primary');
    addJobTab.classList.remove('text-gray-500');
    
    // 取消激活岗位列表标签
    jobListTab.classList.remove('text-primary', 'border-b-2', 'border-primary');
    jobListTab.classList.add('text-gray-500');
    
    // 显示添加岗位部分，隐藏岗位列表部分
    addJobSection.classList.remove('hidden');
    jobListSection.classList.add('hidden');
  });
  
  jobListTab.addEventListener('click', () => {
    // 激活岗位列表标签
    jobListTab.classList.add('text-primary', 'border-b-2', 'border-primary');
    jobListTab.classList.remove('text-gray-500');
    
    // 取消激活添加岗位标签
    addJobTab.classList.remove('text-primary', 'border-b-2', 'border-primary');
    addJobTab.classList.add('text-gray-500');
    
    // 显示岗位列表部分，隐藏添加岗位部分
    jobListSection.classList.remove('hidden');
    addJobSection.classList.add('hidden');
    
    // 刷新岗位列表
    renderJobList();
  });
}

// 添加新岗位
function setupAddJobForm() {
  addJobForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(addJobForm);
    const jobData = {
      id: generateId(),
      companyName: formData.get('companyName'),
      jobTitle: formData.get('jobTitle'),
      salary: formData.get('salary'),
      location: formData.get('location') || '',
      experience: formData.get('experience') || '',
      education: formData.get('education') || '',
      jobDescription: formData.get('jobDescription') || '',
      jobRequirements: formData.get('jobRequirements'),
      notes: formData.get('notes') || '',
      createdAt: new Date().toISOString()
    };
    
    // 获取现有岗位记录
    const jobs = getAllJobs();
    jobs.push(jobData);
    
    // 保存到本地存储
    saveJobs(jobs);
    
    // 重置表单
    addJobForm.reset();
    
    // 显示成功通知
    showNotification('岗位信息添加成功！');
    
    // 切换到岗位列表标签
    jobListTab.click();
  });
}

// 渲染岗位列表
function renderJobList() {
  const jobs = getAllJobs();
  const filteredJobs = filterJobs(jobs);
  
  // 更新总数显示
  totalJobsElement.textContent = jobs.length;
  
  // 清空表格
  jobTableBody.innerHTML = '';
  
  // 如果没有岗位记录，显示空状态
  if (filteredJobs.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = `
      <td colspan="9" class="px-6 py-12 text-center text-gray-500">
        <i class="fa fa-inbox text-4xl mb-3 text-gray-300"></i>
        <p>${searchInput.value || filterExperience.value || filterEducation.value ? '没有找到匹配的岗位记录' : '暂无岗位记录'}</p>
        <p class="text-sm mt-1">${searchInput.value || filterExperience.value || filterEducation.value ? '请尝试调整筛选条件' : '请点击"添加岗位"开始记录您的求职信息'}</p>
      </td>
    `;
    jobTableBody.appendChild(emptyRow);
    return;
  }
  
  // 添加数据行
  filteredJobs.forEach((job, index) => {
    const row = document.createElement('tr');
    row.className = 'hover:bg-gray-50 hover-scale';
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${index + 1}</td>
      <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${job.companyName}</td>
      <td class="px-6 py-4 whitespace-nowrap">${job.jobTitle}</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-600">${job.salary}</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-500">${job.location || '-'}</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-500">${job.experience || '-'}</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-500">${job.education || '-'}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(job.createdAt)}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div class="flex space-x-2">
          <button class="view-btn text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50" data-id="${job.id}">
            <i class="fa fa-eye mr-1"></i>查看
          </button>
          <button class="edit-btn text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50" data-id="${job.id}">
            <i class="fa fa-pencil mr-1"></i>编辑
          </button>
          <button class="delete-btn text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50" data-id="${job.id}">
            <i class="fa fa-trash mr-1"></i>删除
          </button>
        </div>
      </td>
    `;
    jobTableBody.appendChild(row);
  });
  
  // 添加按钮事件监听器
  attachTableButtonListeners();
}

// 筛选岗位
function filterJobs(jobs) {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const experienceFilter = filterExperience.value;
  const educationFilter = filterEducation.value;
  
  return jobs.filter(job => {
    // 搜索条件过滤
    const matchesSearch = !searchTerm || 
      job.companyName.toLowerCase().includes(searchTerm) || 
      job.jobTitle.toLowerCase().includes(searchTerm);
    
    // 经验过滤
    const matchesExperience = !experienceFilter || job.experience === experienceFilter;
    
    // 学历过滤
    const matchesEducation = !educationFilter || job.education === educationFilter;
    
    return matchesSearch && matchesExperience && matchesEducation;
  });
}

// 为表格按钮添加事件监听器
function attachTableButtonListeners() {
  // 查看按钮
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const jobId = e.currentTarget.dataset.id;
      viewJobDetails(jobId);
    });
  });
  
  // 编辑按钮
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const jobId = e.currentTarget.dataset.id;
      editJob(jobId);
    });
  });
  
  // 删除按钮
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const jobId = e.currentTarget.dataset.id;
      confirmDelete(jobId);
    });
  });
}

// 设置筛选功能
function setupFilters() {
  // 搜索输入
  searchInput.addEventListener('input', renderJobList);
  
  // 经验筛选
  filterExperience.addEventListener('change', renderJobList);
  
  // 学历筛选
  filterEducation.addEventListener('change', renderJobList);
  
  // 重置筛选
  resetFilterBtn.addEventListener('click', () => {
    searchInput.value = '';
    filterExperience.value = '';
    filterEducation.value = '';
    renderJobList();
  });
}

// 查看岗位详情
function viewJobDetails(jobId) {
  const jobs = getAllJobs();
  const job = jobs.find(j => j.id === jobId);
  
  if (job) {
    jobDetailContent.innerHTML = `
      <div class="border-b border-gray-200 pb-4 mb-6">
        <h3 class="text-2xl font-bold text-primary">${job.jobTitle}</h3>
        <p class="text-xl text-gray-700 mt-1">${job.companyName}</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <p class="text-sm text-gray-500 mb-1">薪资范围</p>
          <p class="font-medium text-gray-900">${job.salary}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500 mb-1">工作地点</p>
          <p class="font-medium text-gray-900">${job.location || '未填写'}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500 mb-1">工作经验要求</p>
          <p class="font-medium text-gray-900">${job.experience || '未填写'}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500 mb-1">学历要求</p>
          <p class="font-medium text-gray-900">${job.education || '未填写'}</p>
        </div>
      </div>
      
      <div class="mb-6">
        <p class="text-sm text-gray-500 mb-2">岗位描述</p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p>${job.jobDescription || '暂无描述'}</p>
        </div>
      </div>
      
      <div class="mb-6">
        <p class="text-sm text-gray-500 mb-2">岗位要求</p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p>${job.jobRequirements}</p>
        </div>
      </div>
      
      <div class="mb-6">
        <p class="text-sm text-gray-500 mb-2">备注信息</p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p>${job.notes || '暂无备注'}</p>
        </div>
      </div>
      
      <div class="text-sm text-gray-500">
        添加时间: ${formatDate(job.createdAt)}
      </div>
    `;
    
    // 显示详情模态框
    detailModal.classList.remove('hidden');
  }
}

// 编辑岗位
function editJob(jobId) {
  const jobs = getAllJobs();
  const job = jobs.find(j => j.id === jobId);
  
  if (job) {
    currentJobId = jobId;
    
    // 填充表单
    document.getElementById('edit-job-id').value = job.id;
    document.getElementById('edit-company-name').value = job.companyName;
    document.getElementById('edit-job-title').value = job.jobTitle;
    document.getElementById('edit-salary').value = job.salary;
    document.getElementById('edit-location').value = job.location;
    document.getElementById('edit-experience').value = job.experience;
    document.getElementById('edit-education').value = job.education;
    document.getElementById('edit-job-description').value = job.jobDescription;
    document.getElementById('edit-job-requirements').value = job.jobRequirements;
    document.getElementById('edit-notes').value = job.notes;
    
    // 显示编辑模态框
    editModal.classList.remove('hidden');
  }
}

// 确认删除岗位
function confirmDelete(jobId) {
  currentJobId = jobId;
  deleteModal.classList.remove('hidden');
}

// 设置编辑表单
function setupEditForm() {
  editJobForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!currentJobId) return;
    
    const formData = new FormData(editJobForm);
    const jobs = getAllJobs();
    const jobIndex = jobs.findIndex(j => j.id === currentJobId);
    
    if (jobIndex !== -1) {
      jobs[jobIndex] = {
        ...jobs[jobIndex],
        companyName: formData.get('companyName'),
        jobTitle: formData.get('jobTitle'),
        salary: formData.get('salary'),
        location: formData.get('location') || '',
        experience: formData.get('experience') || '',
        education: formData.get('education') || '',
        jobDescription: formData.get('jobDescription') || '',
        jobRequirements: formData.get('jobRequirements'),
        notes: formData.get('notes') || ''
      };
      
      saveJobs(jobs);
      
      // 隐藏模态框
      editModal.classList.add('hidden');
      
      // 刷新列表
      renderJobList();
      
      // 显示成功通知
      showNotification('岗位信息更新成功！');
    }
  });
}

// 设置删除功能
function setupDeleteFunction() {
  confirmDeleteBtn.addEventListener('click', () => {
    if (!currentJobId) return;
    
    const jobs = getAllJobs();
    const filteredJobs = jobs.filter(job => job.id !== currentJobId);
    
    saveJobs(filteredJobs);
    
    // 隐藏删除模态框
    deleteModal.classList.add('hidden');
    
    // 刷新列表
    renderJobList();
    
    // 显示成功通知
    showNotification('岗位记录已删除！');
  });
}

// 设置模态框关闭功能
function setupModalCloseButtons() {
  // 编辑模态框
  closeEditModal.addEventListener('click', () => editModal.classList.add('hidden'));
  cancelEditBtn.addEventListener('click', () => editModal.classList.add('hidden'));
  
  // 详情模态框
  closeDetailModal.addEventListener('click', () => detailModal.classList.add('hidden'));
  
  // 删除模态框
  cancelDeleteBtn.addEventListener('click', () => deleteModal.classList.add('hidden'));
  
  // 点击模态框背景关闭
  window.addEventListener('click', (e) => {
    if (e.target === editModal) editModal.classList.add('hidden');
    if (e.target === detailModal) detailModal.classList.add('hidden');
    if (e.target === deleteModal) deleteModal.classList.add('hidden');
  });
}

// 导出CSV功能
function setupExportFunction() {
  exportCsvBtn.addEventListener('click', () => {
    const jobs = getAllJobs();
    
    if (jobs.length === 0) {
      showNotification('没有数据可以导出！', true);
      return;
    }
    
    // 创建CSV头部
    const headers = ['企业名称', '岗位名称', '薪资范围', '工作地点', '工作经验', '学历要求', '岗位描述', '岗位要求', '备注信息', '添加时间'];
    
    // 创建CSV内容
    let csvContent = headers.join(',') + '\n';
    
    jobs.forEach(job => {
      const row = [
        `"${job.companyName}"`,
        `"${job.jobTitle}"`,
        `"${job.salary}"`,
        `"${job.location}"`,
        `"${job.experience}"`,
        `"${job.education}"`,
        `"${job.jobDescription}"`,
        `"${job.jobRequirements}"`,
        `"${job.notes}"`,
        `"${formatDate(job.createdAt)}"`
      ];
      csvContent += row.join(',') + '\n';
    });
    
    // 创建下载链接
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `IT岗位记录_${new Date().toLocaleDateString('zh-CN')}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    
    // 触发下载
    link.click();
    
    // 清理
    document.body.removeChild(link);
    
    // 显示成功通知
    showNotification('数据导出成功！');
  });
}

// 清空所有数据
function setupClearAllFunction() {
  clearAllBtn.addEventListener('click', () => {
    if (confirm('您确定要清空所有岗位记录吗？此操作无法撤销！')) {
      localStorage.removeItem('jobRecords');
      initializeStorage();
      renderJobList();
      showNotification('所有记录已清空！');
    }
  });
}

// 设置通知关闭按钮
function setupNotificationCloseButton() {
  closeNotification.addEventListener('click', hideNotification);
}

// 添加一些模拟数据
function addMockData() {
  const jobs = getAllJobs();
  
  // 如果没有数据，添加一些模拟数据
  if (jobs.length === 0) {
    const mockJobs = [
      {
        id: generateId(),
        companyName: '字节跳动',
        jobTitle: '前端开发工程师',
        salary: '25k-35k',
        location: '北京/上海/深圳',
        experience: '3-5年',
        education: '本科及以上',
        jobDescription: '负责公司核心产品的Web前端开发，优化用户体验和性能',
        jobRequirements: '1. 扎实的HTML/CSS/JavaScript基础\n2. 熟练使用React等前端框架\n3. 了解Web性能优化\n4. 良好的团队协作能力',
        notes: '大厂，发展前景好，竞争激烈',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: generateId(),
        companyName: '腾讯',
        jobTitle: 'Java后端开发工程师',
        salary: '20k-30k',
        location: '深圳',
        experience: '1-3年',
        education: '本科及以上',
        jobDescription: '负责公司业务系统的后端开发和维护',
        jobRequirements: '1. 熟悉Java语言及Spring生态\n2. 了解分布式系统设计\n3. 熟悉MySQL等数据库\n4. 有良好的编码习惯',
        notes: '福利好，团队氛围佳',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: generateId(),
        companyName: '阿里巴巴',
        jobTitle: '全栈开发工程师',
        salary: '30k-40k',
        location: '杭州',
        experience: '3-5年',
        education: '本科及以上',
        jobDescription: '负责公司电商平台的全栈开发工作',
        jobRequirements: '1. 同时具备前后端开发能力\n2. 熟悉Node.js和React\n3. 了解云计算相关技术\n4. 有大型项目经验优先',
        notes: '技术氛围浓厚，成长空间大',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    saveJobs(mockJobs);
  }
}

// 初始化应用
function initializeApp() {
  initializeStorage();
  setupTabNavigation();
  setupAddJobForm();
  setupEditForm();
  setupDeleteFunction();
  setupModalCloseButtons();
  setupFilters();
  setupExportFunction();
  setupClearAllFunction();
  setupNotificationCloseButton();
  
  // 添加模拟数据
  addMockData();
  
  // 如果在岗位列表标签页，渲染列表
  if (!jobListSection.classList.contains('hidden')) {
    renderJobList();
  }
}

// 启动应用
document.addEventListener('DOMContentLoaded', initializeApp);