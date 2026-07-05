<template>
  <div class="create-page">
    <form class="form" @submit.prevent="handleSubmit">
      <div class="form-item">
        <label class="required">工单标题</label>
        <input v-model="form.title" type="text" placeholder="请简要描述故障，例如：电脑无法开机" maxlength="50" />
        <p v-if="errors.title" class="error-text">{{ errors.title }}</p>
      </div>

      <div class="form-item">
        <label class="required">工单分类</label>
        <select v-model="form.category_id">
          <option value="" disabled>请选择工单分类</option>
          <option v-for="opt in formOptions.categories" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
        <p v-if="errors.category_id" class="error-text">{{ errors.category_id }}</p>
      </div>

      <div class="form-item">
        <label class="required">紧急程度</label>
        <div class="priority-group">
          <button
            v-for="opt in formOptions.priorities"
            :key="opt.value"
            type="button"
            class="priority-btn"
            :class="[opt.value, { active: form.priority === opt.value }]"
            @click="form.priority = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
        <p v-if="errors.priority" class="error-text">{{ errors.priority }}</p>
      </div>

      <div class="form-item">
        <label>关联资产</label>
        <div class="device-row">
          <input :value="selectedAssetLabel" type="text" placeholder="选填，可搜索资产编号 / 设备名称" readonly @click="openAssetPicker" />
          <button v-if="form.asset_id" type="button" class="pick-btn" @click="clearAsset">清除</button>
          <button v-else type="button" class="pick-btn" @click="openAssetPicker">选择资产</button>
        </div>
      </div>

      <div class="form-item">
        <label class="required">故障描述</label>
        <textarea
          v-model="form.description"
          rows="4"
          placeholder="请详细描述故障现象"
          maxlength="300"
        ></textarea>
        <p v-if="errors.description" class="error-text">{{ errors.description }}</p>
      </div>

      <div class="form-item">
        <label>故障截图</label>
        <div class="image-list">
          <div v-for="img in images" :key="img.localId" class="image-item">
            <img :src="img.previewUrl" alt="故障截图" />
            <div v-if="img.status === 'uploading'" class="image-mask">上传中...</div>
            <div v-else-if="img.status === 'error'" class="image-mask image-mask-error" @click="retryUpload(img)">
              上传失败<br />点击重试
            </div>
            <button type="button" class="image-remove" @click="removeImage(img)">
              <Icon name="close" />
            </button>
          </div>
          <label v-if="images.length < MAX_IMAGES" class="image-upload">
            <Icon name="camera" />
            <span>上传图片</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              multiple
              class="file-input"
              @change="onFileChange"
            />
          </label>
        </div>
        <p class="hint-text">最多上传{{ MAX_IMAGES }}张图片，单张不超过5MB，支持jpg/png/gif/webp</p>
      </div>
    </form>

    <div class="submit-bar">
      <button class="submit-btn" :disabled="submitDisabled" @click="handleSubmit">
        {{ submitLabel }}
      </button>
    </div>

    <!-- 选择关联资产 弹层 -->
    <div v-if="showAssetPicker" class="asset-overlay" @click.self="showAssetPicker = false">
      <div class="asset-sheet">
        <div class="asset-sheet-title">选择关联资产</div>
        <input
          v-model="assetKeyword"
          class="asset-search"
          type="text"
          placeholder="搜索资产编号 / 设备名称"
          @input="onAssetKeywordChange"
        />
        <div v-if="assetLoading" class="empty-tip">搜索中...</div>
        <div v-else-if="assetOptions.length === 0" class="empty-tip">未找到相关资产</div>
        <div class="asset-item" v-for="asset in assetOptions" :key="asset.id" @click="selectAsset(asset)">
          <div class="asset-no">{{ asset.asset_no }}</div>
          <div class="asset-name">{{ asset.asset_name }}</div>
        </div>
        <button type="button" class="asset-cancel" @click="showAssetPicker = false">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAssetOptions } from '@/api/mobile/asset'
import { createTicket, getFormOptions } from '@/api/mobile/ticket'
import { uploadFile } from '@/api/mobile/file'
import type { AssetOption, TicketCreateForm, TicketFormOptions } from '@/types'
import { showToast } from '@/composables/useToast'
import Icon from '@/components/Icon.vue'

const router = useRouter()

const form = reactive<TicketCreateForm>({
  title: '',
  description: '',
  category_id: '',
  priority: '',
  asset_id: null
})

const formOptions = reactive<TicketFormOptions>({ categories: [], priorities: [] })
const errors = reactive<Partial<Record<keyof TicketCreateForm, string>>>({})
const submitting = ref(false)

