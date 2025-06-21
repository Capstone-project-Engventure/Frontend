// types/grammar-extension.d.ts
import '@tiptap/core'
import type { GrammarError } from './your-extension-path'

declare module '@tiptap/core' {
  interface Commands<ReturnType = any> {
    grammarHighlight: {
      updateGrammarErrors: (newErrors: GrammarError[]) => ReturnType
    }
  }
}
