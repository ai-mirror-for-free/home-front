<template>
  <div class="floating-icons">
    <a href="https://qm.qq.com/cgi-bin/qm/qr?k=940836490" target="_blank" class="floating-icon" title="加入QQ群">
      <img src="/icon/QQ.svg" alt="QQ" />
    </a>
    <a href="https://shop136448321.taobao.com/" target="_blank" class="floating-icon" title="淘宝店铺">
      <img src="/icon/taobao.svg" alt="淘宝" />
    </a>
  </div>
</template>

<script setup>
</script>

<style scoped>
.floating-icons {
  position: fixed;
  bottom: 80px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 9999;
}

.floating-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.floating-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.floating-icon img {
  width: 28px;
  height: 28px;
  object-fit: contain;
}
</style>
