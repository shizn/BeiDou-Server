export default {
  'soloQol.title': '单机 QoL 设置',
  'soloQol.intro': '针对单机 / 局域网玩家的快捷开关与推荐值。',

  'soloQol.button.applyAll': '应用所有推荐值',
  'soloQol.button.refresh': '刷新',
  'soloQol.button.useRecommended': '用推荐值',
  'soloQol.button.save': '保存',
  'soloQol.button.edit': '编辑',
  'soloQol.button.cancel': '取消',

  'soloQol.column.code': '配置项',
  'soloQol.column.desc': '说明',
  'soloQol.column.current': '当前值',
  'soloQol.column.recommended': '推荐值',
  'soloQol.column.operate': '操作',

  'soloQol.section.rates': '倍率（Rates）',
  'soloQol.section.rates.note':
    '最终经验 = exp_rate × party_bonus_exp_rate × pq_bonus_exp_rate × (use_quest_rate=true 时 × quest_rate)。多倍率叠加请谨慎。',
  'soloQol.section.scroll': '卷轴（Scroll）',
  'soloQol.section.party': '组队 / 远征',
  'soloQol.section.buff': 'Buff / 自动化',
  'soloQol.section.multi': '多开 / 交易',
  'soloQol.section.soloQol': '自定义 Solo QoL',
  'soloQol.section.patches': '已应用的服务端补丁（修改需重新构建 jar）',
  'soloQol.section.patches.note':
    '这些项硬编码在 Java 中，目前已生效。要修改需更新 BeiDou-Server 源码并重新构建镜像。',

  'soloQol.recommended.asCurrent': '沿用当前值',
  'soloQol.recommended.asNeeded': '按需',
  'soloQol.missing': '—',

  'soloQol.message.applyAllStart': '开始应用推荐值...',
  'soloQol.message.applyAllProgress': '应用中 ({current}/{total})',
  'soloQol.message.applyAllSuccess': '已应用 {count} 项推荐值',
  'soloQol.message.applyAllPartial': '已应用 {success} 项，{fail} 项失败',
  'soloQol.message.updateSuccess': '更新成功',
  'soloQol.message.updateFail': '更新失败',
  'soloQol.message.refreshSuccess': '刷新完成',
  'soloQol.message.noConfig': '未找到该配置项，请先在参数管理中创建',

  'soloQol.patches.storage': '仓库容量上限：48 → 200（Storage.java）',
  'soloQol.patches.charInv':
    '新角色背包默认：24 → 96（各 Tab，Character.java）',
  'soloQol.patches.cashDefault': 'CASH 默认：96 → 200',
  'soloQol.patches.invMax': '背包扩容上限：96 → 200',
  'soloQol.patches.attackPetDelay':
    '攻击间隔与宠物捡取延迟：已改为读 game_config（见上方 Solo QoL 段）',
  'soloQol.patches.expedMin':
    'PQ / Boss / Cafe 等远征入场最少人数：已改为 1（37 个 event 脚本）',
};
