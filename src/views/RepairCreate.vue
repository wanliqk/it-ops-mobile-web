<template>
  <div class="create-page">
    <form class="form" @submit.prevent="handleSubmit">
      <div class="form-item">
        <label class="required">报修人姓名</label>
        <input v-model="form.reporterName" type="text" placeholder="请输入您的姓名" maxlength="20" />
        <p v-if="errors.reporterName" class="error-text">{{ errors.reporterName }}</p>
      </div>

      <div class="form-item">
        <label class="required">所属部门</label>
        <input v-model="form.department" type="text" placeholder="请输入所属部门" maxlength="30" />
        <p v-if="errors.department" class="error-text">{{ errors.department }}</p>
      </div>

      <div class="form-item">
        <label class="required">联系电话</label>
        <input v-model="form.phone" type="tel" placeholder="请输入手机号" maxlength="11" />
        <p v-if="errors.phone" class="error-text">{{ errors.phone }}</p>
      </div>

      <div class="form-item">
        <label class="required">故障类型</label>
        <select v-model="form.category">
          <option value="" disabled>请选择故障类型</option>
          <option v-for="opt in RepairCategoryOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
        <p v-if="errors.category" class="error-text">{{ errors.category }}</p>
      </div>

      <div class="form-item">
        <label>故障设备</label>
        <div class="device-row">
          <input v-model="form.device" type="text" placeholder="资产编号 / 设备名称（选填）" maxlength="50" />
          <button type="button" class="pick-btn" @click="showAssetPicker = true">选择资产</button>
        </div>
      </div>

      <div class="form-item">
        <label class="required">故障位置</label>
        <input v-model="form.location" type="text" placeholder="例如：3楼研发部 / 1号门店收银台" maxlength="50" />
        <p v-if="errors.location" class="error-text">{{ errors.location }}</p>
      </div>

      <div class="form-item">
        <label class="required">紧急程度</label>
        <div class="priority-group">
          <button
            v-for="opt in RepairPriorityOptions"
            :key="opt.value"
            type="button"
            class="priority-btn"
            :class="[opt.value, { active: form.priority === opt.value }]"
            @click="form.priority = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <div class="form-item">
        <label class="required">故障描述</label>
        <textarea
          v-model="form.description"
          rows="4"
          placeholder="请详细描述故障现象，至少10个字"
          maxlength="300"
        ></textarea>
        <p v-if="errors.description" class="error-text">{{ errors.description }}</p>
      </div>

      <div class="form-item">
        <label>故障截图</label>
        <div class="image-list">
          <div v-for="(img, idx) in form.images" :key="idx" class="image-item">
            <img :src="img" alt="故障截图" />
            <button type="button" class="image-remove" @click="removeImage(idx)">
              <Icon name="close" />
            </button>
          </div>
          <label v-if="form.images.length < 6" class="image-upload">
            <Icon name="camera" />
            <span>上传图片</span>
            <input type="file" accept="image/*" multiple class="file-input" @change="onFileChange" />
          </label>
        </div>
        <p class="hint-text">最多上传6张图片，用于帮助IT人员快速定位问题（占位实现，暂不上传至服务器）</p>
      </div>
    </form>

    <div class="submit-bar">
      <button class="submit-btn" :disabled="submitting" @click="handleSubmit">
        {{ submitting ? '提交中...' : '提交报修' }}
      </button>
    </div>

    <!-- 选择已有资产 弹层（占位实现） -->
    <div v-if="showAssetPicker" class="asset-overlay" @click.self="showAssetPicker = false">
      <div class="asset-sheet">
        <div class="asset-sheet-title">选择已有资产</div>
        <div class="asset-item" v-for="asset in mockAssets" :key="asset.id" @click="selectAsset(asset)">
          <div class="asset-no">{{ asset.assetNo }}</div>
          <div class="asset-name">{{ asset.name }}</div>
        </div>
        <button type="button" class="asset-cancel" @click="showAssetPicker = false">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createRepairOrder } from '@/api'
import { mockAssets } from '@/api/mockDb'
import type { AssetItem, RepairCreateForm } from '@/types'
import { RepairCategoryOptions, RepairPriorityOptions } from '@/types'
import { showToast } from '@/composables/useToast'
import Icon from '@/components/Icon.vue'

const router = useRouter()

const form = reactive<RepairCreateForm>({
  reporterName: '',
  department: '',
  phone: '',
  category: '',
  device: '',
  location: '',
  priority: 'normal',
  description: '',
  images: []
})

const errors = reactive<Partial<Record<keyof RepairCreateForm, string>>>({})
const submitting = ref(false)
const showAssetPicker = ref(false)

function validate(): boolean {
  Object.keys(errors).forEach(key => delete errors[key as keyof RepairCreateForm])

  if (!form.reporterName.trim()) errors.reporterName = '请输入报修人姓名'
  if (!form.department.trim()) errors.department = '请输入所属部门'

  if (!form.phone.trim()) {
    errors.phone = '请输入联系电话'
  } else if (!/^1[3-9]\d{9}$/.test(form.phone.trim())) {
    errors.phone = '请输入正确的手机号格式'
  }

  if (!form.category) errors.category = '请选择故障类型'
  if (!form.location.trim()) errors.location = '请输入故障位置'

  if (!form.description.trim()) {
    errors.description = '请输入故障描述'
  } else if (form.description.trim().length < 10) {
    errors.description = '故障描述至少10个字'
  }

  return Object.keys(errors).length === 0
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  try {
    const order = await createRepairOrder(form)
    showToast(`提交成功，工单编号：${order.orderNo}`)
    setTimeout(() => {
      router.replace('/mobile/repair/list')
    }, 900)
  } catch (e) {
    showToast('提交失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

function selectAsset(asset: AssetItem) {
  form.device = `${asset.assetNo} ${asset.name}`
  showAssetPicker.value = false
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const files = input.files
  if (!files) return
  const remain = 6 - form.images.length
  Array.from(files)
    .slice(0, remain)
    .forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          form.images.push(reader.result)
        }
      }
      reader.readAsDataURL(file)
    })
  input.value = ''
}

function removeImage(idx: number) {
  form.images.splice(idx, 1)
}
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
.form-item input[type='tel'],
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

.priority-btn.active.normal {
  background: #f2f3f5;
  color: var(--color-info);
  border-color: var(--color-info);
}

.priority-btn.active.urgent {
  background: #fff3e0;
  color: var(--color-warning);
  border-color: var(--color-warning);
}

.priority-btn.active.critical {
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
  max-height: 60vh;
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
