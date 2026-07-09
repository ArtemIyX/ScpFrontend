<template>
  <div class="debug-shell">
    <div class="debug-frame debug-frame--fonts">
      <header class="debug-header ui-panel ui-panel--strong">
        <gtext preset="header">Custom component debug</gtext>
        <GText preset="body">
          GText is the first reusable component. It accepts slot text or a `text` prop and can be
          styled with presets.
        </GText>
      </header>

      <main class="font-grid ui-scroll">
        <section class="font-card ui-panel">
          <div class="debug-card-head">
            <div>
              <p class="ui-heading">Slot usage</p>
              <p class="debug-meta">This form is best for rich content that lives inside the tag.</p>
            </div>
          </div>

          <GText preset="title">
            Containment Archive / Архив изоляции / Архів ізоляції
          </GText>
          <GText preset="body">
            Body text stays plain and calm for descriptions, notes, and system messages.
            Это текст для описаний и заметок. Це текст для описів і нотаток.
          </GText>
          <GText preset="caps">Warning / Тревога / Тривога</GText>
          <GText preset="handwrite">
            I left a note near the door. Не входить без допуска. Не заходити без доступу.
          </GText>
        </section>

        <section class="font-card ui-panel">
          <div class="debug-card-head">
            <div>
              <p class="ui-heading">Prop usage</p>
              <p class="debug-meta">This form is useful for plain values and later localization keys.</p>
            </div>
          </div>

          <GText preset="header" text="Facility status, squad list, lobby name, pause heading" />
          <GText
            preset="technical"
            text="message UiEvent {\n  string localized_text_id = 1;\n  string websocket_state = 2;\n  uint32 protocol_version = 3;\n}\n\n// DEBUG: connected | payload_ready | ru-RU"
          />
          <GText
            preset="muted"
            text="This component keeps the API small now so buttons and combo boxes can follow the same pattern later."
          />
        </section>
      </main>
    </div>
  </div>
</template>
