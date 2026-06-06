<template>
  <div class="container">
    <Breadcrumb />
    <a-card class="general-card">
      <template #title>
        <div class="header-title">
          {{ $t('soloQol.title') }}
        </div>
      </template>
      <template #extra>
        <a-space>
          <a-button
            type="primary"
            :loading="applyingAll"
            @click="applyAllRecommended"
          >
            {{ $t('soloQol.button.applyAll') }}
          </a-button>
          <a-button :loading="loading" @click="reload">
            {{ $t('soloQol.button.refresh') }}
          </a-button>
        </a-space>
      </template>
      <div class="intro">{{ $t('soloQol.intro') }}</div>

      <a-collapse :default-active-key="sectionKeys" :bordered="false">
        <a-collapse-item
          v-for="section in editableSections"
          :key="section.key"
          :header="$t(section.titleKey)"
        >
          <div v-if="section.noteKey" class="section-note">
            {{ $t(section.noteKey) }}
          </div>
          <a-table
            row-key="code"
            :data="section.items"
            :pagination="false"
            :bordered="{ cell: true }"
            :loading="loading"
          >
            <template #columns>
              <a-table-column
                :title="$t('soloQol.column.code')"
                data-index="code"
                :width="220"
              >
                <template #cell="{ record }">
                  <code>{{ record.code }}</code>
                </template>
              </a-table-column>
              <a-table-column
                :title="$t('soloQol.column.desc')"
                data-index="desc"
                :width="260"
              />
              <a-table-column
                :title="$t('soloQol.column.current')"
                :width="180"
              >
                <template #cell="{ record }">
                  <span v-if="!hasConfig(record.code)" class="missing-value">
                    {{ $t('soloQol.missing') }}
                  </span>
                  <template v-else-if="record.valueType === 'bool'">
                    <a-switch
                      :model-value="currentBool(record.code)"
                      :loading="isRowBusy(record.code)"
                      @change="(v: any) => onSwitchChange(record, v)"
                    />
                  </template>
                  <template v-else-if="record.valueType === 'int'">
                    <div
                      v-if="editingKey === record.code"
                      class="inline-edit-wrap"
                    >
                      <a-input-number
                        v-model="editingValue"
                        :precision="0"
                        size="small"
                      />
                      <a-button
                        type="text"
                        size="mini"
                        :loading="isRowBusy(record.code)"
                        @click="saveInlineEdit(record)"
                      >
                        {{ $t('soloQol.button.save') }}
                      </a-button>
                      <a-button type="text" size="mini" @click="cancelEdit">
                        {{ $t('soloQol.button.cancel') }}
                      </a-button>
                    </div>
                    <div v-else class="inline-edit-wrap">
                      <span>{{ currentValue(record.code) }}</span>
                      <a-button
                        type="text"
                        size="mini"
                        @click="startEdit(record)"
                      >
                        {{ $t('soloQol.button.edit') }}
                      </a-button>
                    </div>
                  </template>
                  <template v-else-if="record.valueType === 'float'">
                    <div
                      v-if="editingKey === record.code"
                      class="inline-edit-wrap"
                    >
                      <a-input-number
                        v-model="editingValue"
                        :step="0.1"
                        :precision="2"
                        size="small"
                      />
                      <a-button
                        type="text"
                        size="mini"
                        :loading="isRowBusy(record.code)"
                        @click="saveInlineEdit(record)"
                      >
                        {{ $t('soloQol.button.save') }}
                      </a-button>
                      <a-button type="text" size="mini" @click="cancelEdit">
                        {{ $t('soloQol.button.cancel') }}
                      </a-button>
                    </div>
                    <div v-else class="inline-edit-wrap">
                      <span>{{ currentValue(record.code) }}</span>
                      <a-button
                        type="text"
                        size="mini"
                        @click="startEdit(record)"
                      >
                        {{ $t('soloQol.button.edit') }}
                      </a-button>
                    </div>
                  </template>
                  <template v-else>
                    <div
                      v-if="editingKey === record.code"
                      class="inline-edit-wrap"
                    >
                      <a-input
                        v-model="editingValue"
                        size="small"
                        :max-length="256"
                      />
                      <a-button
                        type="text"
                        size="mini"
                        :loading="isRowBusy(record.code)"
                        @click="saveInlineEdit(record)"
                      >
                        {{ $t('soloQol.button.save') }}
                      </a-button>
                      <a-button type="text" size="mini" @click="cancelEdit">
                        {{ $t('soloQol.button.cancel') }}
                      </a-button>
                    </div>
                    <div v-else class="inline-edit-wrap">
                      <span>{{ currentValue(record.code) }}</span>
                      <a-button
                        type="text"
                        size="mini"
                        @click="startEdit(record)"
                      >
                        {{ $t('soloQol.button.edit') }}
                      </a-button>
                    </div>
                  </template>
                </template>
              </a-table-column>
              <a-table-column
                :title="$t('soloQol.column.recommended')"
                :width="160"
              >
                <template #cell="{ record }">
                  <span class="recommended-value">
                    {{ displayRecommended(record) }}
                  </span>
                </template>
              </a-table-column>
              <a-table-column
                :title="$t('soloQol.column.operate')"
                :width="140"
              >
                <template #cell="{ record }">
                  <a-button
                    type="text"
                    size="mini"
                    :disabled="
                      !hasConfig(record.code) ||
                      !hasConcreteRecommended(record)
                    "
                    :loading="isRowBusy(record.code)"
                    @click="applyRecommended(record)"
                  >
                    {{ $t('soloQol.button.useRecommended') }}
                  </a-button>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </a-collapse-item>

        <a-collapse-item key="patches" :header="$t('soloQol.section.patches')">
          <ul class="patch-list">
            <li>{{ $t('soloQol.patches.storage') }}</li>
            <li>{{ $t('soloQol.patches.charInv') }}</li>
            <li>{{ $t('soloQol.patches.cashDefault') }}</li>
            <li>{{ $t('soloQol.patches.invMax') }}</li>
            <li>{{ $t('soloQol.patches.attackPetDelay') }}</li>
            <li>{{ $t('soloQol.patches.expedMin') }}</li>
          </ul>
          <div class="section-note">
            {{ $t('soloQol.section.patches.note') }}
          </div>
        </a-collapse-item>
      </a-collapse>
    </a-card>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import {
    ConfigResult,
    getConfigList,
    updateConfig,
  } from '@/api/config';
  import useLoading from '@/hooks/loading';

  type ValueType = 'bool' | 'int' | 'float' | 'string';

  interface QolItem {
    code: string;
    desc: string;
    valueType: ValueType;
    // null => use "keep current" label; 'asNeeded' => use "as needed" label
    recommended: string | number | boolean | null | 'asNeeded';
  }

  interface QolSection {
    key: string;
    titleKey: string;
    noteKey?: string;
    items: QolItem[];
  }

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(false);
  const applyingAll = ref(false);
  const busyRows = ref<Set<string>>(new Set());
  const editingKey = ref<string>('');
  const editingValue = ref<any>('');

  // In-memory map of configCode -> ConfigResult for fast lookup.
  const configMap = ref<Map<string, ConfigResult>>(new Map());

  const editableSections: QolSection[] = [
    {
      key: 'rates',
      titleKey: 'soloQol.section.rates',
      noteKey: 'soloQol.section.rates.note',
      items: [
        {
          code: 'exp_rate',
          desc: '经验倍率（世界级）',
          valueType: 'int',
          recommended: null,
        },
        {
          code: 'meso_rate',
          desc: '金币倍率',
          valueType: 'int',
          recommended: null,
        },
        {
          code: 'drop_rate',
          desc: '掉落倍率',
          valueType: 'int',
          recommended: null,
        },
        {
          code: 'boss_drop_rate',
          desc: 'Boss 掉落倍率',
          valueType: 'int',
          recommended: null,
        },
        {
          code: 'quest_rate',
          desc: '任务奖励倍率',
          valueType: 'int',
          recommended: null,
        },
        {
          code: 'use_quest_rate',
          desc: '启用任务倍率开关',
          valueType: 'bool',
          recommended: true,
        },
        {
          code: 'equip_exp_rate',
          desc: '装备熟练经验倍率',
          valueType: 'int',
          recommended: null,
        },
        {
          code: 'travel_rate',
          desc: '旅行倍率',
          valueType: 'int',
          recommended: null,
        },
        {
          code: 'fishing_rate',
          desc: '钓鱼倍率',
          valueType: 'int',
          recommended: null,
        },
        {
          code: 'party_bonus_exp_rate',
          desc: '组队经验加成',
          valueType: 'float',
          recommended: 1.5,
        },
        {
          code: 'pq_bonus_exp_rate',
          desc: 'PQ 经验加成',
          valueType: 'float',
          recommended: 1.0,
        },
      ],
    },
    {
      key: 'scroll',
      titleKey: 'soloQol.section.scroll',
      items: [
        {
          code: 'use_perfect_scrolling',
          desc: '卷轴失败不消耗卷槽',
          valueType: 'bool',
          recommended: true,
        },
        {
          code: 'use_enhanced_chaos_scroll',
          desc: '混卷不掉属性',
          valueType: 'bool',
          recommended: true,
        },
        {
          code: 'use_perfect_gm_scroll',
          desc: 'GM 卷 100% 成功',
          valueType: 'bool',
          recommended: true,
        },
        {
          code: 'scroll_chance_rolls',
          desc: '多次判定取高',
          valueType: 'int',
          recommended: 2,
        },
        {
          code: 'chaos_scroll_stat_range',
          desc: '混卷属性范围',
          valueType: 'int',
          recommended: 10,
        },
      ],
    },
    {
      key: 'party',
      titleKey: 'soloQol.section.party',
      items: [
        {
          code: 'use_enable_solo_expeditions',
          desc: '远征单人可入',
          valueType: 'bool',
          recommended: true,
        },
        {
          code: 'use_enable_party_level_limit_lift',
          desc: '组队等级差无限制',
          valueType: 'bool',
          recommended: true,
        },
        {
          code: 'use_enable_daily_expeditions',
          desc: '每日远征',
          valueType: 'bool',
          recommended: 'asNeeded',
        },
      ],
    },
    {
      key: 'buff',
      titleKey: 'soloQol.section.buff',
      items: [
        {
          code: 'use_buff_everlasting',
          desc: 'Buff 永久不消失',
          valueType: 'bool',
          recommended: true,
        },
        {
          code: 'use_buff_most_significant',
          desc: 'Buff 槽满时保留最强',
          valueType: 'bool',
          recommended: true,
        },
        {
          code: 'use_chair_extra_heal',
          desc: '椅子额外回血',
          valueType: 'bool',
          recommended: true,
        },
        {
          code: 'use_server_auto_assigner',
          desc: '升级自动加点',
          valueType: 'bool',
          recommended: true,
        },
        {
          code: 'use_auto_assign_secondary_cap',
          desc: '自动加点尊重副属性上限',
          valueType: 'bool',
          recommended: true,
        },
        {
          code: 'use_auto_assign_starters_ap',
          desc: '新手 AP 自动分',
          valueType: 'bool',
          recommended: true,
        },
        {
          code: 'use_server_auto_pot',
          desc: '服务端宠物自动嗑药',
          valueType: 'bool',
          recommended: true,
        },
        {
          code: 'pet_auto_hp_ratio',
          desc: 'HP 触发宠物喂药阈值',
          valueType: 'float',
          recommended: 0.5,
        },
        {
          code: 'pet_auto_mp_ratio',
          desc: 'MP 触发宠物喂药阈值',
          valueType: 'float',
          recommended: 0.5,
        },
      ],
    },
    {
      key: 'multi',
      titleKey: 'soloQol.section.multi',
      items: [
        {
          code: 'deterred_multi_client',
          desc: '阻止同机多开',
          valueType: 'bool',
          recommended: false,
        },
        {
          code: 'trade_limit_meso_max',
          desc: '单笔交易 meso 上限',
          valueType: 'int',
          recommended: 2147483647,
        },
        {
          code: 'trade_limit_meso_under_level',
          desc: '低于此等级禁止交易',
          valueType: 'int',
          recommended: 0,
        },
        {
          code: 'use_joint_cash_shop_inventory',
          desc: '现金商城跨角色共享库存',
          valueType: 'bool',
          recommended: true,
        },
      ],
    },
    {
      key: 'soloQol',
      titleKey: 'soloQol.section.soloQol',
      items: [
        {
          code: 'attack_interval_ms',
          desc: '最小攻击间隔（按住键释放速度）',
          valueType: 'int',
          recommended: 50,
        },
        {
          code: 'pet_pickup_delay_ms',
          desc: '宠物捡取物品延迟',
          valueType: 'int',
          recommended: 100,
        },
      ],
    },
  ];

  const sectionKeys = computed(() => [
    ...editableSections.map((s) => s.key),
    'patches',
  ]);

  const allCodes = computed(() =>
    editableSections.flatMap((s) => s.items.map((i) => i.code))
  );

  const hasConfig = (code: string) => configMap.value.has(code);

  const currentValue = (code: string): string => {
    const cfg = configMap.value.get(code);
    return cfg ? cfg.configValue : '';
  };

  const currentBool = (code: string): boolean => {
    const v = currentValue(code);
    return v === 'true' || v === '1';
  };

  const hasConcreteRecommended = (item: QolItem): boolean => {
    return item.recommended !== null && item.recommended !== 'asNeeded';
  };

  const displayRecommended = (item: QolItem): string => {
    if (item.recommended === null) {
      return t('soloQol.recommended.asCurrent');
    }
    if (item.recommended === 'asNeeded') {
      return t('soloQol.recommended.asNeeded');
    }
    if (typeof item.recommended === 'boolean') {
      return item.recommended ? 'true' : 'false';
    }
    return String(item.recommended);
  };

  const isRowBusy = (code: string) => busyRows.value.has(code);
  const setRowBusy = (code: string, busy: boolean) => {
    const next = new Set(busyRows.value);
    if (busy) next.add(code);
    else next.delete(code);
    busyRows.value = next;
  };

  const reload = async () => {
    setLoading(true);
    try {
      // Fetch a large page covering all relevant keys. The server config list is small.
      const { data } = await getConfigList({
        type: '',
        subType: '',
        filter: '',
        pageNo: 1,
        pageSize: 10000,
      });
      const records: ConfigResult[] = data.records || [];
      const map = new Map<string, ConfigResult>();
      const codeSet = new Set(allCodes.value);
      records.forEach((r) => {
        if (codeSet.has(r.configCode)) {
          map.set(r.configCode, r);
        }
      });
      configMap.value = map;
      Message.success(t('soloQol.message.refreshSuccess'));
    } finally {
      setLoading(false);
    }
  };

  const persistValue = async (
    cfg: ConfigResult,
    newValue: string
  ): Promise<boolean> => {
    setRowBusy(cfg.configCode, true);
    try {
      const payload: ConfigResult = { ...cfg, configValue: newValue };
      await updateConfig(payload);
      const map = new Map(configMap.value);
      map.set(cfg.configCode, payload);
      configMap.value = map;
      return true;
    } catch (e) {
      return false;
    } finally {
      setRowBusy(cfg.configCode, false);
    }
  };

  const onSwitchChange = async (item: QolItem, value: boolean) => {
    const cfg = configMap.value.get(item.code);
    if (!cfg) {
      Message.warning(t('soloQol.message.noConfig'));
      return;
    }
    const ok = await persistValue(cfg, value ? 'true' : 'false');
    if (ok) Message.success(t('soloQol.message.updateSuccess'));
    else Message.error(t('soloQol.message.updateFail'));
  };

  const startEdit = (item: QolItem) => {
    const cfg = configMap.value.get(item.code);
    if (!cfg) {
      Message.warning(t('soloQol.message.noConfig'));
      return;
    }
    editingKey.value = item.code;
    if (item.valueType === 'int') {
      editingValue.value = Number(cfg.configValue) || 0;
    } else if (item.valueType === 'float') {
      editingValue.value = Number(cfg.configValue) || 0;
    } else {
      editingValue.value = cfg.configValue;
    }
  };

  const cancelEdit = () => {
    editingKey.value = '';
    editingValue.value = '';
  };

  const saveInlineEdit = async (item: QolItem) => {
    const cfg = configMap.value.get(item.code);
    if (!cfg) {
      Message.warning(t('soloQol.message.noConfig'));
      return;
    }
    const raw =
      editingValue.value === null || editingValue.value === undefined
        ? ''
        : String(editingValue.value);
    const ok = await persistValue(cfg, raw);
    if (ok) {
      Message.success(t('soloQol.message.updateSuccess'));
      cancelEdit();
    } else {
      Message.error(t('soloQol.message.updateFail'));
    }
  };

  const recommendedToString = (item: QolItem): string | null => {
    if (!hasConcreteRecommended(item)) return null;
    if (typeof item.recommended === 'boolean') {
      return item.recommended ? 'true' : 'false';
    }
    return String(item.recommended);
  };

  const applyRecommended = async (item: QolItem) => {
    const cfg = configMap.value.get(item.code);
    if (!cfg) {
      Message.warning(t('soloQol.message.noConfig'));
      return;
    }
    const target = recommendedToString(item);
    if (target === null) return;
    if (cfg.configValue === target) {
      Message.success(t('soloQol.message.updateSuccess'));
      return;
    }
    const ok = await persistValue(cfg, target);
    if (ok) Message.success(t('soloQol.message.updateSuccess'));
    else Message.error(t('soloQol.message.updateFail'));
  };

  const applyAllRecommended = async () => {
    const targets: { cfg: ConfigResult; value: string }[] = [];
    editableSections.forEach((section) => {
      section.items.forEach((item) => {
        const cfg = configMap.value.get(item.code);
        if (!cfg) return;
        const target = recommendedToString(item);
        if (target === null) return;
        if (cfg.configValue === target) return;
        targets.push({ cfg, value: target });
      });
    });

    if (targets.length === 0) {
      Message.success(
        t('soloQol.message.applyAllSuccess', { count: 0 })
      );
      return;
    }

    applyingAll.value = true;
    const progressId = 'solo-qol-apply-all';
    Message.info({
      id: progressId,
      content: t('soloQol.message.applyAllStart'),
      duration: 0,
    });
    let success = 0;
    let fail = 0;
    try {
      for (let i = 0; i < targets.length; i += 1) {
        const { cfg, value } = targets[i];
        Message.info({
          id: progressId,
          content: t('soloQol.message.applyAllProgress', {
            current: i + 1,
            total: targets.length,
          }),
          duration: 0,
        });
        // Sequential calls to avoid overwhelming the backend.
        // eslint-disable-next-line no-await-in-loop
        const ok = await persistValue(cfg, value);
        if (ok) success += 1;
        else fail += 1;
      }
    } finally {
      Message.clear();
      applyingAll.value = false;
      if (fail === 0) {
        Message.success(
          t('soloQol.message.applyAllSuccess', { count: success })
        );
      } else {
        Message.warning(
          t('soloQol.message.applyAllPartial', { success, fail })
        );
      }
    }
  };

  reload();
</script>

<script lang="ts">
  export default {
    name: 'SoloQol',
  };
</script>

<style scoped lang="less">
  .header-title {
    font-size: 16px;
    font-weight: 500;
  }
  .intro {
    margin-bottom: 12px;
    color: var(--color-text-2);
    font-size: 13px;
  }
  .section-note {
    margin-bottom: 12px;
    padding: 8px 12px;
    background-color: var(--color-fill-2);
    border-radius: 4px;
    color: var(--color-text-2);
    font-size: 12px;
    line-height: 1.6;
  }
  .recommended-value {
    color: var(--color-text-3);
    font-size: 13px;
  }
  .missing-value {
    color: var(--color-text-3);
  }
  .inline-edit-wrap {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .patch-list {
    margin: 0 0 12px 0;
    padding-left: 20px;
    line-height: 1.9;
    color: var(--color-text-1);
    font-size: 13px;
  }
  .patch-list li {
    list-style: disc;
  }
  :deep(.arco-collapse-item-header) {
    font-weight: 500;
  }
</style>
