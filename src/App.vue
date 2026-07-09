<script setup lang="ts">
const typeRoles = [
  {
    name: 'font-title',
    label: 'Title',
    className: 'type-title',
    sample: 'Containment Archive / Архив изоляции / Архів ізоляції',
    note: 'Used for big section titles, key screens, and dramatic headers.',
  },
  {
    name: 'font-header',
    label: 'Header',
    className: 'type-header',
    sample: 'Facility status, squad list, lobby name, pause heading',
    note: 'Used for page headings, panels, and readable game UI labels.',
  },
  {
    name: 'font-body',
    label: 'Body',
    className: 'type-body',
    sample:
      'Body text stays plain and calm for descriptions, notes, and system messages. Это текст для описаний и заметок. Це текст для описів і нотаток.',
    note: 'Used for descriptions, helper copy, and readable content blocks.',
  },
  {
    name: 'font-caps',
    label: 'CAPS',
    className: 'type-caps',
    sample: 'WARNING / SECURITY BREACH / ALERT / НАСЛЕДИЕ / ПОЖАР / ТРИВОГА',
    note: 'Used for warnings, alerts, danger states, and loud system labels.',
  },
  {
    name: 'font-handwrite',
    label: 'Handwrite',
    className: 'type-handwrite',
    sample: 'I left a note near the door. Не входить без допуска. Не заходити без доступу.',
    note: 'Used for diary lines, scribbles, clues, and personal notes.',
  },
  {
    name: 'font-doc',
    label: 'Document',
    className: 'type-doc',
    sample:
      'Document text for logs, reports, and terminal readouts can lean serif when we want a more archival tone.',
    note: 'Good for documents, reports, intel sheets, and narrative surfaces.',
  },
  {
    name: 'font-technical',
    label: 'Technical / Code',
    className: 'type-technical',
    sample:
      'message UiEvent {\n  string localized_text_id = 1;\n  string websocket_state = 2;\n  uint32 protocol_version = 3;\n}\n\n// DEBUG: connected | payload_ready | ru-RU',
    note: 'Used for code-like text, protocol payloads, IDs, and debug output.',
  },
] as const

const cyrillicSamples = [
  'НАДЗОРНЫЙ ОТЧЁТ / SURVEILLANCE REPORT / ЗВІТ НАГЛЯДУ',
  'Запрос на эвакуацию / Запит на евакуацію / Evacuation request',
  'Комната 04 закрыта / Кімната 04 зачинена / Room 04 locked',
] as const
</script>

<template>
  <div class="ui-shell debug-shell">
    <div class="debug-frame debug-frame--fonts">
      <header class="debug-header ui-panel ui-panel--strong">
        <p class="ui-heading">Font debug</p>
        <p class="ui-copy">
          Typography roles for an SCP horror UI: title, header, body, handwriting, CAPS warnings,
          and code-like technical text.
        </p>
      </header>

      <main class="font-grid ui-scroll">
        <section v-for="role in typeRoles" :key="role.name" class="font-card ui-panel">
          <div class="debug-card-head">
            <div>
              <p class="ui-heading">{{ role.label }}</p>
              <p class="debug-meta">{{ role.note }}</p>
            </div>
            <span class="debug-token">var(--{{ role.name }})</span>
          </div>

          <div class="font-specimen" :class="role.className">
            <p class="font-sample">{{ role.sample }}</p>
          </div>
        </section>

        <section class="font-card ui-panel ui-panel--strong">
          <div class="debug-card-head">
            <div>
              <p class="ui-heading">Cyrillic sample</p>
              <p class="debug-meta">This should help us catch fallback problems at a glance.</p>
            </div>
          </div>

          <div class="cyrillic-grid">
            <p v-for="line in cyrillicSamples" :key="line" class="cyrillic-line">
              {{ line }}
            </p>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>