interface UploadImage {
  localId: string
  previewUrl: string
  file: File
  status: 'uploading' | 'success' | 'error'
  fileId?: number | string
}

const MAX_IMAGES = 6
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

const images = ref<UploadImage[]>([])
const hasUploadingImage = computed(() => images.value.some(img => img.status === 'uploading'))
const hasFailedImage = computed(() => images.value.some(img => img.status === 'error'))

const submitDisabled = computed(() => submitting.value || hasUploadingImage.value || hasFailedImage.value)
const submitLabel = computed(() => {
  if (submitting.value) return '提交中...'
  if (hasUploadingImage.value) return '图片上传中...'
  if (hasFailedImage.value) return '请处理失败图片'
  return '提交报修'
})

const showAssetPicker = ref(false)
const assetKeyword = ref('')
const assetOptions = ref<AssetOption[]>([])
const assetLoading = ref(false)
const selectedAsset = ref<AssetOption | null>(null)
let assetSearchTimer: ReturnType<typeof setTimeout> | null = null

const selectedAssetLabel = computed(() =>
  selectedAsset.value ? `${selectedAsset.value.asset_no} ${selectedAsset.value.asset_name}` : ''
)

onMounted(async () => {
  try {
    const opts = await getFormOptions()
    formOptions.categories = opts.categories ?? []
    formOptions.priorities = opts.priorities ?? []
  } catch {
    // 错误提示已由 request 拦截器统一展示
  }
})

function validate(): boolean {
  Object.keys(errors).forEach(key => delete errors[key as keyof TicketCreateForm])

  if (!form.title.trim()) errors.title = '请输入工单标题'
  if (!form.category_id) errors.category_id = '请选择工单分类'
  if (!form.priority) errors.priority = '请选择紧急程度'
  if (!form.description.trim()) errors.description = '请输入故障描述'

  return Object.keys(errors).length === 0
}

async function handleSubmit() {
  if (!validate()) return
  if (hasUploadingImage.value) {
    showToast('图片上传中，请稍候')
    return
  }
  if (hasFailedImage.value) {
    showToast('存在上传失败的图片，请删除或重试后再提交')
    return
  }

  submitting.value = true
  try {
    const fileIds = images.value.map(img => img.fileId).filter((id): id is number | string => id !== undefined)
    const ticket = await createTicket({
      title: form.title.trim(),
      description: form.description.trim(),
      category_id: form.category_id,
      priority: form.priority,
      asset_id: form.asset_id || undefined,
      attachment_file_ids: fileIds.length ? fileIds : undefined
    })
    clearImages()
    showToast('报修提交成功')
    setTimeout(() => {
      router.replace(`/mobile/repair/detail/${ticket.id}`)
    }, 900)
  } catch (err) {
    const message = err instanceof Error ? err.message : ''
    if (message.includes('工单创建成功')) {
      // 工单实际已创建成功，仅附件绑定失败（详情见 mobile-api.md），提示已由 request 拦截器展示；
      // 这里拿不到工单 id，且不能引导用户重复提交，故清空表单后跳转到报修列表页
      clearImages()
      resetForm()
      setTimeout(() => {
        router.replace('/mobile/repair/list')
      }, 1500)
    }
    // 其余失败场景保留表单与已上传图片，方便用户重新提交，提示已由 request 拦截器统一展示
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  form.title = ''
  form.description = ''
  form.category_id = ''
  form.priority = ''
  form.asset_id = null
  selectedAsset.value = null
}

function openAssetPicker() {
  showAssetPicker.value = true
  if (assetOptions.value.length === 0) {
    searchAssets()
  }
}

function onAssetKeywordChange() {
  if (assetSearchTimer) clearTimeout(assetSearchTimer)
  assetSearchTimer = setTimeout(searchAssets, 300)
}

async function searchAssets() {
  assetLoading.value = true
  try {
    assetOptions.value = await getAssetOptions(assetKeyword.value.trim() || undefined)
  } catch {
    assetOptions.value = []
  } finally {
    assetLoading.value = false
  }
}

function selectAsset(asset: AssetOption) {
  selectedAsset.value = asset
  form.asset_id = asset.id
  showAssetPicker.value = false
}

function clearAsset() {
  selectedAsset.value = null
  form.asset_id = null
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const files = input.files
  if (!files || files.length === 0) return

  const remain = MAX_IMAGES - images.value.length
  if (remain <= 0) {
    showToast(`最多上传${MAX_IMAGES}张图片`)
    input.value = ''
    return
  }

  Array.from(files)
    .slice(0, remain)
    .forEach(file => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        showToast('只能上传 jpg、png、gif、webp 图片')
        return
      }
      if (file.size > MAX_IMAGE_SIZE) {
        showToast('单张图片不能超过5MB')
        return
      }
      addImage(file)
    })

  // 重置 input value，允许重复选择同一文件
  input.value = ''
}

