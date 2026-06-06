export default {
  'soloQol.title': 'Solo QoL Settings',
  'soloQol.intro':
    'Quick toggles and recommended values for solo / LAN players.',

  'soloQol.button.applyAll': 'Apply All Recommended',
  'soloQol.button.refresh': 'Refresh',
  'soloQol.button.useRecommended': 'Use Recommended',
  'soloQol.button.save': 'Save',
  'soloQol.button.edit': 'Edit',
  'soloQol.button.cancel': 'Cancel',

  'soloQol.column.code': 'Config Key',
  'soloQol.column.desc': 'Description',
  'soloQol.column.current': 'Current',
  'soloQol.column.recommended': 'Recommended',
  'soloQol.column.operate': 'Operation',

  'soloQol.section.rates': 'Rates',
  'soloQol.section.rates.note':
    'Final EXP = exp_rate × party_bonus_exp_rate × pq_bonus_exp_rate × (× quest_rate when use_quest_rate=true). Stack multipliers with care.',
  'soloQol.section.scroll': 'Scrolling',
  'soloQol.section.party': 'Party / Expedition',
  'soloQol.section.buff': 'Buff / Automation',
  'soloQol.section.multi': 'Multi-client / Trade',
  'soloQol.section.soloQol': 'Custom Solo QoL',
  'soloQol.section.patches':
    'Applied server-side patches (requires jar rebuild to modify)',
  'soloQol.section.patches.note':
    'These values are hard-coded in Java and already in effect. To change them, update BeiDou-Server source and rebuild the image.',

  'soloQol.recommended.asCurrent': 'Keep current',
  'soloQol.recommended.asNeeded': 'As needed',
  'soloQol.missing': '—',

  'soloQol.message.applyAllStart': 'Applying recommended values...',
  'soloQol.message.applyAllProgress': 'Applying ({current}/{total})',
  'soloQol.message.applyAllSuccess': 'Applied {count} recommended values',
  'soloQol.message.applyAllPartial':
    '{success} applied, {fail} failed',
  'soloQol.message.updateSuccess': 'Updated',
  'soloQol.message.updateFail': 'Update failed',
  'soloQol.message.refreshSuccess': 'Refreshed',
  'soloQol.message.noConfig':
    'Config not found. Please create it in Config management first.',

  'soloQol.patches.storage': 'Storage cap: 48 → 200 (Storage.java)',
  'soloQol.patches.charInv':
    'New character inventory default: 24 → 96 per tab (Character.java)',
  'soloQol.patches.cashDefault': 'CASH tab default: 96 → 200',
  'soloQol.patches.invMax': 'Inventory expansion cap: 96 → 200',
  'soloQol.patches.attackPetDelay':
    'Attack interval & pet pickup delay: now read from game_config (see Solo QoL section above)',
  'soloQol.patches.expedMin':
    'PQ / Boss / Cafe expedition min party size: reduced to 1 (37 event scripts)',
};
