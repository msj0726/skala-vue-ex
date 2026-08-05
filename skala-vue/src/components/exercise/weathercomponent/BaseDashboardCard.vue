<template>
  <div class="base-dashboard-card">
    <slot></slot>
  </div>
</template>

<style scoped>
.base-dashboard-card {
  background: rgba(255, 255, 255, 0.9);
  padding: 28px 30px;
  border-radius: 18px;
  margin-bottom: 20px;
  border: 1px solid rgba(229, 237, 242, 0.8);
  box-shadow: 0 8px 26px rgba(35, 81, 112, 0.055);
  backdrop-filter: blur(10px);
}

.base-dashboard-card h3 {
  color: #203e54;
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  letter-spacing: -0.035em;
}
</style>