function addImage(file: File) {
  // 用 reactive() 包一层，确保 startUpload 里对 status/fileId 的修改是通过响应式代理写入的，
  // 否则直接修改这个原始对象的属性不会触发视图更新，图片会一直卡在"上传中"
  const image = reactive<UploadImage>({
    localId: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    previewUrl: URL.createObjectURL(file),
    file,
    status: 'uploading'
  })
  images.value.push(image)
  startUpload(image)
}

async function startUpload(image: UploadImage) {
  image.status = 'uploading'
  try {
    const result = await uploadFile(image.file)
    image.status = 'success'
    image.fileId = result.id
  } catch {
    // 上传失败提示已由 request 拦截器统一展示，这里只标记状态以便用户重试或删除
    image.status = 'error'
  }
}

function retryUpload(image: UploadImage) {
  startUpload(image)
}

function removeImage(image: UploadImage) {
  const idx = images.value.indexOf(image)
  if (idx === -1) return
  URL.revokeObjectURL(image.previewUrl)
  images.value.splice(idx, 1)
}

function clearImages() {
  images.value.forEach(img => URL.revokeObjectURL(img.previewUrl))
  images.value = []
}

onUnmounted(() => {
  images.value.forEach(img => URL.revokeObjectURL(img.previewUrl))
})
</script>

<style scoped>
.create-page {
  padding-bottom: 84px;
}

.form {
  background: #fff;
  margin: 12px;
  border-radius: 10px;
  padding: 4px 14px;
}

.form-item {
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
}

.form-item:last-child {
  border-bottom: none;
}

.form-item label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}

.form-item input[type='text'],
.form-item select {
  width: 100%;
  height: 40px;
  padding: 0 10px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
  background: #fafafa;
}

.form-item textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
  background: #fafafa;
  resize: vertical;
}

.device-row {
  display: flex;
  gap: 8px;
}

.device-row input {
  flex: 1;
}

.pick-btn {
  flex-shrink: 0;
  height: 40px;
  padding: 0 12px;
  border-radius: 6px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 13px;
  white-space: nowrap;
}

.priority-group {
  display: flex;
  gap: 8px;
}

.priority-btn {
  flex: 1;
  height: 40px;
  border-radius: 6px;
  font-size: 14px;
  border: 1px solid var(--color-border);
  background: #fafafa;
  color: var(--color-text-secondary);
}

.priority-btn.active.low {
  background: #f2f3f5;
  color: var(--color-info);
  border-color: var(--color-info);
}

.priority-btn.active.normal {
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.priority-btn.active.high {
  background: #fff3e0;
  color: var(--color-warning);
  border-color: var(--color-warning);
}

.priority-btn.active.urgent {
  background: #fde8e8;
  color: var(--color-danger);
  border-color: var(--color-danger);
}

.error-text {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--color-danger);
}

.hint-text {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-item {
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 6px;
  overflow: hidden;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-size: 11px;
  line-height: 1.4;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.image-mask-error {
  background: rgba(245, 108, 108, 0.75);
  cursor: pointer;
}

.image-remove {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-remove :deep(svg) {
  width: 12px;
  height: 12px;
}

.image-upload {
  width: 72px;
  height: 72px;
  border-radius: 6px;
  border: 1px dashed var(--color-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--color-text-secondary);
  font-size: 11px;
  position: relative;
}

.file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.submit-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  border-top: 1px solid var(--color-border);
  padding: 10px 14px;
  padding-bottom: max(10px, env(safe-area-inset-bottom));
}

.submit-btn {
  width: 100%;
  height: 46px;
  border-radius: 8px;
  background: var(--color-primary);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.submit-btn:disabled {
  opacity: 0.6;
}

.asset-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
  z-index: 200;
}

.asset-sheet {
  width: 100%;
  max-height: 70vh;
  overflow-y: auto;
  background: #fff;
  border-radius: 12px 12px 0 0;
  padding: 16px;
}

.asset-sheet-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: center;
}

.asset-search {
  width: 100%;
  height: 38px;
  padding: 0 10px;
  margin-bottom: 10px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
  background: #fafafa;
}

.asset-item {
  padding: 12px 4px;
  border-bottom: 1px solid var(--color-border);
}

.asset-no {
  font-size: 14px;
  font-weight: 500;
}

.asset-name {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: 2px;
}

.asset-cancel {
  width: 100%;
  height: 44px;
  margin-top: 8px;
  color: var(--color-text-secondary);
  font-size: 15px;
}
</style>
