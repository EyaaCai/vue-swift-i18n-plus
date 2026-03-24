# Change Log

## 0.1.0

- **Rebranding**: Extension renamed to `Vue Swift i18n Plus` (eyaa edition).
- **Support Vue3 and TypeScript(Vue 3 and TypeScript)**: Support TypeScript and Vue 3 script setup internationalization scheme.
- **Core Enhancement**: Optimized `getLocales` and `getCustomSetting` to support live configuration updates without restarting the extension.
- **New Feature**: Added `Generate Split I18n Files` command.
  - Support automatic splitting of flat JSON into directory-based JS/TS modules.
  - **Smart Append Object**: When files already exist, the tool now identifies new keys and appends them to the end of the Export Object, preserving all original comments and formatting.
- **Bug Fixes**: Fixed `safeEval` syntax errors during existing file parsing.
- **Cleanup**: Removed unused dependencies and cleaned up internal utility modules.

---

_Based on the original work of RichieChoo (vue-swift-i18n)._
