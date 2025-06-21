// GrammarHighlight.ts
import { Editor, Extension, RawCommands } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { GrammarError } from "@/lib/types/submission";

const pluginKey = new PluginKey("grammarHighlight");

export const GrammarHighlight = Extension.create({
  name: "grammarHighlight",
  storage: {} as any,
  addOptions() {
    return {
      errors: [] as GrammarError[],
    };
  },

  addStorage() {
    return {
      errors: this.options.errors,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: pluginKey,
        props: {
          decorations: (state) => {
            const { doc } = state;
            const decorations: Decoration[] = [];

            // 👇 Lưu lại `errors` từ this.storage
            const errors: GrammarError[] = this.storage?.errors || [];

            doc.descendants((node, pos) => {
              if (!node.isText) return true;

              errors.forEach((error: any) => {
                const regex = new RegExp(`\\b${error.orig}\\b`, "gi");
								if (error.type != "replace" && error.type != "delete") return;
                let match;
                while ((match = regex.exec(node.text || "")) !== null) {
									const from = match.index + 1
									const to = from + match[0].length

									decorations.push(
										Decoration.inline(from, to, {
											class: 'grammar-error',
											'data-tooltip': error.explanation,
										})
									)
								}

              });

              return true;
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },

  addCommands() {
    return {
      updateGrammarErrors:
        (newErrors: GrammarError[]) =>
        ({ editor }: { editor: Editor }) => {
          this.storage.errors = newErrors;
          editor.view.dispatch(editor.view.state.tr);
          return true;
        },
    } as Partial<RawCommands>;
  },
});
