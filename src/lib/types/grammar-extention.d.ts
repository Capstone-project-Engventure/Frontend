// types/grammar-extension.d.ts
import '@tiptap/core'
import type { GrammarError } from '@/lib/types/submission'

declare module '@tiptap/core' {
  interface Commands<ReturnType = any> {
    grammarHighlight: {
      updateGrammarErrors: (newErrors: GrammarError[]) => ReturnType
    }
  }
}
