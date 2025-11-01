/* eslint-disable no-console */
/**
 * 简化的表单元素操作助手函数
 * 基于 document.execCommand 的轻量级实现
 */

/**
 * 使用 execCommand 插入文本到输入框
 * 这是最有效的方式，适用于大多数场景包括 React/Vue/Angular
 *
 * @param element - HTML input 或 textarea 元素
 * @param value - 要设置的值
 * @returns 是否成功插入
 */
export function insertText(
  element: HTMLInputElement | HTMLTextAreaElement,
  value: string,
): boolean {
  try {
    // 1. 聚焦元素
    element.focus()

    // 2. 选中所有现有内容
    element.select()

    // 3. 清除 React 跟踪器（如果存在）
    const tracker = (element as any)._valueTracker
    if (tracker) {
      tracker.setValue('')
    }

    // 4. 使用 execCommand 插入文本
    const success = document.execCommand('insertText', false, value)

    if (success) {
      // 5. 更新 React 跟踪器（如果存在）
      if (tracker) {
        tracker.setValue(value)
      }
      return true
    }

    return false
  } catch (error) {
    console.error('insertText failed:', error)
    return false
  }
}

/**
 * 设置 textarea 的值
 *
 * @param element - HTML textarea 元素
 * @param value - 要设置的值
 * @param options - 可选配置
 */
export interface SetTextareaOptions {
  /** 是否在插入后聚焦并将光标移到末尾 */
  focusToEnd?: boolean
  /** 是否启用调试日志 */
  debug?: boolean
}

export function setTextareaValue(
  element: HTMLTextAreaElement,
  value: string,
  options: SetTextareaOptions = {},
): void {
  const { focusToEnd = true, debug = false } = options

  if (debug) {
    console.debug(`Setting textarea value: "${value}"`)
  }

  // 尝试 execCommand 插入
  const success = insertText(element, value)

  if (!success) {
    if (debug) {
      console.debug('execCommand failed, using fallback')
    }

    // 降级方案：直接赋值 + 事件触发
    element.value = value
    element.dispatchEvent(new Event('input', { bubbles: true }))
    element.dispatchEvent(new Event('change', { bubbles: true }))
  }

  // 聚焦并定位光标
  if (focusToEnd) {
    element.focus()
    setTimeout(() => {
      element.selectionStart = element.selectionEnd = value.length
    }, 0)
  }

  if (debug) {
    console.debug(`Textarea value set successfully: "${element.value}"`)
  }
}

/**
 * 设置 input 的值
 *
 * @param element - HTML input 元素
 * @param value - 要设置的值
 * @param options - 可选配置
 */
export function setInputValue(
  element: HTMLInputElement,
  value: string,
  options: SetTextareaOptions = {},
): void {
  const { focusToEnd = true, debug = false } = options

  if (debug) {
    console.debug(`Setting input value: "${value}"`)
  }

  // 尝试 execCommand 插入
  const success = insertText(element, value)

  if (!success) {
    if (debug) {
      console.debug('execCommand failed, using fallback')
    }

    // 降级方案：直接赋值 + 事件触发
    element.value = value
    element.dispatchEvent(new Event('input', { bubbles: true }))
    element.dispatchEvent(new Event('change', { bubbles: true }))
  }

  // 聚焦并定位光标
  if (focusToEnd) {
    element.focus()
    setTimeout(() => {
      element.selectionStart = element.selectionEnd = value.length
    }, 0)
  }

  if (debug) {
    console.debug(`Input value set successfully: "${element.value}"`)
  }
}
